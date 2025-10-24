/**
 * Throttling System for Task API
 * 
 * Implements rate limiting per sessionId with configurable limits based on userType.
 * Tracks violations and enables blacklisting of abusive sessions.
 */

export interface ThrottleConfig {
	windowMs: number;  // Time window in milliseconds
	maxRequests: number;  // Max requests per window
}

export interface ThrottleState {
	count: number;
	windowStart: number;  // Timestamp when window started
	violations: number;  // Total violations count
	lastViolation?: number;  // Timestamp of last violation
}

export interface ThrottleLimits {
	admin: ThrottleConfig;
	friend: ThrottleConfig;
	public: ThrottleConfig;
}

export interface IncidentRecord {
	timestamp: string;
	type: 'throttle_violation' | 'blacklist' | 'suspicious_pattern';
	sessionId: string;
	authKey?: string;
	userType: string;
	details: Record<string, any>;
}

/**
 * Default throttle limits per user type
 */
export const DEFAULT_THROTTLE_LIMITS: ThrottleLimits = {
	admin: {
		windowMs: 60 * 1000,  // 1 minute
		maxRequests: 300  // 300 requests per minute (5 req/sec)
	},
	friend: {
		windowMs: 60 * 1000,  // 1 minute
		maxRequests: 120  // 120 requests per minute (2 req/sec)
	},
	public: {
		windowMs: 60 * 1000,  // 1 minute
		maxRequests: 60  // 60 requests per minute (1 req/sec)
	}
};

/**
 * Thresholds for automatic actions
 */
export const THROTTLE_THRESHOLDS = {
	// Blacklist after this many violations in a row
	BLACKLIST_VIOLATION_COUNT: 3,
	
	// How long to keep throttle state (cleanup)
	STATE_TTL_MS: 5 * 60 * 1000,  // 5 minutes
	
	// How long to keep incident records
	INCIDENT_TTL_SECONDS: 24 * 60 * 60,  // 24 hours
	
	// Max incidents to store per sessionId
	MAX_INCIDENTS_PER_SESSION: 100
};

/**
 * KV keys for throttle data
 */
const throttleKey = (sessionId: string) => `throttle:${sessionId}`;
const incidentsKey = (sessionId: string) => `incidents:${sessionId}`;
const blacklistKey = (sessionId: string) => `blacklist:${sessionId}`;

/**
 * Check if a sessionId is allowed to make a request
 * Updates throttle state and returns whether request should be allowed
 */
export async function checkThrottle(
	kv: KVNamespace,
	sessionId: string,
	userType: 'admin' | 'friend' | 'public',
	limits: ThrottleLimits = DEFAULT_THROTTLE_LIMITS
): Promise<{ allowed: boolean; state: ThrottleState; reason?: string }> {
	const now = Date.now();
	const config = limits[userType];
	
	// Check blacklist first
	const isBlacklisted = await isSessionBlacklisted(kv, sessionId);
	if (isBlacklisted) {
		return {
			allowed: false,
			state: { count: 0, windowStart: now, violations: 999 },
			reason: 'Session is blacklisted'
		};
	}
	
	// Get current throttle state
	const key = throttleKey(sessionId);
	const stateData = await kv.get(key, 'json') as ThrottleState | null;
	
	let state: ThrottleState;
	
	if (!stateData || now - stateData.windowStart >= config.windowMs) {
		// Start new window
		state = {
			count: 1,
			windowStart: now,
			violations: stateData?.violations || 0
		};
	} else {
		// Update existing window
		state = {
			...stateData,
			count: stateData.count + 1
		};
	}
	
	// Check if over limit
	if (state.count > config.maxRequests) {
		// Violation!
		state.violations++;
		state.lastViolation = now;
		
		// Save updated state
		await kv.put(key, JSON.stringify(state), {
			expirationTtl: Math.ceil(THROTTLE_THRESHOLDS.STATE_TTL_MS / 1000)
		});
		
		return {
			allowed: false,
			state,
			reason: `Rate limit exceeded: ${state.count}/${config.maxRequests} requests in ${config.windowMs}ms window`
		};
	}
	
	// Save updated state
	await kv.put(key, JSON.stringify(state), {
		expirationTtl: Math.ceil(THROTTLE_THRESHOLDS.STATE_TTL_MS / 1000)
	});
	
	return { allowed: true, state };
}

/**
 * Record an incident for a sessionId
 */
export async function recordIncident(
	kv: KVNamespace,
	incident: IncidentRecord
): Promise<void> {
	const key = incidentsKey(incident.sessionId);
	
	// Get existing incidents
	const existing = await kv.get(key, 'json') as IncidentRecord[] | null;
	const incidents = existing || [];
	
	// Add new incident
	incidents.push(incident);
	
	// Keep only last N incidents
	const trimmed = incidents.slice(-THROTTLE_THRESHOLDS.MAX_INCIDENTS_PER_SESSION);
	
	// Save with TTL
	await kv.put(key, JSON.stringify(trimmed), {
		expirationTtl: THROTTLE_THRESHOLDS.INCIDENT_TTL_SECONDS
	});
}

/**
 * Get incidents for a sessionId
 */
export async function getIncidents(
	kv: KVNamespace,
	sessionId: string
): Promise<IncidentRecord[]> {
	const key = incidentsKey(sessionId);
	const data = await kv.get(key, 'json') as IncidentRecord[] | null;
	return data || [];
}

/**
 * Blacklist a sessionId
 */
export async function blacklistSession(
	kv: KVNamespace,
	sessionId: string,
	reason: string,
	authKey?: string
): Promise<void> {
	const key = blacklistKey(sessionId);
	const data = {
		sessionId,
		reason,
		authKey,
		timestamp: new Date().toISOString()
	};
	
	// Blacklist for 24 hours
	await kv.put(key, JSON.stringify(data), {
		expirationTtl: 24 * 60 * 60
	});
	
	// Record incident
	await recordIncident(kv, {
		timestamp: data.timestamp,
		type: 'blacklist',
		sessionId,
		authKey,
		userType: 'unknown',
		details: { reason }
	});
}

/**
 * Check if a sessionId is blacklisted
 */
export async function isSessionBlacklisted(
	kv: KVNamespace,
	sessionId: string
): Promise<boolean> {
	const key = blacklistKey(sessionId);
	const data = await kv.get(key);
	return data !== null;
}

/**
 * Remove a sessionId from blacklist
 */
export async function unblacklistSession(
	kv: KVNamespace,
	sessionId: string
): Promise<void> {
	const key = blacklistKey(sessionId);
	await kv.delete(key);
}

/**
 * Get throttle state for a sessionId (for monitoring)
 */
export async function getThrottleState(
	kv: KVNamespace,
	sessionId: string
): Promise<ThrottleState | null> {
	const key = throttleKey(sessionId);
	const data = await kv.get(key, 'json') as ThrottleState | null;
	return data;
}

/**
 * Reset throttle state for a sessionId
 */
export async function resetThrottleState(
	kv: KVNamespace,
	sessionId: string
): Promise<void> {
	const key = throttleKey(sessionId);
	await kv.delete(key);
}

/**
 * Check for suspicious patterns across sessions for an authKey
 * This helps detect compromised keys
 */
export async function checkSuspiciousPatterns(
	kv: KVNamespace,
	authKey: string,
	sessionIds: string[]
): Promise<{ suspicious: boolean; reasons: string[] }> {
	const reasons: string[] = [];
	
	// Pattern 1: Too many active sessions
	if (sessionIds.length > 10) {
		reasons.push(`Unusual number of sessions: ${sessionIds.length}`);
	}
	
	// Pattern 2: Check for high violation rates across sessions
	let totalViolations = 0;
	for (const sessionId of sessionIds) {
		const state = await getThrottleState(kv, sessionId);
		if (state) {
			totalViolations += state.violations;
		}
	}
	
	if (totalViolations > 20) {
		reasons.push(`High violation count across sessions: ${totalViolations}`);
	}
	
	// Pattern 3: Check recent incidents
	const recentIncidents: IncidentRecord[] = [];
	for (const sessionId of sessionIds.slice(0, 5)) {  // Check last 5 sessions
		const incidents = await getIncidents(kv, sessionId);
		recentIncidents.push(...incidents);
	}
	
	const recentViolations = recentIncidents.filter(
		i => i.type === 'throttle_violation' && 
		Date.now() - new Date(i.timestamp).getTime() < 60 * 60 * 1000  // Last hour
	);
	
	if (recentViolations.length > 50) {
		reasons.push(`High recent violation rate: ${recentViolations.length} in last hour`);
	}
	
	return {
		suspicious: reasons.length > 0,
		reasons
	};
}
