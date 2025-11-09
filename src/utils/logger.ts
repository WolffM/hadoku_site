/**
 * Client-Side Logging Utility
 *
 * Provides structured logging with admin-only visibility
 * Logs are only shown in console when user is authenticated as admin
 */

type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private static instance: Logger;
  private isAdmin: boolean = false;
  private prefix: string = '[Hadoku]';

  private constructor() {
    // Check if user has admin privileges
    this.checkAdminStatus();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Check if current user is admin by checking localStorage authKey
   */
  private checkAdminStatus() {
    if (typeof window === 'undefined') return;

    const authKey = localStorage.getItem('authKey');
    // Note: We don't check the actual key value here to avoid exposing it
    // Instead, we set a flag when user authenticates
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
  }

  /**
   * Set admin status (should be called after authentication)
   */
  setAdminStatus(isAdmin: boolean) {
    this.isAdmin = isAdmin;
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    }
  }

  /**
   * Format log message with context
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `${this.prefix} [${timestamp}] [${level}] ${message}${contextStr}`;
  }

  /**
   * Log error message (always shown)
   */
  error(message: string, context?: LogContext) {
    const formatted = this.formatMessage('ERROR', message, context);
    console.error(formatted);
  }

  /**
   * Log warning message (admin only)
   */
  warn(message: string, context?: LogContext) {
    if (!this.isAdmin) return;
    const formatted = this.formatMessage('WARN', message, context);
    console.warn(formatted);
  }

  /**
   * Log info message (admin only)
   */
  info(message: string, context?: LogContext) {
    if (!this.isAdmin) return;
    const formatted = this.formatMessage('INFO', message, context);
    console.log(formatted);
  }

  /**
   * Log debug message (admin only)
   */
  debug(message: string, context?: LogContext) {
    if (!this.isAdmin) return;
    const formatted = this.formatMessage('DEBUG', message, context);
    console.log(formatted);
  }

  /**
   * Log API request (admin only)
   */
  apiRequest(method: string, path: string, context?: LogContext) {
    this.info(`API ${method} ${path}`, context);
  }

  /**
   * Log API response (admin only)
   */
  apiResponse(method: string, path: string, status: number, context?: LogContext) {
    if (status >= 400) {
      this.error(`API ${method} ${path} failed with ${status}`, context);
    } else {
      this.info(`API ${method} ${path} → ${status}`, context);
    }
  }

  /**
   * Log component lifecycle (admin only)
   */
  component(event: 'mount' | 'unmount' | 'update', componentName: string, context?: LogContext) {
    this.debug(`Component ${componentName} ${event}`, context);
  }

  /**
   * Log preference change (admin only)
   */
  preference(key: string, value: any) {
    this.info(`Preference changed: ${key}`, { value });
  }

  /**
   * Log session event (admin only)
   */
  session(event: 'created' | 'refreshed' | 'migrated', sessionId?: string, context?: LogContext) {
    this.info(`Session ${event}`, { sessionId: sessionId?.substring(0, 16) + '...', ...context });
  }

  /**
   * Log fallback/retry (warning)
   */
  fallback(message: string, context?: LogContext) {
    this.warn(`FALLBACK: ${message}`, context);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
