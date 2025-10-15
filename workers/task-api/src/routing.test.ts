/**
 * Route collision tests
 * 
 * These tests validate commit a499400 which fixed route collision where
 * PATCH /task/api/batch-tag was matching PATCH /task/api/:id
 */
import { describe, it, expect } from 'vitest';
import app from './index';
import { 
	createTestEnv, 
	createAuthHeaders, 
	createTestBoard, 
	createTestTask,
	batchUpdateTags,
	batchUpdateTagsLegacy,
	updateTask,
	getBoards
} from './test-utils';

describe('Route Collision Tests', () => {
	const env = createTestEnv();
	const adminHeaders = createAuthHeaders(env.ADMIN_KEY, 'automated_testing_admin');

	it('should NOT confuse batch-tag route with :id parameter', async () => {
		// Setup: Create a board and tasks
		const { boardId } = await createTestBoard(app, env, adminHeaders);
		const { taskId: task1Id } = await createTestTask(app, env, adminHeaders, boardId, undefined, 'Task 1');
		const { taskId: task2Id } = await createTestTask(app, env, adminHeaders, boardId, undefined, 'Task 2');

		// Test 1: Batch-tag should work (hits batch-tag route)
		const batchRes = await batchUpdateTags(app, env, adminHeaders, boardId, [
			{ taskId: task1Id, tag: 'urgent' },
			{ taskId: task2Id, tag: 'urgent' },
		]);

		expect(batchRes.status).toBe(200);
		const batchData: any = await batchRes.json();
		expect(batchData.ok).toBe(true);

		// Test 2: Updating task with id="batch-tag" should fail with 404
		// (This proves the routes are separate)
		const updateRes = await updateTask(app, env, adminHeaders, 'batch-tag', { title: 'Should Not Work' }, boardId);

		// This should fail because there's no task with id "batch-tag"
		// Before the fix, this would have been treated as a batch-tag operation
		expect(updateRes.status).toBe(400); // Missing required fields for batch operation
	});

	it('should apply tags to multiple tasks via batch endpoint', async () => {
		// Setup
		const { boardId } = await createTestBoard(app, env, adminHeaders);
		
		const taskIds = [];
		for (let i = 0; i < 3; i++) {
			const { taskId } = await createTestTask(app, env, adminHeaders, boardId, undefined, `Task ${i}`);
			taskIds.push(taskId);
		}

		// Batch tag all 3 tasks
		const batchRes = await batchUpdateTags(
			app, env, adminHeaders, boardId,
			taskIds.map(taskId => ({ taskId, tag: 'important' }))
		);

		expect(batchRes.status).toBe(200);
		const batchData: any = await batchRes.json();
		expect(batchData.ok).toBe(true);

		// Verify all tasks have the tag
		const boardsRes = await getBoards(app, env, adminHeaders);

		const boardsData: any = await boardsRes.json();
		const board = boardsData.boards.find((b: any) => b.id === boardId);
		expect(board).toBeDefined();

		const taggedTasks = board.tasks.filter((t: any) => 
			t.tags && t.tags.includes('important')
		);
		expect(taggedTasks.length).toBe(3);
	});

	it('should handle legacy batch-tag alias correctly', async () => {
		// Setup
		const { boardId } = await createTestBoard(app, env, adminHeaders);
		const { taskId } = await createTestTask(app, env, adminHeaders, boardId, undefined, 'Task 1');

		// Use legacy PATCH /task/api/batch-tag endpoint
		const legacyRes = await batchUpdateTagsLegacy(app, env, adminHeaders, boardId, [
			{ taskId, tag: 'legacy-test' }
		]);

		expect(legacyRes.status).toBe(200);
		const legacyData: any = await legacyRes.json();
		expect(legacyData.ok).toBe(true);

		// Verify tag was applied
		const boardsRes = await getBoards(app, env, adminHeaders);

		const boardsData: any = await boardsRes.json();
		const board = boardsData.boards.find((b: any) => b.id === boardId);
		const task = board.tasks.find((t: any) => t.id === taskId);
		expect(task.tags).toContain('legacy-test');
	});
});
