/**
 * Tag Lifecycle Tests
 * 
 * Tests tag creation, assignment, and deletion with task cleanup.
 */
import { describe, it, expect } from 'vitest';
import app from './index';
import { 
	createTestEnv, 
	createAuthHeaders, 
	createBoard,
	createTask,
	updateTask,
	deleteTag,
	completeTask,
	deleteTask,
	getBoards,
	uniqueId 
} from './test-utils';

describe('Tag Lifecycle Tests', () => {
	const env = createTestEnv();
	const adminHeaders = createAuthHeaders(env.ADMIN_KEY, 'automated_testing_admin');

	it('should create task, assign tag, delete tag, and complete task', async () => {
		const boardId = 'testBoard1';
		const newTag = `tag-${uniqueId()}`;

		// Ensure board exists
		await createBoard(app, env, adminHeaders, boardId, 'Test Board 1');

		// 1. Create task
		const taskId = `task-${uniqueId()}`;
		const createRes = await createTask(app, env, adminHeaders, boardId, taskId, 'Tag Test Task');
		expect(createRes.status).toBe(200);

		// 2. Assign task to new tag
		const updateRes = await updateTask(app, env, adminHeaders, taskId, { tags: [newTag] }, boardId);
		expect(updateRes.status).toBe(200);

		// Verify tag was assigned
		let boardsRes = await getBoards(app, env, adminHeaders);

		let boardsData: any = await boardsRes.json();
		let board = boardsData.boards.find((b: any) => b.id === boardId);
		let task = board.tasks.find((t: any) => t.id === taskId);
		expect(task.tags).toContain(newTag);

		// 3. Delete new tag
		const deleteTagRes = await deleteTag(app, env, adminHeaders, boardId, newTag);
		expect(deleteTagRes.status).toBe(200);

		// 4. Verify that tag has been removed from task and doesn't exist in board
		boardsRes = await getBoards(app, env, adminHeaders);
		boardsData = await boardsRes.json();
		board = boardsData.boards.find((b: any) => b.id === boardId);
		task = board.tasks.find((t: any) => t.id === taskId);
		
		// Tag should be removed from task
		expect(task.tags || []).not.toContain(newTag);
		
		// Tag should not exist in board's tags list (if tracked)
		if (board.tags) {
			expect(board.tags).not.toContain(newTag);
		}

		// 5. Complete task
		const completeRes = await completeTask(app, env, adminHeaders, taskId, boardId);
		expect(completeRes.status).toBe(200);

		// Cleanup
		await deleteTask(app, env, adminHeaders, taskId, boardId);
	});
});
