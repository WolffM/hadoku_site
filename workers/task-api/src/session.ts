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
import { DEFAULT_PREFERENCES as CONSTANTS_DEFAULT_PREFERENCES } from './constants';
import { preferencesKey, sessionInfoKey, sessionMappingKey } from './kv-keys';

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
 *
 * Note: This should only be called AFTER session-info has been successfully saved
 * to prevent orphaned session references (mystery sessions)
 */
export async function updateSessionMapping(
	kv: KVNamespace,
	authKey: string,
	sessionId: string
): Promise<void> {
	// Verify session-info exists before adding to mapping
	// This prevents "mystery sessions" that have no session data
	const sessionInfo = await getSessionInfo(kv, sessionId);
	if (!sessionInfo) {
		console.warn(`[SessionMapping] Cannot add session ${sessionId.substring(0, 16)}... - no session-info exists`);
		return;
	}

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

// ============================================================================
// Session Handshake Logic
// ============================================================================

/**
 * Default preferences for new sessions
 */
const DEFAULT_PREFERENCES: UserPreferences = {
	...CONSTANTS_DEFAULT_PREFERENCES,
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
 * 2. If oldSessionId not found, check authKey mapping for last sessionId (for fallback only, don't delete)
 * 3. If nothing found, use default preferences
 * 4. MOVE preferences to newSessionId ONLY if oldSessionId was provided (delete old, save new)
 * 5. Update authKey → sessionId mapping
 * 6. Create session info for newSessionId
 * 7. Delete old session info if it was migrated
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
	let sessionIdToDelete: string | null = null;
	
	// Try to load preferences from oldSessionId (explicit migration)
	if (oldSessionId) {
		preferences = await getPreferencesBySessionId(kv, oldSessionId);
		if (preferences) {
			migratedFrom = oldSessionId;
			isNewSession = false;
			sessionIdToDelete = oldSessionId; // Only delete if explicitly migrating
		}
	}
	
	// If oldSessionId not provided or not found, try authKey mapping as fallback
	// Note: We DON'T delete this - it might be another device still using it
	if (!preferences) {
		const mapping = await getSessionMapping(kv, authKey);
		if (mapping && mapping.lastSessionId) {
			preferences = await getPreferencesBySessionId(kv, mapping.lastSessionId);
			if (preferences) {
				migratedFrom = mapping.lastSessionId;
				isNewSession = false;
				// DON'T mark for deletion - this might be a new device
			}
		}
	}

	// Check for legacy authKey-based preferences
	// This handles migration from old storage format (prefs:authKey) to new format (prefs:sessionId)
	if (!preferences) {
		const legacyKey = preferencesKey(authKey);
		const legacyPrefs = await kv.get(legacyKey, 'json') as UserPreferences | null;
		if (legacyPrefs) {
			preferences = legacyPrefs;
			migratedFrom = authKey;
			isNewSession = false;
			console.log(`[Migration] Found legacy prefs for authKey: ${authKey.substring(0, 8)}...`);

			// Delete legacy prefs after migration (standardized migration strategy)
			// The data is now saved to the new sessionId-based key
			await kv.delete(legacyKey);
		}
	}
	
	// Use defaults if nothing found
	if (!preferences) {
		preferences = { ...DEFAULT_PREFERENCES };
	}
	
	// Save preferences to newSessionId
	await savePreferencesBySessionId(kv, newSessionId, preferences);
	
	// Delete old preferences and session info ONLY if explicitly migrating
	if (sessionIdToDelete && sessionIdToDelete !== newSessionId) {
		await kv.delete(preferencesKey(sessionIdToDelete));
		await kv.delete(sessionInfoKey(sessionIdToDelete));
		
		// Remove old sessionId from mapping
		const mapping = await getSessionMapping(kv, authKey);
		if (mapping) {
			mapping.sessionIds = mapping.sessionIds.filter(id => id !== sessionIdToDelete);
			await kv.put(sessionMappingKey(authKey), JSON.stringify(mapping));
		}
	}
	
	// Create session info for newSessionId FIRST (before updating mapping)
	// This ensures session-info exists when updateSessionMapping checks for it
	const now = new Date().toISOString();
	const sessionInfo: SessionInfo = {
		sessionId: newSessionId,
		authKey,
		userType,
		createdAt: now,
		lastAccessedAt: now
	};
	await saveSessionInfo(kv, sessionInfo);

	// Add new sessionId to mapping (AFTER session-info is created)
	// This prevents "mystery sessions" in the mapping without session-info
	await updateSessionMapping(kv, authKey, newSessionId);
	
	return {
		sessionId: newSessionId,
		preferences,
		isNewSession,
		migratedFrom
	};
}

