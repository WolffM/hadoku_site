/**
 * Preferences Routes
 *
 * Handles user preference management (theme, buttons, experimental flags, layout)
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import { badRequest, logRequest, logError } from '../../../util';
import {
	getPreferencesBySessionId,
	savePreferencesBySessionId,
	type UserPreferences
} from '../session';
import { getSessionIdFromRequest, maskSessionId, maskKey } from '../request-utils';
import { DEFAULT_SESSION_ID, DEFAULT_THEME } from '../constants';

type Env = {
	TASKS_KV: KVNamespace;
};

export function createPreferencesRoutes() {
	const app = new Hono<{ Bindings: Env }>();

	/**
	 * Get User Preferences
	 *
	 * GET /preferences
	 *
	 * Fetches preferences by sessionId from X-Session-Id header
	 * Returns all preferences (theme, buttons, experimental flags, layout, etc.)
	 * Falls back to legacy authKey-based prefs if session-based prefs not found
	 */
	app.get('/preferences', async (c: Context) => {
		const auth = c.get('authContext');
		const sessionId = getSessionIdFromRequest(c, auth);

		logRequest('GET', '/task/api/preferences', {
			userType: auth.userType,
			sessionId: maskSessionId(sessionId)
		});

		try {
			// Try session-based prefs first
			let prefs = await getPreferencesBySessionId(c.env.TASKS_KV, sessionId);

			if (prefs) {
				return c.json(prefs);
			}

			// Fallback to legacy authKey-based prefs
			// This provides an additional safety net for users with old format prefs
			const authKey = auth.key || auth.sessionId;
			if (authKey && authKey !== sessionId && authKey !== DEFAULT_SESSION_ID) {
				const legacyKey = `prefs:${authKey}`;
				const legacyPrefs = await c.env.TASKS_KV.get(legacyKey, 'json') as UserPreferences | null;

				if (legacyPrefs) {
					logRequest('GET', '/task/api/preferences', {
						note: 'Found legacy prefs, migrating',
						authKey: maskKey(authKey)
					});

					// Migrate to sessionId-based storage and delete legacy key
					await savePreferencesBySessionId(c.env.TASKS_KV, sessionId, legacyPrefs);
					await c.env.TASKS_KV.delete(legacyKey);

					return c.json(legacyPrefs);
				}
			}

			// Return default preferences if none found
			const defaultPrefs: UserPreferences = {
				theme: DEFAULT_THEME,
				buttons: {},
				experimentalFlags: {},
				layout: {},
				lastUpdated: new Date().toISOString()
			};

			return c.json(defaultPrefs);
		} catch (error: any) {
			logError('GET', '/task/api/preferences', error);

			// Return defaults on error
			return c.json({
				theme: DEFAULT_THEME,
				buttons: {},
				experimentalFlags: {},
				layout: {}
			});
		}
	});

	/**
	 * Save User Preferences
	 *
	 * PUT /preferences
	 *
	 * Saves preferences by sessionId from X-Session-Id header
	 * Accepts ALL preference fields (theme, buttons, experimental flags, layout, etc.)
	 * Merges with existing preferences
	 */
	app.put('/preferences', async (c: Context) => {
		const auth = c.get('authContext');
		const sessionId = getSessionIdFromRequest(c, auth);

		try {
			const body = await c.req.json();

			logRequest('PUT', '/task/api/preferences', {
				userType: auth.userType,
				sessionId: maskSessionId(sessionId),
				fields: Object.keys(body)
			});

			// Get existing preferences
			const existing = await getPreferencesBySessionId(c.env.TASKS_KV, sessionId) || {};

			// Merge with new preferences
			const updated: UserPreferences = {
				...existing,
				...body,
				lastUpdated: new Date().toISOString()
			};

			// Save merged preferences for current session
			await savePreferencesBySessionId(c.env.TASKS_KV, sessionId, updated);

			// Also update lastSessionId preferences so new sessions get latest preferences
			// This ensures cross-device preference sync
			const authKey = auth.key || auth.sessionId;
			if (authKey) {
				const { getSessionMapping } = await import('../session');
				const mapping = await getSessionMapping(c.env.TASKS_KV, authKey);

				if (mapping && mapping.lastSessionId && mapping.lastSessionId !== sessionId) {
					// Update lastSessionId preferences to match current session
					await savePreferencesBySessionId(c.env.TASKS_KV, mapping.lastSessionId, updated);

					logRequest('PUT', '/task/api/preferences', {
						note: 'Synced to lastSessionId',
						lastSessionId: maskSessionId(mapping.lastSessionId)
					});
				}
			}

			return c.json({ ok: true, message: 'Preferences saved', preferences: updated });
		} catch (error: any) {
			logError('PUT', '/task/api/preferences', error);
			return badRequest(c, 'Failed to save preferences: ' + error.message);
		}
	});

	return app;
}
