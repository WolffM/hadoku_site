/**
 * Inbound email webhook for receiving emails via Resend
 *
 * This endpoint receives webhooks from Resend when emails arrive at your domain.
 * It checks if the sender is whitelisted, and if so, creates a contact submission.
 *
 * Flow:
 * 1. Receive email.received webhook with email metadata
 * 2. Fetch full email content from Resend API
 * 3. Check if sender is whitelisted
 * 4. If whitelisted, create contact submission
 */

import { Hono } from 'hono';
import { ok, badRequest } from '@hadoku/worker-utils';
import { isEmailWhitelisted, createSubmission } from '../storage';

interface Env {
	DB: D1Database;
	RATE_LIMIT_KV: KVNamespace;
	RESEND_WEBHOOK_SECRET?: string;
	RESEND_API_KEY?: string;
}

/**
 * Resend webhook event structure
 * See: https://resend.com/docs/dashboard/receiving/introduction
 */
interface ResendWebhookEvent {
	type: 'email.received';
	created_at: string;
	data: {
		email_id: string;
		from: string;
		to: string[];
		subject: string;
		// Note: Body, headers, and attachments are NOT included in webhook
		// Must fetch separately via API
	};
}

/**
 * Full email details from Resend API
 */
interface ResendEmailDetails {
	id: string;
	from: string;
	to: string[];
	subject: string;
	html?: string;
	text?: string;
	created_at: string;
}

export function createInboundRoutes() {
	const app = new Hono<{ Bindings: Env }>();

	/**
	 * POST /inbound
	 * Webhook endpoint for receiving emails from Resend
	 *
	 * Resend sends email.received events when emails arrive.
	 * We check if the sender is whitelisted before accepting.
	 */
	app.post('/inbound', async (c) => {
		const db = c.env.DB;
		const request = c.req.raw;

		try {
			// Verify webhook signature if secret is configured
			const webhookSecret = c.env.RESEND_WEBHOOK_SECRET;
			if (webhookSecret) {
				const signature = request.headers.get('svix-signature');
				if (!signature) {
					console.warn('Missing webhook signature');
					return badRequest(c, 'Missing webhook signature');
				}
				// TODO: Verify signature using Svix library
				// For now, we'll trust the request if the secret is set
			}

			// Parse the webhook event
			const event = await c.req.json<ResendWebhookEvent>();

			// Verify this is an email.received event
			if (event.type !== 'email.received') {
				console.log(`Ignoring webhook event type: ${event.type}`);
				return ok(c, {
					success: false,
					message: 'Not an email.received event',
					processed: false,
				});
			}

			const emailId = event.data.email_id;
			console.log(`Received email.received webhook for: ${emailId}`);

			// Extract sender email (normalize to lowercase)
			const senderEmail = event.data.from?.toLowerCase();
			if (!senderEmail) {
				console.warn('Inbound email missing sender address');
				return badRequest(c, 'Invalid email format');
			}

			// Extract the actual email address from "Name <email@example.com>" format
			const emailMatch = senderEmail.match(/<(.+)>/);
			const cleanEmail = emailMatch ? emailMatch[1] : senderEmail;

			console.log(`Email from: ${cleanEmail}`);

			// Check if sender is whitelisted
			const isWhitelisted = await isEmailWhitelisted(db, cleanEmail);

			if (!isWhitelisted) {
				console.log(`Rejecting email from non-whitelisted sender: ${cleanEmail}`);

				// Return 200 but don't process - we don't want Resend to retry
				return ok(c, {
					success: false,
					message: 'Sender not whitelisted',
					processed: false,
				});
			}

			console.log(`Sender is whitelisted, fetching full email content...`);

			// Fetch full email details from Resend API
			const resendApiKey = c.env.RESEND_API_KEY;
			if (!resendApiKey) {
				console.error('RESEND_API_KEY not configured');
				return ok(c, {
					success: false,
					message: 'Email service not configured',
					processed: false,
				});
			}

			// Fetch email content from Resend
			const emailResponse = await fetch(`https://api.resend.com/emails/${emailId}`, {
				headers: {
					Authorization: `Bearer ${resendApiKey}`,
				},
			});

			if (!emailResponse.ok) {
				console.error(`Failed to fetch email from Resend: ${emailResponse.status}`);
				return ok(c, {
					success: false,
					message: 'Failed to retrieve email content',
					processed: false,
				});
			}

			const emailDetails = await emailResponse.json<ResendEmailDetails>();

			// Extract message content (prefer text, fallback to HTML)
			const message = emailDetails.text || emailDetails.html || '(No message body)';

			// Extract the recipient email from the webhook data
			const recipient = event.data.to?.[0] || null;

			// Create a contact submission from the inbound email
			const submission = await createSubmission(db, {
				name: cleanEmail.split('@')[0], // Use email username as name
				email: cleanEmail,
				message: `Subject: ${event.data.subject}\n\n${message}`,
				ip_address: null, // No IP for inbound emails
				user_agent: 'Resend Inbound Email',
				referrer: null, // No referrer for inbound emails
				recipient, // Set the recipient so it shows up in the correct inbox
			});

			console.log(`Created submission ${submission.id} from inbound email ${emailId}`);

			return ok(c, {
				success: true,
				message: 'Email processed successfully',
				submissionId: submission.id,
				emailId,
				processed: true,
			});
		} catch (error) {
			console.error('Error processing inbound email:', error);

			// Return 200 to prevent Resend from retrying
			// Log the error but don't expose details to webhook
			return ok(c, {
				success: false,
				message: 'Internal error processing email',
				processed: false,
			});
		}
	});

	return app;
}
