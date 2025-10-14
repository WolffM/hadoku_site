/**
 * Structured logging utilities for Cloudflare Workers
 * 
 * Provides consistent, configurable logging with:
 * - Log levels (debug, info, warn, error)
 * - Contextual information
 * - Structured output
 * - Request/route-specific logging
 * 
 * @example
 * ```typescript
 * import { createLogger, logRequest, logError } from '../util';
 * 
 * // Create logger with configuration
 * const logger = createLogger({
 *   prefix: '[task-api]',
 *   minLevel: 'info'
 * });
 * 
 * logger.info('Processing request', { userId: '123', boardId: 'main' });
 * logger.error('Failed to save', { error: err.message, taskId: '456' });
 * 
 * // Or use helper functions
 * logRequest('GET', '/task/api/tasks', { userId: '123', userType: 'admin' });
 * logError('POST', '/task/api', 'Missing required field: id');
 * ```
 */

import type { LogLevel, LogEntry, LoggerConfig } from './types.js';

/**
 * Log level priorities (for filtering)
 */
const LOG_LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3
};

/**
 * Default log formatter
 */
function defaultFormatter(entry: LogEntry): string {
	const parts = [];
	
	if (entry.timestamp) {
		parts.push(`[${entry.timestamp}]`);
	}
	
	parts.push(`[${entry.level.toUpperCase()}]`);
	parts.push(entry.message);
	
	if (entry.context && Object.keys(entry.context).length > 0) {
		parts.push(JSON.stringify(entry.context));
	}
	
	return parts.join(' ');
}

/**
 * Create a structured logger
 * 
 * @param config - Logger configuration
 * @returns Logger instance
 * 
 * @example
 * ```typescript
 * const logger = createLogger({
 *   prefix: '[my-api]',
 *   minLevel: 'info',
 *   includeTimestamp: true
 * });
 * 
 * logger.debug('Debug info', { details: '...' }); // Not logged (below minLevel)
 * logger.info('User authenticated', { userId: '123' });
 * logger.warn('Rate limit approaching', { requests: 95, limit: 100 });
 * logger.error('Database error', { error: err.message });
 * ```
 */
export function createLogger(config: LoggerConfig = {}) {
	const {
		minLevel = 'info',
		includeTimestamp = true,
		prefix = '',
		formatter = defaultFormatter
	} = config;
	
	const minLevelPriority = LOG_LEVELS[minLevel];
	
	function log(level: LogLevel, message: string, context?: Record<string, any>) {
		// Check if level should be logged
		if (LOG_LEVELS[level] < minLevelPriority) {
			return;
		}
		
		const entry: LogEntry = {
			timestamp: includeTimestamp ? new Date().toISOString() : '',
			level,
			message: prefix ? `${prefix} ${message}` : message,
			context
		};
		
		const output = formatter(entry);
		
		// Route to appropriate console method
		switch (level) {
			case 'error':
				console.error(output);
				break;
			case 'warn':
				console.warn(output);
				break;
			case 'info':
				console.info(output);
				break;
			case 'debug':
			default:
				console.log(output);
				break;
		}
	}
	
	return {
		debug: (message: string, context?: Record<string, any>) => log('debug', message, context),
		info: (message: string, context?: Record<string, any>) => log('info', message, context),
		warn: (message: string, context?: Record<string, any>) => log('warn', message, context),
		error: (message: string, context?: Record<string, any>) => log('error', message, context),
		
		// Utility to create child logger with additional prefix
		child: (childPrefix: string) => createLogger({
			...config,
			prefix: prefix ? `${prefix}${childPrefix}` : childPrefix
		})
	};
}

/**
 * Log HTTP request
 * 
 * @param method - HTTP method
 * @param path - Request path
 * @param context - Additional context
 * @param level - Log level (default: 'info')
 * 
 * @example
 * ```typescript
 * logRequest('GET', '/task/api/tasks', {
 *   userId: '123',
 *   userType: 'admin',
 *   boardId: 'main'
 * });
 * // Output: [INFO] [GET /task/api/tasks] {"userId":"123","userType":"admin","boardId":"main"}
 * ```
 */
export function logRequest(
	method: string,
	path: string,
	context?: Record<string, any>,
	level: LogLevel = 'info'
) {
	const message = `[${method} ${path}]`;
	
	switch (level) {
		case 'error':
			console.error(message, context || '');
			break;
		case 'warn':
			console.warn(message, context || '');
			break;
		case 'debug':
			console.log(message, context || '');
			break;
		case 'info':
		default:
			console.log(message, context || '');
			break;
	}
}

/**
 * Log error for HTTP request
 * 
 * @param method - HTTP method
 * @param path - Request path
 * @param error - Error message or object
 * @param context - Additional context
 * 
 * @example
 * ```typescript
 * logError('POST', '/task/api', 'Missing required field: id', { body });
 * // Output: [ERROR] [POST /task/api] ERROR: Missing required field: id {...}
 * ```
 */
export function logError(
	method: string,
	path: string,
	error: string | Error,
	context?: Record<string, any>
) {
	const errorMessage = error instanceof Error ? error.message : error;
	const message = `[${method} ${path}] ERROR: ${errorMessage}`;
	
	const fullContext = {
		...context,
		...(error instanceof Error && { stack: error.stack })
	};
	
	console.error(message, Object.keys(fullContext).length > 0 ? fullContext : '');
}

/**
 * Create request-scoped logger that includes method and path
 * 
 * @param method - HTTP method
 * @param path - Request path
 * @param baseContext - Base context to include in all logs
 * @returns Request logger
 * 
 * @example
 * ```typescript
 * app.post('/task/api', async (c) => {
 *   const log = createRequestLogger('POST', '/task/api', {
 *     userId: c.get('authContext').userId
 *   });
 *   
 *   log.info('Starting request');
 *   log.debug('Validating input', { body });
 *   log.error('Validation failed', { errors });
 *   log.info('Request completed', { taskId: '123' });
 * });
 * ```
 */
export function createRequestLogger(
	method: string,
	path: string,
	baseContext: Record<string, any> = {}
) {
	const prefix = `[${method} ${path}]`;
	
	return {
		debug: (message: string, context?: Record<string, any>) => {
			console.log(`${prefix} ${message}`, { ...baseContext, ...context });
		},
		info: (message: string, context?: Record<string, any>) => {
			console.log(`${prefix} ${message}`, { ...baseContext, ...context });
		},
		warn: (message: string, context?: Record<string, any>) => {
			console.warn(`${prefix} ${message}`, { ...baseContext, ...context });
		},
		error: (message: string, context?: Record<string, any>) => {
			console.error(`${prefix} ERROR: ${message}`, { ...baseContext, ...context });
		}
	};
}

/**
 * Middleware to add logger to context
 * 
 * @param config - Logger configuration
 * @param contextKey - Key to store logger in context
 * @returns Hono middleware
 * 
 * @example
 * ```typescript
 * app.use('*', loggerMiddleware({ prefix: '[task-api]' }));
 * 
 * app.get('/tasks', (c) => {
 *   const log = c.get('logger');
 *   log.info('Fetching tasks');
 * });
 * ```
 */
export function loggerMiddleware(
	config: LoggerConfig = {},
	contextKey = 'logger'
) {
	return async (c: any, next: any) => {
		const logger = createLogger(config);
		c.set(contextKey, logger);
		await next();
	};
}

/**
 * Format error for logging
 * 
 * @param error - Error object
 * @returns Formatted error object
 */
export function formatError(error: Error | unknown): Record<string, any> {
	if (error instanceof Error) {
		return {
			name: error.name,
			message: error.message,
			stack: error.stack
		};
	}
	
	return {
		error: String(error)
	};
}

/**
 * Log timing information for requests
 * 
 * @example
 * ```typescript
 * const timer = startTimer();
 * // ... do work ...
 * timer.end('Task created successfully', { taskId: '123' });
 * // Output: Task created successfully (duration: 123ms) {"taskId":"123"}
 * ```
 */
export function startTimer() {
	const start = Date.now();
	
	return {
		/**
		 * End timer and log duration
		 */
		end: (message: string, context?: Record<string, any>) => {
			const duration = Date.now() - start;
			console.log(`${message} (duration: ${duration}ms)`, context || '');
			return duration;
		},
		
		/**
		 * Get elapsed time without logging
		 */
		elapsed: () => Date.now() - start
	};
}

/**
 * Redact sensitive fields from objects before logging
 * 
 * @param obj - Object to redact
 * @param fields - Array of field names to redact
 * @returns New object with redacted fields
 * 
 * @example
 * ```typescript
 * const data = { userId: '123', apiKey: 'secret', password: '12345' };
 * const safe = redactFields(data, ['apiKey', 'password']);
 * logger.info('User data', safe);
 * // Output: {"userId":"123","apiKey":"[REDACTED]","password":"[REDACTED]"}
 * ```
 */
export function redactFields(
	obj: Record<string, any>,
	fields: string[]
): Record<string, any> {
	const redacted = { ...obj };
	
	for (const field of fields) {
		if (field in redacted) {
			redacted[field] = '[REDACTED]';
		}
	}
	
	return redacted;
}

/**
 * Common fields to redact for security
 */
export const SENSITIVE_FIELDS = [
	'password',
	'apiKey',
	'api_key',
	'token',
	'accessToken',
	'access_token',
	'refreshToken',
	'refresh_token',
	'secret',
	'privateKey',
	'private_key',
	'authorization',
	'cookie',
	'session'
];
