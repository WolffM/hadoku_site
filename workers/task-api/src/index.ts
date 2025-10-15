/**
 * Task API Worker - Universal Adapter
 *
 * This worker acts as a thin adapter layer. It imports the framework-agnostic
 * API logic from the `@wolffm/task` package and adapts it to the Hono/Cloudflare
 * Worker environment.
 *
 * The core business logic resides in the child package, not here.
 */
import { Hono, type Context } from 'hono';
import { TaskHandlers } from '@wolffm/task/api';
import type { TaskStorage, AuthContext as TaskAuthContext, UserType, TasksFile, StatsFile } from '@wolffm/task/api';
import {
	createKeyAuth,
	createHadokuCors,
	extractUserContext,
	extractField,
	requireFields,
	ok,
	created,
	badRequest,
	healthCheck,
	logRequest,
	logError
} from '../../util';

interface Env {
	ADMIN_KEY: string;
	FRIEND_KEY: string;
	TASKS_KV: KVNamespace;
}

// Define a custom context type for Hono
type AppContext = {
	Bindings: Env;
	Variables: {
		authContext: TaskAuthContext;
	};
};

const app = new Hono<AppContext>();

// Simple in-memory lock to prevent concurrent writes to the same board
// This prevents race conditions when multiple PATCH requests hit simultaneously
const boardLocks = new Map<string, Promise<any>>();

async function withBoardLock<T>(
	boardKey: string,
	operation: () => Promise<T>
): Promise<T> {
	// Wait for any existing operation on this board to complete
	const existingLock = boardLocks.get(boardKey);
	if (existingLock) {
		await existingLock.catch(() => {}); // Ignore errors from previous operations
	}
	
	// Create a new lock for this operation
	const newLock = operation();
	boardLocks.set(boardKey, newLock);
	
	try {
		const result = await newLock;
		return result;
	} finally {
		// Clean up the lock if it's still ours
		if (boardLocks.get(boardKey) === newLock) {
			boardLocks.delete(boardKey);
		}
	}
}

// 1. CORS Middleware
app.use('*', createHadokuCors(['https://task-api.hadoku.me']));

// 2. Authentication Middleware
app.use('*', createKeyAuth<Env>(
	(env) => ({
		[env.ADMIN_KEY]: 'admin',
		[env.FRIEND_KEY]: 'friend'
	}),
	{
		sources: ['header:X-User-Key', 'query:key'],
		defaultUserType: 'public',
		includeHelpers: true
	}
));

// 3. Workers KV Storage Implementation
// This is the parent's responsibility - adapt storage to the environment.
function createKVStorage(env: Env): TaskStorage {
	// Helper to normalize userId (public users may not provide one)
	const uid = (userId?: string) => userId || 'public';
	const boardKey = (userType: string, userId: string | undefined) => `boards:${userType}:${uid(userId)}`;
	const tasksKey = (userType: string, userId: string | undefined, boardId: string) => `tasks:${userType}:${uid(userId)}:${boardId}`;
	const statsKey = (userType: string, userId: string | undefined, boardId: string) => `stats:${userType}:${uid(userId)}:${boardId}`;

	return {
	// --- Boards ---
	async getBoards(userType: UserType, userId?: string) {
		const key = boardKey(userType, userId);
		const data = await env.TASKS_KV.get(key, 'json') as any | null;
		if (data) return data;
		// Default with a single 'main' board
		return {
			version: 1,
			boards: [ { id: 'main', name: 'main', tags: [], tasks: [] } ],
			updatedAt: new Date().toISOString(),
		};
	},
	async saveBoards(userType: UserType, boards: any, userId?: string) {
		const key = boardKey(userType, userId);
		await env.TASKS_KV.put(key, JSON.stringify(boards));
	},		// --- Tasks (board scoped) ---
		async getTasks(userType: UserType, userId: string | undefined, boardId: string) {
			const key = tasksKey(userType, userId, boardId);
			const data = await env.TASKS_KV.get(key, 'json') as TasksFile | null;
			if (data) return data;
			return {
				version: 1,
				tasks: [],
				updatedAt: new Date().toISOString(),
			};
		},
		async saveTasks(userType: UserType, userId: string | undefined, boardId: string, tasks: TasksFile) {
			const key = tasksKey(userType, userId, boardId);
			await env.TASKS_KV.put(key, JSON.stringify(tasks));
		},

		// --- Stats (board scoped) ---
		async getStats(userType: UserType, userId: string | undefined, boardId: string) {
			const key = statsKey(userType, userId, boardId);
			const data = await env.TASKS_KV.get(key, 'json') as StatsFile | null;
			if (data) return data;
			return {
				version: 2,
				counters: { created: 0, completed: 0, edited: 0, deleted: 0 },
				timeline: [],
				tasks: {},
				updatedAt: new Date().toISOString(),
			};
		},
		async saveStats(userType: UserType, userId: string | undefined, boardId: string, stats: StatsFile) {
			const key = statsKey(userType, userId, boardId);
			await env.TASKS_KV.put(key, JSON.stringify(stats));
		},
	};
}

// 4. Health Check
app.get('/task/api/health', (c) => healthCheck(c, 'task-api-adapter', { kv: true }));

// 5. Helper to get storage and auth from context
const getContext = (c: Context<AppContext>) => ({
	storage: createKVStorage(c.env),
	auth: c.get('authContext'),
});

// Helper to get stable userId - uses userType as default to ensure data sharing across sessions
const getStableUserId = (c: Context<AppContext>): string => {
	const { userId } = extractUserContext(c);
	const auth = c.get('authContext');
	
	// If userId is explicitly provided and looks stable (not a UUID from frontend), use it
	// Otherwise default to userType for data sharing across sessions with same key
	if (userId && userId !== 'undefined' && userId !== 'null' && !userId.includes('-')) {
		return userId;
	}
	
	// Default: use userType as userId for consistency across sessions
	return auth.userType;
};

// Generic handler wrapper for operations without locking
async function handleOperation<T>(
	c: Context<AppContext>,
	operation: (storage: TaskStorage, auth: TaskAuthContext) => Promise<T>
): Promise<Response> {
	const { storage, auth } = getContext(c);
	const userId = getStableUserId(c);
	
	const result = await operation(storage, { ...auth, userId });
	return c.json(result);
}

// Generic handler wrapper for single-board operations
async function handleBoardOperation<T>(
	c: Context<AppContext>,
	boardId: string,
	operation: (storage: TaskStorage, auth: TaskAuthContext) => Promise<T>
): Promise<Response> {
	const { storage, auth } = getContext(c);
	const userId = getStableUserId(c);
	const boardKey = `${auth.userType}:${userId}:${boardId}`;
	
	const result = await withBoardLock(boardKey, async () => {
		return await operation(storage, { ...auth, userId });
	});
	
	return c.json(result);
}

// Generic handler wrapper for batch operations
async function handleBatchOperation<T>(
	c: Context<AppContext>,
	requiredFields: string[],
	operation: (storage: TaskStorage, auth: TaskAuthContext, body: any) => Promise<T>,
	getBoardKeys?: (body: any, userType: string, userId: string) => string[]
): Promise<Response> {
	const { storage, auth } = getContext(c);
	const body = await c.req.json();
	const userId = getStableUserId(c);
	
	// Validate required fields
	const error = requireFields(body, requiredFields);
	if (error) {
		return badRequest(c, error);
	}
	
	// If no board keys provided, no locking needed
	if (!getBoardKeys) {
		const result = await operation(storage, { ...auth, userId }, body);
		return c.json(result);
	}
	
	// Get board keys and apply locks
	const boardKeys = getBoardKeys(body, auth.userType, userId);
	
	// Single board lock
	if (boardKeys.length === 1) {
		const result = await withBoardLock(boardKeys[0], async () => {
			return await operation(storage, { ...auth, userId }, body);
		});
		return c.json(result);
	}
	
	// Multiple board locks (in consistent order to prevent deadlocks)
	const sortedKeys = [...boardKeys].sort();
	const result = await withBoardLock(sortedKeys[0], async () => {
		return await withBoardLock(sortedKeys[1], async () => {
			return await operation(storage, { ...auth, userId }, body);
		});
	});
	return c.json(result);
}

// 6. Task API Routes - Thin adapters to TaskHandlers
// ---- v2 Endpoints ----

// Get all boards (and optionally tasks per board depending on handler design)
app.get('/task/api/boards', async (c) => {
	logRequest('GET', '/task/api/boards', { userType: c.get('authContext').userType });
	return handleOperation(c, (storage, auth) => TaskHandlers.getBoards(storage, auth));
});

// Create a new board
app.post('/task/api/boards', async (c) => {
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

// Delete a board
app.delete('/task/api/boards/:boardId', async (c) => {
	const boardId = c.req.param('boardId');
	
	// Validate boardId is provided
	if (!boardId || boardId.trim() === '') {
		logError('DELETE', '/task/api/boards/:boardId', 'Missing board ID in URL');
		return badRequest(c, 'Missing required parameter: board ID');
	}
	
	logRequest('DELETE', `/task/api/boards/${boardId}`, { 
		userType: c.get('authContext').userType, 
		boardId 
	});
	
	return handleOperation(c, (storage, auth) => 
		TaskHandlers.deleteBoard(storage, auth, boardId)
	);
});

// Get tasks for a board
app.get('/task/api/tasks', async (c) => {
	const boardId = extractField(c, ['query:boardId'], 'main');
	
	logRequest('GET', '/task/api/tasks', { 
		userType: c.get('authContext').userType, 
		boardId 
	});
	
	return handleOperation(c, (storage, auth) => 
		TaskHandlers.getBoardTasks(storage, auth, boardId)
	);
});

// Create task (boardId required)
app.post('/task/api', async (c) => {
	const body = await c.req.json();
	const { boardId = 'main', ...input } = body;
	
	// Validate required fields
	const error = requireFields(input, ['id', 'title']);
	if (error) {
		logError('POST', '/task/api', error);
		return badRequest(c, error);
	}
	
	// Debug: log the raw body to see what we received
	console.log('[DEBUG createTask] body:', body, 'boardId:', boardId);
	
	logRequest('POST', '/task/api', { 
		userType: c.get('authContext').userType, 
		boardId, 
		taskId: input.id 
	});
	
	return handleBoardOperation(c, boardId, (storage, auth) => 
		TaskHandlers.createTask(storage, auth, input, boardId)
	);
});

// Batch update tags - MUST be before /:id route to avoid matching "batch-tag" as an id
const batchUpdateTagsHandler = async (c: any) => {
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
		boardId 
	});
	
	// Validate required fields
	const error = requireFields(body, ['updates']);
	if (error) {
		return badRequest(c, error);
	}
	
	// Handle with board lock
	const { storage, auth } = getContext(c);
	const userId = getStableUserId(c);
	const boardKey = `${auth.userType}:${userId}:${boardId}`;
	
	const result = await withBoardLock(boardKey, async () => {
		return await TaskHandlers.batchUpdateTags(storage, { ...auth, userId }, { ...body, boardId });
	});
	
	return c.json(result);
};

app.post('/task/api/boards/:boardId/tasks/batch/update-tags', batchUpdateTagsHandler);
app.patch('/task/api/batch-tag', batchUpdateTagsHandler); // Legacy alias

// Update task
app.patch('/task/api/:id', async (c) => {
	const id = c.req.param('id');
	const body = await c.req.json();
	const { boardId = 'main', ...input } = body;
	
	// Validate task ID is provided
	if (!id || id.trim() === '') {
		logError('PATCH', '/task/api/:id', 'Missing task ID in URL');
		return badRequest(c, 'Missing required parameter: task ID');
	}
	
	logRequest('PATCH', `/task/api/${id}`, { 
		userType: c.get('authContext').userType, 
		boardId, 
		taskId: id
	});
	
	return handleBoardOperation(c, boardId, (storage, auth) => 
		TaskHandlers.updateTask(storage, auth, id, input, boardId)
	);
});

// Complete task
app.post('/task/api/:id/complete', async (c) => {
	const id = c.req.param('id');
	// Read body to get boardId
	const body = await c.req.json().catch(() => ({}));
	const boardId = (body as any).boardId || extractField(c, ['query:boardId'], 'main');
	
	// Validate task ID is provided
	if (!id || id.trim() === '') {
		logError('POST', '/task/api/:id/complete', 'Missing task ID in URL');
		return badRequest(c, 'Missing required parameter: task ID');
	}
	
	logRequest('POST', '/task/api/:id/complete', { 
		userType: c.get('authContext').userType, 
		boardId, 
		taskId: id 
	});
	
	return handleBoardOperation(c, boardId, (storage, auth) => 
		TaskHandlers.completeTask(storage, auth, id, boardId)
	);
});

// Delete task
app.delete('/task/api/:id', async (c) => {
	const id = c.req.param('id');
	const body = await c.req.json().catch(() => ({}));
	const boardId = body.boardId || extractField(c, ['query:boardId'], 'main');
	
	// Validate task ID is provided
	if (!id || id.trim() === '') {
		logError('DELETE', '/task/api/:id', 'Missing task ID in URL');
		return badRequest(c, 'Missing required parameter: task ID');
	}
	
	logRequest('DELETE', `/task/api/${id}`, { 
		userType: c.get('authContext').userType, 
		boardId, 
		taskId: id 
	});
	
	return handleBoardOperation(c, boardId, (storage, auth) => 
		TaskHandlers.deleteTask(storage, auth, id, boardId)
	);
});

// Get stats for a board
app.get('/task/api/stats', async (c) => {
	const boardId = extractField(c, ['query:boardId'], 'main');
	
	logRequest('GET', '/task/api/stats', { 
		userType: c.get('authContext').userType, 
		boardId 
	});
	
	return handleOperation(c, (storage, auth) => 
		TaskHandlers.getBoardStats(storage, auth, boardId)
	);
});

// Create tag on board
app.post('/task/api/tags', async (c) => {
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
		tag: body.tag 
	});
	
	return handleOperation(c, (storage, auth) => 
		TaskHandlers.createTag(storage, auth, body)
	);
});

// Delete tag from board
app.delete('/task/api/tags', async (c) => {
	const body = await c.req.json();
	
	// Validate required fields
	const error = requireFields(body, ['boardId', 'tag']);
	if (error) {
		logError('DELETE', '/task/api/tags', error);
		return badRequest(c, error);
	}
	
	logRequest('DELETE', '/task/api/tags', { 
		userType: c.get('authContext').userType, 
		boardId: body.boardId, 
		tag: body.tag 
	});
	
	return handleOperation(c, (storage, auth) => 
		TaskHandlers.deleteTag(storage, auth, body)
	);
});

// ---- Batch Operations ----

// Batch move tasks between boards (with legacy alias)
const batchMoveHandler = async (c: any) => {
	logRequest('POST', '/task/api/batch-move', { 
		userType: c.get('authContext').userType 
	});
	
	return handleBatchOperation(
		c,
		['sourceBoardId', 'targetBoardId', 'taskIds'],
		(storage, auth, body) => TaskHandlers.batchMoveTasks(storage, auth, body),
		(body, userType, userId) => [
			`${userType}:${userId}:${body.sourceBoardId}`,
			`${userType}:${userId}:${body.targetBoardId}`
		]
	);
};

app.post('/task/api/batch/move-tasks', batchMoveHandler);
app.post('/task/api/batch-move', batchMoveHandler); // Legacy alias for client compatibility

// Batch clear tag from multiple tasks
app.post('/task/api/boards/:boardId/tasks/batch/clear-tag', async (c) => {
	logRequest('POST', '/task/api/boards/:boardId/tasks/batch/clear-tag', { 
		userType: c.get('authContext').userType 
	});
	
	return handleBatchOperation(
		c,
		['boardId', 'tag', 'taskIds'],
		(storage, auth, body) => TaskHandlers.batchClearTag(storage, auth, body),
		(body, userType, userId) => [`${userType}:${userId}:${body.boardId}`]
	);
});

// Get user preferences
app.get('/task/api/preferences', async (c) => {
	const userId = getStableUserId(c);
	const { auth } = getContext(c);
	const userType = auth.userType;
	
	// Use a consistent key format for preferences
	const prefsKey = `prefs:${userType}:${userId || 'public'}`;
	
	try {
		const prefs = await c.env.TASKS_KV.get(prefsKey, 'json');
		if (prefs) {
			return ok(c, prefs);
		}
		// Return default preferences
		return ok(c, { theme: 'light' });
	} catch (error: any) {
		logError('GET', '/task/api/preferences', error);
		return ok(c, { theme: 'light' });
	}
});

// Save user preferences
app.put('/task/api/preferences', async (c) => {
	const userId = getStableUserId(c);
	const { auth } = getContext(c);
	const userType = auth.userType;
	const body = await c.req.json();
	
	// Use a consistent key format for preferences
	const prefsKey = `prefs:${userType}:${userId || 'public'}`;
	
	logRequest('PUT', '/task/api/preferences', { userType, userId, prefs: body });
	
	try {
		await c.env.TASKS_KV.put(prefsKey, JSON.stringify(body));
		return ok(c, { message: 'Preferences saved' });
	} catch (error: any) {
		logError('PUT', '/task/api/preferences', error);
		return badRequest(c, 'Failed to save preferences');
	}
});

// Backwards compatibility: old v1 list endpoint (maps to main board)
app.get('/task/api', async (c) => {
	logRequest('GET', '/task/api', { 
		userType: c.get('authContext').userType, 
		boardId: 'main' 
	});
	
	return handleOperation(c, (storage, auth) => 
		TaskHandlers.getBoardTasks(storage, auth, 'main')
	);
});

export default app;
