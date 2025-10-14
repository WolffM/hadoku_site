# Parent API Expectations

**Concise requirements for child packages to integrate with parent API workers**

---

## Package Export Structure

### Required Exports

```typescript
// From @wolffm/{app-name}/api

// 1. Handlers object with pure functions
export const AppHandlers = {
  handlerName: (storage: AppStorage, auth: AuthContext, ...args) => Promise<ReturnType>
}

// 2. Storage interface
export interface AppStorage {
  getFile<T>(path: string): Promise<T>
  saveFile(path: string, data: unknown): Promise<void>
}

// 3. Auth context
export interface AuthContext {
  userType: 'admin' | 'friend' | 'public'
}

// 4. Data types
export interface AppDataType { /* ... */ }
```

---

## Handler Signature Rules

### Standard Pattern

```typescript
type Handler<T> = (
  storage: AppStorage,    // Always first parameter
  auth: AuthContext,      // Always second parameter
  ...args: any[]          // Request-specific parameters
) => Promise<T>
```

### Examples

```typescript
// List items
getItems: (storage, auth) => Promise<Item[]>

// Get single item
getItem: (storage, auth, id: string) => Promise<Item>

// Create item
createItem: (storage, auth, data: Partial<Item>) => Promise<Item>

// Update item
updateItem: (storage, auth, id: string, data: Partial<Item>) => Promise<Item>

// Delete item
deleteItem: (storage, auth, id: string) => Promise<void>

// Batch operation
batchUpdate: (storage, auth, ids: string[], changes: Partial<Item>) => Promise<Item[]>
```

---

## Return Values

### Success Cases

| Operation | Return Type | HTTP Status |
|-----------|-------------|-------------|
| List/Query | `T[]` | 200 |
| Get single | `T` | 200 |
| Create | `T` | 201 |
| Update | `T` | 200 |
| Delete | `void` | 204 |
| Partial success | `{ success: T[], failed: Error[] }` | 207 |

### Not Found Cases

**Return `null` or `undefined`:**
```typescript
getItem: async (storage, auth, id) => {
  const items = await storage.getFile('items.json')
  return items.find(i => i.id === id) ?? null  // Returns null if not found
}
```

**Parent converts to 404:**
```typescript
app.get('/item/:id', async (c) => {
  const item = await AppHandlers.getItem(storage, auth, id)
  if (!item) return c.json({ error: 'Not found' }, 404)
  return c.json(item)
})
```

### Error Cases

**Throw errors for exceptional conditions:**
```typescript
createItem: async (storage, auth, data) => {
  if (auth.userType === 'public') {
    throw new Error('Unauthorized')  // Parent converts to 401
  }
  
  if (!data.title) {
    throw new Error('Title required')  // Parent converts to 400
  }
  
  // ... create item
}
```

**Parent HTTP mapping:**
```typescript
try {
  const result = await handler(storage, auth, ...args)
  return c.json(result, successCode)
} catch (error) {
  const status = mapErrorToStatus(error)
  return c.json({ error: error.message }, status)
}

function mapErrorToStatus(error: Error): number {
  const msg = error.message.toLowerCase()
  if (msg.includes('unauthorized') || msg.includes('forbidden')) return 401
  if (msg.includes('not found')) return 404
  if (msg.includes('required') || msg.includes('invalid')) return 400
  if (msg.includes('conflict') || msg.includes('already exists')) return 409
  return 500
}
```

---

## Storage Interface Implementation

### Parent Provides

```typescript
const storage: AppStorage = {
  getFile: async <T>(path: string): Promise<T> => {
    // 1. Fetch from GitHub repo
    const { data } = await octokit.repos.getContent({
      owner: 'WolffM',
      repo: 'hadoku_site',
      path
    })
    
    // 2. Decode and parse
    const content = Buffer.from(data.content, 'base64').toString()
    return JSON.parse(content)
  },
  
  saveFile: async (path: string, data: unknown): Promise<void> => {
    // 1. Get current SHA
    const { data: existing } = await octokit.repos.getContent({ path })
    
    // 2. Commit new content
    await octokit.repos.createOrUpdateFileContents({
      owner: 'WolffM',
      repo: 'hadoku_site',
      path,
      message: `Update ${path}`,
      content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
      sha: existing.sha
    })
  }
}
```

### Child Expectations

- `getFile()` throws if file doesn't exist
- `saveFile()` creates or updates file atomically
- JSON serialization handled by parent
- Paths relative to repo root

---

## Auth Context Implementation

### Parent Provides

```typescript
// Middleware extracts userType
app.use('/api/*', async (c, next) => {
  const key = c.req.header('X-Admin-Key')
  
  if (key === c.env.ADMIN_KEY) {
    c.set('userType', 'admin')
  } else if (key === c.env.FRIEND_KEY) {
    c.set('userType', 'friend')
  } else {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  await next()
})

// Route handler creates context
app.get('/items', async (c) => {
  const auth: AuthContext = {
    userType: c.get('userType')
  }
  
  const items = await AppHandlers.getItems(storage, auth)
  return c.json(items)
})
```

### Child Expectations

- `auth.userType` is always present
- Already authenticated (no need to validate)
- Implement permission checks based on userType

---

## Parameter Extraction

### Parent Extracts from Request

```typescript
// Path parameters
const id = c.req.param('id')

// Query parameters
const page = c.req.query('page')
const limit = c.req.query('limit')

// Body (JSON)
const body = await c.req.json()

// Headers
const contentType = c.req.header('content-type')
```

### Child Receives as Arguments

```typescript
// Parent route
app.get('/items/:id', async (c) => {
  const id = c.req.param('id')
  const item = await AppHandlers.getItem(storage, auth, id)
  return c.json(item)
})

app.post('/items', async (c) => {
  const data = await c.req.json()
  const item = await AppHandlers.createItem(storage, auth, data)
  return c.json(item, 201)
})

app.get('/items', async (c) => {
  const page = parseInt(c.req.query('page') ?? '1')
  const limit = parseInt(c.req.query('limit') ?? '10')
  const items = await AppHandlers.listItems(storage, auth, { page, limit })
  return c.json(items)
})
```

---

## Validation

### Child Validates Input

```typescript
createItem: async (storage, auth, data) => {
  // Required fields
  if (!data.title) throw new Error('Title is required')
  if (!data.content) throw new Error('Content is required')
  
  // Type validation
  if (typeof data.title !== 'string') throw new Error('Title must be a string')
  
  // Length constraints
  if (data.title.length > 100) throw new Error('Title must be ≤100 characters')
  
  // Enum validation
  if (data.status && !['draft', 'published'].includes(data.status)) {
    throw new Error('Invalid status')
  }
  
  // ... proceed with creation
}
```

### Parent Catches Validation Errors

```typescript
app.post('/items', async (c) => {
  try {
    const data = await c.req.json()
    const item = await AppHandlers.createItem(storage, auth, data)
    return c.json(item, 201)
  } catch (error) {
    // Validation errors become 400
    if (error.message.includes('required') || error.message.includes('invalid')) {
      return c.json({ error: error.message }, 400)
    }
    throw error
  }
})
```

---

## Common Patterns

### List with Pagination

```typescript
// Child handler
listItems: async (storage, auth, options?: { page?: number; limit?: number }) => {
  const { page = 1, limit = 10 } = options ?? {}
  const items = await storage.getFile('items.json')
  
  const start = (page - 1) * limit
  const end = start + limit
  
  return {
    items: items.slice(start, end),
    total: items.length,
    page,
    limit
  }
}

// Parent route
app.get('/items', async (c) => {
  const page = parseInt(c.req.query('page') ?? '1')
  const limit = parseInt(c.req.query('limit') ?? '10')
  const result = await AppHandlers.listItems(storage, auth, { page, limit })
  return c.json(result)
})
```

### Create with ID Generation

```typescript
// Child handler
createItem: async (storage, auth, data) => {
  const newItem = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data
  }
  
  const items = await storage.getFile('items.json')
  items.push(newItem)
  await storage.saveFile('items.json', items)
  
  return newItem
}

// Parent route
app.post('/items', async (c) => {
  const data = await c.req.json()
  const item = await AppHandlers.createItem(storage, auth, data)
  return c.json(item, 201)
})
```

### Update with Merge

```typescript
// Child handler
updateItem: async (storage, auth, id, changes) => {
  const items = await storage.getFile('items.json')
  const index = items.findIndex(i => i.id === id)
  
  if (index === -1) return null
  
  items[index] = {
    ...items[index],
    ...changes,
    updatedAt: new Date().toISOString()
  }
  
  await storage.saveFile('items.json', items)
  return items[index]
}

// Parent route
app.patch('/items/:id', async (c) => {
  const id = c.req.param('id')
  const changes = await c.req.json()
  const item = await AppHandlers.updateItem(storage, auth, id, changes)
  
  if (!item) return c.json({ error: 'Not found' }, 404)
  return c.json(item)
})
```

### Delete with Confirmation

```typescript
// Child handler
deleteItem: async (storage, auth, id) => {
  const items = await storage.getFile('items.json')
  const filtered = items.filter(i => i.id !== id)
  
  if (filtered.length === items.length) {
    return null  // Item not found
  }
  
  await storage.saveFile('items.json', filtered)
}

// Parent route
app.delete('/items/:id', async (c) => {
  const id = c.req.param('id')
  const result = await AppHandlers.deleteItem(storage, auth, id)
  
  if (result === null) return c.json({ error: 'Not found' }, 404)
  return c.body(null, 204)
})
```

---

## HTTP Status Code Reference

| Status | Use Case | Example |
|--------|----------|---------|
| 200 | Successful GET, PUT, PATCH | Return item/list |
| 201 | Successful POST (created) | Created new item |
| 204 | Successful DELETE | Deleted item |
| 400 | Validation error | Missing required field |
| 401 | Auth error | Invalid API key |
| 403 | Permission denied | Wrong userType |
| 404 | Resource not found | Item doesn't exist |
| 409 | Conflict | Duplicate ID |
| 500 | Server error | Unexpected exception |

---

## Response Format Standards

### Success Response

```typescript
// Single item
{ id: '123', title: 'Item', ... }

// List
[{ id: '1', ... }, { id: '2', ... }]

// Paginated list
{
  items: [{ id: '1', ... }],
  total: 100,
  page: 1,
  limit: 10
}

// No content (204)
null
```

### Error Response

```typescript
{
  error: 'Human-readable error message'
}

// With validation details
{
  error: 'Validation failed',
  details: [
    { field: 'title', message: 'Title is required' },
    { field: 'status', message: 'Invalid status value' }
  ]
}
```

---

## Summary Checklist

### Child Package Must Export

- [ ] `AppHandlers` object with pure functions
- [ ] `AppStorage` interface
- [ ] `AuthContext` interface
- [ ] Data type interfaces

### Handler Requirements

- [ ] First parameter: `storage: AppStorage`
- [ ] Second parameter: `auth: AuthContext`
- [ ] Additional parameters: request-specific data
- [ ] Return type: `Promise<T>`
- [ ] Return `null/undefined` for not found
- [ ] Throw `Error` for exceptional cases
- [ ] Validate input and throw descriptive errors

### Parent Responsibilities

- [ ] Implement `AppStorage` interface
- [ ] Create `AuthContext` from request
- [ ] Extract parameters from request
- [ ] Call handlers with correct arguments
- [ ] Map return values to HTTP responses
- [ ] Map errors to HTTP status codes
- [ ] Handle CORS, logging, and metrics

---

**Version**: 1.0.0  
**Last Updated**: January 2025
