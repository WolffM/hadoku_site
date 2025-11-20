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
import { archiveOldSubmissions, isDatabaseNearCapacity } from './storage';

interface Env {
	DB: D1Database;
	RATE_LIMIT_KV: KVNamespace;
	ADMIN_KEYS?: string;
	FRIEND_KEYS?: string;
}

type AppContext = {
	Bindings: Env;
	Variables: {
		authContext: {
			userType: 'admin' | 'friend' | 'public';
			sessionId: string;
		};
	};
};

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
				sessionId: credential || 'public',
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
 * 1. Archive submissions older than 30 days
 * 2. Check database capacity and log warning if >80%
 */
async function handleScheduled(env: Env): Promise<void> {
	console.log('Running scheduled tasks...');

	try {
		// Task 1: Archive old submissions
		const archivedCount = await archiveOldSubmissions(env.DB, 30);
		console.log(`Archived ${archivedCount} submission(s) older than 30 days`);

		// Task 2: Check database capacity
		const isNearCapacity = await isDatabaseNearCapacity(env.DB);
		if (isNearCapacity) {
			console.warn('⚠️ WARNING: Database is over 80% capacity!');
			console.warn('Consider archiving more aggressively or cleaning up old data');
		}

		console.log('Scheduled tasks completed successfully');
	} catch (error) {
		console.error('Error running scheduled tasks:', error);
	}
}

// ============================================================================
// Export
// ============================================================================

export default {
	// Handle HTTP requests
	fetch: app.fetch,

	// Handle scheduled events (cron triggers)
	// eslint-disable-next-line no-undef
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		// Use waitUntil to ensure the scheduled task completes
		ctx.waitUntil(handleScheduled(env));
	},
};
