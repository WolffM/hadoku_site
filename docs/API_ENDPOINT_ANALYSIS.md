# API Endpoint Analysis - October 15, 2025

## Executive Summary

After deployment and live testing, we have **6 broken features** and **partial functionality** for board moves. The root causes are:

1. **Client-Worker endpoint mismatches** - Client calls legacy endpoints that don't exist
2. **Missing endpoint aliases** - Worker needs backward compatibility routes
3. **Local storage sync issues** - Client package needs fixes (not in our scope)

## Wrangler Logs Analysis

### ✅ Working Endpoints (Confirmed in Logs)

| Endpoint | Method | Purpose | Log Evidence |
|----------|--------|---------|--------------|
| `/task/api` | POST | Create task | ✅ Multiple successful calls |
| `/task/api/{id}` | DELETE | Delete task | ✅ Successful deletions logged |
| `/task/api/{id}` | PATCH | Update task | ✅ Successful updates logged |
| `/task/api/boards` | GET | List boards | ✅ Multiple successful calls |
| `/task/api/boards` | POST | Create board | ✅ Board creation logged |
| `/task/api/boards/{id}` | DELETE | Delete board | ✅ Board deletion logged |
| `/task/api/tags` | POST | Create tag | ✅ Tag creation logged |
| `/task/api/preferences` | PUT | Save preferences | ✅ Multiple successful calls |
| `/task/api/batch-move` | POST | Batch move tasks | ✅ Our alias works! |

### ❌ Broken Endpoints

#### 1. Batch Update Tags (Single/Multi Tag Drag)

**Client calls**: `PATCH /task/api/batch-tag`  
**Worker expects**: `POST /task/api/boards/{boardId}/tasks/batch/update-tags`

**Log evidence**:
```
PATCH https://task-api.jamescannon4237-cfd.workers.dev/task/api/batch-tag - Ok
  (log) [PATCH /task/api/batch-tag] { userType: 'admin', boardId: 'main', taskId: 'batch-tag' }
  (error) Error: Task not found
```

**Issue**: 
- Worker treats `batch-tag` as a task ID and tries to update a non-existent task
- Endpoint doesn't exist, so request fails with "Task not found"
- Edge-router returns 502 when proxying

**Fix needed**: Add alias route in worker

#### 2. Complete Task Button

**Client should call**: `POST /task/api/{id}/complete`  
**Observation**: **NO LOG ENTRIES AT ALL**

**User report**:
> "shows: Task not found after completion. If we try to click it again: Task not found. Refresh shows that now api changes actually happened."

**Issue**:
- Request never reaches worker (no logs)
- Client might not be making the request
- OR edge-router is blocking/dropping the request
- OR client is using wrong endpoint

**Fix needed**: Investigate client code to see what endpoint it's calling

#### 3. Delete Tag Button

**Client should call**: `DELETE /task/api/tags`  
**Observation**: **NO LOG ENTRIES AT ALL**

**User report**:
> "does absolutely nothing. No failed request, not response, no console log, nothing."

**Issue**:
- Request never reaches worker (no logs)
- Client likely not making any API call at all
- This is a client-side bug, not a worker issue

**Fix needed**: Client package needs to implement deleteTag API call

## Client-Worker Endpoint Mapping Issues

### Current Mismatches

| Feature | Client Calls | Worker Has | Status |
|---------|-------------|------------|--------|
| Batch tag | `PATCH /task/api/batch-tag` | `POST /task/api/boards/:boardId/tasks/batch/update-tags` | ❌ Mismatch |
| Complete task | Unknown (not reaching API) | `POST /task/api/:id/complete` | ❌ Not called |
| Delete tag | Not called at all | `DELETE /task/api/tags` | ❌ Not called |
| Batch move | `POST /task/api/batch-move` | `POST /task/api/batch/move-tasks` | ✅ Fixed with alias |

## Recommended Fixes

### 1. Worker: Add Batch-Tag Alias (Our Responsibility)

Add alias route similar to batch-move:

```typescript
// Batch update tags (with legacy alias)
const batchUpdateTagsHandler = async (c: any) => {
	const boardId = c.req.param('boardId') || extractField(c, ['body:boardId', 'query:boardId'], 'main');
	
	logRequest('PATCH', '/task/api/batch-tag', { 
		userType: c.get('authContext').userType, 
		boardId 
	});
	
	return handleBatchOperation(
		c,
		['updates'],
		(storage, auth, body) => TaskHandlers.batchUpdateTags(storage, auth, { ...body, boardId }),
		(body, userType, userId) => [`${userType}:${userId}:${boardId}`]
	);
};

// Standard endpoint
app.post('/task/api/boards/:boardId/tasks/batch/update-tags', batchUpdateTagsHandler);

// Legacy alias for client compatibility
app.patch('/task/api/batch-tag', batchUpdateTagsHandler);
```

### 2. Client Package: Fix Complete Task (Hadoku-Task Team)

**Issue**: `completeTask()` method exists in client but isn't calling the API.

**Investigation needed**:
```javascript
// Find in @wolffm/task client code:
async completeTask(taskId, boardId) {
  // Should call: POST /task/api/${taskId}/complete
  // Currently: Not making any API call?
}
```

**Expected behavior**: After local storage update, should make background sync call to API

### 3. Client Package: Implement Delete Tag (Hadoku-Task Team)

**Issue**: `deleteTag()` method doesn't make any API call.

**Current code** (approximate):
```javascript
async deleteTag(tag, boardId) {
  // Updates local storage only
  // Missing: API call to DELETE /task/api/tags
}
```

**Should be**:
```javascript
async deleteTag(tag, boardId) {
  await localApi.deleteTag(tag, boardId);
  
  // Background sync
  fetch("/task/api/tags", {
    method: "DELETE",
    headers: headers(userType, userId, key),
    body: JSON.stringify({ boardId, tag })
  }).catch(err => console.error("[api] Failed to sync deleteTag:", err));
}
```

### 4. Client Package: Fix Local Storage Sync (Hadoku-Task Team)

**Issues**:
- Multi-task board move succeeds in API but doesn't update local storage
- Single task move requires refresh to see changes
- Complete button causes "Task not found" even though API succeeds

**Pattern**: API calls succeed, but client doesn't refresh local data after async background sync completes.

**Fix**: After background sync completes successfully, trigger a local data reload:

```javascript
async batchMoveTasks(sourceBoardId, targetBoardId, taskIds) {
  // ... make API call ...
  
  .then(async () => {
    console.log("[api] Background sync: batchMoveTasks completed");
    // Reload data from API to sync with server state
    await this.getBoards();  // Refresh all boards
  })
}
```

## Testing Checklist

After deploying worker alias fix:

- [ ] **Single tag drag** - Drag one task to a tag
- [ ] **Multi tag drag** - Select multiple tasks, drag to tag
- [ ] **Complete button** - Click complete on a task
- [ ] **Delete tag** - Click X on a tag to delete it
- [ ] **Single board move** - Drag one task to different board (should update immediately)
- [ ] **Multi board move** - Select multiple tasks, move to different board (should update immediately)

## Instructions for Hadoku-Task Team

### Issue 1: completeTask Not Calling API

**Location**: `@wolffm/task` client API wrapper (api.ts or similar)

**Problem**: The `completeTask()` method updates local storage but doesn't make background sync call to `/task/api/{id}/complete`.

**Verification**:
```bash
# In @wolffm/task repo
grep -r "completeTask" src/
# Check if it calls fetch() after local update
```

**Fix**: Add background sync call after local storage update.

### Issue 2: deleteTag Not Calling API

**Location**: `@wolffm/task` client API wrapper

**Problem**: The `deleteTag()` method doesn't make any API call to `DELETE /task/api/tags`.

**Verification**:
```bash
# Check if deleteTag makes any fetch() call
grep -A 10 "async deleteTag" src/
```

**Fix**: Implement API call using same pattern as `createTag()`.

### Issue 3: Local Storage Not Syncing After Background Operations

**Location**: Background sync promise handlers in API wrapper

**Problem**: After successful API calls, local storage isn't updated with server state.

**Fix Pattern**:
```typescript
// After any mutation (create, update, delete, move):
.then(async (response) => {
  console.log("[api] Background sync completed");
  // Trigger refresh from API
  await this.reloadBoardData();
})
```

### Issue 4: Batch Tag Endpoint Mismatch

**Location**: Client batchUpdateTags method

**Current**: Calls `PATCH /task/api/batch-tag`  
**Should call**: `PATCH /task/api/batch-tag` (we're adding worker alias)

**Status**: **No client changes needed** - we're fixing this on worker side.

## Summary

**Worker fixes** (our responsibility):
- ✅ Add `/task/api/batch-move` alias - **DONE**
- ⏳ Add `/task/api/batch-tag` alias - **IN PROGRESS**

**Client fixes** (hadoku-task team):
- ❌ Fix `completeTask()` to call API
- ❌ Fix `deleteTag()` to call API
- ❌ Fix local storage sync after background operations

**Total broken features**: 6
**Fixed so far**: 1 (batch-move)
**Remaining**: 5 (2 worker, 3 client)
