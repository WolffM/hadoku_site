/**
 * Resume API Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { getResumeContent, getSystemPrompt, getFullSystemPrompt } from '../src/resume';
import { LLM_CONFIG, RATE_LIMIT_CONFIG } from '../src/constants';

// Mock KV namespace
const createMockKV = (data: Record<string, string>) => ({
	get: vi.fn((key: string) => Promise.resolve(data[key] || null)),
	put: vi.fn(),
	delete: vi.fn(),
});

describe('Resume Content Functions', () => {
	const mockResume = '# Test Resume\n\nThis is a test resume.';
	const mockSystemPrompt = 'You are a helpful assistant.';

	it('should get resume content from KV', async () => {
		const mockKV = createMockKV({ resume: mockResume });
		const env = {
			CONTENT_KV: mockKV as unknown as KVNamespace,
			RESUME_SYSTEM_PROMPT: mockSystemPrompt,
		};

		const content = await getResumeContent(env);
		expect(content).toBe(mockResume);
		expect(mockKV.get).toHaveBeenCalledWith('resume');
	});

	it('should throw error when resume not found in KV', async () => {
		const mockKV = createMockKV({});
		const env = {
			CONTENT_KV: mockKV as unknown as KVNamespace,
			RESUME_SYSTEM_PROMPT: mockSystemPrompt,
		};

		await expect(getResumeContent(env)).rejects.toThrow('Resume content not found');
	});

	it('should get system prompt from env', () => {
		const env = {
			CONTENT_KV: createMockKV({}) as unknown as KVNamespace,
			RESUME_SYSTEM_PROMPT: mockSystemPrompt,
		};

		const prompt = getSystemPrompt(env);
		expect(prompt).toBe(mockSystemPrompt);
	});

	it('should throw error when system prompt not configured', () => {
		const env = {
			CONTENT_KV: createMockKV({}) as unknown as KVNamespace,
			RESUME_SYSTEM_PROMPT: '',
		};

		expect(() => getSystemPrompt(env)).toThrow('RESUME_SYSTEM_PROMPT secret not configured');
	});

	it('should combine system prompt with resume content', async () => {
		const mockKV = createMockKV({ resume: mockResume });
		const env = {
			CONTENT_KV: mockKV as unknown as KVNamespace,
			RESUME_SYSTEM_PROMPT: mockSystemPrompt,
		};

		const fullPrompt = await getFullSystemPrompt(env);
		expect(fullPrompt).toContain(mockSystemPrompt);
		expect(fullPrompt).toContain(mockResume);
		expect(fullPrompt).toContain('Here is the resume');
	});
});

describe('Configuration', () => {
	it('should have valid LLM config', () => {
		expect(LLM_CONFIG.BASE_URL).toBe('https://api.groq.com/openai/v1');
		expect(LLM_CONFIG.MODEL).toBe('openai/gpt-oss-120b');
		expect(LLM_CONFIG.TEMPERATURE).toBe(0.7);
		expect(LLM_CONFIG.MAX_TOKENS).toBe(1024);
	});

	it('should have valid rate limit config', () => {
		expect(RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_WINDOW).toBe(10);
		expect(RATE_LIMIT_CONFIG.WINDOW_DURATION_SECONDS).toBe(60);
	});
});
