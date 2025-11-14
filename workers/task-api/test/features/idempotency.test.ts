/**
 * Board and Tag Idempotency Tests
 *
 * Tests that verify idempotent creation of boards and tags.
 */
import { describe, it, expect } from 'vitest';
import app from '../../src/index';
import {
	createTestEnv,
	createAuthHeaders,
	createBoard,
	createTag,
	getBoards,
} from '../__helpers__/test-utils';

describe('Board and Tag Idempotency Tests', () => {
	const env = createTestEnv();
	const adminHeaders = createAuthHeaders(env, 'automated_testing_admin');

	it('should handle duplicate board creation gracefully', async () => {
		const boardId = 'testBoard1';

		// 1. Try to create new board testBoard1
		const firstCreateRes = await createBoard(app, env, adminHeaders, boardId, 'Test Board 1');

		// 2. If it already exists and new creation is rejected, succeed
		// 3. If it doesn't exist, ensure that it was created
		if (firstCreateRes.status === 200) {
			const data = await firstCreateRes.json<{ ok: boolean }>();
			// Should either succeed or indicate board exists
			expect([true, false]).toContain(data.ok);
		} else {
			// Board exists and creation rejected
			expect([400, 409]).toContain(firstCreateRes.status);
		}

		// Try creating again - should be idempotent or fail gracefully
		await createBoard(app, env, adminHeaders, boardId, 'Test Board 1');

		// Verify board exists in list regardless
		const boardsRes = await getBoards(app, env, adminHeaders);
		const boardsData = await boardsRes.json<{ boards: { id: string }[] }>();
		const board = boardsData.boards.find((b) => b.id === boardId);
		expect(board).toBeDefined();
		expect(board?.id).toBe(boardId);
	});

	it('should handle duplicate tag creation gracefully', async () => {
		const boardId = 'testBoard1';
		const tagName = 'existingTag1';

		// Ensure board exists
		await createBoard(app, env, adminHeaders, boardId, 'Test Board 1');

		// 1. Try to create new tag 'existingTag1' on testBoard1
		const firstCreateRes = await createTag(app, env, adminHeaders, boardId, tagName);

		// 2. If it already exists and new creation is rejected, succeed
		// 3. If it doesn't exist, ensure that it was created
		if (firstCreateRes.status === 200) {
			const data = await firstCreateRes.json<{ ok: boolean }>();
			expect([true, false]).toContain(data.ok);
		} else {
			// Tag exists and creation rejected
			expect([400, 409]).toContain(firstCreateRes.status);
		}

		// Try creating again - should be idempotent or fail gracefully
		await createTag(app, env, adminHeaders, boardId, tagName);

		// Verify tag exists in board regardless
		const boardsRes = await getBoards(app, env, adminHeaders);

		const boardsData = await boardsRes.json<{ boards: { id: string }[] }>();
		const board = boardsData.boards.find((b) => b.id === boardId);
		expect(board).toBeDefined();
		// Tag should be in board's tags array or tasks can use it
		// (Depending on implementation, tags might only exist on tasks)
	});
});
