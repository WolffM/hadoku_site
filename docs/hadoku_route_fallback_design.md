# Hadoku Route Fallback Design
**Date:** 2025-10-11  
**Owner:** Hadoku  
**Scope:** Task app first, reusable for all micro‑apps (`/task`, `/watchparty`, …)

> Goal: a unified, modular routing layer where business logic is unchanged and only *where* the request goes is configurable. Priority can be flipped by updating GitHub Secrets and triggering Worker redeployment via GitHub Actions.

---

## 1) Goals & Non‑Goals
**Goals**
- Keep app logic agnostic to backend location (local tunnel, Cloudflare Worker, AWS Lambda, …).
- Support *ordered fallback*: try Provider A → if failure/timeout → Provider B → Provider C.
- Flip order by updating GitHub Secrets and triggering automated Worker redeployment (~30 seconds).
- Per‑app overrides (`task_priority`, `watchparty_priority`), with a global default.
- No infinite proxy loops; clear tracing & metrics.
- Maintain static UI on GitHub Pages while routing API traffic through Workers.
- Centralize all configuration in GitHub (secrets, workflows, deployment).

**Non‑Goals**
- Rebuild the task/watchparty APIs themselves.
- Heavy auth rework (we'll forward existing headers like `X-Admin-Key`).

---

## 2) Architecture Overview

```
Browser (UI on GitHub Pages)
    │
    ↓
hadoku.me/* ──→ Cloudflare Worker (edge-router)
    │
    ├─ /task/api/*        → fallback: local tunnel → task-api Worker → lambda
    ├─ /watchparty/api/*  → local tunnel (streaming)
    └─ /* (static)        → GitHub Pages origin
```

**Components:**
- **GitHub Pages:** Hosts static UI (Astro build) at `hadoku.me`
- **edge-router Worker:** Main traffic handler, implements fallback logic
- **task-api Worker:** Cloudflare Function with Express-like routing (Hono/itty-router)
- **Cloudflare Tunnel:** Exposes local/heavy APIs to the internet
  - `api.hadoku.me` → localhost:4001 (task API)
  - `watchparty-api.hadoku.me` → localhost:4001 (streaming server)

**Request Flow:**
- **Stable client contract:** each app calls a local path (`/task/api/*`, `/watchparty/api/*`).  
- **Edge decides** where the request actually goes, according to `ROUTE_CONFIG` from Worker env vars (e.g., `"global_priority": "12"` = local tunnel → task-api Worker).
- **Config source:** GitHub Secrets deployed as Worker environment variables via GitHub Actions.

---

## 3) Configuration & Priority Mapping

Configuration is stored in **GitHub Secrets** as a single JSON object (`ROUTE_CONFIG`). During deployment, GitHub Actions injects this into the Worker as an environment variable.

**Priority String Format:**
- Each digit maps to a provider
- Order determines fallback sequence
- Example: `"12"` = try local tunnel first, then task-api Worker

**GitHub Secret: `ROUTE_CONFIG`**
```json
{
  "global_priority": "12",
  "task_priority": "21",
  "watchparty_priority": "1"
}
```

**Provider Mapping:**
```typescript
function basesFor(path: string, env: any): string[] {
  const appName = path.split('/')[1]; // "task" or "watchparty"
  
  // Parse ROUTE_CONFIG from env (injected at deploy time)
  const config = JSON.parse(env.ROUTE_CONFIG || '{"global_priority":"12"}');
  
  // Check for per-app override, then global default
  const key = config[`${appName}_priority`] || config.global_priority || "12";
  
  const table: Record<string, string> = {
    "1": env.LOCAL_BASE,       // Cloudflare Tunnel
    "2": env.WORKER_BASE,       // task-api Worker
    "3": env.LAMBDA_BASE        // AWS Lambda (optional)
  };
  
  return String(key).split("").map(d => table[d]).filter(Boolean);
}
```

**Worker Environment Variables (wrangler.toml):**
```toml
[vars]
ROUTE_CONFIG = '{"global_priority":"12"}'  # Default, overridden by GitHub Actions
LOCAL_BASE = "https://api.hadoku.me"
WORKER_BASE = "https://task-api.hadoku.workers.dev"
LAMBDA_BASE = ""                           # Optional
STATIC_ORIGIN = "https://wolffm.github.io/hadoku_site/"
```

**Deployment via GitHub Actions:**
```yaml
- name: Deploy edge-router Worker
  env:
    ROUTE_CONFIG: ${{ secrets.ROUTE_CONFIG }}
  run: |
    cd workers/edge-router
    wrangler deploy --var ROUTE_CONFIG:"$ROUTE_CONFIG"
```

---

## 4) Runtime Resolution Algorithm (pseudocode)

This algorithm now reads from the structured config.

```js
// config is the parsed route-config.json object
function resolveBackends(pathname, config) {
  const appName = pathname.split('/')[1]; // "task" from "/task/api/..."
  const routeConfig = config.routes[appName];
  
  const priority = routeConfig?.priority || config.global_priority || '';
  const providerMap = config.providers;

  const ordered = String(priority)
    .split('')
    .map(digit => providerMap[digit])
    .filter(Boolean); // Ensure only valid, defined providers are returned
  
  return ordered; // e.g., ['https://worker.hadoku.me', 'https://api.hadoku.me']
}

// The fallback logic is now more specific
async function tryOrdered(urlPath, opts, orderedBases, timeoutMsEach=2500) {
  let lastErr;
  for (const base of orderedBases) {
    const url = new URL(urlPath, base).toString();
    try {
      const res = await fetchWithTimeout(url, opts, timeoutMsEach);
      // Fallback on 404 or any 5xx server error
      if (res.status === 404 || res.status >= 500) {
        throw new Error(`Backend returned HTTP ${res.status}`);
      }
      // For any other "bad" status (e.g., 400, 401, 403), we should NOT fall back,
      // as it's a valid response from the backend. We return it directly.
      return withHeader(res, 'x-backend-source', base);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}
```

**Timeout guidance** remains the same. **Loop prevention** (`X-No-Fallback: 1`) is still critical.

---

## 5) Client-Side Helper (`smartFetch`)

This approach is no longer recommended as it complicates central control, but the logic would be updated to fetch and parse the `route-config.json` file.

---

## 6) Edge Router Implementation (Cloudflare Worker)

### 6.1 edge-router Worker

The main Worker that handles all traffic to `hadoku.me/*`.

**wrangler.toml:**
```toml
name = "edge-router"
main = "src/index.ts"
compatibility_date = "2025-10-11"

routes = [ "hadoku.me/*" ]

[vars]
ROUTE_CONFIG = '{"global_priority":"12"}'  # Default, overridden at deploy
LOCAL_BASE = "https://api.hadoku.me"
WORKER_BASE = "https://task-api.hadoku.workers.dev"
LAMBDA_BASE = ""
STATIC_ORIGIN = "https://wolffm.github.io/hadoku_site/"

[[services]]
binding = "TASK_API"
service = "task-api"
```

**src/index.ts:**
```typescript
export default {
  async fetch(req: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    // API routes: apply fallback logic
    if (path.startsWith('/task/api/') || path.startsWith('/watchparty/api/')) {
      const bases = basesFor(path, env);
      
      let lastErr: Error | null = null;
      for (const base of bases) {
        try {
          const targetUrl = new URL(path, base).toString();
          const headers = new Headers(req.headers);
          headers.set('X-No-Fallback', '1'); // Prevent loops
          
          const res = await Promise.race([
            fetch(targetUrl, { ...req, headers }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 2500)
            )
          ]) as Response;

          // Fallback on 404 or 5xx errors
          if (res.status === 404 || res.status >= 500) {
            throw new Error(`Backend returned ${res.status}`);
          }

          // Success - add tracing header
          const newRes = new Response(res.body, res);
          newRes.headers.set('X-Backend-Source', base);
          return newRes;
        } catch (e) {
          lastErr = e as Error;
          console.log(`Failed ${base}: ${lastErr.message}`);
        }
      }

      return new Response(
        JSON.stringify({ error: 'All backends failed', details: lastErr?.message }),
        { status: 502, headers: { 'Content-Type': 'application/json' }}
      );
    }

    // Static files: proxy to GitHub Pages
    return fetch(new URL(path, env.STATIC_ORIGIN), req);
  }
};

function basesFor(path: string, env: any): string[] {
  const appName = path.split('/')[1];
  
  // Parse ROUTE_CONFIG (injected at deploy time from GitHub Secret)
  const config = JSON.parse(env.ROUTE_CONFIG || '{"global_priority":"12"}');
  const key = config[`${appName}_priority`] || config.global_priority || "12";
  
  const table: Record<string, string> = {
    "1": env.LOCAL_BASE,
    "2": env.WORKER_BASE,
    "3": env.LAMBDA_BASE
  };
  
  return String(key).split("").map(d => table[d]).filter(Boolean);
}
```

### 6.2 task-api Worker (Cloudflare Function)

A dedicated Worker that implements the task API using Hono or itty-router.

**wrangler.toml:**
```toml
name = "task-api"
main = "src/index.ts"
compatibility_date = "2025-10-11"

routes = [ "task-api.hadoku.workers.dev/*" ]

[vars]
REPO_OWNER = "WolffM"
REPO_NAME = "hadoku_site"
REPO_BRANCH = "main"

# Set via: wrangler secret put GITHUB_PAT
# Set via: wrangler secret put ADMIN_KEY
```

**src/index.ts (sketch using Hono):**
```typescript
import { Hono } from 'hono';

const app = new Hono();

// Middleware: authenticate
app.use('*', async (c, next) => {
  const adminKey = c.env.ADMIN_KEY;
  const providedKey = c.req.header('X-Admin-Key');
  
  if (providedKey === adminKey) {
    c.set('userType', 'admin');
  } else {
    c.set('userType', 'public');
  }
  
  await next();
});

// Routes
app.get('/', (c) => {
  if (c.get('userType') === 'public') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  // Fetch tasks from GitHub
  return c.json({ tasks: [] });
});

app.post('/', async (c) => {
  if (c.get('userType') === 'public') {
    return c.json({ error: 'Forbidden' }, 403);
  }
  const body = await c.req.json();
  // Create task in GitHub
  return c.json({ success: true, task: body }, 201);
});

// ... more routes ...

export default app;
```

---

## 7) Cloudflare Tunnel Configuration

Expose local APIs to the internet via Cloudflare Tunnel.

**config.yml:**
```yaml
tunnel: <your-tunnel-uuid>
credentials-file: /path/to/<uuid>.json

ingress:
  - hostname: api.hadoku.me
    service: http://localhost:4001
  - hostname: watchparty-api.hadoku.me
    service: http://localhost:4001
  - service: http_status:404
```

**Setup Commands:**
```bash
# Create tunnel
cloudflared tunnel create hadoku-site-prod

# Route DNS (creates CNAME automatically)
cloudflared tunnel route dns hadoku-site-prod api.hadoku.me
cloudflared tunnel route dns hadoku-site-prod watchparty-api.hadoku.me

# Run tunnel
cloudflared tunnel run hadoku-site-prod
```

**Local server.js updates:**
The local Express server no longer needs to handle static Astro pages (that's now on GitHub Pages). It only serves API routes for tunnel traffic.

```javascript
// api/server.js - Now API-only for tunnel
import express from 'express';
import { createTaskRouter } from './apps/task/router.js';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(cors({ origin: '*' })); // Worker will proxy

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'local-tunnel-api' });
});

// Task API
app.use('/task/api', authenticate, createTaskRouter({ 
  dataPath: './data/task',
  environment: 'development'
}));

app.listen(PORT, () => {
  console.log(`🚇 Tunnel API listening on ${PORT}`);
});
```

---

## 8) Live Flipping of ROUTE_CONFIG

Configuration updates are managed via **GitHub Secrets** and automated Worker redeployment.

### 8.1 Manual Update via GitHub UI

1. Go to repository **Settings → Secrets and variables → Actions**
2. Update `ROUTE_CONFIG` secret with new JSON:
   ```json
   {
     "global_priority": "21",
     "task_priority": "12",
     "watchparty_priority": "1"
   }
   ```
3. Trigger Worker redeployment via GitHub Actions (manual dispatch or commit)

### 8.2 Automated Update via Python Script

Use the extended `scripts/manage_github_token.py` script to update routing configuration:

```bash
# Update routing config for hadoku_site repository
python scripts/manage_github_token.py \
  --secret ROUTE_CONFIG \
  --value '{"global_priority":"21","task_priority":"12"}'
```

The script will:
1. Authenticate with GitHub API
2. Encrypt the new configuration
3. Update the `ROUTE_CONFIG` secret in hadoku_site repository
4. Optionally trigger a Worker redeployment workflow

### 8.3 Deployment Workflow

Create `.github/workflows/deploy-workers.yml` to redeploy Workers when secrets change:

```yaml
name: Deploy Cloudflare Workers

on:
  workflow_dispatch:  # Manual trigger
  push:
    paths:
      - 'workers/**'
  repository_dispatch:
    types: [config_updated]

jobs:
  deploy-edge-router:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install wrangler
        run: npm install -g wrangler
      
      - name: Deploy edge-router
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          ROUTE_CONFIG: ${{ secrets.ROUTE_CONFIG }}
        run: |
          cd workers/edge-router
          wrangler deploy --var ROUTE_CONFIG:"$ROUTE_CONFIG"
```

### 8.4 Quick Flip Commands

```bash
# Flip to prefer Workers over tunnel
python scripts/manage_github_token.py --flip worker-first

# Flip to prefer tunnel over Workers
python scripts/manage_github_token.py --flip tunnel-first

# Custom config
python scripts/manage_github_token.py --config route-config.json
```

---

## 8) Headers, Tracing, and Telemetry
This remains a critical part of the design. The `X-Backend-Source` header is even more important now to know which provider in the chain ultimately served the request.

---

## 9) Security Notes
This remains unchanged. Validating credentials at the edge before proxying is key.

---

## 10) Testing Matrix
The matrix expands slightly:
- **Config changes:** Verify updating GitHub Secret and redeploying Worker correctly changes routing behavior (~30 seconds).
- **Fallback triggers:** Test that a backend returning `404`, `500`, or `503` correctly triggers a fallback, but a `401` or `403` does not.
- **Deployment automation:** Verify GitHub Actions workflow correctly injects `ROUTE_CONFIG` into Worker environment.

---

## 11) Rollout Plan

### Phase 1: Infrastructure Setup
1. **Create GitHub Secret for routing config**
   - Add `ROUTE_CONFIG` secret to hadoku_site repository
   - Initial value: `{"global_priority":"12","task_priority":"21","watchparty_priority":"1"}`
2. **Create edge-router Worker** with fallback logic
   - Set up wrangler.toml with routes and vars
   - Implement basesFor() function that parses ROUTE_CONFIG
   - Deploy to Cloudflare via GitHub Actions
3. **Create task-api Worker** with Hono/itty-router
   - Port Express task router logic
   - Set up wrangler.toml
   - Configure secrets (ADMIN_KEY, GITHUB_PAT)
   - Deploy to Cloudflare

### Phase 2: Tunnel Configuration
4. **Set up Cloudflare Tunnel**
   - Create tunnel: `cloudflared tunnel create hadoku-site-prod`
   - Create config.yml with ingress rules
   - Route DNS for api.hadoku.me and watchparty-api.hadoku.me
   - Test tunnel connectivity
5. **Update local api/server.js**
   - Remove Astro static serving (now on GitHub Pages)
   - Keep only API routes for tunnel traffic
   - Listen on port 4001

### Phase 3: DNS & Static Hosting
6. **Configure DNS**
   - Point `hadoku.me` to GitHub Pages (CNAME or A record)
   - Cloudflare Tunnel creates CNAMEs for api.hadoku.me automatically
   - Or: Use apex routing through edge-router Worker
7. **Create GitHub Actions deployment workflow**
   - Set up `.github/workflows/deploy-workers.yml`
   - Configure to inject `ROUTE_CONFIG` secret into Worker vars
   - Add manual trigger and repository_dispatch for config updates
8. **Update GitHub Pages**
   - Keep existing Astro static build
   - No changes needed to build process

### Phase 4: Testing & Validation
9. **Test fallback logic**
   - Verify local tunnel → Worker fallback
   - Test with tunnel down (should fall back to Worker)
   - Test with both down (should return 502)
10. **Test configuration updates**
   - Update `ROUTE_CONFIG` via Python script
   - Trigger Worker redeployment via GitHub Actions
   - Verify routing behavior changes (~30 seconds)
   - Test per-app overrides (task_priority, watchparty_priority)
11. **Extend Python management script**
   - Add support for updating `ROUTE_CONFIG` secret
   - Add helper commands for common flips (tunnel-first, worker-first)
   - Add ability to trigger Worker redeployment workflow
12. **Verify child apps**
    - Confirm task app works without changes
    - Test authentication flow
    - Verify data persistence

---

## 12) Future Extensions
- **Automated Flips**: The manual flip script is the first step. Later, an automated agent could call the same script/API based on performance metrics (e.g., latency spikes, error rates) from your logging provider.
- **Caching Implementation**: Build out the `// TODO` sections for caching, likely using an in-memory cache like `node-cache` for Express or the Cloudflare Cache API for the Worker.

---

## 13) Quick Reference

### Architecture Stack
```
┌─────────────────────────────────────────────────────┐
│ Browser                                              │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────┐
│ hadoku.me (DNS)                                      │
│   ├─ Static files → GitHub Pages                    │
│   └─ API routes → edge-router Worker                │
└────────────────┬────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────┐
│ edge-router Worker (Cloudflare)                     │
│   ├─ Fallback logic                                 │
│   ├─ Reads ROUTE_PRIORITY from KV                   │
│   └─ Routes to: tunnel → task-api Worker → lambda   │
└────┬───────────────────────┬────────────────────────┘
     │                       │
     ↓                       ↓
┌──────────────┐      ┌──────────────────┐
│ Tunnel       │      │ task-api Worker  │
│ (local APIs) │      │ (Cloudflare)     │
└──────────────┘      └──────────────────┘
```

### Configuration Files

**edge-router wrangler.toml:**
```toml
name = "edge-router"
routes = [ "hadoku.me/*" ]
[vars]
ROUTE_CONFIG = '{"global_priority":"12"}'  # Overridden by GitHub Actions
LOCAL_BASE = "https://api.hadoku.me"
WORKER_BASE = "https://task-api.hadoku.workers.dev"
STATIC_ORIGIN = "https://wolffm.github.io/hadoku_site/"
```

**task-api wrangler.toml:**
```toml
name = "task-api"
routes = [ "task-api.hadoku.workers.dev/*" ]
[vars]
REPO_OWNER = "WolffM"
REPO_NAME = "hadoku_site"
```

**Tunnel config.yml:**
```yaml
tunnel: <uuid>
ingress:
  - hostname: api.hadoku.me
    service: http://localhost:4001
  - hostname: watchparty-api.hadoku.me
    service: http://localhost:4001
  - service: http_status:404
```

### Priority Strings
- `"1"` = Local tunnel only
- `"2"` = Worker only
- `"12"` = Try tunnel, fallback to Worker
- `"21"` = Try Worker, fallback to tunnel
- `"123"` = Try tunnel → Worker → Lambda

### GitHub Secret: ROUTE_CONFIG
```json
{
  "global_priority": "12",
  "task_priority": "21",
  "watchparty_priority": "1"
}
```

### Python Script Usage
```bash
# View current config
python scripts/manage_github_token.py --show-config

# Update config
python scripts/manage_github_token.py \
  --secret ROUTE_CONFIG \
  --value '{"global_priority":"21"}'

# Quick flips
python scripts/manage_github_token.py --flip tunnel-first
python scripts/manage_github_token.py --flip worker-first

# Trigger Worker redeployment after update
python scripts/manage_github_token.py --deploy-workers
```
