/**
 * Session Routes
 *
 * Handles session handshake endpoint for establishing and migrating sessions
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import { badRequest, logRequest, logError } from '../../../util';
import { handleSessionHandshake, type HandshakeRequest } from '../session';
import { maskKey, maskSessionId } from '../request-utils';

type Env = {
	TASKS_KV: KVNamespace;
};

export function createSessionRoutes() {
	const app = new Hono<{ Bindings: Env }>();

	/**
	 * Session Handshake
	 *
	 * POST /session/handshake
	 *
	 * Establishes a new session and migrates preferences from:
	 * 1. oldSessionId (if provided)
	 * 2. session-map (authKey → lastSessionId)
	 * 3. legacy prefs:authKey
	 * 4. defaults (if none found)
	 */
	app.post('/session/handshake', async (c: Context) => {
		try {
			const auth = c.get('authContext');
			const body = (await c.req.json()) as HandshakeRequest;

			// Validate request
			if (!body.newSessionId) {
				return badRequest(c, 'newSessionId is required');
			}

			// Get authKey from context
			const authKey = auth.key || auth.sessionId || 'public';

			logRequest('POST', '/task/api/session/handshake', {
				userType: auth.userType,
				authKey: maskKey(authKey),
				oldSessionId: body.oldSessionId ? maskSessionId(body.oldSessionId) : null,
				newSessionId: maskSessionId(body.newSessionId),
			});

			// Handle handshake
			const response = await handleSessionHandshake(
				c.env.TASKS_KV,
				authKey,
				auth.userType as 'admin' | 'friend' | 'public',
				body
			);

			return c.json(response);
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			logError(
				'POST',
				'/task/api/session/handshake',
				error instanceof Error ? error : new Error(errorMessage)
			);
			return badRequest(c, `Handshake failed: ${errorMessage}`);
		}
	});
	return app;
}
