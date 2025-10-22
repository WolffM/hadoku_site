# Files to Update - Summary

## 1. `workers/task-api/src/index.ts`
**Primary file - 2 sections to modify**

### Section A: Auth Middleware (Lines 108-151)
Current location of key extraction and sessionId assignment

Changes:
- After validating key, generate sessionId
- Store mapping in KV
- Pass sessionId to auth context instead of raw key
- Keep key in context for storage layer

### Section B: Storage Layer (Lines 153-230+)
Current storage functions that construct KV keys

Changes:
- Add sessionId resolver function at top of `createKVStorage`
- Make key generators async and resolve sessionId before constructing keys
- All getTasks/saveTasks/getStats/saveStats operations must resolve sessionId

## 2. New Utility File: `workers/util/sessionId.ts` (OPTIONAL)
Could consolidate session logic here for reusability:
- `generateSessionId(key: string, userType: UserType): string`
- `storeSessionMapping(kv: KVNamespace, sessionId: string, key: string, userType: UserType): Promise<void>`
- `resolveSessionIdToKey(kv: KVNamespace, sessionId: string): Promise<string>`

OR keep it all in index.ts if simpler.

## 3. `workers/task-api/src/index.ts` - Optional Tweaks

### Remove DEBUG logging
Lines with `[AUTH DEBUG]` can be cleaned up after implementation

### Update comments
- Line 61: Update comment about sessionId
- Line 145-148: Update comment about auth context

## Affected Functions (in index.ts)

These functions will need `sessionId → key` resolution:
- `getBoards(userType, sessionId)`
- `saveBoards(userType, boards, sessionId)`
- `getTasks(userType, sessionId, boardId)`
- `saveTasks(userType, sessionId, boardId, tasks)`
- `getStats(userType, sessionId, boardId)`
- `saveStats(userType, sessionId, boardId, stats)`
- `deleteBoardData(userType, sessionId, boardId)`

## Data Flow Changes

### Current (Wrong):
```
middleware: sessionId = key
  ↓
storage: boards:${sessionId}  // sessionId IS the key!
```

### New (Correct):
```
middleware: sessionId = generateId(key)
            store mapping: session-map:{sessionId} → {key, userType}
  ↓
storage: const actualKey = await resolveSessionId(sessionId)
         boards:${actualKey}  // actualKey is the real storage key
```

## Implementation Complexity

**Minimal** - All changes are in `workers/task-api/src/index.ts`:
- Add ~50-100 lines for session resolution logic
- Modify ~20-30 lines in auth middleware
- Make storage functions async (they already are)
- No changes needed to other files or storage schema

## Testing Impact

- Unit tests in `workers/task-api/src/*.test.ts` still pass (same behavior)
- API contracts unchanged
- Storage keys unchanged
- Only difference: sessionId now opaque instead of raw key
