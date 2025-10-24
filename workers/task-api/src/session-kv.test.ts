/**
 * Session KV Integration Tests
 * 
 * These tests verify proper Cloudflare KV interactions for session management.
 * Each test validates actual KV reads/writes to ensure correct behavior.
 */
import { describe, it, expect } from 'vitest';
import app from './index';
import { createTestEnv, createAuthHeaders } from './test-utils';

describe('Session KV Integration Tests', () => {
	const env = createTestEnv();

	describe('Scenario 1: New Device Initialization', () => {
		it('should initialize new preferences object with defaults in KV', async () => {
			const uniqueKey = `new-device-${Date.now()}`;
			const adminHeaders = {
				'X-User-Key': uniqueKey,
				'X-User-Id': 'new-device-user',
				'Content-Type': 'application/json'
			};
			
			// Add the key to ADMIN_KEYS
			const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
			existingKeys[uniqueKey] = uniqueKey;
			env.ADMIN_KEYS = JSON.stringify(existingKeys);
			
			const sessionId = 'session-brand-new-001';
			
			// STEP 1: Verify no preferences exist yet
			const prefsBeforeHandshake = await env.TASKS_KV.get(`prefs:${sessionId}`, 'json');
			expect(prefsBeforeHandshake).toBeNull();
			
			// STEP 2: Perform handshake (new device, no oldSessionId)
			const handshakeResponse = await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: null,
					newSessionId: sessionId
				})
			}, env);

			expect(handshakeResponse.status).toBe(200);
			const handshakeData: any = await handshakeResponse.json();
			
			// Verify response contains defaults
			expect(handshakeData.sessionId).toBe(sessionId);
			expect(handshakeData.isNewSession).toBe(true);
			expect(handshakeData.preferences.theme).toBe('system');
			expect(handshakeData.preferences.buttons).toEqual({});
			expect(handshakeData.preferences.experimentalFlags).toEqual({});
			
			// STEP 3: Verify KV now contains preferences with defaults
			const prefsInKV = await env.TASKS_KV.get(`prefs:${sessionId}`, 'json') as any;
			expect(prefsInKV).toBeDefined();
			expect(prefsInKV.theme).toBe('system');
			expect(prefsInKV.buttons).toEqual({});
			expect(prefsInKV.experimentalFlags).toEqual({});
			expect(prefsInKV.lastUpdated).toBeDefined();
			
			// STEP 4: Verify session info was created in KV
			const sessionInfo = await env.TASKS_KV.get(`session-info:${sessionId}`, 'json') as any;
			expect(sessionInfo).toBeDefined();
			expect(sessionInfo.sessionId).toBe(sessionId);
			expect(sessionInfo.authKey).toBe(uniqueKey);
			expect(sessionInfo.userType).toBe('admin');
			
			// STEP 5: Verify session mapping was created in KV
			const mapping = await env.TASKS_KV.get(`session-map:${uniqueKey}`, 'json') as any;
			expect(mapping).toBeDefined();
			expect(mapping.sessionIds).toContain(sessionId);
			expect(mapping.lastSessionId).toBe(sessionId);
		});
	});

	describe('Scenario 2: Existing Device Migration', () => {
		it('should fetch old preferences and move to new sessionId in KV', async () => {
			const uniqueKey = `existing-device-${Date.now()}`;
			const adminHeaders = {
				'X-User-Key': uniqueKey,
				'X-User-Id': 'existing-device-user',
				'Content-Type': 'application/json'
			};
			
			// Add the key to ADMIN_KEYS
			const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
			existingKeys[uniqueKey] = uniqueKey;
			env.ADMIN_KEYS = JSON.stringify(existingKeys);
			
			const oldSessionId = 'session-existing-old-001';
			const newSessionId = 'session-existing-new-001';
			
			// STEP 1: Create initial session with custom preferences
			const initialHandshake = await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: null,
					newSessionId: oldSessionId
				})
			}, env);
			expect(initialHandshake.status).toBe(200);
			
			// STEP 2: Set custom preferences for old session
			const customPrefs = {
				theme: 'strawberry',
				buttons: { showCompleted: true },
				experimentalFlags: { newFeature: true },
				customData: 'my-custom-value'
			};
			
			const updatePrefs = await app.request('/task/api/preferences', {
				method: 'PUT',
				headers: {
					...adminHeaders,
					'X-Session-Id': oldSessionId
				},
				body: JSON.stringify(customPrefs)
			}, env);
			expect(updatePrefs.status).toBe(200);
			
			// STEP 3: Verify old preferences exist in KV
			const oldPrefsInKV = await env.TASKS_KV.get(`prefs:${oldSessionId}`, 'json') as any;
			expect(oldPrefsInKV).toBeDefined();
			expect(oldPrefsInKV.theme).toBe('strawberry');
			expect(oldPrefsInKV.customData).toBe('my-custom-value');
			
			// STEP 4: Perform migration handshake
			const migrationHandshake = await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: oldSessionId,
					newSessionId: newSessionId
				})
			}, env);
			
			expect(migrationHandshake.status).toBe(200);
			const migrationData: any = await migrationHandshake.json();
			
			// Verify response contains migrated preferences
			expect(migrationData.sessionId).toBe(newSessionId);
			expect(migrationData.isNewSession).toBe(false);
			expect(migrationData.migratedFrom).toBe(oldSessionId);
			expect(migrationData.preferences.theme).toBe('strawberry');
			expect(migrationData.preferences.customData).toBe('my-custom-value');
			
			// STEP 5: Verify old preferences DELETED from KV
			const oldPrefsAfterMigration = await env.TASKS_KV.get(`prefs:${oldSessionId}`, 'json');
			expect(oldPrefsAfterMigration).toBeNull();
			
			// STEP 6: Verify new preferences exist in KV with correct data
			const newPrefsInKV = await env.TASKS_KV.get(`prefs:${newSessionId}`, 'json') as any;
			expect(newPrefsInKV).toBeDefined();
			expect(newPrefsInKV.theme).toBe('strawberry');
			expect(newPrefsInKV.buttons.showCompleted).toBe(true);
			expect(newPrefsInKV.experimentalFlags.newFeature).toBe(true);
			expect(newPrefsInKV.customData).toBe('my-custom-value');
			
			// STEP 7: Verify old session info deleted from KV
			const oldSessionInfo = await env.TASKS_KV.get(`session-info:${oldSessionId}`, 'json');
			expect(oldSessionInfo).toBeNull();
			
			// STEP 8: Verify new session info exists in KV
			const newSessionInfo = await env.TASKS_KV.get(`session-info:${newSessionId}`, 'json') as any;
			expect(newSessionInfo).toBeDefined();
			expect(newSessionInfo.sessionId).toBe(newSessionId);
			
			// STEP 9: Verify session mapping updated (old removed, new added)
			const mapping = await env.TASKS_KV.get(`session-map:${uniqueKey}`, 'json') as any;
			expect(mapping.sessionIds).not.toContain(oldSessionId);
			expect(mapping.sessionIds).toContain(newSessionId);
			expect(mapping.lastSessionId).toBe(newSessionId);
		});
	});

	describe('Scenario 3: Multi-Device with Different Themes', () => {
		it('should handle two devices with same authKey but different sessionIds and themes', async () => {
			const uniqueKey = `multi-device-${Date.now()}`;
			const adminHeaders = {
				'X-User-Key': uniqueKey,
				'X-User-Id': 'multi-device-user',
				'Content-Type': 'application/json'
			};
			
			// Add the key to ADMIN_KEYS
			const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
			existingKeys[uniqueKey] = uniqueKey;
			env.ADMIN_KEYS = JSON.stringify(existingKeys);
			
			const device1SessionId = 'session-device1-001';
			const device2SessionId = 'session-device2-001';
			
			// STEP 1: Initialize Device 1 (Phone with dark theme)
			const device1Handshake = await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: null,
					newSessionId: device1SessionId
				})
			}, env);
			expect(device1Handshake.status).toBe(200);
			
			// Set dark theme for device 1
			await app.request('/task/api/preferences', {
				method: 'PUT',
				headers: {
					...adminHeaders,
					'X-Session-Id': device1SessionId
				},
				body: JSON.stringify({
					theme: 'dark',
					device: 'phone',
					fontSize: 16
				})
			}, env);
			
			// STEP 2: Initialize Device 2 (Desktop with light theme)
			const device2Handshake = await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: null,
					newSessionId: device2SessionId
				})
			}, env);
			expect(device2Handshake.status).toBe(200);
			
			// Set light theme for device 2
			await app.request('/task/api/preferences', {
				method: 'PUT',
				headers: {
					...adminHeaders,
					'X-Session-Id': device2SessionId
				},
				body: JSON.stringify({
					theme: 'light',
					device: 'desktop',
					fontSize: 14
				})
			}, env);
			
			// STEP 3: Verify both preferences exist in KV with correct values
			const device1PrefsInKV = await env.TASKS_KV.get(`prefs:${device1SessionId}`, 'json') as any;
			const device2PrefsInKV = await env.TASKS_KV.get(`prefs:${device2SessionId}`, 'json') as any;
			
			expect(device1PrefsInKV).toBeDefined();
			expect(device1PrefsInKV.theme).toBe('dark');
			expect(device1PrefsInKV.device).toBe('phone');
			expect(device1PrefsInKV.fontSize).toBe(16);
			
			expect(device2PrefsInKV).toBeDefined();
			expect(device2PrefsInKV.theme).toBe('light');
			expect(device2PrefsInKV.device).toBe('desktop');
			expect(device2PrefsInKV.fontSize).toBe(14);
			
			// STEP 4: Load Device 2 first (reverse order test)
			const loadDevice2 = await app.request('/task/api/preferences', {
				method: 'GET',
				headers: {
					...adminHeaders,
					'X-Session-Id': device2SessionId
				}
			}, env);
			
			expect(loadDevice2.status).toBe(200);
			const device2Loaded: any = await loadDevice2.json();
			expect(device2Loaded.theme).toBe('light');
			expect(device2Loaded.device).toBe('desktop');
			expect(device2Loaded.fontSize).toBe(14);
			
			// STEP 5: Load Device 1 second (reverse order test)
			const loadDevice1 = await app.request('/task/api/preferences', {
				method: 'GET',
				headers: {
					...adminHeaders,
					'X-Session-Id': device1SessionId
				}
			}, env);
			
			expect(loadDevice1.status).toBe(200);
			const device1Loaded: any = await loadDevice1.json();
			expect(device1Loaded.theme).toBe('dark');
			expect(device1Loaded.device).toBe('phone');
			expect(device1Loaded.fontSize).toBe(16);
			
			// STEP 6: Update Device 1 preferences
			await app.request('/task/api/preferences', {
				method: 'PUT',
				headers: {
					...adminHeaders,
					'X-Session-Id': device1SessionId
				},
				body: JSON.stringify({
					theme: 'strawberry', // Change theme
					fontSize: 18 // Change font size
				})
			}, env);
			
			// STEP 7: Verify Device 1 preferences updated in KV
			const device1UpdatedInKV = await env.TASKS_KV.get(`prefs:${device1SessionId}`, 'json') as any;
			expect(device1UpdatedInKV.theme).toBe('strawberry');
			expect(device1UpdatedInKV.fontSize).toBe(18);
			expect(device1UpdatedInKV.device).toBe('phone'); // Should be preserved
			
			// STEP 8: Verify Device 2 preferences unchanged in KV
			const device2StillInKV = await env.TASKS_KV.get(`prefs:${device2SessionId}`, 'json') as any;
			expect(device2StillInKV.theme).toBe('light'); // Should not be affected
			expect(device2StillInKV.device).toBe('desktop');
			expect(device2StillInKV.fontSize).toBe(14);
			
			// STEP 9: Verify session mapping contains both devices
			const mapping = await env.TASKS_KV.get(`session-map:${uniqueKey}`, 'json') as any;
			expect(mapping).toBeDefined();
			expect(mapping.sessionIds).toHaveLength(2);
			expect(mapping.sessionIds).toContain(device1SessionId);
			expect(mapping.sessionIds).toContain(device2SessionId);
			expect(mapping.lastSessionId).toBe(device2SessionId); // Most recent
			
			// STEP 10: Verify both session infos exist
			const device1Info = await env.TASKS_KV.get(`session-info:${device1SessionId}`, 'json') as any;
			const device2Info = await env.TASKS_KV.get(`session-info:${device2SessionId}`, 'json') as any;
			
			expect(device1Info).toBeDefined();
			expect(device1Info.authKey).toBe(uniqueKey);
			expect(device2Info).toBeDefined();
			expect(device2Info.authKey).toBe(uniqueKey);
		});
	});
});
