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
	getSubmissionStats,
	getDatabaseSize,
	archiveOldSubmissions,
} from '../storage';
import { resetRateLimit } from '../rate-limit';

interface Env {
	DB: D1Database;
	RATE_LIMIT_KV: KVNamespace;
	ADMIN_KEYS?: string;
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
	 * Delete a submission permanently
	 */
	app.delete('/submissions/:id', async (c) => {
		try {
			const id = c.req.param('id');

			const success = await deleteSubmission(c.env.DB, id);

			if (!success) {
				return notFound(c, 'Submission not found');
			}

			return ok(c, { success: true, message: 'Submission deleted successfully' });
		} catch (error) {
			console.error('Error deleting submission:', error);
			return serverError(c, 'Failed to delete submission');
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

	return app;
}
