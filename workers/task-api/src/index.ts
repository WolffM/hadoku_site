/**
 * Task API Worker - Universal Adapter
 *
 * This worker acts as a thin adapter layer. It imports the framework-agnostic
 * API logic from the `@wolffm/task` package and adapts it to the Hono/Cloudflare
 * Worker environment.
 *
 * The core business logic resides in the child package, not here.
 */
import { Hono } from 'hono';
import type { AuthContext as TaskAuthContext } from '@wolffm/task/api';
import {
	createAuthMiddleware,
	parseKeysFromEnv,
	createCorsMiddleware,
	DEFAULT_HADOKU_ORIGINS,
	logError
} from '../../util';
import {
	checkThrottle,
	recordIncident,
	blacklistSession,
	THROTTLE_THRESHOLDS,
	type IncidentRecord
} from './throttle';
import { USER_TYPES, DEFAULT_SESSION_ID } from './constants';
import { validateKeyAndGetType } from './request-utils';

// Import route modules
import { createSessionRoutes } from './routes/session';
import { createPreferencesRoutes } from './routes/preferences';
import { createBoardRoutes } from './routes/boards';
import { createTaskRoutes } from './routes/tasks';
import { createTagsBatchRoutes } from './routes/tags-batch';
import { createAdminRoutes } from './routes/admin';
import { createMiscRoutes } from './routes/misc';

interface Env {
	ADMIN_KEYS?: string;
	FRIEND_KEYS?: string;
	TASKS_KV: KVNamespace;
}

// Define a custom context type for Hono
type AppContext = {
	Bindings: Env;
	Variables: {
		authContext: TaskAuthContext & { key?: string };
	};
};

const app = new Hono<AppContext>();

// ============================================================================
// Middleware Stack
// ============================================================================

// 1. CORS Middleware
app.use('*', createCorsMiddleware({
	origins: [...DEFAULT_HADOKU_ORIGINS, 'https://task-api.hadoku.me'],
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'X-User-Key', 'X-Session-Id'],
	exposedHeaders: ['X-Backend-Source'],
	credentials: true,
	maxAge: 86400
}));

// 2. Authentication Middleware
app.use('*', createAuthMiddleware<Env>({
	sources: ['header:X-User-Key', 'query:key'],
	resolver: (credential, env) => {
		// Parse key mappings
		const adminKeys = parseKeysFromEnv(env.ADMIN_KEYS);
		const friendKeys = parseKeysFromEnv(env.FRIEND_KEYS);

		// Validate key and determine userType
		const { userType } = credential
			? validateKeyAndGetType(credential, adminKeys, friendKeys)
			: { userType: USER_TYPES.PUBLIC as 'public' };

		// Return auth context with sessionId and key for backward compatibility
		return {
			userType,
			sessionId: credential || DEFAULT_SESSION_ID,
			key: credential // Preserve key for backward compatibility
		};
	}
}));

// 3. Throttle Middleware - Rate limiting per sessionId
app.use('*', async (c, next) => {
	const auth = c.get('authContext');
	const sessionId = auth.sessionId || 'public';
	const userType = auth.userType as 'admin' | 'friend' | 'public';

	// Skip throttling for health check endpoint or authenticated users
	// Authenticated users (admin/friend) are trusted and don't need aggressive rate limiting
	// This significantly reduces KV operations during development and normal authenticated usage
	if (c.req.path === '/task/api/health' || userType !== 'public') {
		return next();
	}

	// Check throttle (only for public users)
	const throttleResult = await checkThrottle(
		c.env.TASKS_KV,
		sessionId,
		userType
	);

	if (!throttleResult.allowed) {
		// Record violation incident
		const incident: IncidentRecord = {
			timestamp: new Date().toISOString(),
			type: 'throttle_violation',
			sessionId,
			authKey: auth.key,
			userType,
			details: {
				reason: throttleResult.reason,
				violations: throttleResult.state.violations,
				path: c.req.path,
				method: c.req.method
			}
		};

		await recordIncident(c.env.TASKS_KV, incident);

		// Auto-blacklist if too many violations
		if (throttleResult.state.violations >= THROTTLE_THRESHOLDS.BLACKLIST_VIOLATION_COUNT) {
			await blacklistSession(
				c.env.TASKS_KV,
				sessionId,
				`Auto-blacklisted after ${throttleResult.state.violations} throttle violations`,
				auth.key
			);
		}

		logError('THROTTLE', c.req.path, `Rate limit exceeded: ${throttleResult.reason}`);

		return c.json({
			error: 'Rate limit exceeded',
			message: throttleResult.reason,
			retryAfter: 60  // seconds
		}, 429);
	}

	return next();
});

// ============================================================================
// Route Registration
// ============================================================================
// IMPORTANT: Order matters! More specific routes must come before generic ones
// to avoid route parameter matching issues (e.g., /batch-tag before /:id)

// Misc routes (health, validate-key, deprecated endpoints, legacy root)
app.route('/task/api', createMiscRoutes());

// Session management
app.route('/task/api', createSessionRoutes());

// Preferences
app.route('/task/api', createPreferencesRoutes());

// Boards
app.route('/task/api', createBoardRoutes());

// Tags and batch operations - MUST come before tasks to avoid /batch-tag matching /:id
app.route('/task/api', createTagsBatchRoutes());

// Tasks (includes stats endpoint) - Generic /:id route
app.route('/task/api', createTaskRoutes());

// Admin endpoints
app.route('/task/api', createAdminRoutes());

// ============================================================================
// Export
// ============================================================================

export default app;
