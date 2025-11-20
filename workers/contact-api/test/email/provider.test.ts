/**
 * Email Provider Tests
 *
 * Tests the email provider interface and factory pattern
 */
import { describe, it, expect } from 'vitest';
import { createEmailProvider } from '../../src/email';
import { MailChannelsProvider } from '../../src/email/mailchannels';

describe('Email Provider Factory', () => {
	it('should create MailChannels provider by default', () => {
		const provider = createEmailProvider();
		expect(provider).toBeInstanceOf(MailChannelsProvider);
	});

	it('should create MailChannels provider when specified', () => {
		const provider = createEmailProvider('mailchannels');
		expect(provider).toBeInstanceOf(MailChannelsProvider);
	});

	it('should fall back to MailChannels for unknown providers', () => {
		const provider = createEmailProvider('unknown-provider');
		expect(provider).toBeInstanceOf(MailChannelsProvider);
	});

	it('should be case-insensitive', () => {
		const provider = createEmailProvider('MAILCHANNELS');
		expect(provider).toBeInstanceOf(MailChannelsProvider);
	});
});
