/**
 * Express Routes using framework-agnostic handlers from api/
 * This is a thin adapter layer that maps Express requests to handler calls
 */
import { Router } from 'express';
import type { Storage as TaskStorage } from './storage.js';
/**
 * Create Express router using the framework-agnostic handlers
 */
export declare function createTaskRoutes(storage: TaskStorage): Router;
//# sourceMappingURL=routes-adapter.d.ts.map