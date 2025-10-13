# Migration Guide: v1.0.0 → v2.0.0

## Overview

Version 2.0.0 introduces **multi-board support** and **theme system** with breaking changes to the API structure. All endpoints now require explicit board context.

---

## Breaking Changes

### 1. Board-Scoped Operations

**All task operations now require a `boardId` parameter.**

**v1.x (Old)**:
```typescript
// Get all tasks for a user
GET /task/api?userType=friend&userId=alice

// Create task
POST /task/api
Body: { title: "Task", tag: "work" }
```

**v2.0 (New)**:
```typescript
// Get all boards and tasks for a user
GET /task/api/boards?userType=friend&userId=alice

// Get tasks for specific board
GET /task/api/tasks?userType=friend&userId=alice&boardId=main

// Create task on specific board
POST /task/api
Body: { title: "Task", tag: "work", boardId: "main" }
```

### 2. New Endpoints

**Board Management**:
- `GET /task/api/boards` - Get all boards and their tasks
- `POST /task/api/boards` - Create new board
- `DELETE /task/api/boards/:boardId` - Delete board

**Tag Management**:
- `POST /task/api/tags` - Create persisted tag on board
- `DELETE /task/api/tags` - Delete tag from board

**Stats**:
- `GET /task/api/stats?boardId=main` - Now requires boardId parameter

### 3. Client Changes

**Frontend now includes theme picker** with 7 themes. No API changes, purely visual.

---

## Complete API Reference (v2.0)

### Authentication Headers

All non-public requests must include:
```
X-User-Type: friend | admin
X-User-Id: <userId>
```

### Endpoints

#### 1. Get All Boards
**GET** `/task/api/boards?userType={userType}&userId={userId}`

Returns all boards with their tasks and metadata.

**Response**:
```json
{
  "version": 1,
  "boards": [
    { "id": "main", "name": "main", "tags": ["work", "home"] },
    { "id": "project-x", "name": "Project X", "tags": ["design"] }
  ],
  "tasks": {
    "main": [
      { "id": "01HXXX", "title": "Task 1", "boardId": "main", ... }
    ],
    "project-x": [
      { "id": "01HYYY", "title": "Task 2", "boardId": "project-x", ... }
    ]
  },
  "updatedAt": "2025-10-12T10:00:00.000Z"
}
```

#### 2. Get Tasks for Board
**GET** `/task/api/tasks?userType={userType}&userId={userId}&boardId={boardId}`

Returns tasks for a specific board.

**Response**:
```json
{
  "version": 1,
  "tasks": [
    {
      "id": "01HXXX",
      "title": "Task title",
      "tag": "work",
      "boardId": "main",
      "createdAt": "2025-10-12T10:00:00.000Z",
      "updatedAt": "2025-10-12T10:00:00.000Z"
    }
  ],
  "updatedAt": "2025-10-12T10:00:00.000Z"
}
```

#### 3. Get Stats
**GET** `/task/api/stats?userType={userType}&userId={userId}&boardId={boardId}`

Returns statistics for a specific board.

**Response**:
```json
{
  "version": 2,
  "counters": {
    "created": 10,
    "completed": 5,
    "deleted": 2,
    "updated": 8
  },
  "timeline": [
    { "t": "2025-10-12T10:00:00.000Z", "event": "created", "id": "01HXXX" }
  ],
  "tasks": {
    "01HXXX": { "id": "01HXXX", "title": "Task", ... }
  },
  "updatedAt": "2025-10-12T10:00:00.000Z"
}
```

#### 4. Create Task
**POST** `/task/api`

**Headers**: `X-User-Type`, `X-User-Id`, `Content-Type: application/json`

**Body**:
```json
{
  "title": "Task title",
  "tag": "work",
  "boardId": "main"
}
```

**Response**: Created task object

#### 5. Update Task
**PATCH** `/task/api/:taskId`

**Headers**: `X-User-Type`, `X-User-Id`, `Content-Type: application/json`

**Body**:
```json
{
  "title": "Updated title",
  "tag": "home",
  "boardId": "main"
}
```

**Response**: Updated task object

#### 6. Complete Task
**POST** `/task/api/:taskId/complete`

**Headers**: `X-User-Type`, `X-User-Id`, `Content-Type: application/json`

**Body**:
```json
{
  "boardId": "main"
}
```

**Response**: Completed task object (with `closedAt` timestamp)

#### 7. Delete Task
**DELETE** `/task/api/:taskId`

**Headers**: `X-User-Type`, `X-User-Id`, `Content-Type: application/json`

**Body**:
```json
{
  "boardId": "main"
}
```

**Response**: `204 No Content`

#### 8. Create Board
**POST** `/task/api/boards`

**Headers**: `X-User-Type`, `X-User-Id`, `Content-Type: application/json`

**Body**:
```json
{
  "boardId": "project-alpha"
}
```

**Response**:
```json
{
  "id": "project-alpha",
  "name": "project-alpha",
  "tags": []
}
```

#### 9. Delete Board
**DELETE** `/task/api/boards/:boardId`

**Headers**: `X-User-Type`, `X-User-Id`

**Response**: `204 No Content`

#### 10. Create Tag
**POST** `/task/api/tags`

**Headers**: `X-User-Type`, `X-User-Id`, `Content-Type: application/json`

**Body**:
```json
{
  "boardId": "main",
  "tag": "urgent"
}
```

**Response**: Updated board object with new tag

#### 11. Delete Tag
**DELETE** `/task/api/tags`

**Headers**: `X-User-Type`, `X-User-Id`, `Content-Type: application/json`

**Body**:
```json
{
  "boardId": "main",
  "tag": "urgent"
}
```

**Response**: Updated board object without deleted tag

---

## Storage Changes

### File Structure

**v1.x**:
```
task/data/
├── friend/
│   ├── tasks.json
│   └── stats.json
└── admin/
    ├── tasks.json
    └── stats.json
```

**v2.0**:
```
task/data/
├── friend/
│   ├── boards.json          # NEW: Board definitions
│   ├── main/
│   │   ├── tasks.json       # Board-scoped tasks
│   │   └── stats.json       # Board-scoped stats
│   └── project-x/
│       ├── tasks.json
│       └── stats.json
└── admin/
    ├── boards.json
    ├── main/
    │   ├── tasks.json
    │   └── stats.json
    └── ...
```

### boards.json Format
```json
{
  "version": 1,
  "boards": [
    { "id": "main", "name": "main", "tags": ["work", "home"] },
    { "id": "project-x", "name": "Project X", "tags": ["design"] }
  ],
  "updatedAt": "2025-10-12T10:00:00.000Z"
}
```

### tasks.json Format (unchanged structure, now board-scoped)
```json
{
  "version": 1,
  "tasks": [
    {
      "id": "01HXXX",
      "title": "Task",
      "tag": "work",
      "boardId": "main",
      "createdAt": "2025-10-12T10:00:00.000Z",
      "updatedAt": "2025-10-12T10:00:00.000Z"
    }
  ],
  "updatedAt": "2025-10-12T10:00:00.000Z"
}
```

---

## Migration Steps

### For Cloudflare Workers (KV)

1. **Update Storage Implementation**:

```typescript
import { TaskHandlers, TaskStorage } from '@wolffm/task@2.0.0/api'

const storage: TaskStorage = {
  // NEW: Board operations
  async getBoards(userType: string, userId?: string) {
    const key = `boards:${userType}:${userId || 'default'}`
    const data = await env.TASK_KV.get(key, 'json')
    return data || { version: 1, boards: [{ id: 'main', name: 'main', tags: [] }], updatedAt: new Date().toISOString() }
  },
  
  async saveBoards(userType: string, userId: string | undefined, boards: BoardsFile) {
    const key = `boards:${userType}:${userId || 'default'}`
    await env.TASK_KV.put(key, JSON.stringify(boards))
  },
  
  // UPDATED: Tasks now board-scoped
  async getTasks(userType: string, userId: string | undefined, boardId: string) {
    const key = `tasks:${userType}:${userId || 'default'}:${boardId}`
    const data = await env.TASK_KV.get(key, 'json')
    return data || { version: 1, tasks: [], updatedAt: new Date().toISOString() }
  },
  
  async saveTasks(userType: string, userId: string | undefined, boardId: string, tasks: TasksFile) {
    const key = `tasks:${userType}:${userId || 'default'}:${boardId}`
    await env.TASK_KV.put(key, JSON.stringify(tasks))
  },
  
  // UPDATED: Stats now board-scoped
  async getStats(userType: string, userId: string | undefined, boardId: string) {
    const key = `stats:${userType}:${userId || 'default'}:${boardId}`
    const data = await env.TASK_KV.get(key, 'json')
    return data || { version: 2, counters: { created: 0, completed: 0, deleted: 0, updated: 0 }, timeline: [], tasks: {}, updatedAt: new Date().toISOString() }
  },
  
  async saveStats(userType: string, userId: string | undefined, boardId: string, stats: StatsFile) {
    const key = `stats:${userType}:${userId || 'default'}:${boardId}`
    await env.TASK_KV.put(key, JSON.stringify(stats))
  }
}
```

2. **Update Route Handlers**:

```typescript
import { Hono } from 'hono'

const app = new Hono()

// Get all boards
app.get('/task/api/boards', async (c) => {
  const userType = c.req.query('userType') || 'public'
  const userId = c.req.query('userId')
  
  const result = await TaskHandlers.getBoards(storage, { userType, userId })
  return c.json(result)
})

// Get tasks for board
app.get('/task/api/tasks', async (c) => {
  const userType = c.req.query('userType') || 'public'
  const userId = c.req.query('userId')
  const boardId = c.req.query('boardId') || 'main'
  
  const result = await TaskHandlers.getTasks(storage, { userType, userId }, boardId)
  return c.json(result)
})

// Create task (with boardId in body)
app.post('/task/api', async (c) => {
  const userType = c.req.header('X-User-Type') || 'public'
  const userId = c.req.header('X-User-Id')
  const body = await c.req.json()
  const { boardId = 'main', ...input } = body
  
  const result = await TaskHandlers.createTask(storage, { userType, userId }, input, boardId)
  return c.json(result)
})

// Complete task (with boardId in body)
app.post('/task/api/:taskId/complete', async (c) => {
  const userType = c.req.header('X-User-Type') || 'public'
  const userId = c.req.header('X-User-Id')
  const taskId = c.req.param('taskId')
  const body = await c.req.json()
  const boardId = body.boardId || 'main'
  
  const result = await TaskHandlers.completeTask(storage, { userType, userId }, taskId, boardId)
  return c.json(result)
})

// Create board
app.post('/task/api/boards', async (c) => {
  const userType = c.req.header('X-User-Type') || 'public'
  const userId = c.req.header('X-User-Id')
  const { boardId } = await c.req.json()
  
  const result = await TaskHandlers.createBoard(storage, { userType, userId }, boardId)
  return c.json(result)
})

// Additional endpoints following same pattern...
```

### For Self-Hosted (Filesystem)

The included filesystem storage implementation has been updated automatically. Just update the package:

```bash
npm install @wolffm/task@2.0.0
```

---

## Frontend Changes

### Client Bundle

**v1.x**:
- Bundle: ~21KB
- CSS: ~9KB
- Features: Basic task management

**v2.0**:
- Bundle: ~21KB (unchanged)
- CSS: ~11KB (includes 7 themes)
- Features: Multi-board + theme picker

### Integration

No changes to mount API:

```javascript
import { mount } from '/mf/task/index.js'

mount(document.getElementById('app'), {
  apiUrl: '/task/api',
  userType: 'friend',
  userId: 'alice'
})
```

The client automatically handles multi-board operations.

---

## Testing Checklist

- [ ] Update storage implementation with board-scoped methods
- [ ] Update all route handlers to extract `boardId` from body/query
- [ ] Test `GET /task/api/boards` - Should return all boards and tasks
- [ ] Test `POST /task/api/boards` - Should create new board
- [ ] Test `GET /task/api/tasks?boardId=main` - Should return board tasks
- [ ] Test `POST /task/api` with `boardId` in body - Should create task on board
- [ ] Test `POST /task/api/:id/complete` with `boardId` - Should complete task
- [ ] Test `DELETE /task/api/:id` with `boardId` - Should delete task
- [ ] Test theme picker in frontend - Should switch between 7 themes
- [ ] Verify localStorage + background sync still works for non-public users

---

## Rollback Plan

If issues arise, you can rollback to v1.0.0:

```bash
npm install @wolffm/task@1.0.0
```

Then restore v1.x route handlers (single-board, no boardId parameter).

---

## Support

For issues or questions:
- GitHub: https://github.com/WolffM/hadoku-task/issues
- Docs: https://github.com/WolffM/hadoku-task/blob/main/README.md
