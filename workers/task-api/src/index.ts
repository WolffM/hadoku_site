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
	parseKeysFromEnv,
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

/**
 * Validate a key and determine userType
 * Centralized logic used by both auth middleware and validate-key endpoint
 * Note: userId is NOT part of auth - it's stored metadata in boards
 */
function validateKeyAndGetType(
	key: string,
	adminKeys: Record<string, string> | Set<string>,
	friendKeys: Record<string, string> | Set<string>
): { valid: boolean; userType: 'admin' | 'friend' | 'public' } {
	// Check admin keys
	if (adminKeys instanceof Set) {
		if (adminKeys.has(key)) {
			return { valid: true, userType: 'admin' };
		}
	} else if (key in adminKeys) {
		return { valid: true, userType: 'admin' };
	}
	
	// Check friend keys
	if (friendKeys instanceof Set) {
		if (friendKeys.has(key)) {
			return { valid: true, userType: 'friend' };
		}
	} else if (key in friendKeys) {
		return { valid: true, userType: 'friend' };
	}
	
	// Not found in either
	return { valid: false, userType: 'public' };
}

// Extend AuthContext to include the authentication key
interface ExtendedAuthContext extends TaskAuthContext {
	key?: string;  // The authentication key used for KV storage
	isPublic?: boolean;
	isFriend?: boolean;
	isAdmin?: boolean;
}

interface Env {
	// JSON key objects mapping keys to userIds
	ADMIN_KEYS?: string;
	FRIEND_KEYS?: string;
	TASKS_KV: KVNamespace;
}

// Define a custom context type for Hono
type AppContext = {
	Bindings: Env;
	Variables: {
		authContext: ExtendedAuthContext;
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

// 2. Custom Authentication Middleware with key preservation
app.use('*', async (c, next) => {
	// Extract the authentication key
	const sources = ['header:X-User-Key', 'query:key'];
	let key: string | undefined;
	
	for (const source of sources) {
		if (source.startsWith('header:')) {
			const headerName = source.split(':')[1];
			key = c.req.header(headerName);
		} else if (source.startsWith('query:')) {
			const queryName = source.split(':')[1];
			key = c.req.query(queryName);
		}
		if (key) break;
	}
	
	// Parse key mappings (can be Set for arrays or Record for objects)
	const adminKeys = parseKeysFromEnv(c.env.ADMIN_KEYS);
	const friendKeys = parseKeysFromEnv(c.env.FRIEND_KEYS);
	
	// DEBUG: Log what we parsed (TEMPORARY - REMOVE AFTER DEBUGGING)
	console.log('[AUTH DEBUG] ADMIN_KEYS type:', adminKeys instanceof Set ? 'Set' : 'Record', 'size:', adminKeys instanceof Set ? adminKeys.size : Object.keys(adminKeys).length);
	console.log('[AUTH DEBUG] FRIEND_KEYS type:', friendKeys instanceof Set ? 'Set' : 'Record', 'size:', friendKeys instanceof Set ? friendKeys.size : Object.keys(friendKeys).length);
	if (key) {
		console.log('[AUTH DEBUG] Checking key:', key.substring(0, 8) + '...');
	}
	
	// Validate key and determine userType using centralized logic
	const { valid, userType } = key 
		? validateKeyAndGetType(key, adminKeys, friendKeys)
		: { valid: false, userType: 'public' as const };
	
	// Store extended auth context with the key
	// Note: userId is NOT part of auth - it's stored in board metadata
	const authContext: ExtendedAuthContext = {
		userType,
		key,  // The only thing that matters for authentication
		isPublic: userType === 'public',
		isFriend: userType === 'friend',
		isAdmin: userType === 'admin'
	};
	
	c.set('authContext', authContext);
	await next();
});

// 3. Workers KV Storage Implementation
// This is the parent's responsibility - adapt storage to the environment.
function createKVStorage(env: Env, authContext: ExtendedAuthContext): TaskStorage {
	// Storage keys use the authentication key for data isolation
	// Format: {type}:{key} where key is the authentication key
	// For public users without a key, use 'public' as the key
	const storageKey = authContext.key || 'public';
	
	const boardKey = () => `boards:${storageKey}`;
	const tasksKey = (boardId: string) => `tasks:${storageKey}:${boardId}`;
	const statsKey = (boardId: string) => `stats:${storageKey}:${boardId}`;

	return {
	// --- Boards ---
	async getBoards(userType: UserType, userId?: string) {
		const kvKey = boardKey();
		const data = await env.TASKS_KV.get(kvKey, 'json') as any | null;
		if (data) return data;
		// Default with a single 'main' board
		return {
			version: 1,
			boards: [ { id: 'main', name: 'main', tags: [], tasks: [] } ],
			updatedAt: new Date().toISOString(),
		};
	},
	async saveBoards(userType: UserType, boards: any, userId?: string) {
		const kvKey = boardKey();
		await env.TASKS_KV.put(kvKey, JSON.stringify(boards));
	},		// --- Tasks (board scoped) ---
		async getTasks(userType: UserType, userId: string | undefined, boardId: string) {
			const kvKey = tasksKey(boardId);
			const data = await env.TASKS_KV.get(kvKey, 'json') as TasksFile | null;
			if (data) return data;
			return {
				version: 1,
				tasks: [],
				updatedAt: new Date().toISOString(),
			};
		},
		async saveTasks(userType: UserType, userId: string | undefined, boardId: string, tasks: TasksFile) {
			const kvKey = tasksKey(boardId);
			await env.TASKS_KV.put(kvKey, JSON.stringify(tasks));
		},

		// --- Stats (board scoped) ---
		async getStats(userType: UserType, userId: string | undefined, boardId: string) {
			const kvKey = statsKey(boardId);
			const data = await env.TASKS_KV.get(kvKey, 'json') as StatsFile | null;
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
			const kvKey = statsKey(boardId);
			await env.TASKS_KV.put(kvKey, JSON.stringify(stats));
		},

		// --- Delete board data ---
		async deleteBoardData(userType: UserType, userId: string, boardId: string) {
			// Delete tasks and stats for the board
			const taskKey = tasksKey(boardId);
			const statKey = statsKey(boardId);
			await Promise.all([
				env.TASKS_KV.delete(taskKey),
				env.TASKS_KV.delete(statKey)
			]);
		}
	};
}

// 4. Health Check
app.get('/task/api/health', (c) => healthCheck(c, 'task-api-adapter', { kv: true }));

// 5. Helper to get storage and auth from context
const getContext = (c: Context<AppContext>) => ({
	storage: createKVStorage(c.env, c.get('authContext')),
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
	const authContext = c.get('authContext');
	logRequest('GET', '/task/api/boards', { userType: authContext.userType });
	
	// Get boards data from handler
	const { storage, auth } = getContext(c);
	const userId = getStableUserId(c);
	const boardsData = await TaskHandlers.getBoards(storage, { ...auth, userId });
	
	// Add current auth context to response (overriding any stored values)
	// This ensures the response reflects the CURRENT authentication, not stored metadata
	console.log('[GET /task/api/boards] Auth context:', {
		userType: auth.userType,
		key: auth.key?.substring(0, 8) + '...',
		isPublic: auth.isPublic,
		isFriend: auth.isFriend,
		isAdmin: auth.isAdmin
	});
	
	return c.json({
		...boardsData,
		// userId comes from stored board metadata, not auth
		userType: auth.userType  // Always reflect current authentication
	});
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

// Delete tag from board - POST to avoid DELETE body issues with proxies
app.post('/task/api/tags/delete', async (c) => {
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
app.post('/task/api/batch-clear-tag', async (c) => {
	logRequest('POST', '/task/api/batch-clear-tag', { 
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
	const { auth } = getContext(c);
	const storageKey = auth.key || 'public';
	
	// Use key-based storage for preferences
	const prefsKey = `prefs:${storageKey}`;
	
	try {
		const prefs = await c.env.TASKS_KV.get(prefsKey, 'json');
		if (prefs) {
			return c.json(prefs);
		}
		// Return default preferences
		return c.json({ theme: 'light' });
	} catch (error: any) {
		logError('GET', '/task/api/preferences', error);
		return c.json({ theme: 'light' });
	}
});

// Save user preferences
app.put('/task/api/preferences', async (c) => {
	const { auth } = getContext(c);
	const storageKey = auth.key || 'public';
	const body = await c.req.json();
	
	// Use key-based storage for preferences
	const prefsKey = `prefs:${storageKey}`;
	
	logRequest('PUT', '/task/api/preferences', { userType: auth.userType, userId: auth.userId, prefs: body });
	
	try {
		await c.env.TASKS_KV.put(prefsKey, JSON.stringify(body));
		return c.json({ ok: true, message: 'Preferences saved' });
	} catch (error: any) {
		logError('PUT', '/task/api/preferences', error);
		return badRequest(c, 'Failed to save preferences');
	}
});

// User ID Migration Endpoint
// NOTE: This migrates data within the same key (changes userId display name)
// It does NOT move data between different keys
app.post('/task/api/migrate-userid', async (c) => {
	const { auth } = getContext(c);
	const currentKey = auth.key;
	const currentUserId = auth.userId;
	
	// Only authenticated users can migrate
	if (auth.userType === 'public' || !currentKey) {
		return c.json({ error: 'Migration not available for public users' }, 401);
	}
	
	if (!currentUserId) {
		return c.json({ error: 'Current userId not found' }, 400);
	}
	
	const { newUserId } = await c.req.json();
	
	// Validate newUserId
	if (!newUserId || typeof newUserId !== 'string' || newUserId.length === 0) {
		return c.json({ error: 'newUserId must be 1-50 characters' }, 400);
	}
	
	if (newUserId.length < 1 || newUserId.length > 50) {
		return c.json({ error: 'newUserId must be 1-50 characters' }, 400);
	}
	
	if (!/^[a-zA-Z0-9_-]+$/.test(newUserId)) {
		return c.json({ error: 'newUserId can only contain letters, numbers, underscores, and hyphens' }, 400);
	}
	
	if (newUserId.toLowerCase() === 'public') {
		return c.json({ error: 'userId "public" is reserved' }, 400);
	}
	
	if (newUserId === currentUserId) {
		return c.json({ error: 'newUserId must be different from current userId' }, 400);
	}
	
	// Check if newUserId already has data (prevent overwriting existing user data)
	// Since data is stored by key, not userId, we need to check if there's
	// any existing data that was created with the target userId
	// This happens when someone used X-User-Id header with this userId before
	const boardsKey = `boards:${currentKey}`;
	const existingBoardsData = await c.env.TASKS_KV.get(boardsKey);
	
	if (existingBoardsData) {
		const boards = JSON.parse(existingBoardsData);
		
		// If boards.userId exists and matches newUserId, someone already used that userId
		// OR if boards.userId is undefined but currentUserId is different from newUserId,
		// and there are boards, then the newUserId might have created those boards
		if (boards.userId === newUserId) {
			return c.json({ error: `userId "${newUserId}" already has data` }, 409);
		}
		
		// If there's no userId field yet, but there are boards, and we're trying to
		// migrate to a different userId than what we came in with, we need to check
		// if those boards might belong to the target userId by checking the updatedAt
		// or other metadata. However, since we don't have that info, we'll be conservative:
		// If currentUserId is empty/undefined (new key with no userId set yet), allow migration.
		// If currentUserId exists and is different from newUserId, check if boards exist.
		if (!boards.userId && boards.boards && boards.boards.length > 0 && currentUserId !== newUserId) {
			// There are boards but no userId set yet. This means they were created before
			// userId tracking. We can't tell who created them, so block the migration to be safe.
			return c.json({ error: `userId "${newUserId}" already has data` }, 409);
		}
	}

	
	logRequest('POST', '/task/api/migrate-userid', { 
		oldUserId: currentUserId, 
		newUserId, 
		userType: auth.userType,
		key: currentKey
	});
	
	// Update userId metadata in all KV entries for this key
	const storage = createKVStorage(c.env, auth);
	const migratedKeys: string[] = [];
	
	try {
		// Get boards metadata
		const boardsKey = `boards:${currentKey}`;
		const boardsData = await c.env.TASKS_KV.get(boardsKey);
		
		if (boardsData) {
			const boards = JSON.parse(boardsData);
			
			// Update userId in boards metadata
			boards.userId = newUserId;
			boards.userType = auth.userType;
			
			await c.env.TASKS_KV.put(boardsKey, JSON.stringify(boards));
			migratedKeys.push(boardsKey);
			
			// Track all related keys (tasks and stats for each board)
			if (boards.boards && Array.isArray(boards.boards)) {
				for (const board of boards.boards) {
					const tasksKey = `tasks:${currentKey}:${board.id}`;
					const statsKey = `stats:${currentKey}:${board.id}`;
					
					// Check if they exist
					if (await c.env.TASKS_KV.get(tasksKey)) {
						migratedKeys.push(tasksKey);
					}
					if (await c.env.TASKS_KV.get(statsKey)) {
						migratedKeys.push(statsKey);
					}
				}
			}
		}
		
		// Update preferences metadata (if exists)
		const prefsKey = `prefs:${currentKey}`;
		const prefsData = await c.env.TASKS_KV.get(prefsKey);
		if (prefsData) {
			const prefs = JSON.parse(prefsData);
			prefs.userId = newUserId;
			await c.env.TASKS_KV.put(prefsKey, JSON.stringify(prefs));
			migratedKeys.push(prefsKey);
		}
		
		return c.json({
			success: true,
			oldUserId: currentUserId || '',
			newUserId,
			migratedKeys,
			message: `userId updated from "${currentUserId || '(empty)'}" to "${newUserId}". Admin should update FRIEND_KEYS/ADMIN_KEYS mapping from "${currentKey}": "${currentUserId}" to "${currentKey}": "${newUserId}" in .env and redeploy.`,
			note: 'Data remains stored by key - only userId metadata was updated'
		});
	} catch (error) {
		console.error('Migration error:', error);
		return c.json({ 
			error: 'Migration failed', 
			details: error instanceof Error ? error.message : String(error)
		}, 500);
	}
});

// Validate Key Endpoint
// Check if a key is valid (exists in ADMIN_KEYS or FRIEND_KEYS)
app.post('/task/api/validate-key', async (c) => {
	const body = await c.req.json();
	const { key } = body;
	
	if (!key || typeof key !== 'string') {
		return c.json({ valid: false, error: 'Key is required' }, 400);
	}
	
	// Parse key mappings from env (can be Set for arrays or Record for objects)
	const adminKeys = parseKeysFromEnv(c.env.ADMIN_KEYS);
	const friendKeys = parseKeysFromEnv(c.env.FRIEND_KEYS);
	
	// Use centralized validation logic
	const validation = validateKeyAndGetType(key, adminKeys, friendKeys);
	
	logRequest('POST', '/task/api/validate-key', { 
		keyProvided: !!key,
		valid: validation.valid,
		userType: validation.userType,
		keyPreview: key.substring(0, 4) + '...' // Log first 4 chars only for security
	});
	
	return c.json({ valid: validation.valid });
});

// Set User ID Endpoint
// Update the userId associated with the current session
// This is different from migrate-userid:
//   - migrate-userid: Advisory endpoint that tells admin to update .env
//   - user/set-id: Actually updates the in-memory mapping (session-only, not persisted)
app.post('/task/api/user/set-id', async (c) => {
	const { auth } = getContext(c);
	const currentKey = auth.key;
	
	// Only authenticated users can set userId
	if (auth.userType === 'public' || !currentKey) {
		return c.json({ error: 'Setting userId not available for public users' }, 401);
	}
	
	const body = await c.req.json();
	const { newUserId } = body;
	
	// Validate newUserId
	if (!newUserId || typeof newUserId !== 'string') {
		return c.json({ error: 'newUserId is required' }, 400);
	}
	
	if (newUserId.length < 1 || newUserId.length > 50) {
		return c.json({ error: 'newUserId must be 1-50 characters' }, 400);
	}
	
	if (!/^[a-zA-Z0-9_-]+$/.test(newUserId)) {
		return c.json({ error: 'newUserId can only contain letters, numbers, underscores, and hyphens' }, 400);
	}
	
	if (newUserId.toLowerCase() === 'public') {
		return c.json({ error: 'userId "public" is reserved' }, 400);
	}
	
	logRequest('POST', '/task/api/user/set-id', { 
		oldUserId: auth.userId,
		newUserId,
		userType: auth.userType,
		key: currentKey
	});
	
	// Note: This is a session-only update. The actual mapping is stored in ADMIN_KEYS/FRIEND_KEYS env vars.
	// This endpoint just returns success to indicate the frontend can update sessionStorage.
	// The real userId mapping happens on the backend via env vars.
	return c.json({
		ok: true,
		message: 'User ID updated for display purposes. Backend mapping remains in environment variables.'
	});
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
