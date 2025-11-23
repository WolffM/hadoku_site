/**
 * Content Routes - Resume and System Prompt endpoints
 *
 * GET /resume/api/resume - Get resume markdown from KV
 * GET /resume/api/system-prompt - Get system prompt from secret
 */

import { Hono, type Context } from 'hono';
import { getResumeContent, getFullSystemPrompt } from '../resume';
import { HTTP_STATUS } from '../constants';
import { logError } from '../../../util';

interface Env {
	CONTENT_KV: KVNamespace;
	RESUME_SYSTEM_PROMPT: string;
}

interface AppContext {
	Bindings: Env;
}

const contentRoutes = new Hono<AppContext>();

/**
 * GET /resume - Get resume content as markdown from KV
 */
contentRoutes.get('/resume', async (c: Context<AppContext>) => {
	try {
		const content = await getResumeContent(c.env);
		return c.json({ content }, HTTP_STATUS.OK);
	} catch (error) {
		logError('GET', '/resume/api/resume', (error as Error).message);
		return c.json(
			{ error: 'Failed to retrieve resume', message: (error as Error).message },
			HTTP_STATUS.INTERNAL_SERVER_ERROR
		);
	}
});

/**
 * GET /system-prompt - Get full system prompt with resume content
 */
contentRoutes.get('/system-prompt', async (c: Context<AppContext>) => {
	try {
		const systemPrompt = await getFullSystemPrompt(c.env);
		return c.json({ systemPrompt }, HTTP_STATUS.OK);
	} catch (error) {
		logError('GET', '/resume/api/system-prompt', (error as Error).message);
		return c.json(
			{ error: 'Failed to retrieve system prompt', message: (error as Error).message },
			HTTP_STATUS.INTERNAL_SERVER_ERROR
		);
	}
});

export function createContentRoutes() {
	return contentRoutes;
}
