/**
 * Board Routes
 *
 * Handles board CRUD operations
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import { TaskHandlers } from '@wolffm/task/api';
import { badRequest, logRequest, logError, requireFields } from '../../../util';
import { getContext, withBoardLock } from './route-utils';
import { validateBoardId } from '../request-utils';
import { boardsKey } from '../kv-keys';

type Env = {
	TASKS_KV: KVNamespace;
};

export function createBoardRoutes() {
	const app = new Hono<{ Bindings: Env }>();

	/**
	 * Get All Boards
	 *
	 * GET /boards
	 *
	 * Returns all boards for the current user session
	 * Includes current auth context in response
	 */
	app.get('/boards', async (c: Context) => {
		const authContext = c.get('authContext');
		logRequest('GET', '/task/api/boards', { userType: authContext.userType });

		// Get boards data from handler
		const { storage, auth } = getContext(c);
		const boardsData = await TaskHandlers.getBoards(storage, auth);

		// Add current auth context to response (overriding any stored values)
		// This ensures the response reflects the CURRENT authentication, not stored metadata
		return c.json({
			...boardsData,
			// Always reflect current authentication
			userType: auth.userType,
		});
	});

	/**
	 * Create a New Board
	 *
	 * POST /boards
	 *
	 * Creates a new board with the provided id and name
	 * Requires: id, name in request body
	 */
	app.post('/boards', async (c: Context) => {
		const body = await c.req.json();

		// Validate required fields
		const error = requireFields(body, ['id', 'name']);
		if (error) {
			logError('POST', '/task/api/boards', error);
			return badRequest(c, error);
		}

		logRequest('POST', '/task/api/boards', {
			userType: c.get('authContext').userType,
			boardId: body.id,
		});

		// Lock the boards list to prevent concurrent modifications
		const { storage, auth } = getContext(c);
		const lockKey = boardsKey(auth.sessionId);

		const result = await withBoardLock(lockKey, async () => {
			return TaskHandlers.createBoard(storage, auth, body);
		});

		return c.json(result);
	});

	/**
	 * Delete a Board
	 *
	 * DELETE /boards/:boardId
	 *
	 * Deletes a board and all associated tasks and stats
	 */
	app.delete('/boards/:boardId', async (c: Context) => {
		const boardIdParam = c.req.param('boardId');
		const validationError = validateBoardId(boardIdParam);
		if (validationError) {
			logError('DELETE', '/task/api/boards/:boardId', validationError);
			return badRequest(c, validationError);
		}

		// After validation, we know boardId is valid
		const boardId = boardIdParam as string;

		logRequest('DELETE', `/task/api/boards/${boardId}`, {
			userType: c.get('authContext').userType,
			boardId,
		});

		// Lock the boards list to prevent concurrent modifications
		const { storage, auth } = getContext(c);
		const lockKey = boardsKey(auth.sessionId);

		const result = await withBoardLock(lockKey, async () => {
			return TaskHandlers.deleteBoard(storage, auth, boardId);
		});

		return c.json(result);
	});

	return app;
}
