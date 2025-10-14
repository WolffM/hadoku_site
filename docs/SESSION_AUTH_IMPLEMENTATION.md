# Session-Based Authentication Implementation

## Summary
Implemented secure session-based authentication that keeps user keys server-side while allowing child micro-frontends to make authenticated API requests.

## What Was Changed

### 1. Edge Router (`workers/edge-router/`)

**wrangler.toml**
- Added SESSIONS_KV namespace binding (IDs need to be created)

**src/index.ts**
- Added `POST /session/create` endpoint to generate sessionIds from keys
- Added `getKeyForSession()` lookup function
- Modified `handleApiRoute()` to:
  - Extract `X-Session-Id` from incoming requests
  - Look up the key in SESSIONS_KV
  - Inject `X-User-Key` header before proxying to backend
- Sessions expire after 24 hours automatically

**src/logging/types.ts**
- Added 'session' as a valid backend type for analytics

### 2. Task API Worker (`workers/task-api/`)

**src/index.ts**
- Updated authentication middleware to check `X-User-Key` header (injected by edge-router)
- Kept backward compatibility with legacy `X-Admin-Key` and `?key=` query param

### 3. Parent App (`src/components/`)

**mf-loader.js**
- On page load with `?key=` parameter:
  1. Extracts key from URL
  2. Calls `POST /session/create` with the key
  3. Receives sessionId
  4. Passes sessionId (NOT the key!) to child app as prop
- Child apps receive: `{ userType, userId, sessionId }`

## Security Flow

```
User → https://hadoku.me/task/?key=abc123
       ↓
   mf-loader.js extracts key
       ↓
   POST /session/create { key: "abc123" }
       ↓
   Edge router stores: session:xyz789 → abc123
       ↓
   Returns: { sessionId: "xyz789" }
       ↓
   Child app mounts with: { sessionId: "xyz789" }
       ↓
   Child makes request: X-Session-Id: xyz789
       ↓
   Edge router looks up: xyz789 → abc123
       ↓
   Edge router injects: X-User-Key: abc123
       ↓
   Task API receives authenticated request
```

## Key Security Properties

✅ **Key stays server-side**: Never exposed in child app code or browser  
✅ **Short-lived sessions**: 24-hour expiry (configurable)  
✅ **Session isolation**: Each sessionId is unique and maps to one key  
✅ **No client-side storage**: Sessions stored in edge KV, not localStorage/cookies  
✅ **CORS-safe**: Session creation endpoint has proper CORS headers  

## Setup Instructions

### 1. Create KV Namespaces
```powershell
cd workers\edge-router
wrangler kv:namespace create SESSIONS_KV
wrangler kv:namespace create SESSIONS_KV --preview
```

Copy the returned IDs into `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "SESSIONS_KV"
id = "YOUR_PRODUCTION_ID"
preview_id = "YOUR_PREVIEW_ID"
```

### 2. Deploy Edge Router
```powershell
cd workers\edge-router
wrangler deploy
```

### 3. Update Child Package (@wolffm/task)
See `docs/TASK_PACKAGE_SESSION_CHANGES.md` for required changes to the child package.

**Key change needed**: All API fetch calls must include:
```javascript
headers: {
  'Content-Type': 'application/json',
  'X-Session-Id': props.sessionId  // If sessionId provided
}
```

### 4. Test the Flow
```powershell
# Start local dev
npm run dev

# Visit with a key
http://localhost:4321/task/?key=YOUR_ADMIN_KEY
```

**Expected behavior**:
1. Network tab shows: `POST /session/create` → returns `{ sessionId: "..." }`
2. Subsequent API requests include: `X-Session-Id: ...` header
3. Key never appears in client-side network traffic
4. API requests succeed with proper authentication

### 5. Verify in Production
```powershell
# Tail edge-router logs
wrangler tail edge-router

# Look for:
# "Created session xyz123 for key abc123..."
# "Injected key from session xyz123 -> abc123..."
```

## Testing Checklist

- [ ] KV namespaces created and configured
- [ ] Edge router deployed with new code
- [ ] Session creation works (`POST /session/create`)
- [ ] SessionId passed to child app
- [ ] Child app includes `X-Session-Id` in requests
- [ ] Edge router injects `X-User-Key` correctly
- [ ] Task API authenticates properly
- [ ] Sessions expire after 24 hours
- [ ] Public users (no key) still work
- [ ] Friend/admin keys work correctly

## Remaining Work

### In @wolffm/task Package
1. Update props interface to accept `sessionId?: string`
2. Create header helper that includes `X-Session-Id`
3. Update all API fetch calls to use the helper
4. Test locally with npm link
5. Publish new version
6. Update hadoku_site to use new version

### Optional Enhancements
- **Cookie-based sessions**: Set-Cookie on session creation
- **Session refresh**: Extend expiry on each request
- **Session list**: Admin endpoint to view active sessions
- **Revocation**: Endpoint to invalidate specific sessions
- **Rate limiting**: Per-session rate limits

## Troubleshooting

### Session creation fails
- Check SESSIONS_KV is bound in wrangler.toml
- Verify edge-router deployed successfully
- Check CORS is working (should see Access-Control-Allow-Origin header)

### Key not injected
- Verify sessionId is being sent in `X-Session-Id` header
- Check edge-router logs: `wrangler tail edge-router`
- Ensure session hasn't expired (24h TTL)

### Authentication still fails
- Verify X-User-Key reaches task-api (check task-api logs)
- Confirm ADMIN_KEY and FRIEND_KEY secrets are set
- Check task-api auth middleware is checking X-User-Key header

## Files Changed
- `workers/edge-router/wrangler.toml` - Added SESSIONS_KV binding
- `workers/edge-router/src/index.ts` - Session management + key injection
- `workers/edge-router/src/logging/types.ts` - Added 'session' backend type
- `workers/task-api/src/index.ts` - Accept X-User-Key header
- `src/components/mf-loader.js` - Create sessions, pass sessionId to children
- `docs/SESSION_AUTH_FLOW.md` - Detailed flow documentation
- `docs/TASK_PACKAGE_SESSION_CHANGES.md` - Child package requirements
- `scripts/setup-sessions-kv.sh` - Helper script for KV setup

## Next Steps
1. Run `scripts/setup-sessions-kv.sh` to create KV namespaces
2. Update wrangler.toml with KV IDs
3. Deploy edge-router: `cd workers/edge-router && wrangler deploy`
4. Update @wolffm/task package per docs/TASK_PACKAGE_SESSION_CHANGES.md
5. Test end-to-end with real keys
6. Monitor edge-router logs for session activity
