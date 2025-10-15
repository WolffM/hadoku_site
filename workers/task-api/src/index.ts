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
import type { TaskStorage, AuthContext as TaskAuthContext, UserType, TasksFile, StatsFile, BoardsFile } from '@wolffm/task/api';
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
			const data = await env.TASKS_KV.get(key, 'json') as BoardsFile | null;
			if (data) return data;
			// Default with a single 'main' board
			return {
				version: 1,
				boards: [ { id: 'main', name: 'main', tags: [], tasks: [] } ],
				updatedAt: new Date().toISOString(),
			};
		},
		async saveBoards(userType: UserType, boards: BoardsFile, userId?: string) {
			const key = boardKey(userType, userId);
			await env.TASKS_KV.put(key, JSON.stringify(boards));
		},

		// --- Tasks (board scoped) ---
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

// 6. Task API Routes - Thin adapters to TaskHandlers
// ---- v2 Endpoints ----

// Get all boards (and optionally tasks per board depending on handler design)
app.get('/task/api/boards', async (c) => {
	const { storage, auth } = getContext(c);
	const userId = getStableUserId(c);
	
	logRequest('GET', '/task/api/boards', { userType: auth.userType, userId });
	
	try {
		const result = await TaskHandlers.getBoards(storage, { ...auth, userId });
		logRequest('GET', '/task/api/boards', { success: true, boardCount: result.boards?.length || 0 });
		return c.json(result);
	} catch (error: any) {
		logError('GET', '/task/api/boards', error.message);
		throw error;
	}
});

// Create a new board
app.post('/task/api/boards', async (c) => {
	const { storage, auth } = getContext(c);
	const body = await c.req.json();
	const userId = getStableUserId(c);
	
	// Validate required fields
	const error = requireFields(body, ['id', 'name']);
	if (error) {
		logError('POST', '/task/api/boards', error);
		return badRequest(c, error);
	}
	
	logRequest('POST', '/task/api/boards', { userType: auth.userType, userId, boardId: body.id });
	
	const result = await TaskHandlers.createBoard(storage, { ...auth, userId }, body);
	return c.json(result);
});

// Delete a board
app.delete('/task/api/boards/:boardId', async (c) => {
	const { storage, auth } = getContext(c);
	const boardId = c.req.param('boardId');
	const userId = getStableUserId(c);
	
	// Validate boardId is provided
	if (!boardId || boardId.trim() === '') {
		logError('DELETE', '/task/api/boards/:boardId', 'Missing board ID in URL');
		return badRequest(c, 'Missing required parameter: board ID');
	}
	
	logRequest('DELETE', `/task/api/boards/${boardId}`, { userType: auth.userType, userId, boardId });
	
	const result = await TaskHandlers.deleteBoard(storage, { ...auth, userId }, boardId);
	return c.json(result);
});

// Get tasks for a board
app.get('/task/api/tasks', async (c) => {
	const { storage, auth } = getContext(c);
	const userId = getStableUserId(c);
	const boardId = extractField(c, ['query:boardId'], 'main');
	
	logRequest('GET', '/task/api/tasks', { userType: auth.userType, userId, boardId });
	
	const result = await TaskHandlers.getBoardTasks(storage, { ...auth, userId }, boardId);
	return c.json(result);
});

// Create task (boardId required)
app.post('/task/api', async (c) => {
	const { storage, auth } = getContext(c);
	const body = await c.req.json();
	const { boardId = 'main', ...input } = body;
	const userId = getStableUserId(c);
	
	// Validate required fields
	const error = requireFields(input, ['id', 'title']);
	if (error) {
		logError('POST', '/task/api', error);
		return badRequest(c, error);
	}
	
	logRequest('POST', '/task/api', { userType: auth.userType, userId, boardId, taskId: input.id });
	
	const result = await TaskHandlers.createTask(storage, { ...auth, userId }, input, boardId);
	return c.json(result);
});

// Update task
app.patch('/task/api/:id', async (c) => {
	const { storage, auth } = getContext(c);
	const id = c.req.param('id');
	const body = await c.req.json();
	const { boardId = 'main', ...input } = body;
	const userId = getStableUserId(c);
	
	// Validate task ID is provided
	if (!id || id.trim() === '') {
		logError('PATCH', '/task/api/:id', 'Missing task ID in URL');
		return badRequest(c, 'Missing required parameter: task ID');
	}
	
	logRequest('PATCH', `/task/api/${id}`, { userType: auth.userType, userId, boardId, taskId: id });
	
	const result = await TaskHandlers.updateTask(storage, { ...auth, userId }, id, input, boardId);
	return c.json(result);
});

// Complete task
app.post('/task/api/:id/complete', async (c) => {
	const { storage, auth } = getContext(c);
	const id = c.req.param('id');
	const body = await c.req.json().catch(() => ({}));
	const boardId = extractField(c, ['body:boardId', 'query:boardId'], 'main');
	const userId = getStableUserId(c);
	
	// Validate task ID is provided
	if (!id || id.trim() === '') {
		logError('POST', '/task/api/:id/complete', 'Missing task ID in URL');
		return badRequest(c, 'Missing required parameter: task ID');
	}
	
	logRequest('POST', '/task/api/:id/complete', { userType: auth.userType, userId, boardId, taskId: id });
	
	const result = await TaskHandlers.completeTask(storage, { ...auth, userId }, id, boardId);
	return c.json(result);
});

// Delete task
app.delete('/task/api/:id', async (c) => {
	const { storage, auth } = getContext(c);
	const id = c.req.param('id');
	const body = await c.req.json().catch(() => ({}));
	const boardId = body.boardId || extractField(c, ['query:boardId'], 'main');
	const userId = getStableUserId(c);
	
	// Validate task ID is provided
	if (!id || id.trim() === '') {
		logError('DELETE', '/task/api/:id', 'Missing task ID in URL');
		return badRequest(c, 'Missing required parameter: task ID');
	}
	
	logRequest('DELETE', `/task/api/${id}`, { userType: auth.userType, userId, boardId, taskId: id });
	
	const result = await TaskHandlers.deleteTask(storage, { ...auth, userId }, id, boardId);
	return c.json(result);
});

// Get stats for a board
app.get('/task/api/stats', async (c) => {
	const { storage, auth } = getContext(c);
	const userId = getStableUserId(c);
	const boardId = extractField(c, ['query:boardId'], 'main');
	
	logRequest('GET', '/task/api/stats', { userType: auth.userType, userId, boardId });
	
	const result = await TaskHandlers.getBoardStats(storage, { ...auth, userId }, boardId);
	return c.json(result);
});

// Create tag on board
app.post('/task/api/tags', async (c) => {
	const { storage, auth } = getContext(c);
	const body = await c.req.json();
	const userId = getStableUserId(c);
	
	// Validate required fields
	const error = requireFields(body, ['boardId', 'tag']);
	if (error) {
		logError('POST', '/task/api/tags', error);
		return badRequest(c, error);
	}
	
	logRequest('POST', '/task/api/tags', { userType: auth.userType, userId, boardId: body.boardId, tag: body.tag });
	
	const result = await TaskHandlers.createTag(storage, { ...auth, userId }, body);
	return c.json(result);
});

// Delete tag from board
app.delete('/task/api/tags', async (c) => {
	const { storage, auth } = getContext(c);
	const body = await c.req.json();
	const userId = getStableUserId(c);
	
	// Validate required fields
	const error = requireFields(body, ['boardId', 'tag']);
	if (error) {
		logError('DELETE', '/task/api/tags', error);
		return badRequest(c, error);
	}
	
	logRequest('DELETE', '/task/api/tags', { userType: auth.userType, userId, boardId: body.boardId, tag: body.tag });
	
	const result = await TaskHandlers.deleteTag(storage, { ...auth, userId }, body);
	return c.json(result);
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
	const { storage, auth } = getContext(c);
	const userId = getStableUserId(c);
	
	logRequest('GET', '/task/api', { userType: auth.userType, userId, boardId: 'main' });
	
	const result = await TaskHandlers.getBoardTasks(storage, { ...auth, userId }, 'main');
	return c.json(result);
});

export default app;
