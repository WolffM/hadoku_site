# Session & Preference Reset Issue - Root Cause Analysis

**Date:** 2025-11-06
**Status:** CRITICAL BUG CONFIRMED
**Impact:** Users experiencing preference resets

---

## Executive Summary

Users are reporting that their preferences (theme settings, experimental flags, etc.) are getting reset. After thorough investigation of the production KV store and codebase, **I've identified the root cause**: There is a **fundamental mismatch between how preferences are stored (by sessionId) and how they are being retrieved (by authKey in some cases)**.

### The Core Problem

The system has **old preference entries stored by authKey** (legacy format: `prefs:4355`, `prefs:655b37cf-...`) but **new sessions are storing preferences by sessionId** (new format: `prefs:889d24de78e7aa94...`). When users return to the site:

1. Their browser creates a **new sessionId**
2. The handshake tries to migrate preferences from the **old sessionId** (if provided)
3. If no old sessionId is provided, it falls back to checking the **authKey mapping**
4. BUT: The authKey mapping points to a **new sessionId that may not have preferences**
5. **The old authKey-based preference entries are never checked or migrated**

---

## Production Data Evidence

### KV Store Analysis (Exported 2025-11-06)

#### Summary Statistics:

- **Total keys in KV:** 101
- **Preference entries:** 18
- **Session-info entries:** 10
- **Session-map entries:** 7
- **Orphaned preference entries:** 8 (prefs stored by authKey, not sessionId)

#### Critical Findings:

**1. AuthKey-based Orphaned Preferences (Legacy Format)**
These preference entries exist but are NOT linked to any active sessionId:

- `prefs:4355` - userId-based (old format)
- `prefs:655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b` - authKey-based (old format)
- `prefs:N7RZK2YW9X1TQ8HP` - authKey-based (old format)
- `prefs:a21743d9-b0f1-4c75-8e01-ba2dc37feacd` - authKey-based (old format)
- `prefs:X3vP9aLzR2tQ8nBw` - authKey-based (old format)
- `prefs:admin` - authKey-based (old format)
- `prefs:public` - authKey-based (old format)
- `prefs:27bf2b3adbc8b8f2c20f09d46138962a` - sessionId-based BUT orphaned

**2. Session Mapping Issues**

**AuthKey: `4355`**

- Mapped sessions: 1
- Last sessionId: `d84ca2a7af9d45a3...`
- Sessions with prefs: **0/1** ❌
- **Issue:** Latest session has NO prefs, but authKey HAS old-style prefs entry `prefs:4355`

**AuthKey: `655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b`**

- Mapped sessions: 11
- Last sessionId: `bf9018dedba04a29...`
- Sessions with prefs: **4/11**
- Last session has prefs: ✅
- **Issue:** Only 4 out of 11 sessions have preferences. The authKey also has an old-style entry `prefs:655b37cf-...`

**AuthKey: `a21743d9-b0f1-4c75-8e01-ba2dc37feacd` (Admin)**

- Mapped sessions: 13
- Last sessionId: `41173e5283c84ec6...`
- Sessions with prefs: **3/13** ❌
- Last session has prefs: **NO** ❌
- **Issue:** Latest session missing prefs! But authKey HAS old-style prefs entry

**AuthKey: `N7RZK2YW9X1TQ8HP`**

- Mapped sessions: 4
- Last sessionId: `b0e26c73df7c909c...`
- Sessions with prefs: 3/4
- Last session has prefs: ✅

---

## Code Flow Analysis

### 1. Session Handshake Flow ([session.ts:237-315](workers/task-api/src/session.ts#L237-L315))

When a user initializes their session:

```typescript
async function handleSessionHandshake(kv, authKey, userType, request) {
  const { oldSessionId, newSessionId } = request;

  // Step 1: Try to load from oldSessionId (if provided)
  if (oldSessionId) {
    preferences = await getPreferencesBySessionId(kv, oldSessionId);
    // This looks for: prefs:{oldSessionId}
  }

  // Step 2: Fallback to authKey mapping
  if (!preferences) {
    const mapping = await getSessionMapping(kv, authKey);
    if (mapping && mapping.lastSessionId) {
      preferences = await getPreferencesBySessionId(kv, mapping.lastSessionId);
      // This looks for: prefs:{lastSessionId}
      // ❌ PROBLEM: Does NOT check prefs:{authKey}
    }
  }

  // Step 3: Use defaults if nothing found
  if (!preferences) {
    preferences = { ...DEFAULT_PREFERENCES };
  }

  // Step 4: Save to newSessionId
  await savePreferencesBySessionId(kv, newSessionId, preferences);
}
```

**The Bug:** When the handshake fallback checks `mapping.lastSessionId`, it looks for `prefs:{lastSessionId}` but **never checks** `prefs:{authKey}` where the old preferences might be stored!

### 2. Session ID Retrieval ([request-utils.ts:68-73](workers/task-api/src/request-utils.ts#L68-L73))

```typescript
export function getSessionIdFromRequest(c, auth) {
  return c.req.header('X-Session-Id') || auth.sessionId || 'public';
}
```

**Potential Issue:** If `X-Session-Id` header is missing and `auth.sessionId` is undefined, this defaults to `'public'`. This could cause multiple users to share the same preference entry.

### 3. Client-Side Session Management ([public/mf/task/index.js](public/mf/task/index.js))

**Session Generation:**

```javascript
const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
```

**Storage:**

```javascript
function storeSessionId(sessionId) {
  localStorage.setItem('currentSessionId', sessionId);
}

function getStoredSessionId() {
  return localStorage.getItem('currentSessionId');
}
```

**Handshake Call:**

```javascript
async function performHandshake(newSessionId, userType) {
  const oldSessionId = getStoredSessionId();

  // For public users, skip handshake
  if (userType === "public") {
    if (oldSessionId) return null;
    const publicSessionId = `public-${Date.now()}-${...}`;
    storeSessionId(publicSessionId);
    return null;
  }

  // For authenticated users, call handshake API
  const response = await fetch("/task/api/session/handshake", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Type": userType,
      "X-Session-Id": newSessionId
    },
    body: JSON.stringify({
      oldSessionId: oldSessionId,
      newSessionId: newSessionId
    })
  });

  const data = await response.json();
  storeSessionId(newSessionId);
  return data.preferences;
}
```

**Preference Loading:**

```javascript
async getPreferences() {
  if (userType !== "public") {
    try {
      const response = await fetch("/task/api/preferences", {
        headers: {
          "X-User-Type": userType,
          "X-Session-Id": sessionId  // Uses current sessionId
        }
      });
      if (response.ok) {
        const prefs = await response.json();
        return prefs;
      }
    } catch (error) {
      console.warn("Failed to fetch preferences from server, using localStorage");
    }
  }
  // Fallback to localStorage
  return await localStorage.getPreferences();
}
```

### 4. Preference API Endpoints ([index.ts:722-801](workers/task-api/src/index.ts#L722-L801))

**GET /task/api/preferences**

```typescript
app.get('/task/api/preferences', async (c) => {
  const { auth } = getContext(c);
  const sessionId = getSessionIdFromRequest(c, auth);
  // Gets sessionId from X-Session-Id header or auth.sessionId

  const prefs = await getPreferencesBySessionId(c.env.TASKS_KV, sessionId);
  // Looks up: prefs:{sessionId}
  // ❌ PROBLEM: Does NOT fallback to prefs:{authKey}

  if (prefs) {
    return c.json(prefs);
  }

  // Return defaults if not found
  return c.json(DEFAULT_PREFERENCES);
});
```

**PUT /task/api/preferences**

```typescript
app.put('/task/api/preferences', async (c) => {
  const { auth } = getContext(c);
  const sessionId = getSessionIdFromRequest(c, auth);
  const body = await c.req.json();

  const existing =
    (await getPreferencesBySessionId(c.env.TASKS_KV, sessionId)) || {};
  const updated = {
    ...existing,
    ...body,
    lastUpdated: new Date().toISOString(),
  };

  await savePreferencesBySessionId(c.env.TASKS_KV, sessionId, updated);
  // Saves to: prefs:{sessionId}

  return c.json({ ok: true, preferences: updated });
});
```

---

## Root Causes Identified

### PRIMARY ISSUE: Migration Gap for AuthKey-based Preferences

The handshake logic at [session.ts:262-272](workers/task-api/src/session.ts#L262-L272) has a **critical gap**:

```typescript
// Fallback: Try authKey mapping
if (!preferences) {
  const mapping = await getSessionMapping(kv, authKey);
  if (mapping && mapping.lastSessionId) {
    preferences = await getPreferencesBySessionId(kv, mapping.lastSessionId);
    // ❌ BUG: Only checks prefs:{lastSessionId}
    // ✅ SHOULD ALSO: Check prefs:{authKey} for legacy data
  }
}
```

**What Should Happen:**

1. Check `prefs:{oldSessionId}` (if provided)
2. Check `prefs:{mapping.lastSessionId}` (if mapping exists)
3. **Check `prefs:{authKey}` for legacy preferences** ⬅️ MISSING!
4. Fall back to defaults

### SECONDARY ISSUE: Session ID Fallback to 'public'

At [request-utils.ts:72](workers/task-api/src/request-utils.ts#L72):

```typescript
return c.req.header('X-Session-Id') || auth.sessionId || 'public';
```

If both `X-Session-Id` header and `auth.sessionId` are missing, this defaults to `'public'`, potentially causing:

- Multiple unauthenticated requests to share preferences
- Authenticated users without proper session headers to get public preferences

### TERTIARY ISSUE: No Automatic Cleanup of Old Sessions

From [session.ts:11](workers/task-api/src/session.ts#L11):

> "Never delete old sessionId preferences"

While this is intentional for multi-device support, it creates **orphaned preference entries** that accumulate over time but are never migrated to new sessions.

---

## Evidence of the Bug in Production

### Case Study: AuthKey `4355`

**Current State:**

- Session mapping: `session-map:4355` → `[d84ca2a7af9d45a3...]`
- Session info: `session-info:d84ca2a7af9d45a3...` exists
- Preferences: `prefs:4355` exists (old format) ✅
- Preferences: `prefs:d84ca2a7af9d45a3...` does NOT exist ❌

**What Happens:**

1. User visits site with authKey `4355`
2. Client generates new sessionId (e.g., `d84ca2a7af9d45a3...`)
3. Handshake called with `oldSessionId: null`, `newSessionId: d84ca2a7af9d45a3...`
4. Handshake checks:
   - `prefs:{null}` → Not found (no oldSessionId provided)
   - `prefs:d84ca2a7af9d45a3...` → Not found (new session, doesn't exist yet)
   - **Missing:** Should check `prefs:4355` but doesn't!
5. Returns **default preferences** ❌
6. User sees default theme instead of their saved theme

### Case Study: AuthKey `a21743d9-b0f1-4c75-8e01-ba2dc37feacd` (Admin)

**Current State:**

- 13 sessions mapped
- Last sessionId: `41173e5283c84ec6...`
- Only 3 out of 13 sessions have preferences
- `prefs:a21743d9-...` exists (old format) with custom settings:
  ```json
  {
    "version": 1,
    "updatedAt": "2025-10-24T19:45:02.240Z",
    "alwaysVerticalLayout": false,
    "experimentalThemes": true
  }
  ```
- `prefs:41173e5283c84ec6...` does NOT exist

**Result:** Admin user's preferences reset to defaults on new session creation.

---

## Timeline Analysis

Based on KV data timestamps:

- **Oct 18-24, 2025**: Old authKey-based preference system in use
- **Oct 25-29, 2025**: Migration to sessionId-based system
- **Oct 29+**: New sessions created but preferences not properly migrated

The gap between last authKey-based pref update and first sessionId-based session creation is when users started experiencing resets.

---

## Test Coverage Gap

The preference tests at [preferences.test.ts](workers/task-api/src/preferences.test.ts) do NOT test the migration scenario:

```typescript
it('should save and retrieve preferences', async () => {
  // Gets preferences with adminHeaders (includes X-User-Key)
  const initialRes = await getPreferences(app, env, adminHeaders);
  // ...
});
```

**Missing Test Cases:**

1. User has authKey-based preferences, creates new session → should migrate
2. User has old sessionId preferences, creates new session → should migrate
3. User has multiple devices with different sessionIds → should use latest
4. User loses localStorage, returns with same authKey → should recover preferences

---

## Recommendations

### 1. **IMMEDIATE FIX: Add Legacy Preference Migration**

Update [session.ts:262-272](workers/task-api/src/session.ts#L262-L272):

```typescript
// If oldSessionId not provided or not found, try authKey mapping as fallback
if (!preferences) {
  const mapping = await getSessionMapping(kv, authKey);
  if (mapping && mapping.lastSessionId) {
    preferences = await getPreferencesBySessionId(kv, mapping.lastSessionId);
    if (preferences) {
      migratedFrom = mapping.lastSessionId;
      isNewSession = false;
    }
  }

  // 🆕 NEW: Check for legacy authKey-based preferences
  if (!preferences) {
    const legacyKey = preferencesKey(authKey);
    preferences = (await kv.get(legacyKey, 'json')) as UserPreferences | null;
    if (preferences) {
      migratedFrom = authKey;
      isNewSession = false;
      console.log(`[Migration] Found legacy prefs for authKey: ${authKey}`);
    }
  }
}
```

### 2. **Add Migration Script**

Create a one-time migration to move all authKey-based preferences to sessionId-based:

```python
# scripts/admin/migrate_legacy_prefs.py
# For each prefs:{authKey}:
#   1. Find session-map:{authKey}
#   2. Get lastSessionId
#   3. Copy prefs:{authKey} → prefs:{lastSessionId}
#   4. Keep original for safety (can delete later)
```

### 3. **Improve Session ID Fallback**

Update [request-utils.ts:72](workers/task-api/src/request-utils.ts#L72):

```typescript
export function getSessionIdFromRequest(c, auth) {
  const sessionId = c.req.header('X-Session-Id') || auth.sessionId;

  if (!sessionId) {
    // Log warning for authenticated users missing sessionId
    if (auth.userType !== 'public') {
      console.warn('[Session] Authenticated user missing sessionId', {
        userType: auth.userType,
        authKey: maskKey(auth.key || 'unknown'),
      });
    }
    return 'public';
  }

  return sessionId;
}
```

### 4. **Add Comprehensive Tests**

Add test cases for:

- Legacy authKey-based preference migration
- Multi-device session handling
- Session recovery scenarios
- Preference persistence across session changes

### 5. **Add Admin Monitoring**

Create an endpoint to check for:

- Orphaned preference entries
- Users with sessions but no preferences
- Sessions without recent access (for cleanup)

---

## Affected Users

Based on KV analysis:

- **AuthKey `4355`:** Preferences reset (1 active session, no prefs)
- **AuthKey `a21743d9-...` (Admin):** Preferences reset (13 sessions, 3 have prefs, latest doesn't)
- **AuthKey `655b37cf-...`:** Partial issue (11 sessions, 4 have prefs)
- **AuthKey `Ak: a21743d9... Fk: 655b37cf...`:** Preferences reset (2 sessions, 0 have prefs)

**Estimated Impact:** 4 out of 7 users (57%) experiencing some form of preference reset

---

## Next Steps

1. **Deploy immediate fix** to add legacy preference migration to handshake
2. **Run migration script** to copy authKey-based prefs to current sessionIds
3. **Add test coverage** for migration scenarios
4. **Monitor** for any remaining issues
5. **Document** new session management behavior for future reference
6. **Consider** adding a preference "last accessed" timestamp to aid cleanup

---

## Additional Notes

### Why This Wasn't Caught in Testing

The test suite uses `X-User-Key` and `X-User-Id` headers, which properly authenticate users. However:

1. Tests don't simulate the client-side session lifecycle
2. Tests don't use `X-Session-Id` headers
3. Tests don't cover the migration path from old to new storage format
4. Test data is created fresh each time, so legacy data scenarios aren't tested

### Multi-Device Consideration

The current design intentionally keeps preferences per-sessionId for multi-device support. However, this creates complexity:

- Each device should have its own sessionId
- Preferences should sync across devices
- But device-specific settings (like screen layout) shouldn't sync

**Current behavior:** Each new session gets default preferences unless properly migrated.
**Expected behavior:** New sessions should inherit from last known session or authKey-based prefs.

---

## Conclusion

The root cause is **clear and fixable**: The handshake fallback logic does not check for legacy authKey-based preference entries. This causes users with existing preferences stored under `prefs:{authKey}` to receive default preferences when creating new sessions.

The fix is straightforward: Add a third fallback check to `handleSessionHandshake()` that looks for `prefs:{authKey}` before returning defaults. This will immediately restore preferences for affected users.

**Severity:** HIGH - Users losing personalization settings
**Complexity:** LOW - Single code change + migration script
**Risk:** LOW - Additive change, won't break existing working sessions
