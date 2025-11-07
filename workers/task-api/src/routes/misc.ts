/**
 * Miscellaneous Routes
 *
 * Handles utility endpoints: health check, key validation, legacy endpoints
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import { TaskHandlers } from '@wolffm/task/api';
import { healthCheck, logRequest, parseKeysFromEnv } from '../../../util';
import { handleOperation } from './route-utils';

type Env = {
	TASKS_KV: KVNamespace;
	ADMIN_KEYS?: string;
	FRIEND_KEYS?: string;
};

/**
 * Validate a key and determine userType
 * Used by validate-key endpoint
 */
function validateKeyAndGetType(
	key: string,
	adminKeys: Record<string, string> | Set<string>,
	friendKeys: Record<string, string> | Set<string>
): { valid: boolean; userType: 'admin' | 'friend' | 'public' } {
	// Check admin keys
	if (adminKeys instanceof Set) {
		if (adminKeys.has(key)) {
			return { valid: true, userType: 'admin' };
		}
	} else if (key in adminKeys) {
		return { valid: true, userType: 'admin' };
	}

	// Check friend keys
	if (friendKeys instanceof Set) {
		if (friendKeys.has(key)) {
			return { valid: true, userType: 'friend' };
		}
	} else if (key in friendKeys) {
		return { valid: true, userType: 'friend' };
	}

	// Not found in either
	return { valid: false, userType: 'public' };
}

export function createMiscRoutes() {
	const app = new Hono<{ Bindings: Env }>();

	/**
	 * Health Check
	 *
	 * GET /health
	 *
	 * Returns health status of the worker
	 */
	app.get('/health', (c: Context) => healthCheck(c, 'task-api-adapter', { kv: true }));

	/**
	 * Validate Key
	 *
	 * POST /validate-key
	 *
	 * Checks if a provided key is valid (exists in ADMIN_KEYS or FRIEND_KEYS)
	 */
	app.post('/validate-key', async (c: Context) => {
		const body = await c.req.json();
		const { key } = body;

		if (!key || typeof key !== 'string') {
			return c.json({ valid: false, error: 'Key is required' }, 400);
		}

		// Parse key mappings from env (can be Set for arrays or Record for objects)
		const adminKeys = parseKeysFromEnv(c.env.ADMIN_KEYS);
		const friendKeys = parseKeysFromEnv(c.env.FRIEND_KEYS);

		// Use centralized validation logic
		const validation = validateKeyAndGetType(key, adminKeys, friendKeys);

		logRequest('POST', '/task/api/validate-key', {
			keyProvided: !!key,
			valid: validation.valid,
			userType: validation.userType,
			keyPreview: key.substring(0, 4) + '...' // Log first 4 chars only for security
		});

		return c.json({ valid: validation.valid });
	});

	/**
	 * Legacy API Root
	 *
	 * GET /
	 *
	 * Backwards compatibility: old v1 list endpoint (maps to main board)
	 */
	app.get('/', async (c: Context) => {
		logRequest('GET', '/task/api', {
			userType: c.get('authContext').userType,
			boardId: 'main'
		});

		return handleOperation(c, (storage, auth) =>
			TaskHandlers.getBoardTasks(storage, auth, 'main')
		);
	});

	/**
	 * Deprecated: User ID Migration
	 *
	 * POST /migrate-userid
	 *
	 * This endpoint is deprecated in v3.0.39+
	 * The API now only uses sessionId
	 */
	app.post('/migrate-userid', async (c: Context) => {
		return c.json({
			error: 'This endpoint is deprecated. The task API now uses sessionId only and does not support userId migration.',
			deprecated: true,
			version: '3.0.39+',
			migration: 'Use sessionId as the stable identifier instead of userId'
		}, 410); // 410 Gone - indicates the endpoint is no longer available
	});

	return app;
}
