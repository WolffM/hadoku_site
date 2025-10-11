# Switch `task-api` to `api.hadoku.me` — Deployment Guide
**Date:** 2025-10-11 18:31:17Z  
**Audience:** Hadoku (controller + micro-apps)  
**Tone:** Concise, pragmatic, reversible

This guides you to run the **task API** on **Cloudflare Workers** at `api.hadoku.me`, while keeping:
- Static UI on **GitHub Pages**
- Heavy/local APIs on **Cloudflare Tunnel** (e.g., `watchparty-api.hadoku.me`)
- Optional fallback order controlled by a single env var (`ROUTE_PRIORITY`).

---

## 0) Nameplan (avoid loops)
- **Worker (task API):** `api.hadoku.me`
- **Tunnel (local APIs):** use **different** hosts, e.g.:
  - `local-api.hadoku.me` (generic local Express)
  - `watchparty-api.hadoku.me` (streaming)
  
If `api.hadoku.me` currently points to a tunnel, move it before deploying the Worker.

**Tunnel moves**
```bash
cloudflared tunnel route dns <tunnel-name> local-api.hadoku.me
cloudflared tunnel route dns <tunnel-name> watchparty-api.hadoku.me
# Remove any existing tunnel route for api.hadoku.me (Dashboard or CLI)
```

Ensure those tunnel DNS records are **proxied** (orange cloud).

---

## 1) Configure the `task-api` Worker

**workers/task-api/wrangler.toml**
```toml
name = "task-api"
main = "src/index.ts"
compatibility_date = "2025-10-11"
workers_dev = false

# Bind the API paths to your domain
routes = [
  { pattern = "api.hadoku.me/task/api/*", zone_name = "hadoku.me" },
  { pattern = "api.hadoku.me/task/api",    zone_name = "hadoku.me" }
]

[vars]
REPO_OWNER  = "WolffM"
REPO_NAME   = "hadoku_site"
REPO_BRANCH = "main"
# Optional: per-app priority if this Worker also participates in fallback
# TASK_ROUTE_PRIORITY = "21"   # prefer Worker then Local
```

**Fix the tsconfig warning (Worker does NOT need Astro’s tsconfig)**
`workers/task-api/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "types": ["@cloudflare/workers-types"],
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

**Secrets/vars in CI (already good in your logs)**
- Secrets: `GITHUB_PAT`, `ADMIN_KEY`, (optionally `FRIEND_KEY`)
- Vars: `REPO_OWNER`, `REPO_NAME`, `REPO_BRANCH`

**Deploy**
```bash
wrangler deploy --config workers/task-api/wrangler.toml
```

---

## 2) Frontend calls

If you’re **not** using a front-door Worker yet, your browser calls must hit the subdomain:
```
https://api.hadoku.me/task/api/...
```

If you adopt a **front-door** later (Worker at `hadoku.me/*`), you can switch back to **relative** paths (`/task/api/...`) and let the edge decide.

---

## 3) CORS (only if cross-origin)
If the UI is at `https://hadoku.me` and the API is at `https://api.hadoku.me`, add CORS to the Worker:

```ts
const CORS = {
  "access-control-allow-origin": "https://hadoku.me",
  "access-control-allow-headers": "content-type,x-admin-key",
  "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "vary": "origin"
};

if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

// For normal responses, set headers.merge(CORS) on the Response
```

---

## 4) Fallback mapping (optional but recommended)

Set **different** base URLs to avoid recursion:
```env
# Local/tunnel vs worker
LOCAL_BASE=https://local-api.hadoku.me       # tunnel host
WORKER_BASE=https://api.hadoku.me            # this Worker
ROUTE_PRIORITY=12                            # 1=local, 2=worker  (or "21" to flip)
# Per-app override example:
TASK_ROUTE_PRIORITY=21
```

Never set `LOCAL_BASE=https://api.hadoku.me` — that would fetch yourself and loop.

---

## 5) Sanity tests

```bash
# Read
curl -i https://api.hadoku.me/task/api/task

# Create
curl -i -X POST https://api.hadoku.me/task/api/task   -H "x-admin-key: <key>" -H "content-type: application/json"   --data '{"title":"hello"}'

# Fallback check
# 1) Stop local tunnel target for task; expect Worker still serves.
# 2) Start local; with ROUTE_PRIORITY starting with 1, expect local to serve.
```

---

## 6) CI adjustments

In your GitHub Actions job for the Worker:
```yaml
- name: Deploy task-api
  run: wrangler deploy --config workers/task-api/wrangler.toml
```

Remove any “register workers.dev” steps. You’re deploying to a **custom-domain route** only.

Ensure your repo/environment has:
- `CF_API_TOKEN` with **Workers Routes** + **KV** (if used) + **Account** permissions
- `CF_ACCOUNT_ID`

---

## 7) Optional: Edge front door (future)

Later, you can deploy an **edge-router Worker** at `hadoku.me/*`:
- `/task/api/*` → fallback (local → worker → lambda) using `ROUTE_PRIORITY`
- `/watchparty/api/*` → tunnel only
- Everything else → proxy to your GitHub Pages origin

When you do that, your UI can go back to **relative** fetch paths and skip CORS entirely.

---

## 8) Quick checklist

- [ ] Move tunnel off `api.hadoku.me` to `local-api.hadoku.me` (and `watchparty-api.hadoku.me` for streaming)  
- [ ] Add `routes` in `workers/task-api/wrangler.toml` for `api.hadoku.me`  
- [ ] Add local tsconfig to task-api Worker to silence Astro tsconfig warning  
- [ ] Deploy Worker; verify `GET /task/api/task` works  
- [ ] If cross-origin, enable CORS in Worker  
- [ ] Configure `LOCAL_BASE`, `WORKER_BASE`, `ROUTE_PRIORITY` (and per-app overrides if desired)  
- [ ] Run curl tests above  
- [ ] Update CI to deploy via `wrangler deploy` with custom route (no workers.dev)

---

### Appendix — tiny CORS helper for Worker
```ts
function withCors(r: Response, origin = "https://hadoku.me") {
  const h = new Headers(r.headers);
  h.set("access-control-allow-origin", origin);
  h.set("access-control-allow-headers", "content-type,x-admin-key");
  h.set("access-control-allow-methods", "GET,POST,PATCH,DELETE,OPTIONS");
  h.set("vary", "origin");
  return new Response(r.body, { status: r.status, headers: h });
}
```
