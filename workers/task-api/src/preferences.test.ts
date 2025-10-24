/**
 * Preferences Tests
 * 
 * Tests user preference storage and retrieval.
 */
import { describe, it, expect } from 'vitest';
import app from './index';
import { createTestEnv, createAuthHeaders, getPreferences, savePreferences } from './test-utils';

describe('User Preferences Tests', () => {
	const env = createTestEnv();
	const adminHeaders = createAuthHeaders(env, 'automated_testing_admin');

	it('should save and retrieve preferences', async () => {
		// 1. Get current preferences (should be system theme by default)
		const initialRes = await getPreferences(app, env, adminHeaders);
		expect(initialRes.status).toBe(200);
		const initial: any = await initialRes.json();
		expect(initial.theme).toBe('system'); // Updated to match new default

		// 2. Change theme to strawberry
		const updateRes1 = await savePreferences(app, env, adminHeaders, { theme: 'strawberry' });
		expect(updateRes1.status).toBe(200);

		// 3. Reload preferences to ensure they were saved
		const checkRes1 = await getPreferences(app, env, adminHeaders);
		expect(checkRes1.status).toBe(200);
		const check1: any = await checkRes1.json();
		expect(check1.theme).toBe('strawberry');

		// 4. Change theme back to light
		const updateRes2 = await savePreferences(app, env, adminHeaders, { theme: 'light' });
		expect(updateRes2.status).toBe(200);

		// 5. Reload preferences to ensure they were saved
		const checkRes2 = await getPreferences(app, env, adminHeaders);
		expect(checkRes2.status).toBe(200);
		const check2: any = await checkRes2.json();
		expect(check2.theme).toBe('light');
	});
});
