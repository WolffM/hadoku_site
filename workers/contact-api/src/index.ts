/**
 * Contact API Worker
 *
 * Handles contact form submissions with security layers:
 * - CORS from hadoku.me only
 * - Rate limiting (5 submissions/hour per IP)
 * - Referrer validation
 * - Honeypot spam detection
 * - Field validation and sanitization
 * - Auto-archiving of old submissions (30+ days)
 */

import { Hono } from 'hono';
import {
	createAuthMiddleware,
	parseKeysFromEnv,
	createCorsMiddleware,
	DEFAULT_HADOKU_ORIGINS,
} from '@hadoku/worker-utils';
import { createSubmitRoutes } from './routes/submit';
import { createAdminRoutes } from './routes/admin';
import { createInboundRoutes } from './routes/inbound';
import { createAppointmentsRoutes } from './routes/appointments';
import { archiveOldSubmissions, getDatabaseSize, purgeOldDeletedSubmissions } from './storage';
import { RETENTION_CONFIG } from './constants';
import { logDbCapacity, logArchive, logTrashPurge, logScheduledRun } from './telemetry';

interface Env {
	DB: D1Database;
	RATE_LIMIT_KV: KVNamespace;
	TEMPLATES_KV: KVNamespace;
	ANALYTICS_ENGINE?: AnalyticsEngineDataset;
	ADMIN_KEYS?: string;
	FRIEND_KEYS?: string;
	EMAIL_PROVIDER?: string;
	RESEND_API_KEY?: string;
}

interface AppContext {
	Bindings: Env;
	Variables: {
		authContext: {
			userType: 'admin' | 'friend' | 'public';
			sessionId: string;
		};
	};
}

const app = new Hono<AppContext>();

// ============================================================================
// Middleware Stack
// ============================================================================

// 1. CORS Middleware - Only allow hadoku.me origins
app.use(
	'*',
	createCorsMiddleware({
		origins: DEFAULT_HADOKU_ORIGINS,
		methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'X-User-Key', 'X-Session-Id'],
		exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
		credentials: true,
		maxAge: 86400,
	})
);

// 2. Authentication Middleware (for admin routes)
app.use(
	'*',
	createAuthMiddleware<Env>({
		sources: ['header:X-User-Key', 'header:X-Session-Id', 'query:key'],
		resolver: (credential, env) => {
			// Parse key mappings
			const adminKeys = parseKeysFromEnv(env.ADMIN_KEYS);
			const friendKeys = parseKeysFromEnv(env.FRIEND_KEYS);

			// Helper to check if credential exists in keys (handles both Set and Record)
			const hasKey = (keys: Set<string> | Record<string, string>, cred: string): boolean => {
				return keys instanceof Set ? keys.has(cred) : cred in keys;
			};

			// Simple validation - check if credential is in admin or friend keys
			let userType: 'admin' | 'friend' | 'public' = 'public';

			if (credential) {
				if (hasKey(adminKeys, credential)) {
					userType = 'admin';
				} else if (hasKey(friendKeys, credential)) {
					userType = 'friend';
				}
			}

			return {
				userType,
				sessionId: credential ?? 'public',
			};
		},
	})
);

// ============================================================================
// Route Registration
// ============================================================================

// Health check endpoint
app.get('/contact/api/health', (c) => {
	return c.json({
		status: 'healthy',
		timestamp: Date.now(),
		service: 'contact-api',
	});
});

// Public routes (no auth required)
app.route('/contact/api', createSubmitRoutes());

// Appointment routes (public - fetch slots)
app.route('/contact/api', createAppointmentsRoutes());

// Inbound email webhook (no auth required - Resend webhooks use signature)
app.route('/contact/api', createInboundRoutes());

// Admin routes (require admin auth)
app.route('/contact/api/admin', createAdminRoutes());

// 404 handler
app.notFound((c) => {
	return c.json(
		{
			success: false,
			error: 'Not found',
			message: 'The requested endpoint does not exist',
		},
		404
	);
});

// Global error handler
app.onError((err, c) => {
	console.error('Unhandled error:', err);
	return c.json(
		{
			success: false,
			error: 'Internal server error',
			message: 'An unexpected error occurred',
		},
		500
	);
});

// ============================================================================
// Scheduled Event Handler (Cron Jobs)
// ============================================================================

/**
 * Scheduled tasks triggered by cron (daily at 3 AM UTC)
 *
 * Tasks:
 * 1. Archive submissions older than configured days
 * 2. Purge old deleted submissions (trash cleanup)
 * 3. Check database capacity and log with severity levels
 *
 * All events are logged to Analytics Engine for queryable metrics.
 */
async function handleScheduled(env: Env): Promise<void> {
	console.log('Running scheduled tasks...');
	let success = true;

	try {
		// Task 1: Archive old submissions
		const archivedCount = await archiveOldSubmissions(env.DB, RETENTION_CONFIG.ARCHIVE_AFTER_DAYS);
		console.log(
			`Archived ${archivedCount} submission(s) older than ${RETENTION_CONFIG.ARCHIVE_AFTER_DAYS} days`
		);
		logArchive(env, archivedCount, RETENTION_CONFIG.ARCHIVE_AFTER_DAYS);

		// Task 2: Purge old deleted submissions (trash cleanup)
		const purgedCount = await purgeOldDeletedSubmissions(env.DB);
		console.log(
			`Purged ${purgedCount} deleted submission(s) older than ${RETENTION_CONFIG.TRASH_RETENTION_DAYS} days`
		);
		logTrashPurge(env, purgedCount, RETENTION_CONFIG.TRASH_RETENTION_DAYS);

		// Task 3: Check database capacity with detailed logging
		const dbSize = await getDatabaseSize(env.DB);
		console.log(
			`Database capacity: ${dbSize.percentUsed.toFixed(1)}% (${(dbSize.sizeBytes / 1024 / 1024).toFixed(2)} MB)`
		);
		logDbCapacity(env, dbSize.percentUsed, dbSize.sizeBytes);

		if (dbSize.warning) {
			console.warn('⚠️ WARNING: Database capacity threshold exceeded!');
			console.warn('Consider archiving more aggressively or cleaning up old data');
		}

		console.log('Scheduled tasks completed successfully');
	} catch (error) {
		console.error('Error running scheduled tasks:', error);
		success = false;
	}

	// Log overall scheduled run status
	logScheduledRun(env, 'daily_maintenance', success);
}

// ============================================================================
// Export
// ============================================================================

export default {
	// Handle HTTP requests
	fetch: app.fetch,

	// Handle scheduled events (cron triggers)
	// eslint-disable-next-line no-undef
	scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): void {
		// Use waitUntil to ensure the scheduled task completes
		ctx.waitUntil(handleScheduled(env));
	},
};
