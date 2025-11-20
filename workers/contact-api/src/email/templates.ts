/**
 * Email templates for appointment confirmations and reminders
 */

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
 * Format appointment confirmation email
 * Sent from matthaeus@hadoku.me when appointment is booked
 */
export function formatAppointmentConfirmation(data: AppointmentEmailData): {
	subject: string;
	text: string;
} {
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
