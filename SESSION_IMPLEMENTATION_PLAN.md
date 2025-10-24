# Session Management Implementation Plan

## Overview

Implement a robust session management system that:
1. Tracks multiple devices per auth key
2. Migrates preferences when sessionId changes
3. Throttles excessive requests per sessionId
4. Blacklists abusive sessionIds
5. Detects compromised auth keys and alerts admin

## Three-Phase Implementation

---

## Phase 1: Session Management & Handshake

### 1.1 Data Structures

#### Session Mapping Storage
```typescript
// KV Keys:
// session-map:{sessionId} → SessionInfo
interface SessionInfo {
  sessionId: string;           // e.g., "session-1729123456-abc123"
  authKey: string;             // e.g., "a21743d9-b0f1-4c75-8e01-ba2dc37feacd"
  userType: 'admin' | 'friend' | 'public';
  createdAt: string;           // ISO timestamp
  lastSeen: string;            // ISO timestamp
  deviceInfo?: string;         // Optional: user agent, device name
}

// auth-sessions:{authKey} → SessionList
interface SessionList {
  authKey: string;
  sessions: string[];          // Array of sessionIds for this authKey
  updatedAt: string;
}

// prefs:{sessionId} → UserPreferences
interface UserPreferences {
  version: number;
  updatedAt: string;
  theme: string;
  showCompleteButton: boolean;
  showDeleteButton: boolean;
  showTagButton: boolean;
  experimentalThemes: boolean;
  alwaysVerticalLayout: boolean;
  // ... any other preference fields
}
```

#### File System Structure (if using filesystem)
```
data/
  session-maps/
    {sessionId}.json          → SessionInfo
  auth-sessions/
    {authKey}.json            → SessionList (array of sessionIds)
  preferences/
    {sessionId}.json          → UserPreferences
  boards/
    {userType}-{sessionId}-boards.json
  tasks/
    {userType}-{sessionId}-{boardId}-tasks.json
```

### 1.2 Storage Interface

Add to `@hadoku/worker-utils` or task-api storage:

```typescript
interface SessionStorage {
  // Session mapping
  getSessionInfo(sessionId: string): Promise<SessionInfo | null>;
  saveSessionInfo(sessionId: string, info: SessionInfo): Promise<void>;
  deleteSessionInfo(sessionId: string): Promise<void>;
  
  // Auth key → session list mapping
  getSessionsForAuthKey(authKey: string): Promise<string[]>;
  addSessionToAuthKey(authKey: string, sessionId: string): Promise<void>;
  removeSessionFromAuthKey(authKey: string, sessionId: string): Promise<void>;
  
  // Preferences by sessionId
  getPreferencesBySessionId(sessionId: string): Promise<UserPreferences | null>;
  savePreferencesBySessionId(sessionId: string, prefs: UserPreferences): Promise<void>;
  deletePreferencesBySessionId(sessionId: string): Promise<void>;
  
  // Utility
  getAllSessionsForAuthKey(authKey: string): Promise<SessionInfo[]>;
}
```

### 1.3 Session Handshake Endpoint

**Endpoint:** `POST /task/api/session/handshake`

**Headers:**
- `X-User-Key`: Auth key (for authenticated users)
- `Content-Type`: application/json

**Request Body:**
```typescript
{
  oldSessionId: string | null;  // Previous sessionId (null on first load)
  newSessionId: string;         // New sessionId from client
  deviceInfo?: string;          // Optional: user agent or device name
}
```

**Response:**
```typescript
{
  sessionId: string;            // Confirmed sessionId
  preferences: UserPreferences; // Migrated or default preferences
  migrated: boolean;            // true if preferences were migrated from old session
}
```

**Implementation:**
```typescript
async function handleSessionHandshake(req, env) {
  const { oldSessionId, newSessionId, deviceInfo } = await req.json();
  const authKey = req.headers.get('X-User-Key');
  const userType = determineUserType(authKey, env);
  
  let preferences: UserPreferences | null = null;
  let migrated = false;
  
  // Step 1: Try to find existing preferences by oldSessionId
  if (oldSessionId) {
    const oldSessionInfo = await storage.getSessionInfo(oldSessionId);
    
    if (oldSessionInfo) {
      // Found old session - load its preferences
      preferences = await storage.getPreferencesBySessionId(oldSessionId);
      migrated = true;
      
      console.log('[Handshake] Migrating preferences from oldSessionId:', oldSessionId);
      console.log('[Handshake] Old session belonged to authKey:', oldSessionInfo.authKey);
      
      // If old session belonged to different authKey, it's still fine
      // User might have switched keys - we still migrate their preferences
      // The preferences are device-specific, not key-specific
    }
  }
  
  // Step 2: If no preferences found, use defaults
  if (!preferences) {
    preferences = DEFAULT_PREFERENCES;
    console.log('[Handshake] No existing preferences, using defaults');
  }
  
  // Step 3: Create new session info
  const sessionInfo: SessionInfo = {
    sessionId: newSessionId,
    authKey: authKey || 'public',
    userType,
    createdAt: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    deviceInfo
  };
  
  // Step 4: Save new session info
  await storage.saveSessionInfo(newSessionId, sessionInfo);
  
  // Step 5: Save preferences under new sessionId
  await storage.savePreferencesBySessionId(newSessionId, {
    ...preferences,
    updatedAt: new Date().toISOString()
  });
  
  // Step 6: Add new sessionId to authKey's session list
  if (authKey) {
    await storage.addSessionToAuthKey(authKey, newSessionId);
  }
  
  // Step 7: Log session transition
  console.log('[Handshake] Session transition:', {
    oldSessionId: oldSessionId || 'none',
    newSessionId,
    authKey: authKey || 'public',
    migrated
  });
  
  return {
    sessionId: newSessionId,
    preferences,
    migrated
  };
}
```

### 1.4 Update Existing Preferences Endpoints

**GET /task/api/preferences**
```typescript
async function getPreferences(req, env) {
  const sessionId = req.headers.get('X-Session-Id');
  
  if (!sessionId) {
    return jsonError('Missing X-Session-Id header', 400);
  }
  
  // Verify session exists and update lastSeen
  const sessionInfo = await storage.getSessionInfo(sessionId);
  if (sessionInfo) {
    sessionInfo.lastSeen = new Date().toISOString();
    await storage.saveSessionInfo(sessionId, sessionInfo);
  }
  
  // Fetch preferences by sessionId
  const preferences = await storage.getPreferencesBySessionId(sessionId);
  
  return json(preferences || DEFAULT_PREFERENCES);
}
```

**PUT /task/api/preferences**
```typescript
async function updatePreferences(req, env) {
  const sessionId = req.headers.get('X-Session-Id');
  
  if (!sessionId) {
    return jsonError('Missing X-Session-Id header', 400);
  }
  
  const updates = await req.json();
  
  // Verify session exists and update lastSeen
  const sessionInfo = await storage.getSessionInfo(sessionId);
  if (sessionInfo) {
    sessionInfo.lastSeen = new Date().toISOString();
    await storage.saveSessionInfo(sessionId, sessionInfo);
  }
  
  // Merge with existing preferences
  const existing = await storage.getPreferencesBySessionId(sessionId);
  const merged = {
    ...(existing || DEFAULT_PREFERENCES),
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Save updated preferences
  await storage.savePreferencesBySessionId(sessionId, merged);
  
  return json(merged);
}
```

### 1.5 Update All API Endpoints

Add sessionId tracking to ALL endpoints:

```typescript
// Middleware: Extract and validate sessionId
async function sessionMiddleware(c, next) {
  const sessionId = c.req.header('X-Session-Id') || c.req.query('sessionId');
  
  if (sessionId) {
    // Update lastSeen timestamp
    const sessionInfo = await storage.getSessionInfo(sessionId);
    if (sessionInfo) {
      sessionInfo.lastSeen = new Date().toISOString();
      await storage.saveSessionInfo(sessionId, sessionInfo);
    }
    
    // Store in context
    c.set('sessionId', sessionId);
  }
  
  await next();
}

// Apply to all routes
app.use('*', sessionMiddleware);
```

### 1.6 Session Cleanup (Optional)

```typescript
// Clean up old sessions (run periodically)
async function cleanupOldSessions(env) {
  const RETENTION_DAYS = 90; // Keep sessions for 90 days
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
  
  // This would require iterating through all sessions
  // Implementation depends on storage backend (KV, filesystem, etc.)
  
  console.log('[Cleanup] Would remove sessions older than:', cutoffDate.toISOString());
}
```

---

## Phase 2: SessionId Rate Limiting & Blacklisting

### 2.1 Rate Limit Configuration

```typescript
interface RateLimitConfig {
  perSecond: number;    // e.g., 10 requests/second
  perHour: number;      // e.g., 200 requests/hour
  perDay: number;       // e.g., 1000 requests/day
}

const RATE_LIMITS: RateLimitConfig = {
  perSecond: 10,
  perHour: 200,
  perDay: 1000
};
```

### 2.2 Rate Limiting Storage

```typescript
// KV Keys for rate limiting:
// rate:{sessionId}:second:{timestamp} → count
// rate:{sessionId}:hour:{timestamp}   → count
// rate:{sessionId}:day:{timestamp}    → count
// blacklist:{sessionId}               → BlacklistInfo

interface BlacklistInfo {
  sessionId: string;
  authKey: string;
  reason: string;           // Which limit was violated
  violationCount: number;   // How many requests exceeded limit
  timestamp: string;        // When blacklisted
  requests: {
    perSecond?: number;
    perHour?: number;
    perDay?: number;
  };
}

interface RateLimitEntry {
  count: number;
  expiresAt: number;        // Unix timestamp
}
```

### 2.3 Rate Limiting Middleware

```typescript
async function rateLimitMiddleware(c, next) {
  const sessionId = c.get('sessionId');
  
  if (!sessionId) {
    // No sessionId = no rate limiting (for backward compatibility)
    await next();
    return;
  }
  
  // Check if blacklisted
  const blacklisted = await storage.isBlacklisted(sessionId);
  if (blacklisted) {
    console.warn('[RateLimit] Blocked blacklisted session:', sessionId);
    return c.json({ error: 'Session blocked due to abuse' }, 403);
  }
  
  const now = Date.now();
  const violations: string[] = [];
  
  // Check per-second limit
  const secondKey = `rate:${sessionId}:second:${Math.floor(now / 1000)}`;
  const secondCount = await incrementRateLimit(c.env.TASKS_KV, secondKey, 1);
  if (secondCount > RATE_LIMITS.perSecond) {
    violations.push(`perSecond (${secondCount}/${RATE_LIMITS.perSecond})`);
  }
  
  // Check per-hour limit
  const hourKey = `rate:${sessionId}:hour:${Math.floor(now / 3600000)}`;
  const hourCount = await incrementRateLimit(c.env.TASKS_KV, hourKey, 3600);
  if (hourCount > RATE_LIMITS.perHour) {
    violations.push(`perHour (${hourCount}/${RATE_LIMITS.perHour})`);
  }
  
  // Check per-day limit
  const dayKey = `rate:${sessionId}:day:${Math.floor(now / 86400000)}`;
  const dayCount = await incrementRateLimit(c.env.TASKS_KV, dayKey, 86400);
  if (dayCount > RATE_LIMITS.perDay) {
    violations.push(`perDay (${dayCount}/${RATE_LIMITS.perDay})`);
  }
  
  // If violations detected, blacklist the session
  if (violations.length > 0) {
    console.error('[RateLimit] Session violated rate limits:', {
      sessionId,
      violations,
      counts: { secondCount, hourCount, dayCount }
    });
    
    const sessionInfo = await storage.getSessionInfo(sessionId);
    
    await blacklistSession(c.env, sessionId, {
      sessionId,
      authKey: sessionInfo?.authKey || 'unknown',
      reason: violations.join(', '),
      violationCount: Math.max(secondCount, hourCount, dayCount),
      timestamp: new Date().toISOString(),
      requests: {
        perSecond: secondCount,
        perHour: hourCount,
        perDay: dayCount
      }
    });
    
    return c.json({
      error: 'Rate limit exceeded',
      violations,
      message: 'This session has been blocked due to excessive requests'
    }, 429);
  }
  
  await next();
}

async function incrementRateLimit(kv: KVNamespace, key: string, ttlSeconds: number): Promise<number> {
  const current = await kv.get(key);
  const count = current ? parseInt(current) + 1 : 1;
  
  // Store with TTL
  await kv.put(key, count.toString(), {
    expirationTtl: ttlSeconds
  });
  
  return count;
}
```

### 2.4 Blacklist Management

```typescript
interface BlacklistStorage {
  isBlacklisted(sessionId: string): Promise<boolean>;
  addToBlacklist(sessionId: string, info: BlacklistInfo): Promise<void>;
  getBlacklistInfo(sessionId: string): Promise<BlacklistInfo | null>;
  removeFromBlacklist(sessionId: string): Promise<void>;
}

async function blacklistSession(env, sessionId: string, info: BlacklistInfo) {
  // Add to blacklist
  await env.TASKS_KV.put(
    `blacklist:${sessionId}`,
    JSON.stringify(info),
    { expirationTtl: 30 * 86400 } // Keep for 30 days
  );
  
  console.log('[Blacklist] Session blacklisted:', {
    sessionId,
    authKey: info.authKey,
    reason: info.reason
  });
  
  // Delete preferences for blacklisted session
  await storage.deletePreferencesBySessionId(sessionId);
  
  // Remove from auth key's session list
  if (info.authKey && info.authKey !== 'unknown') {
    await storage.removeSessionFromAuthKey(info.authKey, sessionId);
  }
  
  console.log('[Blacklist] Cleaned up data for blacklisted session:', sessionId);
}

async function isBlacklisted(kv: KVNamespace, sessionId: string): Promise<boolean> {
  const info = await kv.get(`blacklist:${sessionId}`);
  return info !== null;
}
```

### 2.5 Apply Rate Limiting to All Routes

```typescript
// In index.ts
app.use('*', sessionMiddleware);      // Extract sessionId
app.use('*', rateLimitMiddleware);    // Check rate limits

// All subsequent routes will be rate limited
app.post('/task/api/session/handshake', handleSessionHandshake);
app.get('/task/api/preferences', getPreferences);
app.put('/task/api/preferences', updatePreferences);
// ... all other routes
```

---

## Phase 3: Compromised Key Detection & Email Alerts

### 3.1 Key Compromise Detection

```typescript
interface KeyViolationInfo {
  authKey: string;
  violatedSessions: BlacklistInfo[];
  totalViolations: number;
  detectedAt: string;
  allSessions: string[];        // All sessions for this key
}

async function checkForCompromisedKey(env, authKey: string, blacklistedSessionId: string) {
  // Get all sessions for this auth key
  const allSessions = await storage.getSessionsForAuthKey(authKey);
  
  // Count how many are blacklisted
  const blacklistedSessions: BlacklistInfo[] = [];
  
  for (const sessionId of allSessions) {
    const blacklistInfo = await env.TASKS_KV.get(`blacklist:${sessionId}`, 'json');
    if (blacklistInfo) {
      blacklistedSessions.push(blacklistInfo);
    }
  }
  
  // If multiple sessions are blacklisted, consider key compromised
  const THRESHOLD = 2; // If 2+ sessions violated, key is likely compromised
  
  if (blacklistedSessions.length >= THRESHOLD) {
    console.error('[Security] COMPROMISED KEY DETECTED:', {
      authKey,
      blacklistedCount: blacklistedSessions.length,
      totalSessions: allSessions.length
    });
    
    const violationInfo: KeyViolationInfo = {
      authKey,
      violatedSessions: blacklistedSessions,
      totalViolations: blacklistedSessions.reduce((sum, s) => sum + s.violationCount, 0),
      detectedAt: new Date().toISOString(),
      allSessions
    };
    
    // Send alert email
    await sendCompromisedKeyAlert(env, violationInfo);
    
    return true;
  }
  
  return false;
}
```

### 3.2 Email Alert Service

```typescript
interface EmailConfig {
  to: string;               // jamescannon4237@gmail.com
  from: string;             // noreply@hadoku.me
  subject: string;
  body: string;
}

async function sendCompromisedKeyAlert(env, violation: KeyViolationInfo) {
  const email: EmailConfig = {
    to: 'jamescannon4237@gmail.com',
    from: 'security@hadoku.me',
    subject: `🚨 SECURITY ALERT: Compromised Auth Key Detected`,
    body: generateAlertEmail(violation)
  };
  
  // Option 1: Use Cloudflare Email Workers
  await sendViaCloudflareEmail(env, email);
  
  // Option 2: Use external service (SendGrid, Mailgun, etc.)
  // await sendViaExternalService(env, email);
  
  console.log('[Email] Sent compromised key alert to:', email.to);
}

function generateAlertEmail(violation: KeyViolationInfo): string {
  const { authKey, violatedSessions, totalViolations, detectedAt, allSessions } = violation;
  
  return `
🚨 SECURITY ALERT: Compromised Auth Key Detected
================================================

**Auth Key:** ${authKey}
**Detection Time:** ${detectedAt}
**Total Sessions:** ${allSessions.length}
**Blacklisted Sessions:** ${violatedSessions.length}
**Total Violations:** ${totalViolations}

## Violated Sessions

${violatedSessions.map((session, idx) => `
### Session ${idx + 1}: ${session.sessionId}
- **Reason:** ${session.reason}
- **Violation Count:** ${session.violationCount}
- **Timestamp:** ${session.timestamp}
- **Request Rates:**
  - Per Second: ${session.requests.perSecond || 'N/A'}
  - Per Hour: ${session.requests.perHour || 'N/A'}
  - Per Day: ${session.requests.perDay || 'N/A'}
`).join('\n')}

## All Sessions for This Key

${allSessions.map((sid, idx) => `${idx + 1}. ${sid}`).join('\n')}

## Recommended Actions

1. **Verify Legitimacy:** Check if these are genuine user sessions or abuse
2. **Rotate Key:** If compromised, migrate data to new auth key
3. **Review Logs:** Investigate the nature of the excessive requests
4. **Contact User:** If genuine, inform them of suspicious activity
5. **Restore Data:** If needed, restore clean data from backup

## Dashboard Links

- View Key Details: https://admin.hadoku.me/keys/${authKey}
- Review Sessions: https://admin.hadoku.me/sessions?key=${authKey}
- Check Logs: https://dash.cloudflare.com/...

---
This is an automated alert from the Hadoku Task API security system.
`.trim();
}

async function sendViaCloudflareEmail(env, email: EmailConfig) {
  // Using Cloudflare Email Workers (requires setup)
  // https://developers.cloudflare.com/email-routing/email-workers/
  
  try {
    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: email.to }],
          },
        ],
        from: {
          email: email.from,
          name: 'Hadoku Security',
        },
        subject: email.subject,
        content: [
          {
            type: 'text/plain',
            value: email.body,
          },
        ],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Email failed: ${response.status} ${response.statusText}`);
    }
    
    console.log('[Email] Successfully sent via MailChannels');
  } catch (error) {
    console.error('[Email] Failed to send alert:', error);
    
    // Fallback: Log to console and storage for manual review
    await env.TASKS_KV.put(
      `security-alerts:${Date.now()}`,
      JSON.stringify({ email, error: error.message }),
      { expirationTtl: 30 * 86400 }
    );
  }
}
```

### 3.3 Alternative: Email via Environment Variable (Simpler)

If you don't want to set up Cloudflare Email Workers immediately:

```typescript
async function sendCompromisedKeyAlert(env, violation: KeyViolationInfo) {
  // For now, just log to a special KV namespace that you monitor
  const alertKey = `security-alert:${Date.now()}`;
  const alertData = {
    type: 'COMPROMISED_KEY',
    ...violation,
    emailTo: 'jamescannon4237@gmail.com',
    priority: 'HIGH'
  };
  
  await env.TASKS_KV.put(
    alertKey,
    JSON.stringify(alertData),
    { expirationTtl: 30 * 86400 } // Keep for 30 days
  );
  
  console.error('[Security Alert] Stored for manual review:', alertKey);
  console.error('[Security Alert] Data:', JSON.stringify(alertData, null, 2));
  
  // TODO: Set up automated email sending
  // For now, you can check KV manually or set up a cron job to email these
}
```

### 3.4 Admin Endpoint to Review Alerts

```typescript
// GET /task/api/admin/security-alerts
async function getSecurityAlerts(req, env) {
  // Require admin authentication
  const authKey = req.headers.get('X-User-Key');
  if (!isAdminKey(authKey, env)) {
    return c.json({ error: 'Admin access required' }, 403);
  }
  
  // List all security alerts from KV
  const alerts = await env.TASKS_KV.list({ prefix: 'security-alert:' });
  
  const alertData = await Promise.all(
    alerts.keys.map(async (key) => {
      const data = await env.TASKS_KV.get(key.name, 'json');
      return { key: key.name, ...data };
    })
  );
  
  return c.json({
    count: alertData.length,
    alerts: alertData
  });
}
```

---

## Implementation Checklist

### Phase 1: Session Management
- [ ] Create SessionInfo, SessionList, UserPreferences interfaces
- [ ] Implement SessionStorage interface methods
- [ ] Create POST /task/api/session/handshake endpoint
- [ ] Update GET /task/api/preferences to use X-Session-Id header
- [ ] Update PUT /task/api/preferences to use X-Session-Id header
- [ ] Add sessionMiddleware to track lastSeen
- [ ] Test session migration (oldSessionId → newSessionId)
- [ ] Test multi-device scenario (same authKey, different sessionIds)
- [ ] Verify preferences are device-specific (not shared)

### Phase 2: Rate Limiting
- [ ] Define RateLimitConfig with per-second/hour/day limits
- [ ] Create BlacklistInfo interface
- [ ] Implement rateLimitMiddleware
- [ ] Implement incrementRateLimit function
- [ ] Implement blacklistSession function
- [ ] Test rate limiting (exceed limits and verify blacklist)
- [ ] Test blacklisted session is rejected
- [ ] Verify preferences are deleted when blacklisted
- [ ] Apply middleware to all API routes

### Phase 3: Security Alerts
- [ ] Create KeyViolationInfo interface
- [ ] Implement checkForCompromisedKey function
- [ ] Implement sendCompromisedKeyAlert function
- [ ] Implement generateAlertEmail function
- [ ] Set up email sending (MailChannels or alternative)
- [ ] Test compromised key detection (multiple violated sessions)
- [ ] Test email alert is sent
- [ ] Create admin endpoint to review alerts
- [ ] Document manual intervention procedures

---

## Environment Variables

Add to `.env` and Cloudflare Workers environment:

```bash
# Email Configuration (Phase 3)
SECURITY_ALERT_EMAIL=jamescannon4237@gmail.com
SECURITY_ALERT_FROM=security@hadoku.me

# Rate Limit Configuration (Phase 2)
RATE_LIMIT_PER_SECOND=10
RATE_LIMIT_PER_HOUR=200
RATE_LIMIT_PER_DAY=1000

# Compromised Key Threshold (Phase 3)
COMPROMISED_KEY_THRESHOLD=2  # Number of violated sessions before alerting
```

---

## Testing Strategy

### Unit Tests
- Session handshake with/without oldSessionId
- Preference migration across sessionIds
- Rate limit counting and enforcement
- Blacklist enforcement
- Compromised key detection

### Integration Tests
- Multi-device workflow (3 devices, same authKey)
- Session migration on sessionId change
- Rate limit triggers blacklist
- Multiple blacklisted sessions trigger email

### Manual Testing
- Test with real browser and phone
- Verify preferences don't cross devices
- Trigger rate limit and verify blacklist
- Verify email is received

---

## Security Considerations

1. **SessionId is not a secret** - It's a namespace for storage
2. **AuthKey is the security token** - Always validate on requests
3. **Rate limits prevent abuse** - Per sessionId, not per authKey
4. **Blacklist is persistent** - Stays for 30 days
5. **Email alerts for compromised keys** - Manual intervention required
6. **Preferences deleted on blacklist** - No data retention for abusers

---

## Migration Path

### Existing Users
1. First request with new handshake: oldSessionId=null
2. Server checks if authKey has existing preferences (legacy)
3. Migrate legacy preferences to new sessionId
4. Future requests use new sessionId-based storage

### Backward Compatibility
- If X-Session-Id header missing, use authKey-based storage (legacy)
- Gradually migrate users as they update client
- Eventually require X-Session-Id header

---

## Monitoring

### Metrics to Track
- New sessions per day
- Session handshakes per day
- Rate limit violations per day
- Blacklisted sessions per day
- Compromised keys detected per week
- Average sessions per authKey

### Alerts
- High rate limit violations (> 10/hour)
- Compromised key detected
- Email sending failures
- Unusual session patterns

---

## Future Enhancements

1. **Session expiration**: Auto-expire sessions after 90 days of inactivity
2. **Session names**: Allow users to name their devices
3. **Session management UI**: View/revoke sessions
4. **IP-based rate limiting**: Additional layer of protection
5. **Geolocation tracking**: Detect unusual session locations
6. **Audit logs**: Track all session activities
