/**
 * Rate limiting using Cloudflare KV
 *
 * Strategy: Sliding window rate limiting per IP address
 * Configuration is centralized in constants.ts
 */

import { RATE_LIMIT_CONFIG } from './constants';

export interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	resetAt: number; // Timestamp when the limit resets
	reason?: string;
}

interface RateLimitEntry {
	count: number;
	windowStart: number; // Timestamp when the window started
}

// Convert seconds to milliseconds for calculations
const RATE_LIMIT_WINDOW_MS = RATE_LIMIT_CONFIG.WINDOW_DURATION_SECONDS * 1000;

/**
 * Check if an IP address is rate limited
 *
 * @param kv - KV namespace for rate limit storage
 * @param ipAddress - Client IP address
 * @returns Rate limit result with allowed status
 */
export async function checkRateLimit(kv: KVNamespace, ipAddress: string): Promise<RateLimitResult> {
	const key = `rate-limit:${ipAddress}`;
	const now = Date.now();

	// Get existing rate limit entry
	const existingData = await kv.get(key, 'text');
	const existing: RateLimitEntry | null = existingData ? JSON.parse(existingData) : null;

	// If no existing entry or window has expired, allow and create new window
	if (!existing || now - existing.windowStart >= RATE_LIMIT_WINDOW_MS) {
		return {
			allowed: true,
			remaining: RATE_LIMIT_CONFIG.MAX_SUBMISSIONS_PER_HOUR - 1, // -1 because this request will count
			resetAt: now + RATE_LIMIT_WINDOW_MS,
		};
	}

	// Check if limit exceeded
	if (existing.count >= RATE_LIMIT_CONFIG.MAX_SUBMISSIONS_PER_HOUR) {
		const resetAt = existing.windowStart + RATE_LIMIT_WINDOW_MS;
		const minutesUntilReset = Math.ceil((resetAt - now) / 60000);

		return {
			allowed: false,
			remaining: 0,
			resetAt,
			reason: `Rate limit exceeded. You can submit again in ${minutesUntilReset} minute(s).`,
		};
	}

	// Within limit, allow
	return {
		allowed: true,
		remaining: RATE_LIMIT_CONFIG.MAX_SUBMISSIONS_PER_HOUR - existing.count - 1,
		resetAt: existing.windowStart + RATE_LIMIT_WINDOW_MS,
	};
}

/**
 * Record a submission for rate limiting
 * Should be called after checkRateLimit returns allowed: true
 *
 * @param kv - KV namespace for rate limit storage
 * @param ipAddress - Client IP address
 */
export async function recordSubmission(kv: KVNamespace, ipAddress: string): Promise<void> {
	const key = `rate-limit:${ipAddress}`;
	const now = Date.now();

	// Get existing entry
	const existingData = await kv.get(key, 'text');
	const existing: RateLimitEntry | null = existingData ? JSON.parse(existingData) : null;

	let entry: RateLimitEntry;

	// If no existing entry or window expired, start new window
	if (!existing || now - existing.windowStart >= RATE_LIMIT_WINDOW_MS) {
		entry = {
			count: 1,
			windowStart: now,
		};
	} else {
		// Increment existing count
		entry = {
			count: existing.count + 1,
			windowStart: existing.windowStart,
		};
	}

	// Store with TTL
	await kv.put(key, JSON.stringify(entry), {
		expirationTtl: RATE_LIMIT_CONFIG.KV_TTL_SECONDS,
	});
}

/**
 * Get rate limit status without modifying it
 * Useful for debugging or displaying to user
 */
export async function getRateLimitStatus(
	kv: KVNamespace,
	ipAddress: string
): Promise<RateLimitResult> {
	return checkRateLimit(kv, ipAddress);
}

/**
 * Reset rate limit for an IP (admin function)
 */
export async function resetRateLimit(kv: KVNamespace, ipAddress: string): Promise<void> {
	const key = `rate-limit:${ipAddress}`;
	await kv.delete(key);
}
