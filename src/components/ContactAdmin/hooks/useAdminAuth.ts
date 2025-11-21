/**
 * Hook for handling admin authentication
 */

import { useState, useEffect } from 'react';
import { validateAdminKey, getAdminKeyFromUrl } from '../../../lib/api/auth-client';

interface UseAdminAuthResult {
	adminKey: string | null;
	keyValidated: boolean;
	loading: boolean;
	error: string | null;
}

/**
 * Hook to validate admin key from URL parameters
 */
export function useAdminAuth(): UseAdminAuthResult {
	const [adminKey, setAdminKey] = useState<string | null>(null);
	const [keyValidated, setKeyValidated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function validateKey() {
			// Get key from URL
			const key = getAdminKeyFromUrl();

			if (!key) {
				setError('No admin key provided');
				setLoading(false);
				return;
			}

			try {
				// Validate key by calling session endpoint
				await validateAdminKey(key);

				// Key is valid, save it
				setAdminKey(key);
				setKeyValidated(true);
				setLoading(false);
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to validate admin key';
				setError(message);
				setLoading(false);
			}
		}

		validateKey().catch(console.error);
	}, []);

	return {
		adminKey,
		keyValidated,
		loading,
		error,
	};
}
