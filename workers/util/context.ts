/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Context extraction utilities for Cloudflare Workers
 *
 * Generic helpers to extract common request context (userId, sessionId, etc.)
 * from headers, query parameters, or request body.
 *
 * @example
 * ```typescript
 * // Extract multiple fields at once
 * const context = extractContext(c, {
 *   fields: {
 *     userId: ['header:X-User-Id', 'query:userId'],
 *     sessionId: ['header:X-Session-Id'],
 *     boardId: ['query:boardId', 'body:boardId']
 *   },
 *   defaults: { boardId: 'main', userId: 'anonymous' }
 * });
 * // Result: { userId: '123', sessionId: 'abc', boardId: 'main' }
 *
 * // Extract single field with fallbacks
 * const userId = extractField(c, ['header:X-User-Id', 'query:userId'], 'anonymous');
 * ```
 */

import type { Context } from 'hono';
import type { ContextExtractionConfig } from './types.js';

/**
 * Extract a single field from multiple sources (in priority order)
 *
 * @param c - Hono context
 * @param sources - Array of sources to check (e.g., ['header:X-User-Id', 'query:userId'])
 * @param defaultValue - Default value if not found in any source
 * @param transform - Optional transform function
 * @returns Extracted value or default
 *
 * @example
 * ```typescript
 * const userId = extractField(c, ['header:X-User-Id', 'query:userId'], 'public');
 * const boardId = extractField(c, ['query:boardId', 'body:boardId'], 'main');
 * const email = extractField(
 *   c,
 *   ['header:X-User-Email', 'body:email'],
 *   undefined,
 *   (val) => val?.toLowerCase()
 * );
 * ```
 */
export function extractField<T = string>(
	c: Context,
	sources: string[],
	defaultValue?: T,
	transform?: (value: string) => T
): T | undefined {
	for (const source of sources) {
		const [type, key] = source.split(':');
		let value: string | undefined;

		switch (type.toLowerCase()) {
			case 'header':
				value = c.req.header(key);
				break;
			case 'query':
				value = c.req.query(key);
				break;
			case 'body':
				// Note: This assumes body has been parsed. For performance,
				// consider caching parsed body in context
				// Body reading should be done explicitly before calling this function
				value = undefined; // Don't try to read body here
				break;
			case 'param':
				value = c.req.param(key);
				break;
			case 'cookie': {
				const cookieHeader = c.req.header('Cookie');
				if (cookieHeader) {
					const cookies = Object.fromEntries(
						cookieHeader.split(';').map((cookie) => {
							const [k, v] = cookie.trim().split('=');
							return [k, v];
						})
					);
					value = cookies[key];
				}
				break;
			}
			default:
				continue;
		}

		if (value !== undefined && value !== null && value !== '') {
			return transform ? transform(value) : (value as unknown as T);
		}
	}

	return defaultValue;
}

/**
 * Extract multiple fields from request based on configuration
 *
 * @param c - Hono context
 * @param config - Extraction configuration
 * @returns Object with extracted fields
 *
 * @example
 * ```typescript
 * const context = extractContext(c, {
 *   fields: {
 *     userId: ['header:X-User-Id', 'query:userId'],
 *     sessionId: ['header:X-Session-Id'],
 *     boardId: ['query:boardId', 'body:boardId'],
 *     limit: ['query:limit']
 *   },
 *   defaults: {
 *     boardId: 'main',
 *     userId: 'public',
 *     limit: 100
 *   },
 *   transforms: {
 *     userId: (val) => val?.toLowerCase(),
 *     limit: (val) => parseInt(val, 10)
 *   }
 * });
 * ```
 */
export function extractContext<T extends Record<string, any>>(
	c: Context,
	config: ContextExtractionConfig
): T {
	const result: Record<string, any> = {};

	for (const [fieldName, sources] of Object.entries(config.fields)) {
		const defaultValue = config.defaults?.[fieldName];
		const transform = config.transforms?.[fieldName];

		result[fieldName] = extractField(c, sources, defaultValue, transform);
	}

	return result as T;
}

/**
 * Create a reusable context extractor function
 *
 * @param config - Extraction configuration
 * @returns Function that extracts context from Hono context
 *
 * @example
 * ```typescript
 * // Define once
 * const getUserContext = createContextExtractor({
 *   fields: {
 *     userId: ['header:X-User-Id', 'query:userId'],
 *     sessionId: ['header:X-Session-Id'],
 *     boardId: ['query:boardId']
 *   },
 *   defaults: { boardId: 'main', userId: 'public' }
 * });
 *
 * // Use in multiple routes
 * app.get('/tasks', (c) => {
 *   const { userId, boardId } = getUserContext(c);
 *   // ...
 * });
 * ```
 */
export function createContextExtractor<T extends Record<string, any>>(
	config: ContextExtractionConfig
): (c: Context) => T {
	return (c: Context) => extractContext<T>(c, config);
}

/**
 * Common extractors for typical use cases
 */

/**
 * Extract user context (userId, sessionId)
 */
export const extractUserContext = createContextExtractor({
	fields: {
		userId: ['header:X-User-Id', 'query:userId'],
		sessionId: ['header:X-Session-Id', 'query:sessionId'],
	},
	defaults: {
		userId: undefined,
		sessionId: undefined,
	},
});

/**
 * Extract pagination parameters
 */
export const extractPagination = createContextExtractor({
	fields: {
		page: ['query:page'],
		limit: ['query:limit'],
		offset: ['query:offset'],
	},
	defaults: {
		page: 1,
		limit: 50,
		offset: 0,
	},
	transforms: {
		page: (val) => Math.max(1, parseInt(val, 10) || 1),
		limit: (val) => Math.min(1000, Math.max(1, parseInt(val, 10) || 50)),
		offset: (val) => Math.max(0, parseInt(val, 10) || 0),
	},
});

/**
 * Extract sorting parameters
 */
export const extractSorting = createContextExtractor({
	fields: {
		sortBy: ['query:sortBy', 'query:sort'],
		sortOrder: ['query:sortOrder', 'query:order'],
	},
	defaults: {
		sortBy: 'createdAt',
		sortOrder: 'desc',
	},
	transforms: {
		sortOrder: (val) => (['asc', 'desc'].includes(val?.toLowerCase()) ? val.toLowerCase() : 'desc'),
	},
});

/**
 * Helper to get request metadata (IP, user-agent, etc.)
 *
 * @param c - Hono context
 * @returns Request metadata object
 *
 * @example
 * ```typescript
 * const metadata = getRequestMetadata(c);
 * // { ip: '1.2.3.4', userAgent: 'Mozilla/5.0...', country: 'US', ... }
 * ```
 */
export function getRequestMetadata(c: Context): {
	ip: string | undefined;
	userAgent: string | undefined;
	country: string | undefined;
	city: string | undefined;
	region: string | undefined;
	timezone: string | undefined;
	colo: string | undefined;
	requestId: string;
} {
	const cf = c.req.raw.cf as any;

	return {
		ip: c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For'),
		userAgent: c.req.header('User-Agent'),
		country: cf?.country,
		city: cf?.city,
		region: cf?.region,
		timezone: cf?.timezone,
		colo: cf?.colo,
		requestId: c.req.header('CF-Ray') || crypto.randomUUID(),
	};
}

/**
 * Helper to safely parse JSON body with fallback
 *
 * @param c - Hono context
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed JSON or fallback
 *
 * @example
 * ```typescript
 * const body = await parseBody(c, {});
 * const { boardId = 'main' } = body;
 * ```
 */
export async function parseBody<T = any>(c: Context, fallback: T = {} as T): Promise<T> {
	try {
		return await c.req.json<T>();
	} catch {
		return fallback;
	}
}

/**
 * Get common request context combining auth, user, and metadata
 *
 * @param c - Hono context
 * @param options - Options for what to include
 * @returns Combined context object
 *
 * @example
 * ```typescript
 * const ctx = getFullContext(c, {
 *   includeMetadata: true,
 *   includePagination: true,
 *   authContextKey: 'authContext'
 * });
 * // { auth: {...}, user: {...}, metadata: {...}, pagination: {...} }
 * ```
 */
export function getFullContext(
	c: Context,
	options: {
		includeMetadata?: boolean;
		includePagination?: boolean;
		includeSorting?: boolean;
		authContextKey?: string;
	} = {}
): Record<string, any> {
	const {
		includeMetadata = false,
		includePagination = false,
		includeSorting = false,
		authContextKey = 'authContext',
	} = options;

	const context: Record<string, any> = {
		auth: c.get(authContextKey),
		user: extractUserContext(c),
	};

	if (includeMetadata) {
		context.metadata = getRequestMetadata(c);
	}

	if (includePagination) {
		context.pagination = extractPagination(c);
	}

	if (includeSorting) {
		context.sorting = extractSorting(c);
	}

	return context;
}
