# Quick Start: Session-Based Authentication

## 🎯 Goal
Secure API authentication without exposing keys in client-side code.

## 📋 Prerequisites
- Cloudflare account with Workers access
- Wrangler CLI installed
- Access to hadoku.me deployment

## 🚀 Setup (5 minutes)

### Step 1: Create KV Namespaces
```powershell
cd workers\edge-router
wrangler kv:namespace create SESSIONS_KV
# Copy the "id" value

wrangler kv:namespace create SESSIONS_KV --preview
# Copy the "preview_id" value
```

### Step 2: Update wrangler.toml
Replace placeholder IDs in `workers/edge-router/wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "SESSIONS_KV"
id = "PASTE_PRODUCTION_ID_HERE"
preview_id = "PASTE_PREVIEW_ID_HERE"
```

### Step 3: Deploy Edge Router
```powershell
cd workers\edge-router
wrangler deploy
```

Expected output:
```
✨ Successfully published edge-router
   https://edge-router.YOUR-SUBDOMAIN.workers.dev
```

### Step 4: Test Session Creation
```powershell
# Replace with your actual admin key
$key = "your-admin-key-here"

Invoke-RestMethod -Method POST -Uri "https://hadoku.me/session/create" `
  -ContentType "application/json" `
  -Body (@{ key = $key } | ConvertTo-Json)
```

Expected response:
```json
{
  "sessionId": "abc123def456..."
}
```

## ✅ Verification

### 1. Session Creation Works
Visit: `https://hadoku.me/task/?key=YOUR_KEY`

Open DevTools → Network tab:
- Look for `POST /session/create`
- Response should have `{ sessionId: "..." }`

### 2. Check Edge Router Logs
```powershell
wrangler tail edge-router
```

You should see:
```
Created session abc123... for key YOUR_KEY...
```

### 3. Monitor API Requests
Make a request in the task app, then check logs:
```
Injected key from session abc123... -> YOUR_KEY...
```

## 🐛 Troubleshooting

### "Session storage not configured"
- KV namespace not bound → Check wrangler.toml
- Edge router not deployed → Run `wrangler deploy`

### "CORS error" on session creation
- Edge router not handling /session/create
- Check deployment: `wrangler deployments list`

### Sessions not persisting
- KV write failed → Check wrangler logs
- Namespace ID incorrect → Verify in Cloudflare dashboard

### Key not being injected
- Session expired (24h limit)
- SessionId not in X-Session-Id header (child app issue)
- Session doesn't exist (check logs)

## 📊 Testing Checklist

- [ ] KV namespaces created
- [ ] wrangler.toml updated with IDs
- [ ] Edge router deployed successfully
- [ ] Session creation endpoint returns sessionId
- [ ] Edge router logs show "Created session..."
- [ ] Public access (no key) still works
- [ ] Friend key creates session
- [ ] Admin key creates session

## 🔄 What's Next?

### Immediate (Required)
1. **Update @wolffm/task package**
   - See: `docs/TASK_PACKAGE_SESSION_CHANGES.md`
   - Add X-Session-Id header to all API requests
   - Test with npm link before publishing

### Short-term (Recommended)
2. **Add session monitoring**
   - Dashboard showing active sessions
   - Session count per user
   - Expiry tracking

3. **Session revocation**
   - Admin endpoint: `DELETE /session/:sessionId`
   - Bulk revoke by key
   - Emergency kill-switch

### Long-term (Nice to Have)
4. **Cookie-based sessions**
   - Set-Cookie on session creation
   - No more ?key= in URL
   - HttpOnly, Secure, SameSite

5. **Session refresh**
   - Extend expiry on each request
   - Configurable TTL per userType
   - Warning before expiry

6. **Rate limiting**
   - Per-session limits
   - Track request counts in KV
   - Exponential backoff

## 📚 Full Documentation
- **Flow Overview**: `docs/SESSION_AUTH_FLOW.md`
- **Implementation**: `docs/SESSION_AUTH_IMPLEMENTATION.md`
- **Security Diagram**: `docs/SESSION_AUTH_DIAGRAM.md`
- **Child Package Changes**: `docs/TASK_PACKAGE_SESSION_CHANGES.md`

## 💡 Pro Tips

1. **Use wrangler tail**: Real-time logs are invaluable
   ```powershell
   wrangler tail edge-router --format pretty
   ```

2. **Test in preview first**: Use `--preview` flag
   ```powershell
   wrangler deploy --dry-run
   ```

3. **Monitor KV usage**: Check Cloudflare dashboard
   - Workers & Pages → KV → SESSIONS_KV
   - Watch read/write counts
   - Set up alerts for quota

4. **Session debugging**: List all sessions
   ```powershell
   wrangler kv:key list --binding=SESSIONS_KV --namespace-id=YOUR_ID
   ```

## 🆘 Need Help?
- Check logs: `wrangler tail edge-router`
- View KV: `wrangler kv:key list --binding=SESSIONS_KV`
- Test locally: `wrangler dev` (in edge-router dir)
- Check docs: See files in `docs/SESSION_*`
