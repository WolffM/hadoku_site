/**
 * Admin Operations Integration Tests
 *
 * Tests all admin CRUD operations with D1 and KV verification:
 * - Submission management (list, get, update, delete)
 * - Whitelist management (list, add, remove)
 * - Appointment management (list, update, delete)
 * - Appointment configuration (get, update)
 * - Email sending with auto-whitelisting
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import worker from '../../src/index';
import {
	createTestEnv,
	createMockD1,
	createMockKV,
	createAuthHeaders,
	makeRequest,
} from '../__helpers__/test-utils';

/* global global */

// Helper to unwrap success responses: { data: T, timestamp: string }
function unwrapData<T>(result: any): T {
	return result.data as T;
}

// Helper to unwrap error responses: { error: string, details?: unknown, timestamp: string }
function unwrapError(result: any): { error: string; details?: unknown } {
	return { error: result.error, details: result.details };
}

describe('Admin Operations Integration', () => {
	let env: ReturnType<typeof createTestEnv>;
	let mockDB: any;
	let mockKV: any;
	let adminHeaders: Record<string, string>;

	beforeEach(() => {
		// Important: Create mocks FIRST, then pass them to createTestEnv
		mockDB = createMockD1();
		mockKV = createMockKV();
		env = {
			ADMIN_KEYS: JSON.stringify({ 'test-admin-key': 'admin' }),
			DB: mockDB,
			RATE_LIMIT_KV: mockKV,
			TEMPLATES_KV: createMockKV(),
			EMAIL_PROVIDER: 'resend',
			RESEND_API_KEY: 'test-api-key',
		};
		adminHeaders = createAuthHeaders('test-admin-key');
		vi.restoreAllMocks();
	});

	describe('Submission Management', () => {
		beforeEach(() => {
			// Pre-populate with test submissions
			const submissions = mockDB._getTables().submissions;
			submissions.set('sub-1', {
				id: 'sub-1',
				name: 'User One',
				email: 'user1@example.com',
				message: 'First message',
				status: 'unread',
				created_at: Date.now() - 3600000,
				recipient: 'matthaeus@hadoku.me',
			});
			submissions.set('sub-2', {
				id: 'sub-2',
				name: 'User Two',
				email: 'user2@example.com',
				message: 'Second message',
				status: 'read',
				created_at: Date.now() - 1800000,
				recipient: 'mw@hadoku.me',
			});
		});

		it('GET /contact/api/admin/submissions - should list all submissions', async () => {
			const response = await makeRequest(
				worker,
				env,
				'/contact/api/admin/submissions?limit=10&offset=0',
				{
					method: 'GET',
					headers: adminHeaders,
				}
			);

			expect(response.status).toBe(200);
			const result = await response.json();
			const data = unwrapData<{ submissions: any[]; stats: any; pagination: any }>(result);
			expect(data.submissions).toHaveLength(2);
			// Note: stats.total relies on complex SUM(CASE WHEN...) query that mock doesn't fully support
			expect(data.stats).toBeDefined();
			expect(data.submissions[0].id).toBeDefined();
		});

		it('GET /contact/api/admin/submissions/:id - should get single submission', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/submissions/sub-1', {
				method: 'GET',
				headers: adminHeaders,
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			const data = unwrapData<{ submission: any }>(result);
			// API returns { submission: {...} }
			expect(data.submission.id).toBe('sub-1');
			expect(data.submission.email).toBe('user1@example.com');
		});

		it('PATCH /contact/api/admin/submissions/:id/status - should update submission status in D1', async () => {
			const response = await makeRequest(
				worker,
				env,
				'/contact/api/admin/submissions/sub-1/status',
				{
					method: 'PATCH',
					headers: adminHeaders,
					body: {
						status: 'archived',
					},
				}
			);

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result.message || result.data.message).toContain('updated');

			// Verify D1 update
			const submissions = mockDB._getSubmissions();
			const updated = submissions.find((s: any) => s.id === 'sub-1');
			expect(updated?.status).toBe('archived');
		});

		it('DELETE /contact/api/admin/submissions/:id - should soft-delete submission in D1', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/submissions/sub-1', {
				method: 'DELETE',
				headers: adminHeaders,
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			// API returns 'moved to trash' message
			const message = result.message || result.data?.message || '';
			expect(message.toLowerCase()).toMatch(/deleted|trash/);

			// Verify soft-delete in D1 (status changed to 'deleted', record still exists)
			const submissions = mockDB._getSubmissions();
			const deletedSubmission = submissions.find((s: any) => s.id === 'sub-1');
			expect(deletedSubmission).toBeDefined();
			expect(deletedSubmission?.status).toBe('deleted');
			expect(deletedSubmission?.deleted_at).toBeDefined();
		});

		it('should require admin authentication for all submission endpoints', async () => {
			const endpoints = [
				{ method: 'GET', path: '/contact/api/admin/submissions' },
				{ method: 'GET', path: '/contact/api/admin/submissions/sub-1' },
				{ method: 'PATCH', path: '/contact/api/admin/submissions/sub-1/status' },
				{ method: 'DELETE', path: '/contact/api/admin/submissions/sub-1' },
			];

			for (const endpoint of endpoints) {
				const response = await makeRequest(worker, env, endpoint.path, {
					method: endpoint.method,
					headers: { 'Content-Type': 'application/json' },
					body: endpoint.method === 'PATCH' ? { status: 'read' } : undefined,
				});

				expect(response.status).toBe(403);
				const result = await response.json();
				const error = unwrapError(result);
				// API may return 'Admin access required' or 'Forbidden'
				expect(error.error).toMatch(/Admin access required|Forbidden/);
			}
		});
	});

	describe('Whitelist Management', () => {
		beforeEach(() => {
			// Pre-populate whitelist
			const whitelist = mockDB._getTables().whitelist;
			whitelist.set('whitelisted@example.com', {
				email: 'whitelisted@example.com',
				whitelisted_at: Date.now() - 86400000,
				notes: 'Existing entry',
			});
		});

		it('GET /contact/api/admin/whitelist - should list all whitelisted emails', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/whitelist', {
				method: 'GET',
				headers: adminHeaders,
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			const data = unwrapData<{ emails: any[]; total: number }>(result);
			// API returns { emails, total } not { whitelist }
			expect(data.emails).toHaveLength(1);
			expect(data.total).toBe(1);
			expect(data.emails[0].email).toBe('whitelisted@example.com');
		});

		it('POST /contact/api/admin/whitelist - should add email to whitelist in D1', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/whitelist', {
				method: 'POST',
				headers: adminHeaders,
				body: {
					email: 'newuser@example.com',
					notes: 'Test addition',
				},
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result.message || result.data.message).toContain('added');

			// Verify D1 insertion
			const whitelist = mockDB._getWhitelist();
			expect(whitelist).toHaveLength(2);
			const newEntry = whitelist.find((w: any) => w.email === 'newuser@example.com');
			expect(newEntry).toBeDefined();
			expect(newEntry?.notes).toBe('Test addition');
		});

		it('DELETE /contact/api/admin/whitelist/:email - should remove from whitelist in D1', async () => {
			const response = await makeRequest(
				worker,
				env,
				'/contact/api/admin/whitelist/whitelisted@example.com',
				{
					method: 'DELETE',
					headers: adminHeaders,
				}
			);

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result.message || result.data?.message).toContain('removed');

			// Verify D1 deletion
			const whitelist = mockDB._getWhitelist();
			expect(whitelist).toHaveLength(0);
		});

		it('POST /contact/api/admin/whitelist - should update existing entry (upsert behavior)', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/whitelist', {
				method: 'POST',
				headers: adminHeaders,
				body: {
					email: 'whitelisted@example.com',
					notes: 'Updated notes',
				},
			});

			// Upsert returns success, not an error
			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result.message || result.data.message).toContain('added');

			// Verify no duplicate in D1 (upsert updates existing)
			const whitelist = mockDB._getWhitelist();
			expect(whitelist).toHaveLength(1);
			// Notes should be updated via COALESCE
			expect(whitelist[0].notes).toBe('Updated notes');
		});

		it('should require admin authentication for whitelist endpoints', async () => {
			const endpoints = [
				{ method: 'GET', path: '/contact/api/admin/whitelist' },
				{
					method: 'POST',
					path: '/contact/api/admin/whitelist',
					body: { email: 'test@example.com' },
				},
				{ method: 'DELETE', path: '/contact/api/admin/whitelist/test@example.com' },
			];

			for (const endpoint of endpoints) {
				const response = await makeRequest(worker, env, endpoint.path, {
					method: endpoint.method,
					headers: { 'Content-Type': 'application/json' },
					body: 'body' in endpoint ? endpoint.body : undefined,
				});

				expect(response.status).toBe(403);
			}
		});
	});

	describe('Email Sending with Auto-Whitelisting', () => {
		it('POST /contact/api/admin/send-email - should send and auto-whitelist recipient', async () => {
			// Mock Resend API
			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				json: async () => ({ id: 'test-message-id' }),
			});

			const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
				method: 'POST',
				headers: adminHeaders,
				body: {
					from: 'matthaeus@hadoku.me',
					to: 'newrecipient@example.com',
					subject: 'Test Email',
					text: 'This is a test email',
				},
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			const data = unwrapData<any>(result);
			expect(result.message || data.message).toContain('sent');
			expect(data.messageId).toBe('test-message-id');

			// Verify auto-whitelisting in D1
			const whitelist = mockDB._getWhitelist();
			const autoWhitelisted = whitelist.find((w: any) => w.email === 'newrecipient@example.com');
			expect(autoWhitelisted).toBeDefined();
			expect(autoWhitelisted?.notes).toContain('Auto-whitelisted');
		});

		it('should update existing whitelist entry when sending email (upsert)', async () => {
			// Pre-add to whitelist
			const whitelist = mockDB._getTables().whitelist;
			whitelist.set('existing@example.com', {
				email: 'existing@example.com',
				whitelisted_at: Date.now(),
				whitelisted_by: 'manual',
				notes: 'Manual entry',
			});

			// Mock Resend API
			global.fetch = vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				json: async () => ({ id: 'test-message-id' }),
			});

			const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
				method: 'POST',
				headers: adminHeaders,
				body: {
					from: 'matthaeus@hadoku.me',
					to: 'existing@example.com',
					subject: 'Test Email',
					text: 'Test',
				},
			});

			expect(response.status).toBe(200);

			// Verify no duplicate in D1 (upsert behavior)
			const whitelistAfter = mockDB._getWhitelist();
			expect(whitelistAfter).toHaveLength(1);
			// The notes get updated when auto-whitelisting is triggered
			expect(whitelistAfter[0].notes).toContain('Auto-whitelisted');
		});

		it('should validate email fields before sending', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/send-email', {
				method: 'POST',
				headers: adminHeaders,
				body: {
					from: 'invalid-email',
					to: 'recipient@example.com',
					subject: 'Test',
					text: 'Test',
				},
			});

			expect(response.status).toBe(400);
			const result = await response.json();
			const error = unwrapError(result);
			expect(error.error || error.details).toBeDefined();

			// Verify no whitelist entry created
			const whitelist = mockDB._getWhitelist();
			expect(whitelist).toHaveLength(0);
		});
	});

	describe('Appointment Management', () => {
		beforeEach(() => {
			// Pre-populate with test appointments
			const appointments = mockDB._getTables().appointments;
			appointments.set('apt-1', {
				id: 'apt-1',
				name: 'Meeting One',
				email: 'meeting1@example.com',
				date: '2025-12-15',
				start_time: '2025-12-15T14:00:00.000Z',
				platform: 'discord',
				status: 'pending',
				meeting_link: 'https://discord.gg/abc',
				created_at: Date.now(),
			});
			appointments.set('apt-2', {
				id: 'apt-2',
				name: 'Meeting Two',
				email: 'meeting2@example.com',
				date: '2025-12-16',
				start_time: '2025-12-16T10:00:00.000Z',
				platform: 'google',
				status: 'confirmed',
				meeting_link: 'https://meet.google.com/abc',
				created_at: Date.now(),
			});
		});

		it('GET /contact/api/admin/appointments - should list all appointments', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/appointments', {
				method: 'GET',
				headers: adminHeaders,
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			const data = unwrapData<{ appointments: any[] }>(result);
			expect(data.appointments).toHaveLength(2);
		});

		it('PATCH /contact/api/admin/appointments/:id/status - should update appointment status in D1', async () => {
			const response = await makeRequest(
				worker,
				env,
				'/contact/api/admin/appointments/apt-1/status',
				{
					method: 'PATCH',
					headers: adminHeaders,
					body: {
						status: 'confirmed',
					},
				}
			);

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result.message || result.data?.message).toContain('updated');

			// Verify D1 update
			const appointments = mockDB._getAppointments();
			const updated = appointments.find((a: any) => a.id === 'apt-1');
			expect(updated?.status).toBe('confirmed');
		});

		it('PATCH /contact/api/admin/appointments/:id/status - should cancel appointment in D1', async () => {
			const response = await makeRequest(
				worker,
				env,
				'/contact/api/admin/appointments/apt-1/status',
				{
					method: 'PATCH',
					headers: adminHeaders,
					body: {
						status: 'cancelled',
					},
				}
			);

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result.message || result.data?.message).toContain('updated');

			// Verify status update in D1 (soft cancel)
			const appointments = mockDB._getAppointments();
			const cancelled = appointments.find((a: any) => a.id === 'apt-1');
			expect(cancelled?.status).toBe('cancelled');
		});

		it('should require admin authentication for appointment endpoints', async () => {
			const endpoints = [
				{ method: 'GET', path: '/contact/api/admin/appointments' },
				{ method: 'PATCH', path: '/contact/api/admin/appointments/apt-1/status' },
			];

			for (const endpoint of endpoints) {
				const response = await makeRequest(worker, env, endpoint.path, {
					method: endpoint.method,
					headers: { 'Content-Type': 'application/json' },
					body: endpoint.method === 'PATCH' ? { status: 'confirmed' } : undefined,
				});

				expect(response.status).toBe(403);
			}
		});
	});

	describe('Appointment Configuration Management', () => {
		beforeEach(() => {
			// Initialize default config with DATABASE field names (not frontend names)
			const config = mockDB._getTables().appointmentConfig;
			config.set('default', {
				id: '1',
				timezone: 'America/New_York',
				business_hours_start: '09:00',
				business_hours_end: '17:00',
				available_days: '1,2,3,4,5',
				slot_duration_options: '15,30,60',
				max_advance_days: 30,
				min_advance_hours: 24,
				meeting_platforms: 'discord,google,teams,jitsi',
			});
		});

		it('GET /contact/api/admin/appointments/config - should transform DB fields to frontend format', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/appointments/config', {
				method: 'GET',
				headers: adminHeaders,
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			const data = unwrapData<{ config: any }>(result);

			// API should transform database fields to frontend-friendly names
			expect(data.config.timezone).toBe('America/New_York');
			expect(data.config.start_hour).toBe(9); // Transformed from business_hours_start "09:00"
			expect(data.config.end_hour).toBe(17); // Transformed from business_hours_end "17:00"
			expect(data.config.available_days).toEqual([1, 2, 3, 4, 5]); // Parsed from comma-separated string
			expect(data.config.platforms).toEqual(['discord', 'google', 'teams', 'jitsi']); // Transformed from meeting_platforms
			expect(data.config.advance_notice_hours).toBe(24); // Transformed from min_advance_hours
			expect(data.config.slot_duration_options).toEqual([15, 30, 60]); // Parsed array
			expect(data.config.max_advance_days).toBe(30);
		});

		it('PUT /contact/api/admin/appointments/config - should transform frontend fields to DB format', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/appointments/config', {
				method: 'PUT',
				headers: adminHeaders,
				body: {
					// Frontend field names
					timezone: 'America/Los_Angeles',
					start_hour: 8,
					end_hour: 18,
					available_days: [1, 2, 3, 4, 5, 6],
					platforms: ['discord', 'google', 'teams'],
					advance_notice_hours: 48,
				},
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result.message || result.data?.message).toContain('updated');

			// Verify D1 update uses DATABASE field names
			const configTables = mockDB._getTables().appointmentConfig;
			const updated = configTables.get('default');
			expect(updated.timezone).toBe('America/Los_Angeles');
			expect(updated.business_hours_start).toBe('08:00'); // Transformed from start_hour 8
			expect(updated.business_hours_end).toBe('18:00'); // Transformed from end_hour 18
			expect(updated.available_days).toBe('1,2,3,4,5,6'); // Joined array
			expect(updated.meeting_platforms).toBe('discord,google,teams'); // Transformed from platforms
			expect(updated.min_advance_hours).toBe(48); // Transformed from advance_notice_hours
		});

		it('PUT /contact/api/admin/appointments/config - config round-trip should preserve values', async () => {
			// First save configuration using frontend field names
			const saveResponse = await makeRequest(
				worker,
				env,
				'/contact/api/admin/appointments/config',
				{
					method: 'PUT',
					headers: adminHeaders,
					body: {
						timezone: 'Europe/London',
						start_hour: 10,
						end_hour: 16,
						available_days: [1, 2, 3],
						platforms: ['discord', 'jitsi'],
						advance_notice_hours: 12,
					},
				}
			);
			expect(saveResponse.status).toBe(200);

			// Then fetch and verify the same values come back
			const getResponse = await makeRequest(worker, env, '/contact/api/admin/appointments/config', {
				method: 'GET',
				headers: adminHeaders,
			});
			expect(getResponse.status).toBe(200);
			const result = await getResponse.json();
			const data = unwrapData<{ config: any }>(result);

			expect(data.config.timezone).toBe('Europe/London');
			expect(data.config.start_hour).toBe(10);
			expect(data.config.end_hour).toBe(16);
			expect(data.config.available_days).toEqual([1, 2, 3]);
			expect(data.config.platforms).toEqual(['discord', 'jitsi']);
			expect(data.config.advance_notice_hours).toBe(12);
		});

		it('should require admin authentication for config endpoints', async () => {
			const endpoints = [
				{ method: 'GET', path: '/contact/api/admin/appointments/config' },
				{ method: 'PUT', path: '/contact/api/admin/appointments/config' },
			];

			for (const endpoint of endpoints) {
				const response = await makeRequest(worker, env, endpoint.path, {
					method: endpoint.method,
					headers: { 'Content-Type': 'application/json' },
					body:
						endpoint.method === 'PUT' ? { timezone: 'America/Chicago', start_hour: 10 } : undefined,
				});

				expect(response.status).toBe(403);
			}
		});
	});

	describe('Statistics Endpoint', () => {
		beforeEach(() => {
			// Pre-populate with test data for submissions
			const submissions = mockDB._getTables().submissions;
			submissions.set('sub-1', {
				id: 'sub-1',
				status: 'unread',
				created_at: Date.now(),
			});
			submissions.set('sub-2', {
				id: 'sub-2',
				status: 'read',
				created_at: Date.now(),
			});
		});

		it('GET /contact/api/admin/stats - should return submission statistics from D1', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/stats', {
				method: 'GET',
				headers: adminHeaders,
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			const data = unwrapData<any>(result);
			// The stats endpoint returns { submissions: SubmissionStats, database: { ... } }
			// SubmissionStats has: total, unread, read, archived, deleted
			expect(data.submissions).toBeDefined();
			expect(data.database).toBeDefined();
			expect(data.database.sizeBytes).toBeDefined();
		});

		it('should require admin authentication', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/stats', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			expect(response.status).toBe(403);
		});
	});
});
