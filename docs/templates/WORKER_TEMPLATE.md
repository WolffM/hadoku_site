# Worker Template - Standard Structure

This template shows the standard structure for creating new API workers at Hadoku using shared utilities.

## Quick Start

```bash
# 1. Create new worker directory
mkdir -p workers/myapp-api/src

# 2. Copy this template to workers/myapp-api/src/index.ts
# 3. Install dependencies
cd workers/myapp-api
npm init -y
npm install hono @cloudflare/workers-types
npm install --save-dev wrangler typescript

# 4. Configure wrangler.toml (see below)
# 5. Implement your storage adapter and routes
# 6. Deploy: wrangler deploy
```

## Standard Worker Structure

```
workers/
├── util/                      # Shared utilities (already exists)
│   ├── auth.ts
│   ├── context.ts
│   ├── validation.ts
│   ├── cors.ts
│   ├── logging.ts
│   ├── responses.ts
│   └── index.ts
│
└── myapp-api/                 # Your new API worker
    ├── src/
    │   └── index.ts           # Main worker file (see template below)
    ├── wrangler.toml          # Worker configuration
    ├── package.json
    └── tsconfig.json
```

## Template: `workers/myapp-api/src/index.ts`

```typescript
/**
 * MyApp API Worker - Universal Adapter
 *
 * This worker acts as a thin adapter layer. It imports the framework-agnostic
 * API logic from the `@wolffm/myapp` package and adapts it to the Hono/Cloudflare
 * Worker environment.
 *
 * The core business logic resides in the child package, not here.
 */
import { Hono, type Context } from 'hono';
import { MyAppHandlers } from '@wolffm/myapp/api';
import type {
  MyAppStorage,
  AuthContext as MyAppAuthContext,
  UserType,
  // Import other types from your child package
} from '@wolffm/myapp/api';
import {
  createKeyAuth,
  createHadokuCors,
  extractUserContext,
  extractField,
  requireFields,
  ok,
  created,
  badRequest,
  healthCheck,
  logRequest,
  logError,
} from '../../util';

// ============================================================================
// Environment & Context Types
// ============================================================================

interface Env {
  ADMIN_KEY: string;
  FRIEND_KEY: string;
  MYAPP_KV: KVNamespace; // Or D1Database, R2Bucket, etc.
  // Add other environment bindings here
}

type AppContext = {
  Bindings: Env;
  Variables: {
    authContext: MyAppAuthContext;
  };
};

const app = new Hono<AppContext>();

// ============================================================================
// 1. CORS Middleware
// ============================================================================

app.use(
  '*',
  createHadokuCors([
    'https://myapp-api.hadoku.me', // Add your API subdomain
    // Add other allowed origins
  ])
);

// ============================================================================
// 2. Authentication Middleware
// ============================================================================

app.use(
  '*',
  createKeyAuth<Env>(
    (env) => ({
      [env.ADMIN_KEY]: 'admin',
      [env.FRIEND_KEY]: 'friend',
    }),
    {
      sources: ['header:X-User-Key', 'query:key'],
      defaultUserType: 'public',
      includeHelpers: true,
    }
  )
);

// ============================================================================
// 3. Storage Adapter Implementation
// ============================================================================

/**
 * Adapt Cloudflare KV (or D1, R2, etc.) to your child package's storage interface
 * This is YOUR responsibility as the parent - adapt storage to the environment.
 */
function createKVStorage(env: Env): MyAppStorage {
  return {
    // Implement storage methods required by your child package
    async getItems(userType: UserType, userId?: string) {
      const key = `items:${userType}:${userId || 'public'}`;
      const data = await env.MYAPP_KV.get(key, 'json');
      return data || { items: [] };
    },

    async saveItems(userType: UserType, userId: string | undefined, data: any) {
      const key = `items:${userType}:${userId || 'public'}`;
      await env.MYAPP_KV.put(key, JSON.stringify(data));
    },

    // Add other storage methods as required by MyAppStorage interface
  };
}

// ============================================================================
// 4. Health Check
// ============================================================================

app.get('/myapp/api/health', (c) =>
  healthCheck(c, 'myapp-api-adapter', { kv: true })
);

// ============================================================================
// 5. Helper to get storage and auth from context
// ============================================================================

const getContext = (c: Context<AppContext>) => ({
  storage: createKVStorage(c.env),
  auth: c.get('authContext'),
});

// ============================================================================
// 6. API Routes - Thin adapters to MyAppHandlers
// ============================================================================

// GET /myapp/api/items - List all items
app.get('/myapp/api/items', async (c) => {
  const { storage, auth } = getContext(c);
  const { userId } = extractUserContext(c);

  logRequest('GET', '/myapp/api/items', { userType: auth.userType, userId });

  const result = await MyAppHandlers.getItems(storage, { ...auth, userId });
  return ok(c, result);
});

// POST /myapp/api/items - Create new item
app.post('/myapp/api/items', async (c) => {
  const { storage, auth } = getContext(c);
  const body = await c.req.json();
  const { userId } = extractUserContext(c);

  // Validate required fields
  const error = requireFields(body, ['id', 'title']);
  if (error) {
    logError('POST', '/myapp/api/items', error);
    return badRequest(c, error);
  }

  logRequest('POST', '/myapp/api/items', {
    userType: auth.userType,
    userId,
    itemId: body.id,
  });

  const result = await MyAppHandlers.createItem(
    storage,
    { ...auth, userId },
    body
  );
  return created(c, result);
});

// PATCH /myapp/api/items/:id - Update item
app.patch('/myapp/api/items/:id', async (c) => {
  const { storage, auth } = getContext(c);
  const id = c.req.param('id');
  const body = await c.req.json();
  const { userId } = extractUserContext(c);

  if (!id || id.trim() === '') {
    logError('PATCH', '/myapp/api/items/:id', 'Missing item ID in URL');
    return badRequest(c, 'Missing required parameter: item ID');
  }

  logRequest('PATCH', `/myapp/api/items/${id}`, {
    userType: auth.userType,
    userId,
    itemId: id,
  });

  const result = await MyAppHandlers.updateItem(
    storage,
    { ...auth, userId },
    id,
    body
  );
  return ok(c, result);
});

// DELETE /myapp/api/items/:id - Delete item
app.delete('/myapp/api/items/:id', async (c) => {
  const { storage, auth } = getContext(c);
  const id = c.req.param('id');
  const { userId } = extractUserContext(c);

  if (!id || id.trim() === '') {
    logError('DELETE', '/myapp/api/items/:id', 'Missing item ID in URL');
    return badRequest(c, 'Missing required parameter: item ID');
  }

  logRequest('DELETE', `/myapp/api/items/${id}`, {
    userType: auth.userType,
    userId,
    itemId: id,
  });

  const result = await MyAppHandlers.deleteItem(
    storage,
    { ...auth, userId },
    id
  );
  return ok(c, result);
});

// Add more routes as needed based on your child package's API_SPEC.md

export default app;
```

## Configuration Files

### `workers/myapp-api/wrangler.toml`

```toml
name = "myapp-api"
main = "src/index.ts"
compatibility_date = "2024-10-01"

# KV Namespace Bindings
[[kv_namespaces]]
binding = "MYAPP_KV"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"

# Secrets (set via wrangler secret put)
# - ADMIN_KEY
# - FRIEND_KEY

# Routes
[[routes]]
pattern = "myapp-api.hadoku.me/*"
zone_name = "hadoku.me"

[build]
command = ""
```

### `workers/myapp-api/package.json`

```json
{
  "name": "myapp-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "tail": "wrangler tail"
  },
  "dependencies": {
    "hono": "^4.6.11",
    "@wolffm/myapp": "^1.0.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20241011.0",
    "wrangler": "^3.80.4",
    "typescript": "^5.6.3"
  }
}
```

### `workers/myapp-api/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Development Workflow

### 1. Local Development

```bash
# Start local dev server
cd workers/myapp-api
wrangler dev

# Test endpoints
curl http://localhost:8787/myapp/api/health
curl -H "X-User-Key: your-admin-key" http://localhost:8787/myapp/api/items
```

### 2. Set Secrets

```bash
# Set secrets for local development
echo "your-admin-key" | wrangler secret put ADMIN_KEY --env local
echo "your-friend-key" | wrangler secret put FRIEND_KEY --env local

# Set secrets for production
echo "your-admin-key" | wrangler secret put ADMIN_KEY
echo "your-friend-key" | wrangler secret put FRIEND_KEY
```

### 3. Deploy

```bash
# Deploy to production
wrangler deploy

# View logs
wrangler tail
```

### 4. Add to GitHub Actions

Update `.github/workflows/deploy-workers.yml`:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # ... existing steps ...

      # Add your worker
      - name: Deploy myapp-api
        run: |
          cd workers/myapp-api
          npm install
          npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          ADMIN_KEY: ${{ secrets.ADMIN_KEY }}
          FRIEND_KEY: ${{ secrets.FRIEND_KEY }}
```

## Best Practices

### 1. Use Utilities Consistently

```typescript
// ✅ Good - Use utility functions
const { userId } = extractUserContext(c);
const boardId = extractField(c, ['query:boardId', 'body:boardId'], 'main');
logRequest('GET', '/api/items', { userId, boardId });
return ok(c, { items });

// ❌ Bad - Manual extraction and logging
const userId = c.req.header('X-User-Id') || c.req.query('userId');
console.log('[GET /api/items] userId:', userId);
return c.json({ items });
```

### 2. Validate Early

```typescript
// ✅ Good - Validate at the start
const error = requireFields(body, ['id', 'title']);
if (error) {
  logError('POST', '/api/items', error);
  return badRequest(c, error);
}
// ... proceed with handler

// ❌ Bad - Deep validation logic
if (!body.id) {
  return c.json({ error: 'Missing id' }, 400);
}
if (!body.title || body.title.trim() === '') {
  return c.json({ error: 'Missing title' }, 400);
}
```

### 3. Use Standard Responses

```typescript
// ✅ Good - Standard responses
return ok(c, data);
return created(c, newItem);
return badRequest(c, 'Invalid input');

// ❌ Bad - Manual JSON responses
return c.json({ data }, 200);
return c.json({ item: newItem }, 201);
return c.json({ error: 'Invalid input' }, 400);
```

### 4. Keep Adapter Thin

```typescript
// ✅ Good - Delegate to child package
const result = await MyAppHandlers.createItem(storage, auth, data);

// ❌ Bad - Business logic in adapter
const newItem = {
  id: crypto.randomUUID(),
  ...data,
  createdAt: new Date().toISOString(),
};
await storage.saveItem(newItem);
```

## Checklist for New Workers

- [ ] Created worker directory under `workers/`
- [ ] Copied and adapted template to `src/index.ts`
- [ ] Configured `wrangler.toml` with correct bindings
- [ ] Set up `package.json` with dependencies
- [ ] Implemented storage adapter for child package
- [ ] Added all routes from child package's `API_SPEC.md`
- [ ] Used utilities from `workers/util/` consistently
- [ ] Tested locally with `wrangler dev`
- [ ] Set production secrets with `wrangler secret put`
- [ ] Added worker to `.github/workflows/deploy-workers.yml`
- [ ] Deployed and verified endpoints work
- [ ] Updated route config if using edge-router fallback

## Need Help?

- See `workers/util/README.md` for utility documentation
- See `workers/task-api/src/index.ts` for a real-world example
- See child package's `INTEGRATION.md` for specific setup instructions
