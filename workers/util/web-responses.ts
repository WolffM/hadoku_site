/**
 * Standard Response helpers for Web API (non-Hono workers)
 * 
 * These are plain Web API Response helpers that don't depend on Hono.
 * Use these in edge-router and other workers that use native fetch handlers.
 * 
 * For Hono-based workers, use the helpers from responses.ts instead.
 * 
 * @example
 * ```typescript
 * import { jsonResponse, jsonError } from './util/web-responses';
 * 
 * // Success response
 * return jsonResponse({ data: [...] });
 * 
 * // Error response
 * return jsonError('Invalid input', 400);
 * 
 * // With additional headers
 * return jsonResponse({ status: 'ok' }, 200, { 'X-Custom': 'value' });
 * ```
 */

/**
 * Standard JSON response headers with CORS
 */
const JSON_HEADERS = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*'
};

/**
 * Create standard JSON response headers with CORS
 * 
 * @param additionalHeaders - Additional headers to merge
 * @returns Headers object
 */
export function createJsonHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
	return {
		...JSON_HEADERS,
		...additionalHeaders
	};
}

/**
 * Create JSON response with standard headers
 * 
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @param additionalHeaders - Additional headers to merge
 * @returns Response object
 * 
 * @example
 * ```typescript
 * return jsonResponse({ tasks: [...] });
 * return jsonResponse({ id: '123' }, 201);
 * return jsonResponse({ data }, 200, { 'X-Request-Id': id });
 * ```
 */
export function jsonResponse(
	data: any,
	status: number = 200,
	additionalHeaders: Record<string, string> = {}
): Response {
	return new Response(
		JSON.stringify(data),
		{
			status,
			headers: createJsonHeaders(additionalHeaders)
		}
	);
}

/**
 * Create JSON error response
 * 
 * @param error - Error message
 * @param status - HTTP status code (default: 500)
 * @param additionalHeaders - Additional headers to merge
 * @returns Response object
 * 
 * @example
 * ```typescript
 * return jsonError('Not found', 404);
 * return jsonError('Bad request', 400);
 * return jsonError('Server error', 500, { 'X-Error-Code': 'INTERNAL' });
 * ```
 */
export function jsonError(
	error: string,
	status: number = 500,
	additionalHeaders: Record<string, string> = {}
): Response {
	return jsonResponse({ error }, status, additionalHeaders);
}

/**
 * Create CORS preflight response
 * 
 * @param options - CORS configuration
 * @returns Response object
 * 
 * @example
 * ```typescript
 * if (request.method === 'OPTIONS') {
 *   return corsPreflight();
 * }
 * 
 * // Custom allowed headers
 * return corsPreflight({
 *   allowHeaders: ['X-Custom', 'Authorization']
 * });
 * ```
 */
export function corsPreflight(options: {
	allowOrigin?: string;
	allowMethods?: string[];
	allowHeaders?: string[];
	maxAge?: number;
} = {}): Response {
	const {
		allowOrigin = '*',
		allowMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders = ['X-User-Key', 'X-Session-Id', 'Content-Type'],
		maxAge = 86400
	} = options;

	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': allowOrigin,
			'Access-Control-Allow-Methods': allowMethods.join(', '),
			'Access-Control-Allow-Headers': allowHeaders.join(', '),
			'Access-Control-Max-Age': maxAge.toString()
		}
	});
}

/**
 * Standard HTTP status codes
 */
export const HttpStatus = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503
} as const;
