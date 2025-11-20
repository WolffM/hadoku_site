/**
 * Contact form submission endpoint
 *
 * POST /contact/api/submit
 * Public endpoint with security layers:
 * - Rate limiting (5 submissions/hour per IP)
 * - Referrer validation (must be from hadoku.me)
 * - Honeypot spam detection
 * - Field validation and sanitization
 */

import { Hono } from 'hono';
import { badRequest, serverError } from '@hadoku/worker-utils';
import {
	validateContactSubmission,
	extractClientIP,
	extractReferrer,
	validateReferrer,
} from '../validation';
import { createSubmission } from '../storage';
import { checkRateLimit, recordSubmission } from '../rate-limit';

interface Env {
	DB: D1Database;
	RATE_LIMIT_KV: KVNamespace;
}

export function createSubmitRoutes() {
	const app = new Hono<{ Bindings: Env }>();

	/**
	 * Submit contact form
	 * Public endpoint - no authentication required
	 */
	app.post('/submit', async (c) => {
		const db = c.env.DB;
		const kv = c.env.RATE_LIMIT_KV;
		const request = c.req.raw;

		try {
			// Security Layer 1: Referrer validation
			if (!validateReferrer(request)) {
				return c.json({ success: false, message: 'Invalid request origin' }, 400);
			}

			// Security Layer 2: Extract client IP for rate limiting
			const ipAddress = extractClientIP(request);
			if (!ipAddress) {
				console.error('Could not extract client IP');
				return c.json({ success: false, message: 'Could not identify client' }, 400);
			}

			// Security Layer 3: Rate limiting check
			const rateLimitResult = await checkRateLimit(kv, ipAddress);
			if (!rateLimitResult.allowed) {
				return c.json(
					{
						success: false,
						error: 'Rate limit exceeded',
						message: rateLimitResult.reason,
						retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000),
					},
					429,
					{
						'X-RateLimit-Limit': '5',
						'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
						'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
					}
				);
			}

			// Parse request body
			let body: any;
			try {
				body = await c.req.json();
			} catch {
				return c.json({ success: false, message: 'Invalid JSON in request body' }, 400);
			}

			// Security Layer 4: Validate and sanitize input (includes honeypot check)
			const validation = validateContactSubmission(body);
			if (!validation.valid) {
				return c.json(
					{
						success: false,
						error: 'Validation failed',
						errors: validation.errors,
					},
					400
				);
			}

			// At this point, validation.sanitized is guaranteed to exist
			const sanitized = validation.sanitized!;

			// Extract metadata for storage
			const userAgent = request.headers.get('User-Agent');
			const referrer = extractReferrer(request);

			// Store submission in D1
			const submission = await createSubmission(db, {
				name: sanitized.name,
				email: sanitized.email,
				message: sanitized.message,
				ip_address: ipAddress,
				user_agent: userAgent,
				referrer,
			});

			// Record this submission for rate limiting
			await recordSubmission(kv, ipAddress);

			// Success response - simple format for contact form
			return c.json(
				{
					success: true,
					id: submission.id,
					message: 'Your message has been sent successfully!',
				},
				201
			);
		} catch (error) {
			console.error('Error processing contact submission:', error);
			return c.json({ success: false, message: 'Failed to process submission' }, 500);
		}
	});

	return app;
}
