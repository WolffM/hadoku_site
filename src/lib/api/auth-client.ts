/**
 * Authentication client for Contact Admin
 */

import { API_ENDPOINTS } from '../../config/contact-admin';
import { ApiError } from './types';

/**
 * Validate admin key by creating a session
 * @param key Admin key to validate
 * @returns true if key is valid
 * @throws ApiError if validation fails
 */
export async function validateAdminKey(key: string): Promise<boolean> {
	try {
		const response = await fetch(API_ENDPOINTS.SESSION_CREATE, {
			method: 'POST',
			headers: {
				'X-User-Key': key,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new ApiError('Invalid admin key', response.status);
		}

		return true;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError('Failed to validate admin key', undefined, error);
	}
}

/**
 * Get admin key from URL parameters
 * @returns Admin key if found in URL, null otherwise
 */
export function getAdminKeyFromUrl(): string | null {
	if (typeof window === 'undefined') return null;

	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('key');
}
