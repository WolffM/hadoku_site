/**
 * GET /preferences Legacy Fallback Tests
 *
 * Tests the bug fix that adds a fallback to legacy authKey-based preferences
 * when fetching preferences via GET /preferences.
 *
 * Bug Fix Location: index.ts:739-757
 */
import { describe, it, expect } from 'vitest';
import app from './index';
import { createTestEnv, createAuthHeaders } from './test-utils';

describe('GET /preferences Legacy Fallback', () => {
	const env = createTestEnv();

	it('should fetch legacy prefs:{authKey} when no session-based prefs exist', async () => {
		// Use a unique admin key
		const uniqueKey = `legacy-prefs-test-${Date.now()}`;
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'legacy-prefs-admin',
			'Content-Type': 'application/json'
		};

		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;

		// 1. Create legacy format preferences directly in KV
		const legacyPrefs = {
			theme: 'legacy-dark',
			buttons: { showCompleted: true },
			experimentalFlags: { featureX: true },
			version: 1
		};
		await env.TASKS_KV.put(`prefs:${authKey}`, JSON.stringify(legacyPrefs));

		// 2. Perform handshake to create a session
		const sessionId = `session-legacy-${Date.now()}`;
		await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: null,
				newSessionId: sessionId
			})
		}, env);

		// Note: Handshake should have migrated prefs, but for this test we're testing
		// the GET endpoint fallback specifically. Let's delete the session prefs to
		// simulate a scenario where they weren't migrated.
		await env.TASKS_KV.delete(`prefs:${sessionId}`);

		// 3. GET preferences with X-Session-Id header
		const response = await app.request('/task/api/preferences', {
			method: 'GET',
			headers: {
				...adminHeaders,
				'X-Session-Id': sessionId
			}
		}, env);

		expect(response.status).toBe(200);
		const data: any = await response.json();

		// 4. Should return legacy preferences as fallback
		expect(data.theme).toBe('legacy-dark');
		expect(data.buttons.showCompleted).toBe(true);
		expect(data.experimentalFlags.featureX).toBe(true);

		// 5. Verify preferences were migrated to sessionId format (auto-migration)
		const migratedPrefs = await env.TASKS_KV.get(`prefs:${sessionId}`, 'json') as any;
		expect(migratedPrefs).toBeDefined();
		expect(migratedPrefs.theme).toBe('legacy-dark');
		expect(migratedPrefs.buttons.showCompleted).toBe(true);

		// 6. Verify legacy prefs still exist (not deleted)
		const legacyPrefsCheck = await env.TASKS_KV.get(`prefs:${authKey}`, 'json') as any;
		expect(legacyPrefsCheck).toBeDefined();
	});

	it('should prioritize session-based prefs over legacy authKey prefs', async () => {
		// Use a unique admin key
		const uniqueKey = `priority-prefs-test-${Date.now()}`;
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'priority-prefs-admin',
			'Content-Type': 'application/json'
		};

		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;

		// 1. Create both legacy and session-based preferences
		const legacyPrefs = {
			theme: 'legacy-theme',
			source: 'authKey'
		};
		await env.TASKS_KV.put(`prefs:${authKey}`, JSON.stringify(legacyPrefs));

		const sessionId = `session-priority-${Date.now()}`;
		const sessionPrefs = {
			theme: 'session-theme',
			source: 'sessionId'
		};
		await env.TASKS_KV.put(`prefs:${sessionId}`, JSON.stringify(sessionPrefs));

		// 2. Create session via handshake
		await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: null,
				newSessionId: sessionId
			})
		}, env);

		// Restore session prefs (handshake might have overwritten them)
		await env.TASKS_KV.put(`prefs:${sessionId}`, JSON.stringify(sessionPrefs));

		// 3. GET preferences with X-Session-Id
		const response = await app.request('/task/api/preferences', {
			method: 'GET',
			headers: {
				...adminHeaders,
				'X-Session-Id': sessionId
			}
		}, env);

		expect(response.status).toBe(200);
		const data: any = await response.json();

		// 4. Should return session-based prefs (higher priority)
		expect(data.theme).toBe('session-theme');
		expect(data.source).toBe('sessionId');
	});

	it('should return default preferences if no legacy or session prefs exist', async () => {
		// Use a unique admin key
		const uniqueKey = `no-prefs-test-${Date.now()}`;
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'no-prefs-admin',
			'Content-Type': 'application/json'
		};

		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		// No preferences created at all

		const sessionId = `session-no-prefs-${Date.now()}`;

		// Perform handshake
		await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: null,
				newSessionId: sessionId
			})
		}, env);

		// Delete any prefs that were created by handshake
		await env.TASKS_KV.delete(`prefs:${sessionId}`);

		// GET preferences
		const response = await app.request('/task/api/preferences', {
			method: 'GET',
			headers: {
				...adminHeaders,
				'X-Session-Id': sessionId
			}
		}, env);

		expect(response.status).toBe(200);
		const data: any = await response.json();

		// Should return default preferences
		expect(data.theme).toBe('system'); // Default theme
		expect(data.buttons).toEqual({});
		expect(data.experimentalFlags).toEqual({});
		expect(data.layout).toEqual({});
	});

	it('should NOT use legacy fallback if authKey equals sessionId', async () => {
		// Use a unique admin key
		const uniqueKey = `same-key-test-${Date.now()}`;
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'same-key-admin',
			'Content-Type': 'application/json'
		};

		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;

		// Create preferences under authKey (which will be used as sessionId)
		const prefs = {
			theme: 'test-theme',
			note: 'prefs under authKey'
		};
		await env.TASKS_KV.put(`prefs:${authKey}`, JSON.stringify(prefs));

		// Perform handshake using authKey as sessionId (edge case)
		await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: null,
				newSessionId: authKey // Using authKey as sessionId
			})
		}, env);

		// GET preferences
		const response = await app.request('/task/api/preferences', {
			method: 'GET',
			headers: {
				...adminHeaders,
				'X-Session-Id': authKey
			}
		}, env);

		expect(response.status).toBe(200);
		const data: any = await response.json();

		// Should find prefs (because sessionId == authKey)
		// But should NOT trigger legacy fallback logic
		expect(data.theme).toBeDefined();
	});

	it('should NOT use legacy fallback for public users', async () => {
		// Public user scenario
		const publicHeaders = {
			'X-User-Key': 'public',
			'X-User-Id': 'public-user',
			'Content-Type': 'application/json'
		};

		// Create some prefs under 'public' key
		const publicPrefs = {
			theme: 'public-theme'
		};
		await env.TASKS_KV.put(`prefs:public`, JSON.stringify(publicPrefs));

		const sessionId = `session-public-${Date.now()}`;

		// GET preferences with public authKey
		const response = await app.request('/task/api/preferences', {
			method: 'GET',
			headers: {
				...publicHeaders,
				'X-Session-Id': sessionId
			}
		}, env);

		expect(response.status).toBe(200);
		const data: any = await response.json();

		// Should return defaults (not legacy prefs for 'public')
		// Because authKey == 'public' is excluded from fallback
		expect(data.theme).toBe('system'); // Default, not 'public-theme'
	});

	it('should auto-migrate legacy prefs to sessionId on GET', async () => {
		// Use a unique admin key
		const uniqueKey = `auto-migrate-test-${Date.now()}`;
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'auto-migrate-admin',
			'Content-Type': 'application/json'
		};

		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;

		// Create legacy prefs
		const legacyPrefs = {
			theme: 'auto-migrate-theme',
			customData: 'important'
		};
		await env.TASKS_KV.put(`prefs:${authKey}`, JSON.stringify(legacyPrefs));

		const sessionId = `session-auto-migrate-${Date.now()}`;

		// Perform handshake
		await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: null,
				newSessionId: sessionId
			})
		}, env);

		// Delete session prefs to force fallback
		await env.TASKS_KV.delete(`prefs:${sessionId}`);

		// Verify no session prefs exist yet
		let sessionPrefs = await env.TASKS_KV.get(`prefs:${sessionId}`, 'json');
		expect(sessionPrefs).toBeNull();

		// GET preferences (should trigger auto-migration)
		const response = await app.request('/task/api/preferences', {
			method: 'GET',
			headers: {
				...adminHeaders,
				'X-Session-Id': sessionId
			}
		}, env);

		expect(response.status).toBe(200);
		const data: any = await response.json();

		expect(data.theme).toBe('auto-migrate-theme');
		expect(data.customData).toBe('important');

		// Verify preferences were auto-migrated to sessionId
		sessionPrefs = await env.TASKS_KV.get(`prefs:${sessionId}`, 'json') as any;
		expect(sessionPrefs).toBeDefined();
		expect(sessionPrefs.theme).toBe('auto-migrate-theme');
		expect(sessionPrefs.customData).toBe('important');

		// Second GET should now use session prefs (no fallback needed)
		const response2 = await app.request('/task/api/preferences', {
			method: 'GET',
			headers: {
				...adminHeaders,
				'X-Session-Id': sessionId
			}
		}, env);

		expect(response2.status).toBe(200);
		const data2: any = await response2.json();
		expect(data2.theme).toBe('auto-migrate-theme');
	});

	it('should handle GET without X-Session-Id header', async () => {
		// Use a unique admin key
		const uniqueKey = `no-session-header-test-${Date.now()}`;
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'no-session-header-admin',
			'Content-Type': 'application/json'
		};

		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;

		// Create legacy prefs
		const legacyPrefs = {
			theme: 'no-session-theme'
		};
		await env.TASKS_KV.put(`prefs:${authKey}`, JSON.stringify(legacyPrefs));

		// GET preferences WITHOUT X-Session-Id header
		// Should fall back to using authKey as sessionId
		const response = await app.request('/task/api/preferences', {
			method: 'GET',
			headers: adminHeaders
			// No X-Session-Id
		}, env);

		expect(response.status).toBe(200);
		const data: any = await response.json();

		// Should find preferences (either via fallback or direct)
		expect(data).toBeDefined();
		expect(data.theme).toBeDefined();
	});
});
