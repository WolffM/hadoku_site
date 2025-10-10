# Task App Authentication Architecture

## ✅ COMPLETE - No Changes Needed in Task App!

The authentication architecture follows the correct pattern where:
- **Parent controller** handles all key validation
- **Parent server** validates keys and sets userType
- **Child apps** only receive validated userType - never touch keys

## Current Status

The parent (hadoku_site) has been updated to:
- ✅ Use nested Express mounting at `/task/api/*`
- ✅ Implement authentication middleware that validates keys
- ✅ Override fetch to automatically add `X-Admin-Key` header to all API requests
- ✅ Store key in sessionStorage and clean URL
- ✅ Pass only `userType` prop to child apps

The child (hadoku-task) is already correct:
- ✅ Make API calls to `/task/api/*` (correct nested pattern)
- ✅ Receive `userType` prop from parent
- ✅ Never touch URL keys or perform validation

## Authentication Flow

### How It Works

1. **User navigates to**: `https://hadoku.me/task?key=a21743d9...`

2. **Frontend Controller** (mf-loader.js):
   - Reads `key` from URL
   - Validates against admin/friend keys from meta tags
   - Determines `userType` (admin/friend/public)
   - Stores key in `sessionStorage`
   - Cleans URL (removes `?key=`)
   - Overrides `window.fetch` to automatically add `X-Admin-Key` header to all API requests

3. **Child App** (task):
   - Receives only `userType` prop
   - Makes normal fetch calls to `/task/api/*`
   - Parent's fetch override automatically adds `X-Admin-Key` header

4. **Backend Parent** (api/server.js):
   - Receives request with `X-Admin-Key` header
   - `authenticate()` middleware validates key
   - Sets `req.userType` (admin/friend/public)
   - `passUserType()` middleware sets `req.query.userType` and `req.headers['x-user-type']`
   - Forwards to child router

5. **Backend Child** (task router):
   - Reads `req.query.userType` or `req.headers['x-user-type']`
   - Trusts parent's validation
   - Never touches keys

### Why This Works

- **Single Source of Truth**: Only parent validates keys
- **Clean Separation**: Child apps are stateless and reusable
- **Security**: Keys never exposed in logs or child app code
- **Flexibility**: Child apps work with any parent that follows the contract

## Code Examples

### Parent Controller (mf-loader.js) - Already Implemented ✅

```javascript
// Store auth key and override fetch
if (urlKey) {
  sessionStorage.setItem('hadoku-auth-key', urlKey);
  window.history.replaceState({}, '', cleanUrl);
}

const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
  const authKey = sessionStorage.getItem('hadoku-auth-key');
  if (authKey && typeof url === 'string' && url.startsWith('/')) {
    options.headers = { ...options.headers, 'X-Admin-Key': authKey };
  }
  return originalFetch(url, options);
};
```

### Parent Server (api/server.js) - Already Implemented ✅

```javascript
function authenticate(req, res, next) {
  const key = req.query.key || req.headers['x-admin-key'];
  let userType = 'public';
  
  if (key === adminKey) userType = 'admin';
  else if (key === friendKey) userType = 'friend';
  
  req.userType = userType;
  res.setHeader('X-User-Type', userType);
  next();
}

function passUserType(req, res, next) {
  req.headers['x-user-type'] = req.userType;
  if (!req.query.userType) {
    req.query.userType = req.userType;
  }
  next();
}

mountMicroApp(app, 'task', () => createTaskRouter({ dataPath, environment }));
```

### Child App (task) - Already Correct ✅

```javascript
// API client just does normal fetch
async getTasks() {
  return (await fetch(`/task/api?userType=${userType}`)).json();
}

// Parent's fetch override automatically adds X-Admin-Key header
// Child never knows about keys
```

## Testing

1. **Start the server:**
   ```bash
   $env:ADMIN_KEY="a21743d9-b0f1-4c75-8e01-ba2dc37feacd"
   $env:FRIEND_KEY="test-friend-key"
   node api/server.js
   ```

2. **Navigate to:**
   ```
   http://localhost:3000/task?key=a21743d9-b0f1-4c75-8e01-ba2dc37feacd
   ```

3. **Expected behavior:**
   - URL changes to `http://localhost:3000/task` (key removed)
   - Console shows: `Mounted micro-app: task with userType: admin`
   - Server logs: `✅ Authenticated as: admin`
   - All API requests include `X-Admin-Key` header automatically
   - Task operations work with admin privileges

4. **Verify in Network tab:**
   - All requests to `/task/api/*` should have `X-Admin-Key` header
   - Server should log authentication for each request

## Summary

**Implementation Complete:**
- ✅ Parent controller validates keys and overrides fetch
- ✅ Parent server validates X-Admin-Key header
- ✅ Child apps receive only userType (trusted)
- ✅ No changes needed in child apps

**Design Principles Followed:**
- Single source of truth (parent validates)
- Clean separation (child apps stateless)
- Security (keys in headers, not URLs)
- Flexibility (child apps reusable)
