/**
 * CORS middleware for Cloudflare Workers
 *
 * Flexible CORS configuration with support for:
 * - Multiple origins with wildcard matching
 * - Configurable methods, headers, and credentials
 * - Automatic OPTIONS handling
 *
 * @example
 * ```typescript
 * import { createCorsMiddleware, DEFAULT_HADOKU_ORIGINS } from '../util';
 *
 * // Simple usage
 * app.use('*', createCorsMiddleware({
 *   origins: ['https://hadoku.me', 'http://localhost:*']
 * }));
 *
 * // Advanced usage
 * app.use('*', createCorsMiddleware({
 *   origins: ['https://hadoku.me', 'https://*.hadoku.me', 'http://localhost:*'],
 *   methods: ['GET', 'POST', 'PUT', 'DELETE'],
 *   allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Key'],
 *   exposedHeaders: ['X-Request-Id', 'X-Backend-Source'],
 *   credentials: true,
 *   maxAge: 86400
 * }));
 * ```
 */

import { cors } from 'hono/cors';
import type { CORSConfig } from './types.js';

/**
 * Default CORS origins for Hadoku services
 */
export const DEFAULT_HADOKU_ORIGINS = [
	'https://hadoku.me',
	'https://task-api.hadoku.me',
	'http://localhost:*',
];

/**
 * Check if origin matches pattern (supports wildcards)
 *
 * @param origin - Origin to check
 * @param pattern - Pattern to match against (supports * wildcards)
 * @returns True if origin matches pattern
 *
 * @example
 * ```typescript
 * matchOrigin('http://localhost:3000', 'http://localhost:*') // true
 * matchOrigin('https://api.hadoku.me', 'https://*.hadoku.me') // true
 * matchOrigin('https://evil.com', 'https://hadoku.me') // false
 * ```
 */
export function matchOrigin(origin: string, pattern: string): boolean {
	// Exact match
	if (origin === pattern) return true;

	// Wildcard matching
	if (pattern.includes('*')) {
		const regexPattern = pattern
			.replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
			.replace(/\*/g, '.*'); // Replace * with .*
		const regex = new RegExp(`^${regexPattern}$`);
		return regex.test(origin);
	}

	return false;
}

/**
 * Check if origin is allowed based on config
 *
 * @param origin - Origin to check
 * @param allowedOrigins - Array of allowed origin patterns
 * @returns True if origin is allowed
 */
export function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
	return allowedOrigins.some((pattern) => matchOrigin(origin, pattern));
}

/**
 * Create CORS middleware with configuration
 *
 * @param config - CORS configuration
 * @returns Hono CORS middleware
 *
 * @example
 * ```typescript
 * const corsMiddleware = createCorsMiddleware({
 *   origins: ['https://hadoku.me', 'http://localhost:*'],
 *   methods: ['GET', 'POST', 'PUT', 'DELETE'],
 *   credentials: true
 * });
 *
 * app.use('*', corsMiddleware);
 * ```
 */
export function createCorsMiddleware(config: CORSConfig) {
	const {
		origins,
		methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders,
		exposedHeaders,
		credentials = true,
		maxAge = 86400,
	} = config;

	return cors({
		origin: (origin) => {
			// If no origin header (same-origin requests), allow it
			if (!origin) return true;

			// Check against allowed origins (with wildcard support)
			return isOriginAllowed(origin, origins) ? origin : origins[0];
		},
		allowMethods: methods,
		allowHeaders: allowedHeaders,
		exposeHeaders: exposedHeaders,
		credentials,
		maxAge,
	});
}

/**
 * Create CORS middleware with Hadoku defaults
 *
 * @param additionalOrigins - Additional origins to allow
 * @returns Hono CORS middleware
 *
 * @example
 * ```typescript
 * // Use Hadoku defaults
 * app.use('*', createHadokuCors());
 *
 * // Add custom origins
 * app.use('*', createHadokuCors(['https://custom-domain.com']));
 * ```
 */
export function createHadokuCors(additionalOrigins: string[] = []) {
	return createCorsMiddleware({
		origins: [...DEFAULT_HADOKU_ORIGINS, ...additionalOrigins],
		credentials: true,
	});
}

/**
 * Preset CORS configurations for common scenarios
 */
export const CORSPresets = {
	/**
	 * Development - Allow all localhost origins
	 */
	development: {
		origins: ['http://localhost:*', 'http://127.0.0.1:*'],
		credentials: true,
	},

	/**
	 * Production - Strict origin checking
	 */
	production: (domains: string[]) => ({
		origins: domains,
		credentials: true,
		maxAge: 86400,
	}),

	/**
	 * Public API - Allow all origins (no credentials)
	 */
	publicApi: {
		origins: ['*'],
		credentials: false,
	},

	/**
	 * Hadoku standard - Production + development origins
	 */
	hadoku: {
		origins: DEFAULT_HADOKU_ORIGINS,
		credentials: true,
		maxAge: 86400,
	},
};

/**
 * Helper to add custom CORS headers manually
 * (use when you need more control than middleware provides)
 *
 * @param origin - Request origin
 * @param allowedOrigins - Allowed origin patterns
 * @returns Headers object
 *
 * @example
 * ```typescript
 * app.get('/api/data', (c) => {
 *   const origin = c.req.header('Origin');
 *   const corsHeaders = getCorsHeaders(origin, ['https://hadoku.me']);
 *
 *   return c.json({ data: '...' }, { headers: corsHeaders });
 * });
 * ```
 */
export function getCorsHeaders(
	origin: string | undefined,
	allowedOrigins: string[],
	options: {
		credentials?: boolean;
		exposedHeaders?: string[];
	} = {}
): Record<string, string> {
	const headers: Record<string, string> = {};

	if (origin && isOriginAllowed(origin, allowedOrigins)) {
		headers['Access-Control-Allow-Origin'] = origin;

		if (options.credentials !== false) {
			headers['Access-Control-Allow-Credentials'] = 'true';
		}

		if (options.exposedHeaders && options.exposedHeaders.length > 0) {
			headers['Access-Control-Expose-Headers'] = options.exposedHeaders.join(', ');
		}
	}

	return headers;
}
