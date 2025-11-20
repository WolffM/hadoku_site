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
			const data = await response.json();
			expect(data.submissions).toHaveLength(2);
			expect(data.total).toBe(2);
			expect(data.submissions[0].id).toBeDefined();
		});

		it('GET /contact/api/admin/submissions/:id - should get single submission', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/submissions/sub-1', {
				method: 'GET',
				headers: adminHeaders,
			});

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.id).toBe('sub-1');
			expect(data.email).toBe('user1@example.com');
		});

		it('PUT /contact/api/admin/submissions/:id - should update submission status in D1', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/submissions/sub-1', {
				method: 'PUT',
				headers: adminHeaders,
				body: {
					status: 'archived',
				},
			});

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.message).toContain('updated');

			// Verify D1 update
			const submissions = mockDB._getSubmissions();
			const updated = submissions.find((s) => s.id === 'sub-1');
			expect(updated?.status).toBe('archived');
		});

		it('DELETE /contact/api/admin/submissions/:id - should delete submission from D1', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/submissions/sub-1', {
				method: 'DELETE',
				headers: adminHeaders,
			});

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.message).toContain('deleted');

			// Verify D1 deletion
			const submissions = mockDB._getSubmissions();
			expect(submissions.find((s) => s.id === 'sub-1')).toBeUndefined();
			expect(submissions).toHaveLength(1);
		});

		it('should require admin authentication for all submission endpoints', async () => {
			const endpoints = [
				{ method: 'GET', path: '/contact/api/admin/submissions' },
				{ method: 'GET', path: '/contact/api/admin/submissions/sub-1' },
				{ method: 'PUT', path: '/contact/api/admin/submissions/sub-1' },
				{ method: 'DELETE', path: '/contact/api/admin/submissions/sub-1' },
			];

			for (const endpoint of endpoints) {
				const response = await makeRequest(worker, env, endpoint.path, {
					method: endpoint.method,
					headers: { 'Content-Type': 'application/json' },
					body: endpoint.method === 'PUT' ? { status: 'read' } : undefined,
				});

				expect(response.status).toBe(403);
				const data = await response.json();
				expect(data.message).toContain('Admin access required');
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
			const data = await response.json();
			expect(data.whitelist).toHaveLength(1);
			expect(data.whitelist[0].email).toBe('whitelisted@example.com');
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

			expect(response.status).toBe(201);
			const data = await response.json();
			expect(data.message).toContain('added');

			// Verify D1 insertion
			const whitelist = mockDB._getWhitelist();
			expect(whitelist).toHaveLength(2);
			const newEntry = whitelist.find((w) => w.email === 'newuser@example.com');
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
			const data = await response.json();
			expect(data.message).toContain('removed');

			// Verify D1 deletion
			const whitelist = mockDB._getWhitelist();
			expect(whitelist).toHaveLength(0);
		});

		it('should prevent adding duplicate email to whitelist', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/whitelist', {
				method: 'POST',
				headers: adminHeaders,
				body: {
					email: 'whitelisted@example.com',
					notes: 'Duplicate attempt',
				},
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.message).toContain('already whitelisted');

			// Verify no duplicate in D1
			const whitelist = mockDB._getWhitelist();
			expect(whitelist).toHaveLength(1);
		});

		it('should require admin authentication for whitelist endpoints', async () => {
			const endpoints = [
				{ method: 'GET', path: '/contact/api/admin/whitelist' },
				{ method: 'POST', path: '/contact/api/admin/whitelist' },
				{ method: 'DELETE', path: '/contact/api/admin/whitelist/test@example.com' },
			];

			for (const endpoint of endpoints) {
				const response = await makeRequest(worker, env, endpoint.path, {
					method: endpoint.method,
					headers: { 'Content-Type': 'application/json' },
					body: endpoint.method === 'POST' ? { email: 'test@example.com' } : undefined,
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
			const data = await response.json();
			expect(data.message).toContain('sent');
			expect(data.messageId).toBe('test-message-id');

			// Verify auto-whitelisting in D1
			const whitelist = mockDB._getWhitelist();
			const autoWhitelisted = whitelist.find((w) => w.email === 'newrecipient@example.com');
			expect(autoWhitelisted).toBeDefined();
			expect(autoWhitelisted?.notes).toContain('Auto-whitelisted');
		});

		it('should not duplicate whitelist entry for already whitelisted email', async () => {
			// Pre-add to whitelist
			const whitelist = mockDB._getTables().whitelist;
			whitelist.set('existing@example.com', {
				email: 'existing@example.com',
				whitelisted_at: Date.now(),
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

			// Verify no duplicate in D1
			const whitelistAfter = mockDB._getWhitelist();
			expect(whitelistAfter).toHaveLength(1);
			expect(whitelistAfter[0].notes).toBe('Manual entry'); // Original notes preserved
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
			const data = await response.json();
			expect(data.errors).toBeDefined();

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
				time: '14:00',
				platform: 'zoom',
				notes: 'Project discussion',
				status: 'pending',
				meeting_link: 'https://zoom.us/j/123',
				created_at: Date.now(),
			});
			appointments.set('apt-2', {
				id: 'apt-2',
				name: 'Meeting Two',
				email: 'meeting2@example.com',
				date: '2025-12-16',
				time: '10:00',
				platform: 'google-meet',
				notes: 'Review session',
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
			const data = await response.json();
			expect(data.appointments).toHaveLength(2);
		});

		it('PUT /contact/api/admin/appointments/:id - should update appointment status in D1', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/appointments/apt-1', {
				method: 'PUT',
				headers: adminHeaders,
				body: {
					status: 'confirmed',
				},
			});

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.message).toContain('updated');

			// Verify D1 update
			const appointments = mockDB._getAppointments();
			const updated = appointments.find((a) => a.id === 'apt-1');
			expect(updated?.status).toBe('confirmed');
		});

		it('DELETE /contact/api/admin/appointments/:id - should cancel appointment in D1', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/appointments/apt-1', {
				method: 'DELETE',
				headers: adminHeaders,
			});

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.message).toContain('cancelled');

			// Verify status update in D1 (soft delete)
			const appointments = mockDB._getAppointments();
			const cancelled = appointments.find((a) => a.id === 'apt-1');
			expect(cancelled?.status).toBe('cancelled');
		});

		it('should require admin authentication for appointment endpoints', async () => {
			const endpoints = [
				{ method: 'GET', path: '/contact/api/admin/appointments' },
				{ method: 'PUT', path: '/contact/api/admin/appointments/apt-1' },
				{ method: 'DELETE', path: '/contact/api/admin/appointments/apt-1' },
			];

			for (const endpoint of endpoints) {
				const response = await makeRequest(worker, env, endpoint.path, {
					method: endpoint.method,
					headers: { 'Content-Type': 'application/json' },
					body: endpoint.method === 'PUT' ? { status: 'confirmed' } : undefined,
				});

				expect(response.status).toBe(403);
			}
		});
	});

	describe('Appointment Configuration Management', () => {
		beforeEach(() => {
			// Initialize default config
			const config = mockDB._getTables().appointmentConfig;
			config.set('default', {
				id: '1',
				timezone: 'America/New_York',
				start_hour: 9,
				end_hour: 17,
				available_days: '1,2,3,4,5',
				platforms: 'zoom,google-meet',
				advance_notice_hours: 24,
			});
		});

		it('GET /contact/api/admin/appointments/config - should get current configuration', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/appointments/config', {
				method: 'GET',
				headers: adminHeaders,
			});

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.timezone).toBe('America/New_York');
			expect(data.start_hour).toBe(9);
			expect(data.end_hour).toBe(17);
			expect(data.available_days).toBe('1,2,3,4,5');
		});

		it('PUT /contact/api/admin/appointments/config - should update configuration in D1', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/appointments/config', {
				method: 'PUT',
				headers: adminHeaders,
				body: {
					timezone: 'America/Los_Angeles',
					start_hour: 8,
					end_hour: 18,
					available_days: '1,2,3,4,5,6',
					platforms: 'zoom,google-meet,teams',
					advance_notice_hours: 48,
				},
			});

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.message).toContain('updated');

			// Verify D1 update
			const configTables = mockDB._getTables().appointmentConfig;
			const updated = configTables.get('default');
			expect(updated.timezone).toBe('America/Los_Angeles');
			expect(updated.start_hour).toBe(8);
			expect(updated.end_hour).toBe(18);
			expect(updated.available_days).toBe('1,2,3,4,5,6');
			expect(updated.advance_notice_hours).toBe(48);
		});

		it('should validate configuration values', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/appointments/config', {
				method: 'PUT',
				headers: adminHeaders,
				body: {
					start_hour: 25, // Invalid hour
					end_hour: 17,
				},
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.errors).toBeDefined();

			// Verify D1 not updated with invalid data
			const configTables = mockDB._getTables().appointmentConfig;
			const config = configTables.get('default');
			expect(config.start_hour).toBe(9); // Original value preserved
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
			// Pre-populate with test data
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

			const appointments = mockDB._getTables().appointments;
			appointments.set('apt-1', {
				id: 'apt-1',
				status: 'pending',
				created_at: Date.now(),
			});
			appointments.set('apt-2', {
				id: 'apt-2',
				status: 'confirmed',
				created_at: Date.now(),
			});

			const whitelist = mockDB._getTables().whitelist;
			whitelist.set('user@example.com', {
				email: 'user@example.com',
				whitelisted_at: Date.now(),
			});
		});

		it('GET /contact/api/admin/stats - should return statistics from D1', async () => {
			const response = await makeRequest(worker, env, '/contact/api/admin/stats', {
				method: 'GET',
				headers: adminHeaders,
			});

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.submissions.total).toBe(2);
			expect(data.appointments.total).toBe(2);
			expect(data.whitelist.total).toBe(1);
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
