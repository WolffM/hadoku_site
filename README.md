# hadoku_site

An Astro-based shell application for managing micro-frontends. Provides dynamic app loading, access control, serverless API backends, and automated deployment.

## Features

- **Dynamic Micro-Frontend Loading**: Load React/Vue/vanilla JS apps as ES modules
- **Access Control**: URL-based access levels (public/friend/admin)
- **Serverless API Backend**: Cloudflare Pages Functions for scalable APIs
- **Dual Storage Modes**: localStorage for public users, server API for authenticated users
- **Auto-Generated Registry**: Props and secrets injected at build time
- **GitHub Actions Deployment**: Automated cross-repo deployments
- **Single Dynamic Route**: One template handles all micro-apps

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
│                      Cloudflare Pages                            │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Static Site (Astro Build - /dist)                        │  │
│  │  ├─ Home page with app directory                          │  │
│  │  ├─ Micro-frontend loader (mf-loader.js)                  │  │
│  │  └─ Child app bundles (/mf/task/, /mf/watchparty/, etc.)  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Serverless Functions (/functions)                        │  │
│  │  └─ /task/api/[[path]].js                                 │  │
│  │     ├─ Authenticates admin/friend users                   │  │
│  │     ├─ Blocks public users (they use localStorage)        │  │
│  │     └─ Routes to Express task router                      │  │
│  └───────────────────────────────────────────────────────────┘  │
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
├── api/                          # Express server (local dev)
│   ├── server.js                # Main server
│   └── apps/
│       └── task/
│           ├── router.js        # Task Express router
│           ├── handlers/        # Business logic
│           └── routes/          # HTTP endpoints
├── functions/                    # Cloudflare Pages Functions (production)
│   └── task/
│       └── api/
│           └── [[path]].js      # Serverless adapter
├── scripts/
│   └── generate-registry.mjs    # Generates registry with secrets
└── docs/
    ├── ARCHITECTURE.md          # Complete system architecture
    ├── CLOUDFLARE_PAGES_FUNCTIONS.md  # Deployment guide
    └── PARENT_INTEGRATION.md    # Integration guide
```

### How It Works

1. **Build Time**: `generate-registry.mjs` creates `registry.json` with environment variables
2. **Load Time**: `mf-loader.js` fetches registry, validates auth key, imports app bundle
3. **Runtime**: App's `mount(el, props)` function renders with validated `userType`
4. **Access Control**: URL `?key=xxx` determines user type and which apps are visible
5. **API Calls**: 
   - **Public users**: Use localStorage only (zero API calls)
   - **Admin/Friend**: Use Cloudflare Pages Functions at `/task/api/*`

## Creating a Micro-App

### 1. Use the Starter Template

Copy files from `docs/starter-templates/` to your new repo.

### 2. Micro-App Contract

Each app exports `mount` and `unmount`:

```typescript
export function mount(el: HTMLElement, props: AppProps) {
  // Render your app into el
  const root = createRoot(el);
  root.render(<App {...props} />);
}

export function unmount(el: HTMLElement) {
  // Clean up
}
```

### 3. Register in hadoku_site

Edit `scripts/generate-registry.mjs`:

```javascript
// Add your app config
myapp: {
  url: '/mf/myapp/index.js',
  css: '/mf/myapp/style.css',
  basename: '/myapp',
  props: myappConfig  // Define above with dev/prod variants
}
```

### 4. Update Access Control

Edit `src/config/access-control.ts`:

```typescript
export const appVisibility: Record<UserType, string[]> = {
  public: ['home'],
  friend: ['home', 'watchparty'],
  admin: ['home', 'watchparty', 'task', 'contact', 'herodraft', 'myapp']
};
```

### 5. Add to Dynamic Route

Edit `src/pages/[app].astro`:

```typescript
const validApps = ['watchparty', 'task', 'contact', 'herodraft', 'home', 'myapp'];
```

See [docs/starter-templates/README.md](docs/starter-templates/README.md) for complete guide.

## Deployment

### Local Development
```bash
# Set environment variables
$env:ADMIN_KEY="your-admin-key"
$env:FRIEND_KEY="your-friend-key"

# Start Express server
node api/server.js

# In another terminal, start Astro dev server
npm run dev

# Visit http://localhost:3000/task?key=your-admin-key
```

### Production (Cloudflare Pages)

1. **Connect GitHub repo** to Cloudflare Pages
2. **Configure build settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
3. **Set environment variables** in Cloudflare Dashboard:
   - `ADMIN_KEY` - Admin access UUID (use `uuidgen` or online tool)
   - `FRIEND_KEY` - Friend access UUID
   - `NODE_ENV=production`
   - `TASK_DATA_PATH=/tmp/hadoku-tasks`
4. **Push to GitHub** - Auto-deploys to Cloudflare

See [docs/CLOUDFLARE_PAGES_FUNCTIONS.md](docs/CLOUDFLARE_PAGES_FUNCTIONS.md) for complete deployment guide.

## Environment Variables

### GitHub Secrets (CI/CD)
- `HADOKU_SITE_TOKEN` - GitHub PAT (shared with all apps)
- `ADMIN_KEY` - Admin access key
- `FRIEND_KEY` - Friend access key

### Cloudflare Pages (Production)
- `ADMIN_KEY` - Admin access key (different from dev)
- `FRIEND_KEY` - Friend access key (different from dev)
- `NODE_ENV=production`
- `TASK_DATA_PATH=/tmp/hadoku-tasks`

### Local Development (.env)
- `ADMIN_KEY` - Local admin key
- `FRIEND_KEY` - Local friend key
- `TASK_DATA_PATH=./data/task`
- `NODE_ENV=development`

## Documentation

### Core Docs
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Complete system architecture, request flows, design patterns
- **[CLOUDFLARE_PAGES_FUNCTIONS.md](docs/CLOUDFLARE_PAGES_FUNCTIONS.md)** - Deployment guide with troubleshooting
- **[PARENT_INTEGRATION.md](docs/PARENT_INTEGRATION.md)** - How child apps integrate with parent

### Quick Reference
- **Want to understand the system?** → Read [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Want to deploy to production?** → Read [CLOUDFLARE_PAGES_FUNCTIONS.md](docs/CLOUDFLARE_PAGES_FUNCTIONS.md)
- **Want to integrate a child app?** → Read [PARENT_INTEGRATION.md](docs/PARENT_INTEGRATION.md)

## Tech Stack

### Frontend
- **[Astro](https://astro.build/)** - Static site generator
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **ES Modules** - Dynamic micro-app loading
- **Web Components** - Custom elements

### Backend
- **Express.js** - Local development server
- **Cloudflare Pages Functions** - Production serverless API
- **File System / localStorage** - Data storage (migrate to KV/R2 for persistence)

### DevOps
- **GitHub Actions** - CI/CD
- **Cloudflare Pages** - Hosting and edge functions

## Key Features

### Authentication Flow
1. User visits `https://hadoku.me/task?key=<uuid>`
2. Frontend validates key → determines userType (public/friend/admin)
3. Stores key in sessionStorage, cleans URL
4. Overrides `window.fetch` to add auth headers automatically
5. Child app receives validated `userType` prop

### Storage Modes
- **Public users**: localStorage only (offline-capable, zero API calls)
- **Admin/Friend users**: Server API via Cloudflare Functions (data synced)

### Serverless Adaptation
Same Express router code works in:
- **Local dev**: Long-running Express server
- **Production**: Cloudflare Pages Functions (serverless)

## Performance

- **Public mode**: < 1ms operations (localStorage), works offline
- **Admin/Friend mode**: ~50-200ms API calls (serverless function)
- **Free tier quota**: 100,000 requests/day (typical usage: < 1,000/day)

## License

ISC