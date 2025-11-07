/**
 * Admin Routes
 *
 * Handles administrative endpoints for monitoring and management
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import { logRequest } from '../../../util';
import {
	getThrottleState,
	getIncidents,
	isSessionBlacklisted,
	unblacklistSession,
	resetThrottleState,
	checkSuspiciousPatterns
} from '../throttle';
import { getSessionMapping } from '../session';
import { maskSessionId, maskKey } from '../request-utils';
import { USER_TYPES } from '../constants';

type Env = {
	TASKS_KV: KVNamespace;
};

export function createAdminRoutes() {
	const app = new Hono<{ Bindings: Env }>();

	/**
	 * Get Throttle Status
	 *
	 * GET /admin/throttle/:sessionId
	 *
	 * Returns throttle state, blacklist status, and incidents for a session
	 * Requires: admin access
	 */
	app.get('/admin/throttle/:sessionId', async (c: Context) => {
		const auth = c.get('authContext');
		if (auth.userType !== USER_TYPES.ADMIN) {
			return c.json({ error: 'Admin access required' }, 403);
		}

		const sessionId = c.req.param('sessionId');
		if (!sessionId) {
			return c.json({ error: 'sessionId required' }, 400);
		}

		const state = await getThrottleState(c.env.TASKS_KV, sessionId);
		const blacklisted = await isSessionBlacklisted(c.env.TASKS_KV, sessionId);
		const incidents = await getIncidents(c.env.TASKS_KV, sessionId);

		return c.json({
			sessionId: maskSessionId(sessionId),
			throttleState: state,
			blacklisted,
			incidents,
			incidentCount: incidents.length
		});
	});

	/**
	 * Get Sessions for Auth Key
	 *
	 * GET /admin/sessions/:authKey
	 *
	 * Returns all sessions associated with an authKey
	 * Includes suspicious pattern detection
	 * Requires: admin access
	 */
	app.get('/admin/sessions/:authKey', async (c: Context) => {
		const auth = c.get('authContext');
		if (auth.userType !== USER_TYPES.ADMIN) {
			return c.json({ error: 'Admin access required' }, 403);
		}

		const authKey = c.req.param('authKey');
		if (!authKey) {
			return c.json({ error: 'authKey required' }, 400);
		}

		const mapping = await getSessionMapping(c.env.TASKS_KV, authKey);

		if (!mapping) {
			return c.json({ authKey: maskKey(authKey), sessions: [], lastSessionId: null });
		}

		// Check for suspicious patterns
		const suspiciousCheck = await checkSuspiciousPatterns(
			c.env.TASKS_KV,
			authKey,
			mapping.sessionIds
		);

		return c.json({
			authKey: maskKey(authKey),
			sessionCount: mapping.sessionIds.length,
			sessions: mapping.sessionIds.map(maskSessionId),
			lastSessionId: maskSessionId(mapping.lastSessionId),
			suspicious: suspiciousCheck.suspicious,
			suspiciousReasons: suspiciousCheck.reasons
		});
	});

	/**
	 * Unblacklist Session
	 *
	 * POST /admin/unblacklist/:sessionId
	 *
	 * Removes a session from the blacklist and resets throttle state
	 * Requires: admin access
	 */
	app.post('/admin/unblacklist/:sessionId', async (c: Context) => {
		const auth = c.get('authContext');
		if (auth.userType !== USER_TYPES.ADMIN) {
			return c.json({ error: 'Admin access required' }, 403);
		}

		const sessionId = c.req.param('sessionId');
		if (!sessionId) {
			return c.json({ error: 'sessionId required' }, 400);
		}

		await unblacklistSession(c.env.TASKS_KV, sessionId);
		await resetThrottleState(c.env.TASKS_KV, sessionId);

		logRequest('POST', `/task/api/admin/unblacklist/${maskSessionId(sessionId)}`, {
			userType: auth.userType,
			action: 'unblacklist'
		});

		return c.json({ success: true, message: `Session ${maskSessionId(sessionId)} unblacklisted` });
	});

	return app;
}
