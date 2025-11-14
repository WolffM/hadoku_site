/**
 * Generic authentication middleware for Cloudflare Workers using Hono
 *
 * Supports multiple authentication strategies:
 * - Header-based (X-User-Key, Authorization, etc.)
 * - Query parameter-based (key, token, etc.)
 * - Cookie-based (auth_token, session, etc.)
 *
 * @example
 * ```typescript
 * // Simple key-based auth
 * app.use('*', createAuthMiddleware({
 *   sources: ['header:X-User-Key', 'query:key'],
 *   resolver: (credential, env) => {
 *     if (credential === env.ADMIN_KEY) return 'admin';
 *     if (credential === env.FRIEND_KEY) return 'friend';
 *     return 'public';
 *   }
 * }));
 *
 * // Advanced auth with custom context
 * app.use('*', createAuthMiddleware({
 *   sources: ['header:Authorization', 'cookie:session'],
 *   resolver: (credential, env) => ({
 *     userType: validateToken(credential) ? 'authenticated' : 'guest',
 *     roles: ['read', 'write'],
 *     authenticated: !!credential
 *   }),
 *   additionalFields: (c, env) => ({
 *     requestId: crypto.randomUUID(),
 *     ip: c.req.header('CF-Connecting-IP')
 *   })
 * }));
 * ```
 */

import type { Context, Next, MiddlewareHandler } from 'hono';
import type { AuthConfig, AuthContext } from './types.js';

/**
 * Extract credential from request based on source specification
 *
 * @param c - Hono context
 * @param source - Source specification (e.g., 'header:X-User-Key', 'query:key', 'cookie:token')
 * @returns Extracted credential or undefined
 */
function extractCredential(c: Context, source: string): string | undefined {
	const [type, key] = source.split(':');

	switch (type.toLowerCase()) {
		case 'header':
			return c.req.header(key);
		case 'query':
			return c.req.query(key);
		case 'cookie': {
			// Parse cookies from Cookie header
			const cookieHeader = c.req.header('Cookie');
			if (!cookieHeader) return undefined;
			const cookies = Object.fromEntries(
				cookieHeader.split(';').map((c) => {
					const [k, v] = c.trim().split('=');
					return [k, v];
				})
			);
			return cookies[key];
		}
		default:
			console.warn(`[auth] Unknown credential source type: ${type}`);
			return undefined;
	}
}

/**
 * Create authentication middleware
 *
 * @param config - Authentication configuration
 * @returns Hono middleware handler
 */
export function createAuthMiddleware<
	TEnv extends Record<string, unknown> = Record<string, unknown>,
>(config: AuthConfig<TEnv>): MiddlewareHandler {
	const contextKey = config.contextKey || 'authContext';

	return async (c: Context, next: Next) => {
		// Extract credential from sources (in priority order)
		let credential: string | undefined;
		for (const source of config.sources) {
			credential = extractCredential(c, source);
			if (credential) break;
		}

		// Resolve auth context
		const resolved = config.resolver(credential, c.env as TEnv);

		// Build auth context
		let authContext: AuthContext;
		if (typeof resolved === 'string') {
			authContext = { userType: resolved };
		} else {
			authContext = resolved;
		}

		// Add additional fields if configured
		if (config.additionalFields) {
			const additional = config.additionalFields(c, c.env as TEnv);
			authContext = { ...authContext, ...additional };
		}

		// Store in context
		c.set(contextKey, authContext);

		await next();
	};
}

/**
 * Parse JSON keys from environment variable
 *
 * @param jsonString - JSON string from environment variable (e.g., '{"key1": "user1", "key2": "user2"}')
 * @returns Map of keys to user types/IDs
 *
 * @example
 * ```typescript
 * const keys = parseKeysFromEnv('{"abc123": "admin", "def456": "admin2"}');
 * // Returns: { "abc123": "admin", "def456": "admin2" }
 *
 * const keys = parseKeysFromEnv(undefined);
 * // Returns: {}
 * ```
 */
export function parseKeysFromEnv(
	jsonString: string | undefined
): Record<string, string> | Set<string> {
	if (!jsonString) {
		return {};
	}

	try {
		const parsed = JSON.parse(jsonString);

		// Handle array format: ["key1", "key2", "key3"]
		// Return as Set for membership checking
		if (Array.isArray(parsed)) {
			return new Set(parsed.filter((key) => typeof key === 'string'));
		}

		// Handle object format: {"key1": "userId1", "key2": "userId2"}
		if (typeof parsed === 'object' && parsed !== null) {
			return parsed as Record<string, string>;
		}
	} catch (error) {
		console.warn('Failed to parse keys JSON:', error);
	}

	return {};
}

/**
 * Create a simple key-based auth middleware (common pattern)
 *
 * @param keyMap - Function that returns a map of keys to user types
 * @param options - Additional options
 * @returns Hono middleware handler
 *
 * @example
 * ```typescript
 * // Parse JSON key objects from environment
 * app.use('*', createKeyAuth(
 *   (env) => {
 *     const adminKeys = parseKeysFromEnv(env.ADMIN_KEYS);
 *     const friendKeys = parseKeysFromEnv(env.FRIEND_KEYS);
 *     return { ...adminKeys, ...friendKeys };
 *   },
 *   {
 *     sources: ['header:X-User-Key', 'query:key'],
 *     defaultUserType: 'public',
 *     includeHelpers: true
 *   }
 * ));
 *
 * // Or use a static map
 * app.use('*', createKeyAuth(
 *   (env) => ({
 *     'key-abc-123': 'admin',
 *     'key-def-456': 'friend'
 *   }),
 *   {
 *     sources: ['header:X-User-Key', 'query:key'],
 *     defaultUserType: 'public',
 *     includeHelpers: true
 *   }
 * ));
 * ```
 */
export function createKeyAuth<TEnv extends Record<string, unknown> = Record<string, unknown>>(
	keyMap: (env: TEnv) => Record<string, string>,
	options: {
		sources?: string[];
		defaultUserType?: string;
		contextKey?: string;
		includeHelpers?: boolean; // Add isPublic, isFriend, isAdmin helpers
	} = {}
): MiddlewareHandler {
	const {
		sources = ['header:X-User-Key', 'query:key'],
		defaultUserType = 'public',
		contextKey = 'authContext',
		includeHelpers = true,
	} = options;

	return createAuthMiddleware({
		sources,
		contextKey,
		resolver: (credential, env) => {
			const keys = keyMap(env as TEnv);
			const userType = credential && keys[credential] ? keys[credential] : defaultUserType;

			// Build auth context with optional helpers
			const authContext: AuthContext = { userType };

			if (includeHelpers) {
				// Add common boolean helpers
				authContext.isPublic = userType === 'public';
				authContext.isFriend = userType === 'friend';
				authContext.isAdmin = userType === 'admin';
			}

			return authContext;
		},
	});
}

/**
 * Get auth context from Hono context
 *
 * @param c - Hono context
 * @param contextKey - Key where auth context is stored
 * @returns Auth context
 */
export function getAuthContext(c: Context, contextKey = 'authContext'): AuthContext {
	return c.get(contextKey) as AuthContext;
}

/**
 * Check if user has required user type
 *
 * @param c - Hono context
 * @param allowedTypes - Array of allowed user types
 * @param contextKey - Key where auth context is stored
 * @returns True if user has required type
 */
export function hasUserType(
	c: Context,
	allowedTypes: string[],
	contextKey = 'authContext'
): boolean {
	const auth = getAuthContext(c, contextKey);
	return allowedTypes.includes(auth.userType);
}

/**
 * Create middleware to require specific user types
 *
 * @param allowedTypes - Array of allowed user types
 * @param options - Options for error response
 * @returns Hono middleware handler
 *
 * @example
 * ```typescript
 * app.post('/admin/*', requireUserType(['admin']));
 * app.post('/tasks', requireUserType(['admin', 'friend']));
 * ```
 */
export function requireUserType(
	allowedTypes: string[],
	options: {
		contextKey?: string;
		errorMessage?: string;
		errorStatus?: number;
	} = {}
): MiddlewareHandler {
	const {
		contextKey = 'authContext',
		errorMessage = 'Insufficient permissions',
		errorStatus = 403,
	} = options;

	return async (c: Context, next: Next) => {
		if (!hasUserType(c, allowedTypes, contextKey)) {
			// Type assertion needed - errorStatus is validated to be 401 or 403
			return c.json({ error: errorMessage }, errorStatus as 401 | 403);
		}
		await next();
	};
}

/**
 * Validate a key and determine userType
 *
 * Generic utility for checking if a key exists in admin/friend key sets/maps
 * and returning the appropriate user type.
 *
 * @param key - The key to validate
 * @param adminKeys - Admin keys (Set or Record)
 * @param friendKeys - Friend keys (Set or Record)
 * @returns Validation result with userType
 *
 * @example
 * ```typescript
 * const adminKeys = new Set(['admin-key-1', 'admin-key-2']);
 * const friendKeys = { 'friend-1': 'user1', 'friend-2': 'user2' };
 *
 * const result = validateKeyAndGetType('admin-key-1', adminKeys, friendKeys);
 * // Returns: { valid: true, userType: 'admin' }
 *
 * const result2 = validateKeyAndGetType('friend-1', adminKeys, friendKeys);
 * // Returns: { valid: true, userType: 'friend' }
 *
 * const result3 = validateKeyAndGetType('invalid', adminKeys, friendKeys);
 * // Returns: { valid: false, userType: 'public' }
 * ```
 */
export function validateKeyAndGetType(
	key: string,
	adminKeys: Record<string, string> | Set<string>,
	friendKeys: Record<string, string> | Set<string>
): { valid: boolean; userType: 'admin' | 'friend' | 'public' } {
	// Check admin keys
	if (adminKeys instanceof Set) {
		if (adminKeys.has(key)) {
			return { valid: true, userType: 'admin' };
		}
	} else if (key in adminKeys) {
		return { valid: true, userType: 'admin' };
	}

	// Check friend keys
	if (friendKeys instanceof Set) {
		if (friendKeys.has(key)) {
			return { valid: true, userType: 'friend' };
		}
	} else if (key in friendKeys) {
		return { valid: true, userType: 'friend' };
	}

	// Not found in either
	return { valid: false, userType: 'public' };
}
