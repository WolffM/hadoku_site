# Security Model & Threat Protection

**Last Updated:** November 6, 2025

## Overview

This document describes the security architecture, authentication model, rate limiting, and threat protection mechanisms for the Hadoku site.

---

## Table of Contents

1. [Authentication Model](#authentication-model)
2. [Authorization Levels](#authorization-levels)
3. [Throttling System](#throttling-system)
4. [Incident Tracking](#incident-tracking)
5. [Admin Tools](#admin-tools)
6. [Security Best Practices](#security-best-practices)
7. [Threat Scenarios](#threat-scenarios)

---

## Authentication Model

### Key-Based Authentication

The Task API uses **static key authentication** with three user types:

```
User → Provides X-User-Key header → Validated against Worker secrets → Assigned userType
```

### User Types

| UserType | Access Level | Storage Scope      | Use Case                      |
| -------- | ------------ | ------------------ | ----------------------------- |
| `admin`  | Full access  | Own sessionId data | Primary user, full CRUD       |
| `friend` | Full access  | Own sessionId data | Trusted collaborators         |
| `public` | Read/Write   | localStorage only  | Anonymous users, offline-only |

### Key Storage

**Production:**

- `ADMIN_KEY` - Stored as Cloudflare Worker secret
- `FRIEND_KEY` - Stored as Cloudflare Worker secret
- Keys are UUIDs or secure random strings
- **Never** committed to git
- **Never** logged in plain text

**Key Format:**

```json
{
  "655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b": "admin-user-1",
  "N7RZK2YW9X1TQ8HP": "friend-user-1"
}
```

### Authentication Flow

```typescript
// 1. Extract key from request
const userKey = request.headers.get('X-User-Key');

// 2. Validate against secrets
const adminKeys = JSON.parse(env.ADMIN_KEYS);
const friendKeys = JSON.parse(env.FRIEND_KEYS);

// 3. Determine userType
if (userKey in adminKeys) {
  userType = 'admin';
} else if (userKey in friendKeys) {
  userType = 'friend';
} else {
  userType = 'public'; // Fallback to public mode
}

// 4. Create auth context
return {
  userType,
  sessionId: userKey || 'public',
  key: userKey,
};
```

**Code Location:** `workers/task-api/src/index.ts:69-94`

---

## Authorization Levels

### Public Mode

**Access:** localStorage only, no API calls

**Restrictions:**

- ❌ Cannot sync data across devices
- ❌ No server-side storage
- ❌ Data lost if browser cache cleared

**Benefits:**

- ✅ Fully offline capable
- ✅ Zero server cost
- ✅ Zero latency
- ✅ No authentication required

### Friend Mode

**Access:** Full API access with Workers KV storage

**Capabilities:**

- ✅ Create/read/update/delete tasks
- ✅ Manage boards and tags
- ✅ Multi-device support
- ✅ Data persistence in Workers KV

**Restrictions:**

- ❌ No admin endpoints access
- ❌ Cannot manage throttling
- ❌ Cannot view system logs

### Admin Mode

**Access:** Full API access + admin endpoints

**Capabilities:**

- ✅ All friend mode capabilities
- ✅ Access admin endpoints
- ✅ Manage throttling state
- ✅ View incident logs
- ✅ Blacklist/unblacklist sessions
- ✅ Reset throttle states

**Admin Endpoints:**

```
GET  /task/api/admin/throttle/:sessionId    - View throttle state
POST /task/api/admin/blacklist/:sessionId   - Blacklist a session
POST /task/api/admin/unblacklist/:sessionId - Remove from blacklist
POST /task/api/admin/reset-throttle         - Reset throttle state
GET  /task/api/admin/incidents/:sessionId   - View incidents
```

**Code Location:** `workers/task-api/src/index.ts:825-919`

---

## Throttling System

### Purpose

Rate limiting per sessionId to prevent:

- API abuse
- Accidental infinite loops in client code
- Resource exhaustion
- DoS attacks

### Rate Limits

**Configuration:** `workers/task-api/src/throttle.ts:38-51`

```typescript
{
    admin: {
        windowMs: 60000,      // 1 minute
        maxRequests: 300      // 5 req/sec average
    },
    friend: {
        windowMs: 60000,      // 1 minute
        maxRequests: 120      // 2 req/sec average
    },
    public: {
        windowMs: 60000,      // 1 minute
        maxRequests: 60       // 1 req/sec average
    }
}
```

**Rationale:**

- Admin users need higher limits for development/debugging
- Friend users get moderate limits for normal usage
- Public users get lowest limits (shouldn't hit API much anyway)

### Throttle State

**KV Key:** `throttle:{sessionId}`

**Structure:**

```json
{
  "count": 45,
  "windowStart": 1699285234567,
  "violations": 2,
  "lastViolation": 1699285200000
}
```

**Fields:**

- `count` - Requests in current window
- `windowStart` - Timestamp when window started (ms)
- `violations` - Total violation count
- `lastViolation` - Timestamp of most recent violation

### Throttle Flow

```
Request → Check blacklist → Blacklisted? → 429 Too Many Requests
             ↓ Not blacklisted
          Check throttle state
             ↓
          Within limit? → Process request
             ↓ Exceeded limit
          Record violation
             ↓
          Violations >= 3? → Auto-blacklist
             ↓
          Return 429 Too Many Requests
```

**Middleware Location:** `workers/task-api/src/index.ts:167-199`

### Auto-Blacklisting

**Trigger:** 3 violations in a row

**Criteria:**

```typescript
if (throttleState.violations >= THROTTLE_THRESHOLDS.BLACKLIST_VIOLATION_COUNT) {
  await blacklistSession(kv, sessionId);
  // Session is now permanently blacklisted until admin unblacklists
}
```

**Thresholds:** `workers/task-api/src/throttle.ts:56-68`

### Blacklist Management

**KV Key:** `blacklist:{sessionId}`

**Structure:**

```json
{
  "blacklistedAt": "2025-11-06T10:30:00Z",
  "reason": "Excessive rate limit violations",
  "violations": 5
}
```

**Manual Management:**

```bash
# Blacklist a session (admin only)
POST /task/api/admin/blacklist/:sessionId

# Unblacklist a session (admin only)
POST /task/api/admin/unblacklist/:sessionId
```

---

## Incident Tracking

### Purpose

Log security-related events for monitoring and analysis:

- Throttle violations
- Blacklist events
- Suspicious patterns
- Authentication failures

### Incident Structure

**KV Key:** `incidents:{sessionId}`

**Structure:**

```json
{
  "incidents": [
    {
      "timestamp": "2025-11-06T10:30:00Z",
      "type": "throttle_violation",
      "sessionId": "session-abc123",
      "authKey": "655b37cf...",
      "userType": "friend",
      "details": {
        "requestCount": 150,
        "limit": 120,
        "windowMs": 60000
      }
    },
    {
      "timestamp": "2025-11-06T10:35:00Z",
      "type": "blacklist",
      "sessionId": "session-abc123",
      "details": {
        "reason": "Auto-blacklisted after 3 violations"
      }
    }
  ]
}
```

### Incident Types

| Type                 | Trigger                  | Details Captured             |
| -------------------- | ------------------------ | ---------------------------- |
| `throttle_violation` | Rate limit exceeded      | Request count, limit, window |
| `blacklist`          | Auto-blacklist or manual | Reason, violation count      |
| `suspicious_pattern` | Manual flag              | Description, evidence        |

### Viewing Incidents

**Admin Endpoint:**

```bash
GET /task/api/admin/incidents/:sessionId
```

**Response:**

```json
{
  "sessionId": "session-abc123",
  "incidents": [
    /* array of incidents */
  ],
  "totalIncidents": 5,
  "blacklisted": true
}
```

**Code Location:** `workers/task-api/src/throttle.ts:145-178`

---

## Admin Tools

### Throttle Management

#### View Throttle State

```bash
GET /task/api/admin/throttle/:sessionId

# Response:
{
  "sessionId": "session-abc123",
  "throttle": {
    "count": 45,
    "windowStart": 1699285234567,
    "violations": 2
  },
  "blacklisted": false,
  "incidents": [ /* recent incidents */ ]
}
```

#### Reset Throttle State

```bash
POST /task/api/admin/reset-throttle
Body: { "sessionId": "session-abc123" }

# Response:
{ "success": true, "message": "Throttle state reset for session-abc123..." }
```

### Blacklist Management

#### Blacklist Session

```bash
POST /task/api/admin/blacklist/:sessionId
Body: { "reason": "Abusive behavior" }

# Response:
{ "success": true, "message": "Session blacklisted successfully" }
```

#### Unblacklist Session

```bash
POST /task/api/admin/unblacklist/:sessionId

# Response:
{ "success": true, "message": "Session unblacklisted successfully" }
```

### Incident Review

#### View All Incidents for Session

```bash
GET /task/api/admin/incidents/:sessionId

# Response:
{
  "sessionId": "session-abc123",
  "incidents": [
    { "timestamp": "...", "type": "throttle_violation", "details": {...} },
    { "timestamp": "...", "type": "blacklist", "details": {...} }
  ],
  "totalIncidents": 2,
  "blacklisted": true
}
```

---

## Security Best Practices

### Key Management

**DO:**

- ✅ Generate keys with cryptographic random source
- ✅ Use UUIDs or 16+ character random strings
- ✅ Store keys as Worker secrets (never in code)
- ✅ Rotate keys periodically (every 6-12 months)
- ✅ Use different keys for different users

**DON'T:**

- ❌ Commit keys to git
- ❌ Log keys in plain text
- ❌ Share keys via insecure channels
- ❌ Use predictable keys (sequential, simple words)
- ❌ Reuse keys across environments

### Session Management

**DO:**

- ✅ Generate unique sessionIds per device
- ✅ Validate session-info exists before operations
- ✅ Clean up abandoned sessions periodically
- ✅ Track session creation timestamps

**DON'T:**

- ❌ Allow sessions without session-info
- ❌ Reuse sessionIds across users
- ❌ Store sensitive data in sessionId

### API Security

**DO:**

- ✅ Validate all input parameters
- ✅ Use rate limiting for all endpoints
- ✅ Log suspicious activity
- ✅ Return generic error messages (don't expose internals)
- ✅ Use CORS to restrict origins

**DON'T:**

- ❌ Trust client input without validation
- ❌ Expose internal error details
- ❌ Allow unlimited requests
- ❌ Skip authentication checks

### Workers KV Security

**DO:**

- ✅ Namespace data by sessionId (prevent cross-user access)
- ✅ Validate KV key formats
- ✅ Handle KV errors gracefully
- ✅ Use consistent key naming conventions

**DON'T:**

- ❌ Store unencrypted sensitive data
- ❌ Allow arbitrary KV key access
- ❌ Assume KV writes always succeed
- ❌ Forget to handle eventual consistency

---

## Threat Scenarios

### Scenario 1: Brute Force Key Guessing

**Threat:** Attacker tries many keys to find valid one

**Mitigation:**

- Rate limiting prevents rapid guessing
- UUIDs have 2^122 possibilities (computationally infeasible)
- Incident tracking logs failed attempts
- Auto-blacklist after repeated violations

**Current Protection:** ✅ Adequate

### Scenario 2: API Abuse (Infinite Loop)

**Threat:** Client code has bug causing infinite API requests

**Mitigation:**

- Per-sessionId throttling (300/min for admin, 120/min for friend)
- Auto-blacklist after 3 violations
- Incident logging for debugging
- Admin can review and unblacklist legitimate mistakes

**Current Protection:** ✅ Excellent

### Scenario 3: Data Exfiltration

**Threat:** Attacker with valid key tries to access other users' data

**Mitigation:**

- Data isolated by sessionId
- No cross-session queries supported
- KV keys include sessionId (e.g., `prefs:{sessionId}`)
- Listing operations restricted

**Current Protection:** ✅ Excellent

### Scenario 4: Session Hijacking

**Threat:** Attacker steals sessionId and impersonates user

**Mitigation:**

- SessionId not sufficient alone (need authKey)
- Session-info validates authKey matches
- Throttling limits damage per session
- No sensitive data stored in sessionId itself

**Current Protection:** ✅ Good

**Enhancement:** Could add session expiration/refresh tokens

### Scenario 5: Distributed DoS

**Threat:** Many workers/clients attack simultaneously

**Mitigation:**

- Cloudflare edge protection (DDoS mitigation)
- Per-session throttling (not IP-based)
- Free tier limits (1000 writes/day) provide natural cap
- Blacklist system stops sustained attacks

**Current Protection:** ✅ Good

**Limitation:** Throttling is per-worker instance (not distributed)

### Scenario 6: Malicious Admin

**Threat:** Admin key compromised, used maliciously

**Impact:**

- Can access admin endpoints
- Can modify own data
- Can view throttle/incident logs
- **CANNOT** access other users' data (isolated by sessionId)

**Mitigation:**

- Rotate admin keys if compromised
- Monitor Analytics Engine for suspicious admin activity
- Incident logs provide audit trail

**Current Protection:** ✅ Adequate

**Enhancement:** Could add admin action audit log

---

## Monitoring & Alerts

### Analytics Engine

**Query Examples:**

```sql
-- Top throttle violations by sessionId (last 24h)
SELECT
  sessionId,
  COUNT(*) as violations
FROM ANALYTICS_ENGINE
WHERE timestamp > NOW() - INTERVAL '24 hours'
  AND responseStatus = 429
GROUP BY sessionId
ORDER BY violations DESC
LIMIT 10;

-- Suspicious burst activity
SELECT
  sessionId,
  COUNT(*) as requests,
  MIN(timestamp) as first,
  MAX(timestamp) as last
FROM ANALYTICS_ENGINE
WHERE timestamp > NOW() - INTERVAL '1 hour'
GROUP BY sessionId
HAVING COUNT(*) > 1000  -- More than 1000 req/hr
ORDER BY requests DESC;

-- Failed authentication attempts
SELECT
  ip,
  COUNT(*) as attempts
FROM ANALYTICS_ENGINE
WHERE responseStatus = 403
  AND timestamp > NOW() - INTERVAL '1 hour'
GROUP BY ip
HAVING COUNT(*) > 10;
```

### Recommended Alerts

**Critical:**

- 🔴 More than 10 blacklist events per hour
- 🔴 More than 1000 throttle violations per hour
- 🔴 Single session > 10K requests per hour

**Warning:**

- 🟡 Blacklist count > 5 per day
- 🟡 Throttle violations > 100 per hour
- 🟡 Failed auth attempts > 50 per hour

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [SESSION_ARCHITECTURE.md](./SESSION_ARCHITECTURE.md) - Session management details
- [TESTING.md](./TESTING.md) - Security test coverage

---

## Incident Response

### Suspected Abuse

1. **Identify:** Check Analytics Engine for suspicious patterns
2. **Investigate:** Review incidents for affected sessionId
3. **Mitigate:** Blacklist session if confirmed abuse
4. **Monitor:** Watch for continued attempts from different sessions
5. **Document:** Record in incident tracking system

### Compromised Key

1. **Rotate:** Generate new key immediately
2. **Update:** Set new key in Worker secrets
3. **Notify:** Inform affected user(s)
4. **Review:** Check Analytics Engine for unauthorized access
5. **Audit:** Review all data modifications during compromise window

### Worker Failure

1. **Check:** Cloudflare Workers status page
2. **Verify:** Test admin endpoints with valid key
3. **Review:** Worker logs via `wrangler tail`
4. **Escalate:** Contact Cloudflare support if infrastructure issue
5. **Fallback:** Edge-router will fall back to GitHub Pages (read-only mode)

---

**Document Version:** 1.0
**Last Updated:** November 6, 2025
**Maintained By:** Engineering Team
**Change Log:**

- 2025-11-06: Initial creation documenting authentication, throttling, and security model
