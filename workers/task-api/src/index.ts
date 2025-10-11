/**
 * Task API Worker - Universal Adapter
 *
 * This worker acts as a thin adapter layer. It imports the framework-agnostic
 * API logic from the `@wolffm/task` package and adapts it to the Hono/Cloudflare
 * Worker environment.
 *
 * The core business logic resides in the child package, not here.
 */
import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { TaskHandlers } from '@wolffm/task/api';
import type { TaskStorage, AuthContext, UserType, TasksFile, StatsFile } from '@wolffm/task/api';

interface Env {
	ADMIN_KEY: string;
	FRIEND_KEY: string;
	GITHUB_PAT: string;
	REPO_OWNER: string;
	REPO_NAME: string;
	REPO_BRANCH: string;
}

// Define a custom context type for Hono
type AppContext = {
	Bindings: Env;
	Variables: {
		authContext: AuthContext;
	};
};

const app = new Hono<AppContext>();

// 1. CORS Middleware
app.use(
	'*',
	cors({
		origin: [
			'https://hadoku.me',
			'https://task-api.hadoku.me',
			'http://localhost:*',
		],
		credentials: true,
	})
);

// 2. Authentication Middleware
app.use('*', async (c, next) => {
	const providedKey = c.req.header('X-Admin-Key') || c.req.query('key');
	let userType: UserType = 'public';

	if (providedKey === c.env.ADMIN_KEY) {
		userType = 'admin';
	} else if (providedKey === c.env.FRIEND_KEY) {
		userType = 'friend';
	}

	const authContext: AuthContext = {
		userType,
		isPublic: userType === 'public',
		isFriend: userType === 'friend',
		isAdmin: userType === 'admin',
	};

	c.set('authContext', authContext);
	await next();
});

// 3. GitHub Storage Implementation
// This is the parent's responsibility - adapt storage to the environment.
function createGitHubStorage(env: Env): TaskStorage {
	const baseUrl = `https://api.github.com/repos/${env.REPO_OWNER}/${env.REPO_NAME}/contents`;
	const headers = {
		Authorization: `token ${env.GITHUB_PAT}`,
		Accept: 'application/vnd.github.v3+json',
	};

	// Generic get/save helpers
	async function getFile<T>(path: string, defaultValue: T): Promise<T> {
		const response = await fetch(`${baseUrl}/${path}?ref=${env.REPO_BRANCH}`, { headers });
		if (!response.ok) return defaultValue;
		const data: any = await response.json();
		return JSON.parse(atob(data.content));
	}

	async function saveFile(path: string, content: any, message: string): Promise<void> {
		const getResponse = await fetch(`${baseUrl}/${path}?ref=${env.REPO_BRANCH}`, { headers });
		const sha = getResponse.ok ? (await getResponse.json() as any).sha : undefined;
		
		await fetch(`${baseUrl}/${path}`, {
			method: 'PUT',
			headers: { ...headers, 'Content-Type': 'application/json' },
			body: JSON.stringify({
				message,
				content: btoa(JSON.stringify(content, null, 2)),
				sha,
				branch: env.REPO_BRANCH,
			}),
		});
	}

	return {
		getTasks: (userType: UserType) => getFile(`data/${userType}/tasks.json`, {
			version: 1,
			tasks: [],
			updatedAt: new Date().toISOString(),
		} as TasksFile),

		saveTasks: (userType: UserType, tasks: TasksFile) =>
			saveFile(`data/${userType}/tasks.json`, tasks, `Update tasks for ${userType}`),

		getStats: (userType: UserType) => getFile(`data/${userType}/stats.json`, {
			version: 2,
			counters: { totalCreated: 0, totalCompleted: 0, totalDeleted: 0 },
			timeline: [],
			tasks: {},
			updatedAt: new Date().toISOString(),
		} as StatsFile),

		saveStats: (userType: UserType, stats: StatsFile) =>
			saveFile(`data/${userType}/stats.json`, stats, `Update stats for ${userType}`),
	};
}

// 4. Health Check
app.get('/task/api/health', (c) => {
	return c.json({
		status: 'ok',
		service: 'task-api-adapter',
		timestamp: new Date().toISOString(),
	});
});

// 5. Helper to get storage and auth from context
const getContext = (c: Context<AppContext>) => ({
	storage: createGitHubStorage(c.env),
	auth: c.get('authContext'),
});

// 6. Task API Routes - Thin adapters to TaskHandlers
app.get('/task/api', async (c) => {
	const { storage, auth } = getContext(c);
	const result = await TaskHandlers.getTasks(storage, auth);
	return c.json(result);
});

app.post('/task/api', async (c) => {
	const { storage, auth } = getContext(c);
	const input = await c.req.json();
	const result = await TaskHandlers.createTask(storage, auth, input);
	return c.json(result);
});

app.put('/task/api/:id', async (c) => {
	const { storage, auth } = getContext(c);
	const id = c.req.param('id');
	const input = await c.req.json();
	const result = await TaskHandlers.updateTask(storage, auth, id, input);
	return c.json(result);
});

app.post('/task/api/:id/complete', async (c) => {
	const { storage, auth } = getContext(c);
	const id = c.req.param('id');
	const result = await TaskHandlers.completeTask(storage, auth, id);
	return c.json(result);
});

app.delete('/task/api/:id', async (c) => {
	const { storage, auth } = getContext(c);
	const id = c.req.param('id');
	await TaskHandlers.deleteTask(storage, auth, id);
	return c.json({ success: true });
});

app.delete('/task/api', async (c) => {
	const { storage, auth } = getContext(c);
	await TaskHandlers.clearTasks(storage, auth);
	return c.json({ success: true });
});

app.get('/task/api/stats', async (c) => {
	const { storage, auth } = getContext(c);
	const result = await TaskHandlers.getStats(storage, auth);
	return c.json(result);
});

export default app;
