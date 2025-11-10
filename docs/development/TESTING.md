# Testing Guide

**Last Updated:** November 6, 2025

## Overview

This document describes the testing strategy, current coverage, and how to write and run tests for the Hadoku site project.

---

## Table of Contents

1. [Test Philosophy](#test-philosophy)
2. [Current Coverage](#current-coverage)
3. [Running Tests](#running-tests)
4. [Test Utilities](#test-utilities)
5. [Writing Tests](#writing-tests)
6. [Known Limitations](#known-limitations)
7. [Improvement Plan](#improvement-plan)

---

## Test Philosophy

### What We Test

**Focus Areas:**
- ✅ **API Endpoints** - Request/response behavior, validation, error handling
- ✅ **Session Management** - Handshake flow, preference migration, multi-device scenarios
- ✅ **Storage Operations** - KV read/write, data isolation, key formats
- ✅ **Business Logic** - Task CRUD, board operations, tag management
- ✅ **Authentication** - Key validation, userType determination

**Integration-First Approach:**
We primarily write integration tests that exercise the full request/response cycle rather than isolated unit tests. This validates real-world behavior and catches integration issues.

### What We Don't Test

**Out of Scope:**
- ❌ **UI/Frontend** - Frontend testing is manual (for now)
- ❌ **Cloudflare Workers Runtime** - We mock the environment
- ❌ **Edge Cases in Child Package** - `@wolffm/task` has its own tests
- ❌ **Performance/Load Testing** - Not automated currently

---

## Current Coverage

### Overall Assessment

**Structural Coverage:** ~70%
**Quality Coverage:** ~60%
**Overall Grade:** C+ (75/100)

**Last Comprehensive Analysis:** See [TEST_QUALITY_ANALYSIS.md](./archive/2025-11-06-test-analysis.md)

### Test File Inventory

| Test File | Tests | Coverage | Notes |
|-----------|-------|----------|-------|
| `api.test.ts` | 4 | Basic CRUD | Smoke tests only |
| `session.test.ts` | 10 | Session lifecycle | Good coverage |
| `session-kv.test.ts` | 3 | KV verification | Step-by-step validation |
| `preferences.test.ts` | 1 | Basic prefs | **WEAK** - needs expansion |
| `tasks.test.ts` | 2 | Task operations | Basic CRUD |
| `boards.test.ts` | 6 | Board management | Good coverage |
| `tags.test.ts` | 6 | Tag operations | Good coverage |
| `batch.test.ts` | 3 | Batch operations | Complex scenarios |
| `idempotency.test.ts` | 2 | Duplicate handling | Edge cases |
| `storage-format.test.ts` | 6 | KV key formats | Validation tests |
| `throttle.test.ts` | 5 | Rate limiting | Core functionality |
| `isolation.test.ts` | 9 | Data isolation | Critical security |
| `complex-scenarios.test.ts` | 10 | Real-world flows | Integration tests |
| **NEW** `legacy-migration.test.ts` | 6 | Legacy prefs | Bug fix coverage |
| **NEW** `mystery-session.test.ts` | 6 | Session prevention | Bug fix coverage |
| **NEW** `preferences-legacy-fallback.test.ts` | 8 | GET fallback | Bug fix coverage |

**Total:** 17 test files, 81 tests

### Coverage by Subsystem

#### Session Management ✅ Good (90%)
- Session handshake flow
- Multi-device scenarios
- Legacy migration
- Mystery session prevention
- Session mapping updates

**Gap:** Edge cases with corrupted session data

#### Preferences ⚠️ Fair (70%)
- Basic save/retrieve
- Legacy fallback (NEW)
- Migration scenarios (NEW)

**Gap:** Merge conflicts, concurrent updates, default handling

#### Task/Board Operations ✅ Good (85%)
- CRUD operations
- Tag management
- Batch operations
- Idempotency
- Data isolation

**Gap:** Complex task hierarchies, bulk operations edge cases

#### Authentication ✅ Excellent (95%)
- Key validation
- UserType determination
- Session validation

**Gap:** Expired sessions, malformed keys

#### Throttling ✅ Good (80%)
- Rate limiting
- Violation tracking
- Blacklist management

**Gap:** Distributed throttling, edge location scenarios

---

## Running Tests

### Quick Start

```bash
# Run all tests
cd workers/task-api
npm test

# Run specific test file
npm test session.test.ts

# Run with coverage
npm test -- --coverage

# Run in watch mode (development)
npm test -- --watch

# Run tests matching pattern
npm test -- --grep "legacy"
```

### Test Output

Tests use Vitest framework with clear output:

```
✓ src/session.test.ts (10 tests) 45ms
✓ src/legacy-migration.test.ts (6 tests) 32ms
✓ src/mystery-session.test.ts (6 tests) 28ms

Test Files  17 passed (17)
Tests  81 passed (81)
Duration  1.2s
```

### Continuous Integration

Tests run automatically on:
- ✅ Every push to `main` branch
- ✅ Every pull request
- ✅ Before deployment

**CI Configuration:** `.github/workflows/test-workers.yml`

---

## Test Utilities

### Core Utilities (test-utils.ts)

#### createTestEnv()
Creates a mock Cloudflare Workers environment with:
- Mock Workers KV (persistent within test)
- Test admin/friend keys
- Environment variables

```typescript
import { createTestEnv } from './test-utils';

const env = createTestEnv();
// env.TASKS_KV - Mock KV namespace
// env.ADMIN_KEYS - JSON key mapping
// env.FRIEND_KEYS - JSON key mapping
```

#### createAuthHeaders()
Generates authentication headers for requests:

```typescript
import { createAuthHeaders } from './test-utils';

const headers = createAuthHeaders(env, 'automated_testing_admin');
// Returns: { 'X-User-Key': '...', 'X-User-Id': '...', 'Content-Type': 'application/json' }
```

#### Helper Functions

```typescript
// API endpoint helpers
await createBoard(app, env, headers, boardId, name);
await createTask(app, env, headers, boardId, taskId, title);
await createTag(app, env, headers, boardId, tag);

// Convenience wrappers (auto-generate IDs)
const { boardId } = await createTestBoard(app, env, headers);
const { taskId } = await createTestTask(app, env, headers, boardId);
const { tag } = await createTestTag(app, env, headers, boardId);
```

### Mock KV Implementation

**Location:** `workers/task-api/src/test-utils.ts:11-65`

```typescript
export function createMockKV(): KVNamespace {
    const store = new Map<string, string>();

    return {
        async get(key, type) { /* ... */ },
        async put(key, value) { /* ... */ },
        async delete(key) { /* ... */ },
        async list() { /* ... */ }
    };
}
```

**Important:** Mock KV is shared within a single test but NOT across tests. Each test gets a fresh KV instance.

---

## Writing Tests

### Test Structure

We use Vitest with descriptive test names:

```typescript
import { describe, it, expect } from 'vitest';
import app from './index';
import { createTestEnv, createAuthHeaders } from './test-utils';

describe('Feature Name', () => {
    const env = createTestEnv();

    describe('Specific Scenario', () => {
        it('should do something specific', async () => {
            // Arrange
            const headers = createAuthHeaders(env, 'automated_testing_admin');

            // Act
            const response = await app.request('/task/api/endpoint', {
                method: 'POST',
                headers,
                body: JSON.stringify({ data: 'value' })
            }, env);

            // Assert
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.field).toBe('expected');
        });
    });
});
```

### Best Practices

#### 1. Use Descriptive Test Names
**Good:**
```typescript
it('should migrate prefs:{authKey} during handshake when no oldSessionId provided', async () => {
```

**Bad:**
```typescript
it('test migration', async () => {
```

#### 2. Test One Thing Per Test
Each test should validate a single behavior or scenario.

#### 3. Verify KV State
Don't just test API responses - verify the data was actually written to KV:

```typescript
// Check response
expect(response.status).toBe(200);

// Verify KV state
const savedData = await env.TASKS_KV.get(`prefs:${sessionId}`, 'json');
expect(savedData.theme).toBe('dark');
```

#### 4. Use Unique Keys Per Test
Avoid test interference by using unique identifiers:

```typescript
const uniqueKey = `test-${Date.now()}-${Math.random()}`;
```

#### 5. Test Error Cases
Don't just test the happy path:

```typescript
it('should reject handshake without newSessionId', async () => {
    const response = await app.request('/task/api/session/handshake', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({ oldSessionId: null })  // Missing newSessionId
    }, env);

    expect(response.status).toBe(400);
});
```

### Example: Complete Test

```typescript
import { describe, it, expect } from 'vitest';
import app from './index';
import { createTestEnv, createAuthHeaders } from './test-utils';

describe('Session Handshake', () => {
    const env = createTestEnv();

    it('should create new session with default preferences', async () => {
        // Arrange: Create unique user
        const uniqueKey = `test-user-${Date.now()}`;
        const headers = {
            'X-User-Key': uniqueKey,
            'X-User-Id': 'test-admin',
            'Content-Type': 'application/json'
        };

        // Add key to admin keys
        const keys = JSON.parse(env.ADMIN_KEYS || '{}');
        keys[uniqueKey] = uniqueKey;
        env.ADMIN_KEYS = JSON.stringify(keys);

        // Act: Perform handshake
        const newSessionId = `session-${Date.now()}`;
        const response = await app.request('/task/api/session/handshake', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                oldSessionId: null,
                newSessionId: newSessionId
            })
        }, env);

        // Assert: Check response
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.sessionId).toBe(newSessionId);
        expect(data.preferences.theme).toBe('system'); // Default
        expect(data.isNewSession).toBe(true);

        // Assert: Verify KV state
        const prefs = await env.TASKS_KV.get(`prefs:${newSessionId}`, 'json');
        expect(prefs).toBeDefined();
        expect(prefs.theme).toBe('system');

        const sessionInfo = await env.TASKS_KV.get(`session-info:${newSessionId}`, 'json');
        expect(sessionInfo).toBeDefined();
        expect(sessionInfo.authKey).toBe(uniqueKey);
    });
});
```

---

## Known Limitations

### 1. Mock KV vs Real KV

**Issue:** Mock KV uses in-memory `Map`, which doesn't perfectly replicate Workers KV behavior.

**Differences:**
- ❌ No eventual consistency simulation
- ❌ No TTL/expiration support
- ❌ No metadata support
- ❌ No edge location distribution

**Mitigation:** Tests focus on correctness of operations, not distributed behavior.

**Future:** Consider using [Miniflare](https://miniflare.dev/) for more realistic Workers KV simulation.

### 2. No Distributed Testing

**Issue:** Can't test behavior across multiple worker instances (board locking, distributed throttling).

**Impact:** Board locking only works within a single worker instance. Tests can't verify this limitation.

**Mitigation:** Document limitation clearly. Consider load testing in staging.

### 3. Limited Performance Testing

**Issue:** No automated tests for latency, throughput, or resource usage.

**Impact:** Can't catch performance regressions automatically.

**Mitigation:** Manual performance monitoring in production. Could add simple perf tests later.

### 4. No End-to-End Frontend Tests

**Issue:** No automated tests for React UI, user interactions, or client-side state.

**Impact:** Frontend regressions caught manually.

**Mitigation:** Manual testing checklist. Could add Playwright tests in future.

### 5. Mock Auth Environment

**Issue:** Tests use simplified admin/friend key validation.

**Impact:** Might not catch edge cases in real auth flow.

**Mitigation:** Test coverage focuses on key validation logic. Production monitoring for real auth issues.

---

## Improvement Plan

Based on [TEST_QUALITY_ANALYSIS.md](./archive/2025-11-06-test-analysis.md), here's the roadmap:

### Phase 1: Critical Gaps (✅ COMPLETED - Nov 6, 2025)
- ✅ Add legacy preference migration tests (6 tests)
- ✅ Add mystery session prevention tests (6 tests)
- ✅ Add GET /preferences legacy fallback tests (8 tests)

**Result:** +20 tests, bug fix coverage at 100%

### Phase 2: High Priority (2-3 weeks)
- ⏳ Expand preferences tests (merge conflicts, concurrent updates)
- ⏳ Add throttling distributed scenario tests
- ⏳ Add session expiration/cleanup tests
- ⏳ Add KV failure simulation tests
- ⏳ Improve mock KV to persist across operations

**Estimated:** +15-20 tests

### Phase 3: Nice to Have (1-2 months)
- ⏳ Migrate to Miniflare for realistic KV
- ⏳ Add performance benchmarks
- ⏳ Add end-to-end frontend tests with Playwright
- ⏳ Add load testing scenarios
- ⏳ Add chaos engineering tests (random failures)

**Estimated:** +20-30 tests

### Target Coverage

**Current:** 75/100 (C+)
**6-month Goal:** 90/100 (A-)

---

## Test Coverage Report

Generate a coverage report:

```bash
cd workers/task-api
npm test -- --coverage

# Output:
File                  | % Stmts | % Branch | % Funcs | % Lines
----------------------|---------|----------|---------|--------
index.ts              |   82.5  |   75.3   |   88.1  |   83.2
session.ts            |   95.2  |   89.4   |   97.1  |   96.3
throttle.ts           |   78.6  |   70.2   |   82.5  |   79.1
request-utils.ts      |   88.9  |   83.7   |   90.3  |   89.5
```

---

## Troubleshooting Tests

### Tests Failing Locally

**Common Causes:**
1. **Stale dependencies:** Run `npm install`
2. **Modified test environment:** Check `createTestEnv()` configuration
3. **Port conflicts:** Make sure no other processes are using test ports

### Tests Passing Locally but Failing in CI

**Common Causes:**
1. **Timing issues:** Add `await` for async operations
2. **Unique ID collisions:** Use `Date.now() + Math.random()` for unique keys
3. **Environment variables:** Check CI environment setup

### Mock KV Not Persisting Data

**Issue:** Data written in one operation not available in next operation.

**Cause:** Mock KV `Map` is scoped to function call, not test.

**Solution:** Use the shared `env` object created by `createTestEnv()`:
```typescript
const env = createTestEnv();  // Once at test start
// Use env.TASKS_KV throughout test
```

### Flaky Tests

**Symptoms:** Tests sometimes pass, sometimes fail.

**Common Causes:**
1. Shared state between tests
2. Timing/race conditions
3. Non-unique test data

**Solutions:**
1. Use unique keys: `test-${Date.now()}-${Math.random()}`
2. Add `await` to all async operations
3. Clean up state in `afterEach` hooks

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [SESSION_ARCHITECTURE.md](./SESSION_ARCHITECTURE.md) - Session management details
- [SECURITY.md](./SECURITY.md) - Security testing considerations
- [Archive: Test Quality Analysis](./archive/2025-11-06-test-analysis.md) - Detailed coverage analysis

---

**Document Version:** 1.0
**Last Updated:** November 6, 2025
**Maintained By:** Engineering Team
**Change Log:**
- 2025-11-06: Initial creation with current coverage analysis and improvement plan
