# API Endpoint Issues - October 15, 2025

## Problem Summary

Multiple API endpoints are returning 500 errors from the worker, while others work fine. The pattern suggests package version mismatches between `@wolffm/task` v3.0.14 and the worker adapter.

## Broken Endpoints

### 1. Batch Move Tasks
- **Client calls**: `POST /task/api/batch-move`
- **Worker has**: `POST /task/api/batch/move-tasks`
- **Status**: ❌ 404 (endpoint missing)
- **Fix**: Added alias route `POST /task/api/batch-move` → `batchMoveHandler`
- **Testing**: Needs deployment and verification

### 2. Complete Task
- **Client calls**: `POST /task/api/{id}/complete`
- **Worker endpoint**: Exists at line 359
- **Status**: ❌ 500 Internal Server Error
- **Error**: Likely `TaskHandlers.completeTask()` signature mismatch or method doesn't exist
- **Usage**: Single task completion (clicking complete button)
- **Impact**: Users cannot mark tasks as complete

### 3. Delete Tag
- **Client calls**: `DELETE /task/api/tags`
- **Worker endpoint**: Exists at line 440
- **Status**: ❌ 500 Internal Server Error
- **Error**: Likely `TaskHandlers.deleteTag()` doesn't exist in package
- **Usage**: Removing tags from boards
- **Impact**: Users cannot delete tags

## Working Endpoints

### Delete Task
- **Client calls**: `DELETE /task/api/{id}`
- **Worker endpoint**: Line 381
- **Status**: ✅ Works
- **Note**: This works, proving DELETE method itself is fine

### Batch Tag Update
- **Client calls**: `POST /task/api/boards/:boardId/tasks/batch/update-tags`
- **Status**: ✅ Works (user confirmed "Batch Tagging works!")
- **Note**: Proves batch operations can work

## Root Cause Analysis

The TypeScript errors in the worker show:

```typescript
Property 'completeTask' does not exist on type 'typeof TaskHandlers'
Property 'deleteTag' does not exist on type 'typeof TaskHandlers'
Property 'getBoards' does not exist on type 'typeof TaskHandlers'
Property 'createBoard' does not exist on type 'typeof TaskHandlers'
```

This indicates that `@wolffm/task` v3.0.14 package has either:
1. Removed these methods
2. Changed method signatures
3. Moved methods to different exports

## Recommended Fixes

### Option 1: Update Package (Preferred)
Update `@wolffm/task` package to export the missing methods:
- `TaskHandlers.completeTask(storage, auth, taskId, boardId)`
- `TaskHandlers.deleteTag(storage, auth, body)`
- Ensure `batchMoveTasks` exists and matches expected signature

### Option 2: Implement Fallbacks in Worker
Add fallback implementations in the worker adapter for missing methods:

```typescript
// Fallback for completeTask
if (!TaskHandlers.completeTask) {
  TaskHandlers.completeTask = async (storage, auth, id, boardId) => {
    const tasks = await storage.getTasks(auth.userType, auth.userId, boardId);
    const task = tasks.tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    task.completedAt = new Date().toISOString();
    await storage.saveTasks(auth.userType, auth.userId, boardId, tasks);
    return { ok: true };
  };
}
```

### Option 3: Client-Side Workarounds
Update client to use alternative endpoints that work:
- For `deleteTag`: Use batch clear-tag with empty taskIds
- For `completeTask`: Use `patchTask` with `completedAt` field

## Testing Checklist

- [ ] Test `POST /task/api/batch-move` after deployment
- [ ] Test `POST /task/api/{id}/complete` with valid task ID
- [ ] Test `DELETE /task/api/tags` with valid tag and boardId
- [ ] Verify single task drag still works
- [ ] Verify batch task drag works
- [ ] Verify tag deletion from UI

## Environment Details

- **Worker Package**: `@wolffm/task@^3.0.14`
- **Client Bundle**: `index.js?v=3.0.14`
- **Worker URL**: https://task-api.jamescannon4237-cfd.workers.dev
- **Edge Router**: https://hadoku.me (with session management)
- **Test Date**: October 15, 2025
