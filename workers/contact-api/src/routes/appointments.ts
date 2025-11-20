/**
 * Appointments endpoints
 *
 * GET /contact/api/appointments/slots
 * Public endpoint for fetching available appointment slots
 */

import { Hono } from 'hono';
import { badRequest, serverError } from '@hadoku/worker-utils';
import { validateSlotFetchRequest } from '../validation';
import { getAppointmentConfig, getAppointmentsByDate } from '../storage';

interface Env {
	DB: D1Database;
	RATE_LIMIT_KV: KVNamespace;
}

export function createAppointmentsRoutes() {
	const app = new Hono<{ Bindings: Env }>();

	/**
	 * GET /appointments/slots
	 * Fetch available appointment slots for a given date and duration
	 */
	app.get('/appointments/slots', async (c) => {
		const db = c.env.DB;

		try {
			// Parse query parameters
			const date = c.req.query('date');
			const duration = c.req.query('duration');

			// Validate request parameters
			const validation = validateSlotFetchRequest(date, duration);
			if (!validation.valid) {
				return c.json(
					{
						message: validation.errors.join(', '),
						errors: validation.errors,
					},
					400
				);
			}

			const requestDate = validation.parsedDate!;
			const requestDuration = validation.parsedDuration!;

			// Get appointment configuration
			const config = await getAppointmentConfig(db);
			if (!config) {
				return c.json({ message: 'Appointment system not configured' }, 500);
			}

			// Parse configuration
			const availableDays = config.available_days.split(',').map((d) => parseInt(d.trim()));
			const slotDurations = config.slot_duration_options.split(',').map((d) => parseInt(d.trim()));

			// Validate requested duration is allowed
			if (!slotDurations.includes(requestDuration)) {
				return c.json(
					{
						message: `Duration ${requestDuration} not available. Available durations: ${slotDurations.join(', ')}`,
					},
					400
				);
			}

			// Check if requested date is in the past or too soon
			const now = new Date();
			const requestedDate = new Date(requestDate);
			const minAdvanceMs = config.min_advance_hours * 60 * 60 * 1000;
			const minAllowedDate = new Date(now.getTime() + minAdvanceMs);

			if (requestedDate < minAllowedDate) {
				return c.json(
					{
						message: `Appointments must be booked at least ${config.min_advance_hours} hours in advance`,
					},
					400
				);
			}

			// Check if requested date is too far in the future
			const maxAdvanceMs = config.max_advance_days * 24 * 60 * 60 * 1000;
			const maxAllowedDate = new Date(now.getTime() + maxAdvanceMs);

			if (requestedDate > maxAllowedDate) {
				return c.json(
					{
						message: `Appointments can only be booked up to ${config.max_advance_days} days in advance`,
					},
					400
				);
			}

			// Check if the day of week is available
			const dayOfWeek = requestedDate.getDay(); // 0 = Sunday, 6 = Saturday
			if (!availableDays.includes(dayOfWeek)) {
				return c.json(
					{
						message: 'No appointments available on this day of the week',
					},
					400
				);
			}

			// Generate time slots based on business hours
			const slots = await generateTimeSlots(
				db,
				requestDate,
				requestDuration,
				config.business_hours_start,
				config.business_hours_end,
				config.timezone
			);

			// Return slots in API format
			return c.json({
				date: requestDate,
				duration: requestDuration,
				timezone: config.timezone,
				slots,
			});
		} catch (error) {
			console.error('Error fetching appointment slots:', error);
			return c.json({ message: 'Failed to fetch available slots' }, 500);
		}
	});

	return app;
}

/**
 * Generate time slots for a given date, duration, and business hours
 */
async function generateTimeSlots(
	db: D1Database,
	date: string,
	duration: number,
	businessHoursStart: string,
	businessHoursEnd: string,
	timezone: string
): Promise<Array<{ id: string; startTime: string; endTime: string; available: boolean }>> {
	// Get existing appointments for this date
	const existingAppointments = await getAppointmentsByDate(db, date);
	const bookedSlotIds = new Set(existingAppointments.map((apt) => apt.slot_id));

	// Parse business hours (format: "HH:MM")
	const [startHour, startMinute] = businessHoursStart.split(':').map(Number);
	const [endHour, endMinute] = businessHoursEnd.split(':').map(Number);

	// Create date objects for the requested date with business hours
	const dateObj = new Date(`${date  }T00:00:00.000Z`);
	const slots = [];

	// Generate slots from start to end of business hours
	let currentTime = new Date(dateObj);
	currentTime.setUTCHours(startHour, startMinute, 0, 0);

	const endTime = new Date(dateObj);
	endTime.setUTCHours(endHour, endMinute, 0, 0);

	while (currentTime < endTime) {
		const slotStart = new Date(currentTime);
		const slotEnd = new Date(currentTime.getTime() + duration * 60 * 1000);

		// Don't create slot if it extends past business hours
		if (slotEnd > endTime) {
			break;
		}

		// Generate unique slot ID
		const slotId = `slot-${date}-${slotStart.toISOString()}`;

		// Check if slot is already booked
		const available = !bookedSlotIds.has(slotId);

		slots.push({
			id: slotId,
			startTime: slotStart.toISOString(),
			endTime: slotEnd.toISOString(),
			available,
		});

		// Move to next slot
		currentTime = slotEnd;
	}

	// Filter out slots that are in the past (for today)
	const now = new Date();
	return slots.filter((slot) => new Date(slot.startTime) > now);
}
