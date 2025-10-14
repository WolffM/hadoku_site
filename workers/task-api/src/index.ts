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
			const data = await env.TASKS_KV.get(boardKey(userType, userId), 'json') as BoardsFile | null;
			if (data) return data;
			// Default with a single 'main' board
			return {
				version: 1,
				boards: [ { id: 'main', name: 'main', tags: [] } ],
				updatedAt: new Date().toISOString(),
			};
		},
		async saveBoards(userType: UserType, userId: string | undefined, boards: BoardsFile) {
			await env.TASKS_KV.put(boardKey(userType, userId), JSON.stringify(boards));
		},

		// --- Tasks (board scoped) ---
		async getTasks(userType: UserType, userId: string | undefined, boardId: string) {
			const data = await env.TASKS_KV.get(tasksKey(userType, userId, boardId), 'json') as TasksFile | null;
			if (data) return data;
			return {
				version: 1,
				tasks: [],
				updatedAt: new Date().toISOString(),
			};
		},
		async saveTasks(userType: UserType, userId: string | undefined, boardId: string, tasks: TasksFile) {
			await env.TASKS_KV.put(tasksKey(userType, userId, boardId), JSON.stringify(tasks));
		},

		// --- Stats (board scoped) ---
		async getStats(userType: UserType, userId: string | undefined, boardId: string) {
			const data = await env.TASKS_KV.get(statsKey(userType, userId, boardId), 'json') as StatsFile | null;
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
			await env.TASKS_KV.put(statsKey(userType, userId, boardId), JSON.stringify(stats));
		},
	};
}

// 4. Health Check
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
	const userId = c.req.query('userId');
	const result = await TaskHandlers.getBoards(storage, { ...auth, userId });
	return c.json(result);
});

// Create a new board (TODO: Not yet implemented in @wolffm/task package)
app.post('/task/api/boards', async (c) => {
	return c.json({ error: 'Board creation not yet implemented in task package' }, 501);
});

// Delete a board (TODO: Not yet implemented in @wolffm/task package)
app.delete('/task/api/boards/:boardId', async (c) => {
	return c.json({ error: 'Board deletion not yet implemented in task package' }, 501);
});

// Get tasks for a board
app.get('/task/api/tasks', async (c) => {
	const { storage, auth } = getContext(c);
	const userId = c.req.query('userId');
	const boardId = c.req.query('boardId') || 'main';
	// Note: getTasks exists in package but isn't exported, so we call storage directly
	const result = await storage.getTasks(auth.userType, userId, boardId);
	return c.json(result);
});

// Create task (boardId required)
app.post('/task/api', async (c) => {
	const { storage, auth } = getContext(c);
	const body = await c.req.json();
	const { boardId = 'main', ...input } = body;
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
	const result = await TaskHandlers.createTask(storage, { ...auth, userId }, input, boardId);
	return c.json(result, 201);
});

// Update task
app.patch('/task/api/:id', async (c) => {
	const { storage, auth } = getContext(c);
	const id = c.req.param('id');
	const body = await c.req.json();
	const { boardId = 'main', ...input } = body;
	const userId = c.req.header('X-User-Id') || c.req.query('userId');
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
	await TaskHandlers.deleteTask(storage, { ...auth, userId }, id, boardId);
	return c.json({ success: true });
});

// Get stats for a board
app.get('/task/api/stats', async (c) => {
	const { storage, auth } = getContext(c);
	const userId = c.req.query('userId');
	const boardId = c.req.query('boardId') || 'main';
	// Note: getStats exists in package but isn't exported, so we call storage directly
	const result = await storage.getStats(auth.userType, userId, boardId);
	return c.json(result);
});

// Create tag on board (TODO: Not yet implemented in @wolffm/task package)
app.post('/task/api/tags', async (c) => {
	return c.json({ error: 'Tag management not yet implemented in task package' }, 501);
});

// Delete tag from board (TODO: Not yet implemented in @wolffm/task package)
app.delete('/task/api/tags', async (c) => {
	return c.json({ error: 'Tag management not yet implemented in task package' }, 501);
});

// Backwards compatibility: old v1 list endpoint (maps to main board)
app.get('/task/api', async (c) => {
	const { storage, auth } = getContext(c);
	const userId = c.req.query('userId');
	const result = await TaskHandlers.getTasks(storage, { ...auth, userId }, 'main');
	return c.json(result);
});

export default app;
