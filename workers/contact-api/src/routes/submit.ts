/**
 * Contact form submission endpoint
 *
 * POST /contact/api/submit
 * Public endpoint with security layers:
 * - Rate limiting (5 submissions/hour per IP)
 * - Referrer validation (must be from hadoku.me)
 * - Honeypot spam detection
 * - Field validation and sanitization
 */

import { Hono } from 'hono';
import {
	validateContactSubmission,
	validateAppointment,
	extractClientIP,
	extractReferrer,
	validateReferrer,
} from '../validation';
import {
	createSubmission,
	isEmailWhitelisted,
	addToWhitelist,
	createAppointment,
	isSlotAvailable,
	getAppointmentsByDate,
	getAppointmentConfig,
	getEmailTemplate,
} from '../storage';
import { checkRateLimit, recordSubmission } from '../rate-limit';
import { generateMeetingLink } from '../services/meeting-links';
import { createEmailProvider } from '../email';
import {
	formatAppointmentConfirmation,
	formatAppointmentDateTime,
	renderTemplate,
	prepareAppointmentTemplateData,
} from '../email/templates';
import { EMAIL_CONFIG, APPOINTMENT_CONFIG, RATE_LIMIT_CONFIG } from '../constants';

/**
 * Check if recipient is a public mailbox that bypasses whitelist/referrer checks
 */
function isPublicRecipient(recipient: string | undefined): boolean {
	if (!recipient) return false;
	return EMAIL_CONFIG.PUBLIC_RECIPIENTS.includes(
		recipient.toLowerCase() as (typeof EMAIL_CONFIG.PUBLIC_RECIPIENTS)[number]
	);
}

interface Env {
	DB: D1Database;
	RATE_LIMIT_KV: KVNamespace;
	TEMPLATES_KV: KVNamespace;
	EMAIL_PROVIDER?: string;
	RESEND_API_KEY?: string;
}

export function createSubmitRoutes() {
	const app = new Hono<{ Bindings: Env }>();

	/**
	 * Submit contact form
	 * Public endpoint - no authentication required
	 */
	app.post('/submit', async (c) => {
		const db = c.env.DB;
		const kv = c.env.RATE_LIMIT_KV;
		const request = c.req.raw;

		try {
			// Parse request body early to check email whitelist
			let body: Record<string, unknown>;
			try {
				body = await c.req.json();
			} catch {
				return c.json({ success: false, message: 'Invalid JSON in request body' }, 400);
			}

			// Quick validation check for email field
			const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : undefined;
			const recipient =
				typeof body.recipient === 'string' ? body.recipient.trim().toLowerCase() : undefined;

			// Security Layer 1a: Check if recipient is a public mailbox (bypasses all sender restrictions)
			const isPublicMailbox = isPublicRecipient(recipient);

			// Security Layer 1b: Check if email is whitelisted
			// Whitelisted emails bypass referrer restrictions
			const isWhitelisted = email ? await isEmailWhitelisted(db, email) : false;

			// Security Layer 2: Referrer validation (skip if public mailbox or whitelisted)
			if (!isPublicMailbox && !isWhitelisted && !validateReferrer(request)) {
				return c.json({ success: false, message: 'Invalid referrer' }, 400);
			}

			// Security Layer 3: Extract client IP for rate limiting
			const ipAddress = extractClientIP(request);
			if (!ipAddress) {
				console.error('Could not extract client IP');
				return c.json({ success: false, message: 'Could not identify client' }, 400);
			}

			// Security Layer 4: Rate limiting check
			const rateLimitResult = await checkRateLimit(kv, ipAddress);
			if (!rateLimitResult.allowed) {
				return c.json(
					{
						success: false,
						error: 'Rate limit exceeded',
						message: rateLimitResult.reason,
						retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000),
					},
					429,
					{
						'X-RateLimit-Limit': RATE_LIMIT_CONFIG.MAX_SUBMISSIONS_PER_HOUR.toString(),
						'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
						'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
					}
				);
			}

			// Security Layer 5: Validate and sanitize input (includes honeypot check)
			const validation = validateContactSubmission(body);
			if (!validation.valid) {
				return c.json(
					{
						success: false,
						error: 'Validation failed',
						errors: validation.errors,
					},
					400
				);
			}

			// At this point, validation.sanitized is guaranteed to exist
			const sanitized = validation.sanitized;
			if (!sanitized) {
				return c.json({ success: false, message: 'Validation failed' }, 400);
			}

			// Extract metadata for storage
			const userAgent = request.headers.get('User-Agent');
			const referrer = extractReferrer(request);

			// Store submission in D1
			const submission = await createSubmission(db, {
				name: sanitized.name,
				email: sanitized.email,
				message: sanitized.message,
				recipient: sanitized.recipient,
				ip_address: ipAddress,
				user_agent: userAgent,
				referrer,
			});

			// Record this submission for rate limiting
			await recordSubmission(kv, ipAddress);

			// Auto-whitelist the sender after successful submission
			// This allows them to contact us again without referrer restrictions
			if (!isWhitelisted) {
				await addToWhitelist(
					db,
					sanitized.email,
					'auto-whitelist',
					submission.id,
					'Auto-whitelisted after contact form submission'
				);
			}

			// Check if appointment is included
			if (body.appointment) {
				// Validate appointment data
				const appointmentValidation = validateAppointment(body.appointment);
				if (!appointmentValidation.valid) {
					return c.json(
						{
							success: false,
							error: 'Appointment validation failed',
							errors: appointmentValidation.errors,
						},
						400
					);
				}

				const appointmentData = appointmentValidation.sanitized;
				if (!appointmentData) {
					return c.json(
						{
							success: false,
							error: 'Appointment validation failed',
							errors: ['Invalid appointment data'],
						},
						400
					);
				}

				// Check if slot is still available (atomic check)
				const slotAvailable = await isSlotAvailable(db, appointmentData.slotId);

				if (!slotAvailable) {
					// Slot was taken, fetch updated available slots
					const updatedSlots = await getAppointmentsByDate(db, appointmentData.date);

					return c.json(
						{
							success: false,
							message: 'This time slot was just booked by someone else',
							conflict: {
								reason: 'slot_taken',
								updatedSlots: updatedSlots
									.filter((s) => s.status === 'confirmed')
									.map((s) => ({
										id: s.slot_id,
										startTime: s.start_time,
										endTime: s.end_time,
										available: false,
									})),
							},
						},
						409
					);
				}

				// Generate meeting link
				const meetingLinkResult = generateMeetingLink(
					appointmentData.platform,
					{
						slotId: appointmentData.slotId,
						name: sanitized.name,
						email: sanitized.email,
						startTime: appointmentData.startTime,
						endTime: appointmentData.endTime,
						message: sanitized.message,
					},
					c.env
				);

				// Create appointment in database
				const config = await getAppointmentConfig(db);
				const timezone = config?.timezone ?? APPOINTMENT_CONFIG.DEFAULT_TIMEZONE;

				const appointment = await createAppointment(db, {
					submission_id: submission.id,
					name: sanitized.name,
					email: sanitized.email,
					message: sanitized.message,
					slot_id: appointmentData.slotId,
					date: appointmentData.date,
					start_time: appointmentData.startTime,
					end_time: appointmentData.endTime,
					duration: appointmentData.duration,
					timezone,
					platform: appointmentData.platform,
					meeting_link: meetingLinkResult.success ? meetingLinkResult.meetingLink : undefined,
					meeting_id: meetingLinkResult.success ? meetingLinkResult.meetingId : undefined,
					ip_address: ipAddress ?? undefined,
					user_agent: userAgent ?? undefined,
				});

				// Send confirmation email with meeting details
				try {
					const providerName = c.env.EMAIL_PROVIDER ?? 'resend';
					const emailProvider = createEmailProvider(providerName, c.env.RESEND_API_KEY);

					// Format date and time for email
					const formattedDateTime = formatAppointmentDateTime(
						appointmentData.date,
						appointmentData.startTime,
						appointmentData.endTime,
						timezone
					);

					// Prepare template data
					const templateData = prepareAppointmentTemplateData({
						recipientName: sanitized.name,
						recipientEmail: sanitized.email,
						appointmentDate: formattedDateTime.date,
						startTime: formattedDateTime.startTime,
						endTime: formattedDateTime.endTime,
						timezone,
						duration: appointmentData.duration,
						platform: appointmentData.platform,
						meetingLink: meetingLinkResult.success ? meetingLinkResult.meetingLink : undefined,
						message: sanitized.message,
					});

					// Try to fetch template from storage (hybrid: KV -> D1)
					const storedTemplate = await getEmailTemplate(
						db,
						c.env.TEMPLATES_KV,
						'appointment_confirmation',
						'en'
					);

					let subject: string;
					let text: string;

					if (storedTemplate) {
						// Use stored template with variable substitution
						subject = renderTemplate(storedTemplate.subject ?? '', templateData);
						text = renderTemplate(storedTemplate.body, templateData);
					} else {
						// Fallback to hardcoded template
						const emailContent = formatAppointmentConfirmation({
							recipientName: sanitized.name,
							recipientEmail: sanitized.email,
							appointmentDate: formattedDateTime.date,
							startTime: formattedDateTime.startTime,
							endTime: formattedDateTime.endTime,
							timezone,
							duration: appointmentData.duration,
							platform: appointmentData.platform,
							meetingLink: meetingLinkResult.success ? meetingLinkResult.meetingLink : undefined,
							message: sanitized.message,
						});
						subject = emailContent.subject;
						text = emailContent.text;
					}

					// Send confirmation email
					const emailResult = await emailProvider.sendEmail({
						from: EMAIL_CONFIG.DEFAULT_FROM,
						to: sanitized.email,
						subject,
						text,
						replyTo: EMAIL_CONFIG.DEFAULT_REPLY_TO,
					});

					if (!emailResult.success) {
						console.error('Failed to send appointment confirmation email:', emailResult.error);
						// Don't fail the request - appointment was still created
					} else {
						console.log(
							`Appointment confirmation email sent to ${sanitized.email} (${emailResult.messageId})`
						);
					}
				} catch (emailError) {
					console.error('Error sending appointment confirmation email:', emailError);
					// Don't fail the request - appointment was still created
				}

				// Success response with appointment
				return c.json(
					{
						success: true,
						id: submission.id,
						appointmentId: appointment.id,
						message: 'Your message has been sent and appointment booked!',
						meetingLink: meetingLinkResult.success ? meetingLinkResult.meetingLink : undefined,
					},
					201
				);
			}

			// Success response - simple format for contact form without appointment
			return c.json(
				{
					success: true,
					id: submission.id,
					message: 'Message submitted successfully',
				},
				201
			);
		} catch (error) {
			console.error('Error processing contact submission:', error);
			return c.json({ success: false, message: 'Failed to process submission' }, 500);
		}
	});

	return app;
}
