/**
 * Data masking utilities for sensitive information logging
 * 
 * Provides functions to safely mask keys, session IDs, and other
 * sensitive data before logging to prevent exposure.
 * 
 * @example
 * ```typescript
 * import { maskKey, maskSessionId } from '../util';
 * 
 * const key = 'admin-secret-key-12345';
 * console.log(maskKey(key)); // "admin-se..."
 * 
 * const sessionId = '1a2b3c4d5e6f7g8h';
 * console.log(maskSessionId(sessionId)); // "1a2b3c4d5e6f7g8h..."
 * ```
 */

/**
 * Masking configuration constants
 */
export const MASKING = {
	/** Number of characters to show for keys (default: 8) */
	KEY_PREFIX_LENGTH: 8,
	/** Number of characters to show for session IDs (default: 16) */
	SESSION_ID_PREFIX_LENGTH: 16,
	/** Suffix to append to masked values */
	KEY_SUFFIX: '...',
} as const;

/**
 * Mask a key for logging (show first N characters)
 *
 * @param key - Key to mask
 * @param length - Number of characters to show (default: 8)
 * @returns Masked key (e.g., "12345678...")
 * 
 * @example
 * ```typescript
 * maskKey('my-secret-key-123456'); // "my-secre..."
 * maskKey('short'); // "short"
 * maskKey('my-secret', 3); // "my-..."
 * ```
 */
export function maskKey(key: string, length: number = MASKING.KEY_PREFIX_LENGTH): string {
	if (!key || key.length <= length) {
		return key;
	}
	return key.substring(0, length) + MASKING.KEY_SUFFIX;
}

/**
 * Mask a session ID for logging (show first 16 characters)
 *
 * @param id - Session ID to mask
 * @returns Masked session ID (e.g., "1a2b3c4d5e6f7g8h...")
 * 
 * @example
 * ```typescript
 * maskSessionId('1a2b3c4d5e6f7g8h9i0j'); // "1a2b3c4d5e6f7g8h..."
 * maskSessionId('short-id'); // "short-id"
 * ```
 */
export function maskSessionId(id: string): string {
	return maskKey(id, MASKING.SESSION_ID_PREFIX_LENGTH);
}

/**
 * Mask an email address for logging (show first character and domain)
 *
 * @param email - Email to mask
 * @returns Masked email (e.g., "j***@example.com")
 * 
 * @example
 * ```typescript
 * maskEmail('john@example.com'); // "j***@example.com"
 * maskEmail('invalid-email'); // "invalid-email"
 * ```
 */
export function maskEmail(email: string): string {
	if (!email || !email.includes('@')) {
		return email;
	}
	
	const [username, domain] = email.split('@');
	if (!username || !domain) {
		return email;
	}
	
	return `${username[0]}***@${domain}`;
}

/**
 * Redact multiple sensitive fields from an object
 *
 * @param obj - Object to redact
 * @param fields - Field names to redact
 * @returns New object with redacted fields
 * 
 * @example
 * ```typescript
 * const data = { username: 'john', password: 'secret123', email: 'john@example.com' };
 * redactFields(data, ['password']); 
 * // { username: 'john', password: '[REDACTED]', email: 'john@example.com' }
 * ```
 */
export function redactFields<T extends Record<string, any>>(
	obj: T,
	fields: string[]
): T {
	const redacted: any = { ...obj };
	
	for (const field of fields) {
		if (field in redacted) {
			redacted[field] = '[REDACTED]';
		}
	}
	
	return redacted as T;
}

/**
 * Common sensitive field names to redact
 */
export const SENSITIVE_FIELDS = [
	'password',
	'token',
	'secret',
	'apiKey',
	'api_key',
	'accessToken',
	'access_token',
	'refreshToken',
	'refresh_token',
	'privateKey',
	'private_key',
	'authKey',
	'auth_key'
] as const;
