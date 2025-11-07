/**
 * Storage Format Tests
 * 
 * Verify that data is stored in KV with the correct structure and keys.
 * These tests catch schema changes and ensure data consistency.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import app from './index';
import { createTestEnv, createAuthHeaders, uniqueId } from './test-utils';

describe('Storage Format Tests', () => {
	let env: ReturnType<typeof createTestEnv>;
	const adminHeaders = createAuthHeaders(
		'test-admin-key',
		'automated_testing_admin'
	);

	beforeEach(() => {
		env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({ 'test-admin-key': 'admin' }),
			FRIEND_KEYS: JSON.stringify({ 'test-friend-key': 'friend' })
		});
	});

	describe('Board Storage', () => {
		it('should store board data with correct KV key format', async () => {
			const boardId = `test-${uniqueId()}`;

			// Create a board
			const response = await app.request('/task/api/boards', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: boardId, name: 'Test Board' })
			}, env);

			expect(response.status).toBe(200);

			// Verify the KV entry exists with correct key format
			// Key format should be: boards:{sessionId} where sessionId is the auth key
			const kvKey = `boards:test-admin-key`;
			const boardsData = await env.TASKS_KV.get(kvKey, 'json') as any;

			expect(boardsData).toBeDefined();
			expect(boardsData).toHaveProperty('version');
			expect(boardsData).toHaveProperty('boards');
			expect(boardsData).toHaveProperty('updatedAt');
		});

		it('should store board with correct data structure', async () => {
			const boardId = `test-${uniqueId()}`;
			const boardName = 'Structured Board';

			// Create board
			await app.request('/task/api/boards', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: boardId, name: boardName })
			}, env);

			// Verify structure
			const boardsData = await env.TASKS_KV.get('boards:test-admin-key', 'json') as any;

			expect(boardsData.version).toBe(1);
			expect(Array.isArray(boardsData.boards)).toBe(true);
			expect(boardsData.boards.length).toBeGreaterThan(0);

			// Find our board
			const board = boardsData.boards.find((b: any) => b.id === boardId);
			expect(board).toBeDefined();
			expect(board.name).toBe(boardName);
			expect(board).toHaveProperty('id');
			expect(board).toHaveProperty('tags');
			expect(board).toHaveProperty('tasks');
		});

		it('should maintain ISO 8601 timestamp format', async () => {
			const boardId = `test-${uniqueId()}`;

			// Create board
			await app.request('/task/api/boards', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: boardId, name: 'Timestamp Board' })
			}, env);

			// Check timestamp
			const boardsData = await env.TASKS_KV.get('boards:test-admin-key', 'json') as any;
			const timestamp = boardsData.updatedAt;

			// Should be valid ISO 8601
			expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
			// Should be parseable
			expect(() => new Date(timestamp)).not.toThrow();
		});
	});

	describe('Task Storage', () => {
		it('should store tasks with correct KV key format', async () => {
			const boardId = `test-${uniqueId()}`;
			const taskId = `task-${uniqueId()}`;

			// Create board first
			await app.request('/task/api/boards', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: boardId, name: 'Task Board' })
			}, env);

			// Create task
			await app.request('/task/api', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: taskId, title: 'Test Task', boardId })
			}, env);

			// Verify KV key format: tasks:{sessionId}:{boardId}
			const kvKey = `tasks:test-admin-key:${boardId}`;
			const tasksData = await env.TASKS_KV.get(kvKey, 'json') as any;

			expect(tasksData).toBeDefined();
			expect(tasksData).toHaveProperty('version');
			expect(tasksData).toHaveProperty('tasks');
			expect(tasksData).toHaveProperty('updatedAt');
		});

		it('should store task with correct data structure', async () => {
			const boardId = `test-${uniqueId()}`;
			const taskId = `task-${uniqueId()}`;
			const taskTitle = 'Structured Task';

			// Create board and task
			await app.request('/task/api/boards', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: boardId, name: 'Board' })
			}, env);

			await app.request('/task/api', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: taskId, title: taskTitle, boardId })
			}, env);

			// Verify task data
			const tasksData = await env.TASKS_KV.get(`tasks:test-admin-key:${boardId}`, 'json') as any;

			expect(tasksData.version).toBe(1);
			expect(Array.isArray(tasksData.tasks)).toBe(true);

			const task = tasksData.tasks.find((t: any) => t.id === taskId);
			expect(task).toBeDefined();
			expect(task.title).toBe(taskTitle);
			expect(task).toHaveProperty('id');
			expect(task).toHaveProperty('state');
			expect(task).toHaveProperty('createdAt');
		});

		it('should use boardId parameter in KV key', async () => {
			const boardId1 = `board-${uniqueId()}`;
			const boardId2 = `board-${uniqueId()}`;
			const taskId1 = `task-${uniqueId()}`;
			const taskId2 = `task-${uniqueId()}`;

			// Create two boards
			await app.request('/task/api/boards', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: boardId1, name: 'Board 1' })
			}, env);

			await app.request('/task/api/boards', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: boardId2, name: 'Board 2' })
			}, env);

			// Create task in board 1
			await app.request('/task/api', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: taskId1, title: 'Task 1', boardId: boardId1 })
			}, env);

			// Create task in board 2
			await app.request('/task/api', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: taskId2, title: 'Task 2', boardId: boardId2 })
			}, env);

			// Verify they're in separate KV entries
			const tasks1 = await env.TASKS_KV.get(`tasks:test-admin-key:${boardId1}`, 'json') as any;
			const tasks2 = await env.TASKS_KV.get(`tasks:test-admin-key:${boardId2}`, 'json') as any;

			expect(tasks1.tasks.some((t: any) => t.id === taskId1)).toBe(true);
			expect(tasks1.tasks.some((t: any) => t.id === taskId2)).toBe(false);

			expect(tasks2.tasks.some((t: any) => t.id === taskId1)).toBe(false);
			expect(tasks2.tasks.some((t: any) => t.id === taskId2)).toBe(true);
		});
	});

	// Stats Storage tests removed - stats migrated to D1 database

	describe('Preferences Storage', () => {
		it('should store preferences with correct KV key format', async () => {
			const prefs = { theme: 'dark', notifications: true };

			// Save preferences
			await app.request('/task/api/preferences', {
				method: 'PUT',
				headers: adminHeaders,
				body: JSON.stringify(prefs)
			}, env);

			// Verify KV key format: prefs:{sessionId}
			const kvKey = 'prefs:test-admin-key';
			const prefsData = await env.TASKS_KV.get(kvKey, 'json') as any;

			expect(prefsData).toBeDefined();
			expect(prefsData.theme).toBe('dark');
			expect(prefsData.notifications).toBe(true);
		});

		it('should preserve preference values exactly', async () => {
			const prefs = {
				theme: 'light',
				notifications: false,
				language: 'en-US',
				custom: { nested: 'value' }
			};

			// Save preferences
			await app.request('/task/api/preferences', {
				method: 'PUT',
				headers: adminHeaders,
				body: JSON.stringify(prefs)
			}, env);

			// Verify exact preservation (excluding auto-added lastUpdated)
			const prefsData = await env.TASKS_KV.get('prefs:test-admin-key', 'json') as any;

			expect(prefsData.theme).toBe(prefs.theme);
			expect(prefsData.notifications).toBe(prefs.notifications);
			expect(prefsData.language).toBe(prefs.language);
			expect(prefsData.custom).toEqual(prefs.custom);
			expect(prefsData.lastUpdated).toBeDefined(); // Auto-added by server
		});
	});

	describe('KV Key Isolation', () => {
		it('should use sessionId to isolate data between keys', async () => {
			// Admin creates a board
			const adminResponse = await app.request('/task/api/boards', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: 'admin-board', name: 'Admin Board' })
			}, env);
			expect(adminResponse.status).toBe(200);

			// Friend creates a board with same name
			const friendHeaders = createAuthHeaders(
				'test-friend-key',
				'automated_testing_friend'
			);
			const friendResponse = await app.request('/task/api/boards', {
				method: 'POST',
				headers: friendHeaders,
				body: JSON.stringify({ id: 'friend-board', name: 'Admin Board' })
			}, env);
			expect(friendResponse.status).toBe(200);

			// Verify they're stored in separate KV entries
			const adminBoardsData = await env.TASKS_KV.get('boards:test-admin-key', 'json') as any;
			const friendBoardsData = await env.TASKS_KV.get('boards:test-friend-key', 'json') as any;

			expect(adminBoardsData).toBeDefined();
			expect(friendBoardsData).toBeDefined();

			// Admin should only see their board
			expect(adminBoardsData.boards.some((b: any) => b.id === 'admin-board')).toBe(true);
			expect(adminBoardsData.boards.some((b: any) => b.id === 'friend-board')).toBe(false);

			// Friend should only see their board
			expect(friendBoardsData.boards.some((b: any) => b.id === 'admin-board')).toBe(false);
			expect(friendBoardsData.boards.some((b: any) => b.id === 'friend-board')).toBe(true);
		});
	});

	describe('KV Entry Existence', () => {
		it('should create KV entries only when needed', async () => {
			const boardId = `test-${uniqueId()}`;

			// Initially no entries
			expect(await env.TASKS_KV.get('boards:test-admin-key', 'json')).toBeNull();
			expect(await env.TASKS_KV.get(`tasks:test-admin-key:${boardId}`, 'json')).toBeNull();

			// Create board
			await app.request('/task/api/boards', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: boardId, name: 'Board' })
			}, env);

			// Now boards entry exists
			expect(await env.TASKS_KV.get('boards:test-admin-key', 'json')).not.toBeNull();

			// But tasks entry might not exist (depends on implementation)
			// This documents the behavior
			const tasksEntry = await env.TASKS_KV.get(`tasks:test-admin-key:${boardId}`, 'json');
			// tasksEntry might be null or contain default data - document the expectation
		});
	});
});
