/**
 * Task Management Express Router
 * Main entry point for the Task API - now using framework-agnostic handlers
 */
import { Router } from 'express';
import type { RouterConfig } from './types.js';
import { SyncQueue } from './sync-queue.js';
export interface TaskRouter extends Router {
    syncQueue: SyncQueue;
    config: RouterConfig;
}
/**
 * Create and configure the Task router
 * This is now a thin adapter that connects Express to the framework-agnostic handlers
 */
export declare function createTaskRouter(config: RouterConfig): TaskRouter;
//# sourceMappingURL=router.d.ts.map