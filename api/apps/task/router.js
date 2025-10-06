/**
 * Task Management Express Router
 * Main entry point for the Task API
 */
import { Router } from 'express';
import { ensureUserDataExists } from './storage.js';
import { SyncQueue } from './sync-queue.js';
import { DataAccess } from './handlers/data-access.js';
import { createTaskRoutes } from './routes/tasks.js';
import { createTaskOperationRoutes } from './routes/task-operations.js';
/**
 * Create and configure the Task router
 */
export function createTaskRouter(config) {
    const router = Router();
    const syncQueue = new SyncQueue();
    // Attach sync queue and config to router
    router.syncQueue = syncQueue;
    router.config = config;
    // Ensure friend/admin data directories exist
    ensureUserDataExists('friend', config.dataPath);
    ensureUserDataExists('admin', config.dataPath);
    // Create data access layer
    const dataAccess = new DataAccess(config, syncQueue);
    // Mount routes
    router.use('/', createTaskRoutes(dataAccess));
    router.use('/', createTaskOperationRoutes(dataAccess));
    return router;
}
//# sourceMappingURL=router.js.map