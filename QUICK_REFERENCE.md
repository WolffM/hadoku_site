# Quick Reference - SessionId Layer Implementation

## One-Page Summary

### Problem
Raw authentication key exposed as sessionId to task app

### Solution
Generate opaque sessionId, store mapping in KV, resolve at storage time

### Where to Change
`workers/task-api/src/index.ts` - Only file

### Changes Needed

#### 1. Add utilities (~80 lines, line ~100)
```typescript
function generateSessionId(key, userType)
async function storeSessionMapping(kv, sessionId, key, userType)
async function resolveSessionIdToKey(kv, sessionId)
```

#### 2. Auth middleware (~30 lines modified, lines ~108-151)
```typescript
// Generate sessionId instead of using raw key
const sessionId = generateSessionId(key, userType);
await storeSessionMapping(env.TASKS_KV, sessionId, key, userType);

// Pass sessionId (opaque), keep key for storage layer
const authContext = {
  userType,
  sessionId,  // ✅ Opaque
  key         // For storage to resolve
};
```

#### 3. Storage layer (~80 lines modified, lines ~153+)
```typescript
// Make key generator async and resolve sessionId
const boardKey = async (sessionId?: string) => {
  const key = await resolveSessionIdToKey(env.TASKS_KV, sessionId || 'public');
  return `boards:${key}`;
};

// Use in storage methods
async getBoards(userType, sessionId) {
  const kvKey = await boardKey(sessionId);  // Resolve first!
  return env.TASKS_KV.get(kvKey, 'json');
}
```

### KV Storage

**New Entry Type:**
```
session-map:{sessionId} → {key, userType, timestamp, expiresAt}
```

**Existing Entries:** 
```
boards:{key}         ← unchanged
tasks:{key}:{boardId} ← unchanged
stats:{key}:{boardId} ← unchanged
prefs:{key}          ← unchanged
```

### API Usage

**First call (provide key):**
```
GET /api/boards?key=X3vP9aLzR2tQ8nBw
→ Returns: {data, sessionId: "sess_x3vp9alz"}
```

**Subsequent calls (use sessionId):**
```
GET /api/boards?sessionId=sess_x3vp9alz
→ Returns: {data, sessionId: "sess_x3vp9alz"}
```

### Data Flow

```
Request with key
  ↓
Auth: generate sessionId, store mapping
  ↓
Handler: receives opaque sessionId
  ↓
Storage: resolve sessionId → key
  ↓
KV: boards:X3vP9aLzR2tQ8nBw ← same as before!
```

### Implementation Steps

1. Add session utilities function (~5 min)
2. Update auth middleware (~10 min)
3. Update storage layer (~20 min)
4. Run tests (~5 min)
5. Done! (~45 min total)

### Key Points

✅ Only 1 file changes  
✅ Storage keys unchanged  
✅ KV schema extended (not broken)  
✅ Backward compatible  
✅ ~200 lines of code  
✅ No new infrastructure  
✅ Proper session abstraction  

---

## Decision Tree: Which Entry to Read?

- **Quick overview?** → `DESIGN_SUMMARY.md` ← You are here
- **Visual flow?** → `SESSION_ARCHITECTURE.md`
- **Code examples?** → `SESSION_CODE_EXAMPLES.md`
- **Implementation steps?** → `IMPLEMENTATION_PLAN.md`
- **File locations?** → `FILES_TO_UPDATE.md`
- **Full design?** → `SESSION_MANAGEMENT_DESIGN.md`
