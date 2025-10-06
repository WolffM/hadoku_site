/**
 * Data Access Layer - Unified interface for public vs file-based storage
 */
import { getPublicData, setPublicData, readUserData, writeUserData } from '../storage';
export class DataAccess {
    config;
    syncQueue;
    constructor(config, syncQueue) {
        this.config = config;
        this.syncQueue = syncQueue;
    }
    /**
     * Get tasks data for any user type
     */
    getTasks(userType) {
        if (userType === 'public') {
            return getPublicData('tasks');
        }
        return readUserData(userType, 'tasks', this.config.dataPath);
    }
    /**
     * Get stats data for any user type
     */
    getStats(userType) {
        if (userType === 'public') {
            return getPublicData('stats');
        }
        return readUserData(userType, 'stats', this.config.dataPath);
    }
    /**
     * Set tasks data for any user type
     */
    setTasks(userType, tasks) {
        if (userType === 'public') {
            setPublicData('tasks', tasks);
        }
        else {
            writeUserData(userType, 'tasks', tasks, this.config.dataPath);
            this.syncQueue.add(userType, 'tasks');
        }
    }
    /**
     * Set stats data for any user type
     */
    setStats(userType, stats) {
        if (userType === 'public') {
            setPublicData('stats', stats);
        }
        else {
            writeUserData(userType, 'stats', stats, this.config.dataPath);
            this.syncQueue.add(userType, 'stats');
        }
    }
    /**
     * Get both tasks and stats in one call
     */
    getData(userType) {
        return {
            tasks: this.getTasks(userType),
            stats: this.getStats(userType)
        };
    }
    /**
     * Set both tasks and stats in one call
     */
    setData(userType, data) {
        this.setTasks(userType, data.tasks);
        this.setStats(userType, data.stats);
    }
}
//# sourceMappingURL=data-access.js.map