/**
 * Test utilities for Contact API
 *
 * Provides helpers for creating test environments and mocking storage.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Create a mock KV namespace for testing.
 * Uses an in-memory Map to simulate Workers KV.
 */
export function createMockKV(): KVNamespace {
	const _store = new Map<string, string>();

	return {
		async get(key: string, type?: 'text' | 'json' | 'arrayBuffer' | 'stream') {
			const value = _store.get(key);
			if (!value) return null;

			if (type === 'json') {
				return JSON.parse(value);
			}
			return value as any;
		},

		async put(key: string, value: string | ArrayBuffer | ReadableStream) {
			if (typeof value === 'string') {
				_store.set(key, value);
			} else if (value instanceof ArrayBuffer) {
				_store.set(key, new TextDecoder().decode(value));
			} else {
				const reader = value.getReader();
				const chunks: Uint8Array[] = [];
				// Stream reading MUST be sequential - cannot parallelize

				while (true) {
					const { done, value: chunk } = await reader.read();
					if (done) break;
					chunks.push(chunk);
				}
				const combined = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
				let offset = 0;
				for (const chunk of chunks) {
					combined.set(chunk, offset);
					offset += chunk.length;
				}
				_store.set(key, new TextDecoder().decode(combined));
			}
		},

		async delete(key: string) {
			_store.delete(key);
		},

		async list() {
			return {
				keys: Array.from(_store.keys()).map((name) => ({ name })),
				list_complete: true,
				cursor: '',
			} as any;
		},

		getWithMetadata: async () => ({ value: null, metadata: null }),
		async putWithMetadata() {},
	} as KVNamespace;
}

/**
 * Create a mock D1 database for testing
 */
function createMockD1(): D1Database {
	const _submissions = new Map<string, any>();

	return {
		prepare(query: string) {
			return {
				bind(...values: any[]) {
					return {
						async run() {
							// Mock INSERT
							if (query.includes('INSERT INTO contact_submissions')) {
								const id = values[0];
								_submissions.set(id, {
									id,
									name: values[1],
									email: values[2],
									message: values[3],
									status: values[4],
									created_at: values[5],
									ip_address: values[6],
									referrer: values[7],
									recipient: values[8],
								});
								return { success: true, meta: {} };
							}
							// Mock UPDATE
							if (query.includes('UPDATE contact_submissions')) {
								return { success: true, meta: {} };
							}
							return { success: true, meta: {} };
						},
						async all() {
							// Mock SELECT all submissions
							if (query.includes('SELECT * FROM contact_submissions')) {
								return {
									results: Array.from(_submissions.values()),
									success: true,
								};
							}
							return { results: [], success: true };
						},
						async first() {
							// Mock SELECT single submission
							if (query.includes('WHERE id = ?')) {
								return _submissions.get(values[0]) || null;
							}
							return null;
						},
					};
				},
				async run() {
					return { success: true, meta: {} };
				},
				async all() {
					return {
						results: Array.from(_submissions.values()),
						success: true,
					};
				},
				async first() {
					return null;
				},
			};
		},
		async dump() {
			return new ArrayBuffer(0);
		},
		async batch(_statements: any[]) {
			return [];
		},
		async exec(_query: string) {
			return { count: 0, duration: 0 };
		},
	} as any;
}

/**
 * Create a test environment with mock storage
 */
export function createTestEnv(
	overrides: Partial<{
		ADMIN_KEYS: string;
		DB: D1Database;
		RATE_LIMIT_KV: KVNamespace;
		EMAIL_PROVIDER: string;
	}> = {}
) {
	return {
		ADMIN_KEYS: JSON.stringify({ 'test-admin-key': 'admin' }),
		DB: createMockD1(),
		RATE_LIMIT_KV: createMockKV(),
		EMAIL_PROVIDER: 'mailchannels',
		...overrides,
	};
}

/**
 * Create request headers with admin authentication
 */
export function createAuthHeaders(
	adminKey: string = 'test-admin-key',
	extraHeaders: Record<string, string> = {}
) {
	return {
		'X-User-Key': adminKey,
		'Content-Type': 'application/json',
		...extraHeaders,
	};
}

/**
 * Generate a unique ID for test isolation
 */
export function uniqueId(): string {
	return Math.random().toString(16).substring(2, 10);
}

/**
 * Helper to make requests to the worker for testing
 */
export async function makeRequest(
	worker: any,
	env: ReturnType<typeof createTestEnv>,
	path: string,
	options: {
		method?: string;
		headers?: Record<string, string>;
		body?: any;
	} = {}
) {
	const request = new Request(`https://test.com${path}`, {
		method: options.method || 'GET',
		headers: options.headers || {},
		body: options.body ? JSON.stringify(options.body) : undefined,
	});

	return worker.fetch(request, env, {} as any);
}
