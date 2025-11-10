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
	const adminHeaders = createAuthHeaders(env, 'automated_testing_admin');

	it('should create task, assign tag, delete tag, and complete task', async () => {
		const boardId = 'testBoard1';
		const newTag = `tag-${uniqueId()}`;

		// Ensure board exists
		await createBoard(app, env, adminHeaders, boardId, 'Test Board 1');

		// 1. Create task
		const taskId = `task-${uniqueId()}`;
		const createRes = await createTask(app, env, adminHeaders, boardId, taskId, 'Tag Test Task');
		expect(createRes.status).toBe(200);

		// 2. Assign task to new tag (use 'tag' field with space-separated string)
		const updateRes = await updateTask(app, env, adminHeaders, taskId, { tag: newTag }, boardId);
		expect(updateRes.status).toBe(200);

		// Verify tag was assigned
		let boardsRes = await getBoards(app, env, adminHeaders);

		let boardsData: { boards: any[] } = await boardsRes.json();
		let board = boardsData.boards.find((b: any) => b.id === boardId);
		let task = board.tasks.find((t: any) => t.id === taskId);
		expect(task.tag).toContain(newTag);

		// 3. Delete tag from board (NOTE: deleteTag only removes from board's tag list, not from tasks)
		const deleteTagRes = await deleteTag(app, env, adminHeaders, boardId, newTag);
		expect(deleteTagRes.status).toBe(200);

		// 4. Verify that tag has been removed from board's tag list but still exists on task
		boardsRes = await getBoards(app, env, adminHeaders);
		boardsData = await boardsRes.json();
		board = boardsData.boards.find((b: any) => b.id === boardId);
		task = board.tasks.find((t: any) => t.id === taskId);
		
		// Tag should STILL be on the task (deleteTag doesn't remove from tasks)
		expect(task.tag || '').toContain(newTag);
		
		// Tag should not exist in board's tags list
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
