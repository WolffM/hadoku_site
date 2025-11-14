# Types Needed from @wolffm/task Package

This document tracks all types that need to be imported from the `@wolffm/task` package to eliminate the remaining `any` type warnings.

## Warning Summary (as of latest commit)

- **Total warnings:** 256
- **`any` type warnings:** 158 (62% of total)
- **Non-null assertion warnings:** 95 (37% of total)
- **Other warnings:** 3 (unavoidable - ReadableStream processing)

## All 61 Tests Passing ✅

## Required Type Imports from @wolffm/task

### Core Entity Types

#### Task Types

```typescript
Task - The main task interface with all properties
TaskState - 'Active' | 'Completed' | 'Deleted'
TaskPriority - Task priority levels (if used)
```

#### Board Types

```typescript
Board - The main board interface
BoardWithTasks - Board with tasks array included
BoardSummary - Lightweight board info (if exists)
```

#### Tag Types

```typescript
Tag - Tag interface
TagOperation - For batch tag operations
```

### API Response Types

#### CRUD Operation Responses

```typescript
TaskResponse - Response from task creation/update
BoardResponse - Response from board creation/update
DeleteResponse - Response from delete operations
MoveTaskResponse - Response from task movement
```

#### Batch Operation Responses

```typescript
BatchOperationResponse - Response for batch operations
BatchTagUpdateResponse - Specific to batch tag updates
BatchResult - Individual operation result in batch
```

#### List/Query Responses

```typescript
BoardListResponse - Response with boards array
TaskListResponse - Response with tasks array (if exists)
```

### Storage/State Types

```typescript
TaskStorage - Storage interface (if exported)
BoardState - Board state representation
TaskMetadata - Task metadata fields
```

## Files Requiring External Types

### Test Files (High Priority)

1. **test-utils.ts** (~30 `any` types)
   - Helper functions return `Task`, `Board`, `TaskResponse`, `BoardResponse`
   - Need proper return types for all CRUD helpers

2. **tasks.test.ts** (~25 `any` types)
   - Task creation, update, deletion responses
   - Board list responses with tasks

3. **tag-lifecycle.test.ts** (~20 `any` types)
   - Tag operations
   - Task state transitions

4. **batch.test.ts** (~15 `any` types)
   - Batch operation responses
   - Multiple task/board operations

5. **storage-format.test.ts** (~15 `any` types)
   - KV storage structure validation
   - Board and task data formats

6. **session-kv.test.ts** (~12 `any` types)
   - Already has session types imported
   - Needs board/task types for verification

7. **data-isolation.test.ts** (~10 `any` types)
   - Cross-user data validation
   - Board and task list responses

8. **movement.test.ts** (~8 `any` types)
   - Task movement between boards
   - Board state after moves

9. **idempotency.test.ts** (~8 `any` types)
   - Duplicate operation handling
   - Board and tag creation responses

10. **routing.test.ts** (~5 `any` types)
    - Batch tag operations
    - Board list responses

11. **preferences.test.ts** (~3 `any` types)
    - Mostly using `UserPreferences` already imported

12. **auth.test.ts** (~2 `any` types)
    - Minimal - mostly authentication testing

### Production Files (Lower Priority)

- **request-utils.ts** (~5 `any` types) - Helper function parameters
- **throttle.ts** (~2 `any` types) - Incident record details

## Non-Type Warnings (3 total - UNAVOIDABLE)

1. **test-utils.ts:35** - `await` in while loop
   - **Reason:** Reading ReadableStream must be sequential
   - **Cannot fix:** This is the correct way to read streams

2. **session.ts:167, 179** - False positives
   - **Reason:** Linter detecting interface definitions, not actual loops
   - **Cannot fix:** No actual code issue

## Recommended Action Plan

1. ✅ **DONE:** Fix all non-type warnings where possible
2. ✅ **DONE:** Organize types needed by priority
3. **TODO:** Import types from `@wolffm/task` package
4. **TODO:** Update test-utils.ts helper functions with proper return types
5. **TODO:** Update all test files to use imported types
6. **TODO:** Consider creating local type definitions if imports are not available

## Notes

- Most `any` types are in test files where they're used for API response validation
- Production code has very few `any` types (mostly in request-utils.ts)
- The non-null assertion warnings (95) are mostly in tests and are generally safe
- Consider adding eslint rule exceptions for unavoidable cases (ReadableStream processing)

### Task Types

- `Task` - The main task interface
- `TaskState` - 'Active' | 'Completed' | 'Deleted'
- `TaskPriority` - Task priority levels

### Board Types

- `Board` - The main board interface
- `BoardWithTasks` - Board with tasks array

### Tag Types

- `Tag` - Tag interface

### API Response Types

- `TaskResponse` - Response when creating/updating a task
- `BoardResponse` - Response when creating/updating a board
- `BatchOperationResponse` - Response for batch operations

## Files That Need These Types

- `test-utils.ts` - Helper functions return these types
- `tasks.test.ts` - Task creation and manipulation
- `tag-lifecycle.test.ts` - Tag operations
- `throttle.test.ts` - Rate limiting tests
- `storage-format.test.ts` - KV storage tests
- `batch.test.ts` - Batch operations
- `routing.test.ts` - Route tests
- `data-isolation.test.ts` - Isolation tests

## Notes

These types are currently defined in the `@wolffm/task` package and should be imported rather than using `any` or inline types.
