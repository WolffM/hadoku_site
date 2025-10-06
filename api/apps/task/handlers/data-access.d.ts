/**
 * Data Access Layer - Unified interface for public vs file-based storage
 */
import type { RouterConfig, TasksFile, StatsFile, UserType } from '../types.js';
import { SyncQueue } from '../sync-queue.js';
export declare class DataAccess {
    private config;
    private syncQueue;
    constructor(config: RouterConfig, syncQueue: SyncQueue);
    /**
     * Get tasks data for any user type
     */
    getTasks(userType: UserType): TasksFile;
    /**
     * Get stats data for any user type
     */
    getStats(userType: UserType): StatsFile;
    /**
     * Set tasks data for any user type
     */
    setTasks(userType: UserType, tasks: TasksFile): void;
    /**
     * Set stats data for any user type
     */
    setStats(userType: UserType, stats: StatsFile): void;
    /**
     * Get both tasks and stats in one call
     */
    getData(userType: UserType): {
        tasks: TasksFile;
        stats: StatsFile;
    };
    /**
     * Set both tasks and stats in one call
     */
    setData(userType: UserType, data: {
        tasks: TasksFile;
        stats: StatsFile;
    }): void;
}
//# sourceMappingURL=data-access.d.ts.map