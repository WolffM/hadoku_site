/**
 * Hook for managing email whitelist
 */

import { useState, useCallback } from 'react';
import type { ContactAdminClient } from '../../../lib/api/contact-admin-client';
import type { WhitelistEntry } from '../../../lib/api/types';

type ShowToastFn = (
	message: string,
	type?: 'success' | 'error' | 'info' | 'warning',
	duration?: number
) => void;

interface UseWhitelistResult {
	whitelist: WhitelistEntry[];
	loading: boolean;
	showModal: boolean;
	openModal: () => void;
	closeModal: () => void;
	fetchWhitelist: () => Promise<void>;
	addToWhitelist: (email: string, notes?: string) => Promise<boolean>;
	removeFromWhitelist: (email: string) => Promise<void>;
}

/**
 * Hook to manage email whitelist
 */
export function useWhitelist(
	client: ContactAdminClient | null,
	showToast: ShowToastFn
): UseWhitelistResult {
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
			showToast('Failed to load whitelist', 'error');
		} finally {
			setLoading(false);
		}
	}, [client, showToast]);

	// Add to whitelist
	const addToWhitelist = useCallback(
		async (email: string, notes?: string): Promise<boolean> => {
			if (!client) return false;

			try {
				const success = await client.addToWhitelist(email, notes);
				if (success) {
					// Refresh whitelist
					await fetchWhitelist();
				}
				return success;
			} catch (err) {
				console.error('Failed to add to whitelist:', err);
				return false;
			}
		},
		[client, fetchWhitelist]
	);

	// Remove from whitelist
	const removeFromWhitelist = useCallback(
		async (email: string) => {
			if (!client) return;
			if (!confirm(`Remove ${email} from whitelist?`)) return;

			try {
				await client.removeFromWhitelist(email);
				// Refresh whitelist
				await fetchWhitelist();
				showToast('Email removed from whitelist', 'success');
			} catch (err) {
				console.error('Failed to remove from whitelist:', err);
				showToast('Failed to remove from whitelist', 'error');
			}
		},
		[client, fetchWhitelist, showToast]
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
		addToWhitelist,
		removeFromWhitelist,
	};
}
