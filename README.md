# hadoku_site

A modular Astro-based application that serves micro-frontends and intelligently routes API requests. Built on Cloudflare's edge infrastructure with GitHub Packages integration.

## Features

- **Micro-Frontend Architecture**: Load independent React apps as ES modules with isolated bundles
- **Universal Adapter Pattern**: Child apps export framework-agnostic handlers, parent provides adapters
- **Intelligent Edge Routing**: Cloudflare Workers with automatic fallback between tunnel, worker, and static backends
- **Access Control**: Key-based authentication (public/friend/admin) with runtime validation
- **GitHub Packages Integration**: Private npm packages for child app business logic
- **Analytics Engine Logging**: Zero-config request tracking with SQL queries
- **Automated Package Updates**: Child apps trigger parent updates via repository dispatch

## Quick Start

```bash
# Install
npm install

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## Access Levels

Visit the site with different access keys:

- **Public**: `https://hadoku.me/` - Home only
- **Friend**: `https://hadoku.me/?key=FRIEND_KEY` - Home + Watchparty
- **Admin**: `https://hadoku.me/?key=ADMIN_KEY` - All apps

See [docs/ACCESS_CONTROL.md](docs/ACCESS_CONTROL.md) for details.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  CLOUDFLARE EDGE INFRASTRUCTURE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Edge Router Worker (hadoku.me/*)                        │   │
│  │  ├─ Intelligent fallback routing                         │   │
│  │  ├─ Analytics Engine logging                             │   │
│  │  └─ X-Backend-Source tracking                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│         ↓                    ↓                    ↓              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐        │
│  │ Tunnel       │   │ Workers      │   │ GitHub Pages │        │
│  │ (localhost)  │   │ (task-api)   │   │ (static)     │        │
│  └──────────────┘   └──────────────┘   └──────────────┘        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB PACKAGES (PRIVATE)                     │
├─────────────────────────────────────────────────────────────────┤
│  @wolffm/task@1.0.0 → TaskHandlers, TaskStorage, AuthContext    │
└─────────────────────────────────────────────────────────────────┘
```

### File Structure

```
hadoku_site/
├── src/                          # Astro source
│   ├── components/
│   │   ├── MicroFrontend.astro  # Reusable micro-app component
│   │   ├── mf-loader.js         # Dynamic module loader + auth
│   │   └── hadoku-header.js     # Header web component
│   ├── config/
│   │   ├── access-control.ts    # User type & visibility rules
│   │   └── micro-frontends.ts   # App configurations
│   ├── pages/
│   │   ├── index.astro          # Home with app directory
│   │   └── [app].astro          # Dynamic route for all apps
│   └── layouts/
│       └── Base.astro           # Base HTML layout
├── public/
│   └── mf/
│       ├── registry.json        # Auto-generated (gitignored)
│       └── [app]/               # App bundles deployed here
│           ├── index.js
│           └── style.css
├── workers/                      # Cloudflare Workers
│   ├── edge-router/             # Main traffic handler
│   │   ├── src/
│   │   │   ├── index.ts         # Routing + fallback logic
│   │   │   └── logging/         # Analytics Engine
│   │   └── wrangler.toml
│   └── task-api/                # Task API worker
│       ├── src/
│       │   └── index.ts         # Hono adapter for @wolffm/task
│       ├── package.json         # Depends on @wolffm/task
│       └── wrangler.toml
├── scripts/
│   ├── generate-registry.mjs    # Generates registry
│   └── manage_github_token.py   # Syncs secrets across repos
└── docs/
    ├── ARCHITECTURE.md          # Complete system architecture
    ├── API_EXPORTS.md           # Child package exports reference
    └── GITHUB_ACTIONS_LOGS.md   # Log retrieval guide
```

### How It Works

1. **Build Time**: Child apps publish to GitHub Packages → parent `update-packages.yml` workflow installs updates
2. **Static Deployment**: Astro builds to GitHub Pages with micro-frontend bundles
3. **Worker Deployment**: `deploy-workers.yml` deploys edge-router and task-api to Cloudflare
4. **Request Flow**: 
   - Browser → `hadoku.me/*` → edge-router → tunnel/worker/static (with fallback)
   - edge-router logs all requests to Analytics Engine
5. **Universal Adapter Pattern**: 
   - Child exports: `TaskHandlers` (business logic), `TaskStorage` (interface)
   - Parent implements: `GitHubStorage` (GitHub API adapter), Hono routes (HTTP layer)

## Creating a Child App

Child apps follow the **Universal Adapter Pattern**: export framework-agnostic handlers, parent provides adapters.

### 1. Frontend (Micro-Frontend)

```typescript
// entry.tsx - Mount/unmount for parent integration
export function mount(el: HTMLElement, props: AppProps) {
  const root = createRoot(el);
  root.render(<App {...props} />);
}

export function unmount(el: HTMLElement) {
  // Cleanup
}
```

### 2. Backend (Server Exports)

```typescript
// src/server/handlers.ts - Pure business logic
export const TaskHandlers = {
  async getTasks(storage: TaskStorage, auth: AuthContext) {
    // Framework-agnostic logic
  }
};

// src/server/storage.ts - Interface for parent to implement
export interface TaskStorage {
  getTasks(userType: UserType): Promise<TasksFile>;
  saveTasks(userType: UserType, tasks: TasksFile): Promise<void>;
}
```

### 3. Package Publishing

```json
// package.json
{
  "name": "@wolffm/task",
  "version": "1.0.0",
  "exports": {
    "./api": {
      "types": "./dist/server/index.d.ts",
      "default": "./dist/server/index.js"
    },
    "./frontend": "./dist/index.js"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### 4. Parent Integration

Parent consumes the package and provides adapters:

```typescript
// workers/task-api/src/index.ts
import { TaskHandlers, type TaskStorage } from '@wolffm/task/api';

// Parent implements storage adapter
const storage: TaskStorage = {
  async getTasks(userType) {
    // GitHub API implementation
  }
};

// Parent creates HTTP routes
app.get('/task/api', async (c) => {
  const result = await TaskHandlers.getTasks(storage, auth);
  return c.json(result);
});
```

See [docs/API_EXPORTS.md](docs/API_EXPORTS.md) for complete reference.

## Deployment

### Local Development
```bash
# Install dependencies
npm install

# Start Astro dev server
npm run dev

# Visit http://localhost:4321
```

### Production Deployment

**Automated via GitHub Actions:**

1. **GitHub Pages** (Static Site)
   - Workflow: `.github/workflows/deploy.yml`
   - Builds Astro site + micro-frontends
   - Deploys to `wolffm.github.io/hadoku_site`

2. **Cloudflare Workers** (API Routing)
   - Workflow: `.github/workflows/deploy-workers.yml`
   - Deploys `edge-router` and `task-api`
   - Requires secrets: `CLOUDFLARE_API_TOKEN`, `ADMIN_KEY`, `FRIEND_KEY`, `GITHUB_PAT`

3. **Package Updates** (Child Apps)
   - Workflow: `.github/workflows/update-packages.yml`
   - Listens for `repository_dispatch` events
   - Updates `@wolffm/task` from GitHub Packages
   - Requires secret: `DEPLOY_PACKAGE_TOKEN`

**Manual Deployment:**
```bash
# Deploy workers
cd workers/edge-router
wrangler deploy

cd ../task-api
wrangler deploy
```

See [workers/README.md](workers/README.md) for worker deployment details.

## Environment Variables

### GitHub Secrets (for Workflows)
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token for worker deployments
- `DEPLOY_PACKAGE_TOKEN` - GitHub PAT for downloading private packages
- `ADMIN_KEY` - Task API admin authentication
- `FRIEND_KEY` - Task API friend authentication  
- `GITHUB_PAT` - GitHub API token for task storage
- `ROUTE_CONFIG` - JSON routing configuration for edge-router

### Cloudflare Worker Secrets
Set via `wrangler secret put`:
```bash
# task-api worker
echo "value" | wrangler secret put ADMIN_KEY
echo "value" | wrangler secret put FRIEND_KEY
echo "value" | wrangler secret put GITHUB_PAT
```

### Local Development (.env)
```bash
ADMIN_KEY=test-admin-key
FRIEND_KEY=test-friend-key
MODE=development
```

See [scripts/README.md](scripts/README.md) for token management automation.

## Documentation

### Core Docs
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Complete system architecture and request flows
- **[API_EXPORTS.md](docs/API_EXPORTS.md)** - Child package exports reference
- **[CHILD_APP_TEMPLATE.md](docs/CHILD_APP_TEMPLATE.md)** - Guide for creating child apps

### Component Docs
- **[workers/README.md](workers/README.md)** - Cloudflare Workers deployment guide
- **[scripts/README.md](scripts/README.md)** - GitHub token management automation
- **[docs/GITHUB_ACTIONS_LOGS.md](docs/GITHUB_ACTIONS_LOGS.md)** - Log retrieval guide

### Quick Reference
- **System overview?** → [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Worker deployment?** → [workers/README.md](workers/README.md)
- **Creating child apps?** → [CHILD_APP_TEMPLATE.md](docs/CHILD_APP_TEMPLATE.md)
- **Package exports?** → [API_EXPORTS.md](docs/API_EXPORTS.md)

## Tech Stack

### Frontend
- **[Astro](https://astro.build/)** - Static site generator with SSR
- **[React](https://react.dev/)** - Micro-frontend framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety across stack
- **ES Modules** - Dynamic micro-app loading via importmap

### Backend
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Edge computing platform
- **[Hono](https://hono.dev/)** - Express-like framework for Workers
- **[GitHub API](https://docs.github.com/rest)** - Task data storage
- **[Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/)** - Request logging with SQL queries

### Package Management
- **[GitHub Packages](https://github.com/features/packages)** - Private npm registry
- **[@wolffm/task](https://github.com/WolffM/hadoku-task)** - Task app business logic package

### DevOps
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD automation
- **[GitHub Pages](https://pages.github.com/)** - Static site hosting
- **[Wrangler](https://developers.cloudflare.com/workers/wrangler/)** - Worker deployment CLI

## Key Features

### Request Routing
1. Browser → `https://hadoku.me/task/api/*`
2. Edge-router worker receives request
3. Tries backends in priority order (tunnel → worker → static)
4. First successful response returned with `X-Backend-Source` header
5. Request logged to Analytics Engine for monitoring

### Universal Adapter Pattern
- **Child Package**: Exports `TaskHandlers` (pure functions) + `TaskStorage` (interface)
- **Parent Adapter**: Implements `GitHubStorage` (GitHub API) + Hono routes (HTTP)
- **Benefits**: Business logic in child, infrastructure in parent, easy testing

### Storage Implementation
Parent's task-api worker implements `TaskStorage` interface:
```typescript
{
  getTasks(userType) → GitHub API → data/{userType}/tasks.json
  saveTasks(userType, tasks) → GitHub API → commit to repo
}
```

## Performance

- **Edge-router overhead**: ~5-10ms per request
- **Tunnel latency**: ~30-70ms (local network fallback)
- **Worker latency**: ~160-330ms (GitHub API + cold start)
- **Static content**: ~20-50ms (GitHub Pages CDN)
- **Analytics Engine**: Non-blocking writes, zero query cost
- **Free tier**: 100,000 Worker requests/day, 10M analytics events/month

## License

ISC