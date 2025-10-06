/**
 * Task Management Express Router
 * Main entry point for the Task API
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
 */
export declare function createTaskRouter(config: RouterConfig): TaskRouter;
//# sourceMappingURL=router.d.ts.map