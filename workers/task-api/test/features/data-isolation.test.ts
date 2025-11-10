/**
 * Data Isolation Tests
 * 
 * Verify that data is properly isolated between different authentication contexts.
 * Users with different keys should not be able to access each other's data.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createTestEnv, createAuthHeaders, uniqueId } from '../__helpers__/test-utils';

describe('Data Isolation Tests', () => {
	let env: ReturnType<typeof createTestEnv>;
	let adminHeaders: Record<string, string>;
	let friendHeaders: Record<string, string>;
	let publicHeaders: Record<string, string>;

	beforeEach(() => {
		env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({ 'admin-key-1': 'admin' }),
			FRIEND_KEYS: JSON.stringify({ 'friend-key-1': 'friend' })
		});

		adminHeaders = createAuthHeaders('admin-key-1', 'admin_user');
		friendHeaders = createAuthHeaders('friend-key-1', 'friend_user');
		publicHeaders = {}; // No auth headers = public user
	});

	describe('Board Isolation', () => {
		it('should not share boards between admin and friend', async () => {
			const adminBoardId = `admin-${uniqueId()}`;
			const friendBoardId = `friend-${uniqueId()}`;

			// Admin creates a board
			const adminCreateRes = await app.request('/task/api/boards', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: adminBoardId, name: 'Admin Board' })
			}, env);
			expect(adminCreateRes.status).toBe(200);

			// Friend creates a board
			const friendCreateRes = await app.request('/task/api/boards', {
				method: 'POST',
				headers: friendHeaders,
				body: JSON.stringify({ id: friendBoardId, name: 'Friend Board' })
			}, env);
			expect(friendCreateRes.status).toBe(200);

			// Admin lists their boards
			const adminListRes = await app.request('/task/api/boards', {
				headers: adminHeaders
			}, env);
			const adminData = await adminListRes.json<{ boards: { id: string }[] }>();

			// Friend lists their boards
			const friendListRes = await app.request('/task/api/boards', {
				headers: friendHeaders
			}, env);
			const friendData = await friendListRes.json<{ boards: { id: string }[] }>();

			// Admin should see their board but not friend's
			expect(adminData.boards.some((b) => b.id === adminBoardId)).toBe(true);
			expect(adminData.boards.some((b) => b.id === friendBoardId)).toBe(false);

			// Friend should see their board but not admin's
			expect(friendData.boards.some((b) => b.id === friendBoardId)).toBe(true);
			expect(friendData.boards.some((b) => b.id === adminBoardId)).toBe(false);
		});

		it('should isolate boards from public users', async () => {
			const adminBoardId = `admin-${uniqueId()}`;

			// Admin creates a board
			await app.request('/task/api/boards', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: adminBoardId, name: 'Secret Board' })
			}, env);

			// Admin sees their board
			const adminListRes = await app.request('/task/api/boards', {
				headers: adminHeaders
			}, env);
			const adminData = await adminListRes.json<{ boards: { id: string }[] }>();
			expect(adminData.boards.some((b) => b.id === adminBoardId)).toBe(true);

			// Public user shouldn't see admin's board
			const publicListRes = await app.request('/task/api/boards', {
				headers: publicHeaders
			}, env);
			const publicData = await publicListRes.json<{ boards: { id: string }[] }>();
			expect(publicData.boards.some((b) => b.id === adminBoardId)).toBe(false);
		});
	});

	describe('Task Isolation', () => {
		it('should not share tasks between users', async () => {
			const boardId = 'shared-board-id';
			const adminTaskId = `admin-task-${uniqueId()}`;
			const friendTaskId = `friend-task-${uniqueId()}`;

			// Both create same board name (different KV entries due to different keys)
			await app.request('/task/api/boards', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: boardId, name: 'Board' })
			}, env);

			await app.request('/task/api/boards', {
				method: 'POST',
				headers: friendHeaders,
				body: JSON.stringify({ id: boardId, name: 'Board' })
			}, env);

			// Admin creates a task
			await app.request('/task/api', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({
					id: adminTaskId,
					title: 'Admin Task',
					boardId
				})
			}, env);

			// Friend creates a task
			await app.request('/task/api', {
				method: 'POST',
				headers: friendHeaders,
				body: JSON.stringify({
					id: friendTaskId,
					title: 'Friend Task',
					boardId
				})
			}, env);

			// Admin lists boards
			const adminListRes = await app.request('/task/api/boards', {
				headers: adminHeaders
			}, env);
			const adminData = await adminListRes.json<{ boards: { id: string, tasks: { id: string }[] }[] }>();
			const adminBoard = adminData.boards.find((b) => b.id === boardId);

			// Friend lists boards
			const friendListRes = await app.request('/task/api/boards', {
				headers: friendHeaders
			}, env);
			const friendData = await friendListRes.json<{ boards: { id: string, tasks: { id: string }[] }[] }>();
			const friendBoard = friendData.boards.find((b) => b.id === boardId);

			// Admin should see only their task
			expect(adminBoard!.tasks.some((t) => t.id === adminTaskId)).toBe(true);
			expect(adminBoard!.tasks.some((t) => t.id === friendTaskId)).toBe(false);

			// Friend should see only their task
			expect(friendBoard!.tasks.some((t) => t.id === friendTaskId)).toBe(true);
			expect(friendBoard!.tasks.some((t) => t.id === adminTaskId)).toBe(false);
		});
	});

	describe('Concurrent Operations Isolation', () => {
		it('should handle concurrent writes from different users', async () => {
			const boardId = `concurrent-${uniqueId()}`;
			const adminTaskId = `admin-task-${uniqueId()}`;
			const friendTaskId = `friend-task-${uniqueId()}`;

			// Create boards for both
			const [adminBoardRes, friendBoardRes] = await Promise.all([
				app.request('/task/api/boards', {
					method: 'POST',
					headers: adminHeaders,
					body: JSON.stringify({ id: boardId, name: 'Board' })
				}, env),
				app.request('/task/api/boards', {
					method: 'POST',
					headers: friendHeaders,
					body: JSON.stringify({ id: boardId, name: 'Board' })
				}, env)
			]);

			expect(adminBoardRes.status).toBe(200);
			expect(friendBoardRes.status).toBe(200);

			// Both create tasks concurrently
			const [adminTaskRes, friendTaskRes] = await Promise.all([
				app.request('/task/api', {
					method: 'POST',
					headers: adminHeaders,
					body: JSON.stringify({
						id: adminTaskId,
						title: 'Admin Task',
						boardId
					})
				}, env),
				app.request('/task/api', {
					method: 'POST',
					headers: friendHeaders,
					body: JSON.stringify({
						id: friendTaskId,
						title: 'Friend Task',
						boardId
					})
				}, env)
			]);

			expect(adminTaskRes.status).toBe(200);
			expect(friendTaskRes.status).toBe(200);

			// Verify both writes succeeded without interference
			const adminListRes = await app.request('/task/api/boards', {
				headers: adminHeaders
			}, env);
			const adminData = await adminListRes.json<{ boards: { id: string, tasks: { id: string }[] }[] }>();
			const adminBoard = adminData.boards.find((b) => b.id === boardId);

			expect(adminBoard!.tasks.length).toBe(1);
			expect(adminBoard!.tasks[0].id).toBe(adminTaskId);
		});
	});
});
