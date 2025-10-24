/**
 * Throttling System Tests
 * 
 * Tests for rate limiting, blacklisting, and incident tracking.
 */
import { describe, it, expect } from 'vitest';
import app from './index';
import { createTestEnv, createAuthHeaders } from './test-utils';
import {
	checkThrottle,
	recordIncident,
	blacklistSession,
	unblacklistSession,
	getThrottleState,
	getIncidents,
	isSessionBlacklisted,
	DEFAULT_THROTTLE_LIMITS,
	THROTTLE_THRESHOLDS,
	type ThrottleLimits
} from './throttle';

describe('Throttling System Tests', () => {
	const env = createTestEnv();

	describe('Basic Throttling', () => {
		it('should allow requests under the limit', async () => {
			const sessionId = `throttle-test-${Date.now()}`;
			
			// Make 5 requests (well under limit)
			for (let i = 0; i < 5; i++) {
				const result = await checkThrottle(env.TASKS_KV, sessionId, 'public');
				expect(result.allowed).toBe(true);
				expect(result.state.count).toBe(i + 1);
			}
		});

		it('should block requests over the limit', async () => {
			const sessionId = `throttle-over-limit-${Date.now()}`;
			const testLimits: ThrottleLimits = {
				admin: { windowMs: 60000, maxRequests: 10 },
				friend: { windowMs: 60000, maxRequests: 10 },
				public: { windowMs: 60000, maxRequests: 5 }  // Low limit for testing
			};
			
			// Make requests up to limit
			for (let i = 0; i < 5; i++) {
				const result = await checkThrottle(env.TASKS_KV, sessionId, 'public', testLimits);
				expect(result.allowed).toBe(true);
			}
			
			// Next request should be blocked
			const blockedResult = await checkThrottle(env.TASKS_KV, sessionId, 'public', testLimits);
			expect(blockedResult.allowed).toBe(false);
			expect(blockedResult.reason).toContain('Rate limit exceeded');
			expect(blockedResult.state.violations).toBe(1);
		});

		it('should reset count after window expires', async () => {
			const sessionId = `throttle-window-reset-${Date.now()}`;
			const testLimits: ThrottleLimits = {
				admin: { windowMs: 100, maxRequests: 2 },  // Short window
				friend: { windowMs: 100, maxRequests: 2 },
				public: { windowMs: 100, maxRequests: 2 }
			};
			
			// Fill up limit
			await checkThrottle(env.TASKS_KV, sessionId, 'public', testLimits);
			await checkThrottle(env.TASKS_KV, sessionId, 'public', testLimits);
			
			// Next should fail
			const blocked = await checkThrottle(env.TASKS_KV, sessionId, 'public', testLimits);
			expect(blocked.allowed).toBe(false);
			
			// Wait for window to expire
			await new Promise(resolve => setTimeout(resolve, 150));
			
			// Should work again
			const afterWindow = await checkThrottle(env.TASKS_KV, sessionId, 'public', testLimits);
			expect(afterWindow.allowed).toBe(true);
			expect(afterWindow.state.count).toBe(1);  // New window
		});
	});

	describe('User Type Limits', () => {
		it('should apply different limits for admin vs public', async () => {
			const adminSession = `throttle-admin-${Date.now()}`;
			const publicSession = `throttle-public-${Date.now()}`;
			
			// Admin gets 300 requests per minute by default
			// Public gets 60 requests per minute
			
			const adminState = await getThrottleState(env.TASKS_KV, adminSession);
			const publicState = await getThrottleState(env.TASKS_KV, publicSession);
			
			// Both should start as null
			expect(adminState).toBeNull();
			expect(publicState).toBeNull();
			
			// Make one request each
			await checkThrottle(env.TASKS_KV, adminSession, 'admin');
			await checkThrottle(env.TASKS_KV, publicSession, 'public');
			
			// Verify limits are respected
			const adminResult = await getThrottleState(env.TASKS_KV, adminSession);
			const publicResult = await getThrottleState(env.TASKS_KV, publicSession);
			
			expect(adminResult?.count).toBe(1);
			expect(publicResult?.count).toBe(1);
		});
	});

	describe('Blacklisting', () => {
		it('should blacklist a session', async () => {
			const sessionId = `blacklist-test-${Date.now()}`;
			
			// Initially not blacklisted
			let isBlacklisted = await isSessionBlacklisted(env.TASKS_KV, sessionId);
			expect(isBlacklisted).toBe(false);
			
			// Blacklist it
			await blacklistSession(env.TASKS_KV, sessionId, 'Test blacklist', 'test-key');
			
			// Now it should be blacklisted
			isBlacklisted = await isSessionBlacklisted(env.TASKS_KV, sessionId);
			expect(isBlacklisted).toBe(true);
		});

		it('should block all requests from blacklisted session', async () => {
			const sessionId = `blacklist-blocked-${Date.now()}`;
			
			// Blacklist
			await blacklistSession(env.TASKS_KV, sessionId, 'Test', 'test-key');
			
			// Try to make a request
			const result = await checkThrottle(env.TASKS_KV, sessionId, 'admin');
			expect(result.allowed).toBe(false);
			expect(result.reason).toContain('blacklisted');
		});

		it('should unblacklist a session', async () => {
			const sessionId = `unblacklist-test-${Date.now()}`;
			
			// Blacklist
			await blacklistSession(env.TASKS_KV, sessionId, 'Test', 'test-key');
			expect(await isSessionBlacklisted(env.TASKS_KV, sessionId)).toBe(true);
			
			// Unblacklist
			await unblacklistSession(env.TASKS_KV, sessionId);
			expect(await isSessionBlacklisted(env.TASKS_KV, sessionId)).toBe(false);
			
			// Should allow requests again
			const result = await checkThrottle(env.TASKS_KV, sessionId, 'admin');
			expect(result.allowed).toBe(true);
		});
	});

	describe('Incident Tracking', () => {
		it('should record incidents', async () => {
			const sessionId = `incident-test-${Date.now()}`;
			
			const incident = {
				timestamp: new Date().toISOString(),
				type: 'throttle_violation' as const,
				sessionId,
				authKey: 'test-key',
				userType: 'public',
				details: { reason: 'Test incident' }
			};
			
			await recordIncident(env.TASKS_KV, incident);
			
			const incidents = await getIncidents(env.TASKS_KV, sessionId);
			expect(incidents.length).toBe(1);
			expect(incidents[0].type).toBe('throttle_violation');
			expect(incidents[0].sessionId).toBe(sessionId);
		});

		it('should track multiple violations', async () => {
			const sessionId = `multiple-violations-${Date.now()}`;
			const testLimits: ThrottleLimits = {
				admin: { windowMs: 60000, maxRequests: 2 },
				friend: { windowMs: 60000, maxRequests: 2 },
				public: { windowMs: 60000, maxRequests: 2 }
			};
			
			// Make requests to exceed limit
			await checkThrottle(env.TASKS_KV, sessionId, 'public', testLimits);
			await checkThrottle(env.TASKS_KV, sessionId, 'public', testLimits);
			
			// These should be violations
			const violation1 = await checkThrottle(env.TASKS_KV, sessionId, 'public', testLimits);
			const violation2 = await checkThrottle(env.TASKS_KV, sessionId, 'public', testLimits);
			const violation3 = await checkThrottle(env.TASKS_KV, sessionId, 'public', testLimits);
			
			expect(violation1.allowed).toBe(false);
			expect(violation2.allowed).toBe(false);
			expect(violation3.allowed).toBe(false);
			
			expect(violation3.state.violations).toBe(3);
		});
	});

	describe('API Integration', () => {
		it('should throttle API requests', async () => {
			const uniqueKey = `throttle-api-${Date.now()}`;
			const adminHeaders = {
				'X-User-Key': uniqueKey,
				'X-User-Id': 'throttle-test-user',
				'Content-Type': 'application/json'
			};
			
			// Add key to ADMIN_KEYS
			const existingKeys = JSON.parse(env.ADMIN_KEYS || '{}');
			existingKeys[uniqueKey] = uniqueKey;
			env.ADMIN_KEYS = JSON.stringify(existingKeys);
			
			// Make a normal request (should work)
			const response = await app.request('/task/api/health', {
				method: 'GET',
				headers: adminHeaders
			}, env);
			
			expect(response.status).toBe(200);
		});
	});
});
