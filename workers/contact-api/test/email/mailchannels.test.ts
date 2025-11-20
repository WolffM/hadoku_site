/**
 * MailChannels Provider Tests
 *
 * Tests the MailChannels email provider implementation
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MailChannelsProvider } from '../../src/email/mailchannels';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* global global */

describe('MailChannels Provider', () => {
	let provider: MailChannelsProvider;

	beforeEach(() => {
		provider = new MailChannelsProvider();
		// Clear any previous fetch mocks
		vi.restoreAllMocks();
	});

	it('should send email successfully', async () => {
		// Mock successful MailChannels API response
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 202,
			text: async () => 'Accepted',
		});

		const result = await provider.sendEmail({
			from: 'test@hadoku.me',
			to: 'recipient@example.com',
			subject: 'Test Subject',
			text: 'Test message',
		});

		expect(result.success).toBe(true);
		expect(result.messageId).toBeDefined();
		expect(result.messageId).toContain('mailchannels-');
		expect(fetch).toHaveBeenCalledWith(
			'https://api.mailchannels.net/tx/v1/send',
			expect.objectContaining({
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			})
		);
	});

	it('should include replyTo when provided', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 202,
			text: async () => 'Accepted',
		});

		await provider.sendEmail({
			from: 'test@hadoku.me',
			to: 'recipient@example.com',
			subject: 'Test Subject',
			text: 'Test message',
			replyTo: 'reply@example.com',
		});

		const fetchCall = (fetch as any).mock.calls[0];
		const body = JSON.parse(fetchCall[1].body);
		expect(body.personalizations[0].reply_to).toEqual({ email: 'reply@example.com' });
	});

	it('should handle API errors', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 400,
			text: async () => 'Bad Request: Invalid email format',
		});

		const result = await provider.sendEmail({
			from: 'test@hadoku.me',
			to: 'invalid-email',
			subject: 'Test',
			text: 'Test',
		});

		expect(result.success).toBe(false);
		expect(result.error).toContain('MailChannels API error');
		expect(result.error).toContain('400');
	});

	it('should handle network errors', async () => {
		global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

		const result = await provider.sendEmail({
			from: 'test@hadoku.me',
			to: 'recipient@example.com',
			subject: 'Test',
			text: 'Test',
		});

		expect(result.success).toBe(false);
		expect(result.error).toContain('Network error');
	});

	it('should format email body correctly', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 202,
			text: async () => 'Accepted',
		});

		await provider.sendEmail({
			from: 'sender@hadoku.me',
			to: 'recipient@example.com',
			subject: 'Test Subject',
			text: 'Test message body',
		});

		const fetchCall = (fetch as any).mock.calls[0];
		const body = JSON.parse(fetchCall[1].body);

		expect(body).toMatchObject({
			personalizations: [
				{
					to: [{ email: 'recipient@example.com' }],
				},
			],
			from: {
				email: 'sender@hadoku.me',
				name: 'Hadoku Mail',
			},
			subject: 'Test Subject',
			content: [
				{
					type: 'text/plain',
					value: 'Test message body',
				},
			],
		});
	});
});
