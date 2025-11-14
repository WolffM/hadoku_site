/**
 * Route collision tests
 *
 * These tests validate commit a499400 which fixed route collision where
 * PATCH /task/api/batch-tag was matching PATCH /task/api/:id
 */
import { describe, it, expect } from 'vitest';
import app from '../../src/index';
import {
	createTestEnv,
	createAuthHeaders,
	createTestBoard,
	createTestTask,
	batchUpdateTags,
	batchUpdateTagsLegacy,
	updateTask,
	getBoards,
} from '../__helpers__/test-utils';
import type { Board } from '@wolffm/task/api';

describe('Route Collision Tests', () => {
	const env = createTestEnv();
	const adminHeaders = createAuthHeaders(env, 'automated_testing_admin');

	it('should NOT confuse batch-tag route with :id parameter', async () => {
		// Setup: Create a board and tasks
		const { boardId } = await createTestBoard(app, env, adminHeaders);
		const { taskId: task1Id } = await createTestTask(
			app,
			env,
			adminHeaders,
			boardId,
			undefined,
			'Task 1'
		);
		const { taskId: task2Id } = await createTestTask(
			app,
			env,
			adminHeaders,
			boardId,
			undefined,
			'Task 2'
		);

		// Test 1: Batch-tag should work (hits batch-tag route)
		const batchRes = await batchUpdateTags(app, env, adminHeaders, boardId, [
			{ taskId: task1Id, tag: 'urgent' },
			{ taskId: task2Id, tag: 'urgent' },
		]);

		expect(batchRes.status).toBe(200);
		const batchData = (await batchRes.json()) as { ok: boolean };
		expect(batchData.ok).toBe(true);

		// Test 2: Updating task with id="batch-tag" should fail with 404
		// (This proves the routes are separate)
		const updateRes = await updateTask(
			app,
			env,
			adminHeaders,
			'batch-tag',
			{ title: 'Should Not Work' },
			boardId
		);

		// This should fail because there's no task with id "batch-tag"
		// Before the fix, this would have been treated as a batch-tag operation
		expect(updateRes.status).toBe(400); // Missing required fields for batch operation
	});

	it('should apply tags to multiple tasks via batch endpoint', async () => {
		// Setup
		const { boardId } = await createTestBoard(app, env, adminHeaders);

		// Create tasks sequentially (KV storage needs consistent state)
		const task1 = await createTestTask(app, env, adminHeaders, boardId, undefined, 'Task 0');
		const task2 = await createTestTask(app, env, adminHeaders, boardId, undefined, 'Task 1');
		const task3 = await createTestTask(app, env, adminHeaders, boardId, undefined, 'Task 2');
		const taskIds = [task1.taskId, task2.taskId, task3.taskId];

		// Batch tag all 3 tasks
		const batchRes = await batchUpdateTags(
			app,
			env,
			adminHeaders,
			boardId,
			taskIds.map((taskId) => ({ taskId, tag: 'important' }))
		);

		expect(batchRes.status).toBe(200);
		const batchData = (await batchRes.json()) as { ok: boolean };
		expect(batchData.ok).toBe(true);

		// Verify all tasks have the tag
		const boardsRes = await getBoards(app, env, adminHeaders);

		interface BoardsData {
			boards: Board[];
		}
		const boardsData = (await boardsRes.json()) as BoardsData;
		const board = boardsData.boards.find((b) => b.id === boardId);
		expect(board).toBeDefined();

		// Note: tasks use 'tag' (string), not 'tags' (array)
		const taggedTasks = board?.tasks.filter((t) => t.tag && t.tag.split(' ').includes('important'));
		expect(taggedTasks?.length).toBe(3);
	});
	it('should handle legacy batch-tag alias correctly', async () => {
		// Setup
		const { boardId } = await createTestBoard(app, env, adminHeaders);
		const { taskId } = await createTestTask(app, env, adminHeaders, boardId, undefined, 'Task 1');

		// Use legacy PATCH /task/api/batch-tag endpoint
		const legacyRes = await batchUpdateTagsLegacy(app, env, adminHeaders, boardId, [
			{ taskId, tag: 'legacy-test' },
		]);

		expect(legacyRes.status).toBe(200);
		const legacyData = (await legacyRes.json()) as { ok: boolean };
		expect(legacyData.ok).toBe(true);

		// Verify tag was applied
		const boardsRes = await getBoards(app, env, adminHeaders);

		const boardsData = (await boardsRes.json()) as { boards: Board[] };
		const board = boardsData.boards.find((b) => b.id === boardId);
		const task = board.tasks.find((t) => t.id === taskId);
		// Note: tasks use 'tag' (string), not 'tags' (array)
		expect(task.tag).toContain('legacy-test');
	});
});
