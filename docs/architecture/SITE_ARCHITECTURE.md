# Architecture Overview - Hadoku Site

**Last Updated:** November 10, 2025

## System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION ENVIRONMENT                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  Cloudflare Worker: edge-router (hadoku.me/*)                  │    │
│  │  • Framework: Hono 4.10                                        │    │
│  │  • Intelligent fallback routing (tunnel → worker → static)     │    │
│  │  • Session management with KV storage                          │    │
│  │  • Analytics Engine logging (SQL-queryable)                    │    │
│  │  • Shared utilities from @hadoku/worker-utils                  │    │
│  └────────────────────────────────────────────────────────────────┘    │
│         ↓                           ↓                      ↓           │
│  ┌───────────────┐   ┌───────────────────────┐   ┌──────────────────┐  │
│  │  Tunnel       │   │  Cloudflare Workers   │   │  GitHub Pages    │  │
│  │  (Priority 1) │   │  (Priority 2)         │   │  (Fallback)      │  │
│  ├───────────────┤   ├───────────────────────┤   ├──────────────────┤  │
│  │ localhost     │   │ task-api worker       │   │ Static HTML/JS   │  │
│  │ via tunnel    │   │ • Hono framework      │   │ • Astro build    │  │
│  │ (dev/home)    │   │ • @wolffm/task pkg    │   │ • Micro-frontends│  │
│  │               │   │ • Workers KV storage  │   │                  │  │
│  │               │   │ • Shared utilities    │   │                  │  │
│  └───────────────┘   └───────────────────────┘   └──────────────────┘  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                    SHARED UTILITIES (@hadoku/worker-utils)             │
├────────────────────────────────────────────────────────────────────────┤
│  workers/util/ (workspace package)                                     │
│  • Authentication (createAuthMiddleware, validateKeyAndGetType)        │
│  • CORS (createCorsMiddleware with wildcard origin support)            │
│  • Validation (isNonEmptyString, validateFields, sanitizeString)       │
│  • Logging (logRequest, logError with consistent format)               │
│  • Masking (maskKey, maskSessionId, maskEmail for safe logging)        │
│  • Responses (badRequest, serverError, ok, created - Hono helpers)     │
│  • Context extraction (extractField, parseBody, getRequestMetadata)    │
│                                                                        │
│  Used by both edge-router and task-api for consistent patterns         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                      GITHUB PACKAGES                     │
├────────────────────────────────────────────────────────────────────────┤
│  @wolffm/task                                                   │
│  • TaskHandlers (pure business logic functions)                        │
│  • TaskStorage (interface for parent to implement)                     │
│  • AuthContext, Task types (TypeScript definitions)                    │
│                                                                        │
│  Published by child → Downloaded by parent → Used in task-api worker   │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                       DEVELOPMENT ENVIRONMENT                          │
├────────────────────────────────────────────────────────────────────────┤
│  Astro Dev Server (localhost:4321)                                     │
│  • Serves static site locally                                          │
│  • Hot module reloading                                                │
│  • No API routing (use worker or tunnel)                               │
└────────────────────────────────────────────────────────────────────────┘
```

## Request Flow

### Production (hadoku.me)

#### Static Content Request

```
1. Browser → https://hadoku.me/
2. edge-router receives request
3. Checks if path starts with /task/api
4. No → Proxies to GitHub Pages (STATIC_ORIGIN)
5. GitHub Pages returns static HTML + JS bundles
6. edge-router logs request to Analytics Engine (backend='static')
7. Response → Browser with X-Backend-Source: static
```

#### API Request (with Tunnel Running)

```
1. Browser → https://hadoku.me/task/api/tasks
2. edge-router receives request
3. Path starts with /task/api → handleApiRoute()
4. Reads ROUTE_CONFIG: priority "12" (tunnel, then worker)
5. Try priority "1": https://local-api.hadoku.me/task/api/tasks
6. Success! (2500ms timeout)
7. edge-router logs request to Analytics Engine (backend='tunnel')
8. Response → Browser with X-Backend-Source: tunnel
```

#### API Request (Tunnel Down - Fallback to Worker)

```
1. Browser → https://hadoku.me/task/api/tasks
2. edge-router receives request
3. Try priority "1": https://local-api.hadoku.me/task/api/tasks
4. Fails (connection refused or timeout)
5. Try priority "2": https://task-api.hadoku.me/task/api/tasks
6. task-api Worker responds:
   - Imports @wolffm/task from GitHub Packages
   - Calls TaskHandlers with Workers KV storage adapter
   - KV storage persists to TASKS_KV namespace
7. edge-router logs request to Analytics Engine (backend='worker')
8. Response → Browser with X-Backend-Source: worker
```

### Development (localhost:4321)

#### Local Dev Request

```
1. Browser → http://localhost:4321/task
2. Astro dev server receives request
3. Serves static HTML + micro-frontend bundles
4. Response → Browser

Note: In development, the task app uses public mode (localStorage).
For API testing, point directly to deployed workers or tunnel.
```

## Technology Stack

### Frontend

- **Framework:** Astro 5.1.6 (static site generation)
- **Architecture:** Micro-frontends with dynamic loading
- **Child Apps:** React 18.3.1 (bundled with Vite)
- **Styling:** CSS (scoped per app)
- **Loader:** Custom mf-loader.js (dynamic imports with key validation)
- **Registry:** Auto-generated registry.json from public/mf/

### Backend - Cloudflare Workers

Both workers share a unified architecture built on Hono framework with shared utilities.

**edge-router:**

- **Framework:** Hono 4.10
- **Features:** Intelligent fallback routing, session management, Analytics Engine logging
- **Dependencies:** @hadoku/worker-utils
- **Storage:** Workers KV (SESSIONS_KV namespace for session→key mapping)
- **Security:** Key injection from sessions, CORS middleware

**task-api:**

- **Framework:** Hono 4.10
- **Package:** @wolffm/task (Universal Adapter from GitHub Packages)
- **Dependencies:** @hadoku/worker-utils
- **Storage:** Workers KV (TASKS_KV namespace for task data)
- **Security:** Auth middleware, key validation, throttling

**@hadoku/worker-utils** (Shared Utilities):

- **Authentication:** createAuthMiddleware, validateKeyAndGetType, parseKeysFromEnv
- **CORS:** createCorsMiddleware with wildcard origin support
- **Validation:** isNonEmptyString, validateFields, sanitizeString
- **Logging:** logRequest, logError with consistent structured format
- **Masking:** maskKey, maskSessionId, maskEmail for safe logging
- **Responses:** badRequest, serverError, ok, created, etc. (Hono helpers)
- **Context:** extractField, parseBody, getRequestMetadata

### Development

- **Runtime:** Astro dev server for static site
- **API Testing:** Use deployed workers or tunnel directly
- **Local Mode:** Task app uses public mode (localStorage)
- **Storage:** localStorage for public users, Workers KV for authenticated users

### Universal Adapter Pattern

- **Child Packages:** @wolffm/task, @wolffm/watchparty (private GitHub Packages)
- **Exports:** TaskHandlers (pure functions), TaskStorage (interface), types
- **Parent Implementation:** Workers implement storage adapters + HTTP layers
- **Deployment:** Child publishes → triggers parent update via repository_dispatch
- **Decoupling:** Child knows nothing about parent's HTTP framework or storage

### Routing & Networking

- **Production Edge:** Cloudflare Worker at hadoku.me/\*
- **Worker APIs:** task-api.hadoku.me (Cloudflare Workers custom domain)
- **Tunnel:** local-api.hadoku.me → localhost (Cloudflare Tunnel for dev/home)
- **Static:** GitHub Pages (wolffm.github.io/hadoku_site)

### Build & Deploy

- **Static Build:** Astro → dist/ (HTML, CSS, JS bundles)
- **Worker Build:** wrangler build (TypeScript → JavaScript)
- **Worker Deploy:** GitHub Actions → wrangler deploy
- **Package Download:** npm install with DEPLOY_PACKAGE_TOKEN (GitHub PAT)
- **CI/CD:** Three workflows (deploy-workers.yml, deploy.yml, update-packages.yml)
- **Secrets:** GitHub Secrets injected into Workers at deploy time

## Key Design Patterns

### 1. Universal Adapter Pattern

The core architectural pattern that decouples child app logic from parent infrastructure.

**Child Package (@wolffm/task):**

```typescript
// Exports pure business logic functions
export const TaskHandlers = {
  getTasks: (storage: TaskStorage, auth: AuthContext) => {
    /* ... */
  },
  createTask: (storage: TaskStorage, auth: AuthContext, data: TaskData) => {
    /* ... */
  },
  // ... more handlers
};

// Exports storage interface (parent implements)
export interface TaskStorage {
  getFile<T>(path: string): Promise<T>;
  saveFile(path: string, data: unknown): Promise<void>;
}

// Exports types
export type AuthContext = { userType: UserType };
```

**Parent Implementation (workers/task-api):**

```typescript
// Parent implements storage adapter
const storage: TaskStorage = {
  getFile: async <T>(path: string): Promise<T> => {
    const response = await fetch(githubApiUrl, {
      /* ... */
    });
    return JSON.parse(content);
  },
  saveFile: async (path: string, data: unknown) => {
    await fetch(githubApiUrl, { method: 'PUT' /* ... */ });
  },
};

// Parent calls child handlers
app.get('/task/api/tasks', authenticate, async (c) => {
  const { storage, auth } = getContext(c);
  const tasks = await TaskHandlers.getTasks(storage, auth);
  return c.json(tasks);
});
```

**Benefits:**

- Child doesn't know about Hono, Workers KV, or Cloudflare Workers
- Parent can swap storage (KV → D1 → R2) without changing child
- Child can be tested independently with mock storage
- Multiple parents can use same child (Workers, Express, Deno)

### 2. Intelligent Edge Routing

```typescript
// workers/edge-router/src/index.ts
async function handleApiRoute(request: Request, env: Env) {
  const bases = basesFor(url.pathname, env); // ["tunnel", "worker"]

  for (const base of bases) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(targetUrl, { signal: controller.signal });
      if (response.ok) {
        return { response, backend }; // Success!
      }
    } catch (err) {
      continue; // Try next backend
    }
  }

  return fallbackResponse(); // All backends failed
}
```

### 3. Priority-Based Routing Config

```json
// ROUTE_CONFIG GitHub Secret (injected at deploy time)
{
  "global_priority": "12",
  "routes": {
    "task": { "priority": "12" }
  },
  "providers": {
    "1": "https://local-api.hadoku.me",
    "2": "https://task-api.hadoku.me"
  }
}
```

### 4. Analytics Engine Logging (Zero Setup)

```typescript
// workers/edge-router/src/logging/analytics-provider.ts
export async function logToAnalytics(env: Env, entry: LogEntry) {
  await env.ANALYTICS_ENGINE.writeDataPoint({
    blobs: [entry.path, entry.userAgent],
    doubles: [entry.duration, entry.status],
    indexes: [entry.backend, entry.method],
  });
}

// Query in Cloudflare Dashboard with SQL:
// SELECT backend, COUNT(*) FROM ANALYTICS_ENGINE GROUP BY backend
// SELECT AVG(double2) as avg_duration FROM ANALYTICS_ENGINE WHERE index1 = 'worker'
```

### 5. GitHub Packages Integration

```yaml
# .github/workflows/deploy-workers.yml
- name: Configure npm for GitHub Packages
  run: |
    echo "@wolffm:registry=https://npm.pkg.github.com" >> .npmrc
    echo "//npm.pkg.github.com/:_authToken=${{ secrets.DEPLOY_PACKAGE_TOKEN }}" >> .npmrc

- name: Install dependencies (includes @wolffm/task)
  run: npm install
  working-directory: workers/task-api
```

**package.json:**

```json
{
  "dependencies": {
    "@wolffm/task": "^1.0.0"
  }
}
```

### 6. Repository Dispatch (Auto-Update)

When child publishes new package version, it triggers parent update.

**Child workflow (task repo):**

```yaml
- name: Trigger parent update
  run: |
    gh api repos/WolffM/hadoku_site/dispatches \
      -f event_type=update-packages \
      -f client_payload[package]=@wolffm/task \
      -f client_payload[version]=${{ steps.version.outputs.version }}
```

**Parent workflow (hadoku_site):**

```yaml
on:
  repository_dispatch:
    types: [update-packages]

jobs:
  update:
    - run: npm update @wolffm/task
    - run: git commit -am "chore: update @wolffm/task to ${{ github.event.client_payload.version }}"
    - run: git push
```

## User Types & Permissions

| User Type  | Auth       | Storage      | Backend                   | Operations           |
| ---------- | ---------- | ------------ | ------------------------- | -------------------- |
| **Public** | None       | localStorage | Browser only              | CRUD (local only)    |
| **Friend** | Friend Key | GitHub repo  | task-api Worker or tunnel | CRUD + Stats         |
| **Admin**  | Admin Key  | GitHub repo  | task-api Worker or tunnel | CRUD + Stats + Clear |

## Environment Variables

### Production (GitHub Secrets)

Used by GitHub Actions workflows for deployment.

```bash
# Cloudflare Workers Deployment
CLOUDFLARE_API_TOKEN=<cloudflare-api-token>
CLOUDFLARE_ACCOUNT_ID=<cloudflare-account-id>

# GitHub Packages (for downloading private @wolffm/task package)
DEPLOY_PACKAGE_TOKEN=<github-pat-with-read:packages>

# Routing Configuration (JSON, injected into edge-router)
ROUTE_CONFIG='{"global_priority":"12","routes":{"task":{"priority":"12"}},"providers":{"1":"https://local-api.hadoku.me","2":"https://task-api.hadoku.me"}}'

# Worker Secrets (set via wrangler secret put in deploy workflow)
ADMIN_KEY=<production-uuid>
FRIEND_KEY=<production-uuid>
```

### Production Workers (Runtime)

**edge-router** (wrangler.toml vars section):

```toml
[vars]
ROUTE_CONFIG = "${ROUTE_CONFIG}"  # Injected from GitHub Secret
STATIC_ORIGIN = "https://wolffm.github.io/hadoku_site"

[[analytics_engine_datasets]]
binding = "ANALYTICS_ENGINE"
```

**task-api** (wrangler secrets, set via CLI):

- `ADMIN_KEY` - Admin authentication key
- `FRIEND_KEY` - Friend authentication key

### Local Development

Local development uses Astro dev server for static site only. API testing is done against deployed workers or tunnel.

```bash
# Not needed for local Astro dev server
# Point task app to deployed worker or use public mode (localStorage)
```

## API Endpoints

### Edge Router (hadoku.me/\*)

All requests go through edge-router for intelligent fallback.

| Path                | Backend          | Description                                     |
| ------------------- | ---------------- | ----------------------------------------------- |
| `/*`                | GitHub Pages     | Static Astro site (HTML, CSS, JS)               |
| `/session/create`   | edge-router      | Create session from authKey (returns sessionId) |
| `/task/api/*`       | Tunnel or Worker | Task API (fallback chain)                       |
| `/watchparty/api/*` | Tunnel only      | Watchparty API (home server)                    |

### Session Management

| Method | Path              | Headers                 | Description                             |
| ------ | ----------------- | ----------------------- | --------------------------------------- |
| POST   | `/session/create` | `X-User-Key: {authKey}` | Create session, returns `{ sessionId }` |

### Task API (task-api.hadoku.me/task/api/\*)

Accessed via edge-router or directly. Authenticated endpoints use X-Session-Id header.

| Method | Path                     | Headers        | Description                    | Access       |
| ------ | ------------------------ | -------------- | ------------------------------ | ------------ |
| GET    | `/task/api/`             | None           | Health check                   | Public       |
| POST   | `/task/api/validate-key` | `X-User-Key`   | Validate key & return userType | Public       |
| GET    | `/task/api/stats`        | `X-Session-Id` | Get task stats                 | Admin/Friend |
| POST   | `/task/api/`             | `X-Session-Id` | Create task                    | Admin/Friend |
| PATCH  | `/task/api/:id`          | `X-Session-Id` | Update task                    | Admin/Friend |
| POST   | `/task/api/:id/complete` | `X-Session-Id` | Toggle complete                | Admin/Friend |
| DELETE | `/task/api/:id`          | `X-Session-Id` | Delete task                    | Admin/Friend |
| POST   | `/task/api/clear`        | `X-Session-Id` | Clear all tasks                | Admin only   |

**Note:** Public users use localStorage and never call authenticated APIs.

## Data Flow

### Public Mode (Browser-Only)

```
User Action → React State → localStorage.setItem('tasks', JSON)
           ← React State ← localStorage.getItem('tasks')

No network requests, fully offline capable.
```

### Admin/Friend Mode (Server-Backed via edge-router)

```
User Action → React State → fetch('/task/api/tasks', { X-Session-Id })
           → edge-router Worker → Looks up key from session (SESSIONS_KV)
                                 → Injects X-User-Key into request
                                 → Try local-api.hadoku.me (tunnel)
                                    ↓ (on error)
                                 → Try task-api.hadoku.me (worker)
                                    ↓ (success)
                                 → task-api validates key with auth middleware
                                 → Determines userType (admin/friend/public)
                                 → Workers KV (Cloudflare KV storage)
                                    ↓ (read/write data by sessionId)
           ← JSON Response ← task-api Worker
           ← edge-router (adds X-Backend-Source header)
```

#### Session Management Flow

```
1. Client has authKey (from user input)
2. Client POSTs to /session/create with X-User-Key: {authKey}
3. edge-router:
   - Generates secure sessionId (32 char hex)
   - Stores in SESSIONS_KV: session:{sessionId} → {authKey}
   - TTL: 24 hours
   - Returns { sessionId }
4. Client stores sessionId in sessionStorage
5. All subsequent requests use X-Session-Id header
6. edge-router looks up authKey and injects it as X-User-Key
7. task-api validates key and determines userType

Benefits:
- Keys never sent in request bodies (security)
- Keys only transmitted once during session creation
- Client never needs to store raw key after session creation
- Session expires after 24 hours (auto-cleanup)
```

## Security Model

### Edge Layer (edge-router Worker)

- ✅ Session management with SESSIONS_KV
- ✅ Key injection from sessions (keys in headers only)
- ✅ All requests logged with Analytics Engine (non-blocking)
- ✅ Fallback logic prevents backend exposure
- ✅ X-Backend-Source header reveals which backend served request
- ✅ Timeout protection (2500ms per backend attempt)
- ✅ CORS middleware with explicit allowed headers

### API Layer (task-api Worker)

- ✅ Auth middleware validates X-User-Key header on every request
- ✅ Keys compared against Worker secrets (ADMIN_KEY, FRIEND_KEY)
- ✅ validateKeyAndGetType() determines userType server-side
- ✅ Client-side validation before app mount (prevents dead key usage)
- ✅ CORS configured with DEFAULT_HADOKU_ORIGINS
- ✅ Public mode uses localStorage (zero API calls)
- ✅ Throttling & rate limiting per sessionId
- ✅ Incident tracking for security events

### Key Management

- ✅ Keys never sent in request bodies (headers only)
- ✅ Keys validated on both client and server
- ✅ Dead keys detected and cleared from sessionStorage
- ✅ Session creation returns sessionId (not key)
- ✅ All logging uses maskKey() and maskSessionId() utilities
- ✅ Sensitive data redacted with redactFields() utility

### Workers KV Storage

- ✅ Globally distributed key-value store
- ✅ Data separated by sessionId (supports multi-device)
- ✅ Eventually consistent (typically <60s propagation)
- ✅ Free tier: 100K reads/day, 1K writes/day, 1GB storage
- ✅ In-memory board locking per worker instance

**See [SESSION_ARCHITECTURE.md](./SESSION_ARCHITECTURE.md) for detailed session & storage design decisions.**

## Performance Characteristics

### Public Mode

- **Initial Load:** ~50KB (HTML + JS bundle)
- **Operations:** < 1ms (localStorage)
- **Offline:** ✅ Fully functional
- **Cost:** $0 (zero API calls, zero Worker invocations)

### Admin/Friend Mode (via edge-router)

- **Initial Load:** ~50KB (HTML + JS bundle)
- **Operations:**
  - Tunnel hit: ~50-100ms (local network)
  - Worker fallback: ~20-50ms (Workers KV read latency)
- **Offline:** ❌ Requires API access
- **Cost:** ~5-20 requests/day per user

### Cloudflare Free Tier Limits

- **Workers:** 100,000 requests/day
- **Workers KV:** 100,000 reads/day, 1,000 writes/day, 1GB storage
- **Analytics Engine:** 10,000,000 events/month (all logged)
- **Expected Usage:**
  - Static: ~100-500 requests/day (edge-router → GitHub Pages)
  - API: ~10-50 requests/day (edge-router → task-api)
  - KV: ~20-100 reads/day, ~5-20 writes/day
  - **Total:** < 1% of free tier quota

### Request Latency Breakdown

```
Edge-router overhead:     ~5-10ms
Tunnel latency:          ~20-50ms (local network)
Worker latency:          ~50-100ms (cold start) / ~10-20ms (warm)
Workers KV read:         ~10-30ms (globally distributed)
Workers KV write:        ~20-50ms (with replication)
Total (tunnel):          ~30-70ms
Total (worker fallback): ~80-170ms
```

## Development Workflow

### Local Development

```bash
# 1. Start Astro dev server
pnpm run dev
# Runs: astro dev
# Listens on: http://localhost:4321

# 2. Access site
# Home: http://localhost:4321/
# Task app: http://localhost:4321/task (uses public mode/localStorage)
# Other apps: http://localhost:4321/watchparty, /contact, etc.

# 3. For API testing:
# Option A: Use deployed worker (https://task-api.hadoku.me/task/api/)
# Option B: Use tunnel (https://local-api.hadoku.me/task/api/)
# Option C: Test via edge-router (https://hadoku.me/task/api/)

# Note: Task app automatically detects no X-Admin-Key and uses localStorage
```

### Worker Development

```bash
# 1. Navigate to worker directory
cd workers/task-api

# 2. Install dependencies from root (pnpm workspace)
cd ../../
pnpm install

# 3. Start local worker (uses wrangler)
npx wrangler dev
# Listens on: http://localhost:8787

# 4. Test worker locally
curl http://localhost:8787/task/api/ \
  -H "X-Admin-Key: test-admin-key"

# 5. Deploy to production
npx wrangler deploy
```

### Child Package Development

```bash
# 1. Make changes in child repo (e.g., task-api-task-component)
git add -A
git commit -m "feat: add new handler"
git push

# 2. Child publishes to GitHub Packages automatically
# (Child repo workflow handles publishing)
# Package: @wolffm/task@1.0.1

# 3. Child triggers parent update (repository_dispatch)
# Parent workflow: .github/workflows/update-packages.yml

# 4. Parent updates package.json, commits, and redeploys
# Result: task-api worker uses new @wolffm/task version
```

### Production Deployment

#### Deploy Workers via GitHub Actions

```bash
# 1. Push to GitHub
git add -A
git commit -m "feat: update workers"
git push

# 2. GitHub Actions automatically:
#    - Configures .npmrc with GitHub Packages auth
#    - Installs dependencies (downloads @wolffm/task from GitHub Packages)
#    - Builds both Workers (edge-router, task-api)
#    - Injects ROUTE_CONFIG secret into edge-router
#    - Deploys via wrangler
#    - Sets task-api secrets (ADMIN_KEY, FRIEND_KEY, GITHUB_PAT)

# 3. Monitor deployment
# Visit: https://github.com/WolffM/hadoku_site/actions
# Workflow: deploy-workers.yml
```

#### Deploy Static Site (GitHub Pages)

```bash
# 1. Build Astro static site
pnpm run build
# Output: dist/ (HTML, CSS, JS)

# 2. Deploy via GitHub Actions
# Workflow: .github/workflows/deploy.yml
# Trigger: Push to main or manual dispatch

# 3. GitHub Pages serves from dist/
# URL: https://wolffm.github.io/hadoku_site/

# 4. edge-router proxies static content automatically
# Production URL: https://hadoku.me/
```

### Viewing Logs

#### Real-time Worker Logs

```bash
# Tail edge-router logs
wrangler tail edge-router --format=pretty

# Tail task-api logs
wrangler tail task-api --format=pretty

# Filter by status code
wrangler tail edge-router --status=error

# Filter by method
wrangler tail task-api --method=POST
```

#### Analytics Engine (SQL Queries)

```sql
-- Visit: https://dash.cloudflare.com → Analytics Engine → edge-router

-- Request counts by backend
SELECT
  index1 as backend,
  COUNT(*) as requests
FROM ANALYTICS_ENGINE
GROUP BY backend
ORDER BY requests DESC

-- Average response time by backend
SELECT
  index1 as backend,
  AVG(double2) as avg_duration_ms
FROM ANALYTICS_ENGINE
GROUP BY backend

-- Error rate
SELECT
  COUNT(CASE WHEN double1 >= 400 THEN 1 END) as errors,
  COUNT(*) as total,
  (COUNT(CASE WHEN double1 >= 400 THEN 1 END) * 100.0 / COUNT(*)) as error_rate
FROM ANALYTICS_ENGINE

-- Top paths
SELECT
  blob1 as path,
  COUNT(*) as hits
FROM ANALYTICS_ENGINE
GROUP BY path
ORDER BY hits DESC
LIMIT 10
```

#### GitHub Actions Logs

```bash
# List recent workflow runs
gh run list --workflow=deploy-workers.yml

# View specific run
gh run view <run-id> --log

# Download logs
gh run download <run-id>
```

## File Structure

```
hadoku_site/
├── src/                          # Astro source (static site)
│   ├── pages/
│   │   ├── index.astro          # Home with app directory
│   │   ├── task/index.astro     # Task app page
│   │   ├── watchparty/index.astro
│   │   └── contact/index.astro
│   ├── components/
│   │   ├── hadoku-header.js     # Navigation header
│   │   └── mf-loader.js         # Micro-frontend loader
│   └── layouts/
│       └── Base.astro           # Base layout
│
├── public/                       # Static assets (copied to dist/)
│   └── mf/                      # Micro-frontend bundles (from child repos)
│       ├── registry.json        # Auto-generated app registry
│       ├── task/
│       │   └── index.js         # Task app bundle (React)
│       ├── watchparty/
│       │   └── index.js         # Watchparty bundle (React)
│       ├── contact/
│       │   └── index.js         # Contact form bundle
│       └── home/
│           └── index.js         # Home page app
│
├── workers/                      # Cloudflare Workers (production)
│   ├── util/                    # Shared utilities (@hadoku/worker-utils)
│   │   ├── auth.ts              # Authentication (middleware, key validation)
│   │   ├── cors.ts              # CORS middleware (wildcard origins)
│   │   ├── validation.ts        # Input validation (fields, sanitization)
│   │   ├── logging.ts           # Structured logging (request/error)
│   │   ├── masking.ts           # Data masking (keys, sessions, emails)
│   │   ├── responses.ts         # Hono response helpers (badRequest, ok, etc.)
│   │   ├── context.ts           # Request context extraction
│   │   ├── types.ts             # Shared TypeScript types
│   │   ├── index.ts             # Module exports
│   │   ├── package.json         # Workspace package definition
│   │   └── README.md            # Utilities documentation
│   │
│   ├── edge-router/             # Main traffic router
│   │   ├── src/
│   │   │   ├── index.ts         # Hono app (routing, sessions, fallback)
│   │   │   └── logging/
│   │   │       ├── types.ts     # LogEntry interface
│   │   │       ├── analytics-provider.ts  # Analytics Engine logging
│   │   │       ├── index.ts     # Module exports
│   │   │       └── README.md    # Logging documentation
│   │   ├── wrangler.toml        # Worker config (routes, KV bindings)
│   │   ├── package.json         # Dependencies (hono, @hadoku/worker-utils)
│   │   └── tsconfig.json        # TypeScript config
│   │
│   └── task-api/                # Task API Worker (Universal Adapter)
│       ├── src/
│       │   ├── index.ts         # Hono app + auth middleware
│       │   ├── constants.ts     # Constants (re-exports from util)
│       │   ├── request-utils.ts # Task-specific request utilities
│       │   ├── throttle.ts      # Rate limiting & incident tracking
│       │   ├── session.ts       # Session management
│       │   └── routes/          # API route modules
│       │       ├── session.ts   # Session endpoints
│       │       ├── tasks.ts     # Task CRUD endpoints
│       │       ├── boards.ts    # Board management
│       │       ├── misc.ts      # Health check, validate-key
│       │       └── admin.ts     # Admin-only endpoints
│       ├── wrangler.toml        # Worker config (KV binding, secrets)
│       ├── package.json         # Dependencies (@wolffm/task, hono, @hadoku/worker-utils)
│       └── tsconfig.json        # TypeScript config
│
├── scripts/                      # Build and deployment scripts
│   ├── generate-registry.mjs    # Generate mf/registry.json
│   └── README.md                # Scripts documentation
│
├── .github/
│   └── workflows/
│       ├── deploy-workers.yml   # CI/CD for Workers
│       ├── deploy.yml           # CI/CD for GitHub Pages
│       └── update-packages.yml  # Auto-update child packages
│
├── dist/                         # Build output (gitignored)
│   └── [static files]           # HTML, CSS, JS (served by GitHub Pages)
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md          # This file (system architecture)
│   ├── SESSION_ARCHITECTURE.md  # Session & preference storage design
│   ├── TESTING.md               # Test strategy and coverage
│   ├── SECURITY.md              # Security model and throttling
│   ├── PARENT_API_EXPECTATIONS.md  # Parent app API integration
│   └── archive/                 # Historical analysis documents
│
├── astro.config.mjs              # Astro config (static build)
├── package.json                  # Root dependencies (Astro, scripts)
├── tsconfig.json                 # TypeScript config (excludes workers/)
├── .npmrc.example                # GitHub Packages auth template
└── README.md                     # Project overview
```

## Current State & Roadmap

### ✅ Production System (Fully Operational)

- ✅ **Cloudflare Workers**: edge-router + task-api deployed and serving traffic
- ✅ **Universal Adapter Pattern**: @wolffm/task package from GitHub Packages
- ✅ **GitHub Actions CI/CD**: Automated deployment with package downloads
- ✅ **Analytics Engine**: SQL-queryable logging (10M events/month free tier)
- ✅ **Intelligent Routing**: Fallback logic (tunnel → worker → static)
- ✅ **Workers KV Storage**: Persistent task data in globally distributed KV store
- ✅ **Micro-frontends**: Dynamic loading with auto-generated registry
- ✅ **Authentication**: X-Admin-Key header with admin/friend/public modes
- ✅ **Public Mode**: localStorage-only (zero API calls, fully offline)
- ✅ **Repository Dispatch**: Child packages trigger parent updates automatically

### 🔮 Future Enhancements

#### Performance Optimizations

- **Service Bindings**: Direct Worker-to-Worker communication (eliminate HTTP overhead)
- **Cloudflare KV**: Cache task data for faster reads (GitHub as source of truth)
- **Cache API**: Edge caching for static responses (reduce GitHub API calls)
- **Durable Objects**: Real-time collaboration features

#### Additional Workers

- **watchparty-api**: Watchparty API with Universal Adapter Pattern
- **contact-api**: Contact form submissions with email integration
- **herodraft-api**: Hero Draft API with game state management
- **home-api**: Personal dashboard API

#### Observability & Monitoring

- **Grafana Dashboards**: Visualize Analytics Engine data
- **Cloudflare Notifications**: Alert on error rate spikes or Worker failures
- **Distributed Tracing**: Request trace IDs across edge-router + worker hops
- **Custom Metrics**: Track business metrics (tasks created, completion rates)

#### Security Enhancements

- **Rate Limiting**: Per-user or per-IP rate limiting with Durable Objects
- **JWT Tokens**: Replace static keys with short-lived JWTs
- **Cloudflare Access**: Zero Trust authentication for admin routes
- **WAF Rules**: Block malicious traffic patterns

#### Developer Experience

- **Local Worker Emulation**: Better local testing with Miniflare
- **E2E Testing**: Automated testing of fallback logic
- **Package Versioning**: Semantic versioning for child packages
- **Documentation Site**: Auto-generated API docs from TypeScript types

## Architecture Principles

### 1. Shared Utilities

All workers use the @hadoku/worker-utils package for consistent patterns:

- **Single source of truth** for authentication, validation, logging
- **Type-safe** utilities with TypeScript
- **Reusable** across all workers (edge-router, task-api, future workers)
- **Testable** - utilities can be tested independently

### 2. Hono Framework

Both edge-router and task-api use Hono for routing:

- **Consistent** API across all workers
- **Fast** - optimized for Cloudflare Workers runtime
- **Familiar** - Express-like syntax
- **Type-safe** - full TypeScript support with Context typing

### 3. Session-Based Auth

Keys are never stored or transmitted after initial session creation:

- **Security** - keys in headers only (never in body)
- **Convenience** - client uses sessionId (24hr expiration)
- **Privacy** - all logging uses masked keys/sessions
- **Validation** - client validates before mounting app

### 4. Universal Adapter Pattern

### Cloudflare Documentation

- **Cloudflare Workers:** https://developers.cloudflare.com/workers/
- **Analytics Engine:** https://developers.cloudflare.com/analytics/analytics-engine/
- **Cloudflare Tunnel:** https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- **Wrangler CLI:** https://developers.cloudflare.com/workers/wrangler/
- **Workers KV:** https://developers.cloudflare.com/kv/
- **Durable Objects:** https://developers.cloudflare.com/durable-objects/

### Frameworks & Tools

- **Hono Framework:** https://hono.dev/ (Express-like for Workers)
- **Astro:** https://astro.build/ (Static site generator)
- **Vite:** https://vitejs.dev/ (Build tool for child apps)
- **React:** https://react.dev/ (UI library for micro-frontends)

### GitHub Documentation

- **GitHub Packages:** https://docs.github.com/en/packages
- **GitHub Actions:** https://docs.github.com/en/actions
- **Repository Dispatch:** https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#repository_dispatch

### Architectural Patterns

- **Micro-frontends:** https://micro-frontends.org/
- **Adapter Pattern:** https://refactoring.guru/design-patterns/adapter
- **Repository Pattern:** https://martinfowler.com/eaaCatalog/repository.html

---

## Storage Architecture

### Workers KV Storage

**Current Architecture:**

- All data stored in Cloudflare Workers KV namespaces
- Direct KV read/write operations
- No external dependencies
- Globally distributed with edge caching

**Storage Namespaces:**

- **TASKS_KV** (task-api) - Task data keyed by sessionId
- **SESSIONS_KV** (edge-router) - Session→key mapping (24hr TTL)

**Benefits:**

- ✅ Fast operations (no external API calls)
- ✅ Low operational complexity
- ✅ Excellent Cloudflare Workers integration
- ✅ Globally distributed with automatic replication
- ✅ Free tier sufficient for personal use (100K reads/day, 1K writes/day)

### SessionId-Based Storage

**Architecture:**

- Storage keyed by `sessionId` instead of `authKey`
- Multi-device support with separate preferences per device
- Session mapping in SESSIONS_KV: `session:{sessionId}` → `{authKey}`
- Task data in TASKS_KV: `tasks:{sessionId}` → `[...tasks]`

**Benefits:**

- ✅ Device-specific preferences (layout, theme)
- ✅ Better UX for desktop + mobile users
- ✅ Preserves preferences when switching devices
- ✅ Session expiration (24 hours) with automatic cleanup

**See [SESSION_ARCHITECTURE.md](./SESSION_ARCHITECTURE.md) for detailed design decisions.**

---

## Related Documentation

### Core Documentation

- **`README.md`** - Project overview and quick start
- **`ARCHITECTURE.md`** - This file (complete system architecture)
- **`SESSION_ARCHITECTURE.md`** - Session & preference storage design decisions
- **`TESTING.md`** - Test strategy and coverage
- **`SECURITY.md`** - Security model and throttling system

### Child App Development

- **`PARENT_API_EXPECTATIONS.md`** - Parent app API expectations and integration guide

### Operations & Deployment

- **`workers/README.md`** - Worker-specific documentation
- **`scripts/admin/README.md`** - Admin scripts for KV management
- **`.github/workflows/deploy-workers.yml`** - CI/CD workflow for Workers
- **`.github/workflows/deploy.yml`** - CI/CD workflow for GitHub Pages
- **`.github/workflows/update-packages.yml`** - Auto-update child packages
