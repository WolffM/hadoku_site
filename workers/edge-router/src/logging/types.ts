/**
 * Logging Types
 *
 * Core types for the modular logging system.
 */

export interface LogEntry {
	timestamp: string;
	path: string;
	method: string;
	backend: 'tunnel' | 'worker' | 'lambda' | 'static' | 'session' | 'error';
	status: number;
	duration: number;
	userAgent?: string;
	error?: string;
}
