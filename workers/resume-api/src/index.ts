/**
 * Resume API Worker
 *
 * LLM-powered chatbot for answering questions about a resume.
 * Uses Groq API with OpenAI SDK for LLM calls.
 *
 * Endpoints:
 * - GET  /resume/api/           - Health check
 * - POST /resume/api/chat       - Send chat messages (rate limited)
 * - GET  /resume/api/resume     - Get resume markdown
 * - GET  /resume/api/system-prompt - Get full system prompt
 */

import { Hono } from 'hono';
import { createCorsMiddleware, DEFAULT_HADOKU_ORIGINS, logError } from '../../util';
import { createChatRoutes } from './routes/chat';
import { createContentRoutes } from './routes/content';
import { HTTP_STATUS } from './constants';

interface Env {
	GROQ_API_KEY: string;
	RESUME_SYSTEM_PROMPT: string;
	RATE_LIMIT_KV: KVNamespace;
	CONTENT_KV: KVNamespace;
}

interface AppContext {
	Bindings: Env;
}

const app = new Hono<AppContext>();

// ============================================================================
// Middleware Stack
// ============================================================================

// 1. CORS Middleware
app.use(
	'*',
	createCorsMiddleware({
		origins: [...DEFAULT_HADOKU_ORIGINS, 'https://resume-api.hadoku.me'],
		methods: ['GET', 'POST', 'OPTIONS'],
		allowedHeaders: ['Content-Type'],
		exposedHeaders: ['X-Backend-Source'],
		credentials: true,
		maxAge: 86400,
	})
);

// ============================================================================
// Route Registration
// ============================================================================

// Health check endpoint
app.get('/resume/api/', (c) => {
	return c.json({ status: 'ok', service: 'resume-api' }, HTTP_STATUS.OK);
});

app.get('/resume/api/health', (c) => {
	return c.json({ status: 'ok', service: 'resume-api' }, HTTP_STATUS.OK);
});

// Chat routes (rate limited)
app.route('/resume/api', createChatRoutes());

// Content routes (resume and system prompt)
app.route('/resume/api', createContentRoutes());

// ============================================================================
// Error Handlers
// ============================================================================

app.notFound((c) => {
	return c.json({ error: 'Not found' }, 404);
});

app.onError((err, c) => {
	logError('INTERNAL', c.req.path, err.message);
	return c.json({ error: 'Internal server error' }, 500);
});

// ============================================================================
// Export
// ============================================================================

export default app;
