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
import { badRequest, serverError } from '@hadoku/worker-utils';
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
import { getEmailTemplate } from '../storage';

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
			let body: any;
			try {
				body = await c.req.json();
			} catch {
				return c.json({ success: false, message: 'Invalid JSON in request body' }, 400);
			}

			// Quick validation check for email field
			const email = body?.email?.trim().toLowerCase();

			// Security Layer 1: Check if email is whitelisted
			// Whitelisted emails bypass referrer restrictions
			const isWhitelisted = email ? await isEmailWhitelisted(db, email) : false;

			// Security Layer 2: Referrer validation (skip if whitelisted)
			if (!isWhitelisted && !validateReferrer(request)) {
				return c.json({ success: false, message: 'Invalid request origin' }, 400);
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
						'X-RateLimit-Limit': '5',
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
			const sanitized = validation.sanitized!;

			// Extract metadata for storage
			const userAgent = request.headers.get('User-Agent');
			const referrer = extractReferrer(request);

			// Store submission in D1
			const submission = await createSubmission(db, {
				name: sanitized.name,
				email: sanitized.email,
				message: sanitized.message,
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

				const appointmentData = appointmentValidation.sanitized!;

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
				const meetingLinkResult = await generateMeetingLink(
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
				const timezone = config?.timezone || 'America/Los_Angeles';

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
					ip_address: ipAddress,
					user_agent: userAgent,
				});

				// Send confirmation email with meeting details
				try {
					const providerName = c.env.EMAIL_PROVIDER || 'resend';
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
						subject = renderTemplate(storedTemplate.subject || '', templateData);
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
						from: 'matthaeus@hadoku.me',
						to: sanitized.email,
						subject,
						text,
						replyTo: 'matthaeus@hadoku.me',
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
					message: 'Your message has been sent successfully!',
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
