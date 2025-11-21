/**
 * Validation utilities for contact form submissions
 */

import {
	VALIDATION_CONSTRAINTS,
	APPOINTMENT_CONFIG,
	SITE_CONFIG,
	type AppointmentPlatform,
} from './constants';

export interface ContactSubmission {
	name: string;
	email: string;
	message: string;
	recipient?: string; // Optional recipient email
	website?: string; // Honeypot field - should always be empty
}

export interface ValidationError {
	path: string[];
	message: string;
}

export interface ValidationResult {
	valid: boolean;
	errors: ValidationError[];
	sanitized?: ContactSubmission;
}

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
export function validateContactSubmission(data: unknown): ValidationResult {
	const errors: ValidationError[] = [];

	// Type check
	if (!data || typeof data !== 'object') {
		return { valid: false, errors: [{ path: ['body'], message: 'Invalid submission data' }] };
	}

	// Cast to a type we can work with
	const submission = data as Record<string, unknown>;

	// Honeypot check (do this first, before other validation)
	if (isHoneypotFilled(submission.website as string | undefined)) {
		return {
			valid: false,
			errors: [{ path: ['website'], message: 'Submission rejected - bot detected' }],
		};
	}

	// Required field checks
	if (
		!submission.name ||
		typeof submission.name !== 'string' ||
		submission.name.trim().length === 0
	) {
		errors.push({ path: ['name'], message: 'Name is required' });
	}

	if (
		!submission.email ||
		typeof submission.email !== 'string' ||
		submission.email.trim().length === 0
	) {
		errors.push({ path: ['email'], message: 'Email is required' });
	}

	if (
		!submission.message ||
		typeof submission.message !== 'string' ||
		submission.message.trim().length === 0
	) {
		errors.push({ path: ['message'], message: 'Message is required' });
	}

	// If required fields missing, return early
	if (errors.length > 0) {
		return { valid: false, errors };
	}

	// Type narrowing - we know these are strings now
	const nameStr = submission.name as string;
	const emailStr = submission.email as string;
	const messageStr = submission.message as string;

	// Recipient validation (optional field)
	let recipient: string | undefined;
	if (submission.recipient) {
		if (typeof submission.recipient !== 'string') {
			errors.push({ path: ['recipient'], message: 'Recipient must be a string' });
		} else {
			recipient = submission.recipient.trim();
			// Validate recipient email format
			if (!VALIDATION_CONSTRAINTS.EMAIL_REGEX.test(recipient)) {
				errors.push({ path: ['recipient'], message: 'Invalid recipient email format' });
			}
			// Validate recipient is from allowed domain
			const domain = recipient.split('@')[1];
			if (domain && !['hadoku.me'].includes(domain.toLowerCase())) {
				errors.push({ path: ['recipient'], message: 'Recipient must be from hadoku.me domain' });
			}
		}
	}

	// Length validation BEFORE sanitization (to reject too-long inputs)
	if (nameStr.trim().length > VALIDATION_CONSTRAINTS.NAME_MAX_LENGTH) {
		errors.push({
			path: ['name'],
			message: `Name must not exceed ${VALIDATION_CONSTRAINTS.NAME_MAX_LENGTH} characters`,
		});
	}

	if (emailStr.trim().length > VALIDATION_CONSTRAINTS.EMAIL_MAX_LENGTH) {
		errors.push({
			path: ['email'],
			message: `Email must not exceed ${VALIDATION_CONSTRAINTS.EMAIL_MAX_LENGTH} characters`,
		});
	}

	if (messageStr.trim().length > VALIDATION_CONSTRAINTS.MESSAGE_MAX_LENGTH) {
		errors.push({
			path: ['message'],
			message: `Message must not exceed ${VALIDATION_CONSTRAINTS.MESSAGE_MAX_LENGTH} characters`,
		});
	}

	// Sanitize and validate individual fields
	const name = sanitizeString(nameStr, VALIDATION_CONSTRAINTS.NAME_MAX_LENGTH);
	const email = sanitizeString(emailStr, VALIDATION_CONSTRAINTS.EMAIL_MAX_LENGTH);
	const message = sanitizeString(messageStr, VALIDATION_CONSTRAINTS.MESSAGE_MAX_LENGTH);

	// Minimum length validation (after sanitization)
	if (name.length < VALIDATION_CONSTRAINTS.NAME_MIN_LENGTH) {
		errors.push({
			path: ['name'],
			message: `Name must be at least ${VALIDATION_CONSTRAINTS.NAME_MIN_LENGTH} characters`,
		});
	}

	if (email.length < VALIDATION_CONSTRAINTS.EMAIL_MIN_LENGTH) {
		errors.push({
			path: ['email'],
			message: `Email must be at least ${VALIDATION_CONSTRAINTS.EMAIL_MIN_LENGTH} characters`,
		});
	}

	if (message.length < VALIDATION_CONSTRAINTS.MESSAGE_MIN_LENGTH) {
		errors.push({
			path: ['message'],
			message: `Message must be at least ${VALIDATION_CONSTRAINTS.MESSAGE_MIN_LENGTH} characters`,
		});
	}

	// Email format validation
	if (!VALIDATION_CONSTRAINTS.EMAIL_REGEX.test(email)) {
		errors.push({ path: ['email'], message: 'Email format is invalid' });
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
			recipient,
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
	return request.headers.get('Referer') ?? request.headers.get('Referrer') ?? null;
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

		// Check against allowed domains
		return SITE_CONFIG.ALLOWED_REFERRER_DOMAINS.some(
			(domain) => hostname === domain || hostname.endsWith(`.${domain}`)
		);
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
	platform: AppointmentPlatform;
}

export interface AppointmentValidationResult {
	valid: boolean;
	errors: ValidationError[];
	sanitized?: AppointmentData;
}

/**
 * Validate appointment data
 */
export function validateAppointment(data: unknown): AppointmentValidationResult {
	const errors: ValidationError[] = [];

	// Type check
	if (!data || typeof data !== 'object') {
		return {
			valid: false,
			errors: [{ path: ['appointment'], message: 'Invalid appointment data' }],
		};
	}

	// Cast to a type we can work with
	const appointment = data as Record<string, unknown>;

	// Required field checks
	if (
		!appointment.slotId ||
		typeof appointment.slotId !== 'string' ||
		(appointment.slotId).trim().length === 0
	) {
		errors.push({ path: ['appointment', 'slotId'], message: 'Slot ID is required' });
	}

	if (!appointment.date || typeof appointment.date !== 'string') {
		errors.push({ path: ['appointment', 'date'], message: 'Date is required' });
	}

	if (!appointment.startTime || typeof appointment.startTime !== 'string') {
		errors.push({ path: ['appointment', 'startTime'], message: 'Start time is required' });
	}

	if (!appointment.endTime || typeof appointment.endTime !== 'string') {
		errors.push({ path: ['appointment', 'endTime'], message: 'End time is required' });
	}

	if (typeof appointment.duration !== 'number') {
		errors.push({ path: ['appointment', 'duration'], message: 'Duration is required' });
	}

	if (!appointment.platform || typeof appointment.platform !== 'string') {
		errors.push({ path: ['appointment', 'platform'], message: 'Platform is required' });
	}

	// If required fields missing, return early
	if (errors.length > 0) {
		return { valid: false, errors };
	}

	// Validate duration
	if (!APPOINTMENT_CONFIG.VALID_DURATIONS.includes(appointment.duration as 15 | 30 | 60)) {
		errors.push({
			path: ['appointment', 'duration'],
			message: `Duration must be one of: ${APPOINTMENT_CONFIG.VALID_DURATIONS.join(', ')} minutes`,
		});
	}

	// Validate platform
	const platformLower = (appointment.platform as string).toLowerCase();
	if (
		!APPOINTMENT_CONFIG.VALID_PLATFORMS.includes(
			platformLower as 'discord' | 'google' | 'teams' | 'jitsi'
		)
	) {
		errors.push({
			path: ['appointment', 'platform'],
			message: `Platform must be one of: ${APPOINTMENT_CONFIG.VALID_PLATFORMS.join(', ')}`,
		});
	}

	// Validate date format (YYYY-MM-DD)
	if (!VALIDATION_CONSTRAINTS.DATE_FORMAT_REGEX.test(appointment.date as string)) {
		errors.push({ path: ['appointment', 'date'], message: 'Date must be in YYYY-MM-DD format' });
	} else {
		// Validate it's a real date
		const date = new Date(appointment.date as string);
		if (isNaN(date.getTime())) {
			errors.push({ path: ['appointment', 'date'], message: 'Invalid date' });
		}
	}

	// Validate ISO 8601 format for times
	try {
		const startDate = new Date(appointment.startTime as string);
		const endDate = new Date(appointment.endTime as string);

		if (isNaN(startDate.getTime())) {
			errors.push({ path: ['appointment', 'startTime'], message: 'Invalid start time format' });
		}

		if (isNaN(endDate.getTime())) {
			errors.push({ path: ['appointment', 'endTime'], message: 'Invalid end time format' });
		}

		// Validate end time is after start time
		if (startDate.getTime() >= endDate.getTime()) {
			errors.push({ path: ['appointment'], message: 'End time must be after start time' });
		}
	} catch {
		errors.push({ path: ['appointment'], message: 'Invalid time format' });
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
			slotId: (appointment.slotId as string).trim(),
			date: appointment.date as string,
			startTime: appointment.startTime as string,
			endTime: appointment.endTime as string,
			duration: appointment.duration as number,
			platform: (appointment.platform as string).toLowerCase() as AppointmentPlatform,
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

	// At this point, date and duration are guaranteed to be non-null (we returned early if either was null)
	if (!date || !duration) {
		// TypeScript guard - should never happen due to above checks
		return { valid: false, errors: ['Missing required parameters'] };
	}

	const dateValue = date;
	const durationValue = duration;

	// Validate date format
	if (!VALIDATION_CONSTRAINTS.DATE_FORMAT_REGEX.test(dateValue)) {
		errors.push('Date must be in YYYY-MM-DD format');
	} else {
		const parsedDate = new Date(dateValue);
		if (isNaN(parsedDate.getTime())) {
			errors.push('Invalid date');
		}
	}

	// Validate duration
	const parsedDuration = parseInt(durationValue, 10);
	if (
		isNaN(parsedDuration) ||
		!APPOINTMENT_CONFIG.VALID_DURATIONS.includes(parsedDuration as 15 | 30 | 60)
	) {
		errors.push(`Duration must be one of: ${APPOINTMENT_CONFIG.VALID_DURATIONS.join(', ')}`);
	}

	if (errors.length > 0) {
		return { valid: false, errors };
	}

	return {
		valid: true,
		errors: [],
		parsedDate: dateValue,
		parsedDuration: parseInt(durationValue, 10),
	};
}
