# Task App Data Persistence Guide

## Current Architecture

### Storage Layers

The task app uses a **dual-storage architecture** with automatic synchronization:

1. **Primary Storage (Client-Side)**: Browser `localStorage`
   - **Location**: User's browser
   - **Scope**: Per userType + userId combination
   - **Keys Pattern**:
     - Boards: `boards:{userType}:{userId}`
     - Tasks: `tasks:{userType}:{userId}:{boardId}`
     - Stats: `stats:{userType}:{userId}:{boardId}`

2. **Cloud Storage (Server-Side)**: Cloudflare Workers KV
   - **Location**: Cloudflare's global edge network
   - **KV Namespace**: `TASKS_KV` (ID: `6cdcc2053b224eb1819a680be8342eb3`)
   - **Same key pattern** as localStorage for consistency

### How Data Syncs

#### For Public Users:
- **Local-only**: All data stored in browser `localStorage`
- **No sync**: Public users don't send data to the server
- **Isolated per browser**: Clearing browser data = losing all tasks

#### For Friend/Admin Users:
- **Local-first**: Changes saved to `localStorage` immediately (fast UI)
- **Background sync**: Changes synced to Cloudflare KV asynchronously
- **Survives redeployments**: Data persists in KV across deployments
- **Cross-device**: Same data accessible from any browser (same userType + userId)

## Data Persistence Guarantees

### ✅ What Survives Redeployments

| Data Type | Public Users | Friend/Admin Users |
|-----------|-------------|-------------------|
| Tasks | ❌ Browser only | ✅ Survives (in KV) |
| Boards | ❌ Browser only | ✅ Survives (in KV) |
| Stats | ❌ Browser only | ✅ Survives (in KV) |
| Tags | ❌ Browser only | ✅ Survives (in KV) |

**Cloudflare KV characteristics:**
- **Persistence**: Data stored indefinitely (no automatic expiration)
- **Redeployment**: Worker code updates don't affect KV data
- **Global**: Replicated across Cloudflare's edge network
- **Eventually consistent**: ~60 seconds for global propagation

### ❌ What Doesn't Survive

- **Public user data**: Tied to browser localStorage (cleared when browser cache is cleared)
- **Uncommitted changes**: If background sync fails (network issues), changes only in localStorage

## Backup & Export Options

### Option 1: Manual Export via Browser Console (Easiest)

For friend/admin users, you can export all your data:

```javascript
// In browser console on hadoku.me/task
function exportAllData(userType = 'admin', userId = 'admin') {
  const data = {
    boards: JSON.parse(localStorage.getItem(`boards:${userType}:${userId}`)),
    tasks: {},
    stats: {}
  };
  
  // Export all boards' tasks and stats
  data.boards?.boards?.forEach(board => {
    data.tasks[board.id] = JSON.parse(localStorage.getItem(`tasks:${userType}:${userId}:${board.id}`));
    data.stats[board.id] = JSON.parse(localStorage.getItem(`stats:${userType}:${userId}:${board.id}`));
  });
  
  // Create download
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hadoku-backup-${new Date().toISOString()}.json`;
  a.click();
}

// Run it
exportAllData('admin', 'admin'); // or your userType/userId
```

### Option 2: Add Export API Endpoint (Recommended)

Add to `workers/task-api/src/index.ts`:

```typescript
// Export all data for a user
app.get('/task/api/export', async (c) => {
  const { storage, auth } = getContext(c);
  const userId = c.req.query('userId');
  
  // Only allow authenticated users to export
  if (auth.userType === 'public') {
    return c.json({ error: 'Export not available for public users' }, 403);
  }
  
  // Get all boards
  const boardsData = await TaskHandlers.getBoards(storage, { ...auth, userId });
  
  // Get tasks and stats for each board
  const exportData = {
    userType: auth.userType,
    userId: userId || 'public',
    exportedAt: new Date().toISOString(),
    boards: await Promise.all(
      boardsData.boards.map(async (board) => ({
        id: board.id,
        name: board.name,
        tags: board.tags,
        tasks: await TaskHandlers.getTasks(storage, { ...auth, userId }, board.id),
        stats: await TaskHandlers.getStats(storage, { ...auth, userId }, board.id)
      }))
    )
  };
  
  return c.json(exportData);
});
```

Then export via:
```bash
curl "https://task-api.hadoku.me/task/api/export?userId=admin" \
  -H "X-Admin-Key: YOUR_KEY" \
  -o backup.json
```

### Option 3: Direct KV Access (Nuclear Option)

Use Wrangler CLI to directly access KV:

```powershell
# List all keys
cd workers/task-api
npx wrangler kv:key list --namespace-id=6cdcc2053b224eb1819a680be8342eb3

# Get specific key
npx wrangler kv:key get "tasks:admin:admin:main" \
  --namespace-id=6cdcc2053b224eb1819a680be8342eb3

# Bulk export (requires scripting)
npx wrangler kv:key list --namespace-id=6cdcc2053b224eb1819a680be8342eb3 | \
  # Parse JSON and download each key
```

## Local Tunnel vs Cloudflare Worker

### Scenario: Both Connected to Same KV

**Q: Can local tunnel and deployed worker both use the same KV namespace?**

**A: Yes!** Both can safely use the same KV. Here's how:

#### Current Setup (wrangler.toml)
```toml
[[kv_namespaces]]
binding = "TASKS_KV"
id = "6cdcc2053b224eb1819a680be8342eb3"          # Production KV
preview_id = "3fb96829c28b497a9101dd554c97fdec"  # Preview/dev KV
```

#### Local Development (wrangler dev)
```powershell
cd workers/task-api

# Option 1: Use preview KV (recommended for testing)
npx wrangler dev
# Uses preview_id automatically

# Option 2: Use production KV (be careful!)
npx wrangler dev --remote
# Connects to actual production KV
```

#### Safety Considerations

| Scenario | Risk Level | Notes |
|----------|-----------|-------|
| **Local (preview) + Production** | ✅ Safe | Separate KV namespaces |
| **Local (remote) + Production** | ⚠️ Caution | Both write to same KV |
| **Race Conditions** | ✅ No Issue | KV writes are atomic per key |
| **Read-Your-Writes** | ⚠️ Delay | Global consistency ~60s |

**Key Points:**
1. **Atomic Writes**: Each KV write is atomic. No partial writes or corruption.
2. **Last Write Wins**: If both local and production write the same key simultaneously, last write wins.
3. **No Transactions**: KV doesn't support multi-key transactions.
4. **Eventually Consistent**: A write in one location takes ~60s to propagate globally.

#### Best Practices for Dual Access

1. **Use Different User IDs**
   ```typescript
   // Local dev: use 'dev' userId
   // Production: use 'admin' or 'friend'
   // Keys won't collide: tasks:admin:dev:main vs tasks:admin:admin:main
   ```

2. **Use Preview KV for Local Dev**
   ```toml
   # In wrangler.toml - keep preview_id different from production
   [[kv_namespaces]]
   binding = "TASKS_KV"
   id = "6cdcc2053b224eb1819a680be8342eb3"          # Production
   preview_id = "3fb96829c28b497a9101dd554c97fdec"  # Local dev
   ```

3. **Test Data Segregation**
   ```typescript
   // In local tunnel, pass ?userId=local-test
   // Production uses ?userId=admin
   ```

## Backup Automation Strategy

### Recommended Approach

Create a scheduled Cloudflare Worker (Cron Trigger) for daily backups:

**File**: `workers/backup-worker/src/index.ts`
```typescript
export default {
  async scheduled(event, env, ctx) {
    // List all KV keys
    const keys = await env.TASKS_KV.list();
    
    // Fetch all data
    const backup = {};
    for (const key of keys.keys) {
      backup[key.name] = await env.TASKS_KV.get(key.name, 'json');
    }
    
    // Store backup in R2 or send to external storage
    await env.BACKUP_BUCKET.put(
      `backups/tasks-${new Date().toISOString()}.json`,
      JSON.stringify(backup, null, 2)
    );
  }
};
```

**Configure in wrangler.toml**:
```toml
[triggers]
crons = ["0 2 * * *"]  # Daily at 2 AM UTC
```

## Disaster Recovery

### Restore from Backup

```powershell
# Download backup
curl https://hadoku.me/task/api/export?userId=admin \
  -H "X-Admin-Key: YOUR_KEY" \
  -o backup.json

# Restore each key via Wrangler
$backup = Get-Content backup.json | ConvertFrom-Json
foreach ($board in $backup.boards) {
  # Restore boards
  npx wrangler kv:key put "boards:admin:admin" `
    --namespace-id=6cdcc2053b224eb1819a680be8342eb3 `
    --path="boards.json"
  
  # Restore tasks per board
  npx wrangler kv:key put "tasks:admin:admin:$($board.id)" `
    --namespace-id=6cdcc2053b224eb1819a680be8342eb3 `
    --path="tasks-$($board.id).json"
    
  # Restore stats per board
  npx wrangler kv:key put "stats:admin:admin:$($board.id)" `
    --namespace-id=6cdcc2053b224eb1819a680be8342eb3 `
    --path="stats-$($board.id).json"
}
```

## Summary

✅ **Your data is safe across redeployments** (for friend/admin users)
✅ **No data loss on worker updates** - KV is separate from worker code
✅ **Local tunnel + production can coexist** - use different userIds or preview KV
✅ **Export is possible** - via browser console, API endpoint, or direct KV access
✅ **Race conditions not a concern** - only one instance handles requests at a time
⚠️ **Public users lose data on browser clear** - consider warning them
📝 **Backup strategy recommended** - implement export API endpoint + scheduled backups
