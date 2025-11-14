/**
 * Miscellaneous Routes
 *
 * Handles utility endpoints: health check, key validation, legacy endpoints
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import { TaskHandlers } from '@wolffm/task/api';
import { healthCheck, logRequest } from '../../../util';
import { handleOperation } from './route-utils';

type Env = {
	TASKS_KV: KVNamespace;
	ADMIN_KEYS?: string;
	FRIEND_KEYS?: string;
};

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
	 * Checks if the key provided in X-User-Key header is valid
	 * Returns the validation result from the auth middleware
	 */
	app.post('/validate-key', async (c: Context) => {
		// Auth middleware has already validated the key and set authContext
		const authContext = c.get('authContext');
		const userType = authContext.userType;

		// If userType is 'public', the key was invalid or not provided
		const valid = userType !== 'public';

		logRequest('POST', '/task/api/validate-key', {
			valid,
			userType,
			hasKey: !!authContext.key,
		});

		return c.json({ valid, userType });
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
			boardId: 'main',
		});

		return handleOperation(c, (storage, auth) => TaskHandlers.getBoardTasks(storage, auth, 'main'));
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
		return c.json(
			{
				error:
					'This endpoint is deprecated. The task API now uses sessionId only and does not support userId migration.',
				deprecated: true,
				version: '3.0.39+',
				migration: 'Use sessionId as the stable identifier instead of userId',
			},
			410
		); // 410 Gone - indicates the endpoint is no longer available
	});

	return app;
}
