/**
 * Task Routes - GET and POST endpoints for tasks
 */
import { Router } from 'express';
import * as TaskOps from '../handlers/task-operations';
import * as StatsOps from '../handlers/stats-operations';
import { createISO } from '../utils';
export function createTaskRoutes(dataAccess) {
    const router = Router();
    /**
     * GET / - Get tasks
     * Query param: ?userType=public|friend|admin
     */
    router.get('/', (req, res) => {
        try {
            const userType = req.query.userType || 'public';
            const tasks = dataAccess.getTasks(userType);
            res.json(tasks);
        }
        catch (error) {
            console.error('GET / error:', error);
            res.status(500).json({ error: String(error) });
        }
    });
    /**
     * GET /stats - Get statistics
     * Query param: ?userType=public|friend|admin
     */
    router.get('/stats', (req, res) => {
        try {
            const userType = req.query.userType || 'public';
            const stats = dataAccess.getStats(userType);
            res.json(stats);
        }
        catch (error) {
            console.error('GET /stats error:', error);
            res.status(500).json({ error: String(error) });
        }
    });
    /**
     * POST / - Create new task
     * Header: X-User-Type: public|friend|admin
     * Body: { title: string, tag?: string }
     */
    router.post('/', (req, res) => {
        try {
            const userType = req.headers['x-user-type'] || 'public';
            const { title, tag } = req.body;
            if (!title || typeof title !== 'string') {
                return res.status(400).json({ error: 'Title is required' });
            }
            const now = createISO();
            const data = dataAccess.getData(userType);
            const result = TaskOps.createTask(data.tasks, data.stats, { title, tag }, now);
            dataAccess.setData(userType, { tasks: result.tasks, stats: result.stats });
            res.json({ ok: true, id: result.id });
        }
        catch (error) {
            console.error('POST / error:', error);
            res.status(500).json({ error: String(error) });
        }
    });
    /**
     * POST /clear - Clear all tasks (public only)
     */
    router.post('/clear', (req, res) => {
        try {
            const userType = req.headers['x-user-type'] || 'public';
            if (userType !== 'public') {
                return res.status(403).json({ error: 'Only public users can clear tasks' });
            }
            const now = createISO();
            dataAccess.setTasks(userType, TaskOps.clearTasks(now));
            dataAccess.setStats(userType, StatsOps.clearStats(now));
            res.json({ ok: true });
        }
        catch (error) {
            console.error('POST /clear error:', error);
            res.status(500).json({ error: String(error) });
        }
    });
    return router;
}
//# sourceMappingURL=tasks.js.map