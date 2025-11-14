# hadoku_site

A modular personal site with micro-frontends and intelligent API routing. Built on Cloudflare Workers with automated child app integration.

## 🚀 Quick Start

**First time setup?** See **[SETUP.md](SETUP.md)** for complete instructions.

```bash
# 1. Copy environment files
cp .env.example .env
cp .npmrc.example .npmrc

# 2. Edit .env and .npmrc with your tokens

# 3. Verify setup
python scripts/verify_and_install.py

# 4. Install dependencies
pnpm install

# 5. Development
pnpm run dev

# 6. Build
pnpm run build
```

**Quick Reference:** See **[CHECKLIST.md](CHECKLIST.md)** for setup checklist and troubleshooting.

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

## Testing

Run tests for workers:

```bash
cd workers/task-api
npm test
```

**Test Coverage:** ~75% overall (70% structural, 60% quality)

- 17 test files, 81 tests
- Integration-focused testing
- Session management fully covered
- Recent bug fixes at 100% coverage

See **[docs/TESTING.md](docs/TESTING.md)** for test strategy and writing tests.

## 📚 Documentation

### Getting Started

| Document                         | Purpose                                                    |
| -------------------------------- | ---------------------------------------------------------- |
| **[SETUP.md](SETUP.md)**         | 🎯 Complete setup guide with environment configuration     |
| **[CHECKLIST.md](CHECKLIST.md)** | ✅ Quick reference checklist for setup and troubleshooting |

### System Documentation

| Document                                                          | Purpose                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------ |
| **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**                       | Complete system architecture, request flows, design patterns |
| **[SESSION_ARCHITECTURE.md](docs/SESSION_ARCHITECTURE.md)**       | Session & preference storage design decisions                |
| **[TESTING.md](docs/TESTING.md)**                                 | Test strategy, coverage, and writing tests                   |
| **[SECURITY.md](docs/SECURITY.md)**                               | Authentication, throttling, and security model               |
| **[PARENT_API_EXPECTATIONS.md](docs/PARENT_API_EXPECTATIONS.md)** | Parent app API expectations and integration guide            |
| **[workers/README.md](workers/README.md)**                        | Cloudflare Workers deployment guide                          |
| **[scripts/admin/README.md](scripts/admin/README.md)**            | Admin scripts for KV management                              |

## 🔄 Automatic Package Updates

When a child repository (e.g., `hadoku-task`) publishes a new version of `@wolffm/task`:

1. **Child repo** publishes to GitHub Packages
2. **Child repo** sends `repository_dispatch` event
3. **This repo** automatically updates via `.github/workflows/update-packages.yml`
4. **Package updates** trigger deployment workflows

See **[SETUP.md#automatic-package-updates](SETUP.md#automatic-package-updates)** for details.

## License

ISC
