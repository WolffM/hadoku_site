/**
 * Database utility functions
 * Size monitoring and capacity management
 */

import { DATABASE_CONFIG } from '../constants';

export interface DatabaseSize {
	sizeBytes: number;
	percentUsed: number;
	warning: boolean;
}

/**
 * Get D1 database size info
 * Returns size in bytes and percentage of quota used
 */
export async function getDatabaseSize(db: D1Database): Promise<DatabaseSize> {
	try {
		// Get page count and page size to calculate database size
		const pragmaResult = await db.batch([
			db.prepare('PRAGMA page_count'),
			db.prepare('PRAGMA page_size'),
		]);

		const pageCount = (pragmaResult[0].results[0] as any)?.page_count || 0;
		const pageSize =
			(pragmaResult[1].results[0] as any)?.page_size || DATABASE_CONFIG.DEFAULT_PAGE_SIZE;

		const sizeBytes = pageCount * pageSize;
		const percentUsed = (sizeBytes / DATABASE_CONFIG.FREE_TIER_LIMIT_BYTES) * 100;
		const warning = percentUsed > DATABASE_CONFIG.CAPACITY_WARNING_THRESHOLD * 100;

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
 * Check if database is getting full (>configured threshold)
 */
export async function isDatabaseNearCapacity(db: D1Database): Promise<boolean> {
	const size = await getDatabaseSize(db);
	return size.warning;
}
