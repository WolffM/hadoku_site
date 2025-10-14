/**
 * Standard response helpers for Cloudflare Workers
 * 
 * Consistent response formatting for:
 * - Success responses
 * - Error responses
 * - Health checks
 * - Not found responses
 * - Validation errors
 * 
 * @example
 * ```typescript
 * import { ok, created, badRequest, notFound, healthCheck } from '../util';
 * 
 * // Success response
 * return ok(c, { tasks: [...] });
 * 
 * // Created with custom message
 * return created(c, { task }, 'Task created successfully');
 * 
 * // Error response
 * return badRequest(c, 'Invalid input');
 * 
 * // Health check
 * return healthCheck(c, 'task-api', { kv: true, db: false });
 * ```
 */

import type { Context } from 'hono';
import type { ErrorResponse, SuccessResponse, HealthCheckResponse } from './types.js';

/**
 * Send a success response (200)
 * 
 * @param c - Hono context
 * @param data - Response data
 * @param message - Optional success message
 * @returns JSON response
 * 
 * @example
 * ```typescript
 * return ok(c, { tasks: [...] });
 * return ok(c, { count: 10 }, 'Retrieved successfully');
 * ```
 */
export function ok<T = any>(
	c: Context,
	data: T,
	message?: string
): Response {
	const response: SuccessResponse<T> = {
		data,
		...(message && { message }),
		timestamp: new Date().toISOString()
	};
	return c.json(response, 200);
}

/**
 * Send a created response (201)
 * 
 * @param c - Hono context
 * @param data - Created resource data
 * @param message - Optional success message
 * @returns JSON response
 * 
 * @example
 * ```typescript
 * return created(c, { task: {...} });
 * return created(c, { id: '123' }, 'Task created successfully');
 * ```
 */
export function created<T = any>(
	c: Context,
	data: T,
	message?: string
): Response {
	const response: SuccessResponse<T> = {
		data,
		message: message || 'Resource created successfully',
		timestamp: new Date().toISOString()
	};
	return c.json(response, 201);
}

/**
 * Send a no content response (204)
 * 
 * @param c - Hono context
 * @returns Empty response
 * 
 * @example
 * ```typescript
 * // After successful deletion
 * return noContent(c);
 * ```
 */
export function noContent(c: Context): Response {
	return c.body(null, 204);
}

/**
 * Send a bad request error (400)
 * 
 * @param c - Hono context
 * @param error - Error message
 * @param details - Additional error details
 * @returns JSON response
 * 
 * @example
 * ```typescript
 * return badRequest(c, 'Missing required field: id');
 * return badRequest(c, 'Validation failed', { errors: [...] });
 * ```
 */
export function badRequest(
	c: Context,
	error: string,
	details?: any
): Response {
	const response: ErrorResponse = {
		error,
		...(details && { details }),
		timestamp: new Date().toISOString()
	};
	return c.json(response, 400);
}

/**
 * Send an unauthorized error (401)
 * 
 * @param c - Hono context
 * @param message - Error message
 * @returns JSON response
 * 
 * @example
 * ```typescript
 * return unauthorized(c, 'Invalid credentials');
 * ```
 */
export function unauthorized(
	c: Context,
	message = 'Unauthorized'
): Response {
	const response: ErrorResponse = {
		error: message,
		timestamp: new Date().toISOString()
	};
	return c.json(response, 401);
}

/**
 * Send a forbidden error (403)
 * 
 * @param c - Hono context
 * @param message - Error message
 * @returns JSON response
 * 
 * @example
 * ```typescript
 * return forbidden(c, 'Insufficient permissions');
 * ```
 */
export function forbidden(
	c: Context,
	message = 'Forbidden'
): Response {
	const response: ErrorResponse = {
		error: message,
		timestamp: new Date().toISOString()
	};
	return c.json(response, 403);
}

/**
 * Send a not found error (404)
 * 
 * @param c - Hono context
 * @param resource - Resource type that wasn't found
 * @returns JSON response
 * 
 * @example
 * ```typescript
 * return notFound(c, 'Task');
 * return notFound(c, 'Board');
 * ```
 */
export function notFound(
	c: Context,
	resource = 'Resource'
): Response {
	const response: ErrorResponse = {
		error: `${resource} not found`,
		timestamp: new Date().toISOString()
	};
	return c.json(response, 404);
}

/**
 * Send a conflict error (409)
 * 
 * @param c - Hono context
 * @param message - Error message
 * @returns JSON response
 * 
 * @example
 * ```typescript
 * return conflict(c, 'Board with this ID already exists');
 * ```
 */
export function conflict(
	c: Context,
	message: string
): Response {
	const response: ErrorResponse = {
		error: message,
		timestamp: new Date().toISOString()
	};
	return c.json(response, 409);
}

/**
 * Send an internal server error (500)
 * 
 * @param c - Hono context
 * @param message - Error message
 * @param details - Additional error details (omit in production)
 * @returns JSON response
 * 
 * @example
 * ```typescript
 * return serverError(c, 'Failed to process request');
 * return serverError(c, 'Database error', { error: err.message });
 * ```
 */
export function serverError(
	c: Context,
	message = 'Internal server error',
	details?: any
): Response {
	const response: ErrorResponse = {
		error: message,
		...(details && { details }),
		timestamp: new Date().toISOString()
	};
	return c.json(response, 500);
}

/**
 * Send validation errors (400)
 * 
 * @param c - Hono context
 * @param errors - Array of validation errors
 * @param message - Optional error message
 * @returns JSON response
 * 
 * @example
 * ```typescript
 * const validation = validateFields(body, rules);
 * if (!validation.valid) {
 *   return validationError(c, validation.errors);
 * }
 * ```
 */
export function validationError(
	c: Context,
	errors: Array<{ field: string; message: string }>,
	message = 'Validation failed'
): Response {
	const response: ErrorResponse = {
		error: message,
		details: { errors },
		timestamp: new Date().toISOString()
	};
	return c.json(response, 400);
}

/**
 * Send a health check response
 * 
 * @param c - Hono context
 * @param serviceName - Name of the service
 * @param checks - Optional health check results
 * @param options - Additional options
 * @returns JSON response
 * 
 * @example
 * ```typescript
 * // Simple health check
 * return healthCheck(c, 'task-api');
 * 
 * // With dependency checks
 * return healthCheck(c, 'task-api', {
 *   kv: await checkKV(),
 *   api: await checkAPI()
 * });
 * 
 * // Degraded status
 * return healthCheck(c, 'task-api', { kv: false }, {
 *   status: 'degraded'
 * });
 * ```
 */
export function healthCheck(
	c: Context,
	serviceName: string,
	checks?: Record<string, boolean | string>,
	options: {
		status?: 'ok' | 'degraded' | 'error';
		version?: string;
	} = {}
): Response {
	// Determine overall status based on checks
	let status: 'ok' | 'degraded' | 'error' = options.status || 'ok';
	
	if (checks && !options.status) {
		const hasFailures = Object.values(checks).some(v => v === false);
		const allFailed = Object.values(checks).every(v => v === false);
		
		if (allFailed) {
			status = 'error';
		} else if (hasFailures) {
			status = 'degraded';
		}
	}
	
	const response: HealthCheckResponse = {
		status,
		service: serviceName,
		timestamp: new Date().toISOString(),
		...(options.version && { version: options.version }),
		...(checks && { checks })
	};
	
	const statusCode = status === 'error' ? 503 : 200;
	return c.json(response, statusCode);
}

/**
 * Create a standard health check handler
 * 
 * @param serviceName - Name of the service
 * @param options - Additional options
 * @returns Handler function
 * 
 * @example
 * ```typescript
 * app.get('/health', createHealthCheckHandler('task-api', {
 *   version: '1.0.0'
 * }));
 * 
 * // With async checks
 * app.get('/health', createHealthCheckHandler('task-api', {
 *   checks: async (c) => ({
 *     kv: await c.env.TASKS_KV.get('health-check') !== null,
 *     timestamp: Date.now()
 *   })
 * }));
 * ```
 */
export function createHealthCheckHandler(
	serviceName: string,
	options: {
		version?: string;
		checks?: (c: Context) => Record<string, boolean | string> | Promise<Record<string, boolean | string>>;
	} = {}
) {
	return async (c: Context) => {
		const checks = options.checks ? await options.checks(c) : undefined;
		return healthCheck(c, serviceName, checks, {
			version: options.version
		});
	};
}

/**
 * Helper to handle errors consistently
 * 
 * @param c - Hono context
 * @param error - Error object
 * @param defaultMessage - Default message if error is unknown
 * @returns JSON response
 * 
 * @example
 * ```typescript
 * try {
 *   // ... do work
 * } catch (error) {
 *   return handleError(c, error, 'Failed to process request');
 * }
 * ```
 */
export function handleError(
	c: Context,
	error: unknown,
	defaultMessage = 'An error occurred'
): Response {
	if (error instanceof Error) {
		// In production, you might want to hide error details
		return serverError(c, error.message);
	}
	
	return serverError(c, defaultMessage);
}

/**
 * Wrap an async handler with error handling
 * 
 * @param handler - Async handler function
 * @returns Wrapped handler with error handling
 * 
 * @example
 * ```typescript
 * app.get('/tasks', withErrorHandling(async (c) => {
 *   const tasks = await getTasks(); // May throw
 *   return ok(c, { tasks });
 * }));
 * ```
 */
export function withErrorHandling(
	handler: (c: Context) => Promise<Response>
) {
	return async (c: Context) => {
		try {
			return await handler(c);
		} catch (error) {
			return handleError(c, error);
		}
	};
}

/**
 * Response helpers object for convenient importing
 * 
 * @example
 * ```typescript
 * import { responses } from '../util';
 * 
 * return responses.ok(c, data);
 * return responses.badRequest(c, 'Invalid input');
 * return responses.healthCheck(c, 'my-api');
 * ```
 */
export const responses = {
	ok,
	created,
	noContent,
	badRequest,
	unauthorized,
	forbidden,
	notFound,
	conflict,
	serverError,
	validationError,
	healthCheck,
	handleError
};
