/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Shared types for worker utilities
 */
import type { Context } from 'hono';

// ============================================================================
// Authentication Types
// ============================================================================

export type UserType = string; // 'admin' | 'friend' | 'public' | custom types

export interface AuthContext {
	userType: UserType;
	[key: string]: unknown; // Allow additional custom fields
}

export interface AuthConfig<TEnv = any> {
	/**
	 * Sources to check for authentication credentials (in order of priority)
	 * @example ['header:X-User-Key', 'query:key', 'cookie:auth_token']
	 */
	sources: string[];

	/**
	 * Function to resolve userType from the extracted credential
	 * @param credential - The extracted auth credential
	 * @param env - The worker environment bindings
	 * @returns UserType or AuthContext object
	 */
	resolver: (credential: string | undefined, env: TEnv) => UserType | AuthContext;

	/**
	 * Variable name to store auth context in Hono context
	 * @default 'authContext'
	 */
	contextKey?: string;

	/**
	 * Additional fields to add to auth context
	 */
	additionalFields?: (c: Context, env: TEnv) => Record<string, any>;
}

// ============================================================================
// Context Extraction Types
// ============================================================================

export interface ContextExtractionConfig {
	/**
	 * Mappings of context field name to sources
	 * @example { userId: ['header:X-User-Id', 'query:userId'], sessionId: ['header:X-Session-Id'] }
	 */
	fields: Record<string, string[]>;

	/**
	 * Default values for fields if not found
	 * @example { userId: 'anonymous', boardId: 'main' }
	 */
	defaults?: Record<string, any>;

	/**
	 * Transform functions for extracted values
	 * @example { userId: (val) => val?.toLowerCase() }
	 */
	transforms?: Record<string, (value: unknown) => any>;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationRule {
	field: string;
	required?: boolean;
	type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	custom?: (value: unknown) => boolean | string; // Return true or error message
}

export interface ValidationResult {
	valid: boolean;
	errors: { field: string; message: string }[];
}

// ============================================================================
// Logging Types
// ============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
	timestamp: string;
	level: LogLevel;
	message: string;
	context?: Record<string, any>;
}

export interface LoggerConfig {
	/**
	 * Minimum log level to output
	 * @default 'info'
	 */
	minLevel?: LogLevel;

	/**
	 * Include timestamp in logs
	 * @default true
	 */
	includeTimestamp?: boolean;

	/**
	 * Prefix for all log messages
	 * @example '[task-api]'
	 */
	prefix?: string;

	/**
	 * Custom formatter for log output
	 */
	formatter?: (entry: LogEntry) => string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface ErrorResponse {
	error: string;
	details?: unknown;
	timestamp?: string;
}

export interface SuccessResponse<T = any> {
	data: T;
	message?: string;
	timestamp?: string;
}

export interface HealthCheckResponse {
	status: 'ok' | 'degraded' | 'error';
	service: string;
	timestamp: string;
	version?: string;
	checks?: Record<string, boolean | string>;
}

// ============================================================================
// CORS Types
// ============================================================================

export interface CORSConfig {
	/**
	 * Allowed origins (supports wildcards like 'http://localhost:*')
	 */
	origins: string[];

	/**
	 * Allowed HTTP methods
	 * @default ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
	 */
	methods?: string[];

	/**
	 * Allowed headers
	 */
	allowedHeaders?: string[];

	/**
	 * Exposed headers
	 */
	exposedHeaders?: string[];

	/**
	 * Allow credentials
	 * @default true
	 */
	credentials?: boolean;

	/**
	 * Max age for preflight cache
	 * @default 86400 (24 hours)
	 */
	maxAge?: number;
}
