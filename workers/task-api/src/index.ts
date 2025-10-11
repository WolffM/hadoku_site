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
import {
	createTaskRouter,
	GitHubStorage,
	type TaskAuthContext,
} from '@wolffm/task/api';

interface Env {
	ADMIN_KEY: string;
	FRIEND_KEY: string;
	GITHUB_PAT: string;
	REPO_OWNER: string;
	REPO_NAME: string;
	REPO_BRANCH: string;
}

type UserType = 'public' | 'friend' | 'admin';

// Define a custom context type for Hono
type AppContext = {
	Bindings: Env;
	Variables: {
		authContext: TaskAuthContext;
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

	const authContext: TaskAuthContext = {
		userType,
		isPublic: userType === 'public',
		isFriend: userType === 'friend',
		isAdmin: userType === 'admin',
	};

	c.set('authContext', authContext);
	await next();
});

// 3. Health Check
app.get('/health', (c) => {
	return c.json({
		status: 'ok',
		service: 'task-api-adapter',
		timestamp: new Date().toISOString(),
	});
});

// 4. Create and Mount the Task Router
// The core of the adapter pattern.
const taskRouter = createTaskRouter<Context<AppContext>>({
	// The storage implementation is specific to this parent repository.
	// It uses the GitHub PAT from the worker's environment.
	storageFactory: (c) => {
		const authContext = c.get('authContext');
		return new GitHubStorage({
			userType: authContext.userType,
			github: {
				owner: c.env.REPO_OWNER,
				repo: c.env.REPO_NAME,
				branch: c.env.REPO_BRANCH,
				token: c.env.GITHUB_PAT,
			},
		});
	},
});

// Mount the entire task API logic under the root.
app.route('/', taskRouter);

export default app;
