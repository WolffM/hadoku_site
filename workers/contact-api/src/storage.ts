/**
 * D1 database operations for contact submissions
 */

export interface StoredSubmission {
	id: string;
	name: string;
	email: string;
	message: string;
	status: 'unread' | 'read' | 'archived' | 'deleted';
	created_at: number;
	deleted_at: number | null;
	ip_address: string | null;
	user_agent: string | null;
	referrer: string | null;
	recipient: string | null;
}

export interface CreateSubmissionParams {
	name: string;
	email: string;
	message: string;
	ip_address: string | null;
	user_agent: string | null;
	referrer: string | null;
}

/**
 * Store a new contact submission in D1
 */
export async function createSubmission(
	db: D1Database,
	params: CreateSubmissionParams
): Promise<StoredSubmission> {
	const id = crypto.randomUUID();
	const created_at = Date.now();

	await db
		.prepare(
			`INSERT INTO contact_submissions
			(id, name, email, message, status, created_at, ip_address, user_agent, referrer)
			VALUES (?, ?, ?, ?, 'unread', ?, ?, ?, ?)`
		)
		.bind(
			id,
			params.name,
			params.email,
			params.message,
			created_at,
			params.ip_address,
			params.user_agent,
			params.referrer
		)
		.run();

	return {
		id,
		name: params.name,
		email: params.email,
		message: params.message,
		status: 'unread',
		created_at,
		ip_address: params.ip_address,
		user_agent: params.user_agent,
		referrer: params.referrer,
	};
}

/**
 * Get all contact submissions (admin only)
 * Returns newest first
 * Excludes deleted items by default
 */
export async function getAllSubmissions(
	db: D1Database,
	limit: number = 100,
	offset: number = 0,
	includeDeleted: boolean = false
): Promise<StoredSubmission[]> {
	const whereClause = includeDeleted ? '' : `WHERE status != 'deleted'`;
	const result = await db
		.prepare(
			`SELECT * FROM contact_submissions
			${whereClause}
			ORDER BY created_at DESC
			LIMIT ? OFFSET ?`
		)
		.bind(limit, offset)
		.all<StoredSubmission>();

	return result.results || [];
}

/**
 * Get submission by ID
 */
export async function getSubmissionById(
	db: D1Database,
	id: string
): Promise<StoredSubmission | null> {
	const result = await db
		.prepare(`SELECT * FROM contact_submissions WHERE id = ?`)
		.bind(id)
		.first<StoredSubmission>();

	return result;
}

/**
 * Update submission status
 */
export async function updateSubmissionStatus(
	db: D1Database,
	id: string,
	status: 'unread' | 'read' | 'archived'
): Promise<boolean> {
	const result = await db
		.prepare(`UPDATE contact_submissions SET status = ? WHERE id = ?`)
		.bind(status, id)
		.run();

	return result.success;
}

/**
 * Soft delete a submission (move to trash)
 */
export async function deleteSubmission(db: D1Database, id: string): Promise<boolean> {
	const deleted_at = Date.now();
	const result = await db
		.prepare(`UPDATE contact_submissions SET status = 'deleted', deleted_at = ? WHERE id = ?`)
		.bind(deleted_at, id)
		.run();

	return result.success;
}

/**
 * Restore a submission from trash
 */
export async function restoreSubmission(db: D1Database, id: string): Promise<boolean> {
	const result = await db
		.prepare(`UPDATE contact_submissions SET status = 'unread', deleted_at = NULL WHERE id = ?`)
		.bind(id)
		.run();

	return result.success;
}

/**
 * Permanently delete submissions that have been in trash for more than 7 days
 */
export async function purgeOldDeletedSubmissions(db: D1Database): Promise<number> {
	const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

	const result = await db
		.prepare(
			`DELETE FROM contact_submissions WHERE status = 'deleted' AND deleted_at IS NOT NULL AND deleted_at < ?`
		)
		.bind(sevenDaysAgo)
		.run();

	return result.meta?.changes || 0;
}

/**
 * Get count of submissions by status
 * Excludes deleted items from total count
 */
export async function getSubmissionStats(db: D1Database): Promise<{
	total: number;
	unread: number;
	read: number;
	archived: number;
	deleted: number;
}> {
	const result = await db
		.prepare(
			`SELECT
				SUM(CASE WHEN status != 'deleted' THEN 1 ELSE 0 END) as total,
				SUM(CASE WHEN status = 'unread' THEN 1 ELSE 0 END) as unread,
				SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read,
				SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived,
				SUM(CASE WHEN status = 'deleted' THEN 1 ELSE 0 END) as deleted
			FROM contact_submissions`
		)
		.first<{ total: number; unread: number; read: number; archived: number; deleted: number }>();

	return result || { total: 0, unread: 0, read: 0, archived: 0, deleted: 0 };
}

/**
 * Archive old submissions (30+ days)
 * Moves them to archive table and removes from main table
 * Returns count of archived submissions
 */
export async function archiveOldSubmissions(db: D1Database, daysOld: number = 30): Promise<number> {
	const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
	const archivedAt = Date.now();

	// First, copy old submissions to archive table
	const copyResult = await db
		.prepare(
			`INSERT INTO contact_submissions_archive
			(id, name, email, message, status, created_at, archived_at, ip_address, user_agent, referrer)
			SELECT id, name, email, message, status, created_at, ?, ip_address, user_agent, referrer
			FROM contact_submissions
			WHERE created_at < ?`
		)
		.bind(archivedAt, cutoffTime)
		.run();

	// Then delete from main table
	await db.prepare(`DELETE FROM contact_submissions WHERE created_at < ?`).bind(cutoffTime).run();

	// Return count of archived rows
	return copyResult.meta?.changes || 0;
}

/**
 * Get D1 database size info
 * Returns size in bytes and percentage of quota used
 */
export async function getDatabaseSize(db: D1Database): Promise<{
	sizeBytes: number;
	percentUsed: number;
	warning: boolean;
}> {
	// D1 free tier: 500 MB per database
	const D1_FREE_TIER_LIMIT = 500 * 1024 * 1024; // 500 MB in bytes

	try {
		// Get page count and page size to calculate database size
		const pragmaResult = await db.batch([
			db.prepare('PRAGMA page_count'),
			db.prepare('PRAGMA page_size'),
		]);

		const pageCount = (pragmaResult[0].results[0] as any)?.page_count || 0;
		const pageSize = (pragmaResult[1].results[0] as any)?.page_size || 4096; // Default SQLite page size

		const sizeBytes = pageCount * pageSize;
		const percentUsed = (sizeBytes / D1_FREE_TIER_LIMIT) * 100;
		const warning = percentUsed > 80; // Warn at 80% capacity

		return {
			sizeBytes,
			percentUsed,
			warning,
		};
	} catch (error) {
		console.error('Failed to get database size:', error);
		// Return safe defaults if query fails
		return {
			sizeBytes: 0,
			percentUsed: 0,
			warning: false,
		};
	}
}

/**
 * Check if database is getting full (>80% capacity)
 */
export async function isDatabaseNearCapacity(db: D1Database): Promise<boolean> {
	const size = await getDatabaseSize(db);
	return size.warning;
}

/**
 * Email whitelist operations
 */

export interface WhitelistEntry {
	email: string;
	whitelisted_at: number;
	whitelisted_by: string;
	contact_id: string | null;
	notes: string | null;
}

/**
 * Check if an email is whitelisted
 */
export async function isEmailWhitelisted(db: D1Database, email: string): Promise<boolean> {
	const result = await db
		.prepare(`SELECT email FROM email_whitelist WHERE email = ?`)
		.bind(email.toLowerCase())
		.first();

	return result !== null;
}

/**
 * Add an email to the whitelist
 */
export async function addToWhitelist(
	db: D1Database,
	email: string,
	whitelistedBy: string,
	contactId?: string,
	notes?: string
): Promise<boolean> {
	const whitelistedAt = Date.now();

	try {
		await db
			.prepare(
				`INSERT INTO email_whitelist (email, whitelisted_at, whitelisted_by, contact_id, notes)
				VALUES (?, ?, ?, ?, ?)
				ON CONFLICT(email) DO UPDATE SET
					whitelisted_at = ?,
					whitelisted_by = ?,
					contact_id = COALESCE(?, contact_id),
					notes = COALESCE(?, notes)`
			)
			.bind(
				email.toLowerCase(),
				whitelistedAt,
				whitelistedBy,
				contactId || null,
				notes || null,
				whitelistedAt,
				whitelistedBy,
				contactId || null,
				notes || null
			)
			.run();

		return true;
	} catch (error) {
		console.error('Failed to add email to whitelist:', error);
		return false;
	}
}

/**
 * Remove an email from the whitelist
 */
export async function removeFromWhitelist(db: D1Database, email: string): Promise<boolean> {
	const result = await db
		.prepare(`DELETE FROM email_whitelist WHERE email = ?`)
		.bind(email.toLowerCase())
		.run();

	return result.success;
}

/**
 * Get all whitelisted emails
 */
export async function getAllWhitelistedEmails(db: D1Database): Promise<WhitelistEntry[]> {
	const result = await db
		.prepare(
			`SELECT email, whitelisted_at, whitelisted_by, contact_id, notes
			FROM email_whitelist
			ORDER BY whitelisted_at DESC`
		)
		.all<WhitelistEntry>();

	return result.results || [];
}
