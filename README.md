# hadoku_site

An Astro-based shell application for managing micro-frontends. Provides dynamic app loading, access control, and automated deployment.

## Features

- **Dynamic Micro-Frontend Loading**: Load React/Vue/vanilla JS apps as ES modules
- **Access Control**: URL-based access levels (public/friend/admin)
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
hadoku_site/
├── src/
│   ├── components/
│   │   ├── MicroFrontend.astro  # Reusable micro-app component
│   │   ├── mf-loader.js         # Dynamic module loader
│   │   └── hadoku-header.js     # Header web component
│   ├── config/
│   │   ├── access-control.ts    # User type & visibility rules
│   │   └── micro-frontends.ts   # App configurations
│   ├── pages/
│   │   ├── index.astro          # Home with app cards
│   │   └── [app].astro          # Dynamic route for all apps
│   └── layouts/
│       └── Base.astro           # Base HTML layout
├── public/
│   └── mf/
│       ├── registry.json        # Auto-generated (gitignored)
│       └── [app]/               # App bundles deployed here
│           ├── index.js
│           └── style.css
├── scripts/
│   └── generate-registry.mjs    # Generates registry with secrets
└── docs/
    ├── ACCESS_CONTROL.md         # Access level documentation
    ├── REGISTRY_CONFIGURATION.md # Registry system guide
    └── starter-templates/        # Template for new micro-apps
```

### How It Works

1. **Build Time**: `generate-registry.mjs` creates `registry.json` with environment variables
2. **Load Time**: `mf-loader.js` fetches registry and imports app bundle
3. **Runtime**: App's `mount(el, props)` function renders into `#root`
4. **Access Control**: URL `?key=xxx` determines which apps are visible

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

## Environment Variables

Required GitHub Secrets:

- `HADOKU_SITE_TOKEN` - GitHub PAT (shared with all apps)
- `ADMIN_KEY` - Admin access key (generated with `openssl rand -hex 16`)
- `FRIEND_KEY` - Friend access key (generated with `openssl rand -hex 16`)

## Documentation

- [ACCESS_CONTROL.md](docs/ACCESS_CONTROL.md) - Access levels and URL keys
- [REGISTRY_CONFIGURATION.md](docs/REGISTRY_CONFIGURATION.md) - Registry system
- [starter-templates/](docs/starter-templates/) - Template for new apps

## Tech Stack

- **[Astro](https://astro.build/)** - Static site generator
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **ES Modules** - Dynamic micro-app loading
- **Web Components** - Custom elements
- **GitHub Actions** - CI/CD

## License

ISC