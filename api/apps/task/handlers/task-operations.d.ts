/**
 * Task Operations - Pure functions for task CRUD operations
 */
import type { TasksFile, StatsFile } from '../types';
export interface TaskOperationResult {
    tasks: TasksFile;
    stats: StatsFile;
}
/**
 * Create a new task
 */
export declare function createTask(tasks: TasksFile, stats: StatsFile, input: {
    title: string;
    tag?: string;
}, now: string): TaskOperationResult & {
    id: string;
};
/**
 * Complete a task
 */
export declare function completeTask(tasks: TasksFile, stats: StatsFile, taskId: string, now: string): TaskOperationResult | null;
/**
 * Update a task
 */
export declare function updateTask(tasks: TasksFile, stats: StatsFile, taskId: string, patch: {
    title?: string;
    tag?: string;
    completed?: boolean;
}, now: string): TaskOperationResult | null;
/**
 * Delete a task
 */
export declare function deleteTask(tasks: TasksFile, stats: StatsFile, taskId: string, now: string): TaskOperationResult | null;
/**
 * Clear all tasks (public only)
 */
export declare function clearTasks(now: string): TasksFile;
//# sourceMappingURL=task-operations.d.ts.map