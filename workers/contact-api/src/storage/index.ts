/**
 * Storage layer exports
 * Centralized export point for all storage operations
 */

// Submissions
export {
	type StoredSubmission,
	type CreateSubmissionParams,
	type SubmissionStats,
	createSubmission,
	getAllSubmissions,
	getSubmissionById,
	updateSubmissionStatus,
	deleteSubmission,
	restoreSubmission,
	purgeOldDeletedSubmissions,
	getSubmissionStats,
	archiveOldSubmissions,
} from './submissions';

// Whitelist
export {
	type WhitelistEntry,
	isEmailWhitelisted,
	addToWhitelist,
	removeFromWhitelist,
	getAllWhitelistedEmails,
} from './whitelist';

// Appointments
export {
	type AppointmentConfig,
	type StoredAppointment,
	type CreateAppointmentParams,
	getAppointmentConfig,
	updateAppointmentConfig,
	createAppointment,
	isSlotAvailable,
	getAppointmentsByDate,
	getAllAppointments,
	getAppointmentById,
	updateAppointmentStatus,
	markConfirmationSent,
	markReminderSent,
} from './appointments';

// Templates
export {
	type EmailTemplate,
	type ChatbotPrompt,
	type TemplateVersion,
	getEmailTemplate,
	getChatbotPrompt,
	listEmailTemplates,
	upsertEmailTemplate,
	deleteEmailTemplate,
	getTemplateVersionHistory,
} from './templates';

// Database utilities
export { type DatabaseSize, getDatabaseSize, isDatabaseNearCapacity } from './database';
