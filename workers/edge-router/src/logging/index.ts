/**
 * Logging Module
 *
 * Uses Cloudflare Workers Analytics Engine for zero-setup logging.
 */

export type { LogEntry } from './types';
export { logToAnalytics } from './analytics-provider';
