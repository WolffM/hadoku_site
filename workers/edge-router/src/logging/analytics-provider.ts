/**
 * Analytics Engine Log Provider
 *
 * Uses Cloudflare Workers Analytics Engine (built-in, zero setup).
 * Free tier: 10M events/month, 30-day retention, SQL queries, real-time dashboards.
 *
 * Query logs: https://dash.cloudflare.com/[account]/analytics/workers
 */

import type { LogEntry } from './types';

interface AnalyticsEnv {
	ANALYTICS_ENGINE?: AnalyticsEngineDataset;
}

/**
 * Write logs to Workers Analytics Engine
 */
export function logToAnalytics(env: AnalyticsEnv, entry: LogEntry): void {
	// Analytics Engine is bound automatically as ANALYTICS_ENGINE
	// No setup required - just write data points

	// Note: Analytics Engine doesn't support env.ANALYTICS directly in typed workers
	// Instead we write to a dataset using the writeDataPoint API

	// Data points have: blobs (strings), doubles (numbers), indexes (filterable strings)
	const dataPoint = {
		// Blobs (strings, not indexed)
		blobs: [entry.path, entry.userAgent || ''],

		// Doubles (numeric values for aggregation)
		doubles: [entry.duration, entry.status],

		// Indexes (filterable dimensions - max 20 chars each)
		indexes: [
			entry.backend.substring(0, 20),
			entry.method.substring(0, 20),
			entry.timestamp.substring(0, 20),
		],
	};

	try {
		// Workers Analytics Engine binding (if available)
		if (env.ANALYTICS_ENGINE) {
			env.ANALYTICS_ENGINE.writeDataPoint(dataPoint);
		}
	} catch (error) {
		// Silently fail - logging shouldn't break requests
		console.error('[Analytics] Failed to write:', error);
	}
}
