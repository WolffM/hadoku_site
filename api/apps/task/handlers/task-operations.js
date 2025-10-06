/**
 * Task Operations - Pure functions for task CRUD operations
 */
import { generateULID } from '../utils';
import * as StatsOps from './stats-operations';
/**
 * Create a new task
 */
export function createTask(tasks, stats, input, now) {
    const id = generateULID();
    const task = {
        id,
        title: input.title,
        tag: input.tag ?? null,
        state: 'Active',
        createdAt: now
    };
    return {
        tasks: {
            ...tasks,
            tasks: [task, ...tasks.tasks],
            updatedAt: now
        },
        stats: StatsOps.recordCreation(stats, task, now),
        id
    };
}
/**
 * Complete a task
 */
export function completeTask(tasks, stats, taskId, now) {
    const taskIndex = tasks.tasks.findIndex(t => t.id === taskId);
    if (taskIndex < 0)
        return null;
    const task = tasks.tasks[taskIndex];
    const updatedTask = {
        ...task,
        state: 'Completed',
        closedAt: now,
        updatedAt: now
    };
    const newTasks = [...tasks.tasks];
    newTasks.splice(taskIndex, 1);
    return {
        tasks: {
            ...tasks,
            tasks: newTasks,
            updatedAt: now
        },
        stats: StatsOps.recordCompletion(stats, updatedTask, now)
    };
}
/**
 * Update a task
 */
export function updateTask(tasks, stats, taskId, patch, now) {
    const taskIndex = tasks.tasks.findIndex(t => t.id === taskId);
    if (taskIndex < 0)
        return null;
    const task = tasks.tasks[taskIndex];
    const updatedTask = {
        ...task,
        ...patch,
        closedAt: patch.completed === true ? now : task.closedAt,
        updatedAt: now
    };
    const newTasks = [...tasks.tasks];
    newTasks[taskIndex] = updatedTask;
    return {
        tasks: {
            ...tasks,
            tasks: newTasks,
            updatedAt: now
        },
        stats: StatsOps.recordUpdate(stats, updatedTask, now, patch.completed === true)
    };
}
/**
 * Delete a task
 */
export function deleteTask(tasks, stats, taskId, now) {
    const taskIndex = tasks.tasks.findIndex(t => t.id === taskId);
    if (taskIndex < 0)
        return null;
    const task = tasks.tasks[taskIndex];
    const updatedTask = {
        ...task,
        state: 'Deleted',
        closedAt: now,
        updatedAt: now
    };
    const newTasks = [...tasks.tasks];
    newTasks.splice(taskIndex, 1);
    return {
        tasks: {
            ...tasks,
            tasks: newTasks,
            updatedAt: now
        },
        stats: StatsOps.recordDeletion(stats, updatedTask, now)
    };
}
/**
 * Clear all tasks (public only)
 */
export function clearTasks(now) {
    return {
        version: 1,
        tasks: [],
        updatedAt: now
    };
}
//# sourceMappingURL=task-operations.js.map