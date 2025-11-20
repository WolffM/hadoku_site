/**
 * Admin routes for managing contact submissions
 *
 * All routes require admin authentication
 */

import { Hono } from 'hono';
import { ok, badRequest, notFound, serverError } from '@hadoku/worker-utils';
import {
	getAllSubmissions,
	getSubmissionById,
	updateSubmissionStatus,
	deleteSubmission,
	restoreSubmission,
	purgeOldDeletedSubmissions,
	getSubmissionStats,
	getDatabaseSize,
	archiveOldSubmissions,
	addToWhitelist,
	getAllWhitelistedEmails,
	removeFromWhitelist,
	getAppointmentConfig,
	updateAppointmentConfig,
	getAllAppointments,
	getAppointmentById,
	updateAppointmentStatus,
	listEmailTemplates,
	getEmailTemplate,
	upsertEmailTemplate,
	deleteEmailTemplate,
	getTemplateVersionHistory,
} from '../storage';
import { resetRateLimit } from '../rate-limit';
import { createEmailProvider } from '../email';

interface Env {
	DB: D1Database;
	RATE_LIMIT_KV: KVNamespace;
	TEMPLATES_KV: KVNamespace;
	ADMIN_KEYS?: string;
	EMAIL_PROVIDER?: string;
	RESEND_API_KEY?: string;
}

type AppContext = {
	Bindings: Env;
	Variables: {
		authContext?: {
			userType: 'admin' | 'friend' | 'public';
			sessionId: string;
		};
	};
};

/**
 * Middleware to require admin access
 */
function requireAdmin() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return async (c: any, next: any) => {
		const auth = c.get('authContext');

		if (!auth || auth.userType !== 'admin') {
			return c.json(
				{
					success: false,
					error: 'Forbidden',
					message: 'Admin access required',
				},
				403
			);
		}

		await next();
	};
}

export function createAdminRoutes() {
	const app = new Hono<AppContext>();

	// Apply admin middleware to all routes
	app.use('*', requireAdmin());

	/**
	 * GET /admin/submissions
	 * List all submissions with pagination
	 */
	app.get('/submissions', async (c) => {
		try {
			const limit = Number(c.req.query('limit')) || 100;
			const offset = Number(c.req.query('offset')) || 0;

			const submissions = await getAllSubmissions(c.env.DB, limit, offset);
			const stats = await getSubmissionStats(c.env.DB);

			return ok(c, {
				submissions,
				stats,
				pagination: {
					limit,
					offset,
					total: stats.total,
				},
			});
		} catch (error) {
			console.error('Error fetching submissions:', error);
			return serverError(c, 'Failed to fetch submissions');
		}
	});

	/**
	 * GET /admin/submissions/:id
	 * Get a single submission by ID
	 */
	app.get('/submissions/:id', async (c) => {
		try {
			const id = c.req.param('id');
			const submission = await getSubmissionById(c.env.DB, id);

			if (!submission) {
				return notFound(c, 'Submission not found');
			}

			return ok(c, { submission });
		} catch (error) {
			console.error('Error fetching submission:', error);
			return serverError(c, 'Failed to fetch submission');
		}
	});

	/**
	 * PATCH /admin/submissions/:id/status
	 * Update submission status
	 */
	app.patch('/submissions/:id/status', async (c) => {
		try {
			const id = c.req.param('id');
			const body = await c.req.json();

			if (!body.status || !['unread', 'read', 'archived'].includes(body.status)) {
				return badRequest(c, 'Invalid status. Must be: unread, read, or archived');
			}

			const success = await updateSubmissionStatus(c.env.DB, id, body.status);

			if (!success) {
				return notFound(c, 'Submission not found');
			}

			return ok(c, { success: true, message: 'Status updated successfully' });
		} catch (error) {
			console.error('Error updating submission status:', error);
			return serverError(c, 'Failed to update submission status');
		}
	});

	/**
	 * DELETE /admin/submissions/:id
	 * Soft delete a submission (move to trash)
	 */
	app.delete('/submissions/:id', async (c) => {
		try {
			const id = c.req.param('id');

			const success = await deleteSubmission(c.env.DB, id);

			if (!success) {
				return notFound(c, 'Submission not found');
			}

			return ok(c, { success: true, message: 'Submission moved to trash' });
		} catch (error) {
			console.error('Error deleting submission:', error);
			return serverError(c, 'Failed to delete submission');
		}
	});

	/**
	 * POST /admin/submissions/:id/restore
	 * Restore a submission from trash
	 */
	app.post('/submissions/:id/restore', async (c) => {
		try {
			const id = c.req.param('id');

			const success = await restoreSubmission(c.env.DB, id);

			if (!success) {
				return notFound(c, 'Submission not found');
			}

			return ok(c, { success: true, message: 'Submission restored successfully' });
		} catch (error) {
			console.error('Error restoring submission:', error);
			return serverError(c, 'Failed to restore submission');
		}
	});

	/**
	 * POST /admin/purge-deleted
	 * Permanently delete submissions that have been in trash for more than 7 days
	 */
	app.post('/purge-deleted', async (c) => {
		try {
			const purgedCount = await purgeOldDeletedSubmissions(c.env.DB);

			return ok(c, {
				success: true,
				message: `Permanently deleted ${purgedCount} submission(s) from trash`,
				purgedCount,
			});
		} catch (error) {
			console.error('Error purging deleted submissions:', error);
			return serverError(c, 'Failed to purge deleted submissions');
		}
	});

	/**
	 * GET /admin/stats
	 * Get submission statistics
	 */
	app.get('/stats', async (c) => {
		try {
			const stats = await getSubmissionStats(c.env.DB);
			const dbSize = await getDatabaseSize(c.env.DB);

			return ok(c, {
				submissions: stats,
				database: {
					sizeBytes: dbSize.sizeBytes,
					sizeMB: (dbSize.sizeBytes / (1024 * 1024)).toFixed(2),
					percentUsed: dbSize.percentUsed.toFixed(2),
					warning: dbSize.warning,
				},
			});
		} catch (error) {
			console.error('Error fetching stats:', error);
			return serverError(c, 'Failed to fetch statistics');
		}
	});

	/**
	 * POST /admin/archive
	 * Manually trigger archiving of old submissions
	 */
	app.post('/archive', async (c) => {
		try {
			const body = await c.req.json().catch(() => ({}));
			const daysOld = Number(body.daysOld) || 30;

			if (daysOld < 1 || daysOld > 365) {
				return badRequest(c, 'daysOld must be between 1 and 365');
			}

			const archivedCount = await archiveOldSubmissions(c.env.DB, daysOld);

			return ok(c, {
				success: true,
				message: `Archived ${archivedCount} submission(s)`,
				archivedCount,
			});
		} catch (error) {
			console.error('Error archiving submissions:', error);
			return serverError(c, 'Failed to archive submissions');
		}
	});

	/**
	 * POST /admin/rate-limit/reset
	 * Reset rate limit for a specific IP address
	 */
	app.post('/rate-limit/reset', async (c) => {
		try {
			const body = await c.req.json();

			if (!body.ipAddress || typeof body.ipAddress !== 'string') {
				return badRequest(c, 'ipAddress is required');
			}

			await resetRateLimit(c.env.RATE_LIMIT_KV, body.ipAddress);

			return ok(c, {
				success: true,
				message: `Rate limit reset for IP: ${body.ipAddress}`,
			});
		} catch (error) {
			console.error('Error resetting rate limit:', error);
			return serverError(c, 'Failed to reset rate limit');
		}
	});

	/**
	 * POST /admin/send-email
	 * Send an outgoing email via configured email provider
	 */
	app.post('/send-email', async (c) => {
		try {
			const body = await c.req.json();

			// Validate required fields
			if (!body.from || typeof body.from !== 'string') {
				return badRequest(c, 'from field is required');
			}
			if (!body.to || typeof body.to !== 'string') {
				return badRequest(c, 'to field is required');
			}
			if (!body.subject || typeof body.subject !== 'string') {
				return badRequest(c, 'subject field is required');
			}
			if (!body.text || typeof body.text !== 'string') {
				return badRequest(c, 'text field is required');
			}

			// Validate sender is from hadoku.me domain
			const validDomains = ['hadoku.me'];
			const fromDomain = body.from.split('@')[1];
			if (!validDomains.includes(fromDomain)) {
				return badRequest(c, 'from address must be from hadoku.me domain');
			}

			// Basic email validation for recipient
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(body.to)) {
				return badRequest(c, 'Invalid recipient email address');
			}

			// Get email provider (defaults to resend)
			const providerName = c.env.EMAIL_PROVIDER || 'resend';
			const emailProvider = createEmailProvider(providerName, c.env.RESEND_API_KEY);

			// Send email
			const result = await emailProvider.sendEmail({
				from: body.from,
				to: body.to,
				subject: body.subject,
				text: body.text,
				replyTo: body.replyTo,
			});

			if (!result.success) {
				console.error('Email sending failed:', result.error);
				return serverError(c, result.error || 'Failed to send email');
			}

			// Automatically whitelist the recipient email address
			// This allows them to contact us directly in the future, bypassing referrer restrictions
			const auth = c.get('authContext');
			const adminIdentifier = auth?.sessionId || 'admin';

			// Extract contact submission ID if this is a reply (from body.replyTo or body.contactId)
			const contactId = body.contactId || null;

			await addToWhitelist(
				c.env.DB,
				body.to,
				adminIdentifier,
				contactId,
				'Auto-whitelisted after admin reply'
			);

			return ok(c, {
				success: true,
				message: 'Email sent successfully',
				messageId: result.messageId,
				whitelisted: true,
			});
		} catch (error) {
			console.error('Error sending email:', error);
			return serverError(c, 'Failed to send email');
		}
	});

	/**
	 * GET /admin/whitelist
	 * Get all whitelisted email addresses
	 */
	app.get('/whitelist', async (c) => {
		try {
			const emails = await getAllWhitelistedEmails(c.env.DB);

			return ok(c, {
				emails,
				total: emails.length,
			});
		} catch (error) {
			console.error('Error fetching whitelist:', error);
			return serverError(c, 'Failed to fetch whitelist');
		}
	});

	/**
	 * DELETE /admin/whitelist/:email
	 * Remove an email from the whitelist
	 */
	app.delete('/whitelist/:email', async (c) => {
		try {
			const email = c.req.param('email');

			if (!email) {
				return badRequest(c, 'Email parameter is required');
			}

			const success = await removeFromWhitelist(c.env.DB, email);

			if (!success) {
				return notFound(c, 'Email not found in whitelist');
			}

			return ok(c, {
				success: true,
				message: `Email ${email} removed from whitelist`,
			});
		} catch (error) {
			console.error('Error removing from whitelist:', error);
			return serverError(c, 'Failed to remove from whitelist');
		}
	});

	/**
	 * Appointment Configuration Endpoints
	 */

	/**
	 * GET /admin/appointments/config
	 * Get appointment configuration
	 */
	app.get('/appointments/config', async (c) => {
		try {
			const config = await getAppointmentConfig(c.env.DB);

			if (!config) {
				return notFound(c, 'Appointment configuration not found');
			}

			// Parse comma-separated values into arrays for frontend
			return ok(c, {
				config: {
					...config,
					available_days: config.available_days.split(',').map((d) => parseInt(d.trim())),
					slot_duration_options: config.slot_duration_options
						.split(',')
						.map((d) => parseInt(d.trim())),
					meeting_platforms: config.meeting_platforms.split(',').map((p) => p.trim()),
				},
			});
		} catch (error) {
			console.error('Error fetching appointment config:', error);
			return serverError(c, 'Failed to fetch appointment configuration');
		}
	});

	/**
	 * PUT /admin/appointments/config
	 * Update appointment configuration
	 */
	app.put('/appointments/config', async (c) => {
		try {
			const body = await c.req.json();

			// Convert arrays back to comma-separated strings if provided
			const updates: any = { ...body };

			if (Array.isArray(body.available_days)) {
				updates.available_days = body.available_days.join(',');
			}

			if (Array.isArray(body.slot_duration_options)) {
				updates.slot_duration_options = body.slot_duration_options.join(',');
			}

			if (Array.isArray(body.meeting_platforms)) {
				updates.meeting_platforms = body.meeting_platforms.join(',');
			}

			const success = await updateAppointmentConfig(c.env.DB, updates);

			if (!success) {
				return serverError(c, 'Failed to update configuration');
			}

			return ok(c, {
				success: true,
				message: 'Appointment configuration updated successfully',
			});
		} catch (error) {
			console.error('Error updating appointment config:', error);
			return serverError(c, 'Failed to update appointment configuration');
		}
	});

	/**
	 * GET /admin/appointments
	 * Get all appointments
	 */
	app.get('/appointments', async (c) => {
		try {
			const limit = Number(c.req.query('limit')) || 100;
			const offset = Number(c.req.query('offset')) || 0;

			const appointments = await getAllAppointments(c.env.DB, limit, offset);

			return ok(c, {
				appointments,
				pagination: {
					limit,
					offset,
				},
			});
		} catch (error) {
			console.error('Error fetching appointments:', error);
			return serverError(c, 'Failed to fetch appointments');
		}
	});

	/**
	 * GET /admin/appointments/:id
	 * Get a single appointment by ID
	 */
	app.get('/appointments/:id', async (c) => {
		try {
			const id = c.req.param('id');
			const appointment = await getAppointmentById(c.env.DB, id);

			if (!appointment) {
				return notFound(c, 'Appointment not found');
			}

			return ok(c, { appointment });
		} catch (error) {
			console.error('Error fetching appointment:', error);
			return serverError(c, 'Failed to fetch appointment');
		}
	});

	/**
	 * PATCH /admin/appointments/:id/status
	 * Update appointment status
	 */
	app.patch('/appointments/:id/status', async (c) => {
		try {
			const id = c.req.param('id');
			const body = await c.req.json();

			if (
				!body.status ||
				!['confirmed', 'cancelled', 'completed', 'no_show'].includes(body.status)
			) {
				return badRequest(
					c,
					'Invalid status. Must be: confirmed, cancelled, completed, or no_show'
				);
			}

			const success = await updateAppointmentStatus(c.env.DB, id, body.status);

			if (!success) {
				return notFound(c, 'Appointment not found');
			}

			return ok(c, { success: true, message: 'Appointment status updated successfully' });
		} catch (error) {
			console.error('Error updating appointment status:', error);
			return serverError(c, 'Failed to update appointment status');
		}
	});

	/**
	 * GET /admin/templates
	 * List all email templates
	 */
	app.get('/templates', async (c) => {
		try {
			const status = c.req.query('status') as 'active' | 'draft' | 'archived' | undefined;
			const language = c.req.query('language');
			const limit = Number(c.req.query('limit')) || 100;
			const offset = Number(c.req.query('offset')) || 0;

			const templates = await listEmailTemplates(c.env.DB, {
				status,
				language,
				limit,
				offset,
			});

			return ok(c, {
				templates,
				pagination: { limit, offset, total: templates.length },
			});
		} catch (error) {
			console.error('Error fetching templates:', error);
			return serverError(c, 'Failed to fetch templates');
		}
	});

	/**
	 * GET /admin/templates/:id
	 * Get specific template by ID
	 */
	app.get('/templates/:id', async (c) => {
		try {
			const id = c.req.param('id');

			const template = await c.env.DB.prepare(`SELECT * FROM email_templates WHERE id = ?`)
				.bind(id)
				.first();

			if (!template) {
				return notFound(c, 'Template not found');
			}

			return ok(c, { template });
		} catch (error) {
			console.error('Error fetching template:', error);
			return serverError(c, 'Failed to fetch template');
		}
	});

	/**
	 * POST /admin/templates
	 * Create new email template
	 */
	app.post('/templates', async (c) => {
		try {
			const body = await c.req.json();

			// Validate required fields
			if (!body.name || typeof body.name !== 'string') {
				return badRequest(c, 'name field is required');
			}
			if (!body.body || typeof body.body !== 'string') {
				return badRequest(c, 'body field is required');
			}

			const auth = c.get('authContext');
			const changedBy = auth?.sessionId || 'admin';

			const template = await upsertEmailTemplate(
				c.env.DB,
				c.env.TEMPLATES_KV,
				{
					name: body.name,
					type: body.type || 'email',
					subject: body.subject || null,
					body: body.body,
					language: body.language || 'en',
					status: body.status || 'active',
					created_by: changedBy,
					metadata: body.metadata ? JSON.stringify(body.metadata) : null,
				},
				changedBy
			);

			return ok(c, { template, message: 'Template created successfully' });
		} catch (error) {
			console.error('Error creating template:', error);
			return serverError(c, 'Failed to create template');
		}
	});

	/**
	 * PUT /admin/templates/:id
	 * Update existing email template
	 */
	app.put('/templates/:id', async (c) => {
		try {
			const id = c.req.param('id');
			const body = await c.req.json();

			// Check if template exists
			const existing = await c.env.DB.prepare(`SELECT id FROM email_templates WHERE id = ?`)
				.bind(id)
				.first();

			if (!existing) {
				return notFound(c, 'Template not found');
			}

			const auth = c.get('authContext');
			const changedBy = auth?.sessionId || 'admin';

			const template = await upsertEmailTemplate(
				c.env.DB,
				c.env.TEMPLATES_KV,
				{
					id,
					name: body.name,
					type: body.type || 'email',
					subject: body.subject || null,
					body: body.body,
					language: body.language || 'en',
					status: body.status || 'active',
					created_by: changedBy,
					metadata: body.metadata ? JSON.stringify(body.metadata) : null,
				},
				changedBy
			);

			return ok(c, { template, message: 'Template updated successfully' });
		} catch (error) {
			console.error('Error updating template:', error);
			return serverError(c, 'Failed to update template');
		}
	});

	/**
	 * DELETE /admin/templates/:id
	 * Delete (archive) email template
	 */
	app.delete('/templates/:id', async (c) => {
		try {
			const id = c.req.param('id');

			const success = await deleteEmailTemplate(c.env.DB, c.env.TEMPLATES_KV, id);

			if (!success) {
				return notFound(c, 'Template not found');
			}

			return ok(c, { success: true, message: 'Template archived successfully' });
		} catch (error) {
			console.error('Error deleting template:', error);
			return serverError(c, 'Failed to delete template');
		}
	});

	/**
	 * GET /admin/templates/:id/versions
	 * Get template version history
	 */
	app.get('/templates/:id/versions', async (c) => {
		try {
			const id = c.req.param('id');
			const limit = Number(c.req.query('limit')) || 20;

			const versions = await getTemplateVersionHistory(c.env.DB, id, 'email', limit);

			return ok(c, { versions });
		} catch (error) {
			console.error('Error fetching template versions:', error);
			return serverError(c, 'Failed to fetch template versions');
		}
	});

	return app;
}
