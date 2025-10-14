# Required Changes to @wolffm/task Package

## Overview
The @wolffm/task child package needs to be updated to include the `sessionId` in API requests via the `X-Session-Id` header.

## Changes Needed

### 1. Update Props Interface
The mount function should accept sessionId:
```typescript
interface TaskAppProps {
  basename?: string;
  apiUrl?: string;
  environment?: string;
  userType: 'public' | 'friend' | 'admin';
  userId?: string;
  sessionId?: string;  // ← Add this
}
```

### 2. Update API Client Headers
All fetch calls to `/task/api/*` should include the session header if sessionId is present:

```typescript
function createHeaders(sessionId?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  if (sessionId) {
    headers['X-Session-Id'] = sessionId;
  }
  
  return headers;
}

// Then in API calls:
fetch('/task/api', {
  method: 'POST',
  headers: createHeaders(props.sessionId),
  body: JSON.stringify(data)
})
```

### 3. Update All API Methods
Ensure all these methods pass sessionId:
- `createTask()`
- `patchTask()`
- `completeTask()`
- `deleteTask()`
- `getTasks()` (GET)
- `getStats()` (GET)
- `getBoards()` (GET)
- `createBoard()`
- `deleteBoard()`
- `addTag()`
- `removeTag()`

For GET requests with query params, add as header:
```typescript
fetch(`/task/api/tasks?userType=${userType}&userId=${userId}`, {
  headers: createHeaders(sessionId)
})
```

### 4. Test Locally
In the @wolffm/task repo:

```bash
# Build the package
npm run build

# Link locally for testing
npm link

# In hadoku_site repo
cd ~/hadoku_site
npm link @wolffm/task

# Copy updated bundle
npm run update-task-bundle

# Test the flow
npm run dev
```

Visit with key: http://localhost:4321/task/?key=YOUR_TEST_KEY

Check Network tab:
- Session creation: POST /session/create
- Task operations: Should include `X-Session-Id` header

## Migration Checklist

- [ ] Update TaskAppProps interface to include `sessionId?: string`
- [ ] Create `createHeaders(sessionId?: string)` helper
- [ ] Update all POST/PATCH/DELETE API calls to use createHeaders()
- [ ] Update all GET API calls to include header (even with query params)
- [ ] Update mount() to store sessionId in component state
- [ ] Test session creation flow
- [ ] Test authenticated API requests
- [ ] Verify key never appears in client-side code/network
- [ ] Publish new package version
- [ ] Update hadoku_site to use new version

## Current State
The mf-loader.js in hadoku_site is already passing sessionId:
```javascript
const runtimeProps = {
  ...appConfig.props,
  userType,
  userId,
  sessionId  // ✓ Already implemented
};
module.mount(root, runtimeProps);
```

The edge-router is ready to:
- Create sessions (POST /session/create) ✓
- Inject keys (X-User-Key header) ✓

The task-api worker is ready to:
- Accept X-User-Key header ✓

**Only missing**: Child app needs to send X-Session-Id in requests.
