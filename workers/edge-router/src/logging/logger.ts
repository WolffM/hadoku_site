/**
 * Request Logger
 * 
 * Batches and logs requests with smart sampling.
 * Provider-agnostic design allows easy switching to different backends.
 */

import type { LogEntry, LogProvider, LogConfig } from './types';

const DEFAULT_CONFIG: LogConfig = {
  enabled: true,
  sampleRate: 0.1,        // 10% of successful requests
  errorSampleRate: 1.0,   // 100% of errors
  maxBatchSize: 50        // Flush after 50 logs
};

export class RequestLogger {
  private provider: LogProvider;
  private config: LogConfig;
  private batch: LogEntry[] = [];
  
  constructor(provider: LogProvider, config: Partial<LogConfig> = {}) {
    this.provider = provider;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * Log a request with smart sampling
   */
  async log(entry: LogEntry): Promise<void> {
    if (!this.config.enabled) return;
    
    // Determine if we should log this request
    const isError = entry.status >= 400;
    const sampleRate = isError ? this.config.errorSampleRate : this.config.sampleRate;
    
    if (Math.random() > sampleRate) {
      return; // Skip this request
    }
    
    // Add to batch
    this.batch.push(entry);
    
    // Flush if batch is full
    if (this.batch.length >= this.config.maxBatchSize) {
      await this.flush();
    }
  }
  
  /**
   * Force flush all pending logs
   */
  async flush(): Promise<void> {
    if (this.batch.length === 0) return;
    
    const toWrite = [...this.batch];
    this.batch = [];
    
    try {
      await this.provider.writeLogs(toWrite);
    } catch (error) {
      console.error('[RequestLogger] Failed to flush logs:', error);
      // Don't throw - logging failures shouldn't break requests
    }
  }
  
  /**
   * Get current batch size (for debugging)
   */
  getBatchSize(): number {
    return this.batch.length;
  }
}
