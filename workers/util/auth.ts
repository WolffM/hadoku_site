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
		case 'cookie':
			// Parse cookies from Cookie header
			const cookieHeader = c.req.header('Cookie');
			if (!cookieHeader) return undefined;
			const cookies = Object.fromEntries(
				cookieHeader.split(';').map(c => {
					const [k, v] = c.trim().split('=');
					return [k, v];
				})
			);
			return cookies[key];
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
export function createAuthMiddleware<TEnv = any>(
	config: AuthConfig<TEnv>
): MiddlewareHandler {
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
): Record<string, string> {
	if (!jsonString) {
		return {};
	}
	
	try {
		const parsed = JSON.parse(jsonString);
		
		// Handle array format: ["key1", "key2", "key3"]
		// Each key gets userId = "" (empty string)
		if (Array.isArray(parsed)) {
			const result: Record<string, string> = {};
			parsed.forEach(key => {
				if (typeof key === 'string') {
					result[key] = '';  // Default userId to empty string
				}
			});
			return result;
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
export function createKeyAuth<TEnv = any>(
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
		includeHelpers = true
	} = options;
	
	return createAuthMiddleware({
		sources,
		contextKey,
		resolver: (credential, env) => {
			const keys = keyMap(env);
			const userType = credential && keys[credential] 
				? keys[credential] 
				: defaultUserType;
			
			// Build auth context with optional helpers
			const authContext: AuthContext = { userType };
			
			if (includeHelpers) {
				// Add common boolean helpers
				authContext.isPublic = userType === 'public';
				authContext.isFriend = userType === 'friend';
				authContext.isAdmin = userType === 'admin';
			}
			
			return authContext;
		}
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
		errorStatus = 403
	} = options;
	
	return async (c: Context, next: Next) => {
		if (!hasUserType(c, allowedTypes, contextKey)) {
			return c.json({ error: errorMessage }, errorStatus);
		}
		await next();
	};
}
