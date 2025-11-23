/**
 * Resume API Constants
 * Centralized configuration for the resume chatbot API
 */

// LLM Configuration (Groq)
export const LLM_CONFIG = {
	BASE_URL: 'https://api.groq.com/openai/v1',
	MODEL: 'openai/gpt-oss-120b',
	TEMPERATURE: 0.7,
	MAX_TOKENS: 512, // Limits output to 512 tokens
} as const;

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
	MAX_REQUESTS_PER_WINDOW: 30, // 30 requests per window (Groq free tier)
	WINDOW_DURATION_SECONDS: 60, // 1 minute window
	KV_TTL_SECONDS: 120, // TTL for rate limit entries (2 minutes)
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
	OK: 200,
	BAD_REQUEST: 400,
	TOO_MANY_REQUESTS: 429,
	INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
	MISSING_MESSAGES: 'Missing or invalid messages array',
	RATE_LIMITED: 'Rate limit exceeded',
	LLM_ERROR: 'Failed to get response from LLM',
	INVALID_REQUEST: 'Invalid request',
} as const;
