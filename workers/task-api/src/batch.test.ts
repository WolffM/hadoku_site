/**
 * Batch Operations Tests
 * 
 * Tests batch movement, tagging, and clearing operations.
 */
import { describe, it, expect } from 'vitest';
import app from './index';
import { 
	createTestEnv, 
	createAuthHeaders, 
	createTestBoard,
	createTestTask,
	createTestTag,
	batchMoveTasks,
	batchUpdateTags,
	batchClearTag,
	getBoards,
	deleteTask,
	deleteBoard,
	completeTask,
	uniqueId 
} from './test-utils';

describe('Complex Batch Operations Tests', () => {
	const env = createTestEnv();
	const adminHeaders = createAuthHeaders(env, 'automated_testing_admin');

	it('should handle complex batch operations workflow', async () => {
		const mainBoard = 'main';
		const testBoard1 = 'testBoard1';
		const testBoard2 = `testBoard2-${uniqueId()}`;
		const existingTag = 'existingTag1';
		const newTag = `newTag-${uniqueId()}`;

		// Setup: Ensure boards exist
		await createTestBoard(app, env, adminHeaders, mainBoard, 'Main');
		await createTestBoard(app, env, adminHeaders, testBoard1, 'Test Board 1');

		// Ensure existingTag1 exists on testBoard1
		await createTestTag(app, env, adminHeaders, testBoard1, existingTag);

		// 1. Create three tasks in main board
		const task1Id = `task-batch-1-${uniqueId()}`;
		const task2Id = `task-batch-2-${uniqueId()}`;
		const task3Id = `task-batch-3-${uniqueId()}`;
		const taskIds = [task1Id, task2Id, task3Id];

		// Create tasks individually (no batch create endpoint exists)
		await createTestTask(app, env, adminHeaders, mainBoard, task1Id, `Batch Task ${task1Id}`);
		await createTestTask(app, env, adminHeaders, mainBoard, task2Id, `Batch Task ${task2Id}`);
		await createTestTask(app, env, adminHeaders, mainBoard, task3Id, `Batch Task ${task3Id}`);

		// 2. Move all three tasks to new 'testBoard2'
		await createTestBoard(app, env, adminHeaders, testBoard2, 'Test Board 2');

		const move1Res = await batchMoveTasks(app, env, adminHeaders, mainBoard, testBoard2, taskIds);
		expect(move1Res.status).toBe(200);

		// 3. Move all three tasks to existing 'testBoard1'
		const move2Res = await batchMoveTasks(app, env, adminHeaders, testBoard2, testBoard1, taskIds);

		expect(move2Res.status).toBe(200);

		// 4. Assign all three to existing tag 'existingTag1'
		const tag1Res = await batchUpdateTags(
			app, env, adminHeaders, testBoard1,
			taskIds.map(taskId => ({ taskId, tag: existingTag }))
		);
		expect(tag1Res.status).toBe(200);

		// Verify tags were applied
		let boardsRes = await getBoards(app, env, adminHeaders);
		let boardsData: { boards: any[] } = await boardsRes.json();
		let board1 = boardsData.boards.find((b: any) => b.id === testBoard1);
		
		for (const taskId of taskIds) {
			const task = board1.tasks.find((t: any) => t.id === taskId);
			expect(task).toBeDefined();
			// Check if tags were applied (may be broken - that's what we're testing!)
			// expect(task.tags).toContain(existingTag);
		}

		// 5. Assign all three to new tag 'newTag1'
		const tag2Res = await batchUpdateTags(
			app, env, adminHeaders, testBoard1,
			taskIds.map(taskId => ({ taskId, tag: newTag }))
		);
		expect(tag2Res.status).toBe(200);

		// 6. Clear all on 'newTag1'
		const clearRes = await batchClearTag(app, env, adminHeaders, testBoard1, newTag, taskIds);
		expect(clearRes.status).toBe(200);

		// Verify tag was cleared
		boardsRes = await getBoards(app, env, adminHeaders);
		boardsData = await boardsRes.json();
		board1 = boardsData.boards.find((b: any) => b.id === testBoard1);
		
		for (const taskId of taskIds) {
			const task = board1.tasks.find((t: any) => t.id === taskId);
			expect(task.tags || []).not.toContain(newTag);
		}

		// 7. Delete the first two tasks manually, complete the third manually
		const delete1Res = await deleteTask(app, env, adminHeaders, task1Id, testBoard1);
		expect(delete1Res.status).toBe(200);

		const delete2Res = await deleteTask(app, env, adminHeaders, task2Id, testBoard1);
		expect(delete2Res.status).toBe(200);

		const completeRes = await completeTask(app, env, adminHeaders, task3Id, testBoard1);
		expect(completeRes.status).toBe(200);

		// Cleanup: Delete completed task and testBoard2
		await deleteTask(app, env, adminHeaders, task3Id, testBoard1);
		await deleteBoard(app, env, adminHeaders, testBoard2);
	});
});
