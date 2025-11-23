/**
 * Resume Content - Fetched from KV and Environment
 *
 * Resume content is stored in CONTENT_KV under key "resume"
 * System prompt is stored as SYSTEM_PROMPT secret
 */

export interface Env {
	CONTENT_KV: KVNamespace;
	RESUME_SYSTEM_PROMPT: string;
}

/**
 * Get the resume content from KV storage
 */
export async function getResumeContent(env: Env): Promise<string> {
	const content = await env.CONTENT_KV.get('resume');
	if (!content) {
		throw new Error('Resume content not found in KV storage');
	}
	return content;
}

/**
 * Get the system prompt from environment
 */
export function getSystemPrompt(env: Env): string {
	if (!env.RESUME_SYSTEM_PROMPT) {
		throw new Error('RESUME_SYSTEM_PROMPT secret not configured');
	}
	return env.RESUME_SYSTEM_PROMPT;
}

/**
 * Get the complete system prompt with resume content appended
 */
export async function getFullSystemPrompt(env: Env): Promise<string> {
	const basePrompt = getSystemPrompt(env);
	const resumeContent = await getResumeContent(env);

	return `${basePrompt}

## Resume Content

Here is Matthaeus Wolff's complete resume. Use this information to answer questions accurately:

${resumeContent}

Remember: Only provide information that is explicitly stated in the resume above. Do not invent or speculate about information not present in the resume.`;
}
