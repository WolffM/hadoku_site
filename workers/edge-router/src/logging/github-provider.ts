/**
 * GitHub Log Provider
 * 
 * Stores logs as JSONL (JSON Lines) files in a GitHub repository.
 * One file per day: logs/requests/YYYY-MM-DD.jsonl
 * 
 * To switch providers: Create a new class implementing LogProvider interface.
 */

import type { LogEntry, LogProvider } from './types';

interface GitHubLogProviderConfig {
  repoOwner: string;
  repoName: string;
  token: string;
  basePath?: string; // Default: 'logs/requests'
}

export class GitHubLogProvider implements LogProvider {
  private config: GitHubLogProviderConfig;
  private basePath: string;
  
  constructor(config: GitHubLogProviderConfig) {
    this.config = config;
    this.basePath = config.basePath || 'logs/requests';
  }
  
  async writeLogs(entries: LogEntry[]): Promise<void> {
    if (entries.length === 0) return;
    
    const date = new Date().toISOString().split('T')[0];
    const filePath = `${this.basePath}/${date}.jsonl`;
    
    try {
      // Get current file (if exists)
      const getUrl = `https://api.github.com/repos/${this.config.repoOwner}/${this.config.repoName}/contents/${filePath}`;
      const getResp = await fetch(getUrl, {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'User-Agent': 'hadoku-edge-router',
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      let sha: string | undefined;
      let existingContent = '';
      
      if (getResp.ok) {
        const data: any = await getResp.json();
        sha = data.sha;
        // Decode base64 content
        existingContent = atob(data.content);
      } else if (getResp.status !== 404) {
        // Unexpected error (not just "file doesn't exist")
        throw new Error(`Failed to get log file: ${getResp.status} ${await getResp.text()}`);
      }
      
      // Append new log entries (JSONL format: one JSON object per line)
      let newContent = existingContent;
      for (const entry of entries) {
        newContent += JSON.stringify(entry) + '\n';
      }
      
      // Update or create file
      const putUrl = `https://api.github.com/repos/${this.config.repoOwner}/${this.config.repoName}/contents/${filePath}`;
      const putResp = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.config.token}`,
          'User-Agent': 'hadoku-edge-router',
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Add ${entries.length} request log(s)`,
          content: btoa(newContent),
          ...(sha && { sha }) // Include SHA if file exists
        })
      });
      
      if (!putResp.ok) {
        throw new Error(`Failed to write logs: ${putResp.status} ${await putResp.text()}`);
      }
      
    } catch (error) {
      // Log to console but don't throw - logging failures shouldn't break requests
      console.error('[GitHubLogProvider] Failed to write logs:', error);
    }
  }
  
  async isHealthy(): Promise<boolean> {
    try {
      const url = `https://api.github.com/repos/${this.config.repoOwner}/${this.config.repoName}`;
      const resp = await fetch(url, {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'User-Agent': 'hadoku-edge-router'
        }
      });
      return resp.ok;
    } catch {
      return false;
    }
  }
}
