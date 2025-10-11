# Cloudflare Pages Functions Deployment Guide

## Overview

This guide covers deploying the Hadoku site to Cloudflare Pages with serverless API functions for the new architecture.

## Architecture

```
Cloudflare Pages
├── Static Site (Astro build in /dist)
│   ├── Home page with app directory
│   └── Micro-frontend loader (mf-loader.js)
│
└── Functions (Serverless API)
    └── /task/api/* → functions/task/api/[[path]].js
        ├── Handles admin/friend API requests
        └── Returns 403 for public users (they use localStorage)
```

## Prerequisites

1. **GitHub repo connected to Cloudflare Pages**
2. **Task app rebuilt** with public localStorage mode (see `TASK_APP_PUBLIC_MODE.md`)
3. **Admin and friend keys generated** (use UUID v4)

---

## Step 1: Configure Build Settings

In Cloudflare Pages dashboard:

### Build Configuration
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (or leave blank)
- **Node version:** 18 or higher

### Build Settings (if prompted)
The build command runs:
1. `node scripts/generate-registry.mjs` - Generates micro-frontend registry
2. `astro build` - Builds static site to /dist

---

## Step 2: Add Environment Variables

Go to: **Settings → Environment Variables**

Add these variables for **Production**:

| Variable | Value | Notes |
|----------|-------|-------|
| `ADMIN_KEY` | `your-admin-uuid` | Generate with `uuidgen` or online tool |
| `FRIEND_KEY` | `your-friend-uuid` | Different from admin key |
| `NODE_ENV` | `production` | Enables production mode |
| `TASK_DATA_PATH` | `/tmp/hadoku-tasks` | Cloudflare uses /tmp for ephemeral storage |

**⚠️ Important Notes:**
- **Generate new keys** for production (don't reuse local dev keys)
- **Keep keys secret** - Store them in a password manager
- **Ephemeral storage:** `/tmp` resets on each function invocation. For persistence, you'll need to add Cloudflare KV or R2 storage later.

### Optional: Preview Environment
You can add the same variables for **Preview** deployments with different keys for testing.

---

## Step 3: Deploy

### Option A: Push to GitHub
```bash
git add .
git commit -m "Add Cloudflare Pages Functions support"
git push
```

Cloudflare Pages will automatically deploy.

### Option B: Manual Deploy
In Cloudflare Pages dashboard, click **"Create deployment"** and upload your code.

---

## Step 4: Verify Deployment

### Check Build Logs
1. Go to **Deployments** in Cloudflare dashboard
2. Click on latest deployment
3. View build logs - should show:
   ```
   ✓ Completed in 805ms
   6 page(s) built
   Functions:
   - /task/api/[[path]]
   ```

### Check Function Logs
1. Go to **Functions** tab
2. You should see `/task/api/[[path]]` listed
3. Click on it to see function details

---

## Step 5: Test Production

### Test Public Mode (localStorage only)
1. Open `https://hadoku.me/task`
2. Open DevTools → Network tab
3. Add a task
4. **Verify:** No API requests to `/task/api/*`
5. **Verify:** Task appears immediately (from localStorage)
6. Refresh page - task should persist
7. Open Application → Local Storage → check for `hadoku-public-tasks`

### Test Admin Mode (API)
1. Open `https://hadoku.me/task?key=YOUR-ADMIN-KEY`
2. Open DevTools → Network tab
3. Add a task
4. **Verify:** See `POST /task/api` request
5. **Verify:** Request returns 200 with task data
6. **Verify:** Console logs show `userType: 'admin'`
7. Refresh page
8. **Verify:** See `GET /task/api?userType=admin` request
9. **Verify:** Task loads from server

### Test Friend Mode
1. Open `https://hadoku.me/task?key=YOUR-FRIEND-KEY`
2. Follow same steps as admin mode
3. **Verify:** Console shows `userType: 'friend'`
4. **Verify:** Data stored separately from admin

---

## Step 6: Monitor Function Usage

### Check Quota
1. Go to **Analytics → Requests**
2. Monitor daily function invocations
3. Free tier: 100,000 requests/day
4. Your usage should be minimal (only admin/friend API calls)

### View Logs (Real-time)
1. Go to **Functions** tab
2. Click **"View logs"** (Live tail)
3. Make API request from your app
4. See logs: `[CF Function] POST /task/api`

---

## Troubleshooting

### Issue: 404 on API routes
**Cause:** Functions not deployed correctly
**Fix:** 
- Check that `functions/task/api/[[path]].js` exists
- Rebuild and redeploy
- Verify in dashboard under Functions tab

### Issue: 500 errors
**Cause:** Missing environment variables or import errors
**Fix:**
- Check Function logs for error details
- Verify all env vars are set
- Check import paths work with ES modules

### Issue: CORS errors
**Cause:** CORS headers not set correctly
**Fix:**
- Already configured in `[[path]].js` with wildcard `*`
- If needed, restrict to specific origins in production

### Issue: Public mode still making API calls
**Cause:** Task app not rebuilt with localStorage mode
**Fix:**
- Follow `TASK_APP_PUBLIC_MODE.md` instructions
- Rebuild task app
- Update `public/mf/task/index.js` with new bundle
- Redeploy

### Issue: Data not persisting
**Cause:** `/tmp` storage is ephemeral
**Solution (Future):**
- Migrate to Cloudflare KV (key-value store)
- Or migrate to Cloudflare R2 (object storage)
- See documentation for persistence options

---

## Data Persistence Warning ⚠️

**Current Setup:** The `TASK_DATA_PATH=/tmp/hadoku-tasks` directory is **ephemeral**. Data will be lost when:
- Function "cold starts" (after inactivity)
- Cloudflare redeploys functions
- Functions scale across multiple instances

**For Production:** You should migrate to persistent storage:
- **Option 1:** Cloudflare KV (simple key-value pairs)
- **Option 2:** Cloudflare R2 (object storage for JSON files)
- **Option 3:** External database (Supabase, PlanetScale, etc.)

For now, this setup works for **testing and low-stakes data**.

---

## Next Steps

1. ✅ Deploy to Cloudflare Pages
2. ✅ Test all three modes (public, friend, admin)
3. 🔄 Monitor function usage and logs
4. 📝 Plan data persistence migration (KV or R2)
5. 🔐 Consider adding rate limiting for API routes

---

## Useful Commands

```bash
# Build locally
npm run build

# Test build output
npm run preview

# View built files
ls -la dist/

# Check functions directory
ls -la functions/task/api/

# Generate new UUID for keys
uuidgen  # macOS/Linux
# Or use: https://www.uuidgenerator.net/
```

---

## Additional Resources

- [Cloudflare Pages Functions Docs](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/kv/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Express on Cloudflare](https://developers.cloudflare.com/workers/tutorials/migrate-to-module-workers/)
