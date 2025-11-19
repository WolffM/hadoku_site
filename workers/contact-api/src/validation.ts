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
