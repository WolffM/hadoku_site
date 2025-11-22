/**
 * Contact Admin API Client
 * Centralized API calls with consistent error handling and type safety
 */

import { API_ENDPOINTS, PAGINATION } from '../../config/contact-admin';
import {
	ApiError,
	type Email,
	type GetSubmissionsResponse,
	type WhitelistEntry,
	type GetWhitelistResponse,
	type AppointmentConfig,
	type GetAppointmentConfigResponse,
	type SendEmailRequest,
	type SendEmailResponse,
	type ApiResponse,
} from './types';

/**
 * Contact Admin API Client
 * All methods require an admin key for authentication
 */
export class ContactAdminClient {
	constructor(private adminKey: string) {}

	/**
	 * Create headers with admin key
	 */
	private getHeaders(includeContentType = false): HeadersInit {
		const headers: Record<string, string> = {
			'X-User-Key': this.adminKey,
		};

		if (includeContentType) {
			headers['Content-Type'] = 'application/json';
		}

		return headers;
	}

	/**
	 * Generic fetch wrapper with error handling
	 */
	private async fetch<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
		try {
			const response = await fetch(url, {
				...options,
				headers: {
					...this.getHeaders(options.method !== 'GET'),
					...options.headers,
				},
			});

			if (!response.ok) {
				const errorData = (await response.json().catch(() => ({ message: 'Unknown error' }))) as {
					message?: string;
				};
				throw new ApiError(
					errorData.message ?? `Request failed: ${response.statusText}`,
					response.status,
					errorData
				);
			}

			return (await response.json()) as T;
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			throw new ApiError('Network error', undefined, error);
		}
	}

	// ========================================================================
	// Submissions / Emails
	// ========================================================================

	/**
	 * Get all email submissions
	 */
	async getEmails(
		limit: number = PAGINATION.DEFAULT_LIMIT,
		offset: number = PAGINATION.DEFAULT_OFFSET
	): Promise<GetSubmissionsResponse> {
		const url = `${API_ENDPOINTS.SUBMISSIONS}?limit=${limit}&offset=${offset}`;
		return this.fetch<GetSubmissionsResponse>(url);
	}

	/**
	 * Get a single submission by ID
	 */
	async getEmailById(id: string): Promise<Email> {
		const response = await this.fetch<ApiResponse<{ submission: Email }>>(
			API_ENDPOINTS.SUBMISSION_BY_ID(id)
		);
		if (!response.data) {
			throw new ApiError('No data in response');
		}
		return response.data.submission;
	}

	/**
	 * Delete (soft delete/trash) an email submission
	 */
	async deleteEmail(id: string): Promise<boolean> {
		const response = await this.fetch<ApiResponse>(API_ENDPOINTS.SUBMISSION_BY_ID(id), {
			method: 'DELETE',
		});
		return response.success;
	}

	/**
	 * Restore an email from trash
	 */
	async restoreEmail(id: string): Promise<boolean> {
		const response = await this.fetch<ApiResponse>(API_ENDPOINTS.SUBMISSION_RESTORE(id), {
			method: 'POST',
		});
		return response.success;
	}

	// ========================================================================
	// Email Sending
	// ========================================================================

	/**
	 * Send an outgoing email
	 */
	async sendEmail(request: SendEmailRequest): Promise<SendEmailResponse> {
		return this.fetch<SendEmailResponse>(API_ENDPOINTS.SEND_EMAIL, {
			method: 'POST',
			body: JSON.stringify(request),
		});
	}

	// ========================================================================
	// Whitelist
	// ========================================================================

	/**
	 * Get all whitelisted email addresses
	 */
	async getWhitelist(): Promise<WhitelistEntry[]> {
		const response = await this.fetch<GetWhitelistResponse>(API_ENDPOINTS.WHITELIST);
		return response.data.emails;
	}

	/**
	 * Add an email to the whitelist
	 */
	async addToWhitelist(email: string, notes?: string): Promise<boolean> {
		const response = await this.fetch<ApiResponse>(API_ENDPOINTS.WHITELIST, {
			method: 'POST',
			body: JSON.stringify({ email, notes }),
		});
		return response.success;
	}

	/**
	 * Remove an email from the whitelist
	 */
	async removeFromWhitelist(email: string): Promise<boolean> {
		const response = await this.fetch<ApiResponse>(API_ENDPOINTS.WHITELIST_EMAIL(email), {
			method: 'DELETE',
		});
		return response.success;
	}

	// ========================================================================
	// Appointment Configuration
	// ========================================================================

	/**
	 * Get appointment configuration
	 */
	async getAppointmentConfig(): Promise<AppointmentConfig> {
		const response = await this.fetch<GetAppointmentConfigResponse>(
			API_ENDPOINTS.APPOINTMENT_CONFIG
		);
		return response.data.config;
	}

	/**
	 * Update appointment configuration
	 */
	async saveAppointmentConfig(config: Partial<AppointmentConfig>): Promise<boolean> {
		const response = await this.fetch<ApiResponse>(API_ENDPOINTS.APPOINTMENT_CONFIG, {
			method: 'PUT',
			body: JSON.stringify(config),
		});
		return response.success;
	}
}
