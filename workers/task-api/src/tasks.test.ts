/**
 * Task CRUD Tests
 * 
 * Covers basic task lifecycle operations.
 */
import { describe, it, expect } from 'vitest';
import app from './index';
import { 
	createTestEnv, 
	createAuthHeaders, 
	createTestBoard, 
	createTestTask,
	deleteTask,
	deleteBoard,
	completeTask,
	getBoards
} from './test-utils';

describe('Task CRUD Operations', () => {
	const env = createTestEnv();
	const adminHeaders = createAuthHeaders(env.ADMIN_KEY, 'automated_testing_admin');

	it('should create and delete task', async () => {
		// Setup: Create a board
		const { boardId } = await createTestBoard(app, env, adminHeaders);

		// 1. Create task
		const { taskId, response: createRes } = await createTestTask(app, env, adminHeaders, boardId);

		expect(createRes.status).toBe(200);
		const created: any = await createRes.json();
		expect(created.ok).toBe(true);

		// 2. Delete task
		const deleteRes = await deleteTask(app, env, adminHeaders, taskId, boardId);
		expect(deleteRes.status).toBe(200);
		const deleted: any = await deleteRes.json();
		expect(deleted.ok).toBe(true);

		// Cleanup
		await deleteBoard(app, env, adminHeaders, boardId);
	});

	it('should create and complete task', async () => {
		// Setup: Create a board
		const { boardId } = await createTestBoard(app, env, adminHeaders);

		// 1. Create task
		const { taskId } = await createTestTask(app, env, adminHeaders, boardId);

		// 2. Complete task
		const completeRes = await completeTask(app, env, adminHeaders, taskId, boardId);
		expect(completeRes.status).toBe(200);
		const completed: any = await completeRes.json();
		expect(completed.ok).toBe(true);

		// Verify task is removed from board (completed tasks are removed)
		const boardsRes = await getBoards(app, env, adminHeaders);
		const boardsData: any = await boardsRes.json();
		const board = boardsData.boards.find((b: any) => b.id === boardId);
		
		// Task should be removed from tasks array when completed
		const task = board.tasks.find((t: any) => t.id === taskId);
		expect(task).toBeUndefined();
		
		// Verify stats show the completion
		expect(board.stats.counters.completed).toBe(1);

		// No cleanup needed - task is already removed
		await deleteBoard(app, env, adminHeaders, boardId);
	});
});
