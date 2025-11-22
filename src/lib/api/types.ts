/**
 * Type definitions for Contact Admin API
 */

// ============================================================================
// Email/Submission Types
// ============================================================================

export interface Email {
	id: string;
	name: string;
	email: string;
	message: string;
	status: 'unread' | 'read' | 'archived' | 'deleted';
	created_at: number;
	deleted_at?: number | null;
	ip_address: string;
	referrer: string | null;
	recipient?: string; // Which email address they sent to
}

export interface SubmissionStats {
	total: number;
	unread: number;
	read: number;
	archived: number;
	deleted: number;
}

export interface GetSubmissionsResponse {
	success: boolean;
	data: {
		submissions: Email[];
		stats: SubmissionStats;
		pagination: {
			limit: number;
			offset: number;
			total: number;
		};
	};
}

// ============================================================================
// Whitelist Types
// ============================================================================

export interface WhitelistEntry {
	email: string;
	whitelisted_at: number;
	whitelisted_by: string;
	contact_id: string | null;
	notes: string | null;
}

export interface GetWhitelistResponse {
	success: boolean;
	data: {
		emails: WhitelistEntry[];
		total: number;
	};
}

// ============================================================================
// Appointment Types
// ============================================================================

export interface AppointmentConfig {
	timezone: string;
	start_hour: number; // Hour in 24h format (0-23)
	end_hour: number; // Hour in 24h format (0-23)
	available_days: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
	platforms: string[]; // Array of platform IDs: 'discord', 'google', 'teams', 'jitsi'
	advance_notice_hours: number; // Minimum hours required between booking and appointment
	slot_duration_options?: number[]; // Available slot durations in minutes (e.g., [15, 30, 60])
	max_advance_days?: number; // Maximum days in advance appointments can be booked
}

export interface GetAppointmentConfigResponse {
	success: boolean;
	data: {
		config: AppointmentConfig;
	};
}

// ============================================================================
// Email Sending Types
// ============================================================================

export interface SendEmailRequest {
	from: string;
	to: string;
	subject: string;
	text: string;
	replyTo?: string;
	contactId?: string;
}

export interface SendEmailResponse {
	success: boolean;
	data?: {
		messageId: string;
		whitelisted: boolean;
	};
	message?: string;
}

// ============================================================================
// Generic API Response
// ============================================================================

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// ============================================================================
// Error Types
// ============================================================================

export class ApiError extends Error {
	constructor(
		message: string,
		public status?: number,
		public response?: unknown
	) {
		super(message);
		this.name = 'ApiError';
	}
}
