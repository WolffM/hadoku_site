/**
 * Session Handshake Tests
 *
 * Tests the session management system including handshake, migration, and multi-device scenarios.
 */
import { describe, it, expect } from 'vitest';
import app from '../../src/index';
import { createTestEnv, createAuthHeaders } from '../__helpers__/test-utils';
import type {
	HandshakeResponse,
	UserPreferences,
	SessionMapping,
	SessionInfo,
} from '../../src/session';

describe('Session Handshake Tests', () => {
	const env = createTestEnv();

	describe('Basic Handshake', () => {
		it('should handle first-time handshake with no previous session', async () => {
			const adminHeaders = createAuthHeaders(env, 'automated_testing_admin');

			const response = await app.request(
				'/task/api/session/handshake',
				{
					method: 'POST',
					headers: adminHeaders,
					body: JSON.stringify({
						oldSessionId: null,
						newSessionId: 'session-new-device-001',
					}),
				},
				env
			);

			expect(response.status).toBe(200);
			const data = await response.json<HandshakeResponse>();

			expect(data.sessionId).toBe('session-new-device-001');
			expect(data.preferences).toBeDefined();
			expect(data.preferences.theme).toBe('system'); // Default theme
			expect(data.isNewSession).toBe(true);
			expect(data.migratedFrom).toBeUndefined();
		});

		it('should migrate preferences from old sessionId to new sessionId', async () => {
			const adminHeaders = createAuthHeaders(env, 'automated_testing_admin');

			// 1. Create initial session with custom preferences
			const oldSessionId = 'session-device-A-001';
			await app.request(
				'/task/api/session/handshake',
				{
					method: 'POST',
					headers: adminHeaders,
					body: JSON.stringify({
						oldSessionId: null,
						newSessionId: oldSessionId,
					}),
				},
				env
			);

			// 2. Update preferences
			await app.request(
				'/task/api/preferences',
				{
					method: 'PUT',
					headers: {
						...adminHeaders,
						'X-Session-Id': oldSessionId,
					},
					body: JSON.stringify({
						theme: 'dark',
						customField: 'test-value',
					}),
				},
				env
			);

			// 3. Handshake with new sessionId (simulating browser refresh)
			const newSessionId = 'session-device-A-002';
			const response = await app.request(
				'/task/api/session/handshake',
				{
					method: 'POST',
					headers: adminHeaders,
					body: JSON.stringify({
						oldSessionId,
						newSessionId,
					}),
				},
				env
			);

			expect(response.status).toBe(200);
			const data = await response.json<HandshakeResponse>();

			expect(data.sessionId).toBe(newSessionId);
			expect(data.preferences.theme).toBe('dark');
			expect(data.preferences.customField).toBe('test-value');
			expect(data.isNewSession).toBe(false);
			expect(data.migratedFrom).toBe(oldSessionId);

			// 4. Verify preferences were MOVED (not copied)
			// Old sessionId preferences should be DELETED
			const oldPrefs = await env.TASKS_KV.get<UserPreferences>(`prefs:${oldSessionId}`, 'json');
			const newPrefs = await env.TASKS_KV.get<UserPreferences>(`prefs:${newSessionId}`, 'json');

			expect(oldPrefs).toBeNull(); // Old prefs deleted
			expect(newPrefs).toBeDefined(); // New prefs exist
			expect(newPrefs?.theme).toBe('dark');
			expect(newPrefs?.customField).toBe('test-value');

			// Old session info should also be deleted
			const oldSessionInfo = await env.TASKS_KV.get(`session-info:${oldSessionId}`, 'json');
			expect(oldSessionInfo).toBeNull();
		});
	});

	describe('Multi-Device Scenarios', () => {
		it('should support multiple devices with different preferences', async () => {
			const adminHeaders = createAuthHeaders(env, 'automated_testing_admin');

			// Device 1: Phone with dark theme
			const phoneSessionId = 'session-phone-001';
			await app.request(
				'/task/api/session/handshake',
				{
					method: 'POST',
					headers: adminHeaders,
					body: JSON.stringify({
						oldSessionId: null,
						newSessionId: phoneSessionId,
					}),
				},
				env
			);

			await app.request(
				'/task/api/preferences',
				{
					method: 'PUT',
					headers: {
						...adminHeaders,
						'X-Session-Id': phoneSessionId,
					},
					body: JSON.stringify({ theme: 'dark', deviceInfo: { device: 'phone' } }),
				},
				env
			);

			// Device 2: Desktop with light theme
			const desktopSessionId = 'session-desktop-001';
			await app.request(
				'/task/api/session/handshake',
				{
					method: 'POST',
					headers: adminHeaders,
					body: JSON.stringify({
						oldSessionId: null,
						newSessionId: desktopSessionId,
					}),
				},
				env
			);

			await app.request(
				'/task/api/preferences',
				{
					method: 'PUT',
					headers: {
						...adminHeaders,
						'X-Session-Id': desktopSessionId,
					},
					body: JSON.stringify({ theme: 'light', deviceInfo: { device: 'desktop' } }),
				},
				env
			);

			// Verify phone preferences
			const phonePrefs = await env.TASKS_KV.get<UserPreferences>(`prefs:${phoneSessionId}`, 'json');
			expect(phonePrefs?.theme).toBe('dark');
			expect(phonePrefs?.deviceInfo?.device).toBe('phone');

			// Verify desktop preferences
			const desktopPrefs = await env.TASKS_KV.get<UserPreferences>(
				`prefs:${desktopSessionId}`,
				'json'
			);
			expect(desktopPrefs?.theme).toBe('light');
			expect(desktopPrefs?.deviceInfo?.device).toBe('desktop');
		});

		it('should track multiple sessionIds per authKey', async () => {
			// Use a unique admin key for this test to avoid interference
			const uniqueKey = `multi-device-test-${Date.now()}`;
			const adminHeaders = {
				'X-User-Key': uniqueKey,
				'X-User-Id': 'multi-device-admin',
				'Content-Type': 'application/json',
			};

			// Add the key to ADMIN_KEYS
			const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
			existingKeys[uniqueKey] = uniqueKey;
			env.ADMIN_KEYS = JSON.stringify(existingKeys);

			const authKey = uniqueKey;

			// Create 3 different sessions
			const sessions = ['session-multi-001', 'session-multi-002', 'session-multi-003'];

			// Execute handshakes in parallel for better performance
			await Promise.all(
				sessions.map((sessionId) =>
					app.request(
						'/task/api/session/handshake',
						{
							method: 'POST',
							headers: adminHeaders,
							body: JSON.stringify({
								oldSessionId: null,
								newSessionId: sessionId,
							}),
						},
						env
					)
				)
			);

			// Verify session mapping tracks all sessions
			const mapping = await env.TASKS_KV.get<SessionMapping>(`session-map:${authKey}`, 'json');
			expect(mapping).toBeDefined();
			expect(mapping?.sessionIds).toHaveLength(3);
			expect(mapping?.sessionIds).toContain('session-multi-001');
			expect(mapping?.sessionIds).toContain('session-multi-002');
			expect(mapping?.sessionIds).toContain('session-multi-003');
			// With concurrent operations, lastSessionId could be any of the 3 (whichever completed last)
			expect(sessions).toContain(mapping?.lastSessionId);
		});
		it('should remove old sessionId from mapping when migrating', async () => {
			const uniqueKey = `migration-test-${Date.now()}`;
			const adminHeaders = {
				'X-User-Key': uniqueKey,
				'X-User-Id': 'migration-admin',
				'Content-Type': 'application/json',
			};

			// Add the key to ADMIN_KEYS
			const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
			existingKeys[uniqueKey] = uniqueKey;
			env.ADMIN_KEYS = JSON.stringify(existingKeys);

			const authKey = uniqueKey;

			// Create initial session
			const oldSessionId = 'session-old-001';
			await app.request(
				'/task/api/session/handshake',
				{
					method: 'POST',
					headers: adminHeaders,
					body: JSON.stringify({
						oldSessionId: null,
						newSessionId: oldSessionId,
					}),
				},
				env
			);

			// Verify initial mapping
			let mapping = await env.TASKS_KV.get<SessionMapping>(`session-map:${authKey}`, 'json');
			expect(mapping?.sessionIds).toHaveLength(1);
			expect(mapping?.sessionIds).toContain(oldSessionId);

			// Migrate to new session
			const newSessionId = 'session-new-001';
			await app.request(
				'/task/api/session/handshake',
				{
					method: 'POST',
					headers: adminHeaders,
					body: JSON.stringify({
						oldSessionId,
						newSessionId,
					}),
				},
				env
			);

			// Verify mapping updated: old removed, new added
			mapping = await env.TASKS_KV.get<SessionMapping>(`session-map:${authKey}`, 'json');
			expect(mapping?.sessionIds).toHaveLength(1);
			expect(mapping?.sessionIds).not.toContain(oldSessionId); // Old removed
			expect(mapping?.sessionIds).toContain(newSessionId); // New added
			expect(mapping?.lastSessionId).toBe(newSessionId);
		});
	});

	describe('Session Info Tracking', () => {
		it('should create and update session info', async () => {
			const adminHeaders = createAuthHeaders(env, 'session-info-admin');
			const sessionId = 'session-info-001';
			const authKey = adminHeaders['X-User-Key']; // Use actual test admin key

			// Create session
			await app.request(
				'/task/api/session/handshake',
				{
					method: 'POST',
					headers: adminHeaders,
					body: JSON.stringify({
						oldSessionId: null,
						newSessionId: sessionId,
					}),
				},
				env
			);

			// Verify session info was created
			const sessionInfo = await env.TASKS_KV.get<SessionInfo>(`session-info:${sessionId}`, 'json');
			expect(sessionInfo).toBeDefined();
			expect(sessionInfo?.sessionId).toBe(sessionId);
			expect(sessionInfo?.authKey).toBe(authKey); // Should match actual auth key
			expect(sessionInfo?.userType).toBe('admin');
			expect(sessionInfo?.createdAt).toBeDefined();
			expect(sessionInfo?.lastAccessedAt).toBeDefined();
		});
	});

	describe('Error Handling', () => {
		it('should reject handshake without newSessionId', async () => {
			const adminHeaders = createAuthHeaders(env, 'automated_testing_admin');

			const response = await app.request(
				'/task/api/session/handshake',
				{
					method: 'POST',
					headers: adminHeaders,
					body: JSON.stringify({
						oldSessionId: null,
						// Missing newSessionId
					}),
				},
				env
			);

			expect(response.status).toBe(400);
		});

		it('should handle missing oldSessionId gracefully', async () => {
			// Use a completely unique key that has never been used before
			const uniqueKey = `fresh-user-test-${Date.now()}`;
			const adminHeaders = {
				'X-User-Key': uniqueKey,
				'X-User-Id': 'fresh-user-admin',
				'Content-Type': 'application/json',
			};

			// Add the key to ADMIN_KEYS
			const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
			existingKeys[uniqueKey] = uniqueKey;
			env.ADMIN_KEYS = JSON.stringify(existingKeys);

			// First handshake with non-existent old session
			// Since there's no previous session mapping either, this is truly new
			const response = await app.request(
				'/task/api/session/handshake',
				{
					method: 'POST',
					headers: adminHeaders,
					body: JSON.stringify({
						oldSessionId: 'non-existent-session-999',
						newSessionId: 'session-new-001',
					}),
				},
				env
			);

			expect(response.status).toBe(200);
			const data = await response.json<HandshakeResponse>();

			// Should return default preferences when old session not found
			// Since this is a truly fresh user (new unique key), theme should be default
			expect(data.preferences).toBeDefined();
			expect(data.preferences.theme).toBe('system');
		});
	});
});
