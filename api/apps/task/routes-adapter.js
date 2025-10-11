/**
 * Express Routes using framework-agnostic handlers from api/
 * This is a thin adapter layer that maps Express requests to handler calls
 */
import { Router } from 'express';
import { TaskHandlers } from './index.js';
/**
 * Create Express router using the framework-agnostic handlers
 */
export function createTaskRoutes(storage) {
    const router = Router();
    // GET / - Get all tasks
    router.get('/', async (req, res) => {
        const userType = req.query.userType || 'public';
        const auth = { userType };
        try {
            const tasks = await TaskHandlers.getTasks(storage, auth);
            res.json(tasks);
        }
        catch (error) {
            res.status(403).json({ error: error.message });
        }
    });
    // GET /stats - Get stats
    router.get('/stats', async (req, res) => {
        const userType = req.query.userType || 'public';
        const auth = { userType };
        try {
            const stats = await TaskHandlers.getStats(storage, auth);
            res.json(stats);
        }
        catch (error) {
            res.status(403).json({ error: error.message });
        }
    });
    // POST / - Create task
    router.post('/', async (req, res) => {
        const userType = req.headers['x-user-type'] || 'public';
        const auth = { userType };
        try {
            const result = await TaskHandlers.createTask(storage, auth, req.body);
            res.json(result);
        }
        catch (error) {
            res.status(403).json({ error: error.message });
        }
    });
    // POST /:id/complete - Complete task
    router.post('/:id/complete', async (req, res) => {
        const userType = req.headers['x-user-type'] || 'public';
        const auth = { userType };
        try {
            const result = await TaskHandlers.completeTask(storage, auth, req.params.id);
            res.json(result);
        }
        catch (error) {
            const status = error.message === 'Task not found' ? 404 : 403;
            res.status(status).json({ error: error.message });
        }
    });
    // PATCH /:id - Update task
    router.patch('/:id', async (req, res) => {
        const userType = req.headers['x-user-type'] || 'public';
        const auth = { userType };
        try {
            const result = await TaskHandlers.updateTask(storage, auth, req.params.id, req.body);
            res.json(result);
        }
        catch (error) {
            const status = error.message === 'Task not found' ? 404 : 403;
            res.status(status).json({ error: error.message });
        }
    });
    // DELETE /:id - Delete task
    router.delete('/:id', async (req, res) => {
        const userType = req.headers['x-user-type'] || 'public';
        const auth = { userType };
        try {
            const result = await TaskHandlers.deleteTask(storage, auth, req.params.id);
            res.json(result);
        }
        catch (error) {
            const status = error.message === 'Task not found' ? 404 : 403;
            res.status(status).json({ error: error.message });
        }
    });
    // POST /clear - Clear tasks (public only)
    router.post('/clear', async (req, res) => {
        const userType = req.headers['x-user-type'] || 'public';
        const auth = { userType };
        try {
            const result = await TaskHandlers.clearTasks(storage, auth);
            res.json(result);
        }
        catch (error) {
            res.status(403).json({ error: error.message });
        }
    });
    return router;
}
//# sourceMappingURL=routes-adapter.js.map