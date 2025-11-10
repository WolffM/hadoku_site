# Parent API Expectations

## Summary

This document defines the **Universal Adapter Pattern** used across all child packages. The parent application handles authentication, session management, and request routing, but contains **no business logic**. All business logic lives in child packages as pure handler functions. The parent acts as an adapter layer that:

- Creates and manages sessions (sessionId → API key mapping)
- Routes API requests through the edge router with authentication
- Provides storage interfaces and CORS handling
- Mounts/unmounts child frontends with standard props

Child packages export pure functions that receive typed contexts and return typed results. The parent wraps these handlers in HTTP/storage infrastructure.

---

**Requirements for child packages to integrate with parent API workers**

---

## Required Exports

Child package must export from `@wolffm/{app-name}/api`:

```typescript
// 1. Handlers object (pure functions)
export const AppHandlers = {
  handlerName: (storage, auth, ...args) => Promise<ReturnType>
}

// 2. Storage interface
export interface AppStorage {
  getFile<T>(path: string): Promise<T>
  saveFile(path: string, data: unknown): Promise<void>
}

// 3. Auth context
export interface AuthContext {
  userType: 'admin' | 'friend' | 'public'  // Permission level
  userId?: string                            // Data scoping identifier
}

// 4. Data types (app-specific)
export interface DataType { /* ... */ }
```

---

## Handler Signature

**Always:**
1. First parameter: `storage: AppStorage`
2. Second parameter: `auth: AuthContext`
3. Additional parameters: request-specific data
4. Return type: `Promise<T>`

```typescript
handlerName: (storage: AppStorage, auth: AuthContext, ...args) => Promise<T>
```

---

## Return Values & HTTP Status

### Success

| Return | HTTP Status | Example |
|--------|-------------|---------|
| `T[]` or `T` | 200 | Get/list items |
| `T` | 201 | Create item |
| `void` | 204 | Delete item |

### Not Found

Return `null` or `undefined` - parent converts to 404:
```typescript
const item = items.find(i => i.id === id) ?? null
```

### Errors

Throw `Error` - parent maps to HTTP status:
```typescript
if (!data.title) throw new Error('Title is required')  // → 400
if (auth.userType === 'public') throw new Error('Unauthorized')  // → 401
```

**Error mapping keywords:**
- `'unauthorized'` or `'forbidden'` → 401
- `'not found'` → 404
- `'required'` or `'invalid'` → 400
- `'conflict'` or `'already exists'` → 409
- Everything else → 500

---

## Storage Contract

**Child defines interface:**
```typescript
export interface AppStorage {
  getFile<T>(path: string): Promise<T>
  saveFile(path: string, data: unknown): Promise<void>
}
```

**Parent implements:**
- `getFile()` - Fetches and parses JSON
- `saveFile()` - Commits JSON atomically
- Throws if file doesn't exist
- Paths relative to repo root

---

## Auth Flow (Session-Based)

### 1. Page Load
Parent creates session from URL key:
```javascript
const sessionId = await fetch('/session/create', {
  method: 'POST',
  body: JSON.stringify({ key })
}).then(r => r.json())

mount(element, { userType, userId, sessionId })
```

### 2. Child Makes Request
Child sends sessionId (not key):
```javascript
fetch('/app/api/endpoint', {
  headers: { 'X-Session-Id': props.sessionId }
})
```

### 3. Edge Router Injects Key
Edge router resolves session → injects key:
```typescript
const key = await getKeyFromSession(sessionId)
request.headers.set('X-User-Key', key)
// Proxy to API worker
```

### 4. API Worker Authenticates
Parent validates key, creates AuthContext:
```typescript
// Middleware extracts userType from key
app.use('/api/*', createKeyAuth((env) => ({
  [env.ADMIN_KEY]: 'admin',
  [env.FRIEND_KEY]: 'friend'
})))

// Route creates auth context, calls handler
app.get('/endpoint', async (c) => {
  const { userId } = extractUserContext(c)
  const auth = { userType: c.get('userType'), userId }
  const result = await AppHandlers.handlerName(storage, auth)
  return c.json(result)
})
```

### 5. Child Handler Uses Auth
Handlers use auth for permissions and data scoping:
```typescript
handlerName: async (storage, auth) => {
  // Permission check
  if (auth.userType === 'public') throw new Error('Unauthorized')
  
  // Data scoping with userId
  const path = `data/${auth.userType}/${auth.userId}/file.json`
  return await storage.getFile(path)
}
```

**Security:** Child never sees the key. Parent validates key → creates auth context → passes to handler.

---

## Parameter Extraction

Parent extracts from request, passes to handler:

```typescript
// Path parameters
const id = c.req.param('id')

// Query parameters
const page = c.req.query('page')

// Body (JSON)
const data = await c.req.json()

// Pass to handler
const result = await AppHandlers.handlerName(storage, auth, id, data)
```

---

## Validation

**Child validates input:**
```typescript
handlerName: async (storage, auth, data) => {
  // Required fields
  if (!data.field) throw new Error('Field is required')
  
  // Type validation
  if (typeof data.field !== 'string') throw new Error('Field must be string')
  
  // Constraints
  if (data.field.length > 100) throw new Error('Field must be ≤100 chars')
  
  // ... proceed
}
```

**Parent catches errors:**
```typescript
try {
  const result = await AppHandlers.handlerName(storage, auth, data)
  return c.json(result, 201)
} catch (error) {
  if (error.message.includes('required')) {
    return c.json({ error: error.message }, 400)
  }
  throw error
}
```

---

## Common Patterns

### CRUD Operations

```typescript
export const AppHandlers = {
  // List all
  list: async (storage, auth) => {
    const data = await storage.getFile('data.json')
    return data.items
  },
  
  // Get single (return null if not found)
  get: async (storage, auth, id) => {
    const data = await storage.getFile('data.json')
    return data.items.find(i => i.id === id) ?? null
  },
  
  // Create (generate ID)
  create: async (storage, auth, input) => {
    const item = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...input }
    const data = await storage.getFile('data.json')
    data.items.push(item)
    await storage.saveFile('data.json', data)
    return item
  },
  
  // Update (return null if not found)
  update: async (storage, auth, id, changes) => {
    const data = await storage.getFile('data.json')
    const index = data.items.findIndex(i => i.id === id)
    if (index === -1) return null
    data.items[index] = { ...data.items[index], ...changes, updatedAt: new Date().toISOString() }
    await storage.saveFile('data.json', data)
    return data.items[index]
  },
  
  // Delete (return null if not found)
  delete: async (storage, auth, id) => {
    const data = await storage.getFile('data.json')
    const filtered = data.items.filter(i => i.id !== id)
    if (filtered.length === data.items.length) return null
    data.items = filtered
    await storage.saveFile('data.json', data)
  }
}
```

---

## Response Formats

### Success
```typescript
// Single resource
{ id: '123', field: 'value' }

// Collection
[{ id: '1' }, { id: '2' }]

// Paginated
{ items: [...], total: 100, page: 1, limit: 10 }

// No content (204)
null
```

### Error
```typescript
// Simple
{ error: 'Human-readable message' }

// Detailed
{ error: 'Validation failed', details: [{ field: 'name', message: 'Required' }] }
```

---

## Checklist

**Child package:**
- [ ] Export `AppHandlers` with pure functions
- [ ] Export `AppStorage` interface
- [ ] Export `AuthContext` interface
- [ ] Export data type interfaces
- [ ] First param: `storage`, second param: `auth`
- [ ] Return `null` for not found
- [ ] Throw `Error` for exceptional cases
- [ ] Validate input, throw descriptive errors

**Parent worker:**
- [ ] Implement `AppStorage` interface
- [ ] Create `AuthContext` from request
- [ ] Extract params, pass to handlers
- [ ] Map return values to HTTP responses
- [ ] Map errors to HTTP status codes

---

**Version**: 1.0.0  
**Last Updated**: January 2025
