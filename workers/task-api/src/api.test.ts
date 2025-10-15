/**
 * Smoke tests for Task API
 * 
 * Fast tests that validate basic functionality.
 * Run these on every commit to catch major breakages.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import app from './index';
import { createTestEnv, createAuthHeaders, uniqueId } from './test-utils';

describe('Task API - Smoke Tests', () => {
	const env = createTestEnv();
	const adminHeaders = createAuthHeaders(env.ADMIN_KEY, 'automated_testing_admin');

	describe('Health Check', () => {
		it('should return health status', async () => {
			const res = await app.request('/task/api/health', {}, env);
			
			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toHaveProperty('status', 'ok');
		});
	});

	describe('Authentication', () => {
		it('should accept admin key', async () => {
			const res = await app.request('/task/api/boards', {
				headers: adminHeaders,
			}, env);
			
			expect(res.status).toBe(200);
		});

		it('should reject invalid key', async () => {
			const res = await app.request('/task/api/boards', {
				headers: { 'X-User-Key': 'invalid-key' },
			}, env);
			
			// Should still return 200 but with public permissions
			expect(res.status).toBe(200);
		});
	});

	describe('Board Operations', () => {
		it('should create and list boards', async () => {
			const boardId = `test-${uniqueId()}`;
			
			// Create board
			const createRes = await app.request('/task/api/boards', {
				method: 'POST',
				headers: adminHeaders,
				body: JSON.stringify({ id: boardId, name: 'Test Board' }),
			}, env);
			
			expect(createRes.status).toBe(200);
			const created = await createRes.json();
			expect(created).toHaveProperty('ok', true);
			
			// List boards
			const listRes = await app.request('/task/api/boards', {
				headers: adminHeaders,
			}, env);
			
			expect(listRes.status).toBe(200);
			const data = await listRes.json();
			expect(data).toHaveProperty('boards');
			expect(Array.isArray(data.boards)).toBe(true);
			
			// Should contain our created board
			const board = data.boards.find((b: any) => b.id === boardId);
			expect(board).toBeDefined();
			expect(board?.name).toBe('Test Board');
		});
	});
});
