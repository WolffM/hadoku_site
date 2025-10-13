# Data Isolation Issue - Task App

## Problem Description

When switching between different access keys in the URL (e.g., from `https://hadoku.me/task` to `https://hadoku.me/task/?key=a21743d9-b0f1-4c75-8e01-ba2dc37feacd`), the task app is retaining data from the previous session instead of loading fresh data for the new key.

**Expected Behavior:**
- `https://hadoku.me/task` → Public mode, localStorage scoped to `userType: 'public', userId: 'public'`
- `https://hadoku.me/task/?key=ADMIN_KEY` → Admin mode, should load admin's data from server or localStorage scoped to `userType: 'admin', userId: 'admin'`
- `https://hadoku.me/task/?key=unique-user-id` → Friend mode, should load that friend's specific data scoped to `userType: 'admin', userId: 'unique-user-id'`

**Actual Behavior:**
The app appears to retain state from the previous view even when the key changes.

## Root Cause Analysis

### 1. Parent Side (hadoku_site) - ✅ FIXED

The `mf-loader.js` was not passing `userType` and `userId` props to child apps. It was calling:
```javascript
module.mount(root);  // No props!
```

**Fixed in commit `e4da9e1`:**
```javascript
// Now correctly extracts key from URL and determines userType
const key = urlParams.get('key');
let userType = 'public';
let userId = 'public';

if (key) {
  if (key === adminKey) {
    userType = 'admin';
    userId = 'admin';
  } else if (key === friendKey) {
    userType = 'friend';
    userId = 'friend';
  } else {
    // Custom key = unique userId in admin mode
    userType = 'admin';
    userId = key;
  }
}

module.mount(root, { ...appConfig.props, userType, userId });
```

### 2. Child Side (@wolffm/task) - ⚠️ POTENTIAL ISSUE

The task app's mount function correctly receives and uses `userType` and `userId` props:

```javascript
// From public/mf/task/index.js line 1678
function et(e, t = {}) {
  const n = new URLSearchParams(window.location.search), 
        a = t.userType || n.get("userType") || "public", 
        s = t.userId || n.get("userId") || "public", 
        r = { ...t, userType: a, userId: s };
  // ...
  c.render(/* @__PURE__ */ k(Ie, { ...r }));
}
```

**However**, there are potential issues:

#### Issue A: Single-Page Navigation
When a user navigates from `/task` to `/task?key=xxx` **without a full page reload**, the browser might not remount the component. The JavaScript context persists, and React may not reinitialize state.

**Symptoms:**
- Old tasks remain visible
- New userType/userId props are ignored
- localStorage reads return cached data

**Solution Options:**
1. **Force Page Reload**: Add logic to detect key changes and reload
2. **Implement useEffect**: Child app should watch for prop changes and reinitialize
3. **Unmount/Remount**: Parent could unmount and remount the child when key changes

#### Issue B: localStorage Namespace Collision
If the child app doesn't properly scope ALL localStorage keys by `userType` and `userId`, data can leak between contexts.

**Current Implementation:**
- Storage keys use pattern: `boards:{userType}:{userId}`
- This SHOULD isolate data correctly

**But verify:**
- Are ALL storage keys following this pattern?
- Is any state cached in memory across navigations?

#### Issue C: API Request Race Conditions
For admin/friend mode, if the app makes API requests:
1. User loads `/task?key=OLD_KEY`
2. API request starts for OLD_KEY data
3. User navigates to `/task?key=NEW_KEY`
4. OLD_KEY response arrives and overwrites NEW_KEY data

**Solution:** Cancel pending requests on prop change or validate response matches current props.

## Testing Plan

### Test 1: Fresh Page Load
```
1. Open: https://hadoku.me/task (public mode)
2. Verify: Empty task list or public tasks
3. Open NEW TAB: https://hadoku.me/task/?key=YOUR_ADMIN_KEY
4. Verify: Admin tasks load, public tasks NOT visible
```

**Expected:** Each tab should have isolated data ✅

### Test 2: Same-Tab Navigation
```
1. Open: https://hadoku.me/task
2. Add some public tasks
3. Navigate to: https://hadoku.me/task/?key=YOUR_ADMIN_KEY (same tab)
4. Verify: Public tasks disappear, admin tasks load
5. Navigate back to: https://hadoku.me/task
6. Verify: Public tasks reappear
```

**Expected:** Data should switch based on URL ⚠️ (might fail without child-side fix)

### Test 3: Multiple User IDs
```
1. Open: https://hadoku.me/task/?key=USER_ID_1
2. Add tasks
3. Navigate to: https://hadoku.me/task/?key=USER_ID_2 (same tab)
4. Verify: USER_ID_1 tasks NOT visible
5. Verify: USER_ID_2 starts with empty list
```

**Expected:** Each userId should have isolated data ⚠️

## Recommended Actions

### Immediate (Parent Repo)
- ✅ Fixed: mf-loader.js now passes correct props
- ⏳ Deploy and test on production
- ⏳ Run Test 1 to verify cross-tab isolation works

### Short-term (If Test 2 Fails)
Add navigation guard to force page reload when key changes:

```javascript
// In mf-loader.js or Base.astro
let currentKey = new URLSearchParams(window.location.search).get('key');

window.addEventListener('popstate', () => {
  const newKey = new URLSearchParams(window.location.search).get('key');
  if (newKey !== currentKey) {
    window.location.reload();
  }
});
```

### Long-term (Child Repo)
Update @wolffm/task to handle prop changes:

```typescript
// In child App.tsx
useEffect(() => {
  // When userType or userId changes, clear state and reload data
  console.log('User context changed:', { userType, userId });
  
  // Clear any cached state
  // Reinitialize storage
  // Reload data for new context
  
}, [userType, userId]);
```

## Related Files

- `src/components/mf-loader.js` - Parent loader (✅ FIXED)
- `public/mf/task/index.js` - Child mount function (line 1678)
- `docs/DATA_PERSISTENCE.md` - Storage architecture
- `workers/task-api/src/index.ts` - Server-side storage keys

## Status

- **Parent Side**: ✅ Fixed in commit `e4da9e1`
- **Child Side**: ⚠️ Needs testing, may need update
- **Deployment**: ⏳ Pending
- **Verification**: ⏳ Awaiting production test results
