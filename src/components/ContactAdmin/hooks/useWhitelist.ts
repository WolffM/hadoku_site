/**
 * Hook for managing email whitelist
 */

import { useState, useCallback } from 'react';
import type { ContactAdminClient } from '../../../lib/api/contact-admin-client';
import type { WhitelistEntry } from '../../../lib/api/types';

interface UseWhitelistResult {
	whitelist: WhitelistEntry[];
	loading: boolean;
	showModal: boolean;
	openModal: () => void;
	closeModal: () => void;
	fetchWhitelist: () => Promise<void>;
	removeFromWhitelist: (email: string) => Promise<void>;
}

/**
 * Hook to manage email whitelist
 */
export function useWhitelist(client: ContactAdminClient | null): UseWhitelistResult {
	const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);

	// Fetch whitelist
	const fetchWhitelist = useCallback(async () => {
		if (!client) return;

		setLoading(true);
		try {
			const entries = await client.getWhitelist();
			setWhitelist(entries);
		} catch (err) {
			console.error('Failed to fetch whitelist:', err);
			alert('Failed to load whitelist');
		} finally {
			setLoading(false);
		}
	}, [client]);

	// Remove from whitelist
	const removeFromWhitelist = useCallback(
		async (email: string) => {
			if (!client) return;
			if (!confirm(`Remove ${email} from whitelist?`)) return;

			try {
				await client.removeFromWhitelist(email);
				// Refresh whitelist
				await fetchWhitelist();
				alert('Email removed from whitelist');
			} catch (err) {
				console.error('Failed to remove from whitelist:', err);
				alert('Failed to remove from whitelist');
			}
		},
		[client, fetchWhitelist]
	);

	// Modal controls
	const openModal = useCallback(() => {
		setShowModal(true);
		// Fetch whitelist when opening modal
		if (client) {
			fetchWhitelist().catch(console.error);
		}
	}, [client, fetchWhitelist]);

	const closeModal = useCallback(() => {
		setShowModal(false);
	}, []);

	return {
		whitelist,
		loading,
		showModal,
		openModal,
		closeModal,
		fetchWhitelist,
		removeFromWhitelist,
	};
}
