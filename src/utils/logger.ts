/**
 * Logging utility - re-exported from @wolffm/task-ui-components
 *
 * This module provides a thin wrapper around the logger from @wolffm/task-ui-components
 * to maintain backward compatibility with existing code.
 *
 * The package logger provides structured logging with admin-only visibility:
 * - Logs shown in development mode (localhost) OR when user is authenticated as admin
 * - Call logger.setAdminStatus(true) after authentication
 */

export { logger } from '@wolffm/task-ui-components';
