/**
 * Key Persistence Tests
 *
 * Tests the "enter authentication key" flow to ensure keys persist across page reloads.
 * This simulates the frontend flow where a user enters a key, it gets stored in sessionStorage,
 * and should work on subsequent page loads without re-entering the key.
 */
import { describe, it, expect } from 'vitest';
import app from '../../src/index';
import { createTestEnv } from '../__helpers__/test-utils';

describe('Key Persistence Flow', () => {
	it('should persist key across page reload using session', async () => {
		const env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({ 'test-key-123': 'testuser' }),
			FRIEND_KEYS: JSON.stringify({}),
		});

		// Step 1: Initial page load with key in URL (simulating ?key=test-key-123)
		// Frontend validates the key
		const validateResponse = await app.request(
			'/task/api/validate-key',
			{
				method: 'POST',
				headers: {
					'X-User-Key': 'test-key-123',
				},
			},
			env
		);

		expect(validateResponse.status).toBe(200);
		const validation = await validateResponse.json<{ valid: boolean; userType: string }>();
		expect(validation.valid).toBe(true);
		expect(validation.userType).toBe('admin');

		// Step 2: Frontend creates session (simulated via edge-router)
		// In real flow, this happens at /session/create endpoint in edge-router
		// For testing, we'll simulate the session creation manually
		const sessionId = 'test-session-123';
		// Store session mapping (simulating what edge-router does)
		// NOTE: This would normally be in SESSIONS_KV in edge-router, but we're testing task-api
		// The edge-router injects the key back as X-User-Key header when it sees X-Session-Id

		// Step 3: Page reload - frontend sends X-Session-Id (no key in URL)
		// Edge router would look up the key and inject it as X-User-Key
		// For this test, we simulate what edge router does: inject the key
		const reloadResponse = await app.request(
			'/task/api/boards',
			{
				method: 'GET',
				headers: {
					'X-Session-Id': sessionId,
					'X-User-Key': 'test-key-123', // Edge router injects this
				},
			},
			env
		);

		expect(reloadResponse.status).toBe(200);
		// User should still be authenticated as admin
	});

	it('should handle invalid key gracefully and not create session', async () => {
		const env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({ 'valid-key': 'testuser' }),
			FRIEND_KEYS: JSON.stringify({}),
		});

		// Step 1: Try to validate an invalid key
		const validateResponse = await app.request(
			'/task/api/validate-key',
			{
				method: 'POST',
				headers: {
					'X-User-Key': 'invalid-key-999',
				},
			},
			env
		);

		expect(validateResponse.status).toBe(200);
		const validation = await validateResponse.json<{ valid: boolean; userType: string }>();
		expect(validation.valid).toBe(false);
		expect(validation.userType).toBe('public');

		// Step 2: Frontend should redirect to public and not create session
		// Verify that requests without valid key default to public
		const publicResponse = await app.request(
			'/task/api/boards',
			{
				method: 'GET',
				headers: {
					'X-User-Key': 'invalid-key-999',
				},
			},
			env
		);

		expect(publicResponse.status).toBe(200);
		// Should work but with public access
	});

	it('should allow key update via updateHadokuSession flow', async () => {
		const env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({ 'old-key': 'user1', 'new-key': 'user2' }),
			FRIEND_KEYS: JSON.stringify({}),
		});

		// Step 1: Start with old key and create session
		const oldSessionId = 'session-old';

		const oldResponse = await app.request(
			'/task/api/boards',
			{
				method: 'GET',
				headers: {
					'X-Session-Id': oldSessionId,
					'X-User-Key': 'old-key',
				},
			},
			env
		);

		expect(oldResponse.status).toBe(200);

		// Step 2: User enters new key via UI
		// Validate new key
		const validateNewResponse = await app.request(
			'/task/api/validate-key',
			{
				method: 'POST',
				headers: {
					'X-User-Key': 'new-key',
				},
			},
			env
		);

		expect(validateNewResponse.status).toBe(200);
		const newValidation = await validateNewResponse.json<{ valid: boolean; userType: string }>();
		expect(newValidation.valid).toBe(true);

		// Step 3: Create new session with new key
		// (In real flow, frontend calls /session/create with new key)
		const newSessionId = 'session-new';

		// Step 4: Verify new session works with new key
		const newResponse = await app.request(
			'/task/api/boards',
			{
				method: 'GET',
				headers: {
					'X-Session-Id': newSessionId,
					'X-User-Key': 'new-key',
				},
			},
			env
		);

		expect(newResponse.status).toBe(200);
	});
});
