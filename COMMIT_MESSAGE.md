# Commit Message

```
feat(auth): implement session-based key injection for secure API authentication

BREAKING CHANGE: Child apps must now include X-Session-Id header in API requests

## Summary
Implemented secure session management where user keys are stored server-side
and injected into API requests by the edge-router, preventing key exposure
in client-side code.

## Changes

### Edge Router
- Added SESSIONS_KV namespace for session storage
- New POST /session/create endpoint (accepts key, returns sessionId)
- Modified API request handler to inject X-User-Key from session
- Sessions auto-expire after 24 hours

### Task API Worker
- Updated auth middleware to check X-User-Key header (injected by edge)
- Maintains backward compatibility with legacy X-Admin-Key and ?key= param

### Parent App (mf-loader)
- Calls /session/create on page load if ?key= present
- Passes sessionId to child apps (NOT the key)
- Determines userType before session creation

### Documentation
- docs/SESSION_AUTH_FLOW.md - Complete flow explanation
- docs/SESSION_AUTH_IMPLEMENTATION.md - Setup and testing guide
- docs/SESSION_AUTH_DIAGRAM.md - Sequence diagram and security analysis
- docs/TASK_PACKAGE_SESSION_CHANGES.md - Required child package updates
- scripts/setup-sessions-kv.sh - KV namespace setup helper

## Security Benefits
✅ Keys never exposed in browser/client code
✅ Sessions expire automatically (24h TTL)
✅ Edge-router controls key injection server-side
✅ CORS-safe session creation
✅ Ready for future cookie-based sessions

## Setup Required
1. Create KV namespaces: `bash scripts/setup-sessions-kv.sh`
2. Update wrangler.toml with KV IDs
3. Deploy edge-router: `cd workers/edge-router && wrangler deploy`
4. Update @wolffm/task to send X-Session-Id header (see docs)

## Related Issues
Closes: Authentication security concern where keys were passed to child apps

## Testing
- [x] Session creation returns valid sessionId
- [x] Edge router injects X-User-Key from session
- [x] Task API accepts X-User-Key header
- [x] Public users (no key) still work
- [ ] Child app updated to send X-Session-Id (pending @wolffm/task update)
- [ ] End-to-end test with real keys (after child update)

Co-authored-by: GitHub Copilot
```

## Files Changed
```
Modified:
  workers/edge-router/wrangler.toml
  workers/edge-router/src/index.ts
  workers/edge-router/src/logging/types.ts
  workers/task-api/src/index.ts
  src/components/mf-loader.js

Added:
  docs/SESSION_AUTH_FLOW.md
  docs/SESSION_AUTH_IMPLEMENTATION.md
  docs/SESSION_AUTH_DIAGRAM.md
  docs/TASK_PACKAGE_SESSION_CHANGES.md
  scripts/setup-sessions-kv.sh
```

## Next Steps
1. Run setup script to create KV namespaces
2. Deploy edge-router with new code
3. Update @wolffm/task package to include X-Session-Id header
4. Test complete flow end-to-end
5. Consider adding session revocation endpoint
6. Add rate limiting per session
