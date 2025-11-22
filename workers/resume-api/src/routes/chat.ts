/**
 * Chat Route - POST /resume/api/chat
 *
 * Handles chat messages and returns LLM responses
 */

import { Hono, type Context } from 'hono';
import { createLLMClient, sendChatCompletion, type ChatMessage } from '../llm';
import { checkRateLimit, recordRequest } from '../rate-limit';
import { getFullSystemPrompt } from '../resume';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import { logError, logRequest } from '../../../util';

interface Env {
	GROQ_API_KEY: string;
	RATE_LIMIT_KV: KVNamespace;
	CONTENT_KV: KVNamespace;
	RESUME_SYSTEM_PROMPT: string;
}

interface AppContext {
	Bindings: Env;
}

interface ChatRequestBody {
	messages: ChatMessage[];
}

const chatRoutes = new Hono<AppContext>();

/**
 * POST /chat - Send a chat message
 */
chatRoutes.post('/chat', async (c: Context<AppContext>) => {
	const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';

	// Check rate limit
	const rateLimitResult = await checkRateLimit(c.env.RATE_LIMIT_KV, ip);

	if (!rateLimitResult.allowed) {
		logError('POST', '/resume/api/chat', `Rate limited: ${ip}`);
		return c.json(
			{
				error: ERROR_MESSAGES.RATE_LIMITED,
				message: rateLimitResult.reason,
				retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000),
			},
			HTTP_STATUS.TOO_MANY_REQUESTS
		);
	}

	// Parse request body
	let body: ChatRequestBody;
	try {
		body = await c.req.json<ChatRequestBody>();
	} catch {
		return c.json({ error: ERROR_MESSAGES.INVALID_REQUEST }, HTTP_STATUS.BAD_REQUEST);
	}

	// Validate messages
	if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
		return c.json({ error: ERROR_MESSAGES.MISSING_MESSAGES }, HTTP_STATUS.BAD_REQUEST);
	}

	// Validate each message has required fields
	for (const msg of body.messages) {
		if (!msg.role || !msg.content || typeof msg.content !== 'string') {
			return c.json({ error: ERROR_MESSAGES.INVALID_REQUEST }, HTTP_STATUS.BAD_REQUEST);
		}
		if (!['system', 'user', 'assistant'].includes(msg.role)) {
			return c.json({ error: ERROR_MESSAGES.INVALID_REQUEST }, HTTP_STATUS.BAD_REQUEST);
		}
	}

	try {
		// Record the request for rate limiting
		await recordRequest(c.env.RATE_LIMIT_KV, ip);

		// Prepare messages with system prompt if not already present
		const messages: ChatMessage[] = [...body.messages];
		if (messages[0]?.role !== 'system') {
			const systemPrompt = await getFullSystemPrompt(c.env);
			messages.unshift({
				role: 'system',
				content: systemPrompt,
			});
		}

		// Call LLM
		const client = createLLMClient(c.env.GROQ_API_KEY);
		const response = await sendChatCompletion(client, messages);

		logRequest('POST', '/resume/api/chat', { messageCount: body.messages.length });

		return c.json(response, HTTP_STATUS.OK);
	} catch (error) {
		logError('POST', '/resume/api/chat', (error as Error).message);
		return c.json(
			{
				error: ERROR_MESSAGES.LLM_ERROR,
				message: (error as Error).message,
			},
			HTTP_STATUS.INTERNAL_SERVER_ERROR
		);
	}
});

export function createChatRoutes() {
	return chatRoutes;
}
