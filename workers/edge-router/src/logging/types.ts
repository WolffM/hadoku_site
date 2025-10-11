/**
 * Logging Types
 * 
 * Core types for the modular logging system.
 */

export interface LogEntry {
  timestamp: string;
  path: string;
  method: string;
  backend: 'tunnel' | 'worker' | 'lambda' | 'static' | 'error';
  status: number;
  duration: number;
  userAgent?: string;
  error?: string;
}

export interface LogConfig {
  enabled: boolean;
  sampleRate: number; // 0.0 to 1.0 (e.g., 0.1 = 10%)
  errorSampleRate: number; // Sample rate for errors (typically 1.0 = 100%)
  maxBatchSize: number;
}

/**
 * Log Provider Interface
 * 
 * Implement this interface to create a new logging provider.
 * Examples: GitHubLogProvider, R2LogProvider, SplunkLogProvider, etc.
 */
export interface LogProvider {
  /**
   * Write a batch of log entries to the provider
   * @param entries Array of log entries to write
   * @returns Promise that resolves when logs are written
   */
  writeLogs(entries: LogEntry[]): Promise<void>;
  
  /**
   * Optional: Flush any pending logs
   * Called when the Worker is about to terminate (if supported)
   */
  flush?(): Promise<void>;
  
  /**
   * Optional: Health check for the provider
   * @returns true if provider is available
   */
  isHealthy?(): Promise<boolean>;
}
