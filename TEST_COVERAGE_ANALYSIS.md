# Test Coverage Analysis - SessionId/UserId Changes

## Executive Summary

The tests pass because **they don't verify the actual data stored in KV**, only the API responses. This is a significant gap in test coverage.

## What Tests Currently Check ✅

1. **Authentication (auth.test.ts)**
   - ✅ Keys are validated correctly
   - ✅ Invalid keys default to public
   - ✅ Multiple admin/friend keys work
   - ✅ Keys from headers/query params work

2. **API Responses (api.test.ts)**
   - ✅ Status codes are correct (200, 201, etc)
   - ✅ Response structure (e.g., `{ok: true}`)
   - ✅ JSON serialization works

3. **CRUD Operations (tasks.test.ts, etc)**
   - ✅ Creating tasks works
   - ✅ Deleting tasks works
   - ✅ Completing tasks works
   - ✅ Listing boards works

## What Tests DON'T Check ❌

1. **Data Storage/Retrieval**
   - ❌ What's actually stored in KV
   - ❌ KV key format correctness
   - ❌ Data structure/schema in storage
   - ❌ SessionId mapping presence

2. **UserId/SessionId Behavior**
   - ❌ SessionId is correctly set in auth context
   - ❌ SessionId is passed to handlers
   - ❌ SessionId is used in storage correctly
   - ❌ SessionId-to-key mapping would work

3. **Data Isolation**
   - ❌ Admin user can't access friend's data
   - ❌ Different keys create isolated data
   - ❌ Public user data is separate

4. **Storage Correctness**
   - ❌ KV keys use correct sessionId/key format
   - ❌ Board metadata contains correct userType
   - ❌ Cross-user operations fail appropriately

## Why Tests Passed When We Removed `userId`

The reason tests didn't fail is:

```typescript
// What we removed:
const handlers = await operation(storage, { ...auth, userId });

// Tests only check response:
expect(response.status).toBe(200);
expect(response.ok).toBe(true);

// They DON'T check what was stored:
// ❌ Missing: verify KV["boards:key"] contains expected data
// ❌ Missing: verify KV["session-map:sessionId"] exists
// ❌ Missing: verify userType is stored correctly
```

## Critical Missing Tests

### 1. Storage Format Verification
```typescript
it('should store boards with correct structure', async () => {
  const env = createTestEnv();
  const headers = createAuthHeaders(env, 'automated_testing_admin');
  
  // Create a board
  await app.request('/task/api/boards', {
    method: 'POST',
    headers,
    body: JSON.stringify({ id: 'test-board', name: 'Test' })
  }, env);
  
  // Check what's actually in KV
  const kvData = await env.TASKS_KV.get('boards:test-admin-key', 'json');
  
  ❌ This test doesn't exist!
  
  // Should verify:
  expect(kvData).toHaveProperty('version');
  expect(kvData).toHaveProperty('boards');
  expect(kvData).toHaveProperty('updatedAt');
  expect(kvData).toHaveProperty('userType', 'admin');
});
```

### 2. SessionId Usage Verification
```typescript
it('should use sessionId correctly in storage layer', async () => {
  // When handler calls storage, verify sessionId is:
  // 1. Present in auth context
  // 2. Used to construct KV keys
  // 3. NOT the raw key (when sessionId layer implemented)
  
  ❌ No tests verify this!
});
```

### 3. Data Isolation Tests
```typescript
it('should isolate data between different keys', async () => {
  // Admin creates a board
  const adminHeaders = { 'X-User-Key': 'admin-key' };
  await app.request('/task/api/boards', {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({ id: 'admin-board' })
  }, env);
  
  // Friend tries to see admin's board
  const friendHeaders = { 'X-User-Key': 'friend-key' };
  const response = await app.request('/task/api/boards', {
    headers: friendHeaders
  }, env);
  
  const data = await response.json();
  
  ❌ Missing: verify friend doesn't see admin-board
  
  expect(data.boards).not.toContainEqual(
    expect.objectContaining({ id: 'admin-board' })
  );
});
```

### 4. Auth Context Tests
```typescript
it('should pass correct auth context to handlers', async () => {
  // Currently we can't verify what auth context is passed to handlers
  // We need a way to inspect it or verify its effects
  
  ❌ No way to test this currently!
});
```

## Test Coverage Gaps by File

### auth.test.ts
- ✅ Tests key validation
- ✅ Tests multiple keys
- ❌ Doesn't verify sessionId assignment
- ❌ Doesn't verify data isolation
- ❌ Doesn't check KV storage

### api.test.ts  
- ✅ Tests basic endpoints work
- ❌ Doesn't verify stored data format
- ❌ Doesn't check KV structure
- ❌ Doesn't verify auth context usage

### tasks.test.ts
- ✅ Tests CRUD operations
- ❌ Doesn't verify tasks stored with correct sessionId
- ❌ Doesn't verify cross-key isolation
- ❌ Doesn't check storage structure

### preferences.test.ts
- ✅ Tests preferences API
- ❌ Doesn't verify KV key format
- ❌ Doesn't check sessionId handling
- ❌ Doesn't verify per-user isolation

### batch.test.ts, movement.test.ts, etc.
- ✅ Test operations work
- ❌ No storage verification
- ❌ No sessionId tracking
- ❌ No data isolation checks

## Recommended New Tests

### Tier 1: Critical
```
storage-format.test.ts
├── Verify KV key structure
├── Verify board data contains userType
├── Verify tasks/stats use correct keys
└── Verify preferences storage format

data-isolation.test.ts
├── Different keys have isolated data
├── Admin can't see friend's boards
├── Friend can't modify admin's tasks
└── Public user has separate space
```

### Tier 2: Important
```
sessionid-handling.test.ts
├── SessionId is in auth context
├── SessionId passed to storage layer
├── SessionId mapping would work (prep for sessionId layer)
└── SessionId format consistency

auth-context.test.ts
├── userType set correctly
├── sessionId assigned correctly
├── Key extracted from headers
└── Key extracted from query params
```

### Tier 3: Nice to Have
```
cross-session.test.ts
├── Multiple concurrent sessions isolated
├── Session expiration (when implemented)
└── Session mapping cleanup

edge-cases.test.ts
├── Empty key objects
├── Special characters in keys
├── Very long keys
└── Unicode keys
```

## Action Items

### Immediate (Before Production)
1. Add storage format verification tests
2. Add data isolation tests
3. Verify sessionId is correctly assigned

### Before SessionId Layer Implementation
1. Add sessionId mapping tests
2. Add session resolution tests
3. Verify session storage format

### Before Real Users
1. Add cross-session concurrency tests
2. Add session expiration tests
3. Performance tests with multiple sessions

## Test Quality Metrics

| Metric | Current | Target |
|--------|---------|--------|
| API Response Tests | 26 | 26 ✅ |
| Storage Format Tests | 0 | 10+ ❌ |
| Data Isolation Tests | 0 | 8+ ❌ |
| SessionId Tests | 0 | 6+ ❌ |
| Auth Context Tests | 0 | 5+ ❌ |
| **Coverage Gap** | **~50%** | **~90%+** |

## Why This Matters

Without storage format tests:
- ❌ Schema changes silently break data
- ❌ SessionId layer implementation will be risky
- ❌ Data isolation bugs won't be caught
- ❌ Migration issues won't surface until production
- ❌ Performance problems won't be detected

With proper tests:
- ✅ Catch schema changes immediately
- ✅ Ensure sessionId layer works correctly
- ✅ Verify data isolation
- ✅ Detect migration problems early
- ✅ Measure and optimize performance

## Next Steps

1. Review and understand current test structure
2. Design storage verification utilities
3. Implement Tier 1 tests (critical)
4. Run with full test suite
5. Add Tier 2 tests before sessionId implementation
