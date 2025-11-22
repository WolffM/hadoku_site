/**
 * Hook for managing email submissions
 */

import { useState, useEffect, useCallback } from 'react';
import type { ContactAdminClient } from '../../../lib/api/contact-admin-client';
import { ContactAdminStorage } from '../../../lib/storage/contact-admin-storage';
import type { Email } from '../../../lib/api/types';

interface UseEmailsResult {
	emails: Email[];
	selectedEmail: Email | null;
	loading: boolean;
	refreshing: boolean;
	error: string | null;
	readEmails: Set<string>;
	selectEmail: (email: Email | null) => void;
	refreshEmails: () => Promise<void>;
	deleteEmail: (id: string) => Promise<void>;
	restoreEmail: (id: string) => Promise<void>;
}

/**
 * Hook to manage email submissions
 */
export function useEmails(client: ContactAdminClient | null): UseEmailsResult {
	const [emails, setEmails] = useState<Email[]>([]);
	const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [readEmails, setReadEmails] = useState<Set<string>>(new Set());

	// Load read emails from localStorage on mount
	useEffect(() => {
		const stored = ContactAdminStorage.getReadEmails();
		setReadEmails(stored);
	}, []);

	// Fetch emails on mount (after client is available)
	useEffect(() => {
		if (!client) return;

		async function fetchEmails() {
			try {
				const response = await client.getEmails();
				setEmails(response.data.submissions);
				setLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch emails');
				setLoading(false);
			}
		}

		fetchEmails().catch(console.error);
	}, [client]);

	// Refresh emails
	const refreshEmails = useCallback(async () => {
		if (!client) return;

		setRefreshing(true);
		try {
			const response = await client.getEmails();
			setEmails(response.data.submissions);
		} catch (err) {
			alert(`Failed to refresh emails: ${err instanceof Error ? err.message : 'Unknown error'}`);
		} finally {
			setRefreshing(false);
		}
	}, [client]);

	// Delete email (move to trash)
	const deleteEmail = useCallback(
		async (id: string) => {
			if (!client) return;
			if (!confirm('Move this email to trash?')) return;

			try {
				await client.deleteEmail(id);

				// Update status to deleted in state
				setEmails((prev) =>
					prev.map((email) =>
						email.id === id
							? { ...email, status: 'deleted' as const, deleted_at: Date.now() }
							: email
					)
				);

				if (selectedEmail?.id === id) {
					setSelectedEmail(null);
				}
			} catch (err) {
				alert(`Failed to delete email: ${err instanceof Error ? err.message : 'Unknown error'}`);
			}
		},
		[client, selectedEmail]
	);

	// Restore email from trash
	const restoreEmail = useCallback(
		async (id: string) => {
			if (!client) return;

			try {
				await client.restoreEmail(id);

				// Update status to unread in state
				setEmails((prev) =>
					prev.map((email) =>
						email.id === id ? { ...email, status: 'unread' as const, deleted_at: null } : email
					)
				);

				if (selectedEmail?.id === id) {
					setSelectedEmail((prev) =>
						prev ? { ...prev, status: 'unread' as const, deleted_at: null } : null
					);
				}
			} catch (err) {
				alert(`Failed to restore email: ${err instanceof Error ? err.message : 'Unknown error'}`);
			}
		},
		[client, selectedEmail]
	);

	// Select email and mark as read
	const selectEmail = useCallback(
		(email: Email | null) => {
			setSelectedEmail(email);

			// Mark as read in localStorage
			if (email && !readEmails.has(email.id)) {
				const updated = new Set(readEmails);
				updated.add(email.id);
				setReadEmails(updated);
				ContactAdminStorage.setReadEmails(updated);
			}
		},
		[readEmails]
	);

	return {
		emails,
		selectedEmail,
		loading,
		refreshing,
		error,
		readEmails,
		selectEmail,
		refreshEmails,
		deleteEmail,
		restoreEmail,
	};
}
