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
		// Should include both the base system prompt and the resume content
		expect(fullPrompt).toContain(mockSystemPrompt);
		expect(fullPrompt).toContain(mockResume);
		// Should have a resume content section
		expect(fullPrompt).toContain('Resume Content');
	});
});

describe('Configuration', () => {
	it('should have required LLM config properties', () => {
		// Test structure and types, not hardcoded values
		// Values can change based on business needs, but structure should be stable
		expect(LLM_CONFIG.BASE_URL).toBeDefined();
		expect(typeof LLM_CONFIG.BASE_URL).toBe('string');
		expect(LLM_CONFIG.MODEL).toBeDefined();
		expect(typeof LLM_CONFIG.MODEL).toBe('string');
		expect(typeof LLM_CONFIG.TEMPERATURE).toBe('number');
		expect(LLM_CONFIG.TEMPERATURE).toBeGreaterThanOrEqual(0);
		expect(LLM_CONFIG.TEMPERATURE).toBeLessThanOrEqual(2);
		expect(typeof LLM_CONFIG.MAX_TOKENS).toBe('number');
		expect(LLM_CONFIG.MAX_TOKENS).toBeGreaterThan(0);
	});

	it('should have required rate limit config properties', () => {
		expect(typeof RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_WINDOW).toBe('number');
		expect(RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_WINDOW).toBeGreaterThan(0);
		expect(typeof RATE_LIMIT_CONFIG.WINDOW_DURATION_SECONDS).toBe('number');
		expect(RATE_LIMIT_CONFIG.WINDOW_DURATION_SECONDS).toBeGreaterThan(0);
	});
});
