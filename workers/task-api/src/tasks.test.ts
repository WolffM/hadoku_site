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

		// Verify task is completed
		const boardsRes = await getBoards(app, env, adminHeaders);
		const boardsData: any = await boardsRes.json();
		const board = boardsData.boards.find((b: any) => b.id === boardId);
		const task = board.tasks.find((t: any) => t.id === taskId);
		expect(task.completed).toBe(true);

		// Cleanup
		await deleteTask(app, env, adminHeaders, taskId, boardId);
		await deleteBoard(app, env, adminHeaders, boardId);
	});
});
