/**
 * GitHub Sync Queue
 * Manages batching of file updates to GitHub API
 */
import type { GitHubConfig, DataType, UserType } from './types';
/**
 * Sync Queue class
 * Tracks which files need to be synced to GitHub
 */
export declare class SyncQueue {
    private queue;
    /**
     * Add a file to the sync queue
     */
    add(userType: UserType, dataType: DataType): void;
    /**
     * Get the number of items in the queue
     */
    size(): number;
    /**
     * Clear the queue without syncing
     */
    clear(): void;
    /**
     * Flush all queued files to GitHub
     */
    flush(basePath: string, githubConfig?: GitHubConfig): Promise<void>;
}
//# sourceMappingURL=sync-queue.d.ts.map