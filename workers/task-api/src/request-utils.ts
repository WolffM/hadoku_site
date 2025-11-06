/**
 * Request Utilities for Task API
 *
 * Common utilities for extracting and validating request parameters.
 */
import type { Context } from 'hono';
import { extractField } from '../../util';
import { MASKING, DEFAULT_SESSION_ID, DEFAULT_BOARD_ID } from './constants';

/**
 * Get board ID from request (body or query parameter)
 * 
 * @param c - Hono context
 * @param defaultId - Default board ID if not found
 * @returns Board ID
 */
export async function getBoardIdFromRequest(
	c: Context,
	defaultId: string = DEFAULT_BOARD_ID
): Promise<string> {
	// Try to get from body first
	const body = await c.req.json().catch(() => ({}));
	if (body.boardId) {
		return body.boardId;
	}
	
	// Fall back to query parameter
	return extractField(c, ['query:boardId'], defaultId);
}

/**
 * Get board ID from request synchronously (assumes body already parsed)
 * 
 * @param c - Hono context
 * @param body - Parsed body object
 * @param defaultId - Default board ID if not found
 * @returns Board ID
 */
export function getBoardIdFromContext(
	c: Context,
	body: any = {},
	defaultId: string = DEFAULT_BOARD_ID
): string {
	return body.boardId || extractField(c, ['query:boardId'], defaultId);
}

/**
 * Get task ID from URL parameter
 * 
 * @param c - Hono context
 * @param paramName - Parameter name (default: 'id')
 * @returns Task ID or null if not found
 */
export function getTaskIdFromParam(
	c: Context,
	paramName: string = 'id'
): string | null {
	const id = c.req.param(paramName);
	return id || null;
}

/**
 * Get session ID from request header or auth context
 * 
 * @param c - Hono context
 * @param auth - Auth context
 * @returns Session ID
 */
export function getSessionIdFromRequest(
	c: Context,
	auth: { sessionId?: string }
): string {
	return c.req.header('X-Session-Id') || auth.sessionId || DEFAULT_SESSION_ID;
}

/**
 * Validate task ID
 * 
 * @param id - Task ID to validate
 * @returns Error message or null if valid
 */
export function validateTaskId(id: string | null): string | null {
	if (!id || id.trim() === '') {
		return 'Missing required parameter: task ID';
	}
	return null;
}

/**
 * Validate board ID
 * 
 * @param id - Board ID to validate
 * @returns Error message or null if valid
 */
export function validateBoardId(id: string | null): string | null {
	if (!id || id.trim() === '') {
		return 'Missing required parameter: board ID';
	}
	return null;
}

/**
 * Mask a key for logging (show first N characters)
 *
 * @param key - Key to mask
 * @param length - Number of characters to show (default from MASKING.KEY_PREFIX_LENGTH)
 * @returns Masked key (e.g., "12345678...")
 */
export function maskKey(key: string, length: number = MASKING.KEY_PREFIX_LENGTH): string {
	if (!key || key.length <= length) {
		return key;
	}
	return key.substring(0, length) + MASKING.KEY_SUFFIX;
}

/**
 * Mask a session ID for logging (show first N characters)
 *
 * @param id - Session ID to mask
 * @returns Masked session ID
 */
export function maskSessionId(id: string): string {
	return maskKey(id, MASKING.SESSION_ID_PREFIX_LENGTH);
}

/**
 * Parse request body safely
 * 
 * @param c - Hono context
 * @returns Parsed body or empty object
 */
export async function parseBodySafely(c: Context): Promise<any> {
	try {
		return await c.req.json();
	} catch {
		return {};
	}
}

/**
 * Create a task operation handler (for PATCH/DELETE/POST complete)
 * Handles common pattern: validate ID, parse body, get boardId, log, execute
 */
export function createTaskOperationHandler<T>(
	method: string,
	path: string,
	operation: (storage: any, auth: any, taskId: string, boardId: string, body?: any) => Promise<T>,
	handleBoardOperation: any,
	logRequest: any,
	logError: any,
	badRequest: any,
	getContext: any
) {
	return async (c: Context) => {
		const id = getTaskIdFromParam(c);
		const validationError = validateTaskId(id);
		if (validationError) {
			logError(method, path, validationError);
			return badRequest(c, validationError);
		}
		
		const body = await parseBodySafely(c);
		const boardId = getBoardIdFromContext(c, body, DEFAULT_BOARD_ID);
		
		logRequest(method, path.replace(':id', id!), { 
			userType: c.get('authContext').userType, 
			boardId, 
			taskId: id 
		});
		
		return handleBoardOperation(c, boardId, (storage: any, auth: any) => 
			operation(storage, auth, id!, boardId, body)
		);
	};
}
