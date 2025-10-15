/**
 * Task Movement Tests
 * 
 * Tests moving tasks between boards.
 */
import { describe, it, expect } from 'vitest';
import app from './index';
import { 
	createTestEnv, 
	createAuthHeaders, 
	createBoard,
	createTask,
	batchMoveTasks,
	getBoards,
	deleteBoard,
	deleteTask,
	uniqueId 
} from './test-utils';

describe('Task Movement Tests', () => {
	const env = createTestEnv();
	const adminHeaders = createAuthHeaders(env.ADMIN_KEY, 'automated_testing_admin');

	it('should move task between boards', async () => {
		const mainBoard = 'main';
		const testBoard2 = 'testBoard2';

		// Setup: Ensure main board exists
		await createBoard(app, env, adminHeaders, mainBoard, 'Main');

		// 1. Create task in main board
		const taskId = `task-${uniqueId()}`;
		const createRes = await createTask(app, env, adminHeaders, mainBoard, taskId, 'Movement Test Task');
		expect(createRes.status).toBe(200);

		// 2. Move task to new board 'testBoard2'
		// First create testBoard2
		await createBoard(app, env, adminHeaders, testBoard2, 'Test Board 2');

		// Move task using batch-move endpoint
		const moveRes = await batchMoveTasks(app, env, adminHeaders, mainBoard, testBoard2, [taskId]);
		expect(moveRes.status).toBe(200);

		// Verify task is in testBoard2
		let boardsRes = await getBoards(app, env, adminHeaders);
		let boardsData: any = await boardsRes.json();
		let board2 = boardsData.boards.find((b: any) => b.id === testBoard2);
		expect(board2.tasks.find((t: any) => t.id === taskId)).toBeDefined();

		// 3. Move task back to 'main' board
		const moveBackRes = await batchMoveTasks(app, env, adminHeaders, testBoard2, mainBoard, [taskId]);
		expect(moveBackRes.status).toBe(200);

		// Verify task is back in main
		boardsRes = await getBoards(app, env, adminHeaders);
		boardsData = await boardsRes.json();
		const mainBoardData = boardsData.boards.find((b: any) => b.id === mainBoard);
		expect(mainBoardData.tasks.find((t: any) => t.id === taskId)).toBeDefined();

		// 4. Delete 'testBoard2'
		const deleteBoardRes = await deleteBoard(app, env, adminHeaders, testBoard2);
		expect(deleteBoardRes.status).toBe(200);

		// 5. Delete task
		const deleteTaskRes = await deleteTask(app, env, adminHeaders, taskId, mainBoard);
		expect(deleteTaskRes.status).toBe(200);
	});
});
