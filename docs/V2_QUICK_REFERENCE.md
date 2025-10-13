# v2.0 Quick Reference Card

## Version
**Package**: `@wolffm/task@2.0.0`

## Key Changes
✅ Multi-board support  
✅ Board-scoped tasks and stats  
✅ Tag persistence on boards  
✅ 7 theme system (frontend only)  
⚠️ **BREAKING**: All operations require `boardId` parameter

---

## API Quick Reference

### Get All Boards + Tasks
```http
GET /task/api/boards?userType=friend&userId=alice
```

### Get Board Tasks
```http
GET /task/api/tasks?userType=friend&userId=alice&boardId=main
```

### Create Task
```http
POST /task/api
X-User-Type: friend
X-User-Id: alice
Content-Type: application/json

{ "title": "Task", "tag": "work", "boardId": "main" }
```

### Update Task
```http
PATCH /task/api/{taskId}
X-User-Type: friend
X-User-Id: alice
Content-Type: application/json

{ "title": "Updated", "boardId": "main" }
```

### Complete Task
```http
POST /task/api/{taskId}/complete
X-User-Type: friend
X-User-Id: alice
Content-Type: application/json

{ "boardId": "main" }
```

### Delete Task
```http
DELETE /task/api/{taskId}
X-User-Type: friend
X-User-Id: alice
Content-Type: application/json

{ "boardId": "main" }
```

### Create Board
```http
POST /task/api/boards
X-User-Type: friend
X-User-Id: alice
Content-Type: application/json

{ "boardId": "project-alpha" }
```

### Delete Board
```http
DELETE /task/api/boards/{boardId}
X-User-Type: friend
X-User-Id: alice
```

### Create Tag
```http
POST /task/api/tags
X-User-Type: friend
X-User-Id: alice
Content-Type: application/json

{ "boardId": "main", "tag": "urgent" }
```

### Delete Tag
```http
DELETE /task/api/tags
X-User-Type: friend
X-User-Id: alice
Content-Type: application/json

{ "boardId": "main", "tag": "urgent" }
```

### Get Stats
```http
GET /task/api/stats?userType=friend&userId=alice&boardId=main
```

---

## Storage Interface (Updated)

```typescript
interface TaskStorage {
  // NEW: Board operations
  getBoards(userType: string, userId?: string): Promise<BoardsFile>
  saveBoards(userType: string, userId: string | undefined, boards: BoardsFile): Promise<void>
  
  // UPDATED: Now require boardId parameter
  getTasks(userType: string, userId: string | undefined, boardId: string): Promise<TasksFile>
  saveTasks(userType: string, userId: string | undefined, boardId: string, tasks: TasksFile): Promise<void>
  getStats(userType: string, userId: string | undefined, boardId: string): Promise<StatsFile>
  saveStats(userType: string, userId: string | undefined, boardId: string, stats: StatsFile): Promise<void>
}
```

---

## Handler Signatures (Updated)

```typescript
// NEW
TaskHandlers.getBoards(storage, auth): Promise<BoardsWithTasks>
TaskHandlers.createBoard(storage, auth, boardId): Promise<Board>
TaskHandlers.deleteBoard(storage, auth, boardId): Promise<void>
TaskHandlers.createTag(storage, auth, boardId, tag): Promise<Board>
TaskHandlers.deleteTag(storage, auth, boardId, tag): Promise<Board>

// UPDATED: Now require boardId parameter
TaskHandlers.getTasks(storage, auth, boardId): Promise<TasksFile>
TaskHandlers.createTask(storage, auth, input, boardId): Promise<Task>
TaskHandlers.updateTask(storage, auth, taskId, input, boardId): Promise<Task>
TaskHandlers.completeTask(storage, auth, taskId, boardId): Promise<Task>
TaskHandlers.deleteTask(storage, auth, taskId, boardId): Promise<void>
TaskHandlers.getStats(storage, auth, boardId): Promise<StatsFile>
```

---

## Data Structure Changes

### boards.json (NEW)
```json
{
  "version": 1,
  "boards": [
    { "id": "main", "name": "main", "tags": ["work"] }
  ],
  "updatedAt": "2025-10-12T10:00:00Z"
}
```

### File Structure
```
task/data/
├── {userType}/
│   ├── boards.json          ← NEW
│   ├── {boardId}/
│   │   ├── tasks.json       ← Board-scoped
│   │   └── stats.json       ← Board-scoped
```

---

## Migration Checklist

1. ✅ Update to `@wolffm/task@2.0.0`
2. ✅ Add `getBoards()` and `saveBoards()` to storage
3. ✅ Update `getTasks()`, `saveTasks()`, `getStats()`, `saveStats()` signatures with `boardId`
4. ✅ Update all route handlers to extract `boardId` from body/query
5. ✅ Test all endpoints with `boardId` parameter
6. ✅ Verify frontend theme picker works (no backend changes needed)

---

## Themes (Frontend Only)

7 themes available via theme picker:
- ☼ Light
- ☽ Dark  
- ❖ Strawberry
- ≈ Ocean
- ◆ Cyberpunk
- ◉ Coffee
- ✿ Lavender

No API changes needed for themes.

---

**Full Documentation**: See `MIGRATION_V2.md`
