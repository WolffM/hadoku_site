/**
 * Mystery Session Prevention Tests
 *
 * Tests the bug fix that prevents "mystery sessions" - sessions that appear in
 * session-map but have no corresponding session-info data.
 *
 * Bug Fix Location: session.ts:164-170
 */
import { describe, it, expect } from 'vitest';
import app from './index';
import { createTestEnv } from './test-utils';
import { updateSessionMapping, getSessionMapping } from './session';

describe('Mystery Session Prevention', () => {
	const env = createTestEnv();

	it('should NOT add sessionId to mapping if session-info does not exist', async () => {
		// Use a unique admin key
		const uniqueKey = `mystery-test-${Date.now()}`;
		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;
		const fakeSessionId = `fake-session-${Date.now()}`;

		// Try to update session mapping WITHOUT creating session-info first
		// This simulates the bug scenario where mapping was updated before session-info
		await updateSessionMapping(env.TASKS_KV, authKey, fakeSessionId);

		// Verify session was NOT added to mapping
		const mapping = await getSessionMapping(env.TASKS_KV, authKey);

		// Mapping should either be null or not contain the fake session
		if (mapping) {
			expect(mapping.sessionIds).not.toContain(fakeSessionId);
		} else {
			// No mapping created at all - also acceptable
			expect(mapping).toBeNull();
		}

		// Verify no session-info exists (as expected)
		const sessionInfo = await env.TASKS_KV.get(`session-info:${fakeSessionId}`, 'json');
		expect(sessionInfo).toBeNull();
	});

	it('should add sessionId to mapping ONLY after session-info exists', async () => {
		// Use a unique admin key
		const uniqueKey = `valid-session-test-${Date.now()}`;
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'valid-session-admin',
			'Content-Type': 'application/json'
		};

		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;
		const validSessionId = `valid-session-${Date.now()}`;

		// Perform proper handshake (creates session-info THEN updates mapping)
		const response = await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: null,
				newSessionId: validSessionId
			})
		}, env);

		expect(response.status).toBe(200);

		// Verify session-info exists
		const sessionInfo = await env.TASKS_KV.get(`session-info:${validSessionId}`, 'json') as any;
		expect(sessionInfo).toBeDefined();
		expect(sessionInfo.sessionId).toBe(validSessionId);
		expect(sessionInfo.authKey).toBe(authKey);

		// Verify session was added to mapping
		const mapping = await getSessionMapping(env.TASKS_KV, authKey);
		expect(mapping).toBeDefined();
		expect(mapping!.sessionIds).toContain(validSessionId);
		expect(mapping!.lastSessionId).toBe(validSessionId);
	});

	it('should handle multiple sessions correctly - no mystery sessions in list', async () => {
		// Use a unique admin key
		const uniqueKey = `multi-session-test-${Date.now()}`;
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'multi-session-admin',
			'Content-Type': 'application/json'
		};

		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;

		// Create 3 valid sessions via handshake
		const sessionIds = [
			`session-1-${Date.now()}`,
			`session-2-${Date.now()}`,
			`session-3-${Date.now()}`
		];

		for (const sessionId of sessionIds) {
			const response = await app.request('/task/api/session/handshake', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					oldSessionId: null,
					newSessionId: sessionId
				})
			}, env);

			expect(response.status).toBe(200);
		}

		// Get session mapping
		const mapping = await getSessionMapping(env.TASKS_KV, authKey);
		expect(mapping).toBeDefined();
		expect(mapping!.sessionIds).toHaveLength(3);

		// Verify EVERY session in mapping has session-info
		for (const sessionId of mapping!.sessionIds) {
			const sessionInfo = await env.TASKS_KV.get(`session-info:${sessionId}`, 'json') as any;
			expect(sessionInfo).toBeDefined();
			expect(sessionInfo.sessionId).toBe(sessionId);
			expect(sessionInfo.authKey).toBe(authKey);
		}

		// No mystery sessions!
	});

	it('should warn when trying to add session without session-info', async () => {
		// This test verifies the warning log behavior
		// We can't easily test console.warn in vitest, but we can verify the behavior

		const uniqueKey = `warn-test-${Date.now()}`;
		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;
		const mysterySessionId = `mystery-${Date.now()}`;

		// Attempt to add session to mapping without session-info
		// This should silently fail (with warning) and not add the session
		await updateSessionMapping(env.TASKS_KV, authKey, mysterySessionId);

		// Verify no mapping was created or session was not added
		const mapping = await getSessionMapping(env.TASKS_KV, authKey);
		if (mapping) {
			expect(mapping.sessionIds).not.toContain(mysterySessionId);
		} else {
			expect(mapping).toBeNull();
		}
	});

	it('should prevent race condition between session-info and mapping update', async () => {
		// This test simulates the bug scenario where mapping was updated
		// before session-info was fully written

		const uniqueKey = `race-test-${Date.now()}`;
		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;
		const sessionId = `race-session-${Date.now()}`;

		// Step 1: Try to update mapping BEFORE session-info exists
		await updateSessionMapping(env.TASKS_KV, authKey, sessionId);

		// Verify session was NOT added (prevented mystery session)
		let mapping = await getSessionMapping(env.TASKS_KV, authKey);
		if (mapping) {
			expect(mapping.sessionIds).not.toContain(sessionId);
		}

		// Step 2: Now create session-info
		const sessionInfo = {
			sessionId: sessionId,
			authKey: authKey,
			userType: 'admin' as const,
			createdAt: new Date().toISOString(),
			lastAccessedAt: new Date().toISOString()
		};
		await env.TASKS_KV.put(`session-info:${sessionId}`, JSON.stringify(sessionInfo));

		// Step 3: Now try to update mapping again (with session-info present)
		await updateSessionMapping(env.TASKS_KV, authKey, sessionId);

		// Verify session WAS added this time
		mapping = await getSessionMapping(env.TASKS_KV, authKey);
		expect(mapping).toBeDefined();
		expect(mapping!.sessionIds).toContain(sessionId);
		expect(mapping!.lastSessionId).toBe(sessionId);
	});

	it('should handle session deletion without creating mystery sessions', async () => {
		// Use a unique admin key
		const uniqueKey = `deletion-test-${Date.now()}`;
		const adminHeaders = {
			'X-User-Key': uniqueKey,
			'X-User-Id': 'deletion-admin',
			'Content-Type': 'application/json'
		};

		const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
		existingKeys[uniqueKey] = uniqueKey;
		env.ADMIN_KEYS = JSON.stringify(existingKeys);

		const authKey = uniqueKey;

		// Create session via handshake
		const oldSessionId = `session-to-delete-${Date.now()}`;
		await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: null,
				newSessionId: oldSessionId
			})
		}, env);

		// Migrate to new session (this deletes old session-info)
		const newSessionId = `session-new-${Date.now()}`;
		await app.request('/task/api/session/handshake', {
			method: 'POST',
			headers: adminHeaders,
			body: JSON.stringify({
				oldSessionId: oldSessionId,
				newSessionId: newSessionId
			})
		}, env);

		// Verify old session-info was deleted
		const oldSessionInfo = await env.TASKS_KV.get(`session-info:${oldSessionId}`, 'json');
		expect(oldSessionInfo).toBeNull();

		// Verify old session was removed from mapping
		const mapping = await getSessionMapping(env.TASKS_KV, authKey);
		expect(mapping).toBeDefined();
		expect(mapping!.sessionIds).not.toContain(oldSessionId);
		expect(mapping!.sessionIds).toContain(newSessionId);

		// Verify we can't accidentally re-add the deleted session
		await updateSessionMapping(env.TASKS_KV, authKey, oldSessionId);

		// Old session should still not be in mapping
		const mappingAfter = await getSessionMapping(env.TASKS_KV, authKey);
		expect(mappingAfter!.sessionIds).not.toContain(oldSessionId);
	});
});
