# Worker Utilities - Quick Reference

Shared utilities for Cloudflare Workers. Generic, reusable patterns extracted from production workers.

**Import:** `import { ... } from '../../util'`

---

## Files

```
workers/util/
├── types.ts        # TypeScript type definitions
├── auth.ts         # Authentication middleware
├── context.ts      # Request context extraction
├── validation.ts   # Input validation
├── cors.ts         # CORS configuration
├── logging.ts      # Structured logging
├── masking.ts      # Data masking for safe logging
├── responses.ts    # HTTP response helpers
└── index.ts        # Barrel export
```

---

## auth.ts

**Key-based authentication:**

```typescript
app.use(
  '*',
  createKeyAuth((env) => ({
    [env.ADMIN_KEY]: 'admin',
    [env.FRIEND_KEY]: 'friend',
  }))
);
```

**Functions:**

- `createKeyAuth(keyMap, options?)` - Simple key → userType mapping
- `createAuthMiddleware(config)` - Custom auth logic
- `validateKeyAndGetType(key, adminKeys, friendKeys)` - Validate key & return userType
- `parseKeysFromEnv(jsonString)` - Parse key config from env vars
- `getAuthContext(c)` - Get auth from context
- `requireUserType(['admin', 'friend'])` - Restrict routes

**Adds to context:** `c.get('authContext')` → `{ userType, isAdmin, isFriend, isPublic }`

---

## masking.ts

**Mask sensitive data for logging:**

```typescript
logRequest('POST', '/session/create', {
  sessionId: maskSessionId(sessionId), // "1a2b3c4d5e6f7g8h..."
  key: maskKey(authKey), // "admin-se..."
});
```

**Functions:**

- `maskKey(key, length?)` - Mask key (show first 8 chars by default)
- `maskSessionId(id)` - Mask session ID (show first 16 chars)
- `maskEmail(email)` - Mask email (show first char + domain)
- `redactFields(obj, fields)` - Redact sensitive fields from objects

**Constants:**

- `MASKING.KEY_PREFIX_LENGTH` - Default key prefix length (8)
- `MASKING.SESSION_ID_PREFIX_LENGTH` - Default session ID prefix (16)
- `MASKING.KEY_SUFFIX` - Suffix for masked values ("...")
- `SENSITIVE_FIELDS` - Common sensitive field names

**Examples:**

```typescript
maskKey('admin-secret-key-123'); // "admin-se..."
maskSessionId('1a2b3c4d5e6f7g8h9i0j'); // "1a2b3c4d5e6f7g8h..."
maskEmail('john@example.com'); // "j***@example.com"

redactFields({ username: 'john', password: 'secret' }, ['password']);
// { username: 'john', password: '[REDACTED]' }
```

---

**Extract common fields:**

```typescript
const { userId, sessionId } = extractUserContext(c);
const boardId = extractField(c, ['query:boardId', 'body:boardId'], 'main');
```

**Functions:**

- `extractUserContext(c)` - Get userId, sessionId
- `extractField(c, sources, default?, transform?)` - Single field from multiple sources
- `extractContext(c, config)` - Multiple fields at once
- `extractPagination(c)` - Get page, limit, offset
- `extractSorting(c)` - Get sortBy, sortOrder
- `getRequestMetadata(c)` - Get IP, userAgent, country, etc.

**Source format:** `'header:X-User-Id'`, `'query:boardId'`, `'body:title'`

---

## validation.ts

**Validate request data:**

```typescript
const validation = validateFields(body, [
  { field: 'id', required: true, type: 'string' },
  { field: 'title', required: true, minLength: 1, maxLength: 200 },
]);
if (!validation.valid) return validationError(c, validation.errors);
```

**Functions:**

- `validateFields(data, rules)` - Full validation with rules
- `requireFields(data, ['id', 'title'])` - Quick required check
- `validateBody(rules)` - Middleware for auto-validation
- `createValidator(rules)` - Reusable validator function

**CommonRules:**

- `CommonRules.id()` - UUID validation
- `CommonRules.title({ maxLength })` - String 1-200 chars
- `CommonRules.email(required)` - Email pattern
- `CommonRules.url(required)` - URL pattern
- `CommonRules.enum('status', ['active', 'inactive'])` - Enum validation
- `CommonRules.array('tags', options)` - Array validation
- `CommonRules.number('age', { min, max, integer })` - Number constraints

---

## cors.ts

**Standard Hadoku CORS:**

```typescript
app.use('*', createHadokuCors());
```

**Functions:**

- `createHadokuCors(additionalOrigins?)` - Hadoku defaults + custom
- `createCorsMiddleware(config)` - Full custom config
- `matchOrigin(origin, pattern)` - Wildcard matching

**Presets:**

- `CORSPresets.hadoku` - Production Hadoku origins
- `CORSPresets.development` - Includes localhost
- `CORSPresets.production(origins)` - Custom production
- `CORSPresets.publicApi` - Public API (all origins)

---

## logging.ts

**Log requests and errors:**

```typescript
logRequest('GET', '/api/items', { userId, boardId });
logError('POST', '/api/items', 'Validation failed', { errors });
```

**Functions:**

- `logRequest(method, path, context?, level?)` - Log HTTP requests
- `logError(method, path, error, context?)` - Log errors
- `createLogger(config)` - Custom logger instance
- `createRequestLogger(method, path, baseContext)` - Request-scoped logger
- `startTimer()` - Performance timing (`timer.end(message, context)`)
- `redactFields(obj, fields)` - Remove sensitive data

**Constants:**

- `SENSITIVE_FIELDS` - Common sensitive field names (password, apiKey, token, etc.)

---

## responses.ts

**Standard HTTP responses:**

```typescript
return ok(c, { items });
return created(c, { item });
return badRequest(c, 'Missing field: id');
return notFound(c, 'Task');
```

**Success:**

- `ok(c, data, message?)` - 200
- `created(c, data, message?)` - 201
- `noContent(c)` - 204

**Errors:**

- `badRequest(c, message, details?)` - 400
- `unauthorized(c, message?)` - 401
- `forbidden(c, message?)` - 403
- `notFound(c, resource?)` - 404
- `conflict(c, message, details?)` - 409
- `serverError(c, message, details?)` - 500
- `validationError(c, errors)` - 400 with validation details

**Health & Error Handling:**

- `healthCheck(c, service, checks?)` - Health check response
- `createHealthCheckHandler(service, config)` - Health check handler factory
- `handleError(c, error, message)` - Generic error handler
- `withErrorHandling(handler)` - Async error wrapper

---

## types.ts

**Import types:**

```typescript
import type {
  UserType, // 'admin' | 'friend' | 'public'
  AuthContext, // { userType, userId?, isAdmin, isFriend, isPublic }
  ValidationRule, // { field, required?, type?, minLength?, ... }
  ValidationResult, // { valid, errors }
  LoggerConfig, // { prefix?, minLevel?, includeTimestamp? }
  CORSConfig, // { origins, methods, allowedHeaders, ... }
} from '../../util';
```

---

## Common Patterns

### Minimal Worker

```typescript
import { Hono } from 'hono';
import {
  createKeyAuth,
  createHadokuCors,
  extractUserContext,
  ok,
} from '../../util';

const app = new Hono();

app.use('*', createHadokuCors());
app.use(
  '*',
  createKeyAuth((env) => ({
    [env.ADMIN_KEY]: 'admin',
    [env.FRIEND_KEY]: 'friend',
  }))
);

app.get('/api/items', async (c) => {
  const { userId } = extractUserContext(c);
  const items = await getItems(userId);
  return ok(c, { items });
});

export default app;
```

### With Validation

```typescript
app.post('/api/items', async (c) => {
  const body = await c.req.json();

  const validation = validateFields(body, [
    CommonRules.id(),
    CommonRules.title({ maxLength: 200 }),
  ]);

  if (!validation.valid) {
    return validationError(c, validation.errors);
  }

  const item = await createItem(body);
  return created(c, { item });
});
```

### With Logging

```typescript
app.post('/api/items', async (c) => {
  const { userId } = extractUserContext(c);
  logRequest('POST', '/api/items', { userId });

  try {
    const item = await createItem(body);
    return created(c, { item });
  } catch (error) {
    logError('POST', '/api/items', error.message, { userId });
    return serverError(c, 'Failed to create item');
  }
});
```

---

## See Also

- **docs/PARENT_API_EXPECTATIONS.md** - Handler patterns for child packages
- **docs/PARENT_INTEGRATION.md** - Integration contract for parent/child
- **workers/WORKER_TEMPLATE.md** - Template for new API workers
