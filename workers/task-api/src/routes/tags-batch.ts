/**
 * Tags and Batch Operations Routes
 *
 * Handles tag management and batch operations on tasks
 */
import { Hono, type Context } from 'hono';
import { TaskHandlers } from '@wolffm/task/api';
import { badRequest, logRequest, logError, requireFields } from '../../../util';
import { getContext, handleOperation, handleBatchOperation, withBoardLock } from './route-utils';

interface Env {
	TASKS_KV: KVNamespace;
}

export function createTagsBatchRoutes() {
	const app = new Hono<{ Bindings: Env }>();

	// ============================================================================
	// Tag Management
	// ============================================================================

	/**
	 * Create Tag
	 *
	 * POST /tags
	 *
	 * Adds a new tag to a board
	 * Requires: boardId, tag
	 */
	app.post('/tags', async (c: Context) => {
		const body = await c.req.json();

		// Validate required fields
		const error = requireFields(body, ['boardId', 'tag']);
		if (error) {
			logError('POST', '/task/api/tags', error);
			return badRequest(c, error);
		}

		logRequest('POST', '/task/api/tags', {
			userType: c.get('authContext').userType,
			boardId: body.boardId,
			tag: body.tag,
		});

		return handleOperation(c, (storage, auth) => TaskHandlers.createTag(storage, auth, body));
	});

	/**
	 * Delete Tag
	 *
	 * POST /tags/delete
	 *
	 * Removes a tag from a board (POST to avoid DELETE body issues with proxies)
	 * Requires: boardId, tag
	 */
	app.post('/tags/delete', async (c: Context) => {
		const body = await c.req.json();

		// Validate required fields
		const error = requireFields(body, ['boardId', 'tag']);
		if (error) {
			logError('POST', '/task/api/tags/delete', error);
			return badRequest(c, error);
		}

		logRequest('POST', '/task/api/tags/delete', {
			userType: c.get('authContext').userType,
			boardId: body.boardId,
			tag: body.tag,
		});

		return handleOperation(c, (storage, auth) => TaskHandlers.deleteTag(storage, auth, body));
	});

	// ============================================================================
	// Batch Operations
	// ============================================================================

	/**
	 * Batch Update Tags
	 *
	 * POST /boards/:boardId/tasks/batch/update-tags
	 * PATCH /batch-tag (legacy alias)
	 *
	 * Updates tags on multiple tasks in a single operation
	 */
	const batchUpdateTagsHandler = async (c: Context) => {
		// First read the body to get boardId if not in URL
		const body = await c.req.json();
		const boardIdFromParam = c.req.param('boardId');
		const boardId = boardIdFromParam || body.boardId || 'main';

		const method = boardIdFromParam ? 'POST' : 'PATCH';
		const route = boardIdFromParam
			? '/task/api/boards/:boardId/tasks/batch/update-tags'
			: '/task/api/batch-tag';

		logRequest(method, route, {
			userType: c.get('authContext').userType,
			boardId,
		});

		// Validate required fields
		const error = requireFields(body, ['updates']);
		if (error) {
			return badRequest(c, error);
		}

		// Handle with board lock
		const { storage, auth } = getContext(c);
		const boardsKey = `${auth.userType}:${auth.sessionId}:${boardId}`;

		const result = await withBoardLock(boardsKey, async () => {
			return TaskHandlers.batchUpdateTags(storage, auth, { ...body, boardId });
		});

		return c.json(result);
	};

	app.post('/boards/:boardId/tasks/batch/update-tags', batchUpdateTagsHandler);
	app.patch('/batch-tag', batchUpdateTagsHandler); // Legacy alias

	/**
	 * Batch Move Tasks
	 *
	 * POST /batch/move-tasks
	 * POST /batch-move (legacy alias)
	 *
	 * Moves multiple tasks from one board to another
	 * Requires: sourceBoardId, targetBoardId, taskIds
	 */
	const batchMoveHandler = async (c: Context) => {
		logRequest('POST', '/task/api/batch-move', {
			userType: c.get('authContext').userType,
		});

		return handleBatchOperation(
			c,
			['sourceBoardId', 'targetBoardId', 'taskIds'],
			(storage, auth, body) => TaskHandlers.batchMoveTasks(storage, auth, body),
			(body, userType, sessionId) => [
				`${userType}:${sessionId}:${body.sourceBoardId}`,
				`${userType}:${sessionId}:${body.targetBoardId}`,
			]
		);
	};

	app.post('/batch/move-tasks', batchMoveHandler);
	app.post('/batch-move', batchMoveHandler); // Legacy alias for client compatibility

	/**
	 * Batch Clear Tag
	 *
	 * POST /batch-clear-tag
	 *
	 * Removes a specific tag from multiple tasks
	 * Requires: boardId, tag, taskIds
	 */
	app.post('/batch-clear-tag', async (c: Context) => {
		logRequest('POST', '/task/api/batch-clear-tag', {
			userType: c.get('authContext').userType,
		});

		return handleBatchOperation(
			c,
			['boardId', 'tag', 'taskIds'],
			(storage, auth, body) => TaskHandlers.batchClearTag(storage, auth, body),
			(body, userType, sessionId) => [`${userType}:${sessionId}:${body.boardId}`]
		);
	});

	return app;
}
