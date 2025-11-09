/**
 * Client-Side Logging Utility for UI Components
 *
 * Provides structured logging with admin-only visibility
 * Logs are shown in development mode or when user is authenticated as admin
 */
interface LogContext {
    [key: string]: any;
}
declare class Logger {
    private static instance;
    private isAdmin;
    private prefix;
    private isDevelopment;
    private constructor();
    static getInstance(): Logger;
    /**
     * Check if current user has admin status in localStorage
     */
    private checkAdminStatus;
    /**
     * Set admin status (should be called after authentication)
     * Persists to localStorage
     */
    setAdminStatus(isAdmin: boolean): void;
    /**
     * Check if logging is enabled (development or admin)
     */
    private shouldLog;
    /**
     * Format log message with timestamp and context
     */
    private formatMessage;
    /**
     * Log error message (always shown)
     */
    error(message: string, context?: LogContext): void;
    /**
     * Log warning message (development or admin only)
     */
    warn(message: string, context?: LogContext): void;
    /**
     * Log info message (development or admin only)
     */
    info(message: string, context?: LogContext): void;
    /**
     * Log debug message (development or admin only)
     */
    debug(message: string, context?: LogContext): void;
    /**
     * Log component lifecycle event (development or admin only)
     */
    component(event: 'mount' | 'unmount' | 'update', componentName: string, context?: LogContext): void;
    /**
     * Log theme change (development or admin only)
     */
    theme(theme: string, context?: LogContext): void;
    /**
     * Log preference change (development or admin only)
     */
    preference(key: string, value: any): void;
    /**
     * Log API request (development or admin only)
     */
    apiRequest(method: string, path: string, context?: LogContext): void;
    /**
     * Log API response (development or admin only, errors always shown)
     */
    apiResponse(method: string, path: string, status: number, context?: LogContext): void;
    /**
     * Log fallback/retry (development or admin only)
     */
    fallback(message: string, context?: LogContext): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map