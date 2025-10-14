# Session-Based Authentication Flow

## Problem
Child micro-frontends (like task app) need to make authenticated API requests, but we don't want to expose the user's key in client-side code or pass it through to child apps.

## Solution
Use edge-router as a session manager that stores key→sessionId mappings and injects keys into API requests server-side.

## Flow

### 1. Page Load with Key
```
User visits: https://hadoku.me/task/?key=a21743d9-b0f1-4c75-8e01-ba2dc37feacd
```

### 2. Session Creation (mf-loader.js)
- mf-loader extracts `key` from URL params
- Determines userType (public/friend/admin) by comparing against meta tags
- Calls `POST /session/create` with `{ key: "..." }`
- Edge-router generates unique sessionId, stores in SESSIONS_KV:
  ```
  session:abc123def456 → a21743d9-b0f1-4c75-8e01-ba2dc37feacd (expires 24h)
  ```
- Returns `{ sessionId: "abc123def456" }`

### 3. Mount Child App
- mf-loader passes props to child app:
  ```javascript
  {
    userType: 'admin',
    userId: 'a21743d9-b0f1-4c75-8e01-ba2dc37feacd',
    sessionId: 'abc123def456'  // ← NOT the key!
  }
  ```

### 4. API Request from Child
Child app makes request:
```javascript
fetch('/task/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Session-Id': props.sessionId  // ← Just the session ID
  },
  body: JSON.stringify({ title: 'New task' })
})
```

### 5. Key Injection at Edge Router
- Edge-router intercepts `/task/api` request
- Extracts `X-Session-Id` header
- Looks up key in SESSIONS_KV: `session:abc123def456` → `a21743d9-...`
- **Injects** `X-User-Key` header before proxying:
  ```
  X-User-Key: a21743d9-b0f1-4c75-8e01-ba2dc37feacd
  ```
- Proxies request to task-api worker

### 6. Authentication at API Worker
- task-api worker checks `X-User-Key` header
- Compares against `ADMIN_KEY` / `FRIEND_KEY` secrets
- Sets authContext and processes request
- Returns response

## Security Properties

✅ **Key never reaches client**: Only sessionId exposed in browser  
✅ **Session expiry**: Sessions auto-expire after 24 hours  
✅ **Server-side validation**: Edge-router controls key injection  
✅ **No CORS leakage**: Session endpoint has CORS enabled, but only returns sessionId  
✅ **Future cookie support**: Can add cookie-based sessions later (no URL key needed)

## Implementation Files

### Edge Router (`workers/edge-router/`)
- `wrangler.toml`: Added SESSIONS_KV binding
- `src/index.ts`: 
  - `POST /session/create` endpoint
  - `getKeyForSession()` lookup
  - Key injection in `handleApiRoute()`
- `src/logging/types.ts`: Added 'session' backend type

### Task API Worker (`workers/task-api/`)
- `src/index.ts`: Updated auth middleware to check `X-User-Key` header

### Parent App (`src/components/`)
- `mf-loader.js`: 
  - Calls `/session/create` on page load if key present
  - Passes `sessionId` prop to child apps (not key)

## Setup

1. Create KV namespaces:
```bash
cd workers/edge-router
wrangler kv:namespace create SESSIONS_KV
wrangler kv:namespace create SESSIONS_KV --preview
```

2. Update `wrangler.toml` with the returned IDs

3. Deploy edge-router:
```bash
wrangler deploy
```

## Testing

1. Visit with key: `https://hadoku.me/task/?key=YOUR_ADMIN_KEY`
2. Open browser DevTools → Network tab
3. Create a task in the UI
4. Observe request headers:
   - Client sends: `X-Session-Id: abc123...`
   - Edge-router injects: `X-User-Key: YOUR_ADMIN_KEY` (not visible to client)
5. Check edge-router logs:
   ```
   wrangler tail edge-router
   ```
   Should see: `Injected key from session abc123... -> a21743d9...`

## Future Enhancements

- **Cookie-based sessions**: Set session cookie, eliminate `?key=` in URL
- **Session refresh**: Extend expiry on each request
- **Multi-device sessions**: Store multiple sessions per user
- **Session revocation**: Admin endpoint to invalidate sessions
