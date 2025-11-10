/**
 * @hadoku/worker-utils
 * 
 * Shared utilities for Cloudflare Workers using Hono
 * 
 * @example
 * ```typescript
 * // Import everything
 * import * as utils from '../util';
 * 
 * // Import specific modules
 * import { createKeyAuth, extractUserContext, ok, badRequest } from '../util';
 * 
 * // Import from specific files
 * import { createKeyAuth } from '../util/auth';
 * import { validateFields } from '../util/validation';
 * ```
 */

// Authentication
export {
	createAuthMiddleware,
	createKeyAuth,
	parseKeysFromEnv,
	getAuthContext,
	hasUserType,
	requireUserType,
	validateKeyAndGetType
} from './auth.js';

// Context extraction
export {
	extractField,
	extractContext,
	createContextExtractor,
	extractUserContext,
	extractPagination,
	extractSorting,
	getRequestMetadata,
	parseBody,
	getFullContext
} from './context.js';

// Validation
export {
	validateFields,
	createValidator,
	validateBody,
	CommonRules,
	requireFields,
	isNonEmptyString,
	sanitizeString
} from './validation.js';

// CORS
export {
	createCorsMiddleware,
	createHadokuCors,
	matchOrigin,
	isOriginAllowed,
	getCorsHeaders,
	CORSPresets,
	DEFAULT_HADOKU_ORIGINS
} from './cors.js';

// Logging
export {
	createLogger,
	logRequest,
	logError,
	createRequestLogger,
	loggerMiddleware,
	formatError,
	startTimer,
	redactFields,
	SENSITIVE_FIELDS
} from './logging.js';

// Masking (data sanitization for logs)
export {
	maskKey,
	maskSessionId,
	maskEmail,
	MASKING
} from './masking.js';

// Responses
export {
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
	healthCheck
} from './responses.js';

// Types
export type {
	UserType,
	AuthContext,
	AuthConfig,
	ContextExtractionConfig,
	ValidationRule,
	ValidationResult,
	LogLevel,
	LogEntry,
	LoggerConfig,
	ErrorResponse,
	SuccessResponse,
	HealthCheckResponse,
	CORSConfig
} from './types.js';
