/**
 * Template storage operations (hybrid D1 + KV)
 * Manages email templates and chatbot prompts with versioning
 */

import {
	TEMPLATE_CONFIG,
	PAGINATION_DEFAULTS,
	type TemplateType,
	type TemplateStatus,
} from '../constants';

export interface EmailTemplate {
	id: string;
	name: string;
	type: TemplateType;
	subject: string | null;
	body: string;
	language: string;
	version: number;
	status: TemplateStatus;
	created_at: number;
	updated_at: number;
	created_by: string | null;
	metadata: string | null; // JSON string
}

export interface ChatbotPrompt {
	id: string;
	name: string;
	system_prompt: string;
	user_prompt: string | null;
	context_window: number;
	temperature: number;
	max_tokens: number;
	model: string;
	language: string;
	version: number;
	status: TemplateStatus;
	created_at: number;
	updated_at: number;
	created_by: string | null;
	metadata: string | null; // JSON string
}

export interface TemplateVersion {
	id: string;
	template_type: 'email' | 'chatbot';
	template_id: string;
	version: number;
	content: string; // JSON snapshot
	changed_by: string | null;
	changed_at: number;
	change_notes: string | null;
}

/**
 * Generic template loading function (DRY principle)
 * Handles hybrid KV -> D1 fallback pattern with caching
 */
async function loadTemplate<T>(
	db: D1Database,
	kv: KVNamespace,
	tableName: string,
	kvPrefix: string,
	name: string,
	language = TEMPLATE_CONFIG.DEFAULT_LANGUAGE
): Promise<T | null> {
	// Try KV cache first (fast path)
	const kvKey = `${kvPrefix}:${name}:${language}`;
	const cached = await kv.get(kvKey, 'json');
	if (cached) {
		return cached as T;
	}

	// Fallback to D1 (source of truth)
	const template = await db
		.prepare(
			`SELECT * FROM ${tableName}
			 WHERE name = ? AND language = ? AND status = 'active'
			 ORDER BY version DESC LIMIT 1`
		)
		.bind(name, language)
		.first<T>();

	// Cache in KV for next time
	if (template) {
		await kv.put(kvKey, JSON.stringify(template), {
			expirationTtl: TEMPLATE_CONFIG.KV_CACHE_TTL_SECONDS,
		});
	}

	return template;
}

/**
 * Get email template (Hybrid: KV first, D1 fallback)
 */
export async function getEmailTemplate(
	db: D1Database,
	kv: KVNamespace,
	name: string,
	language = TEMPLATE_CONFIG.DEFAULT_LANGUAGE
): Promise<EmailTemplate | null> {
	return loadTemplate<EmailTemplate>(db, kv, 'email_templates', 'template:email', name, language);
}

/**
 * Get chatbot prompt (Hybrid: KV first, D1 fallback)
 */
export async function getChatbotPrompt(
	db: D1Database,
	kv: KVNamespace,
	name: string,
	language = TEMPLATE_CONFIG.DEFAULT_LANGUAGE
): Promise<ChatbotPrompt | null> {
	return loadTemplate<ChatbotPrompt>(db, kv, 'chatbot_prompts', 'template:chatbot', name, language);
}

/**
 * List all email templates with optional filters
 */
export async function listEmailTemplates(
	db: D1Database,
	filters?: {
		status?: TemplateStatus;
		language?: string;
		limit?: number;
		offset?: number;
	}
): Promise<EmailTemplate[]> {
	const {
		status,
		language,
		limit = PAGINATION_DEFAULTS.LIMIT,
		offset = PAGINATION_DEFAULTS.OFFSET,
	} = filters ?? {};

	let query = `SELECT * FROM email_templates WHERE 1=1`;
	const bindings: (string | number)[] = [];

	if (status) {
		query += ` AND status = ?`;
		bindings.push(status);
	}

	if (language) {
		query += ` AND language = ?`;
		bindings.push(language);
	}

	query += ` ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
	bindings.push(limit, offset);

	const { results } = await db
		.prepare(query)
		.bind(...bindings)
		.all<EmailTemplate>();
	return results;
}

/**
 * Create or update email template (writes to D1 + syncs to KV)
 */
export async function upsertEmailTemplate(
	db: D1Database,
	kv: KVNamespace,
	template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at' | 'version'> & {
		id?: string;
	},
	changedBy?: string
): Promise<EmailTemplate> {
	const now = Date.now();
	const id = template.id ?? `tpl_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

	// Check if template exists
	const existing = await db
		.prepare(`SELECT id, version FROM email_templates WHERE id = ?`)
		.bind(id)
		.first<{ id: string; version: number }>();

	const version = existing ? existing.version + 1 : 1;

	// Upsert to D1
	const result = await db
		.prepare(
			`INSERT INTO email_templates
			 (id, name, type, subject, body, language, version, status, created_at, updated_at, created_by, metadata)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			 ON CONFLICT(id) DO UPDATE SET
			   subject = excluded.subject,
			   body = excluded.body,
			   status = excluded.status,
			   version = excluded.version,
			   updated_at = excluded.updated_at,
			   metadata = excluded.metadata`
		)
		.bind(
			id,
			template.name,
			template.type,
			template.subject,
			template.body,
			template.language,
			version,
			template.status,
			existing ? existing.id : now, // Keep original created_at
			now,
			changedBy ?? template.created_by,
			template.metadata
		)
		.run();

	if (!result.success) {
		throw new Error('Failed to save email template');
	}

	// Get the saved template
	const saved = await db
		.prepare(`SELECT * FROM email_templates WHERE id = ?`)
		.bind(id)
		.first<EmailTemplate>();

	if (!saved) {
		throw new Error('Failed to retrieve saved template');
	}

	// Sync to KV for fast runtime access
	const kvKey = `template:email:${template.name}:${template.language}`;
	await kv.put(kvKey, JSON.stringify(saved), {
		expirationTtl: TEMPLATE_CONFIG.KV_CACHE_TTL_SECONDS,
	});

	// Save version history
	await db
		.prepare(
			`INSERT INTO template_versions
			 (id, template_type, template_id, version, content, changed_by, changed_at, change_notes)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
		)
		.bind(
			`ver_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
			'email',
			id,
			version,
			JSON.stringify(saved),
			changedBy,
			now,
			null
		)
		.run();

	return saved;
}

/**
 * Delete email template (soft delete by archiving)
 */
export async function deleteEmailTemplate(
	db: D1Database,
	kv: KVNamespace,
	id: string
): Promise<boolean> {
	// Get template info for KV key
	const template = await db
		.prepare(`SELECT name, language FROM email_templates WHERE id = ?`)
		.bind(id)
		.first<{ name: string; language: string }>();

	if (!template) {
		return false;
	}

	// Archive in D1
	const result = await db
		.prepare(`UPDATE email_templates SET status = 'archived', updated_at = ? WHERE id = ?`)
		.bind(Date.now(), id)
		.run();

	// Remove from KV cache
	if (result.success) {
		const kvKey = `template:email:${template.name}:${template.language}`;
		await kv.delete(kvKey);
	}

	return result.success;
}

/**
 * Get template version history
 */
export async function getTemplateVersionHistory(
	db: D1Database,
	templateId: string,
	templateType: 'email' | 'chatbot' = 'email',
	limit = PAGINATION_DEFAULTS.MAX_VERSION_HISTORY
): Promise<TemplateVersion[]> {
	const { results } = await db
		.prepare(
			`SELECT * FROM template_versions
			 WHERE template_id = ? AND template_type = ?
			 ORDER BY version DESC LIMIT ?`
		)
		.bind(templateId, templateType, limit)
		.all<TemplateVersion>();

	return results;
}
