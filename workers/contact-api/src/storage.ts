/**
 * D1 database operations for contact submissions
 */

export interface StoredSubmission {
	id: string;
	name: string;
	email: string;
	message: string;
	status: 'unread' | 'read' | 'archived';
	created_at: number;
	ip_address: string | null;
	user_agent: string | null;
	referrer: string | null;
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
 */
export async function getAllSubmissions(
	db: D1Database,
	limit: number = 100,
	offset: number = 0
): Promise<StoredSubmission[]> {
	const result = await db
		.prepare(
			`SELECT * FROM contact_submissions
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
 * Delete a submission permanently
 */
export async function deleteSubmission(db: D1Database, id: string): Promise<boolean> {
	const result = await db.prepare(`DELETE FROM contact_submissions WHERE id = ?`).bind(id).run();

	return result.success;
}

/**
 * Get count of submissions by status
 */
export async function getSubmissionStats(db: D1Database): Promise<{
	total: number;
	unread: number;
	read: number;
	archived: number;
}> {
	const result = await db
		.prepare(
			`SELECT
				COUNT(*) as total,
				SUM(CASE WHEN status = 'unread' THEN 1 ELSE 0 END) as unread,
				SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read,
				SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived
			FROM contact_submissions`
		)
		.first<{ total: number; unread: number; read: number; archived: number }>();

	return result || { total: 0, unread: 0, read: 0, archived: 0 };
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
