/**
 * Task Routes
 *
 * Handles task CRUD operations and task-related endpoints
 */
import { Hono, type Context } from 'hono';
import { TaskHandlers } from '@wolffm/task/api';
import { badRequest, logRequest, logError, requireFields, extractField } from '../../../util';
import { getContext, handleOperation, handleBoardOperation } from './route-utils';
import { createTaskOperationHandler } from '../request-utils';
import { DEFAULT_BOARD_ID } from '../constants';

interface Env {
	TASKS_KV: KVNamespace;
}

export function createTaskRoutes() {
	const app = new Hono<{ Bindings: Env }>();

	/**
	 * Get Tasks for a Board
	 *
	 * GET /tasks?boardId=xyz
	 *
	 * Returns all tasks for the specified board (defaults to 'main')
	 */
	app.get('/tasks', async (c: Context) => {
		const boardId = extractField(c, ['query:boardId'], 'main');

		logRequest('GET', '/task/api/tasks', {
			userType: c.get('authContext').userType,
			boardId,
		});

		return handleOperation(c, (storage, auth) =>
			TaskHandlers.getBoardTasks(storage, auth, boardId)
		);
	});

	/**
	 * Create Task
	 *
	 * POST /
	 *
	 * Creates a new task on the specified board
	 * Requires: id, title in request body
	 * Optional: boardId (defaults to 'main')
	 */
	app.post('/', async (c: Context) => {
		const body = await c.req.json();
		const { boardId = DEFAULT_BOARD_ID, ...input } = body;

		// Validate required fields
		const error = requireFields(input, ['id', 'title']);
		if (error) {
			logError('POST', '/task/api', error);
			return badRequest(c, error);
		}

		logRequest('POST', '/task/api', {
			userType: c.get('authContext').userType,
			boardId,
			taskId: input.id,
		});

		return handleBoardOperation(c, boardId, (storage, auth) =>
			TaskHandlers.createTask(storage, auth, input, boardId)
		);
	});

	/**
	 * Update Task
	 *
	 * PATCH /:id
	 *
	 * Updates an existing task
	 */
	app.patch(
		'/:id',
		createTaskOperationHandler(
			'PATCH',
			'/task/api/:id',
			(storage, auth, id, boardId, body) => {
				const { boardId: _, ...input } = body;
				return TaskHandlers.updateTask(storage, auth, id, input, boardId);
			},
			handleBoardOperation,
			logRequest,
			logError,
			badRequest,
			getContext
		)
	);

	/**
	 * Complete Task
	 *
	 * POST /:id/complete
	 *
	 * Marks a task as completed
	 */
	app.post(
		'/:id/complete',
		createTaskOperationHandler(
			'POST',
			'/task/api/:id/complete',
			(storage, auth, id, boardId) => TaskHandlers.completeTask(storage, auth, id, boardId),
			handleBoardOperation,
			logRequest,
			logError,
			badRequest,
			getContext
		)
	);

	/**
	 * Delete Task
	 *
	 * DELETE /:id
	 *
	 * Deletes a task
	 */
	app.delete(
		'/:id',
		createTaskOperationHandler(
			'DELETE',
			'/task/api/:id',
			(storage, auth, id, boardId) => TaskHandlers.deleteTask(storage, auth, id, boardId),
			handleBoardOperation,
			logRequest,
			logError,
			badRequest,
			getContext
		)
	);

	/**
	 * Get Board Stats
	 *
	 * GET /stats?boardId=xyz
	 *
	 * Returns statistics for the specified board
	 */
	app.get('/stats', async (c: Context) => {
		const boardId = extractField(c, ['query:boardId'], 'main');

		logRequest('GET', '/task/api/stats', {
			userType: c.get('authContext').userType,
			boardId,
		});

		return handleOperation(c, (storage, auth) =>
			TaskHandlers.getBoardStats(storage, auth, boardId)
		);
	});

	return app;
}
