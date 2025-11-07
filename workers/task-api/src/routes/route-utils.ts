/**
 * Route Utilities
 *
 * Shared helper functions for route handlers
 */
import type { Context } from 'hono';
import type { TaskStorage, AuthContext as TaskAuthContext, UserType, TasksFile, StatsFile } from '@wolffm/task/api';
import { boardsKey, tasksKey, statsKey } from '../kv-keys';
import { DEFAULT_BOARD_ID, DEFAULT_BOARD_NAME } from '../constants';

type Env = {
	TASKS_KV: KVNamespace;
};

type AppContext = {
	Bindings: Env;
	Variables: {
		authContext: TaskAuthContext;
		context: { auth: TaskAuthContext };
	};
};

/**
 * Create KV-backed storage adapter for @wolffm/task package
 */
export function createKVStorage(env: Env): TaskStorage {
	return {
		// --- Boards ---
		async getBoards(userType: UserType, sessionId?: string) {
			const kvKey = boardsKey(sessionId);
			const data = await env.TASKS_KV.get(kvKey, 'json') as any | null;
			if (data) return data;
			// Default with a single default board
			return {
				version: 1,
				boards: [{ id: DEFAULT_BOARD_ID, name: DEFAULT_BOARD_NAME, tags: [], tasks: [] }],
				updatedAt: new Date().toISOString(),
			};
		},
		async saveBoards(userType: UserType, boards: any, sessionId?: string) {
			const kvKey = boardsKey(sessionId);
			await env.TASKS_KV.put(kvKey, JSON.stringify(boards));
		},

		// --- Tasks (board scoped) ---
		async getTasks(userType: UserType, sessionId?: string, boardId?: string) {
			if (!boardId) boardId = DEFAULT_BOARD_ID;
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
			if (!boardId) boardId = DEFAULT_BOARD_ID;
			const kvKey = tasksKey(sessionId, boardId);
			await env.TASKS_KV.put(kvKey, JSON.stringify(tasks));
		},

		// --- Stats (board scoped) ---
		async getStats(userType: UserType, sessionId?: string, boardId?: string) {
			if (!boardId) boardId = DEFAULT_BOARD_ID;
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
			if (!boardId) boardId = DEFAULT_BOARD_ID;
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

/**
 * Helper to get storage and auth from context
 */
export const getContext = (c: Context<AppContext>) => ({
	storage: createKVStorage(c.env),
	auth: c.get('authContext'),
});

/**
 * Generic handler wrapper for operations without locking
 */
export async function handleOperation<T>(
	c: Context<AppContext>,
	operation: (storage: TaskStorage, auth: TaskAuthContext) => Promise<T>
): Promise<Response> {
	const { storage, auth } = getContext(c);

	const result = await operation(storage, auth);
	return c.json(result);
}

/**
 * Simple in-memory lock to prevent concurrent writes to the same board
 * This prevents race conditions when multiple PATCH requests hit simultaneously
 */
const boardLocks = new Map<string, Promise<any>>();

export async function withBoardLock<T>(
	boardsKey: string,
	operation: () => Promise<T>
): Promise<T> {
	// Wait for any existing operation on this board to complete
	const existingLock = boardLocks.get(boardsKey);
	if (existingLock) {
		await existingLock.catch(() => {}); // Ignore errors from previous operations
	}

	// Create a new lock for this operation
	const newLock = operation();
	boardLocks.set(boardsKey, newLock);

	try {
		const result = await newLock;
		return result;
	} finally {
		// Clean up the lock if it's still ours
		if (boardLocks.get(boardsKey) === newLock) {
			boardLocks.delete(boardsKey);
		}
	}
}

/**
 * Generic handler wrapper for single-board operations (with locking)
 */
export async function handleBoardOperation<T>(
	c: Context<AppContext>,
	boardId: string,
	operation: (storage: TaskStorage, auth: TaskAuthContext) => Promise<T>
): Promise<Response> {
	const { storage, auth } = getContext(c);
	const boardsKey = `${auth.userType}:${auth.sessionId}:${boardId}`;

	const result = await withBoardLock(boardsKey, async () => {
		return await operation(storage, auth);
	});

	return c.json(result);
}

/**
 * Generic handler wrapper for batch operations
 */
export async function handleBatchOperation<T>(
	c: Context<AppContext>,
	requiredFields: string[],
	operation: (storage: TaskStorage, auth: TaskAuthContext, body: any) => Promise<T>,
	getBoardKeys?: (body: any, userType: string, sessionId: string) => string[]
): Promise<Response> {
	const { storage, auth } = getContext(c);
	const body = await c.req.json();

	// Validate required fields
	const { requireFields, badRequest } = await import('../../../util');
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
	const boardsKeys = getBoardKeys(body, auth.userType, auth.sessionId || 'public');

	// Single board lock
	if (boardsKeys.length === 1) {
		const result = await withBoardLock(boardsKeys[0], async () => {
			return await operation(storage, auth, body);
		});
		return c.json(result);
	}

	// Multiple board locks (in consistent order to prevent deadlocks)
	const sortedKeys = [...boardsKeys].sort();
	const result = await withBoardLock(sortedKeys[0], async () => {
		return await withBoardLock(sortedKeys[1], async () => {
			return await operation(storage, auth, body);
		});
	});
	return c.json(result);
}
