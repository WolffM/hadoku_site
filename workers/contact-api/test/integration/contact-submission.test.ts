/**
 * Contact Submission Integration Tests
 *
 * Tests the full contact submission flow including:
 * - POST /contact/api/submit endpoint
 * - D1 database storage verification
 * - Rate limiting with KV verification
 * - Referrer validation
 * - Honeypot detection
 * - Auto-whitelisting
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import worker from '../../src/index';
import { createTestEnv, createMockKV, createMockD1, makeRequest } from '../__helpers__/test-utils';

describe('Contact Submission Integration', () => {
	let env: ReturnType<typeof createTestEnv>;
	let mockDB: any;
	let mockKV: any;

	beforeEach(() => {
		mockDB = createMockD1();
		mockKV = createMockKV();
		env = {
			ADMIN_KEYS: JSON.stringify({ 'test-admin-key': 'admin' }),
			DB: mockDB,
			RATE_LIMIT_KV: mockKV,
			EMAIL_PROVIDER: 'resend',
			RESEND_API_KEY: 'test-api-key',
		};
		vi.restoreAllMocks();
	});

	describe('POST /contact/api/submit - Success Flow', () => {
		it('should create submission in D1 and track rate limit in KV', async () => {
			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'John Doe',
					email: 'john@example.com',
					message: 'Test message',
					recipient: 'matthaeus@hadoku.me',
				},
			});

			expect(response.status).toBe(201);
			const data = await response.json();
			expect(data.message).toBe('Message submitted successfully');

			// Verify D1 storage
			const submissions = mockDB._getSubmissions();
			expect(submissions).toHaveLength(1);
			expect(submissions[0]).toMatchObject({
				name: 'John Doe',
				email: 'john@example.com',
				message: 'Test message',
				status: 'unread',
				recipient: 'matthaeus@hadoku.me',
				ip_address: '203.0.113.1',
				referrer: 'https://hadoku.me/contact',
			});
			expect(submissions[0].id).toBeDefined();
			expect(submissions[0].created_at).toBeDefined();

			// Verify KV rate limit tracking
			const kvStore = mockKV._getStore();
			const rateLimitKey = Array.from(kvStore.keys()).find((key) => key.startsWith('ratelimit:'));
			expect(rateLimitKey).toBeDefined();
			if (rateLimitKey) {
				const rateLimitData = JSON.parse(kvStore.get(rateLimitKey)!);
				expect(rateLimitData.count).toBe(1);
				expect(rateLimitData.resetAt).toBeDefined();
			}
		});

		it('should handle multiple submissions from different IPs', async () => {
			// First submission
			await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'User One',
					email: 'user1@example.com',
					message: 'First message',
					recipient: 'matthaeus@hadoku.me',
				},
			});

			// Second submission from different IP
			await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.2',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'User Two',
					email: 'user2@example.com',
					message: 'Second message',
					recipient: 'mw@hadoku.me',
				},
			});

			// Verify both submissions in D1
			const submissions = mockDB._getSubmissions();
			expect(submissions).toHaveLength(2);
			expect(submissions[0].email).toBe('user1@example.com');
			expect(submissions[1].email).toBe('user2@example.com');

			// Verify separate rate limit entries in KV
			const kvStore = mockKV._getStore();
			const rateLimitKeys = Array.from(kvStore.keys()).filter((key) =>
				key.startsWith('ratelimit:')
			);
			expect(rateLimitKeys.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe('Rate Limiting', () => {
		it('should enforce rate limit after max submissions', async () => {
			const ipAddress = '203.0.113.1';
			const headers = {
				'Content-Type': 'application/json',
				'X-Forwarded-For': ipAddress,
				Referer: 'https://hadoku.me/contact',
			};

			// Make 5 successful submissions (should be the limit)
			for (let i = 0; i < 5; i++) {
				const response = await makeRequest(worker, env, '/contact/api/submit', {
					method: 'POST',
					headers,
					body: {
						name: `User ${i}`,
						email: `user${i}@example.com`,
						message: `Message ${i}`,
						recipient: 'matthaeus@hadoku.me',
					},
				});
				expect(response.status).toBe(201);
			}

			// 6th submission should be rate limited
			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers,
				body: {
					name: 'User 6',
					email: 'user6@example.com',
					message: 'This should be blocked',
					recipient: 'matthaeus@hadoku.me',
				},
			});

			expect(response.status).toBe(429);
			const data = await response.json();
			expect(data.message).toContain('Rate limit exceeded');

			// Verify only 5 submissions in D1
			const submissions = mockDB._getSubmissions();
			expect(submissions).toHaveLength(5);

			// Verify rate limit headers
			expect(response.headers.get('X-RateLimit-Limit')).toBe('5');
			expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
			expect(response.headers.get('Retry-After')).toBeDefined();
		});
	});

	describe('Validation', () => {
		it('should reject submission with invalid referrer', async () => {
			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://evil.com/spam',
				},
				body: {
					name: 'Spammer',
					email: 'spam@evil.com',
					message: 'Spam message',
					recipient: 'matthaeus@hadoku.me',
				},
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.message).toContain('Invalid referrer');

			// Verify no submission in D1
			const submissions = mockDB._getSubmissions();
			expect(submissions).toHaveLength(0);
		});

		it('should reject submission with honeypot field filled', async () => {
			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'Bot',
					email: 'bot@example.com',
					message: 'Bot message',
					recipient: 'matthaeus@hadoku.me',
					website: 'http://spam.com', // honeypot field
				},
			});

			expect(response.status).toBe(400);

			// Verify no submission in D1
			const submissions = mockDB._getSubmissions();
			expect(submissions).toHaveLength(0);
		});

		it('should reject submission with missing required fields', async () => {
			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'John Doe',
					// missing email
					message: 'Test message',
					recipient: 'matthaeus@hadoku.me',
				},
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.errors).toBeDefined();
			expect(data.errors.some((e: any) => e.path.includes('email'))).toBe(true);

			// Verify no submission in D1
			const submissions = mockDB._getSubmissions();
			expect(submissions).toHaveLength(0);
		});

		it('should reject submission with invalid email format', async () => {
			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'John Doe',
					email: 'not-an-email',
					message: 'Test message',
					recipient: 'matthaeus@hadoku.me',
				},
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.errors).toBeDefined();

			// Verify no submission in D1
			const submissions = mockDB._getSubmissions();
			expect(submissions).toHaveLength(0);
		});

		it('should reject submission with message too long', async () => {
			const longMessage = 'a'.repeat(10001); // Over 10k chars

			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'John Doe',
					email: 'john@example.com',
					message: longMessage,
					recipient: 'matthaeus@hadoku.me',
				},
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.errors).toBeDefined();

			// Verify no submission in D1
			const submissions = mockDB._getSubmissions();
			expect(submissions).toHaveLength(0);
		});
	});

	describe('Recipient Validation', () => {
		it('should accept valid recipients', async () => {
			const validRecipients = ['matthaeus@hadoku.me', 'mw@hadoku.me', 'admin@hadoku.me'];

			for (const recipient of validRecipients) {
				const response = await makeRequest(worker, env, '/contact/api/submit', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Forwarded-For': '203.0.113.1',
						Referer: 'https://hadoku.me/contact',
					},
					body: {
						name: 'John Doe',
						email: 'john@example.com',
						message: 'Test message',
						recipient,
					},
				});

				expect(response.status).toBe(201);
			}

			// Verify all submissions in D1
			const submissions = mockDB._getSubmissions();
			expect(submissions).toHaveLength(validRecipients.length);
		});

		it('should reject invalid recipient', async () => {
			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'John Doe',
					email: 'john@example.com',
					message: 'Test message',
					recipient: 'invalid@example.com',
				},
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.errors).toBeDefined();
			expect(data.errors.some((e: any) => e.path.includes('recipient'))).toBe(true);

			// Verify no submission in D1
			const submissions = mockDB._getSubmissions();
			expect(submissions).toHaveLength(0);
		});
	});
});
