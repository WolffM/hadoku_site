/**
 * Storage layer for Task Router
 * Handles both in-memory (public) and file-based (friend/admin) storage
 */
import type { TasksFile, StatsFile, DataType, UserType } from './types.js';
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
//# sourceMappingURL=storage.d.ts.map