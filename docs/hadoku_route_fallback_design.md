# Hadoku Route Fallback Design
**Date:** 2025-10-11 16:16:04Z  
**Owner:** Hadoku  
**Scope:** Task app first, reusable for all micro‑apps (`/task`, `/watchparty`, …)

> Goal: a unified, modular routing layer where business logic is unchanged and only *where* the request goes is configurable. Priority can be flipped live with a boolean/number without redeploys.

---

## 1) Goals & Non‑Goals
**Goals**
- Keep app logic agnostic to backend location (local tunnel, Cloudflare Worker, AWS Lambda, …).
- Support *ordered fallback*: try Provider A → if failure/timeout → Provider B → Provider C.
- Flip order **at runtime** via a single value (e.g., `ROUTE_PRIORITY="123"`), ideally from a remote config/secret.
- Per‑app overrides (`TASK_ROUTE_PRIORITY`, `WATCHPARTY_ROUTE_PRIORITY`), with a global default.
- No infinite proxy loops; clear tracing & metrics.

**Non‑Goals**
- Rebuild the task/watchparty APIs themselves.
- Heavy auth rework (we’ll forward existing headers like `X-Admin-Key`).

---

## 2) Architecture Overview

```
Browser (UI) ──→ Edge Router (Worker or Parent Express)
                    │
                    ├─ Provider 1: Local Tunnel (Express)
                    ├─ Provider 2: Cloudflare Worker (stateless JSON API)
                    └─ Provider 3: AWS Lambda / other
```

- **Stable client contract:** each app calls a local path (`/task/api/*`, `/watchparty/api/*`).  
- **Edge decides** where the request actually goes, according to `ROUTE_PRIORITY` (e.g., `123` = local → worker → lambda).
- **Config source:** env var (build), Cloudflare KV / environment secret (runtime), or a tiny `/config` endpoint consumed by the UI (`GET /_config/route`).

---

## 3) Configuration & Priority Mapping
We move from a simple string to a structured, remotely-configurable JSON object. This provides per-app control and can be updated live without redeploying.

**`route-config.json` (Example)**
```json
{
  "global_priority": "21",
  "routes": {
    "task": {
      "priority": "213",
      "cache": false
    },
    "watchparty": {
      "priority": "1",
      "cache": true,
      "cache_ttl_seconds": 60
    }
  },
  "providers": {
    "1": "https://api.hadoku.me",
    "2": "https://worker.hadoku.me",
    "3": "https://xyz.lambda-url.aws"
  }
}
```
- **`global_priority`**: A fallback for any app not explicitly defined in `routes`.
- **`routes`**: Per-app overrides. The key (`task`, `watchparty`) matches the first segment of the API path (`/task/api/`, `/watchparty/api/`).
- **`providers`**: The canonical mapping of digits to base URLs.

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

## 6) Edge-Side Helper (Recommended)

This is the preferred approach. The logic is updated to handle the new configuration structure and specific fallback conditions.

### 6.1 Cloudflare Worker (TypeScript)

The Worker would fetch its configuration from a KV store on startup or for each request.

```ts
// In wrangler.toml, bind a KV namespace:
// [[kv_namespaces]]
// binding = "SETTINGS"
// id = "your_kv_namespace_id"

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const path = url.pathname;
    const appName = path.split('/')[1];

    if (!path.startsWith('/task/api/') && !path.startsWith('/watchparty/api/')) {
      return env.STATIC.fetch(req); // Pass to static site
    }

    // Fetch config from KV store for live updates
    const config = await env.SETTINGS.get('route-config', 'json');
    if (!config) {
      return new Response('Routing configuration not found', { status: 500 });
    }

    const bases = resolveBackends(path, config);
    const routeConfig = config.routes[appName] || {};

    // TODO: Implement caching for watchparty based on routeConfig.cache
    // if (routeConfig.cache) { /* check cache first */ }

    let lastErr;
    for (const base of bases) {
      try {
        // ... (fetch logic remains similar, but check for 404/5xx)
        const res = await raceTimeout(tryOnce(base), 2500);
        if (res.status === 404 || res.status >= 500) {
          throw new Error(`Backend at ${base} returned ${res.status}`);
        }
        // ... (return successful response)
      } catch (e) {
        lastErr = e;
      }
    }
    return new Response(JSON.stringify({ error: String(lastErr) }), { status: 502 });
  }
}
```

### 6.2 Parent Express (Node) as Router

The Express server will use a file watcher (`chokidar`) to reload the JSON config without restarting the server.

```js
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import chokidar from 'chokidar';

const app = express();
const CONFIG_PATH = './route-config.json';

// Load config and watch for changes
let routeConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
chokidar.watch(CONFIG_PATH).on('change', () => {
  console.log('Routing config changed, reloading...');
  try {
    routeConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  } catch (e) {
    console.error('Failed to reload routing config:', e);
  }
});

// ... (resolveBackends function here) ...

app.use(['/task/api', '/watchparty/api'], (req, res, next) => {
  const bases = resolveBackends(req.path, routeConfig);
  const appName = req.path.split('/')[1];
  const appConfig = routeConfig.routes[appName] || {};

  // TODO: Implement caching for watchparty based on appConfig.cache
  
  let i = 0;
  const tryNext = () => {
    if (i >= bases.length) return res.status(502).json({ error: 'All backends failed' });
    
    createProxyMiddleware({
      target: bases[i++],
      changeOrigin: true,
      // ... (proxy options) ...
      onError: (err, req, res) => {
        // This triggers on connection errors. We also need to handle 404/5xx.
        tryNext();
      },
      onProxyRes: (proxyRes, req, res) => {
        if (proxyRes.statusCode === 404 || proxyRes.statusCode >= 500) {
          // If we get a bad status, try the next backend.
          tryNext();
        } else {
          // Otherwise, send the response to the client.
          res.status(proxyRes.statusCode).send(proxyRes.statusMessage);
        }
      }
    })(req, res, next);
  };

  tryNext();
});
```

---

## 7) Config & Live Flips

The process is now to update the `route-config.json` file (for Express) or the `route-config` key in Cloudflare KV.

### 7.1 The Configuration File
A single `route-config.json` file at the root of the project becomes the source of truth.

### 7.2 Flip Script (Manual)
The script now just needs to read, modify, and write a JSON file or update a KV key.

**PowerShell (for local `route-config.json`):**
```powershell
param([string]$app = "task", [string]$priority = "21")

$configFile = "./route-config.json"
$config = Get-Content $configFile | ConvertFrom-Json

$config.routes.$app.priority = $priority

$config | ConvertTo-Json -Depth 5 | Set-Content $configFile

Write-Host "Updated $app priority to $priority in $configFile"
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
- **Config changes:** Verify a live config change reroutes new requests correctly without a server restart.
- **Fallback triggers:** Test that a backend returning `404`, `500`, or `503` correctly triggers a fallback, but a `401` or `403` does not.

---

## 11) Rollout Plan
The plan is now more concrete.
1.  **Create `route-config.json`** at the project root with initial settings.
2.  **Implement the Edge Router** (Express is a good starting point as it's explicit).
    -   Install dependencies: `express`, `http-proxy-middleware`, `chokidar`, `dotenv`.
    -   Create the server file (`src/server.js`).
    -   Update `astro.config.mjs` to use the Express adapter.
3.  **Populate `.env`** with the required base URLs for providers.
4.  **Test** the fallback logic and live-reload mechanism locally.
5.  **Confirm** child apps work without any changes.

---

## 12) Future Extensions
- **Automated Flips**: The manual flip script is the first step. Later, an automated agent could call the same script/API based on performance metrics (e.g., latency spikes, error rates) from your logging provider.
- **Caching Implementation**: Build out the `// TODO` sections for caching, likely using an in-memory cache like `node-cache` for Express or the Cloudflare Cache API for the Worker.

---

## 13) Quick Reference (Env Vars & Config)

**`route-config.json`**
```json
{
  "global_priority": "2",
  "routes": {
    "task": { "priority": "21" },
    "watchparty": { "priority": "1" }
  },
  "providers": {
    "1": "${LOCAL_BASE}",
    "2": "${WORKER_BASE}",
    "3": "${LAMBDA_BASE}"
  }
}
```
*Note: The server would need to replace `${VAR}` tokens with actual environment variable values upon loading the config.*

**.env**
```env
# Provider base URLs
LOCAL_BASE=http://localhost:4001
WORKER_BASE=https://worker.hadoku.me
LAMBDA_BASE=https://your-lambda-url.aws
```
This setup provides a clean separation between the routing *structure* (JSON) and the routing *destinations* (env vars).
