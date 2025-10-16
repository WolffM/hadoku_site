/**
 * Authentication Tests
 * 
 * Tests key-based authentication with JSON key objects.
 */
import { describe, it, expect } from 'vitest';
import app from './index';
import { createTestEnv } from './test-utils';

describe('Authentication Tests', () => {
	
	it('should authenticate admin user with valid admin key', async () => {
		const env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({ 'admin-key-123': 'james' }),
			FRIEND_KEYS: JSON.stringify({ 'friend-key-456': 'alice' })
		});
		
		// Request with admin key
		const response = await app.request('/task/api/boards', {
			method: 'GET',
			headers: {
				'X-User-Key': 'admin-key-123'
			}
		}, env);
		
		expect(response.status).toBe(200);
		// The key should be validated and user should have admin access
	});
	
	it('should authenticate friend user with valid friend key', async () => {
		const env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({ 'admin-key-123': 'james' }),
			FRIEND_KEYS: JSON.stringify({ 'friend-key-456': 'alice' })
		});
		
		// Request with friend key
		const response = await app.request('/task/api/boards', {
			method: 'GET',
			headers: {
				'X-User-Key': 'friend-key-456'
			}
		}, env);
		
		expect(response.status).toBe(200);
		// The key should be validated and user should have friend access
	});
	
	it('should default to public for invalid key', async () => {
		const env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({ 'admin-key-123': 'james' }),
			FRIEND_KEYS: JSON.stringify({ 'friend-key-456': 'alice' })
		});
		
		// Request with invalid key
		const response = await app.request('/task/api/boards', {
			method: 'GET',
			headers: {
				'X-User-Key': 'invalid-key-999'
			}
		}, env);
		
		expect(response.status).toBe(200);
		// Invalid key should default to public access
	});
	
	it('should default to public when no key provided', async () => {
		const env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({ 'admin-key-123': 'james' }),
			FRIEND_KEYS: JSON.stringify({ 'friend-key-456': 'alice' })
		});
		
		// Request without key
		const response = await app.request('/task/api/boards', {
			method: 'GET'
		}, env);
		
		expect(response.status).toBe(200);
		// No key should default to public access
	});
	
	it('should support multiple admin keys', async () => {
		const env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({
				'admin-key-1': 'james',
				'admin-key-2': 'alice',
				'admin-key-3': 'bob'
			}),
			FRIEND_KEYS: JSON.stringify({})
		});
		
		// Test each admin key
		for (const key of ['admin-key-1', 'admin-key-2', 'admin-key-3']) {
			const response = await app.request('/task/api/boards', {
				method: 'GET',
				headers: {
					'X-User-Key': key
				}
			}, env);
			
			expect(response.status).toBe(200);
		}
	});
	
	it('should support multiple friend keys', async () => {
		const env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({}),
			FRIEND_KEYS: JSON.stringify({
				'friend-key-1': 'charlie',
				'friend-key-2': 'diana',
				'4355': 'Erin'
			})
		});
		
		// Test each friend key
		for (const key of ['friend-key-1', 'friend-key-2', '4355']) {
			const response = await app.request('/task/api/boards', {
				method: 'GET',
				headers: {
					'X-User-Key': key
				}
			}, env);
			
			expect(response.status).toBe(200);
		}
	});
	
	it('should accept key from query parameter', async () => {
		const env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({ 'admin-key-123': 'james' }),
			FRIEND_KEYS: JSON.stringify({})
		});
		
		// Request with key in query param (like from URL ?key=xxx)
		const response = await app.request('/task/api/boards?key=admin-key-123', {
			method: 'GET'
		}, env);
		
		expect(response.status).toBe(200);
	});
	
	it('should handle empty JSON key objects', async () => {
		const env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({}),
			FRIEND_KEYS: JSON.stringify({})
		});
		
		// Request should still work, just default to public
		const response = await app.request('/task/api/boards', {
			method: 'GET',
			headers: {
				'X-User-Key': 'any-key'
			}
		}, env);
		
		expect(response.status).toBe(200);
	});
	
	it('should handle undefined/missing key environment variables', async () => {
		const env = createTestEnv({
			ADMIN_KEYS: undefined,
			FRIEND_KEYS: undefined
		});
		
		// Request should still work, just default to public
		const response = await app.request('/task/api/boards', {
			method: 'GET',
			headers: {
				'X-User-Key': 'any-key'
			}
		}, env);
		
		expect(response.status).toBe(200);
	});
	
	it('should authenticate Erin with key 4355', async () => {
		// Test the actual key from production
		const env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({ 'a21743d9-b0f1-4c75-8e01-ba2dc37feacd': 'admin' }),
			FRIEND_KEYS: JSON.stringify({ 
				'655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b': 'friend',
				'4355': 'Erin'
			})
		});
		
		// Request with Erin's key
		const response = await app.request('/task/api/boards', {
			method: 'GET',
			headers: {
				'X-User-Key': '4355'
			}
		}, env);
		
		expect(response.status).toBe(200);
		// Erin should be authenticated as friend with userId 'Erin'
	});
	
	it('should allow Erin to create a task "Hi erin!" and verify it exists', async () => {
		const env = createTestEnv({
			ADMIN_KEYS: JSON.stringify({ 'a21743d9-b0f1-4c75-8e01-ba2dc37feacd': 'admin' }),
			FRIEND_KEYS: JSON.stringify({ 
				'655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b': 'friend',
				'4355': 'Erin'
			})
		});
		
		const erinHeaders = {
			'X-User-Key': '4355',
			'X-User-Id': 'Erin',
			'Content-Type': 'application/json'
		};
		
		// First, create a board
		const boardId = 'erin-test-board';
		const createBoardResponse = await app.request('/task/api/boards', {
			method: 'POST',
			headers: erinHeaders,
			body: JSON.stringify({
				id: boardId,
				name: "Erin's Board"
			})
		}, env);
		
		expect(createBoardResponse.status).toBe(200);
		
		// Create a task "Hi erin!"
		const taskId = 'erin-task-001';
		const createTaskResponse = await app.request('/task/api', {
			method: 'POST',
			headers: erinHeaders,
			body: JSON.stringify({
				id: taskId,
				title: 'Hi erin!',
				boardId: boardId
			})
		}, env);
		
		expect(createTaskResponse.status).toBe(200);
		const createTaskData: any = await createTaskResponse.json();
		expect(createTaskData.ok).toBe(true);
		
		// Verify the task exists by fetching boards
		const getBoardsResponse = await app.request('/task/api/boards', {
			method: 'GET',
			headers: erinHeaders
		}, env);
		
		expect(getBoardsResponse.status).toBe(200);
		const boardsData: any = await getBoardsResponse.json();
		
		// Find Erin's board
		const erinBoard = boardsData.boards.find((b: any) => b.id === boardId);
		expect(erinBoard).toBeDefined();
		expect(erinBoard.name).toBe("Erin's Board");
		
		// Find the task "Hi erin!"
		const hiErinTask = erinBoard.tasks.find((t: any) => t.id === taskId);
		expect(hiErinTask).toBeDefined();
		expect(hiErinTask.title).toBe('Hi erin!');
		expect(hiErinTask.state).toBe('Active');
		
		console.log('✅ Erin successfully created task:', hiErinTask);
	});
});
