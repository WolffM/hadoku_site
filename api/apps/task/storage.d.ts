/**
 * Storage layer for Task Router
 * Handles both in-memory (public) and file-based (friend/admin) storage
 * Also provides Storage interface implementation
 */
import type { TasksFile, StatsFile, DataType, UserType, RouterConfig } from './types.js';
import type { SyncQueue } from './sync-queue.js';
/**
 * Storage interface - defines the contract for data persistence
 */
export interface Storage {
    getTasks(userType: UserType): Promise<TasksFile>;
    saveTasks(userType: UserType, tasks: TasksFile): Promise<void>;
    getStats(userType: UserType): Promise<StatsFile>;
    saveStats(userType: UserType, stats: StatsFile): Promise<void>;
}
/**
 * Get in-memory data for public users
 */
export declare function getPublicData(dataType: DataType): TasksFile | StatsFile;
/**
 * Set in-memory data for public users
 */
export declare function setPublicData(dataType: DataType, data: TasksFile | StatsFile): void;
/**
 * Ensure user data files exist with default content
 */
export declare function ensureUserDataExists(userType: UserType, basePath: string): void;
/**
 * Read JSON file for friend/admin users
 */
export declare function readUserData(userType: UserType, dataType: DataType, basePath: string): TasksFile | StatsFile;
/**
 * Write JSON file for friend/admin users
 */
export declare function writeUserData(userType: UserType, dataType: DataType, data: TasksFile | StatsFile, basePath: string): void;
export declare function createStorage(config: RouterConfig, syncQueue: SyncQueue): Storage;
//# sourceMappingURL=storage.d.ts.map