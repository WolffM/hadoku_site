# Architecture Overview - Hadoku Site

**Last Updated:** October 11, 2025

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION ENVIRONMENT                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  Cloudflare Worker: edge-router (hadoku.me/*)                  │     │
│  │  • Intelligent fallback routing (tunnel → worker → static)     │     │
│  │  • Analytics Engine logging (SQL-queryable)                    │     │
│  │  • X-Backend-Source header tracking                            │     │
│  └────────────────────────────────────────────────────────────────┘     │
│         ↓                           ↓                        ↓           │
│  ┌───────────────┐   ┌───────────────────────┐   ┌──────────────────┐  │
│  │  Tunnel       │   │  Cloudflare Workers   │   │  GitHub Pages    │  │
│  │  (Priority 1) │   │  (Priority 2)         │   │  (Fallback)      │  │
│  ├───────────────┤   ├───────────────────────┤   ├──────────────────┤  │
│  │ localhost     │   │ task-api worker       │   │ Static HTML/JS   │  │
│  │ via tunnel    │   │ • Hono framework      │   │ • Astro build    │  │
│  │ (dev/home)    │   │ • @wolffm/task pkg    │   │ • Micro-frontends│  │
│  │               │   │ • GitHub API storage  │   │                  │  │
│  └───────────────┘   └───────────────────────┘   └──────────────────┘  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      GITHUB PACKAGES (PRIVATE NPM)                       │
├─────────────────────────────────────────────────────────────────────────┤
│  @wolffm/task@1.0.0                                                      │
│  • TaskHandlers (pure business logic functions)                         │
│  • TaskStorage (interface for parent to implement)                      │
│  • AuthContext, Task types (TypeScript definitions)                     │
│                                                                           │
│  Published by child → Downloaded by parent → Used in task-api worker    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                       DEVELOPMENT ENVIRONMENT                            │
├─────────────────────────────────────────────────────────────────────────┤
│  Astro Dev Server (localhost:4321)                                      │
│  • Serves static site locally                                            │
│  • Hot module reloading                                                  │
│  • No API routing (use worker or tunnel)                                │
└─────────────────────────────────────────────────────────────────────────┘
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
   - Calls TaskHandlers with GitHub storage adapter
   - GitHub storage commits to data/task/ directory
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
- **Loader:** Custom mf-loader.js (dynamic imports)
- **Registry:** Auto-generated registry.json from public/mf/

### Backend - Production
- **Platform:** Cloudflare Workers
- **edge-router:**
  - Intelligent fallback routing (tunnel → worker → static)
  - Analytics Engine logging (10M events/month free)
  - Proxy to tunnel/worker/static origins
  - TypeScript + Cloudflare Workers SDK
- **task-api:**
  - Hono 4.0.0 framework (Express-like for Workers)
  - @wolffm/task package from GitHub Packages (Universal Adapter)
  - GitHub API storage via TaskStorage adapter
  - Authentication via X-Admin-Key header
  - TypeScript + Hono + Octokit

### Backend - Development
- **Runtime:** Astro dev server only (static site)
- **API Testing:** Use deployed workers or tunnel directly
- **Local Mode:** Task app uses public mode (localStorage)
- **Storage:** localStorage for development, GitHub API for production

### Universal Adapter Pattern
- **Child Packages:** @wolffm/task, @wolffm/watchparty (private GitHub Packages)
- **Exports:** TaskHandlers (pure functions), TaskStorage (interface), types
- **Parent Implementation:** Workers implement storage adapters + HTTP layers
- **Deployment:** Child publishes → triggers parent update via repository_dispatch
- **Decoupling:** Child knows nothing about parent's HTTP framework or storage

### Routing & Networking
- **Production Edge:** Cloudflare Worker at hadoku.me/*
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
  getTasks: (storage: TaskStorage, auth: AuthContext) => { /* ... */ },
  createTask: (storage: TaskStorage, auth: AuthContext, data: TaskData) => { /* ... */ },
  // ... more handlers
}

// Exports storage interface (parent implements)
export interface TaskStorage {
  getFile<T>(path: string): Promise<T>
  saveFile(path: string, data: unknown): Promise<void>
}

// Exports types
export type AuthContext = { userType: UserType }
```

**Parent Implementation (workers/task-api):**
```typescript
// Parent implements storage adapter
const storage: TaskStorage = {
  getFile: async <T>(path: string): Promise<T> => {
    const response = await fetch(githubApiUrl, { /* ... */ })
    return JSON.parse(content)
  },
  saveFile: async (path: string, data: unknown) => {
    await fetch(githubApiUrl, { method: 'PUT', /* ... */ })
  }
}

// Parent calls child handlers
app.get('/task/api/tasks', authenticate, async (c) => {
  const { storage, auth } = getContext(c)
  const tasks = await TaskHandlers.getTasks(storage, auth)
  return c.json(tasks)
})
```

**Benefits:**
- Child doesn't know about Hono, GitHub API, or Cloudflare Workers
- Parent can swap storage (GitHub → KV → D1) without changing child
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
    indexes: [entry.backend, entry.method]
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

| User Type | Auth | Storage | Backend | Operations |
|-----------|------|---------|---------|------------|
| **Public** | None | localStorage | Browser only | CRUD (local only) |
| **Friend** | Friend Key | GitHub repo | task-api Worker or tunnel | CRUD + Stats |
| **Admin** | Admin Key | GitHub repo | task-api Worker or tunnel | CRUD + Stats + Clear |

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
GITHUB_PAT=<github-pat-for-task-storage>
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
- `GITHUB_PAT` - GitHub Personal Access Token for data storage

### Local Development

Local development uses Astro dev server for static site only. API testing is done against deployed workers or tunnel.

```bash
# Not needed for local Astro dev server
# Point task app to deployed worker or use public mode (localStorage)
```

## API Endpoints

### Edge Router (hadoku.me/*)
All requests go through edge-router for intelligent fallback.

| Path | Backend | Description |
|------|---------|-------------|
| `/*` | GitHub Pages | Static Astro site (HTML, CSS, JS) |
| `/task/api/*` | Tunnel or Worker | Task API (fallback chain) |
| `/watchparty/api/*` | Tunnel only | Watchparty API (home server) |

### Task API (task-api.hadoku.me/task/api/*)
Accessed via edge-router or directly. All endpoints require X-Admin-Key header.

| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | `/task/api/` | Health check | Public |
| GET | `/task/api/stats` | Get task stats | Admin/Friend |
| POST | `/task/api/` | Create task | Admin/Friend |
| PATCH | `/task/api/:id` | Update task | Admin/Friend |
| POST | `/task/api/:id/complete` | Toggle complete | Admin/Friend |
| DELETE | `/task/api/:id` | Delete task | Admin/Friend |
| POST | `/task/api/clear` | Clear all tasks | Admin only |

**Note:** Public users use localStorage and never call these APIs.

## Data Flow

### Public Mode (Browser-Only)
```
User Action → React State → localStorage.setItem('tasks', JSON)
           ← React State ← localStorage.getItem('tasks')
           
No network requests, fully offline capable.
```

### Admin/Friend Mode (Server-Backed via edge-router)
```
User Action → React State → fetch('/task/api/tasks', { X-Admin-Key })
           → edge-router Worker → Try local-api.hadoku.me (tunnel)
                                    ↓ (on error)
                                 → Try task-api.hadoku.me (worker)
                                    ↓ (success)
                                 → GitHub API (WolffM/hadoku_site)
                                    ↓ (commit to data/task/{userType})
           ← JSON Response ← task-api Worker
           ← edge-router (adds X-Backend-Source header)
```

## Security Model

### Edge Layer (Cloudflare Workers)
- ✅ edge-router doesn't validate keys (transparent proxy)
- ✅ All requests logged with Analytics Engine (non-blocking)
- ✅ Fallback logic prevents backend exposure
- ✅ X-Backend-Source header reveals which backend served request
- ✅ Timeout protection (2500ms per backend attempt)

### API Layer (task-api Worker)
- ✅ All endpoints validate X-Admin-Key header
- ✅ Keys compared against Worker secrets (ADMIN_KEY, FRIEND_KEY)
- ✅ userType determined server-side only
- ✅ GitHub PAT stored as Worker secret (never exposed)
- ✅ CORS configured for hadoku.me origin
- ✅ Public mode uses localStorage (zero API calls)

### GitHub Storage
- ✅ Commits signed with GitHub PAT
- ✅ Data separated by userType (data/task/admin/, data/task/friend/)
- ✅ Repository private (only Worker can read/write)
- ✅ Git history provides audit trail

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
  - Worker fallback: ~150-300ms (GitHub API latency)
- **Offline:** ❌ Requires API access
- **Cost:** ~5-20 requests/day per user

### Cloudflare Free Tier Limits
- **Workers:** 100,000 requests/day
- **Analytics Engine:** 10,000,000 events/month (all logged)
- **GitHub API:** 5,000 requests/hour with PAT
- **Expected Usage:** 
  - Static: ~100-500 requests/day (edge-router → GitHub Pages)
  - API: ~10-50 requests/day (edge-router → task-api)
  - **Total:** < 1% of free tier quota

### Request Latency Breakdown
```
Edge-router overhead:     ~5-10ms
Tunnel latency:          ~20-50ms (local network)
Worker latency:          ~50-100ms (cold start) / ~10-20ms (warm)
GitHub API latency:      ~100-200ms (US East)
Total (tunnel):          ~30-70ms
Total (worker fallback): ~160-330ms
```

## Development Workflow

### Local Development
```bash
# 1. Start Astro dev server
npm run dev
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

# 2. Install dependencies (requires .npmrc with GitHub Packages auth)
npm install

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
# Workflow: .github/workflows/publish.yml
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
npm run build
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
│   ├── edge-router/             # Main traffic router
│   │   ├── src/
│   │   │   ├── index.ts         # Worker entry point
│   │   │   └── logging/
│   │   │       ├── types.ts     # LogEntry interface
│   │   │       ├── analytics-provider.ts  # Analytics Engine logging
│   │   │       ├── index.ts     # Module exports
│   │   │       └── README.md    # Logging documentation
│   │   ├── wrangler.toml        # Worker config (routes, bindings)
│   │   ├── package.json         # Dependencies (minimal)
│   │   ├── tsconfig.json        # TypeScript config
│   │   └── .npmrc               # GitHub Packages auth (generated in CI)
│   │
│   └── task-api/                # Task API Worker (Universal Adapter)
│       ├── src/
│       │   └── index.ts         # Hono app + GitHub storage adapter
│       ├── wrangler.toml        # Worker config (routes, secrets)
│       ├── package.json         # Dependencies (@wolffm/task, hono)
│       ├── tsconfig.json        # TypeScript config
│       └── .npmrc               # GitHub Packages auth (generated in CI)
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
│   ├── API_EXPORTS.md           # Child package exports reference
│   ├── CHILD_APP_TEMPLATE.md    # Guide for creating child apps
│   ├── GITHUB_ACTIONS_LOGS.md   # Log retrieval procedures
│   └── DOC_UPDATE_NOTES.md      # Documentation update tracking
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
- ✅ **GitHub API Storage**: Persistent task data in data/task/ directory
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

## Architecture Evolution

### Phase 1: Monolithic (Deprecated)
```
Browser → Cloudflare Pages + Functions
       → functions/task/api/[[path]].js (Express-in-Worker adapter)
       → /tmp storage (ephemeral)
```
❌ **Limitations:**
- Tight coupling between routing, business logic, and storage
- Complex adapter layer to run Express in Worker environment
- Ephemeral storage cleared on every cold start
- No fallback options (single backend only)
- Can't use custom domains (tied to Pages)

### Phase 2: Universal Adapter Pattern (Current)
```
Browser → edge-router Worker (hadoku.me/*)
       → Intelligent fallback (tunnel → task-api → static)
       → task-api Worker imports @wolffm/task from GitHub Packages
       → GitHub API (persistent storage)
```
✅ **Benefits:**
- **Decoupling**: Child logic separated from parent infrastructure
- **Flexibility**: Parent can swap Hono → Elysia, GitHub → KV without touching child
- **Testability**: Child can be tested with mock storage
- **Reusability**: Same child package works with multiple parent frameworks
- **Persistence**: GitHub storage with full audit trail (git history)
- **Fallback**: Multi-backend routing with automatic failover
- **Observability**: Analytics Engine logging with zero configuration
- **Automation**: Child publishes → parent auto-updates → Workers redeploy

### Phase 3: Service Bindings (Future)
```
Browser → edge-router Worker
       → Service Binding (no HTTP) → task-api Worker
       → Cloudflare KV (cache) + GitHub API (source of truth)
```
🔮 **Future Advantages:**
- Sub-millisecond Worker-to-Worker communication
- Automatic serialization/deserialization
- No network latency between Workers
- Built-in load balancing and failover

## References

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

## Related Documentation

### Core Documentation
- **`README.md`** - Project overview and quick start
- **`ARCHITECTURE.md`** - This file (complete system architecture)
- **`API_EXPORTS.md`** - Child package exports reference

### Child App Development
- **`CHILD_APP_TEMPLATE.md`** - Guide for creating new child apps
- **`TASK_APP_PUBLIC_MODE.md`** - Public mode localStorage implementation

### Operations & Deployment
- **`GITHUB_ACTIONS_LOGS.md`** - Log retrieval procedures
- **`workers/README.md`** - Worker-specific documentation
- **`workers/edge-router/src/logging/README.md`** - Analytics Engine logging guide
- **`.github/workflows/deploy-workers.yml`** - CI/CD workflow for Workers
- **`.github/workflows/deploy.yml`** - CI/CD workflow for GitHub Pages
- **`.github/workflows/update-packages.yml`** - Auto-update child packages

### Scripts & Tools
- **`scripts/README.md`** - Build and deployment scripts documentation
