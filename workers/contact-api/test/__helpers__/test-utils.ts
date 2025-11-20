/**
 * Test utilities for Contact API
 *
 * Provides helpers for creating test environments and mocking storage.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-await-in-loop */

import type { D1Database } from '@cloudflare/workers-types';

/**
 * Create a mock KV namespace for testing.
 * Uses an in-memory Map to simulate Workers KV.
 * Includes test inspection methods: _getStore() and _clear()
 */
export function createMockKV() {
	const _store = new Map<string, string>();

	const mockKV = {
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

		// Test inspection methods
		_getStore() {
			return _store;
		},
		_clear() {
			_store.clear();
		},
	};

	return mockKV as any;
}

/**
 * Create a mock D1 database for testing
 * Includes test inspection methods: _getTables(), _getSubmissions(), _getWhitelist(), _getAppointments(), _clear()
 */
export function createMockD1() {
	const _submissions = new Map<string, any>();
	const _whitelist = new Map<string, any>();
	const _appointments = new Map<string, any>();
	const _appointmentConfig = new Map<string, any>();

	const mockDB = {
		prepare(query: string) {
			return {
				bind(...values: any[]) {
					return {
						async run() {
							// Contact submissions
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
									user_agent: values[7],
									referrer: values[8],
									recipient: values[9],
									deleted_at: null,
								});
								return { success: true, meta: {} };
							}
							if (query.includes('UPDATE contact_submissions')) {
								const id = values[values.length - 1];
								const existing = _submissions.get(id);
								if (existing) {
									if (query.includes('SET status = ?')) {
										existing.status = values[0];
									}
								}
								return { success: true, meta: {} };
							}
							if (query.includes('DELETE FROM contact_submissions')) {
								const id = values[0];
								_submissions.delete(id);
								return { success: true, meta: {} };
							}

							// Whitelist
							if (query.includes('INSERT INTO email_whitelist')) {
								const email = values[0];
								_whitelist.set(email, {
									email,
									whitelisted_at: values[1],
									notes: values[2] || null,
								});
								return { success: true, meta: {} };
							}
							if (query.includes('DELETE FROM email_whitelist')) {
								const email = values[0];
								_whitelist.delete(email);
								return { success: true, meta: {} };
							}

							// Appointments
							if (query.includes('INSERT INTO appointments')) {
								const id = values[0];
								_appointments.set(id, {
									id,
									name: values[1],
									email: values[2],
									date: values[3],
									time: values[4],
									platform: values[5],
									notes: values[6],
									status: values[7],
									meeting_link: values[8],
									created_at: values[9],
									ip_address: values[10],
									user_agent: values[11],
								});
								return { success: true, meta: {} };
							}
							if (query.includes('UPDATE appointments')) {
								const id = values[values.length - 1];
								const existing = _appointments.get(id);
								if (existing) {
									if (query.includes('SET status = ?')) {
										existing.status = values[0];
									}
								}
								return { success: true, meta: {} };
							}

							// Appointment config
							if (query.includes('INSERT INTO appointment_config')) {
								_appointmentConfig.set('default', {
									id: values[0],
									timezone: values[1],
									start_hour: values[2],
									end_hour: values[3],
									available_days: values[4],
									platforms: values[5],
									advance_notice_hours: values[6],
								});
								return { success: true, meta: {} };
							}
							if (query.includes('UPDATE appointment_config')) {
								const existing = _appointmentConfig.get('default');
								if (existing) {
									// Dynamic update based on query
									Object.assign(existing, {
										timezone: values[0],
										start_hour: values[1],
										end_hour: values[2],
										available_days: values[3],
										platforms: values[4],
										advance_notice_hours: values[5],
									});
								}
								return { success: true, meta: {} };
							}

							return { success: true, meta: {} };
						},
						async all() {
							if (query.includes('FROM contact_submissions')) {
								let results = Array.from(_submissions.values());
								// Filter by status if WHERE clause exists
								if (query.includes("WHERE status != 'deleted'")) {
									results = results.filter((s) => s.status !== 'deleted');
								}
								// Sort by created_at DESC
								if (query.includes('ORDER BY created_at DESC')) {
									results.sort((a, b) => b.created_at - a.created_at);
								}
								// Handle LIMIT and OFFSET (values are appended at end)
								if (query.includes('LIMIT ? OFFSET ?')) {
									const limit = values[values.length - 2];
									const offset = values[values.length - 1];
									results = results.slice(offset, offset + limit);
								}
								return {
									results,
									success: true,
								};
							}
							if (query.includes('FROM email_whitelist')) {
								return {
									results: Array.from(_whitelist.values()),
									success: true,
								};
							}
							if (query.includes('FROM appointments')) {
								let results = Array.from(_appointments.values());
								// Filter by date if WHERE clause exists
								if (query.includes('WHERE date = ?')) {
									const targetDate = values[0];
									results = results.filter((apt) => apt.date === targetDate);
								}
								// Sort by date, time
								if (query.includes('ORDER BY date, time')) {
									results.sort((a, b) => {
										if (a.date !== b.date) {
											return a.date.localeCompare(b.date);
										}
										return a.time.localeCompare(b.time);
									});
								}
								return { results, success: true };
							}
							// Handle COUNT queries for stats
							if (query.includes('SELECT COUNT(*) as count FROM')) {
								let count = 0;
								if (query.includes('FROM contact_submissions')) {
									count = _submissions.size;
									if (query.includes("WHERE status = 'unread'")) {
										count = Array.from(_submissions.values()).filter(
											(s) => s.status === 'unread'
										).length;
									}
								} else if (query.includes('FROM email_whitelist')) {
									count = _whitelist.size;
								} else if (query.includes('FROM appointments')) {
									count = _appointments.size;
								}
								return { results: [{ count }], success: true };
							}
							// Handle PRAGMA queries for database size
							if (query.includes('PRAGMA page_count') || query.includes('PRAGMA page_size')) {
								return { results: [{ page_count: 100, page_size: 4096 }], success: true };
							}
							return { results: [], success: true };
						},
						async first() {
							if (query.includes('FROM contact_submissions') && query.includes('WHERE id = ?')) {
								return _submissions.get(values[0]) || null;
							}
							if (query.includes('FROM email_whitelist') && query.includes('WHERE email = ?')) {
								return _whitelist.get(values[0]) || null;
							}
							if (query.includes('FROM appointments') && query.includes('WHERE id = ?')) {
								return _appointments.get(values[0]) || null;
							}
							if (query.includes('FROM appointment_config')) {
								return _appointmentConfig.get('default') || null;
							}
							return null;
						},
					};
				},
				async run() {
					return { success: true, meta: {} };
				},
				async all() {
					if (query.includes('FROM contact_submissions')) {
						return {
							results: Array.from(_submissions.values()),
							success: true,
						};
					}
					if (query.includes('FROM email_whitelist')) {
						return {
							results: Array.from(_whitelist.values()),
							success: true,
						};
					}
					if (query.includes('FROM appointments')) {
						return {
							results: Array.from(_appointments.values()),
							success: true,
						};
					}
					// Handle COUNT queries
					if (query.includes('SELECT COUNT(*) as count FROM')) {
						let count = 0;
						if (query.includes('FROM contact_submissions')) {
							count = _submissions.size;
						} else if (query.includes('FROM email_whitelist')) {
							count = _whitelist.size;
						} else if (query.includes('FROM appointments')) {
							count = _appointments.size;
						}
						return { results: [{ count }], success: true };
					}
					// Handle PRAGMA queries for database size
					if (query.includes('PRAGMA page_count')) {
						return { results: [{ page_count: 100 }], success: true };
					}
					if (query.includes('PRAGMA page_size')) {
						return { results: [{ page_size: 4096 }], success: true };
					}
					return { results: [], success: true };
				},
				async first() {
					// Handle PRAGMA queries
					if (query.includes('PRAGMA page_count')) {
						return { page_count: 100 };
					}
					if (query.includes('PRAGMA page_size')) {
						return { page_size: 4096 };
					}
					return null;
				},
			};
		},
		async dump() {
			return new ArrayBuffer(0);
		},
		async batch(statements: any[]) {
			// Execute each statement and return results
			const results = [];
			for (const stmt of statements) {
				// Simulate execution of each prepared statement
				const result = await stmt.all();
				results.push(result);
			}
			return results;
		},
		async exec(_query: string) {
			return { count: 0, duration: 0 };
		},

		// Test inspection methods
		_getTables() {
			return {
				submissions: _submissions,
				whitelist: _whitelist,
				appointments: _appointments,
				appointmentConfig: _appointmentConfig,
			};
		},
		_getSubmissions() {
			return Array.from(_submissions.values());
		},
		_getWhitelist() {
			return Array.from(_whitelist.values());
		},
		_getAppointments() {
			return Array.from(_appointments.values());
		},
		_clear() {
			_submissions.clear();
			_whitelist.clear();
			_appointments.clear();
			_appointmentConfig.clear();
		},
	};

	return mockDB as any;
}

/**
 * Create a test environment with mock storage
 */
export function createTestEnv(
	overrides: Partial<{
		ADMIN_KEYS: string;
		DB: D1Database;
		RATE_LIMIT_KV: any;
		EMAIL_PROVIDER: string;
		RESEND_API_KEY: string;
	}> = {}
) {
	return {
		ADMIN_KEYS: JSON.stringify({ 'test-admin-key': 'admin' }),
		DB: createMockD1(),
		RATE_LIMIT_KV: createMockKV(),
		EMAIL_PROVIDER: 'resend',
		RESEND_API_KEY: 'test-api-key',
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
