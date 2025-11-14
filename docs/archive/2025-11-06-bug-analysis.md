# Bug Fixes Required - Session & Preference Management

**Date:** 2025-11-06
**Status:** Action Required
**Priority:** HIGH

---

## Cleanup Completed ✅

Successfully deleted 8 invalid KV entries:

- 2 orphaned boards entries
- 1 orphaned prefs entry
- 2 entries with invalid authKey "hi"
- 3 invalid session-map entries

---

## Bug #1: Missing Legacy Preference Fallback (PRIMARY ISSUE)

### Location

[workers/task-api/src/session.ts:262-272](workers/task-api/src/session.ts#L262-L272)

### Description

The handshake fallback logic does NOT check for legacy `prefs:{authKey}` entries. This causes users with existing preferences stored in the old format to get default preferences when creating new sessions.

### Current Code

```typescript
// Fallback: Try authKey mapping
if (!preferences) {
  const mapping = await getSessionMapping(kv, authKey);
  if (mapping && mapping.lastSessionId) {
    preferences = await getPreferencesBySessionId(kv, mapping.lastSessionId);
    // ❌ BUG: Only checks prefs:{lastSessionId}
    // ❌ MISSING: Check prefs:{authKey} for legacy data
    if (preferences) {
      migratedFrom = mapping.lastSessionId;
      isNewSession = false;
    }
  }
}
```

### Fix Required

```typescript
// Fallback: Try authKey mapping
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
    const legacyPrefs = (await kv.get(
      legacyKey,
      'json'
    )) as UserPreferences | null;
    if (legacyPrefs) {
      preferences = legacyPrefs;
      migratedFrom = authKey;
      isNewSession = false;
      console.log(`[Migration] Found legacy prefs for authKey: ${authKey}`);

      // Optionally: Mark legacy prefs for cleanup later
      // await kv.put(`${legacyKey}:migrated`, new Date().toISOString());
    }
  }
}
```

### Impact

- **Users Affected:** N7RZK2YW9X1TQ8HP, 4355, a21743d9-..., others
- **Severity:** HIGH - Users losing saved preferences
- **Frequency:** Occurs every time a new session is created after localStorage is cleared

---

## Bug #2: Mystery Sessions - Missing Session Info

### Location

Multiple sessions found in session-map but missing session-info entries

### Description

Some sessions appear in the `session-map` but have no corresponding `session-info` or `prefs` entries. This creates "mystery sessions" that leave no trace of when/why they were created.

**Example:** Session `fe8c8eec3309bde198ab394d120f7a27` for user N7RZK2YW9X1TQ8HP

### Current Flow

1. Handshake called with `newSessionId`
2. `saveSessionInfo()` saves session-info
3. `updateSessionMapping()` adds sessionId to mapping
4. **BUT**: If `saveSessionInfo()` fails silently or is not called, we get mystery sessions

### Fix Required

**Option A: Add Transaction-like Behavior**

```typescript
export async function handleSessionHandshake(
  kv: KVNamespace,
  authKey: string,
  userType: 'admin' | 'friend' | 'public',
  request: HandshakeRequest
): Promise<HandshakeResponse> {
  // ... existing preference migration logic ...

  try {
    // Save preferences to newSessionId
    await savePreferencesBySessionId(kv, newSessionId, preferences);

    // Create session info for newSessionId
    const now = new Date().toISOString();
    const sessionInfo: SessionInfo = {
      sessionId: newSessionId,
      authKey,
      userType,
      createdAt: now,
      lastAccessedAt: now,
    };
    await saveSessionInfo(kv, sessionInfo);

    // Add new sessionId to mapping ONLY if session-info was saved
    await updateSessionMapping(kv, authKey, newSessionId);

    // Delete old session data if migrating
    if (sessionIdToDelete && sessionIdToDelete !== newSessionId) {
      await kv.delete(preferencesKey(sessionIdToDelete));
      await kv.delete(sessionInfoKey(sessionIdToDelete));
      await removeSessionFromMapping(kv, authKey, sessionIdToDelete);
    }
  } catch (error) {
    console.error('[Handshake] Failed to save session data:', error);
    throw error;
  }

  return {
    sessionId: newSessionId,
    preferences,
    isNewSession,
    migratedFrom,
  };
}
```

**Option B: Add Session Info Validation**

```typescript
// In updateSessionMapping(), verify session-info exists first
export async function updateSessionMapping(
  kv: KVNamespace,
  authKey: string,
  sessionId: string
): Promise<void> {
  // Verify session-info exists before adding to mapping
  const sessionInfo = await getSessionInfo(kv, sessionId);
  if (!sessionInfo) {
    console.warn(
      `[SessionMapping] Cannot add session ${sessionId} - no session-info exists`
    );
    return;
  }

  const key = sessionMappingKey(authKey);
  const existing = await getSessionMapping(kv, authKey);

  // ... rest of existing logic ...
}
```

### Impact

- **Severity:** MEDIUM - Creates orphaned session references
- **Side Effect:** Users may experience preference loss during these mystery session windows

---

## Bug #3: GET /preferences Doesn't Check Legacy Format

### Location

[workers/task-api/src/index.ts:722-759](workers/task-api/src/index.ts#L722-L759)

### Description

The GET `/task/api/preferences` endpoint only checks `prefs:{sessionId}` and returns defaults if not found. It should also fallback to `prefs:{authKey}` for legacy data.

### Current Code

```typescript
app.get('/task/api/preferences', async (c) => {
  const { auth } = getContext(c);
  const sessionId = getSessionIdFromRequest(c, auth);

  try {
    const prefs = await getPreferencesBySessionId(c.env.TASKS_KV, sessionId);

    if (prefs) {
      return c.json(prefs);
    }

    // ❌ Returns defaults immediately - doesn't check legacy format
    return c.json(DEFAULT_PREFERENCES);
  } catch (error: any) {
    return c.json(DEFAULT_PREFERENCES);
  }
});
```

### Fix Required

```typescript
app.get('/task/api/preferences', async (c) => {
  const { auth } = getContext(c);
  const sessionId = getSessionIdFromRequest(c, auth);

  try {
    // Try session-based prefs first
    let prefs = await getPreferencesBySessionId(c.env.TASKS_KV, sessionId);

    if (prefs) {
      return c.json(prefs);
    }

    // 🆕 NEW: Fallback to legacy authKey-based prefs
    const authKey = auth.key || sessionId;
    if (authKey && authKey !== sessionId && authKey !== 'public') {
      const legacyKey = `prefs:${authKey}`;
      prefs = (await c.env.TASKS_KV.get(
        legacyKey,
        'json'
      )) as UserPreferences | null;

      if (prefs) {
        console.log(`[Preferences] Found legacy prefs for authKey: ${authKey}`);
        // Optionally: Migrate to sessionId immediately
        // await savePreferencesBySessionId(c.env.TASKS_KV, sessionId, prefs);
        return c.json(prefs);
      }
    }

    // Return defaults only if no legacy prefs found
    return c.json(DEFAULT_PREFERENCES);
  } catch (error: any) {
    logError('GET', '/task/api/preferences', error);
    return c.json(DEFAULT_PREFERENCES);
  }
});
```

### Impact

- **Severity:** MEDIUM - Provides additional safety net for preference retrieval
- **Benefit:** Even if handshake fails, users can still retrieve their legacy prefs

---

## Bug #4: Session ID Fallback to 'public' for Authenticated Users

### Location

[workers/task-api/src/request-utils.ts:72](workers/task-api/src/request-utils.ts#L72)

### Description

If `X-Session-Id` header is missing and `auth.sessionId` is undefined, the function defaults to `'public'`. This could cause authenticated users to share preferences with public users.

### Current Code

```typescript
export function getSessionIdFromRequest(
  c: Context,
  auth: { sessionId?: string }
): string {
  return c.req.header('X-Session-Id') || auth.sessionId || 'public';
}
```

### Fix Required

```typescript
export function getSessionIdFromRequest(
  c: Context,
  auth: { sessionId?: string; userType?: string; key?: string }
): string {
  const sessionId = c.req.header('X-Session-Id') || auth.sessionId;

  if (!sessionId) {
    // Log warning for authenticated users missing sessionId
    if (auth.userType && auth.userType !== 'public') {
      console.warn('[Session] Authenticated user missing sessionId', {
        userType: auth.userType,
        authKey: auth.key ? maskKey(auth.key) : 'unknown',
        headers: c.req.header('X-Session-Id') ? 'present' : 'missing',
      });
    }

    // For authenticated users, use authKey as session fallback
    if (auth.key && auth.userType !== 'public') {
      console.log(
        `[Session] Using authKey as sessionId fallback for ${auth.userType}`
      );
      return auth.key;
    }

    return 'public';
  }

  return sessionId;
}
```

### Impact

- **Severity:** LOW-MEDIUM - Edge case but could cause data leakage
- **Frequency:** Rare - Only when client forgets to send X-Session-Id

---

## Bug #5: No Cleanup of Orphaned Session Mappings

### Location

[workers/task-api/src/session.ts](workers/task-api/src/session.ts) - No cleanup functionality exists

### Description

Session mappings can contain references to sessions that no longer have `session-info` or `prefs` entries. This creates orphaned references that bloat the mappings.

### Example from Production

```json
{
  "authKey": "N7RZK2YW9X1TQ8HP",
  "sessionIds": [
    "4cb5458d...", // ✅ Has prefs
    "fe8c8eec...", // ❌ Mystery session - no prefs, no session-info
    "889d24de...", // ✅ Has prefs
    "b0e26c73..." // ✅ Has prefs
  ]
}
```

### Fix Required

**Add cleanup function:**

```typescript
/**
 * Clean up orphaned session references from mapping
 * Removes sessionIds that have no session-info
 */
export async function cleanupSessionMapping(
  kv: KVNamespace,
  authKey: string
): Promise<number> {
  const mapping = await getSessionMapping(kv, authKey);
  if (!mapping) return 0;

  const validSessionIds: string[] = [];
  let removedCount = 0;

  // Check each sessionId for valid session-info
  for (const sessionId of mapping.sessionIds) {
    const sessionInfo = await getSessionInfo(kv, sessionId);
    if (sessionInfo) {
      validSessionIds.push(sessionId);
    } else {
      removedCount++;
      console.log(`[Cleanup] Removing orphaned session: ${sessionId}`);
    }
  }

  // Update mapping with only valid sessions
  if (removedCount > 0) {
    mapping.sessionIds = validSessionIds;

    // Update lastSessionId if it was removed
    if (
      !validSessionIds.includes(mapping.lastSessionId) &&
      validSessionIds.length > 0
    ) {
      mapping.lastSessionId = validSessionIds[validSessionIds.length - 1];
    } else if (validSessionIds.length === 0) {
      mapping.lastSessionId = '';
    }

    mapping.updatedAt = new Date().toISOString();
    await kv.put(sessionMappingKey(authKey), JSON.stringify(mapping));
  }

  return removedCount;
}
```

**Call periodically:**

```typescript
// In handleSessionHandshake, optionally clean up old sessions
export async function handleSessionHandshake(...) {
  // ... existing logic ...

  // Optionally: Clean up orphaned sessions (run periodically, not every handshake)
  if (Math.random() < 0.1) { // 10% of handshakes
    cleanupSessionMapping(kv, authKey).catch(console.error);
  }

  return { ... };
}
```

### Impact

- **Severity:** LOW - Maintenance issue, not breaking
- **Benefit:** Keeps session mappings clean and accurate

---

## Implementation Priority

1. **Bug #1 - Legacy Preference Fallback** (CRITICAL - DO FIRST)
   - File: [workers/task-api/src/session.ts](workers/task-api/src/session.ts#L262-L272)
   - Lines: Add after line 271
   - Test: Create test case for legacy preference migration

2. **Bug #2 - Mystery Session Prevention** (HIGH)
   - File: [workers/task-api/src/session.ts](workers/task-api/src/session.ts#L156-L185)
   - Lines: Add validation in `updateSessionMapping()`
   - Test: Verify session-info exists before adding to mapping

3. **Bug #3 - GET /preferences Fallback** (MEDIUM)
   - File: [workers/task-api/src/index.ts](workers/task-api/src/index.ts#L722-L759)
   - Lines: Add legacy fallback before returning defaults
   - Test: Verify legacy prefs are returned when session prefs don't exist

4. **Bug #4 - Session ID Fallback Logic** (MEDIUM)
   - File: [workers/task-api/src/request-utils.ts](workers/task-api/src/request-utils.ts#L68-L73)
   - Lines: Add authKey fallback for authenticated users
   - Test: Verify authenticated users don't get 'public' sessionId

5. **Bug #5 - Session Mapping Cleanup** (LOW - Future Enhancement)
   - File: [workers/task-api/src/session.ts](workers/task-api/src/session.ts)
   - Lines: Add new function at end of file
   - Test: Verify orphaned sessions are removed from mapping

---

## Test Coverage Needed

### New Test Cases Required

**Test: Legacy Preference Migration**

```typescript
it('should migrate legacy authKey-based preferences', async () => {
  const authKey = 'test-friend-key';
  const adminHeaders = createAuthHeaders(env, authKey);

  // 1. Create legacy prefs entry (prefs:authKey)
  await env.TASKS_KV.put(
    `prefs:${authKey}`,
    JSON.stringify({
      theme: 'strawberry-dark',
      experimentalThemes: true,
      version: 1,
    })
  );

  // 2. Call handshake without oldSessionId
  const newSessionId = 'new-session-123';
  const handshakeRes = await app.request(
    '/task/api/session/handshake',
    {
      method: 'POST',
      headers: { ...adminHeaders, 'X-Session-Id': newSessionId },
      body: JSON.stringify({ newSessionId, oldSessionId: null }),
    },
    env
  );

  expect(handshakeRes.status).toBe(200);
  const handshakeData = await handshakeRes.json();

  // 3. Verify preferences were migrated
  expect(handshakeData.preferences.theme).toBe('strawberry-dark');
  expect(handshakeData.preferences.experimentalThemes).toBe(true);
  expect(handshakeData.migratedFrom).toBe(authKey);

  // 4. Verify new session has prefs
  const newPrefs = await env.TASKS_KV.get(`prefs:${newSessionId}`, 'json');
  expect(newPrefs).toBeTruthy();
  expect(newPrefs.theme).toBe('strawberry-dark');
});
```

**Test: Mystery Session Prevention**

```typescript
it('should not add session to mapping if session-info missing', async () => {
  // This test verifies Bug #2 fix
  const authKey = 'test-key';
  const sessionId = 'mystery-session-456';

  // Attempt to update mapping without creating session-info first
  await updateSessionMapping(env.TASKS_KV, authKey, sessionId);

  // Verify session was NOT added to mapping
  const mapping = await getSessionMapping(env.TASKS_KV, authKey);
  expect(mapping).toBeNull();
});
```

**Test: GET /preferences Legacy Fallback**

```typescript
it('should return legacy prefs when session prefs do not exist', async () => {
  const authKey = 'test-legacy-user';
  const sessionId = 'new-session-789';
  const headers = {
    ...createAuthHeaders(env, authKey),
    'X-Session-Id': sessionId,
  };

  // Create legacy prefs only
  await env.TASKS_KV.put(
    `prefs:${authKey}`,
    JSON.stringify({
      theme: 'nature-dark',
      version: 1,
    })
  );

  // Request prefs with sessionId (no session prefs exist)
  const res = await app.request(
    '/task/api/preferences',
    {
      headers,
    },
    env
  );

  expect(res.status).toBe(200);
  const prefs = await res.json();
  expect(prefs.theme).toBe('nature-dark');
});
```

---

## Deployment Plan

1. **Create feature branch:** `fix/session-preference-migration`
2. **Implement Bug #1 fix** (legacy preference fallback)
3. **Add test coverage** for legacy preference migration
4. **Run full test suite:** `npm test`
5. **Deploy to staging** and test with real KV data
6. **Verify fix** for affected users (N7RZK2YW9X1TQ8HP, 4355, etc.)
7. **Implement Bug #2-4** in same PR
8. **Deploy to production**
9. **Monitor** for any new issues
10. **Bug #5** (cleanup) can be separate PR

---

## Success Metrics

- ✅ No more "mystery sessions" without session-info
- ✅ Users with legacy prefs successfully migrated on next login
- ✅ Zero preference resets reported
- ✅ All test cases passing
- ✅ Session mappings remain accurate

---

## Rollback Plan

If issues occur:

1. Revert deployment immediately
2. Restore previous session.ts
3. Legacy prefs will remain in place (no data loss)
4. Users will continue to experience preference resets until fix is ready

---

**Next Action:** Implement Bug #1 fix in [session.ts](workers/task-api/src/session.ts)
