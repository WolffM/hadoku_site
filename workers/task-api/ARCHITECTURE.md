# Task API Architecture

**Last Updated:** November 10, 2025

## Overview

The task-api worker is a Hono-based Cloudflare Worker that provides a RESTful API for task management. It uses the Universal Adapter pattern, importing business logic from `@wolffm/task` and providing a KV-backed storage implementation.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                       HTTP Layer (Hono)                          │
│  • CORS middleware (from @hadoku/worker-utils)                   │
│  • Authentication middleware (validateKeyAndGetType)             │
│  • Throttle middleware (rate limiting for public users)          │
│  • Route handlers (routes/*.ts)                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                           │
│  @wolffm/task/api (TaskHandlers)                                │
│  • Framework-agnostic pure functions                             │
│  • Operates on TaskStorage interface                             │
│  • No knowledge of Hono, KV, or Workers                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Storage Layer                                 │
│  createKVStorage() → TaskStorage interface                       │
│  • Workers KV for task data                                      │
│  • D1 for stats/analytics                                        │
│  • In-memory locks for write coordination                        │
└─────────────────────────────────────────────────────────────────┘
```

## Main Request Flows

### 1. Authenticated Request (Admin/Friend)

```
Request: GET /task/api/tasks
Headers: X-User-Key: admin-key-123

1. CORS Middleware → Allow request
2. Auth Middleware → validateKeyAndGetType(key, adminKeys, friendKeys)
   - Returns: { userType: 'admin', sessionId: key }
   - Stores in context: c.set('authContext', ...)
3. Throttle Middleware → Skip (admin users bypass throttling)
4. Route Handler → tasks.ts
   - Calls: handleOperation(c, TaskHandlers.getBoardTasks)
   - getContext(c) → { storage: createKVStorage(), auth }
5. TaskHandlers.getBoardTasks(storage, auth, boardId)
   - storage.getTasks(userType, sessionId, boardId)
   - KV.get(`tasks:${sessionId}:${boardId}`)
6. Response: JSON with tasks array
```

### 2. Public Request (No Auth)

```
Request: GET /task/api/tasks

1. CORS Middleware → Allow request
2. Auth Middleware → No credential provided
   - Returns: { userType: 'public', sessionId: 'public' }
3. Throttle Middleware → Check rate limit
   - KV.get(`throttle:public`)
   - Check: requests in last 60s < 60
   - If exceeded: Return 429 Too Many Requests
   - If allowed: Increment counter, continue
4. Route Handler → tasks.ts (same as authenticated)
5. TaskHandlers uses sessionId='public' for KV operations
6. Response: JSON with tasks array
```

### 3. Task Creation with Board Locking

```
Request: POST /task/api/
Body: { id, title, boardId: 'main' }
Headers: X-User-Key: admin-key

1. CORS + Auth + Throttle (same as above)
2. Route Handler → tasks.ts
   - Validates: requireFields(body, ['id', 'title'])
   - Calls: handleBoardOperation(c, boardId, operation)
3. handleBoardOperation()
   - Generates lock key: `admin:admin-key-123:main`
   - Acquires in-memory lock (prevents concurrent writes)
   - Calls: TaskHandlers.createTask(storage, auth, input, boardId)
4. TaskHandlers.createTask()
   - storage.getTasks() → KV read
   - Adds new task to array
   - storage.saveTasks() → KV write
   - storage.saveStats() → D1 event log
5. Lock released
6. Response: JSON with created task
```

### 4. Batch Operation with Multiple Locks

```
Request: POST /task/api/batch-tag
Body: { operations: [
  { boardId: 'main', taskId: '1', action: 'add', tag: 'urgent' },
  { boardId: 'work', taskId: '2', action: 'add', tag: 'urgent' }
]}

1. CORS + Auth + Throttle
2. Route Handler → tags-batch.ts
   - Calls: handleBatchOperation(c, ['operations'], operation, getBoardKeys)
3. handleBatchOperation()
   - Validates required fields
   - getBoardKeys() → ['admin:admin-key:main', 'admin:admin-key:work']
   - Sorts keys alphabetically (prevents deadlock)
   - Acquires locks in order: first 'main', then 'work'
4. TaskHandlers.batchTagOperations()
   - Processes all operations
   - Multiple KV reads/writes across boards
5. Locks released in reverse order
6. Response: JSON with results
```

## File Structure

```
workers/task-api/src/
├── index.ts                    # Main entry point
│   ├── Middleware stack (CORS, Auth, Throttle)
│   └── Route registration
│
├── routes/                     # Route modules (Hono apps)
│   ├── route-utils.ts          # Shared route utilities ⭐
│   ├── tasks.ts                # Task CRUD
│   ├── boards.ts               # Board management
│   ├── preferences.ts          # User preferences
│   ├── session.ts              # Session management
│   ├── tags-batch.ts           # Batch tag operations
│   ├── admin.ts                # Admin endpoints
│   └── misc.ts                 # Health, validate-key
│
├── throttle.ts                 # Rate limiting system
├── session.ts                  # Session utilities
├── request-utils.ts            # Request parameter extraction ⚠️
├── constants.ts                # Constants (re-exports from util)
├── kv-keys.ts                  # KV key generation functions
├── events.ts                   # D1 event logging
│
└── *.test.ts                   # Vitest test files
```

## Key Components

### route-utils.ts ⭐ Core Utilities

**Purpose:** Provides the bridge between HTTP layer and business logic.

**Key Functions:**

1. **createKVStorage(env)** - Creates TaskStorage implementation
   - Maps TaskStorage interface to Workers KV + D1
   - Handles KV key generation
   - Manages stats via D1

2. **getContext(c)** - Extracts storage + auth from Hono context
   - Returns: `{ storage, auth }`
   - Used by almost every route handler

3. **handleOperation(c, operation)** - Generic handler without locking
   - For read-only or single-item operations
   - Calls operation with storage + auth
   - Returns JSON response

4. **handleBoardOperation(c, boardId, operation)** - Handler with board locking
   - For write operations on a single board
   - Acquires in-memory lock to prevent race conditions
   - Ensures sequential writes to same board

5. **handleBatchOperation(c, requiredFields, operation, getBoardKeys)** - Batch handler
   - For operations across multiple boards
   - Validates required fields
   - Acquires multiple locks in sorted order (deadlock prevention)

**Board Locking System:**
- Uses Map<string, Promise> for in-memory locks
- Lock key format: `{userType}:{sessionId}:{boardId}`
- Prevents concurrent writes to same board
- Locks are per-worker instance (not global)

### throttle.ts - Rate Limiting

**Configuration:**
```typescript
DEFAULT_THROTTLE_LIMITS = {
  admin:  { windowMs: 60000, maxRequests: 300 },  // 5 req/sec
  friend: { windowMs: 60000, maxRequests: 120 },  // 2 req/sec
  public: { windowMs: 60000, maxRequests: 60 }    // 1 req/sec
}
```

**Features:**
- Per-sessionId tracking in KV
- Violation counting (auto-blacklist after 3)
- Incident recording with 24hr retention
- Blacklist support

**Optimization:**
- Only applies to public users
- Admin/friend bypass throttling (trusted users)
- Significantly reduces KV operations

### request-utils.ts ⚠️ Task-Specific Utilities

**Current Functions:**
- `getBoardIdFromContext()` - Extract boardId from request
- `getTaskIdFromParam()` - Extract taskId from URL
- `getSessionIdFromRequest()` - Extract sessionId
- `validateTaskId()` / `validateBoardId()` - Validation
- `parseBodySafely()` - Safe JSON parsing
- `createTaskOperationHandler()` - Task operation wrapper

**Status:** Contains task-specific helpers that are fine here.

## Authentication Flow

### Key Validation

```typescript
// 1. Parse keys from environment
const adminKeys = parseKeysFromEnv(env.ADMIN_KEYS);  // Set or Record
const friendKeys = parseKeysFromEnv(env.FRIEND_KEYS);

// 2. Validate incoming key
const { valid, userType } = validateKeyAndGetType(
  credential, 
  adminKeys, 
  friendKeys
);
// Returns: { valid: true, userType: 'admin' | 'friend' | 'public' }

// 3. Set auth context
c.set('authContext', { userType, sessionId, key });
```

### Auth Middleware Pattern

Uses `createAuthMiddleware()` from @hadoku/worker-utils:
- Sources: `['header:X-User-Key', 'query:key']`
- Resolver: Custom function to validate keys
- Sets: `c.get('authContext')` for route handlers

## Storage Patterns

### KV Key Structure

```
tasks:{sessionId}:{boardId}           # Task data
boards:{sessionId}                    # Board list
prefs:{sessionId}                     # User preferences
throttle:{sessionId}                  # Rate limit state
incidents:{sessionId}                 # Security incidents
blacklist:{sessionId}                 # Blacklisted sessions
session-auth:{authKey}:{sessionId}    # Session mapping
```

### D1 Event Logging

**Purpose:** Track task lifecycle for stats/analytics

**Tables:**
- `task_events` - Event log (create, complete, update, delete)
- Indexed by: `userKey`, `boardId`, `taskId`, `timestamp`

**Query Patterns:**
- `getD1BoardStats()` - Aggregate counters from events
- `getBoardTimeline()` - Recent events for a board
- `deleteBoardEvents()` - Cleanup when board deleted

## Current Issues & Improvements

### ✅ Good Patterns

1. **Universal Adapter Pattern** - Clean separation between business logic and infrastructure
2. **Shared Utilities** - Good use of @hadoku/worker-utils for auth, CORS, validation
3. **Route Modules** - Well-organized route separation
4. **Board Locking** - Prevents race conditions on concurrent writes
5. **Throttling** - Smart optimization (skip for trusted users)
6. **D1 for Stats** - Offloads analytics from KV to proper database

### ⚠️ Potential Issues

#### 1. **In-Memory Locks Are Not Global** ❌

**Problem:**
```typescript
const boardLocks = new Map<string, Promise<any>>();
```

This is a **module-level Map**, which means:
- Locks are per-worker instance
- Multiple worker instances can write to same board simultaneously
- Race conditions can still occur in production

**Impact:** 
- Low risk for personal use (low traffic)
- High risk for multi-user scenarios
- KV "last write wins" model can cause data loss

**Solutions:**
1. **Use Durable Objects** (recommended for production)
   - Provides true global coordination
   - Single instance per board
   - Guaranteed sequential processing
   
2. **Use optimistic locking with ETags**
   - Store version number in KV metadata
   - Check version before write
   - Retry on conflict

3. **Accept eventual consistency** (current approach)
   - Document the limitation
   - Acceptable for personal use
   - Monitor for conflicts

**Recommendation:** Add a comment documenting this limitation and recommend Durable Objects for production multi-user deployments.

#### 2. **createTaskOperationHandler() Complexity** ⚠️

**Location:** `request-utils.ts`

**Problem:**
```typescript
export function createTaskOperationHandler<T>(
	method: string,
	path: string,
	operation: (storage: any, auth: any, taskId: string, boardId: string, body?: any) => Promise<T>,
	handleBoardOperation: any,
	logRequest: any,
	logError: any,
	badRequest: any,
	getContext: any
) { /* ... */ }
```

**Issues:**
- Takes 8 parameters (too many)
- Functions passed as dependencies (unusual pattern)
- Not type-safe (`any` types)
- Could be simplified with closures or partial application

**Better Pattern:**
```typescript
// Option 1: Use route-utils functions directly (no factory)
app.patch('/:id', async (c) => {
  const id = getTaskIdFromParam(c);
  if (!validateTaskId(id)) return badRequest(c, 'Invalid task ID');
  
  const body = await parseBody(c, {});
  const boardId = getBoardIdFromContext(c, body);
  
  logRequest('PATCH', '/task/api/:id', { taskId: id, boardId });
  
  return handleBoardOperation(c, boardId, (storage, auth) =>
    TaskHandlers.updateTask(storage, auth, id, body, boardId)
  );
});

// Option 2: Higher-order function with closure
function createTaskHandler(
  method: string,
  path: string,
  handler: (id: string, body: any, boardId: string) => any
) {
  return async (c: Context) => {
    const id = c.req.param('id');
    if (!id) return badRequest(c, 'Missing task ID');
    
    const body = await parseBody(c, {});
    const boardId = getBoardIdFromContext(c, body);
    
    logRequest(method, path, { taskId: id, boardId });
    
    return handleBoardOperation(c, boardId, (storage, auth) =>
      handler(id, body, boardId)
    );
  };
}

// Usage
app.patch('/:id', createTaskHandler('PATCH', '/task/api/:id', 
  (id, body, boardId) => TaskHandlers.updateTask(storage, auth, id, body, boardId)
));
```

**Recommendation:** Simplify by either removing the factory or using proper closure pattern.

#### 3. **Throttle State in KV** ⚠️

**Current:**
- Throttle state stored in KV
- Each request reads + writes KV
- 60 requests/min = 120 KV operations/min per user

**Optimization:**
- Use Durable Objects for throttling
- In-memory counters (much faster)
- Only persist on eviction/failure

**Current Mitigation:**
- Only applies to public users (good!)
- Admin/friend bypass (reduces KV load)

**Recommendation:** Document this as a known limitation. Consider DO migration if public traffic grows.

#### 4. **Mixed Responsibilities in index.ts** ⚠️

**Current:**
```typescript
// index.ts contains:
- Middleware definitions
- Auth resolver logic
- Throttle middleware logic
- Route registration
```

**Better:**
- Move auth resolver to `auth.ts` or `middleware/auth.ts`
- Move throttle middleware to `middleware/throttle.ts`
- Keep index.ts as pure composition

**Benefit:** Easier testing, clearer separation of concerns

#### 5. **Error Handling Inconsistency** ⚠️

**Pattern 1:** Explicit validation + return
```typescript
const error = requireFields(body, ['id', 'title']);
if (error) {
  logError('POST', '/task/api', error);
  return badRequest(c, error);
}
```

**Pattern 2:** Try/catch (missing in most places)
```typescript
try {
  const result = await operation();
  return c.json(result);
} catch (error) {
  logError(...);
  return serverError(c, error.message);
}
```

**Issue:** No top-level error handling for unexpected exceptions

**Recommendation:**
- Add error boundary middleware
- Consistent error response format
- Log all unhandled errors

### 💡 Recommended Improvements

#### High Priority

1. **Document Board Lock Limitations**
   ```typescript
   /**
    * IMPORTANT: These locks are per-worker instance, not global.
    * For production multi-user deployments, use Durable Objects
    * to ensure true global coordination across all worker instances.
    * 
    * Current approach is acceptable for:
    * - Personal use (single user)
    * - Low traffic scenarios
    * - Development/testing
    */
   const boardLocks = new Map<string, Promise<any>>();
   ```

2. **Simplify createTaskOperationHandler()**
   - Remove factory function
   - Use direct route handler patterns
   - Improve type safety

3. **Add Error Boundary Middleware**
   ```typescript
   app.use('*', async (c, next) => {
     try {
       await next();
     } catch (error) {
       logError('UNCAUGHT', c.req.path, error.message);
       return serverError(c, 'An unexpected error occurred');
     }
   });
   ```

#### Medium Priority

4. **Extract Middleware to Separate Files**
   - `middleware/auth.ts` - Auth resolver
   - `middleware/throttle.ts` - Throttle logic
   - `middleware/error.ts` - Error boundary

5. **Add Request ID Tracking**
   ```typescript
   app.use('*', async (c, next) => {
     const requestId = crypto.randomUUID();
     c.set('requestId', requestId);
     c.header('X-Request-ID', requestId);
     await next();
   });
   ```

6. **Standardize Logging Format**
   - Include requestId in all logs
   - Structured log format
   - Consistent error context

#### Low Priority

7. **Consider Durable Objects for Locks**
   - True global coordination
   - Better performance for throttling
   - Stronger consistency guarantees

8. **Add Metrics/Observability**
   - Track request durations
   - Monitor KV operation counts
   - Alert on high error rates

## Testing Strategy

**Current Coverage:**
- ✅ Extensive test suite (*.test.ts files)
- ✅ Unit tests for business logic
- ✅ Integration tests for storage
- ✅ Auth tests
- ✅ Session tests
- ✅ Data isolation tests

**Good Practices:**
- Mock KV/D1 with test-utils
- Separate test files per feature
- Clear test descriptions

## Performance Characteristics

### Request Latency Breakdown

```
Total: ~50-100ms (warm worker, KV cache hit)

- CORS middleware: ~1ms
- Auth middleware: ~2ms (parseKeysFromEnv + validation)
- Throttle check: ~10-20ms (KV read + write)
- Route handler: ~5ms
- TaskHandlers logic: ~5ms
- KV operations: ~20-40ms (read + write)
- D1 event log: ~10ms (async, non-blocking for response)
```

### KV Operations Per Request

**Authenticated User (Admin/Friend):**
- Throttle: 0 (bypassed)
- Task data: 1 read + 1 write = 2 ops
- Stats: 0 (D1 only)
- **Total: ~2 KV ops per write request**

**Public User:**
- Throttle: 1 read + 1 write = 2 ops
- Task data: 1 read + 1 write = 2 ops
- **Total: ~4 KV ops per write request**

**Optimization Win:** Bypassing throttle for authenticated users reduces KV load by 50%!

### Free Tier Limits

- **Workers:** 100,000 requests/day ✅
- **KV Reads:** 100,000/day ✅
- **KV Writes:** 1,000/day ⚠️ (can be limiting for heavy write workloads)
- **D1:** 5 million reads/day, 100K writes/day ✅

**Recommendation:** Monitor KV write usage if supporting multiple active users.

## Security Considerations

### Authentication
- ✅ Keys validated on every request
- ✅ Keys in headers only (never in body)
- ✅ Server-side userType determination
- ✅ Re-validation in session handshake
- ✅ All logging uses masked keys

### Rate Limiting
- ✅ Per-sessionId throttling
- ✅ Automatic blacklisting (3 violations)
- ✅ Incident recording
- ✅ Public users only (reduces attack surface)

### Data Isolation
- ✅ sessionId-based KV keys
- ✅ No cross-session data leakage
- ✅ Separate storage per userType
- ✅ Test coverage for isolation

### Input Validation
- ✅ Required field validation
- ✅ Type checking in TaskHandlers
- ✅ Sanitization in util functions
- ⚠️ Could add more input sanitization

## Deployment Checklist

- [x] Environment variables configured (ADMIN_KEYS, FRIEND_KEYS)
- [x] KV namespace bound (TASKS_KV)
- [x] D1 database bound (DB)
- [x] CORS origins configured
- [x] Rate limits tuned for expected traffic
- [ ] Monitor KV write quota
- [ ] Set up error alerting
- [ ] Document lock limitations for users
- [ ] Consider Durable Objects migration for production

## Future Enhancements

### Short Term
1. Document lock limitations
2. Simplify createTaskOperationHandler()
3. Add error boundary middleware
4. Extract middleware to files

### Medium Term
5. Request ID tracking
6. Structured logging
7. Performance monitoring
8. Better error handling

### Long Term
9. Durable Objects for locks
10. Durable Objects for throttling
11. Real-time collaboration features
12. Websocket support

## Related Documentation

- **docs/ARCHITECTURE.md** - System-wide architecture
- **docs/SESSION_ARCHITECTURE.md** - Session management design
- **docs/SECURITY.md** - Security model details
- **workers/util/README.md** - Shared utilities reference
- **@wolffm/task package** - Business logic documentation

---

**Summary:** The task-api worker has a solid architecture with good separation of concerns. The main area for improvement is the in-memory lock system, which should be documented clearly or migrated to Durable Objects for true multi-user production deployments. The codebase is well-tested, follows consistent patterns, and makes good use of shared utilities.
