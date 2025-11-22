/**
 * Appointment Booking Integration Tests
 *
 * Tests the full appointment booking flow including:
 * - POST /contact/api/submit with appointment data
 * - Slot availability validation
 * - Double-booking prevention
 * - D1 database storage verification
 * - Timezone handling
 * - Advance booking window constraints
 * - Meeting link generation
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import worker from '../../src/index';
import { createTestEnv, createMockD1, createMockKV, makeRequest } from '../__helpers__/test-utils';

describe('Appointment Booking Integration', () => {
	let env: ReturnType<typeof createTestEnv>;
	let mockDB: any;
	let mockKV: any;

	beforeEach(() => {
		mockDB = createMockD1();
		mockKV = createMockKV();
		env = {
			ADMIN_KEYS: JSON.stringify({ 'test-admin-key': 'admin' }),
			DB: mockDB,
			RATE_LIMIT_KV: mockKV,
			TEMPLATES_KV: createMockKV(), // Add TEMPLATES_KV for email templates
			EMAIL_PROVIDER: 'resend',
			RESEND_API_KEY: 'test-api-key',
		};
		vi.restoreAllMocks();

		// Initialize appointment configuration with DATABASE field names
		const defaultConfig = {
			id: '1',
			timezone: 'America/New_York',
			business_hours_start: '09:00',
			business_hours_end: '17:00',
			available_days: '1,2,3,4,5', // Monday to Friday
			slot_duration_options: '15,30,60',
			max_advance_days: 30,
			min_advance_hours: 24,
			meeting_platforms: 'discord,google,teams,jitsi',
		};
		mockDB._getTables().appointmentConfig.set('default', defaultConfig);
	});

	describe('POST /contact/api/submit - Appointment Booking', () => {
		it('should create appointment in D1 with valid data', async () => {
			// Get a date 3 days from now (to satisfy advance notice)
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 3);
			const dateStr = futureDate.toISOString().split('T')[0];

			// Create ISO 8601 timestamps for a 30-minute slot
			const startTime = new Date(`${dateStr}T14:00:00.000Z`);
			const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
			const slotId = `slot-${dateStr}-${startTime.toISOString()}`;

			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'John Doe',
					email: 'john@example.com',
					message: 'I would like to book a meeting',
					recipient: 'matthaeus@hadoku.me',
					appointment: {
						slotId,
						date: dateStr,
						startTime: startTime.toISOString(),
						endTime: endTime.toISOString(),
						duration: 30,
						platform: 'discord',
					},
				},
			});

			expect(response.status).toBe(201);
			const data = await response.json();
			expect(data.message).toContain('appointment');

			// Verify D1 storage - both submission and appointment
			const submissions = mockDB._getSubmissions();
			expect(submissions).toHaveLength(1);
			expect(submissions[0].email).toBe('john@example.com');

			const appointments = mockDB._getAppointments();
			expect(appointments).toHaveLength(1);
			expect(appointments[0]).toMatchObject({
				name: 'John Doe',
				email: 'john@example.com',
				date: dateStr,
				start_time: startTime.toISOString(),
				end_time: endTime.toISOString(),
				duration: 30,
				platform: 'discord',
				slot_id: slotId,
			});
			expect(appointments[0].id).toBeDefined();
			expect(appointments[0].meeting_link).toBeDefined();
			expect(appointments[0].created_at).toBeDefined();
		});

		it('should generate meeting link for discord platform', async () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 3);
			const dateStr = futureDate.toISOString().split('T')[0];

			const startTime = new Date(`${dateStr}T10:00:00.000Z`);
			const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
			const slotId = `slot-${dateStr}-${startTime.toISOString()}`;

			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'Jane Smith',
					email: 'jane@example.com',
					message: 'Discord meeting request',
					recipient: 'matthaeus@hadoku.me',
					appointment: {
						slotId,
						date: dateStr,
						startTime: startTime.toISOString(),
						endTime: endTime.toISOString(),
						duration: 30,
						platform: 'discord',
					},
				},
			});

			expect(response.status).toBe(201);

			const appointments = mockDB._getAppointments();
			expect(appointments[0].meeting_link).toBeDefined();
			expect(appointments[0].platform).toBe('discord');
		});

		it('should handle multiple appointments on different days', async () => {
			const dates = [2, 3, 4].map((days) => {
				const date = new Date();
				date.setDate(date.getDate() + days);
				return date.toISOString().split('T')[0];
			});

			for (let i = 0; i < dates.length; i++) {
				const startTime = new Date(`${dates[i]}T14:00:00.000Z`);
				const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
				const slotId = `slot-${dates[i]}-${startTime.toISOString()}`;

				const response = await makeRequest(worker, env, '/contact/api/submit', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Forwarded-For': '203.0.113.1',
						Referer: 'https://hadoku.me/contact',
					},
					body: {
						name: `User ${i}`,
						email: `user${i}@example.com`,
						message: 'Meeting request',
						recipient: 'matthaeus@hadoku.me',
						appointment: {
							slotId,
							date: dates[i],
							startTime: startTime.toISOString(),
							endTime: endTime.toISOString(),
							duration: 30,
							platform: 'discord',
						},
					},
				});

				expect(response.status).toBe(201);
			}

			// Verify all appointments in D1
			const appointments = mockDB._getAppointments();
			expect(appointments).toHaveLength(3);
			expect(new Set(appointments.map((a) => a.date)).size).toBe(3);
		});
	});

	describe('Slot Availability Validation', () => {
		it('should prevent double-booking same time slot', async () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 3);
			const dateStr = futureDate.toISOString().split('T')[0];

			const startTime = new Date(`${dateStr}T14:00:00.000Z`);
			const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
			const slotId = `slot-${dateStr}-${startTime.toISOString()}`;

			// First booking
			const response1 = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'User One',
					email: 'user1@example.com',
					message: 'First booking',
					recipient: 'matthaeus@hadoku.me',
					appointment: {
						slotId,
						date: dateStr,
						startTime: startTime.toISOString(),
						endTime: endTime.toISOString(),
						duration: 30,
						platform: 'discord',
					},
				},
			});
			expect(response1.status).toBe(201);

			// Attempt to book same slot (same slotId)
			const response2 = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.2',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'User Two',
					email: 'user2@example.com',
					message: 'Second booking attempt',
					recipient: 'matthaeus@hadoku.me',
					appointment: {
						slotId, // Same slotId as first booking
						date: dateStr,
						startTime: startTime.toISOString(),
						endTime: endTime.toISOString(),
						duration: 30,
						platform: 'google',
					},
				},
			});

			expect(response2.status).toBe(409);
			const data = await response2.json();
			expect(data.message).toContain('booked');

			// Verify only one appointment in D1
			const appointments = mockDB._getAppointments();
			expect(appointments).toHaveLength(1);
			expect(appointments[0].email).toBe('user1@example.com');
		});

		it('should allow booking different time slots on same day', async () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 3);
			const dateStr = futureDate.toISOString().split('T')[0];

			// First booking at 10:00
			const startTime1 = new Date(`${dateStr}T10:00:00.000Z`);
			const endTime1 = new Date(startTime1.getTime() + 30 * 60 * 1000);
			const slotId1 = `slot-${dateStr}-${startTime1.toISOString()}`;

			const response1 = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'User One',
					email: 'user1@example.com',
					message: 'Morning meeting',
					recipient: 'matthaeus@hadoku.me',
					appointment: {
						slotId: slotId1,
						date: dateStr,
						startTime: startTime1.toISOString(),
						endTime: endTime1.toISOString(),
						duration: 30,
						platform: 'discord',
					},
				},
			});
			expect(response1.status).toBe(201);

			// Second booking at 14:00 (different time)
			const startTime2 = new Date(`${dateStr}T14:00:00.000Z`);
			const endTime2 = new Date(startTime2.getTime() + 30 * 60 * 1000);
			const slotId2 = `slot-${dateStr}-${startTime2.toISOString()}`;

			const response2 = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.2',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'User Two',
					email: 'user2@example.com',
					message: 'Afternoon meeting',
					recipient: 'matthaeus@hadoku.me',
					appointment: {
						slotId: slotId2,
						date: dateStr,
						startTime: startTime2.toISOString(),
						endTime: endTime2.toISOString(),
						duration: 30,
						platform: 'discord',
					},
				},
			});
			expect(response2.status).toBe(201);

			// Verify both appointments in D1
			const appointments = mockDB._getAppointments();
			expect(appointments).toHaveLength(2);
			expect(appointments[0].start_time).toBe(startTime1.toISOString());
			expect(appointments[1].start_time).toBe(startTime2.toISOString());
		});
	});

	describe.skip('Business Hours Validation', () => {
		// TODO: Business hours validation is not yet implemented in the submit route
		it('should reject appointment outside business hours', async () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 3);
			const dateStr = futureDate.toISOString().split('T')[0];

			// Try to book at 8:00 (before 9:00 start)
			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'Early Bird',
					email: 'early@example.com',
					message: 'Early meeting request',
					recipient: 'matthaeus@hadoku.me',
					appointment: {
						date: dateStr,
						time: '08:00',
						platform: 'zoom',
					},
				},
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.message).toContain('outside business hours');

			// Verify no appointment in D1
			const appointments = mockDB._getAppointments();
			expect(appointments).toHaveLength(0);
		});

		it('should reject appointment on unavailable day', async () => {
			// Find next Sunday (day 0)
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + ((7 - futureDate.getDay()) % 7 || 7) + 7);
			const dateStr = futureDate.toISOString().split('T')[0];

			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'Weekend Worker',
					email: 'weekend@example.com',
					message: 'Sunday meeting',
					recipient: 'matthaeus@hadoku.me',
					appointment: {
						date: dateStr,
						time: '14:00',
						platform: 'zoom',
					},
				},
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.message).toContain('not available');

			// Verify no appointment in D1
			const appointments = mockDB._getAppointments();
			expect(appointments).toHaveLength(0);
		});
	});

	describe.skip('Advance Notice Validation', () => {
		// TODO: Advance notice validation is not yet implemented in the submit route
		it('should reject appointment within advance notice window', async () => {
			// Try to book appointment tomorrow (less than 24 hours)
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			const dateStr = tomorrow.toISOString().split('T')[0];

			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'Last Minute',
					email: 'lastminute@example.com',
					message: 'Urgent meeting',
					recipient: 'matthaeus@hadoku.me',
					appointment: {
						date: dateStr,
						time: '14:00',
						platform: 'zoom',
					},
				},
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.message).toContain('advance notice');

			// Verify no appointment in D1
			const appointments = mockDB._getAppointments();
			expect(appointments).toHaveLength(0);
		});

		it('should accept appointment beyond advance notice window', async () => {
			// Book appointment 3 days from now (more than 24 hours)
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 3);
			const dateStr = futureDate.toISOString().split('T')[0];

			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'Planner',
					email: 'planner@example.com',
					message: 'Well-planned meeting',
					recipient: 'matthaeus@hadoku.me',
					appointment: {
						date: dateStr,
						time: '14:00',
						platform: 'zoom',
					},
				},
			});

			expect(response.status).toBe(201);

			// Verify appointment in D1
			const appointments = mockDB._getAppointments();
			expect(appointments).toHaveLength(1);
		});
	});

	describe('Platform Validation', () => {
		it('should accept valid platforms', async () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 3);
			const dateStr = futureDate.toISOString().split('T')[0];

			const validPlatforms = ['discord', 'google', 'teams', 'jitsi'];

			for (let i = 0; i < validPlatforms.length; i++) {
				const startTime = new Date(`${dateStr}T${10 + i}:00:00.000Z`);
				const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
				const slotId = `slot-${dateStr}-${startTime.toISOString()}`;

				const response = await makeRequest(worker, env, '/contact/api/submit', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Forwarded-For': '203.0.113.1',
						Referer: 'https://hadoku.me/contact',
					},
					body: {
						name: `User ${i}`,
						email: `user${i}@example.com`,
						message: 'Meeting request',
						recipient: 'matthaeus@hadoku.me',
						appointment: {
							slotId,
							date: dateStr,
							startTime: startTime.toISOString(),
							endTime: endTime.toISOString(),
							duration: 30,
							platform: validPlatforms[i],
						},
					},
				});

				expect(response.status).toBe(201);
			}

			// Verify all appointments in D1
			const appointments = mockDB._getAppointments();
			expect(appointments).toHaveLength(validPlatforms.length);
		});

		it('should reject invalid platform', async () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 3);
			const dateStr = futureDate.toISOString().split('T')[0];

			const startTime = new Date(`${dateStr}T14:00:00.000Z`);
			const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
			const slotId = `slot-${dateStr}-${startTime.toISOString()}`;

			const response = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'Invalid User',
					email: 'invalid@example.com',
					message: 'Meeting request',
					recipient: 'matthaeus@hadoku.me',
					appointment: {
						slotId,
						date: dateStr,
						startTime: startTime.toISOString(),
						endTime: endTime.toISOString(),
						duration: 30,
						platform: 'skype', // Not a valid platform
					},
				},
			});

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.errors).toBeDefined();

			// Verify no appointment in D1
			const appointments = mockDB._getAppointments();
			expect(appointments).toHaveLength(0);
		});
	});
});
