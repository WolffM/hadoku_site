/**
 * Test utilities for Task API
 * 
 * Provides helpers for creating test environments and mocking KV storage.
 */

/**
 * Create a mock KV namespace for testing.
 * Uses an in-memory Map to simulate Workers KV.
 */
export function createMockKV(): KVNamespace {
	const store = new Map<string, string>();
	
	return {
		async get(key: string, type?: 'text' | 'json' | 'arrayBuffer' | 'stream') {
			const value = store.get(key);
			if (!value) return null;
			
			if (type === 'json') {
				return JSON.parse(value);
			}
			return value as any;
		},
		
		async put(key: string, value: string | ArrayBuffer | ReadableStream) {
			if (typeof value === 'string') {
				store.set(key, value);
			} else if (value instanceof ArrayBuffer) {
				store.set(key, new TextDecoder().decode(value));
			} else {
				// For streams, read and store
				const reader = value.getReader();
				const chunks: Uint8Array[] = [];
				while (true) {
					const { done, value: chunk } = await reader.read();
					if (done) break;
					chunks.push(chunk);
				}
				const combined = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
				let offset = 0;
				for (const chunk of chunks) {
					combined.set(chunk, offset);
					offset += chunk.length;
				}
				store.set(key, new TextDecoder().decode(combined));
			}
		},
		
		async delete(key: string) {
			store.delete(key);
		},
		
		async list() {
			return {
				keys: Array.from(store.keys()).map(name => ({ name })),
				list_complete: true,
				cursor: '',
			} as any;
		},
		
		// Additional methods required by KVNamespace interface
		getWithMetadata: async () => ({ value: null, metadata: null }),
		async putWithMetadata() {},
	} as KVNamespace;
}

/**
 * Create a test environment with mock KV storage.
 * 
 * @param overrides - Optional environment overrides
 * @returns Test environment with mocked KV and keys
 */
export function createTestEnv(overrides: Partial<{
	ADMIN_KEYS: string;
	FRIEND_KEYS: string;
	TASKS_KV: KVNamespace;
}> = {}) {
	return {
		// JSON key objects for testing
		ADMIN_KEYS: JSON.stringify({ 'test-admin-key': 'admin' }),
		FRIEND_KEYS: JSON.stringify({ 'test-friend-key': 'friend' }),
		TASKS_KV: createMockKV(),
		...overrides,
	};
}

/**
 * Generate a unique ID for test isolation.
 * 
 * @returns 8-character hex string
 */
export function uniqueId(): string {
	return Math.random().toString(16).substring(2, 10);
}

/**
 * Extract the first admin key from the test environment.
 * 
 * @param env - Test environment
 * @returns First admin key from ADMIN_KEYS JSON
 */
function getTestAdminKey(env: ReturnType<typeof createTestEnv>): string {
	try {
		const keys = JSON.parse(env.ADMIN_KEYS || '{}');
		return Object.keys(keys)[0] || 'test-admin-key';
	} catch {
		return 'test-admin-key';
	}
}

/**
 * Create request headers with authentication.
 * Uses the test admin key by default.
 * 
 * @param userKey - User key (or test environment to auto-extract admin key)
 * @param userId - User ID (e.g., 'automated_testing_admin' or 'automated_testing_friend')
 * @param extraHeaders - Additional headers to include
 * @returns Headers object with authentication
 */
export function createAuthHeaders(
	userKeyOrEnv: string | ReturnType<typeof createTestEnv>, 
	userId: string = 'automated_testing_admin', 
	extraHeaders: Record<string, string> = {}
) {
	// If passed an env object, extract the admin key
	const userKey = typeof userKeyOrEnv === 'string' 
		? userKeyOrEnv 
		: getTestAdminKey(userKeyOrEnv);
	
	return {
		'X-User-Key': userKey,
		'X-User-Id': userId,
		'Content-Type': 'application/json',
		...extraHeaders,
	};
}

// =============================================================================
// API Endpoint Helpers - Mirror actual API from index.ts
// =============================================================================

/**
 * Create a board
 */
export async function createBoard(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	boardId: string,
	name: string
) {
	return app.request('/task/api/boards', {
		method: 'POST',
		headers,
		body: JSON.stringify({ id: boardId, name }),
	}, env);
}

/**
 * Create a task
 */
export async function createTask(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	boardId: string,
	taskId: string,
	title: string
) {
	return app.request('/task/api', {
		method: 'POST',
		headers,
		body: JSON.stringify({ id: taskId, title, boardId }),
	}, env);
}

/**
 * Create a tag on a board
 */
export async function createTag(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	boardId: string,
	tag: string
) {
	return app.request('/task/api/tags', {
		method: 'POST',
		headers,
		body: JSON.stringify({ boardId, tag }),
	}, env);
}

// =============================================================================
// Test Convenience Wrappers - Auto-generate IDs for tests
// =============================================================================

/**
 * Create a test board with auto-generated ID.
 * Convenience wrapper for tests.
 */
export async function createTestBoard(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	boardId?: string,
	name?: string
) {
	const id = boardId || `test-${uniqueId()}`;
	const boardName = name || 'Test Board';
	const response = await createBoard(app, env, headers, id, boardName);
	return { boardId: id, response };
}

/**
 * Create a test task with auto-generated ID.
 * Convenience wrapper for tests.
 */
export async function createTestTask(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	boardId: string,
	taskId?: string,
	title?: string
) {
	const id = taskId || `task-${uniqueId()}`;
	const taskTitle = title || 'Test Task';
	const res = await createTask(app, env, headers, boardId, id, taskTitle);
	return { taskId: id, response: res };
}

/**
 * Create a test tag with auto-generated name.
 * Convenience wrapper for tests.
 */
export async function createTestTag(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	boardId: string,
	tagName?: string
) {
	const tag = tagName || `tag-${uniqueId()}`;
	const res = await createTag(app, env, headers, boardId, tag);
	return { tag, response: res };
}

// =============================================================================
// Other API Endpoint Helpers
// =============================================================================

/**
 * Get all boards for the authenticated user
 */
export async function getBoards(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>
) {
	return app.request('/task/api/boards', { headers }, env);
}

/**
 * Delete a board
 */
export async function deleteBoard(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	boardId: string
) {
	return app.request(`/task/api/boards/${boardId}`, {
		method: 'DELETE',
		headers,
	}, env);
}

/**
 * Get tasks for a specific board
 */
export async function getTasks(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	boardId: string = 'main'
) {
	return app.request(`/task/api/tasks?boardId=${boardId}`, { headers }, env);
}

/**
 * Update a task
 */
export async function updateTask(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	taskId: string,
	updates: any,
	boardId: string = 'main'
) {
	return app.request(`/task/api/${taskId}`, {
		method: 'PATCH',
		headers,
		body: JSON.stringify({ ...updates, boardId }),
	}, env);
}

/**
 * Complete a task
 */
export async function completeTask(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	taskId: string,
	boardId: string = 'main'
) {
	return app.request(`/task/api/${taskId}/complete`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ boardId }),
	}, env);
}

/**
 * Delete a task
 */
export async function deleteTask(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	taskId: string,
	boardId: string = 'main'
) {
	return app.request(`/task/api/${taskId}`, {
		method: 'DELETE',
		headers,
		body: JSON.stringify({ boardId }),
	}, env);
}

/**
 * Delete a tag from a board
 */
export async function deleteTag(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	boardId: string,
	tag: string
) {
	return app.request('/task/api/tags/delete', {
		method: 'POST',
		headers,
		body: JSON.stringify({ boardId, tag }),
	}, env);
}

/**
 * Batch update tags on multiple tasks
 */
export async function batchUpdateTags(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	boardId: string,
	updates: Array<{ taskId: string; tag: string }>
) {
	return app.request(`/task/api/boards/${boardId}/tasks/batch/update-tags`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ boardId, updates }),
	}, env);
}

/**
 * Batch update tags (legacy alias)
 */
export async function batchUpdateTagsLegacy(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	boardId: string,
	updates: Array<{ taskId: string; tag: string }>
) {
	return app.request('/task/api/batch-tag', {
		method: 'PATCH',
		headers,
		body: JSON.stringify({ boardId, updates }),
	}, env);
}

/**
 * Batch move tasks between boards
 */
export async function batchMoveTasks(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	sourceBoardId: string,
	targetBoardId: string,
	taskIds: string[]
) {
	return app.request('/task/api/batch-move', {
		method: 'POST',
		headers,
		body: JSON.stringify({ sourceBoardId, targetBoardId, taskIds }),
	}, env);
}

/**
 * Batch clear tag from multiple tasks
 */
export async function batchClearTag(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	boardId: string,
	tag: string,
	taskIds: string[]
) {
	return app.request('/task/api/batch-clear-tag', {
		method: 'POST',
		headers,
		body: JSON.stringify({ boardId, tag, taskIds }),
	}, env);
}

/**
 * Get user preferences
 */
export async function getPreferences(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>
) {
	return app.request('/task/api/preferences', { headers }, env);
}

/**
 * Save user preferences
 */
export async function savePreferences(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	preferences: any
) {
	return app.request('/task/api/preferences', {
		method: 'PUT',
		headers,
		body: JSON.stringify(preferences),
	}, env);
}

/**
 * Get board stats
 */
export async function getStats(
	app: any,
	env: ReturnType<typeof createTestEnv>,
	headers: Record<string, string>,
	boardId: string = 'main'
) {
	return app.request(`/task/api/stats?boardId=${boardId}`, { headers }, env);
}
