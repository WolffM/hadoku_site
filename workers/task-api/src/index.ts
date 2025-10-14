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
import { cors } from 'hono/cors';
import { TaskHandlers } from '@wolffm/task/api';
import type { TaskStorage, AuthContext, UserType, TasksFile, StatsFile, BoardsFile } from '@wolffm/task/api';

interface Env {
	ADMIN_KEY: string;
	FRIEND_KEY: string;
	TASKS_KV: KVNamespace;
}

// Define a custom context type for Hono
type AppContext = {
	Bindings: Env;
	Variables: {
		authContext: AuthContext;
	};
};

const app = new Hono<AppContext>();

// 1. CORS Middleware
app.use(
	'*',
	cors({
		origin: [
			'https://hadoku.me',
			'https://task-api.hadoku.me',
			'http://localhost:*',
		],
		credentials: true,
	})
);

// 2. Authentication Middleware
app.use('*', async (c, next) => {
	// Check for key from edge-router injection or direct query param (for testing/legacy)
	const providedKey = 
		c.req.header('X-User-Key') ||      // Injected by edge-router from session
		c.req.query('key');                // Direct query param (bypass edge-router for testing)

	let userType: UserType = 'public';

	if (providedKey === c.env.ADMIN_KEY) {
		userType = 'admin';
	} else if (providedKey === c.env.FRIEND_KEY) {
		userType = 'friend';
	}

	const authContext: AuthContext = {
		userType,
		isPublic: userType === 'public',
		isFriend: userType === 'friend',
		isAdmin: userType === 'admin',
	};

	c.set('authContext', authContext);
	await next();
});

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
			console.log(`[KV] getBoards - key: ${key}`);
			const data = await env.TASKS_KV.get(key, 'json') as BoardsFile | null;
			if (data) return data;
			// Default with a single 'main' board
			return {
				version: 1,
				boards: [ { id: 'main', name: 'main', tags: [] } ],
				updatedAt: new Date().toISOString(),
			};
		},
		async saveBoards(userType: UserType, userId: string | undefined, boards: BoardsFile) {
			console.log(`[KV] saveBoards CALLED - userType:`, userType, `userId:`, userId, `boards:`, boards);
			console.log(`[KV] saveBoards - param types:`, { 
				userType: typeof userType, 
				userId: typeof userId, 
				boards: typeof boards,
				userTypeValue: userType,
				userIdValue: userId
			});
			const key = boardKey(userType, userId);
			console.log(`[KV] saveBoards - key: ${key}`);
			await env.TASKS_KV.put(key, JSON.stringify(boards));
		},

		// --- Tasks (board scoped) ---
		async getTasks(userType: UserType, userId: string | undefined, boardId: string) {
			const key = tasksKey(userType, userId, boardId);
			console.log(`[KV] getTasks - key: ${key}`);
			const data = await env.TASKS_KV.get(key, 'json') as TasksFile | null;
			if (data) {
				console.log(`[KV] getTasks - found: ${data.tasks.length} tasks, first 5 IDs:`, data.tasks.slice(0, 5).map((t: any) => t.id));
			} else {
				console.log(`[KV] getTasks - found: none`);
			}
			if (data) return data;
			return {
				version: 1,
				tasks: [],
				updatedAt: new Date().toISOString(),
			};
		},
		async saveTasks(userType: UserType, userId: string | undefined, boardId: string, tasks: TasksFile) {
			const key = tasksKey(userType, userId, boardId);
			console.log(`[KV] saveTasks - key: ${key}, tasks:`, tasks.tasks.length, 'items');
			await env.TASKS_KV.put(key, JSON.stringify(tasks));
			console.log(`[KV] saveTasks - complete`);
		},

		// --- Stats (board scoped) ---
		async getStats(userType: UserType, userId: string | undefined, boardId: string) {
			const key = statsKey(userType, userId, boardId);
			console.log(`[KV] getStats - key: ${key}`);
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
			console.log(`[KV] saveStats - key: ${key}`);
			await env.TASKS_KV.put(key, JSON.stringify(stats));
		},
	};
}// 4. Health Check
app.get('/task/api/health', (c) => {
	return c.json({
		status: 'ok',
		service: 'task-api-adapter',
		timestamp: new Date().toISOString(),
	});
});

// 5. Helper to get storage and auth from context
const getContext = (c: Context<AppContext>) => ({
	storage: createKVStorage(c.env),
	auth: c.get('authContext'),
});

// 6. Task API Routes - Thin adapters to TaskHandlers
// ---- v2 Endpoints ----

// Get all boards (and optionally tasks per board depending on handler design)
app.get('/task/api/boards', async (c) => {
	const { storage, auth } = getContext(c);
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	console.log(`[GET /task/api/boards] Headers:`, {
		'X-User-Id': c.req.header('X-User-Id'),
		'X-User-Key': c.req.header('X-User-Key'),
		'X-Session-Id': c.req.header('X-Session-Id')
	});
	console.log(`[GET /task/api/boards] userType: ${auth.userType}, userId: ${userId}`);
	const result = await TaskHandlers.getBoards(storage, { ...auth, userId });
	return c.json(result);
});

// Create a new board
app.post('/task/api/boards', async (c) => {
	const { storage, auth } = getContext(c);
	const body = await c.req.json();
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	
	// Validate required fields
	if (!body.id) {
		console.error(`[POST /task/api/boards] ERROR: Missing required field 'id' in request body`);
		return c.json({ error: 'Missing required field: id' }, 400);
	}
	if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
		console.error(`[POST /task/api/boards] ERROR: Missing or invalid required field 'name'`);
		return c.json({ error: 'Missing or invalid required field: name' }, 400);
	}
	
	const result = await TaskHandlers.createBoard(storage, { ...auth, userId }, body);
	return c.json(result, 201);
});

// Delete a board
app.delete('/task/api/boards/:boardId', async (c) => {
	const { storage, auth } = getContext(c);
	const boardId = c.req.param('boardId');
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	
	// Validate boardId is provided
	if (!boardId || boardId.trim() === '') {
		console.error(`[DELETE /task/api/boards/:boardId] ERROR: Missing board ID in URL`);
		return c.json({ error: 'Missing required parameter: board ID' }, 400);
	}
	
	const result = await TaskHandlers.deleteBoard(storage, { ...auth, userId }, boardId);
	return c.json(result);
});

// Get tasks for a board
app.get('/task/api/tasks', async (c) => {
	const { storage, auth } = getContext(c);
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	const boardId = c.req.query('boardId') || 'main';
	const result = await TaskHandlers.getBoardTasks(storage, { ...auth, userId }, boardId);
	return c.json(result);
});

// Create task (boardId required)
app.post('/task/api', async (c) => {
	const { storage, auth } = getContext(c);
	const body = await c.req.json();
	const { boardId = 'main', ...input } = body;
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	
	// Validate required fields
	if (!input.id) {
		console.error(`[POST /task/api] ERROR: Missing required field 'id' in request body`);
		return c.json({ error: 'Missing required field: id' }, 400);
	}
	if (!input.title || typeof input.title !== 'string' || input.title.trim() === '') {
		console.error(`[POST /task/api] ERROR: Missing or invalid required field 'title'`);
		return c.json({ error: 'Missing or invalid required field: title' }, 400);
	}
	
	console.log(`[POST /task/api] Headers:`, {
		'X-User-Id': c.req.header('X-User-Id'),
		'X-User-Key': c.req.header('X-User-Key'),
		'X-Session-Id': c.req.header('X-Session-Id')
	});
	console.log(`[POST /task/api] userType: ${auth.userType}, userId: ${userId}, boardId: ${boardId}`);
	console.log(`[POST /task/api] input:`, input);
	const result = await TaskHandlers.createTask(storage, { ...auth, userId }, input, boardId);
	console.log(`[POST /task/api] result:`, result);
	return c.json(result, 201);
});

// Update task
app.patch('/task/api/:id', async (c) => {
	const { storage, auth } = getContext(c);
	const id = c.req.param('id');
	const body = await c.req.json();
	const { boardId = 'main', ...input } = body;
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	
	// Validate task ID is provided
	if (!id || id.trim() === '') {
		console.error(`[PATCH /task/api/:id] ERROR: Missing task ID in URL`);
		return c.json({ error: 'Missing required parameter: task ID' }, 400);
	}
	
	const result = await TaskHandlers.updateTask(storage, { ...auth, userId }, id, input, boardId);
	return c.json(result);
});

// Complete task
app.post('/task/api/:id/complete', async (c) => {
	const { storage, auth } = getContext(c);
	const id = c.req.param('id');
	const body = await c.req.json().catch(() => ({}));
	const boardId = body.boardId || c.req.query('boardId') || 'main';
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	
	// Validate task ID is provided
	if (!id || id.trim() === '') {
		console.error(`[POST /task/api/:id/complete] ERROR: Missing task ID in URL`);
		return c.json({ error: 'Missing required parameter: task ID' }, 400);
	}
	
	console.log(`[POST /task/api/:id/complete] Headers:`, {
		'X-User-Id': c.req.header('X-User-Id'),
		'X-User-Key': c.req.header('X-User-Key'),
		'X-Session-Id': c.req.header('X-Session-Id')
	});
	console.log(`[POST /task/api/:id/complete] id: ${id}, userType: ${auth.userType}, userId: ${userId}, boardId: ${boardId}`);
	const result = await TaskHandlers.completeTask(storage, { ...auth, userId }, id, boardId);
	return c.json(result);
});

// Delete task
app.delete('/task/api/:id', async (c) => {
	const { storage, auth } = getContext(c);
	const id = c.req.param('id');
	const body = await c.req.json().catch(() => ({}));
	const boardId = body.boardId || c.req.query('boardId') || 'main';
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	
	// Validate task ID is provided
	if (!id || id.trim() === '') {
		console.error(`[DELETE /task/api/:id] ERROR: Missing task ID in URL`);
		return c.json({ error: 'Missing required parameter: task ID' }, 400);
	}
	
	console.log(`[DELETE /task/api/:id] Headers:`, {
		'X-User-Id': c.req.header('X-User-Id'),
		'X-User-Key': c.req.header('X-User-Key'),
		'X-Session-Id': c.req.header('X-Session-Id')
	});
	console.log(`[DELETE /task/api/:id] id: ${id}, userType: ${auth.userType}, userId: ${userId}, boardId: ${boardId}`);
	const result = await TaskHandlers.deleteTask(storage, { ...auth, userId }, id, boardId);
	return c.json(result);
});

// Get stats for a board
app.get('/task/api/stats', async (c) => {
	const { storage, auth } = getContext(c);
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	const boardId = c.req.query('boardId') || 'main';
	const result = await TaskHandlers.getBoardStats(storage, { ...auth, userId }, boardId);
	return c.json(result);
});

// Create tag on board
app.post('/task/api/tags', async (c) => {
	const { storage, auth } = getContext(c);
	const body = await c.req.json();
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	
	// Validate required fields
	if (!body.boardId) {
		console.error(`[POST /task/api/tags] ERROR: Missing required field 'boardId' in request body`);
		return c.json({ error: 'Missing required field: boardId' }, 400);
	}
	if (!body.tag || typeof body.tag !== 'string' || body.tag.trim() === '') {
		console.error(`[POST /task/api/tags] ERROR: Missing or invalid required field 'tag'`);
		return c.json({ error: 'Missing or invalid required field: tag' }, 400);
	}
	
	const result = await TaskHandlers.createTag(storage, { ...auth, userId }, body);
	return c.json(result);
});

// Delete tag from board
app.delete('/task/api/tags', async (c) => {
	const { storage, auth } = getContext(c);
	const body = await c.req.json();
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	
	// Validate required fields
	if (!body.boardId) {
		console.error(`[DELETE /task/api/tags] ERROR: Missing required field 'boardId' in request body`);
		return c.json({ error: 'Missing required field: boardId' }, 400);
	}
	if (!body.tag || typeof body.tag !== 'string' || body.tag.trim() === '') {
		console.error(`[DELETE /task/api/tags] ERROR: Missing or invalid required field 'tag'`);
		return c.json({ error: 'Missing or invalid required field: tag' }, 400);
	}
	
	const result = await TaskHandlers.deleteTag(storage, { ...auth, userId }, body);
	return c.json(result);
});

// Get user preferences
app.get('/task/api/preferences', async (c) => {
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	const { auth } = getContext(c);
	const userType = auth.userType;
	
	// Use a consistent key format for preferences
	const prefsKey = `prefs:${userType}:${userId || 'public'}`;
	
	try {
		const prefs = await c.env.TASKS_KV.get(prefsKey, 'json');
		if (prefs) {
			return c.json(prefs);
		}
		// Return default preferences
		return c.json({ theme: 'light' });
	} catch (error: any) {
		console.error('[GET /task/api/preferences] ERROR:', error);
		return c.json({ theme: 'light' });
	}
});

// Save user preferences
app.put('/task/api/preferences', async (c) => {
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	const { auth } = getContext(c);
	const userType = auth.userType;
	const body = await c.req.json();
	
	// Use a consistent key format for preferences
	const prefsKey = `prefs:${userType}:${userId || 'public'}`;
	
	console.log('[PUT /task/api/preferences]', { userType, userId, prefs: body });
	
	try {
		await c.env.TASKS_KV.put(prefsKey, JSON.stringify(body));
		return c.json({ ok: true, message: 'Preferences saved' });
	} catch (error: any) {
		console.error('[PUT /task/api/preferences] ERROR:', error);
		return c.json({ error: 'Failed to save preferences' }, 500);
	}
});

// Backwards compatibility: old v1 list endpoint (maps to main board)
app.get('/task/api', async (c) => {
	const { storage, auth } = getContext(c);
	const userId = c.req.query('userId');
	const result = await TaskHandlers.getTasks(storage, { ...auth, userId }, 'main');
	return c.json(result);
});

export default app;
