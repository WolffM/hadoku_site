/**
 * Appointment Slots Integration Tests
 *
 * Tests the GET /appointments/slots endpoint to ensure:
 * - Correct response schema matching contact-ui expectations
 * - Business hours are respected
 * - Advance notice validation works
 * - Day of week filtering works
 * - Booked slots are marked as unavailable
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import worker from '../../src/index';
import { createMockD1, createMockKV, makeRequest } from '../__helpers__/test-utils';

/**
 * Contact-UI expected response schema for slots endpoint
 * From @wolffm/contact-ui package types
 */
interface ContactUISlot {
	id: string;
	startTime: string; // ISO 8601 format
	endTime: string; // ISO 8601 format
	available: boolean;
}

interface ContactUIFetchSlotsResponse {
	date: string;
	duration: number; // 15 | 30 | 60
	timezone: string;
	slots: ContactUISlot[];
}

describe('Appointment Slots Integration', () => {
	let env: any;
	let mockDB: any;
	let mockKV: any;

	beforeEach(() => {
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

	describe('GET /contact/api/appointments/slots - Schema Validation', () => {
		it('should return response matching contact-ui FetchSlotsResponse schema', async () => {
			// Get a date 3 days from now (to satisfy advance notice) that's a weekday
			const futureDate = getNextWeekday(3);
			const dateStr = futureDate.toISOString().split('T')[0];

			const response = await makeRequest(
				worker,
				env,
				`/contact/api/appointments/slots?date=${dateStr}&duration=30`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}
			);

			expect(response.status).toBe(200);
			const data = (await response.json()) as ContactUIFetchSlotsResponse;

			// Validate top-level schema
			expect(data.date).toBe(dateStr);
			expect(data.duration).toBe(30);
			expect(data.timezone).toBe('America/New_York');
			expect(Array.isArray(data.slots)).toBe(true);

			// Validate slot schema if slots exist
			if (data.slots.length > 0) {
				const slot = data.slots[0];
				expect(typeof slot.id).toBe('string');
				expect(slot.id).toMatch(/^slot-/); // Slot IDs should start with "slot-"
				expect(typeof slot.startTime).toBe('string');
				expect(typeof slot.endTime).toBe('string');
				expect(typeof slot.available).toBe('boolean');

				// Validate ISO 8601 format
				expect(() => new Date(slot.startTime)).not.toThrow();
				expect(() => new Date(slot.endTime)).not.toThrow();

				// Validate slot duration matches request
				const start = new Date(slot.startTime);
				const end = new Date(slot.endTime);
				const durationMinutes = (end.getTime() - start.getTime()) / (60 * 1000);
				expect(durationMinutes).toBe(30);
			}
		});

		it('should return all slots as available when no bookings exist', async () => {
			const futureDate = getNextWeekday(3);
			const dateStr = futureDate.toISOString().split('T')[0];

			const response = await makeRequest(
				worker,
				env,
				`/contact/api/appointments/slots?date=${dateStr}&duration=30`,
				{
					method: 'GET',
				}
			);

			expect(response.status).toBe(200);
			const data = (await response.json()) as ContactUIFetchSlotsResponse;

			// All slots should be available
			expect(data.slots.every((slot) => slot.available === true)).toBe(true);
		});

		it('should mark booked slots as unavailable', async () => {
			const futureDate = getNextWeekday(3);
			const dateStr = futureDate.toISOString().split('T')[0];

			// Create a booked appointment at 10:00
			const bookedStartTime = new Date(`${dateStr}T10:00:00.000Z`);
			const bookedSlotId = `slot-${dateStr}-${bookedStartTime.toISOString()}`;

			mockDB._getTables().appointments.set('apt-1', {
				id: 'apt-1',
				slot_id: bookedSlotId,
				date: dateStr,
				start_time: bookedStartTime.toISOString(),
				end_time: new Date(bookedStartTime.getTime() + 30 * 60 * 1000).toISOString(),
				status: 'confirmed',
				platform: 'discord',
			});

			const response = await makeRequest(
				worker,
				env,
				`/contact/api/appointments/slots?date=${dateStr}&duration=30`,
				{
					method: 'GET',
				}
			);

			expect(response.status).toBe(200);
			const data = (await response.json()) as ContactUIFetchSlotsResponse;

			// Find the booked slot and verify it's unavailable
			const bookedSlot = data.slots.find((slot) => slot.id === bookedSlotId);
			if (bookedSlot) {
				expect(bookedSlot.available).toBe(false);
			}

			// Other slots should still be available
			const availableSlots = data.slots.filter((slot) => slot.available);
			expect(availableSlots.length).toBeGreaterThan(0);
		});
	});

	describe('GET /contact/api/appointments/slots - Parameter Validation', () => {
		it('should require date parameter', async () => {
			const response = await makeRequest(
				worker,
				env,
				'/contact/api/appointments/slots?duration=30',
				{
					method: 'GET',
				}
			);

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.errors).toContain('Date parameter is required');
		});

		it('should require duration parameter', async () => {
			const futureDate = getNextWeekday(3);
			const dateStr = futureDate.toISOString().split('T')[0];

			const response = await makeRequest(
				worker,
				env,
				`/contact/api/appointments/slots?date=${dateStr}`,
				{
					method: 'GET',
				}
			);

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.errors).toContain('Duration parameter is required');
		});

		it('should reject invalid duration', async () => {
			const futureDate = getNextWeekday(3);
			const dateStr = futureDate.toISOString().split('T')[0];

			const response = await makeRequest(
				worker,
				env,
				`/contact/api/appointments/slots?date=${dateStr}&duration=45`,
				{
					method: 'GET',
				}
			);

			expect(response.status).toBe(400);
			const data = await response.json();
			// Validation returns "Duration must be one of: 15, 30, 60"
			expect(data.message).toContain('Duration');
		});

		it('should accept valid durations (15, 30, 60)', async () => {
			const futureDate = getNextWeekday(3);
			const dateStr = futureDate.toISOString().split('T')[0];

			for (const duration of [15, 30, 60]) {
				const response = await makeRequest(
					worker,
					env,
					`/contact/api/appointments/slots?date=${dateStr}&duration=${duration}`,
					{
						method: 'GET',
					}
				);

				expect(response.status).toBe(200);
				const data = (await response.json()) as ContactUIFetchSlotsResponse;
				expect(data.duration).toBe(duration);
			}
		});
	});

	describe('GET /contact/api/appointments/slots - Business Rules', () => {
		it('should reject dates outside advance notice window', async () => {
			// Try to book for tomorrow (less than 24 hours advance notice)
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			const dateStr = tomorrow.toISOString().split('T')[0];

			const response = await makeRequest(
				worker,
				env,
				`/contact/api/appointments/slots?date=${dateStr}&duration=30`,
				{
					method: 'GET',
				}
			);

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.message).toContain('advance');
		});

		it('should reject dates too far in the future', async () => {
			// Try to book 60 days from now (max is 30)
			const farFuture = new Date();
			farFuture.setDate(farFuture.getDate() + 60);
			const dateStr = farFuture.toISOString().split('T')[0];

			const response = await makeRequest(
				worker,
				env,
				`/contact/api/appointments/slots?date=${dateStr}&duration=30`,
				{
					method: 'GET',
				}
			);

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.message).toContain('30 days');
		});

		it('should reject unavailable day of week (weekend)', async () => {
			// Find a Sunday that's at least 2 days from now (to pass advance notice check)
			const sunday = getNextSunday();
			// Make sure it's well beyond the advance notice window (24 hours + buffer)
			const minAdvanceMs = 48 * 60 * 60 * 1000; // 48 hours to be safe
			if (sunday.getTime() - Date.now() < minAdvanceMs) {
				sunday.setDate(sunday.getDate() + 7);
			}
			const dateStr = sunday.toISOString().split('T')[0];

			const response = await makeRequest(
				worker,
				env,
				`/contact/api/appointments/slots?date=${dateStr}&duration=30`,
				{
					method: 'GET',
				}
			);

			expect(response.status).toBe(400);
			const data = await response.json();
			// Should reject because Sunday (day 0) is not in available_days (1-5)
			// API returns "No appointments available on this day of the week"
			expect(data.message).toContain('day of the week');
		});

		it('should generate slots within business hours only', async () => {
			const futureDate = getNextWeekday(3);
			const dateStr = futureDate.toISOString().split('T')[0];

			const response = await makeRequest(
				worker,
				env,
				`/contact/api/appointments/slots?date=${dateStr}&duration=30`,
				{
					method: 'GET',
				}
			);

			expect(response.status).toBe(200);
			const data = (await response.json()) as ContactUIFetchSlotsResponse;

			// All slots should be within business hours (9:00 - 17:00)
			for (const slot of data.slots) {
				const startTime = new Date(slot.startTime);
				const endTime = new Date(slot.endTime);
				const startHour = startTime.getUTCHours();
				const endHour = endTime.getUTCHours();
				const endMinute = endTime.getUTCMinutes();

				expect(startHour).toBeGreaterThanOrEqual(9);
				expect(endHour).toBeLessThanOrEqual(17);
				// End time should not exceed 17:00
				if (endHour === 17) {
					expect(endMinute).toBe(0);
				}
			}
		});
	});

	describe('GET /contact/api/appointments/slots - Full Flow Integration', () => {
		it('should support full booking flow: fetch slots -> book -> verify unavailable', async () => {
			const futureDate = getNextWeekday(3);
			const dateStr = futureDate.toISOString().split('T')[0];

			// Step 1: Fetch available slots
			const slotsResponse = await makeRequest(
				worker,
				env,
				`/contact/api/appointments/slots?date=${dateStr}&duration=30`,
				{
					method: 'GET',
				}
			);

			expect(slotsResponse.status).toBe(200);
			const slotsData = (await slotsResponse.json()) as ContactUIFetchSlotsResponse;
			expect(slotsData.slots.length).toBeGreaterThan(0);

			// Get the first available slot
			const selectedSlot = slotsData.slots.find((s) => s.available);
			expect(selectedSlot).toBeDefined();

			// Step 2: Book the slot
			const bookResponse = await makeRequest(worker, env, '/contact/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Forwarded-For': '203.0.113.1',
					Referer: 'https://hadoku.me/contact',
				},
				body: {
					name: 'Test User',
					email: 'test@example.com',
					message: 'Test booking',
					recipient: 'matthaeus@hadoku.me',
					appointment: {
						slotId: selectedSlot!.id,
						date: dateStr,
						startTime: selectedSlot!.startTime,
						endTime: selectedSlot!.endTime,
						duration: 30,
						platform: 'discord',
					},
				},
			});

			expect(bookResponse.status).toBe(201);

			// Step 3: Fetch slots again and verify the booked slot is now unavailable
			const slotsResponse2 = await makeRequest(
				worker,
				env,
				`/contact/api/appointments/slots?date=${dateStr}&duration=30`,
				{
					method: 'GET',
				}
			);

			expect(slotsResponse2.status).toBe(200);
			const slotsData2 = (await slotsResponse2.json()) as ContactUIFetchSlotsResponse;

			const bookedSlot = slotsData2.slots.find((s) => s.id === selectedSlot!.id);
			expect(bookedSlot).toBeDefined();
			expect(bookedSlot!.available).toBe(false);
		});
	});
});

/**
 * Helper to get a weekday N days from now
 * Skips weekends to ensure we get a valid business day
 */
function getNextWeekday(daysFromNow: number): Date {
	const date = new Date();
	date.setDate(date.getDate() + daysFromNow);

	// If it's Saturday (6), move to Monday (+2)
	// If it's Sunday (0), move to Monday (+1)
	const dayOfWeek = date.getDay();
	if (dayOfWeek === 0) {
		date.setDate(date.getDate() + 1);
	} else if (dayOfWeek === 6) {
		date.setDate(date.getDate() + 2);
	}

	return date;
}

/**
 * Helper to get the next Sunday
 */
function getNextSunday(): Date {
	const date = new Date();
	const dayOfWeek = date.getDay();
	const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
	date.setDate(date.getDate() + daysUntilSunday);
	return date;
}
