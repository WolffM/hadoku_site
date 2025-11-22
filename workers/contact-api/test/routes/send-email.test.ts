/**
 * Send Email Endpoint Tests
 *
 * Tests the admin send-email endpoint with various scenarios
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import worker from '../../src/index';
import { createTestEnv, createAuthHeaders, makeRequest } from '../__helpers__/test-utils';

/* eslint-disable no-await-in-loop */
/* global global */

describe('POST /contact/api/admin/send-email', () => {
	let env: ReturnType<typeof createTestEnv>;
	let headers: Record<string, string>;

	beforeEach(() => {
		env = createTestEnv();
		headers = createAuthHeaders('test-admin-key');
		vi.restoreAllMocks();
	});

	it('should require admin authentication', async () => {
		const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: {
				from: 'test@hadoku.me',
				to: 'recipient@example.com',
				subject: 'Test',
				text: 'Test',
			},
		});

		expect(response.status).toBe(403);
		const data = await response.json();
		expect(data.message).toContain('Admin access required');
	});

	it('should send email successfully with valid data', async () => {
		// Mock Resend API
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ id: 'test-message-id' }),
		});

		const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
			method: 'POST',
			headers,
			body: {
				from: 'matthaeus@hadoku.me',
				to: 'test@example.com',
				subject: 'Test Email',
				text: 'This is a test email',
			},
		});

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.data.success).toBe(true);
		expect(data.data.message).toBe('Email sent successfully');
		expect(data.data.messageId).toBeDefined();
	});

	it('should validate required fields', async () => {
		const testCases = [
			{ field: 'from', body: { to: 'test@example.com', subject: 'Test', text: 'Test' } },
			{ field: 'to', body: { from: 'test@hadoku.me', subject: 'Test', text: 'Test' } },
			{ field: 'subject', body: { from: 'test@hadoku.me', to: 'test@example.com', text: 'Test' } },
			{ field: 'text', body: { from: 'test@hadoku.me', to: 'test@example.com', subject: 'Test' } },
		];

		for (const testCase of testCases) {
			const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
				method: 'POST',
				headers,
				body: testCase.body,
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.message || data.error).toContain(testCase.field);
		}
	});

	it('should reject non-hadoku.me sender addresses', async () => {
		const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
			method: 'POST',
			headers,
			body: {
				from: 'attacker@evil.com',
				to: 'victim@example.com',
				subject: 'Phishing',
				text: 'Click here',
			},
		});

		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data.message || data.error).toContain('hadoku.me');
	});

	it('should validate recipient email format', async () => {
		const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
			method: 'POST',
			headers,
			body: {
				from: 'test@hadoku.me',
				to: 'not-an-email',
				subject: 'Test',
				text: 'Test',
			},
		});

		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data.message || data.error).toContain('Invalid');
	});

	it('should handle replyTo parameter', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ id: 'test-message-id' }),
		});

		const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
			method: 'POST',
			headers,
			body: {
				from: 'support@hadoku.me',
				to: 'customer@example.com',
				subject: 'Re: Your inquiry',
				text: 'Thank you for contacting us',
				replyTo: 'original-sender@example.com',
			},
		});

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.data.success).toBe(true);
	});

	it('should handle email provider failures', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			text: async () => 'Internal Server Error',
		});

		const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
			method: 'POST',
			headers,
			body: {
				from: 'test@hadoku.me',
				to: 'recipient@example.com',
				subject: 'Test',
				text: 'Test',
			},
		});

		expect(response.status).toBe(500);
		const data = await response.json();
		expect(data.success || data.error).toBeDefined();
	});

	it('should accept all valid hadoku.me sender addresses', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ id: 'test-message-id' }),
		});

		const validSenders = [
			'matthaeus@hadoku.me',
			'mw@hadoku.me',
			'business@hadoku.me',
			'support@hadoku.me',
			'no-reply@hadoku.me',
			'hello@hadoku.me',
		];

		for (const sender of validSenders) {
			const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
				method: 'POST',
				headers,
				body: {
					from: sender,
					to: 'test@example.com',
					subject: 'Test',
					text: 'Test',
				},
			});

			expect(response.status).toBe(200);
		}
	});

	it('should use EMAIL_PROVIDER env variable', async () => {
		const customEnv = createTestEnv({ EMAIL_PROVIDER: 'resend', RESEND_API_KEY: 'test-key' });

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ id: 'test-message-id' }),
		});

		const response = await makeRequest(worker, customEnv, '/contact/api/admin/send-email', {
			method: 'POST',
			headers,
			body: {
				from: 'test@hadoku.me',
				to: 'recipient@example.com',
				subject: 'Test',
				text: 'Test',
			},
		});

		expect(response.status).toBe(200);
	});

	describe('Reply-To Logic', () => {
		it('should redirect replies to public@hadoku.me when from is no-reply@hadoku.me', async () => {
			let capturedBody: any;
			global.fetch = vi.fn().mockImplementation(async (_url, options) => {
				capturedBody = JSON.parse(options.body);
				return {
					ok: true,
					status: 200,
					json: async () => ({ id: 'test-message-id' }),
				};
			});

			const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
				method: 'POST',
				headers,
				body: {
					from: 'no-reply@hadoku.me',
					to: 'customer@example.com',
					subject: 'Notification',
					text: 'This is a no-reply notification',
				},
			});

			expect(response.status).toBe(200);
			// Verify the reply-to was set to public@hadoku.me (Resend uses array format)
			expect(capturedBody.reply_to).toContain('public@hadoku.me');
		});

		it('should use from address as reply-to when no explicit replyTo is provided', async () => {
			let capturedBody: any;
			global.fetch = vi.fn().mockImplementation(async (_url, options) => {
				capturedBody = JSON.parse(options.body);
				return {
					ok: true,
					status: 200,
					json: async () => ({ id: 'test-message-id' }),
				};
			});

			const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
				method: 'POST',
				headers,
				body: {
					from: 'support@hadoku.me',
					to: 'customer@example.com',
					subject: 'Support Reply',
					text: 'Thanks for reaching out',
				},
			});

			expect(response.status).toBe(200);
			// reply-to should match the from address (Resend uses array format)
			expect(capturedBody.reply_to).toContain('support@hadoku.me');
		});

		it('should use explicit replyTo when provided for non-no-reply senders', async () => {
			let capturedBody: any;
			global.fetch = vi.fn().mockImplementation(async (_url, options) => {
				capturedBody = JSON.parse(options.body);
				return {
					ok: true,
					status: 200,
					json: async () => ({ id: 'test-message-id' }),
				};
			});

			const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
				method: 'POST',
				headers,
				body: {
					from: 'matthaeus@hadoku.me',
					to: 'partner@example.com',
					subject: 'Partnership Inquiry',
					text: 'Regarding your proposal',
					replyTo: 'business@hadoku.me', // Explicit replyTo
				},
			});

			expect(response.status).toBe(200);
			// Should use the explicit replyTo (Resend uses array format)
			expect(capturedBody.reply_to).toContain('business@hadoku.me');
		});

		it('should always redirect no-reply@ to public@ even if explicit replyTo is provided', async () => {
			let capturedBody: any;
			global.fetch = vi.fn().mockImplementation(async (_url, options) => {
				capturedBody = JSON.parse(options.body);
				return {
					ok: true,
					status: 200,
					json: async () => ({ id: 'test-message-id' }),
				};
			});

			const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
				method: 'POST',
				headers,
				body: {
					from: 'no-reply@hadoku.me',
					to: 'user@example.com',
					subject: 'Automated Message',
					text: 'This is automated',
					replyTo: 'support@hadoku.me', // This should be overridden
				},
			});

			expect(response.status).toBe(200);
			// no-reply should always redirect to public, ignoring explicit replyTo (Resend uses array format)
			expect(capturedBody.reply_to).toContain('public@hadoku.me');
			expect(capturedBody.reply_to).not.toContain('support@hadoku.me');
		});
	});
});
