/**
 * Pure business logic handlers for task operations
 * These functions are completely framework-agnostic and can be used with any web framework
 */
import type { Storage } from './storage.js';
import type { AuthContext, TasksFile, StatsFile, CreateTaskInput, UpdateTaskInput, ULID } from './types.js';
/**
 * Get all tasks for a user
 * Public users cannot access server storage
 */
export declare function getTasks(storage: Storage, auth: AuthContext): Promise<TasksFile>;
/**
 * Get stats for a user
 * Public users cannot access server storage
 */
export declare function getStats(storage: Storage, auth: AuthContext): Promise<StatsFile>;
/**
 * Create a new task
 * Public users cannot create tasks
 */
export declare function createTask(storage: Storage, auth: AuthContext, input: CreateTaskInput): Promise<{
    ok: boolean;
    id: ULID;
}>;
/**
 * Update an existing task
 * Public users cannot update tasks
 */
export declare function updateTask(storage: Storage, auth: AuthContext, taskId: ULID, input: UpdateTaskInput): Promise<{
    ok: boolean;
    message: string;
}>;
/**
 * Complete a task (removes from active tasks, records in stats)
 * Public users cannot complete tasks
 */
export declare function completeTask(storage: Storage, auth: AuthContext, taskId: ULID): Promise<{
    ok: boolean;
    message: string;
}>;
/**
 * Delete a task (removes from active tasks, records in stats)
 */
export declare function deleteTask(storage: Storage, auth: AuthContext, taskId: ULID): Promise<{
    ok: boolean;
    message: string;
}>;
/**
 * Clear all tasks (public users only, resets localStorage-style behavior)
 * This is only for public mode compatibility
 */
export declare function clearTasks(storage: Storage, auth: AuthContext): Promise<{
    ok: boolean;
    message: string;
}>;
//# sourceMappingURL=handlers.d.ts.map