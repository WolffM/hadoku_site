/**
 * Rate limiting using Cloudflare KV
 *
 * Strategy: Sliding window rate limiting per IP address
 * Configuration: 10 requests per 60 seconds
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

const RATE_LIMIT_WINDOW_MS = RATE_LIMIT_CONFIG.WINDOW_DURATION_SECONDS * 1000;

/**
 * Check if an IP address is rate limited
 */
export async function checkRateLimit(kv: KVNamespace, ipAddress: string): Promise<RateLimitResult> {
	const key = `rate-limit:${ipAddress}`;
	const now = Date.now();

	// Get existing rate limit entry
	const existingData = await kv.get(key, 'text');
	const existing: RateLimitEntry | null = existingData
		? (JSON.parse(existingData) as RateLimitEntry)
		: null;

	// If no existing entry or window has expired, allow and create new window
	if (!existing || now - existing.windowStart >= RATE_LIMIT_WINDOW_MS) {
		return {
			allowed: true,
			remaining: RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_WINDOW - 1,
			resetAt: now + RATE_LIMIT_WINDOW_MS,
		};
	}

	// Check if limit exceeded
	if (existing.count >= RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_WINDOW) {
		const resetAt = existing.windowStart + RATE_LIMIT_WINDOW_MS;
		const secondsUntilReset = Math.ceil((resetAt - now) / 1000);

		return {
			allowed: false,
			remaining: 0,
			resetAt,
			reason: `Rate limit exceeded. Try again in ${secondsUntilReset} second(s).`,
		};
	}

	// Within limit, allow
	return {
		allowed: true,
		remaining: RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_WINDOW - existing.count - 1,
		resetAt: existing.windowStart + RATE_LIMIT_WINDOW_MS,
	};
}

/**
 * Record a request for rate limiting
 * Should be called after checkRateLimit returns allowed: true
 */
export async function recordRequest(kv: KVNamespace, ipAddress: string): Promise<void> {
	const key = `rate-limit:${ipAddress}`;
	const now = Date.now();

	// Get existing entry
	const existingData = await kv.get(key, 'text');
	const existing: RateLimitEntry | null = existingData
		? (JSON.parse(existingData) as RateLimitEntry)
		: null;

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
