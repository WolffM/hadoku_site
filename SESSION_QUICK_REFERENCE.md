# Session Management Implementation - Quick Reference

## Three-Phase Approach

### Phase 1: Session Management & Handshake ⚙️
**Goal:** Track multiple devices per auth key, migrate preferences when sessionId changes

**Key Components:**
1. **Session Mapping Storage** - Track sessionId → authKey relationships
2. **Handshake Endpoint** - `POST /task/api/session/handshake`
3. **Preference Migration** - Copy preferences from oldSessionId to newSessionId
4. **Multi-Device Support** - Each device gets its own sessionId + preferences

**Data Structure:**
```
sessionId (ABC) → {authKey: 123, userType: friend, preferences: {theme: dark}}
sessionId (DEF) → {authKey: 123, userType: friend, preferences: {theme: red}}
sessionId (TBC) → {authKey: 123, userType: friend, preferences: {theme: blue}}
authKey (123) → [ABC, DEF, TBC]  // List of all sessions
```

---

### Phase 2: Rate Limiting & Blacklisting 🛡️
**Goal:** Throttle abusive sessionIds and blacklist violators

**Rate Limits:**
- 10 requests / second
- 200 requests / hour  
- 1000 requests / day

**Enforcement:**
```typescript
if (violates_limit) {
  blacklist(sessionId);
  delete_preferences(sessionId);
  reject_all_future_requests();
}
```

**Per SessionId** - Not per authKey (important!)

---

### Phase 3: Compromised Key Detection 📧
**Goal:** Detect when auth key is compromised, alert admin

**Detection Logic:**
```typescript
if (authKey has 2+ blacklisted sessions) {
  key_is_compromised = true;
  send_email_to(jamescannon4237@gmail.com);
}
```

**Email Contains:**
- Compromised authKey
- All violated sessionIds
- Request counts and which rules were broken
- Recommendations for data recovery and key rotation

---

## Quick Implementation Steps

### Phase 1 (Core Functionality)
1. Add SessionInfo storage (sessionId → {authKey, userType, createdAt, lastSeen})
2. Add SessionList storage (authKey → [sessionId, sessionId, ...])
3. Create handshake endpoint that:
   - Looks up preferences by oldSessionId
   - Copies to newSessionId
   - Updates authKey → sessionId mapping
4. Update GET/PUT preferences to use X-Session-Id header
5. Add middleware to track lastSeen for all requests

### Phase 2 (Security)
1. Add rate limit tracking per sessionId (second/hour/day)
2. Create rateLimitMiddleware to check limits on every request
3. Implement blacklistSession when limits exceeded
4. Delete preferences + remove from authKey's session list
5. Reject all future requests from blacklisted sessionIds

### Phase 3 (Monitoring)
1. Check if authKey has 2+ blacklisted sessions
2. If yes, generate detailed violation report
3. Send email to jamescannon4237@gmail.com
4. Include: authKey, sessionIds, violation details, recommendations

---

## Example Scenario

### Multi-Device Usage (Normal)
```
Phone (ABC): authKey=123, theme=dark
Browser1 (DEF): authKey=123, theme=red  
Browser2 (TBC): authKey=123, theme=blue

All three coexist happily ✓
```

### Session Migration (Normal)
```
Browser1 changes sessionId: DEF → GHI

Handshake:
- oldSessionId: DEF
- newSessionId: GHI
- Server copies preferences from DEF to GHI
- Browser1 now uses GHI with same theme (red) ✓
```

### Rate Limit Violation (Abuse)
```
Phone (ABC): Makes 50 requests/second

Phase 2 Triggers:
- Exceeds 10 req/sec limit
- Blacklist ABC
- Delete ABC's preferences
- Reject all future ABC requests ✓
```

### Compromised Key (Abuse)
```
authKey=123 has:
- ABC: blacklisted (rate limit)
- DEF: blacklisted (rate limit)
- TBC: still ok

Phase 3 Triggers:
- 2+ sessions blacklisted
- authKey=123 likely compromised
- Email sent to admin ✓
```

---

## File Locations

**Implementation Plan:** `SESSION_IMPLEMENTATION_PLAN.md` (detailed)
**This Summary:** `SESSION_QUICK_REFERENCE.md`
**Original Requirements:** `SESSION_HANDSHAKE_TODO.md`

**Code Changes:**
- `workers/task-api/src/index.ts` - Add endpoints + middleware
- `workers/task-api/src/session.ts` - Session management logic (new file)
- `workers/task-api/src/rate-limit.ts` - Rate limiting logic (new file)
- `workers/task-api/src/email.ts` - Email alerts (new file)
- `workers/util/types.ts` - Add interfaces

---

## Testing Checklist

### Phase 1
- [ ] Handshake with oldSessionId=null (first load)
- [ ] Handshake with existing oldSessionId (migration)
- [ ] Three devices, same authKey, different preferences
- [ ] Preferences stay separate per device

### Phase 2
- [ ] Exceed per-second limit → blacklist
- [ ] Exceed per-hour limit → blacklist
- [ ] Blacklisted session is rejected
- [ ] Preferences deleted on blacklist

### Phase 3
- [ ] Two sessions blacklisted → email sent
- [ ] Email contains correct violation info
- [ ] Admin can review alerts via API

---

## Key Decisions Made

1. **Preferences are per sessionId, not per authKey**
   - Allows device-specific settings
   - Each device maintains its own theme, button visibility, etc.

2. **Rate limiting is per sessionId, not per authKey**
   - Prevents one bad device from blocking all devices
   - Isolates abuse to specific session

3. **Multiple blacklists trigger compromise alert**
   - If 2+ sessions from same authKey are blacklisted
   - Indicates key is likely compromised, not just one bad device

4. **Never delete old sessionId data (except on blacklist)**
   - User might return to old device
   - Preferences persist across long gaps

5. **Email alerts require manual intervention**
   - Automated response could be wrong
   - Admin reviews and takes appropriate action

---

## Next Steps

1. **Read full plan:** `SESSION_IMPLEMENTATION_PLAN.md`
2. **Implement Phase 1:** Session management + handshake
3. **Test Phase 1:** Multi-device scenario
4. **Implement Phase 2:** Rate limiting + blacklist
5. **Test Phase 2:** Trigger rate limits
6. **Implement Phase 3:** Email alerts
7. **Test Phase 3:** Trigger compromised key detection
8. **Deploy:** Push to production with monitoring

---

## Questions?

See detailed implementation plan: `SESSION_IMPLEMENTATION_PLAN.md`

Contains:
- Complete code examples
- TypeScript interfaces
- Storage schema
- Testing strategy
- Security considerations
- Migration path
- Monitoring recommendations
