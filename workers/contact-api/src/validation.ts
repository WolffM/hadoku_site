/**
 * Validation utilities for contact form submissions
 */

export interface ContactSubmission {
	name: string;
	email: string;
	message: string;
	website?: string; // Honeypot field - should always be empty
}

export interface ValidationResult {
	valid: boolean;
	errors: string[];
	sanitized?: ContactSubmission;
}

/**
 * Email validation regex
 * Simple but effective pattern for most valid emails
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sanitize a string by trimming whitespace and limiting length
 */
function sanitizeString(value: string, maxLength: number): string {
	return value.trim().substring(0, maxLength);
}

/**
 * Check if honeypot field was filled (indicates bot)
 */
function isHoneypotFilled(website?: string): boolean {
	// If website field has any value, it's likely a bot
	return !!website && website.trim().length > 0;
}

/**
 * Validate contact form submission
 *
 * Security checks:
 * 1. Required fields present
 * 2. Field length limits
 * 3. Email format validation
 * 4. Honeypot detection
 * 5. String sanitization
 */
export function validateContactSubmission(data: any): ValidationResult {
	const errors: string[] = [];

	// Type check
	if (!data || typeof data !== 'object') {
		return { valid: false, errors: ['Invalid submission data'] };
	}

	// Honeypot check (do this first, before other validation)
	if (isHoneypotFilled(data.website)) {
		return {
			valid: false,
			errors: ['Submission rejected - bot detected'],
		};
	}

	// Required field checks
	if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
		errors.push('Name is required');
	}

	if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
		errors.push('Email is required');
	}

	if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
		errors.push('Message is required');
	}

	// If required fields missing, return early
	if (errors.length > 0) {
		return { valid: false, errors };
	}

	// Sanitize and validate individual fields
	const name = sanitizeString(data.name, 100);
	const email = sanitizeString(data.email, 100);
	const message = sanitizeString(data.message, 5000);

	// Length validation (after sanitization)
	if (name.length < 2) {
		errors.push('Name must be at least 2 characters');
	}

	if (email.length < 5) {
		errors.push('Email must be at least 5 characters');
	}

	if (message.length < 10) {
		errors.push('Message must be at least 10 characters');
	}

	// Email format validation
	if (!EMAIL_REGEX.test(email)) {
		errors.push('Email format is invalid');
	}

	// If any validation errors, return them
	if (errors.length > 0) {
		return { valid: false, errors };
	}

	// Return sanitized data
	return {
		valid: true,
		errors: [],
		sanitized: {
			name,
			email,
			message,
			website: '', // Always set to empty (honeypot)
		},
	};
}

/**
 * Extract client IP from request
 * Cloudflare adds CF-Connecting-IP header with real client IP
 */
export function extractClientIP(request: Request): string | null {
	// Cloudflare's header (most reliable)
	const cfIP = request.headers.get('CF-Connecting-IP');
	if (cfIP) return cfIP;

	// Fallback headers
	const xForwardedFor = request.headers.get('X-Forwarded-For');
	if (xForwardedFor) {
		// X-Forwarded-For can be a comma-separated list, take the first
		return xForwardedFor.split(',')[0].trim();
	}

	const xRealIP = request.headers.get('X-Real-IP');
	if (xRealIP) return xRealIP;

	return null;
}

/**
 * Extract referrer from request
 */
export function extractReferrer(request: Request): string | null {
	return request.headers.get('Referer') || request.headers.get('Referrer') || null;
}

/**
 * Validate referrer is from hadoku.me
 * Returns true if referrer is from allowed domain
 */
export function validateReferrer(request: Request): boolean {
	const referrer = extractReferrer(request);

	// No referrer is suspicious but we'll allow it for direct API access
	// You can make this stricter by returning false here
	if (!referrer) return true;

	try {
		const url = new URL(referrer);
		const hostname = url.hostname.toLowerCase();

		// Allow hadoku.me and any subdomain
		return hostname === 'hadoku.me' || hostname.endsWith('.hadoku.me');
	} catch {
		// Invalid URL
		return false;
	}
}

/**
 * Appointment validation types
 */

export interface AppointmentData {
	slotId: string;
	date: string; // YYYY-MM-DD
	startTime: string; // ISO 8601
	endTime: string; // ISO 8601
	duration: number; // 15, 30, or 60
	platform: 'discord' | 'google' | 'teams' | 'jitsi';
}

export interface AppointmentValidationResult {
	valid: boolean;
	errors: string[];
	sanitized?: AppointmentData;
}

/**
 * Valid slot durations in minutes
 */
const VALID_DURATIONS = [15, 30, 60];

/**
 * Valid meeting platforms
 */
const VALID_PLATFORMS = ['discord', 'google', 'teams', 'jitsi'];

/**
 * Validate appointment data
 */
export function validateAppointment(data: any): AppointmentValidationResult {
	const errors: string[] = [];

	// Type check
	if (!data || typeof data !== 'object') {
		return { valid: false, errors: ['Invalid appointment data'] };
	}

	// Required field checks
	if (!data.slotId || typeof data.slotId !== 'string' || data.slotId.trim().length === 0) {
		errors.push('Slot ID is required');
	}

	if (!data.date || typeof data.date !== 'string') {
		errors.push('Date is required');
	}

	if (!data.startTime || typeof data.startTime !== 'string') {
		errors.push('Start time is required');
	}

	if (!data.endTime || typeof data.endTime !== 'string') {
		errors.push('End time is required');
	}

	if (typeof data.duration !== 'number') {
		errors.push('Duration is required');
	}

	if (!data.platform || typeof data.platform !== 'string') {
		errors.push('Platform is required');
	}

	// If required fields missing, return early
	if (errors.length > 0) {
		return { valid: false, errors };
	}

	// Validate duration
	if (!VALID_DURATIONS.includes(data.duration)) {
		errors.push('Duration must be 15, 30, or 60 minutes');
	}

	// Validate platform
	if (!VALID_PLATFORMS.includes(data.platform.toLowerCase())) {
		errors.push('Platform must be discord, google, teams, or jitsi');
	}

	// Validate date format (YYYY-MM-DD)
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(data.date)) {
		errors.push('Date must be in YYYY-MM-DD format');
	} else {
		// Validate it's a real date
		const date = new Date(data.date);
		if (isNaN(date.getTime())) {
			errors.push('Invalid date');
		}
	}

	// Validate ISO 8601 format for times
	try {
		const startDate = new Date(data.startTime);
		const endDate = new Date(data.endTime);

		if (isNaN(startDate.getTime())) {
			errors.push('Invalid start time format');
		}

		if (isNaN(endDate.getTime())) {
			errors.push('Invalid end time format');
		}

		// Validate end time is after start time
		if (startDate.getTime() >= endDate.getTime()) {
			errors.push('End time must be after start time');
		}
	} catch {
		errors.push('Invalid time format');
	}

	// If any validation errors, return them
	if (errors.length > 0) {
		return { valid: false, errors };
	}

	// Return sanitized data
	return {
		valid: true,
		errors: [],
		sanitized: {
			slotId: data.slotId.trim(),
			date: data.date,
			startTime: data.startTime,
			endTime: data.endTime,
			duration: data.duration,
			platform: data.platform.toLowerCase() as 'discord' | 'google' | 'teams' | 'jitsi',
		},
	};
}

/**
 * Validate slot fetch request
 */
export function validateSlotFetchRequest(
	date: string | null,
	duration: string | null
): {
	valid: boolean;
	errors: string[];
	parsedDate?: string;
	parsedDuration?: number;
} {
	const errors: string[] = [];

	if (!date) {
		errors.push('Date parameter is required');
	}

	if (!duration) {
		errors.push('Duration parameter is required');
	}

	if (errors.length > 0) {
		return { valid: false, errors };
	}

	// Validate date format
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(date!)) {
		errors.push('Date must be in YYYY-MM-DD format');
	} else {
		const parsedDate = new Date(date!);
		if (isNaN(parsedDate.getTime())) {
			errors.push('Invalid date');
		}
	}

	// Validate duration
	const parsedDuration = parseInt(duration!, 10);
	if (isNaN(parsedDuration) || !VALID_DURATIONS.includes(parsedDuration)) {
		errors.push('Duration must be 15, 30, or 60');
	}

	if (errors.length > 0) {
		return { valid: false, errors };
	}

	return {
		valid: true,
		errors: [],
		parsedDate: date!,
		parsedDuration: parseInt(duration!, 10),
	};
}
