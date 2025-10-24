/**
 * Session Handshake Tests
 * 
 * Tests the session management system including handshake, migration, and multi-device scenarios.
 */
import { describe, it, expect } from 'vitest';
import app from './index';
import { createTestEnv, createAuthHeaders } from './test-utils';

describe('Session Handshake Tests', () => {
	const env = createTestEnv();

	describe('Basic Handshake', () => {
		it('should handle first-time handshake with no previous session', async () => {
			const adminHeaders = createAuthHeaders(env, 'automated_testing_admin');
			
			const response = await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: null,
					newSessionId: 'session-new-device-001'
				})
			}, env);

			expect(response.status).toBe(200);
			const data: any = await response.json();
			
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
			await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: null,
					newSessionId: oldSessionId
				})
			}, env);

			// 2. Update preferences
			await app.request('/task/api/preferences', {
				method: 'PUT',
				headers: {
					...adminHeaders,
					'X-Session-Id': oldSessionId
				},
				body: JSON.stringify({
					theme: 'dark',
					customField: 'test-value'
				})
			}, env);

			// 3. Handshake with new sessionId (simulating browser refresh)
			const newSessionId = 'session-device-A-002';
			const response = await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: oldSessionId,
					newSessionId: newSessionId
				})
			}, env);

			expect(response.status).toBe(200);
			const data: any = await response.json();
			
			expect(data.sessionId).toBe(newSessionId);
			expect(data.preferences.theme).toBe('dark');
			expect(data.preferences.customField).toBe('test-value');
			expect(data.isNewSession).toBe(false);
			expect(data.migratedFrom).toBe(oldSessionId);

			// 4. Verify both sessionIds have their own copy of preferences
			const oldPrefs = await env.TASKS_KV.get(`prefs:${oldSessionId}`, 'json') as any;
			const newPrefs = await env.TASKS_KV.get(`prefs:${newSessionId}`, 'json') as any;
			
			expect(oldPrefs).toBeDefined();
			expect(newPrefs).toBeDefined();
			expect(oldPrefs.theme).toBe('dark');
			expect(newPrefs.theme).toBe('dark');
		});
	});

	describe('Multi-Device Scenarios', () => {
		it('should support multiple devices with different preferences', async () => {
			const adminHeaders = createAuthHeaders(env, 'automated_testing_admin');
			
			// Device 1: Phone with dark theme
			const phoneSessionId = 'session-phone-001';
			await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: null,
					newSessionId: phoneSessionId
				})
			}, env);

			await app.request('/task/api/preferences', {
				method: 'PUT',
				headers: {
					...adminHeaders,
					'X-Session-Id': phoneSessionId
				},
				body: JSON.stringify({ theme: 'dark', device: 'phone' })
			}, env);

			// Device 2: Desktop with light theme
			const desktopSessionId = 'session-desktop-001';
			await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: null,
					newSessionId: desktopSessionId
				})
			}, env);

			await app.request('/task/api/preferences', {
				method: 'PUT',
				headers: {
					...adminHeaders,
					'X-Session-Id': desktopSessionId
				},
				body: JSON.stringify({ theme: 'light', device: 'desktop' })
			}, env);

			// Verify phone preferences
			const phonePrefs = await env.TASKS_KV.get(`prefs:${phoneSessionId}`, 'json') as any;
			expect(phonePrefs.theme).toBe('dark');
			expect(phonePrefs.device).toBe('phone');

			// Verify desktop preferences
			const desktopPrefs = await env.TASKS_KV.get(`prefs:${desktopSessionId}`, 'json') as any;
			expect(desktopPrefs.theme).toBe('light');
			expect(desktopPrefs.device).toBe('desktop');
		});

		it('should track multiple sessionIds per authKey', async () => {
			// Use a unique admin key for this test to avoid interference
			const uniqueKey = `multi-device-test-${Date.now()}`;
			const adminHeaders = {
				'X-User-Key': uniqueKey,
				'X-User-Id': 'multi-device-admin',
				'Content-Type': 'application/json'
			};
			
			// Add the key to ADMIN_KEYS
			const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
			existingKeys[uniqueKey] = uniqueKey;
			env.ADMIN_KEYS = JSON.stringify(existingKeys);
			
			const authKey = uniqueKey;
			
			// Create 3 different sessions
			const sessions = [
				'session-multi-001',
				'session-multi-002',
				'session-multi-003'
			];

			for (const sessionId of sessions) {
				await app.request('/task/api/session/handshake', {
					method: 'POST',
					headers: adminHeaders,
					body: JSON.stringify({
						oldSessionId: null,
						newSessionId: sessionId
					})
				}, env);
			}

			// Verify session mapping tracks all sessions
			const mapping = await env.TASKS_KV.get(`session-map:${authKey}`, 'json') as any;
			expect(mapping).toBeDefined();
			expect(mapping.sessionIds).toHaveLength(3);
			expect(mapping.sessionIds).toContain('session-multi-001');
			expect(mapping.sessionIds).toContain('session-multi-002');
			expect(mapping.sessionIds).toContain('session-multi-003');
			expect(mapping.lastSessionId).toBe('session-multi-003'); // Most recent
		});
	});

	describe('Session Info Tracking', () => {
		it('should create and update session info', async () => {
			const adminHeaders = createAuthHeaders(env, 'session-info-admin');
			const sessionId = 'session-info-001';
			const authKey = adminHeaders['X-User-Key']; // Use actual test admin key
			
			// Create session
			await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: null,
					newSessionId: sessionId
				})
			}, env);

			// Verify session info was created
			const sessionInfo = await env.TASKS_KV.get(`session-info:${sessionId}`, 'json') as any;
			expect(sessionInfo).toBeDefined();
			expect(sessionInfo.sessionId).toBe(sessionId);
			expect(sessionInfo.authKey).toBe(authKey); // Should match actual auth key
			expect(sessionInfo.userType).toBe('admin');
			expect(sessionInfo.createdAt).toBeDefined();
			expect(sessionInfo.lastAccessedAt).toBeDefined();
		});
	});

	describe('Error Handling', () => {
		it('should reject handshake without newSessionId', async () => {
			const adminHeaders = createAuthHeaders(env, 'automated_testing_admin');
			
			const response = await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: null
					// Missing newSessionId
				})
			}, env);

			expect(response.status).toBe(400);
		});

		it('should handle missing oldSessionId gracefully', async () => {
			// Use a completely unique key that has never been used before
			const uniqueKey = `fresh-user-test-${Date.now()}`;
			const adminHeaders = {
				'X-User-Key': uniqueKey,
				'X-User-Id': 'fresh-user-admin',
				'Content-Type': 'application/json'
			};
			
			// Add the key to ADMIN_KEYS
			const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
			existingKeys[uniqueKey] = uniqueKey;
			env.ADMIN_KEYS = JSON.stringify(existingKeys);
			
			// First handshake with non-existent old session
			// Since there's no previous session mapping either, this is truly new
			const response = await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: 'non-existent-session-999',
					newSessionId: 'session-new-001'
				})
			}, env);

			expect(response.status).toBe(200);
			const data: any = await response.json();
			
			// Should return default preferences when old session not found
			// Since this is a truly fresh user (new unique key), theme should be default
			expect(data.preferences).toBeDefined();
			expect(data.preferences.theme).toBe('system');
		});
	});
});
