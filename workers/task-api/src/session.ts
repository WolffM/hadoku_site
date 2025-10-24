/**
 * Session Management Module
 * 
 * Handles sessionId-based storage, preferences migration, and session mapping.
 * 
 * Key Concepts:
 * - Storage by sessionId (not authKey)
 * - One preferences object per sessionId
 * - Multiple sessionIds per authKey (multi-device support)
 * - Session mapping: authKey → sessionId list (tracks active sessions)
 * - Never delete old sessionId preferences
 */

import type { KVNamespace } from '@cloudflare/workers-types';

// ============================================================================
// Types
// ============================================================================

export interface UserPreferences {
	theme?: string;
	buttons?: any;
	experimentalFlags?: any;
	layout?: any;
	deviceInfo?: any;
	lastUpdated?: string;
	[key: string]: any; // Allow additional custom preferences
}

export interface SessionMapping {
	authKey: string;
	sessionIds: string[];  // List of all sessionIds for this authKey
	lastSessionId: string;  // Most recently used sessionId
	createdAt: string;
	updatedAt: string;
}

export interface SessionInfo {
	sessionId: string;
	authKey: string;
	userType: 'admin' | 'friend' | 'public';
	createdAt: string;
	lastAccessedAt: string;
}

// ============================================================================
// KV Key Formats
// ============================================================================

/**
 * Generate KV key for preferences by sessionId
 */
function preferencesKey(sessionId: string): string {
	return `prefs:${sessionId}`;
}

/**
 * Generate KV key for session info by sessionId
 */
function sessionInfoKey(sessionId: string): string {
	return `session-info:${sessionId}`;
}

/**
 * Generate KV key for session mapping by authKey
 */
function sessionMappingKey(authKey: string): string {
	return `session-map:${authKey}`;
}

// ============================================================================
// Session Storage Operations
// ============================================================================

/**
 * Get preferences by sessionId
 */
export async function getPreferencesBySessionId(
	kv: KVNamespace,
	sessionId: string
): Promise<UserPreferences | null> {
	const key = preferencesKey(sessionId);
	const data = await kv.get(key, 'json');
	return data as UserPreferences | null;
}

/**
 * Save preferences by sessionId
 */
export async function savePreferencesBySessionId(
	kv: KVNamespace,
	sessionId: string,
	preferences: UserPreferences
): Promise<void> {
	const key = preferencesKey(sessionId);
	const data = {
		...preferences,
		lastUpdated: new Date().toISOString()
	};
	await kv.put(key, JSON.stringify(data));
}

/**
 * Get session info by sessionId
 */
export async function getSessionInfo(
	kv: KVNamespace,
	sessionId: string
): Promise<SessionInfo | null> {
	const key = sessionInfoKey(sessionId);
	const data = await kv.get(key, 'json');
	return data as SessionInfo | null;
}

/**
 * Save session info
 */
export async function saveSessionInfo(
	kv: KVNamespace,
	sessionInfo: SessionInfo
): Promise<void> {
	const key = sessionInfoKey(sessionInfo.sessionId);
	await kv.put(key, JSON.stringify(sessionInfo));
}

/**
 * Update session last accessed time
 */
export async function updateSessionAccess(
	kv: KVNamespace,
	sessionId: string
): Promise<void> {
	const info = await getSessionInfo(kv, sessionId);
	if (info) {
		info.lastAccessedAt = new Date().toISOString();
		await saveSessionInfo(kv, info);
	}
}

/**
 * Get session mapping for authKey
 */
export async function getSessionMapping(
	kv: KVNamespace,
	authKey: string
): Promise<SessionMapping | null> {
	const key = sessionMappingKey(authKey);
	const data = await kv.get(key, 'json');
	return data as SessionMapping | null;
}

/**
 * Update session mapping for authKey
 * Adds new sessionId to the list if not present
 */
export async function updateSessionMapping(
	kv: KVNamespace,
	authKey: string,
	sessionId: string
): Promise<void> {
	const key = sessionMappingKey(authKey);
	const existing = await getSessionMapping(kv, authKey);
	
	const now = new Date().toISOString();
	
	if (existing) {
		// Add sessionId if not already in list
		if (!existing.sessionIds.includes(sessionId)) {
			existing.sessionIds.push(sessionId);
		}
		existing.lastSessionId = sessionId;
		existing.updatedAt = now;
		await kv.put(key, JSON.stringify(existing));
	} else {
		// Create new mapping
		const mapping: SessionMapping = {
			authKey,
			sessionIds: [sessionId],
			lastSessionId: sessionId,
			createdAt: now,
			updatedAt: now
		};
		await kv.put(key, JSON.stringify(mapping));
	}
}

/**
 * Get all sessionIds for an authKey
 */
export async function getSessionIdsForAuthKey(
	kv: KVNamespace,
	authKey: string
): Promise<string[]> {
	const mapping = await getSessionMapping(kv, authKey);
	return mapping ? mapping.sessionIds : [];
}

// ============================================================================
// Session Handshake Logic
// ============================================================================

/**
 * Default preferences for new sessions
 */
const DEFAULT_PREFERENCES: UserPreferences = {
	theme: 'system',
	buttons: {},
	experimentalFlags: {},
	layout: {},
	lastUpdated: new Date().toISOString()
};

export interface HandshakeRequest {
	oldSessionId: string | null;
	newSessionId: string;
}

export interface HandshakeResponse {
	sessionId: string;
	preferences: UserPreferences;
	isNewSession: boolean;
	migratedFrom?: string;
}

/**
 * Handle session handshake
 * 
 * Logic:
 * 1. If oldSessionId provided, try to load preferences from it
 * 2. If oldSessionId not found, check authKey mapping for last sessionId
 * 3. If nothing found, use default preferences
 * 4. Save preferences under newSessionId (create new copy)
 * 5. Update authKey → sessionId mapping
 * 6. Create session info for newSessionId
 * 7. Update oldSessionId last access time if it existed
 */
export async function handleSessionHandshake(
	kv: KVNamespace,
	authKey: string,
	userType: 'admin' | 'friend' | 'public',
	request: HandshakeRequest
): Promise<HandshakeResponse> {
	const { oldSessionId, newSessionId } = request;
	
	let preferences: UserPreferences | null = null;
	let migratedFrom: string | undefined = undefined;
	let isNewSession = true;
	
	// Try to load preferences from oldSessionId
	if (oldSessionId) {
		preferences = await getPreferencesBySessionId(kv, oldSessionId);
		if (preferences) {
			migratedFrom = oldSessionId;
			isNewSession = false;
			// Update old session's last access time
			await updateSessionAccess(kv, oldSessionId);
		}
	}
	
	// If oldSessionId not found, try authKey mapping
	if (!preferences) {
		const mapping = await getSessionMapping(kv, authKey);
		if (mapping && mapping.lastSessionId) {
			preferences = await getPreferencesBySessionId(kv, mapping.lastSessionId);
			if (preferences) {
				migratedFrom = mapping.lastSessionId;
				isNewSession = false;
			}
		}
	}
	
	// Use defaults if nothing found
	if (!preferences) {
		preferences = { ...DEFAULT_PREFERENCES };
	}
	
	// Save preferences under newSessionId (create new copy)
	await savePreferencesBySessionId(kv, newSessionId, preferences);
	
	// Update authKey → sessionId mapping
	await updateSessionMapping(kv, authKey, newSessionId);
	
	// Create session info for newSessionId
	const now = new Date().toISOString();
	const sessionInfo: SessionInfo = {
		sessionId: newSessionId,
		authKey,
		userType,
		createdAt: now,
		lastAccessedAt: now
	};
	await saveSessionInfo(kv, sessionInfo);
	
	return {
		sessionId: newSessionId,
		preferences,
		isNewSession,
		migratedFrom
	};
}

// ============================================================================
// Cleanup Utilities (for future use)
// ============================================================================

/**
 * Delete session and its preferences
 * Note: Only use this for security/blacklist scenarios
 */
export async function deleteSession(
	kv: KVNamespace,
	sessionId: string
): Promise<void> {
	// Delete preferences
	await kv.delete(preferencesKey(sessionId));
	
	// Delete session info
	await kv.delete(sessionInfoKey(sessionId));
	
	// Note: Session mapping is NOT updated here
	// The sessionId will remain in the authKey's list
	// This is intentional - we want to track that it existed
}

/**
 * Remove sessionId from authKey mapping
 * Note: Only use this for security/blacklist scenarios
 */
export async function removeSessionFromMapping(
	kv: KVNamespace,
	authKey: string,
	sessionId: string
): Promise<void> {
	const mapping = await getSessionMapping(kv, authKey);
	if (mapping) {
		mapping.sessionIds = mapping.sessionIds.filter(id => id !== sessionId);
		
		// Update lastSessionId if it was removed
		if (mapping.lastSessionId === sessionId) {
			mapping.lastSessionId = mapping.sessionIds[mapping.sessionIds.length - 1] || '';
		}
		
		mapping.updatedAt = new Date().toISOString();
		
		await kv.put(sessionMappingKey(authKey), JSON.stringify(mapping));
	}
}
