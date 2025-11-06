# Session & Preference Architecture

**Last Updated:** November 6, 2025

## Overview

The Task API uses **sessionId-based storage** with **multi-device support**. This architecture allows users to have different preferences on different devices while maintaining a single authentication credential (authKey).

This document explains the critical design decisions, storage structure, and evolution of the session management system.

---

## Table of Contents

1. [Key Concepts](#key-concepts)
2. [Storage Structure](#storage-structure)
3. [Design Decisions](#design-decisions)
4. [Session Lifecycle](#session-lifecycle)
5. [Migration History](#migration-history)
6. [Bug Fixes & Improvements](#bug-fixes--improvements)
7. [Code References](#code-references)

---

## Key Concepts

### Core Entities

#### SessionId
- **What:** Unique identifier per device/browser session
- **Format:** Generated UUID or hash (e.g., `a3f2b9c1-4d5e-6f7a-8b9c-0d1e2f3a4b5c`)
- **Lifetime:** Persists across browser refreshes, cleared on logout or browser cache clear
- **Scope:** One sessionId per device/browser

#### AuthKey
- **What:** User authentication credential (admin or friend key)
- **Format:** UUID or custom string (e.g., `655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b`)
- **Lifetime:** Permanent (doesn't change)
- **Scope:** One authKey per user, shared across all devices

#### Session Mapping
- **What:** Links authKey to all active sessionIds
- **Purpose:** Track which sessions belong to which user
- **Enables:** Multi-device support, session management

---

## Storage Structure

### KV Key Formats

All data is stored in Cloudflare Workers KV using these key patterns:

#### User Data Keys
```
prefs:{sessionId}          - User preferences for this session
boards:{sessionId}         - Board list for this session
tasks:{sessionId}:{boardId} - Task data for specific board
stats:{sessionId}:{boardId} - Statistics for specific board
```

#### Session Management Keys
```
session-info:{sessionId}    - Session metadata (authKey, userType, timestamps)
session-map:{authKey}       - Maps authKey to list of sessionIds
```

#### Throttling & Security Keys
```
throttle:{sessionId}        - Rate limiting state
incidents:{sessionId}       - Security incident log
blacklist:{sessionId}       - Blacklist status
```

### Storage Examples

#### Example: User with 2 Devices

**User:** authKey = `655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b`
**Device 1 (Desktop):** sessionId = `session-desktop-001`
**Device 2 (Mobile):** sessionId = `session-mobile-002`

**KV Entries:**
```
# Device 1 Data
prefs:session-desktop-001 → { theme: "dark", layout: "horizontal" }
boards:session-desktop-001 → [ { id: "main", name: "main" } ]
session-info:session-desktop-001 → { authKey: "655b37cf...", userType: "admin" }

# Device 2 Data
prefs:session-mobile-002 → { theme: "light", layout: "vertical" }
boards:session-mobile-002 → [ { id: "main", name: "main" } ]
session-info:session-mobile-002 → { authKey: "655b37cf...", userType: "admin" }

# Session Mapping
session-map:655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b → {
  sessionIds: ["session-desktop-001", "session-mobile-002"],
  lastSessionId: "session-mobile-002"
}
```

**Key Observation:** Same user, different preferences per device.

---

## Design Decisions

### Decision 1: Storage by SessionId (Not AuthKey)

#### The Decision
Store all user data (preferences, boards, tasks) keyed by `sessionId` instead of `authKey`.

#### Rationale
**Enables Multi-Device Support:**
- Different devices can have different preferences
- Desktop users want horizontal layout, mobile users want vertical
- Theme preferences differ (dark mode on desktop, light on mobile)
- Screen size affects optimal settings

**Alternative Considered:** Store by authKey (one set of preferences per user)
**Why Rejected:**
- Would force same settings on all devices
- Poor UX for users switching between desktop and mobile
- Can't optimize per-device

#### Trade-offs
**Pros:**
- ✅ Device-specific optimization
- ✅ Better UX for multi-device users
- ✅ Preserves preferences when switching devices

**Cons:**
- ❌ More complex migration logic
- ❌ Requires session mapping to track devices
- ❌ Users expect preferences to "follow them" (but device-specific is better)

---

### Decision 2: Separate Preferences Per Device (No Sync)

#### The Decision
Each sessionId has completely independent preferences. We do NOT sync preferences across devices.

#### Rationale
**Different Devices Have Different Needs:**
- **Screen Size:** Mobile needs compact layout, desktop can spread out
- **Interaction Model:** Touch vs mouse/keyboard affects UI preferences
- **Context:** Mobile used for quick checks, desktop for deep work
- **Performance:** Mobile may prefer reduced animations

**Real Example:**
- Desktop: Dark theme, horizontal layout, all animations enabled
- Mobile: Light theme (better in sunlight), vertical layout, animations reduced for battery

#### Alternative Considered: Sync All Preferences
**Why Rejected:**
- Would override device-specific optimizations
- User changes theme on mobile → unwanted change on desktop
- No way to maintain per-device settings
- Complex conflict resolution needed

#### User Expectations
Users may initially expect preferences to "follow them" across devices, but in practice they appreciate device-specific settings once they understand the benefit.

**Future Enhancement:** Could add optional sync for specific preferences (e.g., completed tasks) while keeping layout/theme separate.

---

### Decision 3: Legacy Migration Strategy

#### The Problem
In October 2025, we migrated from authKey-based storage to sessionId-based storage. Users had existing preferences stored as `prefs:{authKey}`.

**Without migration:** Users would lose all preferences when they next logged in.

#### The Solution
Three-tier preference fallback during session handshake:

1. **Primary:** Check `prefs:{oldSessionId}` (explicit migration from previous session)
2. **Fallback 1:** Check `prefs:{lastSessionId}` from session-map (user's most recent session)
3. **Fallback 2:** Check `prefs:{authKey}` (legacy format for old users)
4. **Default:** Use system defaults if nothing found

#### Implementation
**Location:** `workers/task-api/src/session.ts:274-297`

```typescript
// Check for legacy authKey-based preferences
if (!preferences) {
    const legacyKey = preferencesKey(authKey);
    const legacyPrefs = await kv.get(legacyKey, 'json') as UserPreferences | null;
    if (legacyPrefs) {
        preferences = legacyPrefs;
        migratedFrom = authKey;
        isNewSession = false;
        console.log(`[Migration] Found legacy prefs for authKey: ${authKey.substring(0, 8)}...`);
        // Note: We keep the legacy prefs in place for safety
    }
}
```

**Safety Feature:** Legacy prefs are NOT deleted after migration, preserved for rollback safety.

**Deployed:** November 6, 2025

---

### Decision 4: Mystery Session Prevention

#### The Problem
Sessions were being added to `session-map:{authKey}` before `session-info:{sessionId}` was created. This created "mystery sessions" - sessionIds in the mapping with no corresponding session data.

**Impact:**
- Orphaned session references
- Confusing debugging
- Potential data integrity issues

**Root Cause:** Race condition in handshake flow:
```typescript
// OLD (BUGGY) ORDER:
await updateSessionMapping(kv, authKey, newSessionId);  // Added to map
await saveSessionInfo(kv, sessionInfo);                  // Created session-info
```

If `saveSessionInfo` failed, the sessionId would be in the mapping forever without session-info.

#### The Solution
**Fix 1: Reorder Operations**
```typescript
// NEW (CORRECT) ORDER:
await saveSessionInfo(kv, sessionInfo);                  // Create session-info FIRST
await updateSessionMapping(kv, authKey, newSessionId);   // Then add to map
```

**Fix 2: Validation in updateSessionMapping**
```typescript
export async function updateSessionMapping(
    kv: KVNamespace,
    authKey: string,
    sessionId: string
): Promise<void> {
    // Verify session-info exists before adding to mapping
    const sessionInfo = await getSessionInfo(kv, sessionId);
    if (!sessionInfo) {
        console.warn(`[SessionMapping] Cannot add session ${sessionId.substring(0, 16)}... - no session-info exists`);
        return;  // Silently refuse to add mystery session
    }
    // ... add to mapping
}
```

**Location:** `workers/task-api/src/session.ts:164-170` (validation), `session.ts:321-335` (reordering)

**Deployed:** November 6, 2025

---

### Decision 5: Board Locking (In-Memory, Per-Worker)

#### The Decision
Use in-memory locks within each worker instance to prevent concurrent modifications to the same board.

#### Implementation
**Location:** `workers/task-api/src/index.ts:110-133`

```typescript
const boardLocks = new Map<string, Promise<any>>();
```

#### Rationale
**Why Needed:** Workers KV has eventual consistency. Without locking:
- User A reads board data
- User B reads same board data
- User A writes changes
- User B writes changes (overwrites User A's changes)

**Why In-Memory:** Cloudflare Workers doesn't support distributed locks natively.

#### Limitations
⚠️ **CRITICAL:** Locks only work within a single worker instance!

**Scenario:** If requests go to different worker instances (different edge locations), concurrent modifications can still occur.

**Mitigation:** Most users access from same location → routed to same worker instance. For high-value operations, client-side optimistic locking could be added.

**Future Enhancement:** Could use Durable Objects for distributed locking, but adds complexity and cost.

---

## Session Lifecycle

### 1. First Visit (New User)
```
User → enters authKey → handshake
                       ↓
                  No oldSessionId
                       ↓
                  Check session-map:{authKey}
                       ↓
                  Not found
                       ↓
                  Generate newSessionId
                       ↓
                  Create session-info:{newSessionId}
                       ↓
                  Add to session-map:{authKey}
                       ↓
                  Return default preferences
```

### 2. Returning User (Same Device)
```
User → browser has oldSessionId → handshake
                                  ↓
                            Load prefs:{oldSessionId}
                                  ↓
                            Generate newSessionId
                                  ↓
                            MOVE preferences (delete old, save new)
                                  ↓
                            Update session-map (remove old, add new)
                                  ↓
                            Return migrated preferences
```

### 3. New Device (Existing User)
```
User → enters same authKey → different browser → handshake
                                                 ↓
                                           No oldSessionId
                                                 ↓
                                           Check session-map:{authKey}
                                                 ↓
                                           Found lastSessionId
                                                 ↓
                                           Load prefs:{lastSessionId}
                                                 ↓
                                           COPY preferences (keep old)
                                                 ↓
                                           Add newSessionId to session-map
                                                 ↓
                                           Return copied preferences
```

**Key Difference:** Returning user on same device = MOVE preferences. New device = COPY preferences.

---

## Migration History

### October 2025: GitHub → Workers KV
**What Changed:**
- Removed GitHub API dependency
- Migrated all storage to Cloudflare Workers KV
- Eliminated GitHub PAT requirement
- Improved performance (no external API calls)

**Impact:**
- Faster read/write operations
- Lower operational complexity
- Better Cloudflare Workers integration

### October 2025: AuthKey-Based → SessionId-Based Storage
**What Changed:**
- Old format: `prefs:{authKey}` (one per user)
- New format: `prefs:{sessionId}` (one per device)
- Added session-map for tracking

**Why:**
- Enable multi-device support
- Allow device-specific preferences
- Better UX for desktop + mobile users

**Migration Strategy:**
- Legacy fallback during handshake
- Gradual migration as users log in
- No data loss

### November 2025: Bug Fixes
**Issues Fixed:**
1. Legacy preference migration added
2. Mystery session prevention implemented
3. GET /preferences legacy fallback added

**Documentation:** See [BUG_FIXES_REQUIRED.md](../docs/archive/2025-11-06-bug-analysis.md)

---

## Bug Fixes & Improvements

### Bug 1: Users Losing Preferences (FIXED)
**Reported:** November 2025
**Cause:** Handshake didn't check for legacy `prefs:{authKey}` format
**Fix:** Added three-tier fallback system
**Status:** ✅ Deployed November 6, 2025

### Bug 2: Mystery Sessions (FIXED)
**Cause:** Session-map updated before session-info created
**Fix:** Reordered operations + validation
**Status:** ✅ Deployed November 6, 2025

### Bug 3: GET /preferences No Legacy Fallback (FIXED)
**Cause:** GET endpoint only checked sessionId format
**Fix:** Added authKey fallback with auto-migration
**Status:** ✅ Deployed November 6, 2025

---

## Code References

### Primary Implementation
- **Session Management:** `workers/task-api/src/session.ts`
  - `handleSessionHandshake()` - Lines 248-341
  - `updateSessionMapping()` - Lines 164-170 (mystery session prevention)
  - Legacy migration - Lines 274-297

### Key Storage Functions
- **KV Key Generators:** `workers/task-api/src/kv-keys.ts`
  - All KV key format functions centralized here

### API Endpoints
- **Session Handshake:** `workers/task-api/src/index.ts:686-704`
  - POST /task/api/session/handshake

- **Preferences:** `workers/task-api/src/index.ts:719-777`
  - GET /task/api/preferences (lines 719-777)
  - PUT /task/api/preferences (lines 779-817)

### Constants
- **Default Values:** `workers/task-api/src/constants.ts`
  - DEFAULT_SESSION_ID, DEFAULT_THEME, etc.

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall system architecture
- [PARENT_API_EXPECTATIONS.md](./PARENT_API_EXPECTATIONS.md) - Auth flow details
- [TESTING.md](./TESTING.md) - Test coverage for session management
- [Archive: Session Preference Analysis](./archive/2025-11-06-session-analysis.md) - Root cause analysis

---

## FAQ

### Q: Why not sync preferences across all devices?
**A:** Different devices have different optimal settings (layout, theme). Syncing would override device-specific optimizations. Future: Could add optional per-preference sync.

### Q: What happens to old sessions when a user logs in on a new device?
**A:** Old sessions remain active and functional. Each device maintains its own session and preferences.

### Q: How long do sessions last?
**A:** SessionIds persist indefinitely in browser storage. Session-info in KV has no expiration (manual cleanup needed for abandoned sessions).

### Q: Can a user have preferences on multiple devices?
**A:** Yes! That's the whole point. Each device gets its own sessionId and preferences.

### Q: What if two devices try to modify the same board simultaneously?
**A:** Board locking prevents this within a single worker instance. Across worker instances (different edge locations), eventual consistency may cause conflicts. This is rare in practice.

### Q: Why keep legacy `prefs:{authKey}` entries after migration?
**A:** Safety. If migration fails or needs rollback, we don't lose user data. Can be cleaned up after verification.

---

**Document Version:** 1.0
**Last Updated:** November 6, 2025
**Maintained By:** Engineering Team
**Change Log:**
- 2025-11-06: Initial creation documenting session architecture and recent bug fixes
