# Types Needed from @wolffm/task Package

This file tracks the types we need to import from the `@wolffm/task` package to improve test type safety.

## Types to Import

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
