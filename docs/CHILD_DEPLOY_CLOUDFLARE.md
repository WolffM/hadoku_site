# Child App Deployment Instructions for Cloudflare Pages

## Summary

To support Cloudflare Pages Functions, the child app (hadoku-task) needs to deploy server files to **three locations** in the parent repo:

1. **`public/mf/task/`** - Client bundle (browser code)
2. **`api/apps/task/`** - Server code for local Express development
3. **`functions/task/lib/`** - Server code for Cloudflare Pages Functions (production)

## Updated Build Script

Update your `.github/workflows/build.yml` in the hadoku-task repo:

### Changes Required

```yaml
# In the "Push built files to parent repository" step:

- name: Push built files to parent repository
  env:
    HADOKU_SITE_TOKEN: ${{ secrets.HADOKU_SITE_TOKEN }}
  run: |
    # ... (git clone stays the same)
    
    # Create target directories
    mkdir -p public/mf/task
    mkdir -p api/apps/task
    mkdir -p functions/task/lib     # ← ADD THIS
    
    # Copy client build
    echo "📦 Copying client build to public/mf/task/..."
    rm -rf public/mf/task/*
    cp -r ../dist/index.js ../dist/style.css public/mf/task/
    
    # Copy server build for local dev
    echo "📦 Copying server build to api/apps/task/..."
    rm -rf api/apps/task/*
    cp -r ../dist/server/* api/apps/task/
    cp ../package.json api/apps/task/
    
    # Copy server build for Cloudflare Functions    # ← ADD THIS SECTION
    echo "📦 Copying server build to functions/task/lib/..."
    rm -rf functions/task/lib/*
    cp -r ../dist/server/* functions/task/lib/
    
    # Commit changes
    git add public/mf/task/ api/apps/task/ functions/task/lib/    # ← UPDATE THIS
    # ... (rest stays the same)
```

## File Structure After Deploy

```
hadoku_site/
├── public/mf/task/
│   ├── index.js          ← Client bundle (from hadoku-task)
│   └── style.css         ← Client styles (from hadoku-task)
│
├── api/apps/task/        ← Server code for LOCAL dev (from hadoku-task)
│   ├── router.js
│   ├── handlers/
│   ├── routes/
│   ├── storage.js
│   └── sync-queue.js
│
└── functions/task/
    ├── lib/              ← Server code for PRODUCTION (from hadoku-task)
    │   ├── router.js
    │   ├── handlers/
    │   ├── routes/
    │   ├── storage.js
    │   └── sync-queue.js
    └── api/
        └── [[path]].js   ← Cloudflare Function (imports from ../lib/)
```

## Why Three Locations?

### `public/mf/task/` - Client Bundle
- **Purpose:** Browser-executable React app
- **Used by:** Both local and production
- **Served as:** Static files via CDN

### `api/apps/task/` - Local Server
- **Purpose:** Express router for local development
- **Used by:** `node api/server.js` (local only)
- **Import path:** `import { createTaskRouter } from './apps/task/router.js'`

### `functions/task/lib/` - Production Server
- **Purpose:** Express router for Cloudflare Pages Functions
- **Used by:** Cloudflare serverless functions (production only)
- **Import path:** `import { createTaskRouter } from '../lib/router.js'`
- **Why separate?** Cloudflare Functions can't import from outside `functions/` directory

## What's Already Done in Parent Repo

✅ `functions/task/api/[[path]].js` updated to import from `../lib/router.js`
✅ Import path changed from `../../../api/apps/task/router.js` (doesn't work in Cloudflare)

## Next Steps

1. **Update hadoku-task's `.github/workflows/build.yml`** with the changes above
2. **Push to hadoku-task main branch** - This will trigger a deploy
3. **Wait for CI/CD** - Files will be copied to all three locations in hadoku_site
4. **Cloudflare auto-deploys** when it detects changes to `functions/`
5. **Test** at `https://hadoku.me/task?key=admin-key`

## Testing

After deployment:

### Check Files Exist
```bash
# In hadoku_site repo
ls -la public/mf/task/          # Should have index.js, style.css
ls -la api/apps/task/           # Should have router.js, handlers/, routes/
ls -la functions/task/lib/      # Should have router.js, handlers/, routes/
```

### Test Health Endpoint
```bash
curl https://hadoku.me/health
# Should return JSON with function info
```

### Test Task API
```bash
curl -H "X-Admin-Key: YOUR-ADMIN-KEY" https://hadoku.me/task/api
# Should return tasks JSON (not 404)
```

## Troubleshooting

### Issue: Still getting 404 on `/task/api`
**Cause:** Files not deployed to `functions/task/lib/` yet
**Fix:** Re-run hadoku-task CI/CD or manually copy files

### Issue: Import errors in Cloudflare logs
**Cause:** Import paths are wrong
**Fix:** Verify `[[path]].js` imports from `../lib/router.js` (relative to functions/task/)

### Issue: Environment variables missing
**Cause:** Not set in Cloudflare dashboard
**Fix:** Add ADMIN_KEY, FRIEND_KEY, NODE_ENV, TASK_DATA_PATH in Cloudflare Pages settings

---

**Reference:** See `docs/samplebuild.yml` in hadoku_site for complete example build script.
