/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Validation utilities for request data
 *
 * Generic field validation with support for:
 * - Required field checks
 * - Type validation
 * - String length constraints
 * - Pattern matching (regex)
 * - Custom validation functions
 *
 * @example
 * ```typescript
 * // Validate request body
 * const validation = validateFields(body, [
 *   { field: 'id', required: true, type: 'string' },
 *   { field: 'title', required: true, type: 'string', minLength: 1, maxLength: 200 },
 *   { field: 'email', pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ },
 *   { field: 'age', type: 'number', custom: (val) => val >= 18 || 'Must be 18 or older' }
 * ]);
 *
 * if (!validation.valid) {
 *   return c.json({ errors: validation.errors }, 400);
 * }
 * ```
 */

import type { ValidationRule, ValidationResult } from './types.js';

/**
 * Validate a single field against rules
 *
 * @param value - The value to validate
 * @param rule - Validation rule
 * @returns Error message or null if valid
 */
function validateField(value: unknown, rule: ValidationRule): string | null {
	// Check required
	if (rule.required && (value === undefined || value === null || value === '')) {
		return `${rule.field} is required`;
	}

	// Skip further validation if value is not present and not required
	if (value === undefined || value === null) {
		return null;
	}

	// Check type
	if (rule.type) {
		const actualType = Array.isArray(value) ? 'array' : typeof value;
		if (actualType !== rule.type) {
			return `${rule.field} must be of type ${rule.type}`;
		}
	}

	// String-specific validations
	if (typeof value === 'string') {
		if (rule.minLength !== undefined && value.length < rule.minLength) {
			return `${rule.field} must be at least ${rule.minLength} characters`;
		}

		if (rule.maxLength !== undefined && value.length > rule.maxLength) {
			return `${rule.field} must be at most ${rule.maxLength} characters`;
		}

		if (rule.pattern && !rule.pattern.test(value)) {
			return `${rule.field} format is invalid`;
		}
	}

	// Custom validation
	if (rule.custom) {
		const result = rule.custom(value);
		if (result !== true && typeof result === 'string') {
			return result;
		}
		if (result === false) {
			return `${rule.field} is invalid`;
		}
	}

	return null;
}

/**
 * Validate multiple fields against rules
 *
 * @param data - Data object to validate
 * @param rules - Array of validation rules
 * @returns Validation result with errors
 *
 * @example
 * ```typescript
 * const result = validateFields(requestBody, [
 *   { field: 'id', required: true },
 *   { field: 'title', required: true, minLength: 1 },
 *   { field: 'tags', type: 'array' }
 * ]);
 *
 * if (!result.valid) {
 *   console.log(result.errors);
 *   // [{ field: 'title', message: 'title must be at least 1 characters' }]
 * }
 * ```
 */
export function validateFields(
	data: Record<string, any>,
	rules: ValidationRule[]
): ValidationResult {
	const errors: { field: string; message: string }[] = [];

	for (const rule of rules) {
		const value = data[rule.field];
		const error = validateField(value, rule);

		if (error) {
			errors.push({ field: rule.field, message: error });
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Create a reusable validator function
 *
 * @param rules - Validation rules
 * @returns Validator function
 *
 * @example
 * ```typescript
 * const validateTask = createValidator([
 *   { field: 'id', required: true, type: 'string' },
 *   { field: 'title', required: true, type: 'string', minLength: 1 }
 * ]);
 *
 * // Use in multiple places
 * const result1 = validateTask(data1);
 * const result2 = validateTask(data2);
 * ```
 */
export function createValidator(
	rules: ValidationRule[]
): (data: Record<string, any>) => ValidationResult {
	return (data: Record<string, any>) => validateFields(data, rules);
}

/**
 * Middleware to validate request body
 *
 * @param rules - Validation rules
 * @param options - Options for error response
 * @returns Hono middleware handler
 *
 * @example
 * ```typescript
 * import { validateBody } from '../util';
 *
 * app.post('/tasks',
 *   validateBody([
 *     { field: 'id', required: true },
 *     { field: 'title', required: true, minLength: 1 }
 *   ]),
 *   async (c) => {
 *     // Body is guaranteed to be valid here
 *     const body = await c.req.json();
 *     // ...
 *   }
 * );
 * ```
 */
export function validateBody(
	rules: ValidationRule[],
	options: {
		errorStatus?: number;
		errorMessage?: string;
	} = {}
) {
	const { errorStatus = 400, errorMessage } = options;

	return async (c: unknown, next: unknown) => {
		const body = await c.req.json().catch(() => ({}));
		const validation = validateFields(body, rules);

		if (!validation.valid) {
			return c.json(
				{
					error: errorMessage || 'Validation failed',
					errors: validation.errors,
				},
				errorStatus
			);
		}

		await next();
	};
}

/**
 * Common validation rules
 */

export const CommonRules = {
	/**
	 * ID field (required, non-empty string)
	 */
	id: (): ValidationRule => ({
		field: 'id',
		required: true,
		type: 'string',
		custom: (val) => (val && val.trim() !== '') || 'ID cannot be empty',
	}),

	/**
	 * Title field (required, 1-500 characters)
	 */
	title: (options: { minLength?: number; maxLength?: number } = {}): ValidationRule => ({
		field: 'title',
		required: true,
		type: 'string',
		minLength: options.minLength ?? 1,
		maxLength: options.maxLength ?? 500,
		custom: (val) => (val && val.trim() !== '') || 'Title cannot be empty',
	}),

	/**
	 * Email field
	 */
	email: (required = false): ValidationRule => ({
		field: 'email',
		required,
		type: 'string',
		pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
	}),

	/**
	 * URL field
	 */
	url: (required = false): ValidationRule => ({
		field: 'url',
		required,
		type: 'string',
		pattern:
			/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
	}),

	/**
	 * Enum field (value must be in allowed list)
	 */
	enum: (field: string, allowedValues: unknown[], required = false): ValidationRule => ({
		field,
		required,
		custom: (val) =>
			allowedValues.includes(val) || `${field} must be one of: ${allowedValues.join(', ')}`,
	}),

	/**
	 * Array field with optional element validation
	 */
	array: (
		field: string,
		options: {
			required?: boolean;
			minLength?: number;
			maxLength?: number;
			elementType?: 'string' | 'number' | 'boolean' | 'object';
		} = {}
	): ValidationRule => ({
		field,
		required: options.required,
		type: 'array',
		custom: (val) => {
			if (!Array.isArray(val)) return false;

			if (options.minLength !== undefined && val.length < options.minLength) {
				return `${field} must have at least ${options.minLength} items`;
			}

			if (options.maxLength !== undefined && val.length > options.maxLength) {
				return `${field} must have at most ${options.maxLength} items`;
			}

			if (options.elementType) {
				const invalidItem = val.find((item) => {
					const actualType = Array.isArray(item) ? 'array' : typeof item;
					return actualType !== options.elementType;
				});

				if (invalidItem !== undefined) {
					return `All ${field} items must be of type ${options.elementType}`;
				}
			}

			return true;
		},
	}),

	/**
	 * Number field with optional range validation
	 */
	number: (
		field: string,
		options: {
			required?: boolean;
			min?: number;
			max?: number;
			integer?: boolean;
		} = {}
	): ValidationRule => ({
		field,
		required: options.required,
		type: 'number',
		custom: (val) => {
			if (typeof val !== 'number') return false;

			if (options.integer && !Number.isInteger(val)) {
				return `${field} must be an integer`;
			}

			if (options.min !== undefined && val < options.min) {
				return `${field} must be at least ${options.min}`;
			}

			if (options.max !== undefined && val > options.max) {
				return `${field} must be at most ${options.max}`;
			}

			return true;
		},
	}),

	/**
	 * Boolean field
	 */
	boolean: (field: string, required = false): ValidationRule => ({
		field,
		required,
		type: 'boolean',
	}),
};

/**
 * Helper to quickly validate required fields exist and are non-empty strings
 *
 * @param data - Data object
 * @param fields - Array of required field names
 * @returns Error message or null if valid
 *
 * @example
 * ```typescript
 * const error = requireFields(body, ['id', 'title', 'boardId']);
 * if (error) {
 *   return c.json({ error }, 400);
 * }
 * ```
 */
export function requireFields(data: Record<string, any>, fields: string[]): string | null {
	for (const field of fields) {
		const value = data[field];
		if (
			value === undefined ||
			value === null ||
			(typeof value === 'string' && value.trim() === '')
		) {
			return `Missing required field: ${field}`;
		}
	}
	return null;
}

/**
 * Helper to check if a value is a non-empty string
 *
 * @param value - Value to check
 * @returns True if non-empty string
 */
export function isNonEmptyString(value: unknown): boolean {
	return typeof value === 'string' && value.trim() !== '';
}

/**
 * Helper to sanitize string input (trim, limit length)
 *
 * @param value - String value
 * @param maxLength - Maximum length
 * @returns Sanitized string
 */
export function sanitizeString(value: string, maxLength = 1000): string {
	if (typeof value !== 'string') return '';
	return value.trim().slice(0, maxLength);
}
