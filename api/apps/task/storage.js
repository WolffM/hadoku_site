/**
 * Storage layer for Task Router
 * Handles both in-memory (public) and file-based (friend/admin) storage
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createEmptyTasksFile, createEmptyStatsFile } from './utils.js';
// In-memory storage for public users (singleton)
const publicData = {
    tasks: createEmptyTasksFile(),
    stats: createEmptyStatsFile()
};
/**
 * Get in-memory data for public users
 */
export function getPublicData(dataType) {
    return publicData[dataType];
}
/**
 * Set in-memory data for public users
 */
export function setPublicData(dataType, data) {
    publicData[dataType] = data;
}
/**
 * Ensure user data directory exists
 */
function ensureUserDirectory(userType, basePath) {
    const userDir = join(basePath, userType);
    if (!existsSync(userDir)) {
        mkdirSync(userDir, { recursive: true });
    }
}
/**
 * Ensure user data files exist with default content
 */
export function ensureUserDataExists(userType, basePath) {
    ensureUserDirectory(userType, basePath);
    const tasksPath = join(basePath, userType, 'tasks.json');
    const statsPath = join(basePath, userType, 'stats.json');
    if (!existsSync(tasksPath)) {
        writeFileSync(tasksPath, JSON.stringify(createEmptyTasksFile(), null, 2));
    }
    if (!existsSync(statsPath)) {
        writeFileSync(statsPath, JSON.stringify(createEmptyStatsFile(), null, 2));
    }
}
/**
 * Read JSON file for friend/admin users
 */
export function readUserData(userType, dataType, basePath) {
    const filePath = join(basePath, userType, `${dataType}.json`);
    try {
        const content = readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        // If file doesn't exist, create it
        ensureUserDataExists(userType, basePath);
        // Return default data
        return dataType === 'tasks' ? createEmptyTasksFile() : createEmptyStatsFile();
    }
}
/**
 * Write JSON file for friend/admin users
 */
export function writeUserData(userType, dataType, data, basePath) {
    ensureUserDirectory(userType, basePath);
    const filePath = join(basePath, userType, `${dataType}.json`);
    try {
        writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
    catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        throw error;
    }
}
//# sourceMappingURL=storage.js.map