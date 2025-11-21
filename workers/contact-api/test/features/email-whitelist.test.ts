/**
 * Email Whitelist Feature Tests
 *
 * Tests the email whitelist functionality:
 * 1. Whitelisted emails can bypass referrer restrictions
 * 2. Emails are automatically whitelisted when admin replies
 * 3. Storage functions work correctly
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* global global */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import worker from '../../src/index';
import { createTestEnv, createAuthHeaders, makeRequest } from '../__helpers__/test-utils';
import {
	isEmailWhitelisted,
	addToWhitelist,
	removeFromWhitelist,
	getAllWhitelistedEmails,
} from '../../src/storage';

describe('Email Whitelist Storage Functions', () => {
	let db: D1Database;

	beforeEach(() => {
		const env = createTestEnv();
		db = env.DB;
	});

	describe('isEmailWhitelisted', () => {
		it('should return true for whitelisted email', async () => {
			const mockDb = {
				...db,
				prepare: vi.fn().mockReturnValue({
					bind: vi.fn().mockReturnValue({
						first: vi.fn().mockResolvedValue({ email: 'test@example.com' }),
					}),
				}),
			} as any;

			const result = await isEmailWhitelisted(mockDb, 'test@example.com');
			expect(result).toBe(true);
		});

		it('should return false for non-whitelisted email', async () => {
			const mockDb = {
				...db,
				prepare: vi.fn().mockReturnValue({
					bind: vi.fn().mockReturnValue({
						first: vi.fn().mockResolvedValue(null),
					}),
				}),
			} as any;

			const result = await isEmailWhitelisted(mockDb, 'test@example.com');
			expect(result).toBe(false);
		});

		it('should normalize email to lowercase', async () => {
			const mockDb = {
				...db,
				prepare: vi.fn().mockReturnValue({
					bind: vi.fn().mockReturnValue({
						first: vi.fn().mockResolvedValue({ email: 'test@example.com' }),
					}),
				}),
			} as any;

			await isEmailWhitelisted(mockDb, 'TEST@EXAMPLE.COM');
			expect(mockDb.prepare().bind).toHaveBeenCalledWith('test@example.com');
		});
	});

	describe('addToWhitelist', () => {
		it('should add email to whitelist successfully', async () => {
			const mockDb = {
				...db,
				prepare: vi.fn().mockReturnValue({
					bind: vi.fn().mockReturnValue({
						run: vi.fn().mockResolvedValue({ success: true }),
					}),
				}),
			} as any;

			const result = await addToWhitelist(
				mockDb,
				'test@example.com',
				'admin-123',
				'contact-456',
				'Test note'
			);
			expect(result).toBe(true);
		});

		it('should normalize email to lowercase when adding', async () => {
			const mockDb = {
				...db,
				prepare: vi.fn().mockReturnValue({
					bind: vi.fn().mockReturnValue({
						run: vi.fn().mockResolvedValue({ success: true }),
					}),
				}),
			} as any;

			await addToWhitelist(mockDb, 'TEST@EXAMPLE.COM', 'admin-123');
			const bindCall = mockDb.prepare().bind.mock.calls[0];
			expect(bindCall[0]).toBe('test@example.com');
		});

		it('should handle database errors gracefully', async () => {
			const mockDb = {
				...db,
				prepare: vi.fn().mockReturnValue({
					bind: vi.fn().mockReturnValue({
						run: vi.fn().mockRejectedValue(new Error('Database error')),
					}),
				}),
			} as any;

			const result = await addToWhitelist(mockDb, 'test@example.com', 'admin-123');
			expect(result).toBe(false);
		});
	});

	describe('removeFromWhitelist', () => {
		it('should remove email from whitelist', async () => {
			const mockDb = {
				...db,
				prepare: vi.fn().mockReturnValue({
					bind: vi.fn().mockReturnValue({
						run: vi.fn().mockResolvedValue({ success: true }),
					}),
				}),
			} as any;

			const result = await removeFromWhitelist(mockDb, 'test@example.com');
			expect(result).toBe(true);
		});
	});

	describe('getAllWhitelistedEmails', () => {
		it('should return all whitelisted emails', async () => {
			const mockEmails = [
				{
					email: 'user1@example.com',
					whitelisted_at: Date.now(),
					whitelisted_by: 'admin-1',
					contact_id: null,
					notes: null,
				},
				{
					email: 'user2@example.com',
					whitelisted_at: Date.now(),
					whitelisted_by: 'admin-2',
					contact_id: 'contact-123',
					notes: 'Test note',
				},
			];

			const mockDb = {
				...db,
				prepare: vi.fn().mockReturnValue({
					all: vi.fn().mockResolvedValue({ results: mockEmails }),
				}),
			} as any;

			const result = await getAllWhitelistedEmails(mockDb);
			expect(result).toEqual(mockEmails);
		});
	});
});

describe('Email Whitelist in Contact Submission', () => {
	let env: ReturnType<typeof createTestEnv>;

	beforeEach(() => {
		env = createTestEnv();
		vi.restoreAllMocks();
	});

	it('should allow whitelisted email without valid referrer', async () => {
		// Mock DB to return that email is whitelisted
		env.DB.prepare = vi.fn().mockReturnValue({
			bind: vi.fn().mockReturnValue({
				first: vi.fn().mockResolvedValue({ email: 'whitelisted@example.com' }),
				run: vi.fn().mockResolvedValue({ success: true }),
			}),
		}) as any;

		const response = await makeRequest(worker, env, '/contact/api/submit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'CF-Connecting-IP': '1.2.3.4',
				// No Referer header - normally would be rejected
			},
			body: {
				name: 'Test User',
				email: 'whitelisted@example.com',
				message: 'This should work because email is whitelisted',
			},
		});

		expect(response.status).toBe(201);
		const data = await response.json();
		expect(data.success).toBe(true);
	});

	it('should reject non-whitelisted email with invalid referrer', async () => {
		// Mock DB to return that email is NOT whitelisted
		env.DB.prepare = vi.fn().mockReturnValue({
			bind: vi.fn().mockReturnValue({
				first: vi.fn().mockResolvedValue(null),
				run: vi.fn().mockResolvedValue({ success: true, meta: {} }),
			}),
		}) as any;

		const response = await makeRequest(worker, env, '/contact/api/submit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'CF-Connecting-IP': '1.2.3.4',
				Referer: 'https://evil-site.com/spam',
			},
			body: {
				name: 'Test User',
				email: 'notwhitelisted@example.com',
				message: 'This should fail because email is not whitelisted',
			},
		});

		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data.message).toBe('Invalid referrer');
	});

	it('should allow non-whitelisted email with valid referrer', async () => {
		// Mock DB to return that email is NOT whitelisted
		env.DB.prepare = vi.fn().mockReturnValue({
			bind: vi.fn().mockReturnValue({
				first: vi.fn().mockResolvedValue(null),
				run: vi.fn().mockResolvedValue({ success: true }),
			}),
		}) as any;

		const response = await makeRequest(worker, env, '/contact/api/submit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'CF-Connecting-IP': '1.2.3.4',
				Referer: 'https://hadoku.me/contact',
			},
			body: {
				name: 'Test User',
				email: 'notwhitelisted@example.com',
				message: 'This should work because referrer is valid',
			},
		});

		expect(response.status).toBe(201);
		const data = await response.json();
		expect(data.success).toBe(true);
	});
});

describe('Auto-Whitelist on Admin Reply', () => {
	let env: ReturnType<typeof createTestEnv>;
	let headers: Record<string, string>;

	beforeEach(() => {
		env = createTestEnv();
		headers = createAuthHeaders('test-admin-key');
		vi.restoreAllMocks();
	});

	it('should whitelist recipient after sending email', async () => {
		// Mock Resend API
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ id: 'test-message-id' }),
		});

		// Track whitelist calls
		const whitelistCalls: any[] = [];
		env.DB.prepare = vi.fn((sql: string) => {
			return {
				bind: vi.fn((...args: any[]) => {
					if (sql.includes('INSERT INTO email_whitelist')) {
						whitelistCalls.push(args);
					}
					return {
						run: vi.fn().mockResolvedValue({ success: true, meta: {} }),
						first: vi.fn().mockResolvedValue(null),
					};
				}),
			};
		}) as any;

		const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
			method: 'POST',
			headers,
			body: {
				from: 'matthaeus@hadoku.me',
				to: 'recipient@example.com',
				subject: 'Test Reply',
				text: 'Thanks for contacting us!',
			},
		});

		// Log response for debugging
		const text = await response.text();
		let data;
		try {
			data = JSON.parse(text);
		} catch (e) {
			console.error('Response is not JSON:', text);
			throw e;
		}

		expect(response.status).toBe(200);
		expect(data).toBeDefined();
		expect(data.data.success).toBe(true);
		expect(data.data.whitelisted).toBe(true);

		// Verify whitelist was called
		expect(whitelistCalls.length).toBeGreaterThan(0);
		expect(whitelistCalls[0][0]).toBe('recipient@example.com');
	});

	it('should include contact ID in whitelist if provided', async () => {
		// Mock Resend API
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ id: 'test-message-id' }),
		});

		// Track whitelist calls
		const whitelistCalls: any[] = [];
		env.DB.prepare = vi.fn((sql: string) => {
			return {
				bind: vi.fn((...args: any[]) => {
					if (sql.includes('INSERT INTO email_whitelist')) {
						whitelistCalls.push(args);
					}
					return {
						run: vi.fn().mockResolvedValue({ success: true }),
						first: vi.fn().mockResolvedValue(null),
					};
				}),
			};
		}) as any;

		const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
			method: 'POST',
			headers,
			body: {
				from: 'matthaeus@hadoku.me',
				to: 'recipient@example.com',
				subject: 'Test Reply',
				text: 'Thanks for contacting us!',
				contactId: 'original-contact-123',
			},
		});

		expect(response.status).toBe(200);

		// Verify contact ID was included
		expect(whitelistCalls.length).toBeGreaterThan(0);
		expect(whitelistCalls[0][3]).toBe('original-contact-123');
	});
});
