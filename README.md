# hadoku_site

A modular personal site with micro-frontends and intelligent API routing. Built on Cloudflare Workers with automated child app integration.

## Quick Start

```bash
# Development
npm install
npm run dev

# Build
npm run build
```

## What's Inside

- **Micro-Frontends**: Independent React apps loaded dynamically
- **Universal Adapter Pattern**: Child apps export logic, parent provides infrastructure
- **Intelligent Edge Routing**: Cloudflare Workers with tunnel → worker → static fallback
- **GitHub Packages**: Private npm packages for child app business logic
- **Analytics Engine**: Zero-config request logging with SQL queries

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  CLOUDFLARE EDGE INFRASTRUCTURE                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Edge Router Worker (hadoku.me/*)                        │   │
│  │  ├─ Intelligent fallback routing                         │   │
│  │  ├─ Analytics Engine logging                             │   │
│  │  └─ X-Backend-Source tracking                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│         ↓                  ↓                   ↓                │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │
│  │ Tunnel       │   │ Workers      │   │ GitHub Pages │         │
│  │ (localhost)  │   │ (task-api)   │   │ (static)     │         │
│  └──────────────┘   └──────────────┘   └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB PACKAGES (PRIVATE)                    │
├─────────────────────────────────────────────────────────────────┤
│  @wolffm/task@1.0.0 → TaskHandlers, TaskStorage, AuthContext    │
└─────────────────────────────────────────────────────────────────┘
```

### How It Works

**Request Flow:**
```
Browser → hadoku.me → edge-router Worker 
  → Try: Tunnel (localhost) 
  → Try: API Worker (task-api) 
  → Fallback: Static (GitHub Pages)
```

**Universal Adapter Pattern:**
- Child apps publish packages to GitHub Packages
- Parent downloads and implements storage adapters
- Business logic stays in child, infrastructure in parent

See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for complete details.

## Tech Stack

- **[Astro](https://astro.build/)** - Static site generator
- **[React](https://react.dev/)** - Micro-frontend framework
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Edge computing
- **[Hono](https://hono.dev/)** - HTTP framework for Workers
- **[GitHub Packages](https://github.com/features/packages)** - Private npm registry

## Deployment

Production deployment is automated via GitHub Actions:
- **Static Site**: `.github/workflows/deploy.yml` → GitHub Pages
- **Workers**: `.github/workflows/deploy-workers.yml` → Cloudflare
- **Package Updates**: `.github/workflows/update-packages.yml` → Auto-update child packages

See **[workers/README.md](workers/README.md)** for deployment details.

## Documentation

| Document | Purpose |
|----------|---------|
| **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** | Complete system architecture, request flows, design patterns |
| **[CHILD_APP_TEMPLATE.md](docs/CHILD_APP_TEMPLATE.md)** | Guide for creating new child apps with Universal Adapter Pattern |
| **[API_EXPORTS.md](docs/API_EXPORTS.md)** | Child package exports reference (@wolffm/task) |
| **[workers/README.md](workers/README.md)** | Cloudflare Workers deployment guide |
| **[scripts/README.md](scripts/README.md)** | GitHub token management automation |

## License

ISC