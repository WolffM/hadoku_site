# Parent Integration Guide

**Connection points and expectations for integrating child apps into hadoku_site**

---

## Overview

Child apps are micro-frontends that mount into the parent application. They provide their own UI bundles and optionally publish backend packages following the Universal Adapter Pattern.

---

## Frontend Integration

### Required File Structure

```
public/mf/{app-name}/
├── index.js      # UMD bundle with mount/unmount exports
└── style.css     # Optional styles
```

### Mount/Unmount Contract

**Child must export:**
```typescript
export function mount(el: HTMLElement, props: AppProps): void
export function unmount(el: HTMLElement): void
```

**Props provided by parent:**
```typescript
interface AppProps {
  basename?: string      // URL base path (e.g., '/myapp')
  apiUrl?: string        // API endpoint (e.g., '/myapp/api')
  environment?: string   // 'development' | 'production'
  userType?: 'admin' | 'friend' | 'public'
}
```

**Mounting lifecycle:**
1. Parent loads `index.js` as ES module
2. Parent calls `mount(element, props)`
3. Child renders into provided element
4. Child stores cleanup references on element
5. Parent calls `unmount(element)` when navigating away
6. Child cleans up listeners, timers, roots

### Parent Page Structure

```astro
---
// src/pages/{app-name}/index.astro
---
<html>
  <head>
    <link rel="stylesheet" href="/mf/{app-name}/style.css">
  </head>
  <body>
    <div id="app"></div>
    <script type="module">
      import { mount } from '/mf/{app-name}/index.js'
      
      mount(document.getElementById('app'), {
        apiUrl: '/{app-name}/api',
        environment: 'production',
        userType: 'friend'
      })
    </script>
  </body>
</html>
```

### Deployment Flow

1. Child pushes built bundle to `public/mf/{app-name}/`
2. Parent serves static files at `hadoku.me/{app-name}`
3. No parent code changes required after initial setup

---

## Backend Integration (Optional)

### Package Structure

**Child publishes to GitHub Packages:**
```
@wolffm/{app-name}
└── /api
    ├── handlers    # Pure business logic
    ├── interfaces  # Storage/auth contracts
    └── types       # Shared TypeScript types
```

**Import path:**
```typescript
import { AppHandlers, AppStorage, AuthContext } from '@wolffm/{app-name}/api'
```

### Universal Adapter Pattern

**Child exports:**
- Pure handler functions
- Storage interface (parent implements)
- Auth context interface
- TypeScript types

**Parent provides:**
- Storage adapter implementation (Workers KV, D1, etc.)
- HTTP layer (Hono framework)
- Authentication middleware
- Error handling

**Contract:**
```typescript
// Child exports
export interface AppStorage {
  getFile<T>(path: string): Promise<T>
  saveFile(path: string, data: unknown): Promise<void>
}

export interface AuthContext {
  userType: 'admin' | 'friend' | 'public'
}

export const AppHandlers = {
  getData: (storage: AppStorage, auth: AuthContext) => { /* ... */ },
  createItem: (storage: AppStorage, auth: AuthContext, data: any) => { /* ... */ }
}

// Parent implements
const storage: AppStorage = {
  getFile: async (path) => { /* Workers KV logic */ },
  saveFile: async (path, data) => { /* Workers KV logic */ }
}

const auth: AuthContext = { userType: c.get('userType') }

// Parent calls
const result = await AppHandlers.getData(storage, auth)
```

### Parent Worker Structure

```
workers/{app-name}-api/
├── package.json      # Dependencies: @wolffm/{app-name}, hono
├── wrangler.toml     # Routes: task-api.hadoku.me/{app-name}/api/*
└── src/
    └── index.ts      # HTTP layer + storage adapter
```

### Deployment Flow

1. Child publishes package to GitHub Packages
2. Child triggers `repository_dispatch` event
3. Parent updates package: `npm update @wolffm/{app-name}`
4. Parent redeploys worker: `wrangler deploy`
5. Worker serves API at `task-api.hadoku.me/{app-name}/api/`

---

## Authentication

### User Types

- **admin**: Full access
- **friend**: Limited access (specific to app)
- **public**: Read-only or no access

### Auth Flow

1. Parent authenticates via API key (`X-Admin-Key` header)
2. Parent determines userType from key
3. Parent passes userType to:
   - Frontend via `mount()` props
   - Backend via `AuthContext` interface

### Child Responsibilities

- Accept userType from parent
- Implement access control based on userType
- Return appropriate errors for unauthorized access

---

## Storage Pattern

### Path Convention

```
data/{app-name}/{userType}/resource.json
```

**Examples:**
- `data/task/admin/tasks.json`
- `data/watchparty/friend/parties.json`
- `data/contact/public/messages.json`

### Storage Interface

**Child defines interface, parent implements:**
```typescript
interface AppStorage {
  getFile<T>(path: string): Promise<T>
  saveFile(path: string, data: unknown): Promise<void>
}
```

**Parent implementation uses:**
- GitHub API (Octokit) for file storage
- Workers KV for caching (optional)
- Environment variable `GITHUB_PAT` for auth

---

## CORS Configuration

### Parent CORS Settings

```typescript
cors({
  origin: [
    'https://hadoku.me',
    'https://www.hadoku.me',
    'http://localhost:5173',  // Child dev server
    'http://localhost:4321'   // Parent dev server
  ],
  credentials: true
})
```

### Child Expectations

- Frontend bundles served from same origin (`hadoku.me`)
- API requests to subdomain (`task-api.hadoku.me`)
- Dev mode supports localhost origins

---

## Error Handling

### Parent Expectations

Child handlers should:
- **Throw errors** for exceptional cases
- **Return null/undefined** for missing data
- **Return empty arrays** for empty collections

Parent will:
- Catch thrown errors
- Convert to appropriate HTTP status codes
- Log errors with context

### Example

```typescript
// Child handler
export async function getItem(storage, auth, id) {
  const items = await storage.getFile('items.json')
  const item = items.find(i => i.id === id)
  
  if (!item) {
    throw new Error('Item not found')  // Parent converts to 404
  }
  
  return item
}

// Parent route
app.get('/item/:id', async (c) => {
  try {
    const item = await AppHandlers.getItem(storage, auth, id)
    return c.json(item)
  } catch (error) {
    return c.json({ error: error.message }, 404)
  }
})
```

---

## Registry Updates

### Automatic Registration

When child bundle is pushed to `public/mf/{app-name}/`, parent automatically:
1. Detects new/updated bundle
2. Updates `public/mf/registry.json`
3. Makes app discoverable

**Registry entry:**
```json
{
  "apps": [
    {
      "name": "myapp",
      "path": "/mf/myapp/index.js",
      "version": "1.0.0",
      "routes": ["/myapp"]
    }
  ]
}
```

---

## Secrets Management

### Child Repository Secrets

- **HADOKU_SITE_TOKEN**: Push bundles to parent repo

### Parent Repository Secrets

- **DEPLOY_PACKAGE_TOKEN**: Download packages from GitHub Packages
- **CLOUDFLARE_API_TOKEN**: Deploy workers
- **ADMIN_KEY**: Admin API access
- **FRIEND_KEY**: Friend API access
- **GITHUB_PAT**: GitHub API access for storage

### Worker Secrets

Set via wrangler:
```bash
echo "secret-value" | wrangler secret put SECRET_NAME
```

---

## Development Workflow

### Local Development

**Child:**
```bash
npm run dev
# http://localhost:5173?userType=admin
```

**Parent:**
```bash
npm run dev
# http://localhost:4321/myapp
```

**Worker:**
```bash
cd workers/myapp-api
wrangler dev
# http://localhost:8787/myapp/api
```

### Integration Testing

1. Build child: `npm run build`
2. Copy bundle to parent: `cp dist/* ../hadoku_site/public/mf/myapp/`
3. Test parent page: `http://localhost:4321/myapp`
4. Test API: `http://localhost:8787/myapp/api`

---

## Summary

### Child Provides

**Frontend:**
- `public/mf/{app}/index.js` with mount/unmount
- Optional `style.css`

**Backend (optional):**
- Package `@wolffm/{app}` on GitHub Packages
- Handlers (pure functions)
- Storage interface
- TypeScript types

### Parent Provides

**Frontend:**
- Static file serving
- Page with mount logic
- Props (apiUrl, userType, etc.)

**Backend:**
- Storage adapter implementation
- HTTP layer (Hono)
- Authentication
- Error handling
- CORS configuration

### Connection Points

1. **Bundle location**: `public/mf/{app}/index.js`
2. **Mount contract**: `mount(el, props)` / `unmount(el)`
3. **Package import**: `@wolffm/{app}/api`
4. **Storage interface**: `AppStorage`
5. **Auth interface**: `AuthContext`
6. **Route pattern**: `task-api.hadoku.me/{app}/api/*`

---

**Version**: 1.0.0  
**Last Updated**: January 2025
