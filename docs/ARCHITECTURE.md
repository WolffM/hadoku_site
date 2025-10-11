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
3. Checks if path starts with /task/api or /watchparty/api
4. No → Proxies to GitHub Pages (STATIC_ORIGIN)
5. GitHub Pages returns static HTML + JS bundles
6. edge-router logs request (backend='static')
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
7. edge-router logs request (backend='tunnel')
8. Response → Browser with X-Backend-Source: tunnel
```

#### API Request (Tunnel Down - Fallback to Worker)
```
1. Browser → https://hadoku.me/task/api/tasks
2. edge-router receives request
3. Try priority "1": https://local-api.hadoku.me/task/api/tasks
4. Fails (connection refused or timeout)
5. Try priority "2": https://task-api.hadoku.me/task/api/tasks
6. Worker responds (GitHub storage)
7. edge-router logs request (backend='worker')
8. Response → Browser with X-Backend-Source: worker
```

### Development (localhost:4321)

#### Local Dev Request
```
1. Browser → http://localhost:4321/task/api/tasks
2. server/main.mjs receives request
3. Path matches /task/api → proxy middleware
4. Reads route-config.json: resolves backends
5. Proxies to first available backend
6. On error → tries next backend (fallback)
7. Response → Browser
```

## Technology Stack

### Frontend
- **Framework:** Astro (SSR mode with @astrojs/node adapter)
- **Architecture:** Micro-frontends
- **Child Apps:** React (bundled with Vite)
- **Styling:** CSS (scoped per app)
- **Loader:** Custom mf-loader.js (dynamic imports)
- **Registry:** Auto-generated from public/mf/

### Backend - Production
- **Platform:** Cloudflare Workers
- **edge-router:**
  - Routing with intelligent fallback
  - Analytics Engine logging (10M events/month free)
  - Proxy to tunnel/worker/static origins
  - TypeScript + Cloudflare Workers SDK
- **task-api:**
  - Hono framework (Express-like for Workers)
  - GitHub API storage (commits to data/task/)
  - Authentication via X-Admin-Key header
  - TypeScript + Hono + Octokit

### Backend - Development
- **Runtime:** Node.js
- **Server:** server/main.mjs (Express + Astro SSR middleware)
- **Proxy:** http-proxy-middleware with fallback logic
- **Config:** route-config.json (hot-reloaded with chokidar)
- **Storage:** Mock/local endpoints

### Routing & Networking
- **Production Edge:** Cloudflare Worker at hadoku.me/*
- **Worker APIs:** task-api.hadoku.me, etc.
- **Tunnel:** local-api.hadoku.me → localhost:4321 (Cloudflare Tunnel)
- **Static:** GitHub Pages (wolffm.github.io/hadoku_site)

### Build & Deploy
- **Static Build:** Astro SSR → dist/server/ + dist/client/
- **Worker Deploy:** GitHub Actions → wrangler deploy
- **CI/CD:** GitHub Actions workflow (.github/workflows/deploy-workers.yml)
- **Secrets:** GitHub Secrets → Worker env vars at deploy time

## Key Design Patterns

### 1. Intelligent Edge Routing (Production)
```typescript
// workers/edge-router/src/index.ts
async function handleApiRoute(request: Request, env: Env) {
  const bases = basesFor(url.pathname, env);
  
  for (const base of bases) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    
    try {
      const response = await fetch(targetUrl, { signal: controller.signal });
      if (response.ok) {
        return { response, backend };
      }
    } catch (err) {
      continue; // Try next backend
    }
  }
  
  return fallbackResponse();
}
```

### 2. Priority-Based Routing Config
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

### 3. Analytics Engine Logging (Zero Setup)
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
```

### 4. Hono-Based Worker API
```typescript
// workers/task-api/src/index.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/task/api/tasks', authenticate, async (c) => {
  const userType = c.get('userType')
  const tasks = await fetchTasksFromGitHub(c.env, userType)
  return c.json(tasks)
})

export default app
```

### 5. Local Dev Proxy with Fallback
```javascript
// server/main.mjs
app.use(['/task/api', '/watchparty/api'], (req, res, next) => {
  const bases = resolveBackends(req.path, routeConfig);
  
  let i = 0;
  const tryNext = (err) => {
    if (i >= bases.length) {
      return res.status(502).json({ error: 'All backends failed' });
    }
    
    const target = bases[i++];
    createProxyMiddleware({
      target,
      onProxyRes: (proxyRes) => {
        if (proxyRes.statusCode >= 500) {
          tryNext(new Error(`Backend returned ${proxyRes.statusCode}`));
        } else {
          proxyRes.pipe(res);
        }
      },
      onError: (err) => tryNext(err)
    })(req, res, next);
  };
  
  tryNext();
});
```

## User Types & Permissions

| User Type | Auth | Storage | Backend | Operations |
|-----------|------|---------|---------|------------|
| **Public** | None | localStorage | Browser only | CRUD (local only) |
| **Friend** | Friend Key | GitHub repo | task-api Worker or tunnel | CRUD + Stats |
| **Admin** | Admin Key | GitHub repo | task-api Worker or tunnel | CRUD + Stats + Clear |

## Environment Variables

### Local Development (.env)
```bash
# Authentication keys (for local dev/testing)
ADMIN_KEY=test-admin-key
FRIEND_KEY=test-friend-key

# Routing configuration
LOCAL_BASE=https://api.hadoku.me
WORKER_BASE=https://worker.hadoku.me

# Astro/Node
PORT=4321
NODE_ENV=development
```

### Production (GitHub Secrets)
```bash
# Deployment
CLOUDFLARE_API_TOKEN=<cloudflare-token>
CLOUDFLARE_ACCOUNT_ID=<account-id>

# Routing (JSON injected into edge-router at deploy time)
ROUTE_CONFIG='{"global_priority":"12","providers":{...}}'

# Task API Worker secrets (set via wrangler secret put)
ADMIN_KEY=<production-uuid>
FRIEND_KEY=<production-uuid>
TASK_GITHUB_TOKEN=<github-pat-for-task-storage>
```

### Production (Workers)
**edge-router** (wrangler.toml vars):
- `ROUTE_CONFIG` - Routing priority JSON
- `LOCAL_BASE` - Tunnel URL
- `WORKER_BASE` - Worker API URL
- `STATIC_ORIGIN` - GitHub Pages URL
- Binding: `ANALYTICS_ENGINE` (Analytics Engine dataset)

**task-api** (wrangler secrets):
- `ADMIN_KEY` - Admin authentication
- `FRIEND_KEY` - Friend authentication
- `GITHUB_PAT` - GitHub API token for storage

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
# 1. Set up environment
cp .env.example .env
# Edit .env with your keys and config

# 2. Start local dev server (Astro SSR + proxy)
npm run dev
# Runs: node server/main.mjs
# Listens on: http://localhost:4321

# 3. Access site
# Static pages: http://localhost:4321/
# Task app: http://localhost:4321/task

# 4. Test API routing (requires backends configured)
curl http://localhost:4321/task/api/
```

### Production Deployment

#### Deploy Workers via GitHub Actions
```bash
# 1. Push to GitHub
git add -A
git commit -m "feat: update workers"
git push

# 2. GitHub Actions automatically:
#    - Builds both Workers (edge-router, task-api)
#    - Injects ROUTE_CONFIG secret into edge-router
#    - Deploys via wrangler
#    - Sets task-api secrets (ADMIN_KEY, FRIEND_KEY, GITHUB_PAT)

# 3. Monitor deployment
# Visit: https://github.com/WolffM/hadoku_site/actions
```

#### Deploy Static Site (GitHub Pages)
```bash
# 1. Build Astro static site
npm run build
# Output: dist/client/

# 2. Push to gh-pages branch (manual or CI)
# GitHub Pages serves from: https://wolffm.github.io/hadoku_site/

# 3. edge-router proxies static content automatically
```

### Viewing Logs
```bash
# Real-time Worker logs
wrangler tail edge-router --format=pretty

# Analytics Engine (SQL queries in Dashboard)
# Visit: https://dash.cloudflare.com → Workers → edge-router → Analytics

# Example queries:
SELECT backend, COUNT(*) FROM ANALYTICS_ENGINE GROUP BY backend
SELECT AVG(double2) as avg_duration FROM ANALYTICS_ENGINE WHERE index1 = 'worker'
```

## File Structure

```
hadoku_site/
├── src/                          # Astro source (SSR mode)
│   ├── pages/
│   │   ├── index.astro          # Home with app directory
│   │   ├── task/index.astro     # Task app page
│   │   ├── watchparty/index.astro
│   │   └── contact/index.astro
│   ├── components/
│   │   ├── hadoku-header.js     # Navigation header
│   │   └── mf-loader.js         # Micro-frontend loader
│   ├── layouts/
│   │   └── Base.astro           # Base layout
│   └── config/
│       └── access-control.ts    # App visibility by user type
│
├── public/                       # Static assets (copied to dist/client)
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
├── server/                       # Local development server
│   └── main.mjs                 # Express + Astro SSR + proxy middleware
│
├── workers/                      # Cloudflare Workers (production)
│   ├── edge-router/             # Main traffic router
│   │   ├── src/
│   │   │   ├── index.ts         # Worker entry point
│   │   │   └── logging/
│   │   │       ├── types.ts     # LogEntry interface
│   │   │       ├── analytics-provider.ts  # Analytics Engine
│   │   │       ├── index.ts     # Module exports
│   │   │       └── README.md    # Logging docs
│   │   ├── wrangler.toml        # Worker config (routes, bindings)
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── task-api/                # Task API Worker
│       ├── src/
│       │   └── index.ts         # Hono app with GitHub storage
│       ├── wrangler.toml        # Worker config (routes, secrets)
│       ├── package.json
│       └── tsconfig.json
│
├── scripts/                      # Build and deployment scripts
│   ├── generate-registry.mjs    # Generate mf/registry.json
│   ├── manage_github_token.py   # Manage GitHub Secrets
│   └── README.md
│
├── .github/
│   └── workflows/
│       └── deploy-workers.yml   # CI/CD for Workers
│
├── dist/                         # Build output (gitignored)
│   ├── client/                  # Static assets (served by GitHub Pages)
│   │   ├── mf/                  # Copied from public/mf
│   │   └── CNAME                # Custom domain
│   └── server/                  # Astro SSR code
│       └── entry.mjs            # Imported by server/main.mjs
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md          # This file
│   ├── PARENT_INTEGRATION.md    # Integration guide
│   ├── CLOUDFLARE_PAGES_FUNCTIONS.md  # Old Pages Functions (obsolete)
│   ├── TASK_APP_PUBLIC_MODE.md  # Public localStorage guide
│   └── switch_to_api_hadoku_me.md  # Worker routing guide
│
├── route-config.json             # Local dev routing configuration
├── .env                          # Local environment variables (gitignored)
├── .env.example                  # Environment template
├── astro.config.mjs              # Astro SSR config
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript config (excludes workers/)
```

## Current State & Roadmap

### ✅ Completed
- ✅ Cloudflare Workers architecture (edge-router + task-api)
- ✅ GitHub Actions CI/CD for automated deployment
- ✅ Analytics Engine logging (10M events/month free)
- ✅ Intelligent routing with fallback logic
- ✅ GitHub API storage for task data
- ✅ Local development server with proxy middleware
- ✅ Micro-frontend architecture with dynamic loading
- ✅ Authentication via X-Admin-Key header
- ✅ Public mode with localStorage (zero API calls)

### 🔧 In Progress
- ⏳ DNS records for task-api.hadoku.me (Worker deployed, DNS pending)
- ⏳ Cloudflare Tunnel setup for local-api.hadoku.me
- ⏳ End-to-end testing of fallback logic
- ⏳ Frontend updates to use edge-router URLs

### 🔮 Future Enhancements
- **Performance:**
  - Service bindings between Workers (faster than HTTP)
  - Cloudflare KV caching for task data
  - Edge caching with Cache API
  
- **Features:**
  - Watchparty API Worker
  - Contact form API Worker
  - Hero Draft API Worker
  
- **Observability:**
  - Grafana dashboards for Analytics Engine
  - Error alerting via Cloudflare Notifications
  - Request tracing with trace IDs
  
- **Security:**
  - Rate limiting per user/IP
  - JWT tokens instead of static keys
  - Cloudflare Access integration

## Key Differences: Old vs New Architecture

### Old Architecture (Cloudflare Pages Functions)
```
Browser → Cloudflare Pages (static) + Functions (serverless)
       → functions/task/api/[[path]].js (Express adapter)
       → /tmp storage (ephemeral)
```
❌ **Problems:**
- Complex Express → Cloudflare adapter (150+ lines)
- Tied to Pages deployment (can't use custom domains)
- Ephemeral storage (/tmp cleared on cold start)
- Single provider (no fallback)

### New Architecture (Cloudflare Workers)
```
Browser → edge-router Worker (hadoku.me/*)
       → Intelligent fallback (tunnel → worker → static)
       → task-api Worker (task-api.hadoku.me)
       → GitHub API (persistent storage)
```
✅ **Benefits:**
- Native Worker (no adapter needed)
- Custom domains per Worker
- Persistent GitHub storage
- Intelligent multi-backend fallback
- Analytics Engine logging
- GitHub Actions deployment

## References

- **Cloudflare Workers:** https://developers.cloudflare.com/workers/
- **Cloudflare Analytics Engine:** https://developers.cloudflare.com/analytics/analytics-engine/
- **Cloudflare Tunnel:** https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- **Hono Framework:** https://hono.dev/
- **Astro (SSR):** https://docs.astro.build/en/guides/server-side-rendering/
- **Express.js:** https://expressjs.com/
- **Micro-frontends:** https://micro-frontends.org/

---

## Related Documentation

- **`PARENT_INTEGRATION.md`** - Server and client integration patterns
- **`switch_to_api_hadoku_me.md`** - Worker routing and domain setup
- **`TASK_APP_PUBLIC_MODE.md`** - Public mode localStorage implementation
- **`workers/edge-router/src/logging/README.md`** - Analytics Engine logging guide
- **`.github/workflows/deploy-workers.yml`** - CI/CD workflow configuration
