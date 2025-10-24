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
	createAuthMiddleware,
	parseKeysFromEnv,
	createHadokuCors,
	extractField,
	requireFields,
	badRequest,
	healthCheck,
	logRequest,
	logError
} from '../../util';
import {
	handleSessionHandshake,
	getPreferencesBySessionId,
	savePreferencesBySessionId,
	type HandshakeRequest,
	type HandshakeResponse,
	type UserPreferences
} from './session';

/**
 * Validate a key and determine userType
 * Used by both auth middleware resolver and validate-key endpoint
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
		authContext: TaskAuthContext & { key?: string };  // Keep key for backward compatibility
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

// 2. Authentication Middleware using util function
app.use('*', createAuthMiddleware<Env>({
	sources: ['header:X-User-Key', 'query:key'],
	resolver: (credential, env) => {
		// Parse key mappings
		const adminKeys = parseKeysFromEnv(env.ADMIN_KEYS);
		const friendKeys = parseKeysFromEnv(env.FRIEND_KEYS);
		
		// DEBUG: Log what we parsed (TEMPORARY - REMOVE AFTER DEBUGGING)
		console.log('[AUTH DEBUG] ADMIN_KEYS type:', adminKeys instanceof Set ? 'Set' : 'Record', 'size:', adminKeys instanceof Set ? adminKeys.size : Object.keys(adminKeys).length);
		console.log('[AUTH DEBUG] FRIEND_KEYS type:', friendKeys instanceof Set ? 'Set' : 'Record', 'size:', friendKeys instanceof Set ? friendKeys.size : Object.keys(friendKeys).length);
		if (credential) {
			console.log('[AUTH DEBUG] Checking key:', credential.substring(0, 8) + '...');
		}
		
		// Validate key and determine userType
		const { userType } = credential
			? validateKeyAndGetType(credential, adminKeys, friendKeys)
			: { userType: 'public' as const };
		
		// Return auth context with sessionId and key for backward compatibility
		return {
			userType,
			sessionId: credential || 'public',
			key: credential // Preserve key for backward compatibility
		};
	}
}));

// 3. Workers KV Storage Implementation
// This is the parent's responsibility - adapt storage to the environment.
function createKVStorage(env: Env): TaskStorage {
	// Storage keys use sessionId for data isolation
	// Format: {type}:{sessionId} where sessionId is the session identifier
	
	const boardKey = (sessionId?: string) => `boards:${sessionId || 'public'}`;
	const tasksKey = (sessionId: string | undefined, boardId: string) => `tasks:${sessionId || 'public'}:${boardId}`;
	const statsKey = (sessionId: string | undefined, boardId: string) => `stats:${sessionId || 'public'}:${boardId}`;

	return {
		// --- Boards ---
		async getBoards(userType: UserType, sessionId?: string) {
			const kvKey = boardKey(sessionId);
			const data = await env.TASKS_KV.get(kvKey, 'json') as any | null;
			if (data) return data;
			// Default with a single 'main' board
			return {
				version: 1,
				boards: [ { id: 'main', name: 'main', tags: [], tasks: [] } ],
				updatedAt: new Date().toISOString(),
			};
		},
		async saveBoards(userType: UserType, boards: any, sessionId?: string) {
			const kvKey = boardKey(sessionId);
			await env.TASKS_KV.put(kvKey, JSON.stringify(boards));
		},
		
		// --- Tasks (board scoped) ---
		async getTasks(userType: UserType, sessionId?: string, boardId?: string) {
			if (!boardId) boardId = 'main';
			const kvKey = tasksKey(sessionId, boardId);
			const data = await env.TASKS_KV.get(kvKey, 'json') as TasksFile | null;
			if (data) return data;
			return {
				version: 1,
				tasks: [],
				updatedAt: new Date().toISOString(),
			};
		},
		async saveTasks(userType: UserType, sessionId: string | undefined, boardId: string | undefined, tasks: TasksFile) {
			if (!boardId) boardId = 'main';
			const kvKey = tasksKey(sessionId, boardId);
			await env.TASKS_KV.put(kvKey, JSON.stringify(tasks));
		},

		// --- Stats (board scoped) ---
		async getStats(userType: UserType, sessionId?: string, boardId?: string) {
			if (!boardId) boardId = 'main';
			const kvKey = statsKey(sessionId, boardId);
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
		async saveStats(userType: UserType, sessionId: string | undefined, boardId: string | undefined, stats: StatsFile) {
			if (!boardId) boardId = 'main';
			const kvKey = statsKey(sessionId, boardId);
			await env.TASKS_KV.put(kvKey, JSON.stringify(stats));
		},

		// --- Delete board data ---
		async deleteBoardData(userType: UserType, sessionId: string, boardId: string) {
			// Delete tasks and stats for the board
			const taskKey = tasksKey(sessionId, boardId);
			const statKey = statsKey(sessionId, boardId);
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
	storage: createKVStorage(c.env),
	auth: c.get('authContext'),
});

// Generic handler wrapper for operations without locking
async function handleOperation<T>(
	c: Context<AppContext>,
	operation: (storage: TaskStorage, auth: TaskAuthContext) => Promise<T>
): Promise<Response> {
	const { storage, auth } = getContext(c);
	
	const result = await operation(storage, auth);
	return c.json(result);
}

// Generic handler wrapper for single-board operations
async function handleBoardOperation<T>(
	c: Context<AppContext>,
	boardId: string,
	operation: (storage: TaskStorage, auth: TaskAuthContext) => Promise<T>
): Promise<Response> {
	const { storage, auth } = getContext(c);
	const boardKey = `${auth.userType}:${auth.sessionId}:${boardId}`;
	
	const result = await withBoardLock(boardKey, async () => {
		return await operation(storage, auth);
	});
	
	return c.json(result);
}

// Generic handler wrapper for batch operations
async function handleBatchOperation<T>(
	c: Context<AppContext>,
	requiredFields: string[],
	operation: (storage: TaskStorage, auth: TaskAuthContext, body: any) => Promise<T>,
	getBoardKeys?: (body: any, userType: string, sessionId: string) => string[]
): Promise<Response> {
	const { storage, auth } = getContext(c);
	const body = await c.req.json();
	
	// Validate required fields
	const error = requireFields(body, requiredFields);
	if (error) {
		return badRequest(c, error);
	}
	
	// If no board keys provided, no locking needed
	if (!getBoardKeys) {
		const result = await operation(storage, auth, body);
		return c.json(result);
	}
	
	// Get board keys and apply locks
	const boardKeys = getBoardKeys(body, auth.userType, auth.sessionId || 'public');
	
	// Single board lock
	if (boardKeys.length === 1) {
		const result = await withBoardLock(boardKeys[0], async () => {
			return await operation(storage, auth, body);
		});
		return c.json(result);
	}
	
	// Multiple board locks (in consistent order to prevent deadlocks)
	const sortedKeys = [...boardKeys].sort();
	const result = await withBoardLock(sortedKeys[0], async () => {
		return await withBoardLock(sortedKeys[1], async () => {
			return await operation(storage, auth, body);
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
	const boardsData = await TaskHandlers.getBoards(storage, auth);
	
	// Add current auth context to response (overriding any stored values)
	// This ensures the response reflects the CURRENT authentication, not stored metadata
	console.log('[GET /task/api/boards] Auth context:', {
		userType: auth.userType,
		sessionId: auth.sessionId?.substring(0, 8) + '...',
		key: auth.key?.substring(0, 8) + '...'
	});
	
	return c.json({
		...boardsData,
		// Always reflect current authentication
		userType: auth.userType
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
	const boardKey = `${auth.userType}:${auth.sessionId}:${boardId}`;
	
	const result = await withBoardLock(boardKey, async () => {
		return await TaskHandlers.batchUpdateTags(storage, auth, { ...body, boardId });
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
		(body, userType, sessionId) => [
			`${userType}:${sessionId}:${body.sourceBoardId}`,
			`${userType}:${sessionId}:${body.targetBoardId}`
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
		(body, userType, sessionId) => [`${userType}:${sessionId}:${body.boardId}`]
	);
});

// ============================================================================
// Session Management Endpoints
// ============================================================================

/**
 * Session Handshake Endpoint
 * 
 * POST /task/api/session/handshake
 * 
 * Handles session initialization and migration:
 * 1. Client provides oldSessionId (if they had one) and newSessionId
 * 2. Server looks up preferences for oldSessionId
 * 3. If found, copy preferences to newSessionId
 * 4. If not found, check authKey mapping for last session
 * 5. Update authKey → sessionId mapping
 * 6. Return preferences for client
 */
app.post('/task/api/session/handshake', async (c) => {
	try {
		const { auth } = getContext(c);
		const body = await c.req.json() as HandshakeRequest;
		
		// Validate request
		if (!body.newSessionId) {
			return badRequest(c, 'newSessionId is required');
		}
		
		// Get authKey from context
		const authKey = auth.key || auth.sessionId || 'public';
		
		logRequest('POST', '/task/api/session/handshake', {
			userType: auth.userType,
			authKey: authKey.substring(0, 8) + '...',
			oldSessionId: body.oldSessionId ? body.oldSessionId.substring(0, 12) + '...' : null,
			newSessionId: body.newSessionId.substring(0, 12) + '...'
		});
		
		// Handle handshake
		const response = await handleSessionHandshake(
			c.env.TASKS_KV,
			authKey,
			auth.userType as 'admin' | 'friend' | 'public',
			body
		);
		
		return c.json(response);
	} catch (error: any) {
		logError('POST', '/task/api/session/handshake', error);
		return badRequest(c, 'Handshake failed: ' + error.message);
	}
});

/**
 * Get User Preferences
 * 
 * GET /task/api/preferences
 * 
 * Fetches preferences by sessionId from X-Session-Id header
 * Returns all preferences (theme, buttons, experimental flags, layout, etc.)
 */
app.get('/task/api/preferences', async (c) => {
	const { auth } = getContext(c);
	
	// Get sessionId from header or fallback to auth.sessionId
	const sessionId = c.req.header('X-Session-Id') || auth.sessionId || 'public';
	
	logRequest('GET', '/task/api/preferences', {
		userType: auth.userType,
		sessionId: sessionId.substring(0, 12) + '...'
	});
	
	try {
		const prefs = await getPreferencesBySessionId(c.env.TASKS_KV, sessionId);
		
		if (prefs) {
			return c.json(prefs);
		}
		
		// Return default preferences if none found
		const defaultPrefs: UserPreferences = {
			theme: 'system',
			buttons: {},
			experimentalFlags: {},
			layout: {},
			lastUpdated: new Date().toISOString()
		};
		
		return c.json(defaultPrefs);
	} catch (error: any) {
		logError('GET', '/task/api/preferences', error);
		
		// Return defaults on error
		return c.json({
			theme: 'system',
			buttons: {},
			experimentalFlags: {},
			layout: {}
		});
	}
});

/**
 * Save User Preferences
 * 
 * PUT /task/api/preferences
 * 
 * Saves preferences by sessionId from X-Session-Id header
 * Accepts ALL preference fields (theme, buttons, experimental flags, layout, etc.)
 * Merges with existing preferences
 */
app.put('/task/api/preferences', async (c) => {
	const { auth } = getContext(c);
	
	// Get sessionId from header or fallback to auth.sessionId
	const sessionId = c.req.header('X-Session-Id') || auth.sessionId || 'public';
	
	try {
		const body = await c.req.json();
		
		logRequest('PUT', '/task/api/preferences', {
			userType: auth.userType,
			sessionId: sessionId.substring(0, 12) + '...',
			fields: Object.keys(body)
		});
		
		// Get existing preferences
		const existing = await getPreferencesBySessionId(c.env.TASKS_KV, sessionId) || {};
		
		// Merge with new preferences
		const updated: UserPreferences = {
			...existing,
			...body,
			lastUpdated: new Date().toISOString()
		};
		
		// Save merged preferences
		await savePreferencesBySessionId(c.env.TASKS_KV, sessionId, updated);
		
		return c.json({ ok: true, message: 'Preferences saved', preferences: updated });
	} catch (error: any) {
		logError('PUT', '/task/api/preferences', error);
		return badRequest(c, 'Failed to save preferences: ' + error.message);
	}
});

// ============================================================================
// Deprecated Endpoints
// ============================================================================

// User ID Migration Endpoint
// DEPRECATED: This endpoint is deprecated in v3.0.39+ as the API now only uses sessionId
// The concept of userId migration no longer applies
app.post('/task/api/migrate-userid', async (c) => {
	return c.json({ 
		error: 'This endpoint is deprecated. The task API now uses sessionId only and does not support userId migration.',
		deprecated: true,
		version: '3.0.39+',
		migration: 'Use sessionId as the stable identifier instead of userId'
	}, 410); // 410 Gone - indicates the endpoint is no longer available
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
