/**
 * Pure business logic handlers for task operations
 * These functions are completely framework-agnostic and can be used with any web framework
 */
import { generateULID, now } from './utils.js';
/**
 * Update stats after a task creation
 */
function recordCreation(stats, task, timestamp) {
    return {
        ...stats,
        updatedAt: timestamp,
        counters: {
            ...stats.counters,
            created: stats.counters.created + 1
        },
        timeline: [
            ...stats.timeline,
            { t: timestamp, event: 'created', id: task.id }
        ],
        tasks: {
            ...stats.tasks,
            [task.id]: { ...task }
        }
    };
}
/**
 * Update stats after a task completion
 */
function recordCompletion(stats, task, timestamp) {
    return {
        ...stats,
        updatedAt: timestamp,
        counters: {
            ...stats.counters,
            completed: stats.counters.completed + 1
        },
        timeline: [
            ...stats.timeline,
            { t: timestamp, event: 'completed', id: task.id }
        ],
        tasks: {
            ...stats.tasks,
            [task.id]: { ...task }
        }
    };
}
/**
 * Update stats after a task update
 */
function recordUpdate(stats, task, timestamp) {
    return {
        ...stats,
        updatedAt: timestamp,
        counters: {
            ...stats.counters,
            edited: stats.counters.edited + 1
        },
        timeline: [
            ...stats.timeline,
            { t: timestamp, event: 'edited', id: task.id }
        ],
        tasks: {
            ...stats.tasks,
            [task.id]: { ...task }
        }
    };
}
/**
 * Update stats after a task deletion
 */
function recordDeletion(stats, task, timestamp) {
    return {
        ...stats,
        updatedAt: timestamp,
        counters: {
            ...stats.counters,
            deleted: stats.counters.deleted + 1
        },
        timeline: [
            ...stats.timeline,
            { t: timestamp, event: 'deleted', id: task.id }
        ],
        tasks: {
            ...stats.tasks,
            [task.id]: { ...task }
        }
    };
}
// --- Read Operations ---
/**
 * Get all tasks for a user
 * Public users cannot access server storage
 */
export async function getTasks(storage, auth) {
    if (auth.userType === 'public') {
        throw new Error('Forbidden: Public users cannot access server storage');
    }
    return await storage.getTasks(auth.userType);
}
/**
 * Get stats for a user
 * Public users cannot access server storage
 */
export async function getStats(storage, auth) {
    if (auth.userType === 'public') {
        throw new Error('Forbidden: Public users cannot access server storage');
    }
    return await storage.getStats(auth.userType);
}
// --- Write Operations ---
/**
 * Create a new task
 * Public users cannot create tasks
 */
export async function createTask(storage, auth, input) {
    if (auth.userType === 'public') {
        throw new Error('Forbidden: Public users cannot create tasks');
    }
    const timestamp = now();
    const tasks = await storage.getTasks(auth.userType);
    const stats = await storage.getStats(auth.userType);
    const id = generateULID();
    const newTask = {
        id,
        title: input.title,
        tag: input.tag ?? null,
        state: 'Active',
        createdAt: timestamp
    };
    const updatedTasks = {
        ...tasks,
        tasks: [newTask, ...tasks.tasks],
        updatedAt: timestamp
    };
    const updatedStats = recordCreation(stats, newTask, timestamp);
    await storage.saveTasks(auth.userType, updatedTasks);
    await storage.saveStats(auth.userType, updatedStats);
    return { ok: true, id };
}
/**
 * Update an existing task
 * Public users cannot update tasks
 */
export async function updateTask(storage, auth, taskId, input) {
    if (auth.userType === 'public') {
        throw new Error('Forbidden: Public users cannot update tasks');
    }
    const timestamp = now();
    const tasks = await storage.getTasks(auth.userType);
    const stats = await storage.getStats(auth.userType);
    const taskIndex = tasks.tasks.findIndex(t => t.id === taskId);
    if (taskIndex < 0) {
        throw new Error('Task not found');
    }
    const task = tasks.tasks[taskIndex];
    const updatedTask = {
        ...task,
        ...input,
        updatedAt: timestamp
    };
    const newTasks = [...tasks.tasks];
    newTasks[taskIndex] = updatedTask;
    const updatedTasksFile = {
        ...tasks,
        tasks: newTasks,
        updatedAt: timestamp
    };
    const updatedStats = recordUpdate(stats, updatedTask, timestamp);
    await storage.saveTasks(auth.userType, updatedTasksFile);
    await storage.saveStats(auth.userType, updatedStats);
    return { ok: true, message: `Task ${taskId} updated` };
}
/**
 * Complete a task (removes from active tasks, records in stats)
 * Public users cannot complete tasks
 */
export async function completeTask(storage, auth, taskId) {
    if (auth.userType === 'public') {
        throw new Error('Forbidden: Public users cannot complete tasks');
    }
    const timestamp = now();
    const tasks = await storage.getTasks(auth.userType);
    const stats = await storage.getStats(auth.userType);
    const taskIndex = tasks.tasks.findIndex(t => t.id === taskId);
    if (taskIndex < 0) {
        throw new Error('Task not found');
    }
    const task = tasks.tasks[taskIndex];
    const completedTask = {
        ...task,
        state: 'Completed',
        closedAt: timestamp,
        updatedAt: timestamp
    };
    const newTasks = [...tasks.tasks];
    newTasks.splice(taskIndex, 1); // Remove from active tasks
    const updatedTasksFile = {
        ...tasks,
        tasks: newTasks,
        updatedAt: timestamp
    };
    const updatedStats = recordCompletion(stats, completedTask, timestamp);
    await storage.saveTasks(auth.userType, updatedTasksFile);
    await storage.saveStats(auth.userType, updatedStats);
    return { ok: true, message: `Task ${taskId} completed` };
}
/**
 * Delete a task (removes from active tasks, records in stats)
 */
export async function deleteTask(storage, auth, taskId) {
    const timestamp = now();
    const tasks = await storage.getTasks(auth.userType);
    const stats = await storage.getStats(auth.userType);
    const taskIndex = tasks.tasks.findIndex(t => t.id === taskId);
    if (taskIndex < 0) {
        throw new Error('Task not found');
    }
    const task = tasks.tasks[taskIndex];
    const deletedTask = {
        ...task,
        state: 'Deleted',
        closedAt: timestamp,
        updatedAt: timestamp
    };
    const newTasks = [...tasks.tasks];
    newTasks.splice(taskIndex, 1); // Remove from active tasks
    const updatedTasksFile = {
        ...tasks,
        tasks: newTasks,
        updatedAt: timestamp
    };
    const updatedStats = recordDeletion(stats, deletedTask, timestamp);
    await storage.saveTasks(auth.userType, updatedTasksFile);
    await storage.saveStats(auth.userType, updatedStats);
    return { ok: true, message: `Task ${taskId} deleted` };
}
/**
 * Clear all tasks (public users only, resets localStorage-style behavior)
 * This is only for public mode compatibility
 */
export async function clearTasks(storage, auth) {
    if (auth.userType !== 'public') {
        throw new Error('Forbidden: Only public users can clear tasks');
    }
    const timestamp = now();
    const emptyTasks = {
        version: 1,
        updatedAt: timestamp,
        tasks: []
    };
    const emptyStats = {
        version: 2,
        updatedAt: timestamp,
        counters: { created: 0, completed: 0, edited: 0, deleted: 0 },
        timeline: [],
        tasks: {}
    };
    await storage.saveTasks(auth.userType, emptyTasks);
    await storage.saveStats(auth.userType, emptyStats);
    return { ok: true, message: 'Public tasks cleared' };
}
//# sourceMappingURL=handlers.js.map