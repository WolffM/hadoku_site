/**
 * Hook for managing email compose form
 */

import { useState, useCallback } from 'react';
import { ContactAdminClient } from '../../../lib/api/contact-admin-client';
import { ContactAdminStorage } from '../../../lib/storage/contact-admin-storage';
import { VALID_RECIPIENTS } from '../../../config/contact-admin';
import type { SendEmailRequest } from '../../../lib/api/types';

interface ComposeFormState {
	from: string;
	to: string;
	subject: string;
	message: string;
}

interface UseComposeFormResult {
	form: ComposeFormState;
	sending: boolean;
	pastRecipients: string[];
	setFrom: (from: string) => void;
	setTo: (to: string) => void;
	setSubject: (subject: string) => void;
	setMessage: (message: string) => void;
	sendEmail: () => Promise<boolean>;
	reset: () => void;
	replyTo: (email: string, name: string) => void;
}

/**
 * Hook to manage email composition
 */
export function useComposeForm(client: ContactAdminClient | null): UseComposeFormResult {
	const [form, setForm] = useState<ComposeFormState>({
		from: VALID_RECIPIENTS[0],
		to: '',
		subject: '',
		message: '',
	});
	const [sending, setSending] = useState(false);
	const [pastRecipients, setPastRecipients] = useState<string[]>(() => {
		return ContactAdminStorage.getPastRecipients();
	});

	// Form field setters
	const setFrom = useCallback((from: string) => {
		setForm((prev) => ({ ...prev, from }));
	}, []);

	const setTo = useCallback((to: string) => {
		setForm((prev) => ({ ...prev, to }));
	}, []);

	const setSubject = useCallback((subject: string) => {
		setForm((prev) => ({ ...prev, subject }));
	}, []);

	const setMessage = useCallback((message: string) => {
		setForm((prev) => ({ ...prev, message }));
	}, []);

	// Send email
	const sendEmail = useCallback(async (): Promise<boolean> => {
		if (!client) {
			alert('No admin client available');
			return false;
		}

		setSending(true);

		try {
			const request: SendEmailRequest = {
				from: form.from,
				to: form.to,
				subject: form.subject,
				text: form.message,
				replyTo: form.from,
			};

			await client.sendEmail(request);

			// Save recipient to past recipients
			if (form.to && !pastRecipients.includes(form.to)) {
				ContactAdminStorage.addPastRecipient(form.to);
				setPastRecipients((prev) => [...prev, form.to]);
			}

			// Success
			alert('Email sent successfully!');
			return true;
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Unknown error';
			alert(`Failed to send email: ${message}`);
			return false;
		} finally {
			setSending(false);
		}
	}, [client, form, pastRecipients]);

	// Reset form
	const reset = useCallback(() => {
		setForm({
			from: VALID_RECIPIENTS[0],
			to: '',
			subject: '',
			message: '',
		});
	}, []);

	// Set up reply
	const replyTo = useCallback((email: string, name: string) => {
		setForm((prev) => ({
			...prev,
			to: email,
			subject: `Re: Message from ${name}`,
		}));
	}, []);

	return {
		form,
		sending,
		pastRecipients,
		setFrom,
		setTo,
		setSubject,
		setMessage,
		sendEmail,
		reset,
		replyTo,
	};
}
