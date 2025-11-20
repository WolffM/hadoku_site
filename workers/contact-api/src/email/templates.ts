/**
 * Email templates for appointment confirmations and reminders
 *
 * Templates are now stored in D1 database with KV caching.
 * This file provides the rendering logic and helper functions.
 */

/**
 * Simple Mustache-like template renderer
 * Supports {{variable}} syntax
 */
export function renderTemplate(template: string, data: Record<string, any>): string {
	let result = template;

	// Replace {{#if variable}} blocks
	result = result.replace(
		/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
		(match, varName, content) => {
			return data[varName] ? content : '';
		}
	);

	// Replace {{variable}} placeholders
	result = result.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
		return data[varName] !== undefined && data[varName] !== null ? String(data[varName]) : '';
	});

	return result;
}

export interface AppointmentEmailData {
	recipientName: string;
	recipientEmail: string;
	appointmentDate: string; // Formatted date string
	startTime: string; // Formatted time string
	endTime: string; // Formatted time string
	timezone: string;
	duration: number; // in minutes
	platform: string;
	meetingLink?: string;
	message?: string; // User's original message
}

/**
 * Format appointment confirmation email (using stored template)
 * Sent from matthaeus@hadoku.me when appointment is booked
 *
 * This function prepares data for template rendering. The actual templates
 * are stored in D1 and fetched via getEmailTemplate() in submit route.
 */
export function formatAppointmentConfirmation(data: AppointmentEmailData): {
	subject: string;
	text: string;
} {
	// Fallback to hardcoded template if database template not available
	// This ensures the system works even if templates aren't loaded yet
	const subject = `Appointment Confirmed - ${data.appointmentDate} at ${data.startTime}`;

	const text = `Hi ${data.recipientName},

Your appointment has been confirmed!

APPOINTMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date:     ${data.appointmentDate}
Time:     ${data.startTime} - ${data.endTime} ${data.timezone}
Duration: ${data.duration} minutes
Platform: ${data.platform.charAt(0).toUpperCase() + data.platform.slice(1)}
${data.meetingLink ? `\nMeeting Link:\n${data.meetingLink}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${data.message ? `YOUR MESSAGE:\n${data.message}\n\n` : ''}WHAT TO EXPECT
${getPlatformInstructions(data.platform, data.meetingLink)}

NEED TO RESCHEDULE?
If you need to change or cancel this appointment, please reply to this email as soon as possible.

Looking forward to speaking with you!

Best regards,
Matthaeus Wolf
hadoku.me

---
This confirmation was sent from an automated system.
Reply to this email to reach me directly at matthaeus@hadoku.me.`;

	return { subject, text };
}

/**
 * Get platform-specific instructions
 */
function getPlatformInstructions(platform: string, meetingLink?: string): string {
	switch (platform.toLowerCase()) {
		case 'discord':
			return `We'll meet on Discord. ${meetingLink ? `Use this invite link:\n${meetingLink}\n\nMake sure you have Discord installed and an account set up before the meeting time.` : "I'll send you a Discord invite link shortly."}`;

		case 'google':
			return `We'll meet via Google Meet. ${meetingLink ? `Click the meeting link above to join at the scheduled time.\n\nYou can join from your browser (Chrome recommended) or the Google Meet app.` : "I'll send you a Google Meet link shortly."}`;

		case 'teams':
			return `We'll meet via Microsoft Teams. ${meetingLink ? `Click the meeting link above to join at the scheduled time.\n\nYou can join from your browser or the Microsoft Teams app.` : "I'll send you a Microsoft Teams meeting link shortly."}`;

		case 'jitsi':
			return `We'll meet via Jitsi Meet (free, no account required). ${meetingLink ? `Click the meeting link above to join at the scheduled time.\n\nJitsi works in any modern browser - no installation needed!` : "I'll send you a Jitsi Meet link shortly."}`;

		default:
			return 'Meeting details will be provided shortly.';
	}
}

/**
 * Format appointment reminder email
 * Sent 24 hours before the appointment
 */
export function formatAppointmentReminder(data: AppointmentEmailData): {
	subject: string;
	text: string;
} {
	const subject = `Reminder: Appointment Tomorrow - ${data.appointmentDate} at ${data.startTime}`;

	const text = `Hi ${data.recipientName},

This is a friendly reminder about your upcoming appointment tomorrow.

APPOINTMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date:     ${data.appointmentDate}
Time:     ${data.startTime} - ${data.endTime} ${data.timezone}
Duration: ${data.duration} minutes
Platform: ${data.platform.charAt(0).toUpperCase() + data.platform.slice(1)}
${data.meetingLink ? `\nMeeting Link:\n${data.meetingLink}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${getPlatformInstructions(data.platform, data.meetingLink)}

NEED TO RESCHEDULE?
If something came up and you need to reschedule, please let me know as soon as possible.

Looking forward to our conversation!

Best regards,
Matthaeus Wolf
hadoku.me

---
Reply to this email to reach me directly at matthaeus@hadoku.me.`;

	return { subject, text };
}

/**
 * Prepare template variables for appointment confirmation email
 * Returns data object ready for template rendering
 */
export function prepareAppointmentTemplateData(data: AppointmentEmailData): Record<string, any> {
	// Get platform-specific instructions
	const platformInstructions = getPlatformInstructions(data.platform, data.meetingLink);

	// Capitalize platform name
	const platformName = data.platform.charAt(0).toUpperCase() + data.platform.slice(1);

	return {
		recipientName: data.recipientName,
		recipientEmail: data.recipientEmail,
		appointmentDate: data.appointmentDate,
		startTime: data.startTime,
		endTime: data.endTime,
		timezone: data.timezone,
		duration: data.duration,
		platform: data.platform,
		platformName,
		meetingLink: data.meetingLink || '',
		message: data.message || '',
		platformInstructions,
	};
}

/**
 * Helper function to format date and time from ISO strings
 */
export function formatAppointmentDateTime(
	isoDate: string,
	isoStartTime: string,
	isoEndTime: string,
	timezone: string
): {
	date: string;
	startTime: string;
	endTime: string;
} {
	const startDate = new Date(isoStartTime);
	const endDate = new Date(isoEndTime);

	// Format date: "Monday, January 20, 2025"
	const dateOptions: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: timezone,
	};
	const date = startDate.toLocaleDateString('en-US', dateOptions);

	// Format time: "2:00 PM"
	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: 'numeric',
		minute: '2-digit',
		timeZone: timezone,
	};
	const startTime = startDate.toLocaleTimeString('en-US', timeOptions);
	const endTime = endDate.toLocaleTimeString('en-US', timeOptions);

	return { date, startTime, endTime };
}
