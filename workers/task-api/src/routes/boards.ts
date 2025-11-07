/**
 * Board Routes
 *
 * Handles board CRUD operations
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import { TaskHandlers } from '@wolffm/task/api';
import { badRequest, logRequest, logError, requireFields } from '../../../util';
import { getContext, handleOperation } from './route-utils';
import { validateBoardId } from '../request-utils';

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
			userType: auth.userType
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
			boardId: body.id
		});

		return handleOperation(c, (storage, auth) =>
			TaskHandlers.createBoard(storage, auth, body)
		);
	});

	/**
	 * Delete a Board
	 *
	 * DELETE /boards/:boardId
	 *
	 * Deletes a board and all associated tasks and stats
	 */
	app.delete('/boards/:boardId', async (c: Context) => {
		const boardId = c.req.param('boardId');
		const validationError = validateBoardId(boardId);
		if (validationError) {
			logError('DELETE', '/task/api/boards/:boardId', validationError);
			return badRequest(c, validationError);
		}

		logRequest('DELETE', `/task/api/boards/${boardId}`, {
			userType: c.get('authContext').userType,
			boardId
		});

		return handleOperation(c, (storage, auth) =>
			TaskHandlers.deleteBoard(storage, auth, boardId!)
		);
	});

	return app;
}
