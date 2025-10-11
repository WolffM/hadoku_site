/**
 * Stats Operations - Pure functions for updating stats
 */
import type { StatsFile, Task } from '../types.js';
/**
 * Record task creation in stats
 */
export declare function recordCreation(stats: StatsFile, task: Task, now: string): StatsFile;
/**
 * Record task completion in stats
 */
export declare function recordCompletion(stats: StatsFile, task: Task, now: string): StatsFile;
/**
 * Record task update in stats
 */
export declare function recordUpdate(stats: StatsFile, task: Task, now: string, isCompletion: boolean): StatsFile;
/**
 * Record task deletion in stats
 */
export declare function recordDeletion(stats: StatsFile, task: Task, now: string): StatsFile;
/**
 * Clear all stats (public only)
 */
export declare function clearStats(now: string): StatsFile;
//# sourceMappingURL=stats-operations.d.ts.map