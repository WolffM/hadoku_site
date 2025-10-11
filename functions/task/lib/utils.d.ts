/**
 * Utility functions for the Task Router
 */
/**
 * Generate a ULID (Universally Unique Lexicographically Sortable Identifier)
 * Format: TTTTTTTTRRRRRRRRRRRRRRRRRR (8 timestamp + 18 random chars)
 */
export declare function generateULID(): string;
/**
 * Get current ISO 8601 timestamp
 */
export declare function createISO(): string;
/**
 * Create empty tasks file structure
 */
export declare function createEmptyTasksFile(): {
    version: number;
    tasks: never[];
    updatedAt: string;
};
/**
 * Create empty stats file structure
 */
export declare function createEmptyStatsFile(): {
    version: number;
    counters: {
        created: number;
        completed: number;
        edited: number;
        deleted: number;
    };
    timeline: never[];
    tasks: {};
    updatedAt: string;
};
//# sourceMappingURL=utils.d.ts.map