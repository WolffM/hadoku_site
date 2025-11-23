/**
 * Contact Admin Configuration
 * Centralizes all constants, configuration, and hardcoded values
 */

// Valid email recipients for the contact form
export const VALID_RECIPIENTS = [
	'matthaeus@hadoku.me',
	'mw@hadoku.me',
	'business@hadoku.me',
	'support@hadoku.me',
	'no-reply@hadoku.me',
	'hello@hadoku.me',
	'public@hadoku.me', // Public-facing mailbox (bypasses whitelist/referrer checks)
	'meeting@hadoku.me', // Meeting scheduling mailbox
	'alert@hadoku.me', // Alert mailbox
] as const;

// Timezone options for appointment scheduling
export const TIMEZONE_OPTIONS = [
	{ value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT)' },
	{ value: 'America/Denver', label: 'Mountain Time (MST/MDT)' },
	{ value: 'America/Chicago', label: 'Central Time (CST/CDT)' },
	{ value: 'America/New_York', label: 'Eastern Time (EST/EDT)' },
	{ value: 'UTC', label: 'UTC' },
] as const;

// Days of the week mapping
export const DAYS_OF_WEEK = [
	{ value: 0, short: 'Sun', long: 'Sunday' },
	{ value: 1, short: 'Mon', long: 'Monday' },
	{ value: 2, short: 'Tue', long: 'Tuesday' },
	{ value: 3, short: 'Wed', long: 'Wednesday' },
	{ value: 4, short: 'Thu', long: 'Thursday' },
	{ value: 5, short: 'Fri', long: 'Friday' },
	{ value: 6, short: 'Sat', long: 'Saturday' },
] as const;

// Meeting platforms configuration
export interface PlatformConfig {
	id: string;
	label: string;
	todoNote?: string;
}

export const MEETING_PLATFORMS: PlatformConfig[] = [
	{ id: 'discord', label: 'Discord' },
	{ id: 'google', label: 'Google Meet', todoNote: 'TODO: Integrate Google Calendar API' },
	{ id: 'teams', label: 'Microsoft Teams', todoNote: 'TODO: Integrate Microsoft Graph API' },
	{ id: 'jitsi', label: 'Jitsi', todoNote: 'TODO: Login to meet.jit.si' },
] as const;

// Pagination configuration
export const PAGINATION = {
	DEFAULT_LIMIT: 100,
	DEFAULT_OFFSET: 0,
} as const;

// LocalStorage keys
export const STORAGE_KEYS = {
	READ_EMAILS: 'hadoku_read_emails',
	PAST_RECIPIENTS: 'hadoku_past_recipients',
} as const;

// API endpoints
export const API_ENDPOINTS = {
	// Auth
	SESSION_CREATE: 'https://hadoku.me/session/create',

	// Submissions
	SUBMISSIONS: '/contact/api/admin/submissions',
	SUBMISSION_BY_ID: (id: string) => `/contact/api/admin/submissions/${id}`,
	SUBMISSION_RESTORE: (id: string) => `/contact/api/admin/submissions/${id}/restore`,

	// Email
	SEND_EMAIL: '/contact/api/admin/send-email',

	// Whitelist
	WHITELIST: '/contact/api/admin/whitelist',
	WHITELIST_EMAIL: (email: string) => `/contact/api/admin/whitelist/${encodeURIComponent(email)}`,

	// Appointments
	APPOINTMENT_CONFIG: '/contact/api/admin/appointments/config',
} as const;

// Input validation constraints
export const VALIDATION = {
	EMAIL_MIN_LENGTH: 5,
	EMAIL_MAX_LENGTH: 100,
	SUBJECT_MIN_LENGTH: 1,
	SUBJECT_MAX_LENGTH: 200,
	MESSAGE_MIN_LENGTH: 1,
	MESSAGE_MAX_LENGTH: 5000,
} as const;

// UI Configuration
export const UI_CONFIG = {
	SIDEBAR_WIDTH: 'w-64',
	EMAIL_LIST_WIDTH: 'w-96',
	MODAL_MAX_WIDTH: 'max-w-2xl',
	MODAL_MAX_HEIGHT: 'max-h-[80vh]',
} as const;
