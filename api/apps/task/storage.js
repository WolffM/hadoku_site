/**
 * Storage layer for Task Router
 * Handles both in-memory (public) and file-based (friend/admin) storage
 * Also provides Storage interface implementation
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { now } from './utils.js';
/**
 * Create empty tasks file structure
 */
function createEmptyTasksFile() {
    return {
        version: 1,
        tasks: [],
        updatedAt: now()
    };
}
/**
 * Create empty stats file structure
 */
function createEmptyStatsFile() {
    return {
        version: 2,
        counters: {
            created: 0,
            completed: 0,
            edited: 0,
            deleted: 0
        },
        timeline: [],
        tasks: {},
        updatedAt: now()
    };
}
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
export function createStorage(config, syncQueue) {
    const basePath = config.dataPath;
    return {
        async getTasks(userType) {
            if (userType === 'public') {
                return publicData.tasks;
            }
            ensureUserDataExists(userType, basePath);
            return readUserData(userType, 'tasks', basePath);
        },
        async saveTasks(userType, data) {
            if (userType === 'public') {
                publicData.tasks = data;
                return;
            }
            writeUserData(userType, 'tasks', data, basePath);
            if (config.githubConfig && syncQueue) {
                syncQueue.add(userType, 'tasks');
            }
        },
        async getStats(userType) {
            if (userType === 'public') {
                return publicData.stats;
            }
            ensureUserDataExists(userType, basePath);
            return readUserData(userType, 'stats', basePath);
        },
        async saveStats(userType, data) {
            if (userType === 'public') {
                publicData.stats = data;
                return;
            }
            writeUserData(userType, 'stats', data, basePath);
            if (config.githubConfig && syncQueue) {
                syncQueue.add(userType, 'stats');
            }
        }
    };
}
//# sourceMappingURL=storage.js.map