/**
 * Telemetry Module for Contact API
 *
 * Logs critical events to Cloudflare Workers Analytics Engine for queryable metrics.
 * Free tier: 10M events/month, 30-day retention, SQL queries.
 *
 * Query logs: https://dash.cloudflare.com/[account]/analytics/workers
 *
 * Example queries:
 *   SELECT * FROM contact_api WHERE index1 = 'rate_limit_hit'
 *   SELECT COUNT(*) FROM contact_api WHERE index1 = 'db_capacity_warning' AND double1 > 80
 */

// Event types for structured logging
export const EventType = {
	// Rate limiting events
	RATE_LIMIT_HIT: 'rate_limit_hit',
	RATE_LIMIT_WARNING: 'rate_limit_warn', // Approaching limit (4/5)

	// Database capacity events
	DB_CAPACITY_OK: 'db_capacity_ok',
	DB_CAPACITY_WARNING: 'db_capacity_warn', // 70-80%
	DB_CAPACITY_CRITICAL: 'db_capacity_crit', // >80%

	// Retention/archive events
	SUBMISSIONS_ARCHIVED: 'submissions_arch',
	TRASH_PURGED: 'trash_purged',

	// Email events
	EMAIL_SENT: 'email_sent',
	EMAIL_FAILED: 'email_failed',

	// Appointment events
	APPOINTMENT_BOOKED: 'appt_booked',
	APPOINTMENT_CONFLICT: 'appt_conflict',

	// Submission events
	SUBMISSION_CREATED: 'submit_created',

	// Scheduled task events
	SCHEDULED_RUN: 'scheduled_run',
} as const;

export type EventTypeValue = (typeof EventType)[keyof typeof EventType];

// Severity levels
export const Severity = {
	INFO: 'info',
	WARN: 'warn',
	ERROR: 'error',
} as const;

export type SeverityValue = (typeof Severity)[keyof typeof Severity];

interface TelemetryEvent {
	eventType: EventTypeValue;
	severity: SeverityValue;
	// Numeric values (for aggregation)
	value?: number; // Primary metric (e.g., capacity %, count)
	value2?: number; // Secondary metric (e.g., duration, remaining)
	// String context (truncated to 100 chars for blobs)
	context?: string;
	detail?: string;
}

interface TelemetryEnv {
	ANALYTICS_ENGINE?: AnalyticsEngineDataset;
}

/**
 * Log a telemetry event to Analytics Engine
 *
 * Analytics Engine data structure:
 * - blobs: strings (not indexed, up to 5KB each)
 * - doubles: numbers (for aggregation, up to 20)
 * - indexes: filterable strings (up to 20, max 96 bytes each)
 */
export function logEvent(env: TelemetryEnv, event: TelemetryEvent): void {
	const timestamp = new Date().toISOString();

	// Always log to console for Workers Logs (queryable via wrangler tail)
	const logFn =
		event.severity === Severity.ERROR
			? console.error
			: event.severity === Severity.WARN
				? console.warn
				: console.log;

	logFn(`[${event.eventType}] ${event.context || ''} ${event.detail || ''}`, {
		severity: event.severity,
		value: event.value,
		value2: event.value2,
	});

	// Write to Analytics Engine if available
	if (!env.ANALYTICS_ENGINE) {
		return;
	}

	try {
		env.ANALYTICS_ENGINE.writeDataPoint({
			// Blobs (strings, not indexed, for context)
			blobs: [
				(event.context || '').substring(0, 100),
				(event.detail || '').substring(0, 100),
				timestamp,
			],

			// Doubles (numeric values for aggregation)
			doubles: [event.value ?? 0, event.value2 ?? 0],

			// Indexes (filterable dimensions - max 96 bytes each)
			indexes: [
				event.eventType.substring(0, 20), // index1: event type
				event.severity.substring(0, 20), // index2: severity
			],
		});
	} catch (error) {
		// Don't let telemetry failures break the app
		console.error('[Telemetry] Failed to write:', error);
	}
}

// Convenience functions for common events

export function logRateLimitHit(
	env: TelemetryEnv,
	ipHash: string,
	remaining: number,
	endpoint: string
): void {
	logEvent(env, {
		eventType: EventType.RATE_LIMIT_HIT,
		severity: Severity.WARN,
		value: remaining,
		context: `IP:${ipHash.substring(0, 8)}`,
		detail: endpoint,
	});
}

export function logRateLimitWarning(
	env: TelemetryEnv,
	ipHash: string,
	remaining: number,
	endpoint: string
): void {
	logEvent(env, {
		eventType: EventType.RATE_LIMIT_WARNING,
		severity: Severity.INFO,
		value: remaining,
		context: `IP:${ipHash.substring(0, 8)}`,
		detail: endpoint,
	});
}

export function logDbCapacity(env: TelemetryEnv, percentUsed: number, sizeBytes: number): void {
	let eventType: EventTypeValue;
	let severity: SeverityValue;

	if (percentUsed >= 80) {
		eventType = EventType.DB_CAPACITY_CRITICAL;
		severity = Severity.ERROR;
	} else if (percentUsed >= 70) {
		eventType = EventType.DB_CAPACITY_WARNING;
		severity = Severity.WARN;
	} else {
		eventType = EventType.DB_CAPACITY_OK;
		severity = Severity.INFO;
	}

	logEvent(env, {
		eventType,
		severity,
		value: percentUsed,
		value2: sizeBytes,
		context: `${percentUsed.toFixed(1)}% used`,
		detail: `${(sizeBytes / 1024 / 1024).toFixed(2)} MB`,
	});
}

export function logArchive(env: TelemetryEnv, archivedCount: number, daysOld: number): void {
	logEvent(env, {
		eventType: EventType.SUBMISSIONS_ARCHIVED,
		severity: archivedCount > 0 ? Severity.INFO : Severity.INFO,
		value: archivedCount,
		value2: daysOld,
		context: `Archived ${archivedCount} submissions`,
		detail: `older than ${daysOld} days`,
	});
}

export function logTrashPurge(env: TelemetryEnv, purgedCount: number, daysOld: number): void {
	logEvent(env, {
		eventType: EventType.TRASH_PURGED,
		severity: purgedCount > 0 ? Severity.INFO : Severity.INFO,
		value: purgedCount,
		value2: daysOld,
		context: `Purged ${purgedCount} deleted items`,
		detail: `older than ${daysOld} days`,
	});
}

export function logEmailSent(
	env: TelemetryEnv,
	templateName: string,
	recipientDomain: string
): void {
	logEvent(env, {
		eventType: EventType.EMAIL_SENT,
		severity: Severity.INFO,
		value: 1,
		context: templateName,
		detail: recipientDomain,
	});
}

export function logEmailFailed(
	env: TelemetryEnv,
	templateName: string,
	errorMessage: string
): void {
	logEvent(env, {
		eventType: EventType.EMAIL_FAILED,
		severity: Severity.ERROR,
		value: 1,
		context: templateName,
		detail: errorMessage.substring(0, 100),
	});
}

export function logAppointmentBooked(env: TelemetryEnv, platform: string, duration: number): void {
	logEvent(env, {
		eventType: EventType.APPOINTMENT_BOOKED,
		severity: Severity.INFO,
		value: duration,
		context: platform,
	});
}

export function logAppointmentConflict(env: TelemetryEnv, slotId: string): void {
	logEvent(env, {
		eventType: EventType.APPOINTMENT_CONFLICT,
		severity: Severity.WARN,
		value: 1,
		context: 'Slot already taken',
		detail: slotId.substring(0, 50),
	});
}

export function logSubmissionCreated(env: TelemetryEnv, recipient: string): void {
	logEvent(env, {
		eventType: EventType.SUBMISSION_CREATED,
		severity: Severity.INFO,
		value: 1,
		context: recipient,
	});
}

export function logScheduledRun(env: TelemetryEnv, taskName: string, success: boolean): void {
	logEvent(env, {
		eventType: EventType.SCHEDULED_RUN,
		severity: success ? Severity.INFO : Severity.ERROR,
		value: success ? 1 : 0,
		context: taskName,
	});
}
