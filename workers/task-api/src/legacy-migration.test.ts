/**
 * Legacy Preference Migration Tests
 *
 * Tests the bug fix for migrating preferences from old storage format (prefs:{authKey})
 * to new storage format (prefs:{sessionId}).
 *
 * Bug Fix Location: session.ts:274-287
 */
import { describe, it, expect } from 'vitest';
import app from './index';
import { createTestEnv, createAuthHeaders } from './test-utils';

describe('Legacy Preference Migration', () => {
	const env = createTestEnv();

	it('should migrate prefs:{authKey} during handshake when no oldSessionId provided', async () => {
		// Use a unique admin key for this test to avoid interference
		const uniqueKey = `legacy-test-${Date.now()}`;
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'legacy-admin',
			'Content-Type': 'application/json'
		};

		// Add the key to ADMIN_KEYS
		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;

		// 1. Create legacy format preferences: prefs:{authKey}
		const oldPrefs = {
			theme: 'strawberry-dark',
			experimentalFlags: { experimentalThemes: true },
			version: 1
		};

		// Directly write to KV in legacy format
		await env.TASKS_KV.put(`prefs:${authKey}`, JSON.stringify(oldPrefs));

		// Verify legacy prefs exist
		const legacyPrefsCheck = await env.TASKS_KV.get(`prefs:${authKey}`, 'json') as any;
		expect(legacyPrefsCheck).toBeDefined();
		expect(legacyPrefsCheck.theme).toBe('strawberry-dark');

		// 2. Perform handshake WITHOUT oldSessionId (new device scenario)
		const newSessionId = `session-legacy-new-${Date.now()}`;
		const response = await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: null, // No old session - simulating new device
				newSessionId: newSessionId
			})
		}, env);

		expect(response.status).toBe(200);
		const data: any = await response.json();

		// 3. Verify preferences were migrated from legacy format
		expect(data.preferences).toBeDefined();
		expect(data.preferences.theme).toBe('strawberry-dark');
		expect(data.preferences.experimentalFlags.experimentalThemes).toBe(true);
		expect(data.migratedFrom).toBe(authKey); // Should indicate migration from authKey
		expect(data.isNewSession).toBe(false); // Not new - migrated from legacy

		// 4. Verify new session has prefs in KV under new format
		const newPrefs = await env.TASKS_KV.get(`prefs:${newSessionId}`, 'json') as any;
		expect(newPrefs).toBeDefined();
		expect(newPrefs.theme).toBe('strawberry-dark');
		expect(newPrefs.experimentalFlags.experimentalThemes).toBe(true);

		// 5. Verify legacy prefs still exist (safety - we don't delete them)
		const legacyPrefs = await env.TASKS_KV.get(`prefs:${authKey}`, 'json') as any;
		expect(legacyPrefs).toBeDefined();
		expect(legacyPrefs.theme).toBe('strawberry-dark');

		// 6. Verify session info was created
		const sessionInfo = await env.TASKS_KV.get(`session-info:${newSessionId}`, 'json') as any;
		expect(sessionInfo).toBeDefined();
		expect(sessionInfo.sessionId).toBe(newSessionId);
		expect(sessionInfo.authKey).toBe(authKey);
		expect(sessionInfo.userType).toBe('admin');
	});

	it('should prioritize oldSessionId over legacy authKey format', async () => {
		// Use a unique admin key for this test
		const uniqueKey = `priority-test-${Date.now()}`;
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'priority-admin',
			'Content-Type': 'application/json'
		};

		// Add the key to ADMIN_KEYS
		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;

		// 1. Create legacy format preferences: prefs:{authKey}
		const legacyPrefs = {
			theme: 'legacy-theme',
			source: 'authKey'
		};
		await env.TASKS_KV.put(`prefs:${authKey}`, JSON.stringify(legacyPrefs));

		// 2. Create newer sessionId format preferences: prefs:{sessionId}
		const oldSessionId = `session-old-${Date.now()}`;
		const oldSessionPrefs = {
			theme: 'newer-theme',
			source: 'sessionId'
		};
		await env.TASKS_KV.put(`prefs:${oldSessionId}`, JSON.stringify(oldSessionPrefs));

		// 3. Perform handshake WITH oldSessionId
		const newSessionId = `session-new-${Date.now()}`;
		const response = await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: oldSessionId, // Explicitly provide old session
				newSessionId: newSessionId
			})
		}, env);

		expect(response.status).toBe(200);
		const data: any = await response.json();

		// 4. Verify preferences came from oldSessionId, NOT legacy authKey
		expect(data.preferences.theme).toBe('newer-theme');
		expect(data.preferences.source).toBe('sessionId');
		expect(data.migratedFrom).toBe(oldSessionId);

		// 5. Verify oldSessionId prefs were deleted (explicit migration)
		const oldPrefs = await env.TASKS_KV.get(`prefs:${oldSessionId}`, 'json') as any;
		expect(oldPrefs).toBeNull();

		// 6. Verify legacy prefs still exist (not touched)
		const legacyPrefsCheck = await env.TASKS_KV.get(`prefs:${authKey}`, 'json') as any;
		expect(legacyPrefsCheck).toBeDefined();
		expect(legacyPrefsCheck.theme).toBe('legacy-theme');
	});

	it('should handle case where both legacy and session-map lastSessionId exist', async () => {
		// Use a unique admin key for this test
		const uniqueKey = `both-formats-test-${Date.now()}`;
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'both-formats-admin',
			'Content-Type': 'application/json'
		};

		// Add the key to ADMIN_KEYS
		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;

		// 1. Create a session with preferences (creates session-map)
		const firstSessionId = `session-first-${Date.now()}`;
		await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: null,
				newSessionId: firstSessionId
			})
		}, env);

		// Set preferences on first session
		const firstPrefs = {
			theme: 'from-session-map',
			source: 'session-map'
		};
		await env.TASKS_KV.put(`prefs:${firstSessionId}`, JSON.stringify(firstPrefs));

		// 2. Also create legacy format preferences (shouldn't happen in practice, but test it)
		const legacyPrefs = {
			theme: 'from-legacy',
			source: 'legacy'
		};
		await env.TASKS_KV.put(`prefs:${authKey}`, JSON.stringify(legacyPrefs));

		// 3. New handshake WITHOUT oldSessionId
		const newSessionId = `session-new-both-${Date.now()}`;
		const response = await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: null, // No explicit old session
				newSessionId: newSessionId
			})
		}, env);

		expect(response.status).toBe(200);
		const data: any = await response.json();

		// 4. Should use session-map lastSessionId (higher priority than legacy)
		expect(data.preferences.theme).toBe('from-session-map');
		expect(data.preferences.source).toBe('session-map');
		expect(data.migratedFrom).toBe(firstSessionId);

		// 5. Verify session-map was updated to include new session
		const mapping = await env.TASKS_KV.get(`session-map:${authKey}`, 'json') as any;
		expect(mapping.sessionIds).toContain(firstSessionId);
		expect(mapping.sessionIds).toContain(newSessionId);
		expect(mapping.lastSessionId).toBe(newSessionId);
	});

	it('should use default preferences if no legacy format and no session history', async () => {
		// Use a completely unique key that has never been used before
		const uniqueKey = `fresh-user-${Date.now()}-${Math.random()}`;
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'fresh-user',
			'Content-Type': 'application/json'
		};

		// Add the key to ADMIN_KEYS
		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		// No legacy prefs, no session history - completely fresh user

		const newSessionId = `session-fresh-${Date.now()}`;
		const response = await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: null,
				newSessionId: newSessionId
			})
		}, env);

		expect(response.status).toBe(200);
		const data: any = await response.json();

		// Should return default preferences
		expect(data.preferences).toBeDefined();
		expect(data.preferences.theme).toBe('system'); // Default theme
		expect(data.isNewSession).toBe(true);
		expect(data.migratedFrom).toBeUndefined();

		// Verify preferences were saved
		const prefs = await env.TASKS_KV.get(`prefs:${newSessionId}`, 'json') as any;
		expect(prefs).toBeDefined();
		expect(prefs.theme).toBe('system');
	});

	it('should migrate legacy prefs even if authKey looks like a sessionId', async () => {
		// Some users might have authKeys that look like sessionIds (UUIDs, hashes, etc.)
		// The legacy migration should still work
		const uniqueKey = `655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b`; // UUID format
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'uuid-admin',
			'Content-Type': 'application/json'
		};

		// Add the key to ADMIN_KEYS
		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;

		// Create legacy format preferences with UUID authKey
		const legacyPrefs = {
			theme: 'uuid-theme',
			customData: 'important-data'
		};
		await env.TASKS_KV.put(`prefs:${authKey}`, JSON.stringify(legacyPrefs));

		// Perform handshake
		const newSessionId = `session-uuid-new-${Date.now()}`;
		const response = await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: null,
				newSessionId: newSessionId
			})
		}, env);

		expect(response.status).toBe(200);
		const data: any = await response.json();

		// Should successfully migrate from UUID authKey
		expect(data.preferences.theme).toBe('uuid-theme');
		expect(data.preferences.customData).toBe('important-data');
		expect(data.migratedFrom).toBe(authKey);
	});
});
