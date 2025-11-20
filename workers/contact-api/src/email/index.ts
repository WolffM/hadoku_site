/**
 * Email service factory
 * Selects the appropriate email provider based on configuration
 */

import type { EmailProvider } from './provider';
import { MailChannelsProvider } from './mailchannels';
import { ResendProvider } from './resend';

export type { EmailProvider, EmailParams, EmailResponse } from './provider';

/**
 * Creates an email provider instance based on environment configuration
 *
 * To add a new provider:
 * 1. Create a new file (e.g., resend.ts) implementing EmailProvider
 * 2. Import it here
 * 3. Add a case in the switch statement
 * 4. Set EMAIL_PROVIDER env var to the new provider name
 *
 * @param providerName - The email provider to use (default: 'resend')
 * @param apiKey - API key for the provider (required for Resend, SendGrid, etc.)
 * @returns EmailProvider instance
 */
export function createEmailProvider(
	providerName: string = 'resend',
	apiKey?: string
): EmailProvider {
	switch (providerName.toLowerCase()) {
		case 'resend':
			if (!apiKey) {
				throw new Error('RESEND_API_KEY is required for Resend provider');
			}
			return new ResendProvider(apiKey);
		case 'mailchannels':
			return new MailChannelsProvider();
		// Future providers:
		// case 'sendgrid':
		//   return new SendGridProvider(apiKey);
		default:
			console.warn(`Unknown email provider: ${providerName}, falling back to Resend`);
			if (!apiKey) {
				throw new Error('RESEND_API_KEY is required');
			}
			return new ResendProvider(apiKey);
	}
}
