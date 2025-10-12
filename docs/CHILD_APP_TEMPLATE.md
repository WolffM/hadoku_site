# Child App Template

**Template for creating micro-frontend child apps for hadoku.me**

This template provides the structure and configuration needed to create a new child app that integrates with the parent `hadoku_site` application.

---

## Overview

Child apps are independent applications that:
- Run as micro-frontends mounted in the parent app
- Optionally publish backend packages to GitHub Packages (Universal Adapter Pattern)
- Auto-deploy frontend bundles to parent on code changes
- Trigger parent updates when packages are published
- Share authentication/user context from parent

---

## Quick Start

### 1. Create New Repository

```bash
# Create from this template
git clone https://github.com/WolffM/hadoku-task.git my-new-app
cd my-new-app
npm install
```

### 2. Update Package Name

Edit `package.json`:
```json
{
  "name": "hadoku-my-app",
  "version": "0.1.0"
}
```

### 3. Update Build Workflow

Edit `.github/workflows/build.yml`:
- Change app name in paths
- Update deployment directories

---

## Required Files

### `src/entry.tsx` - Entry Point

The entry point exports `mount()` and `unmount()` functions for parent integration.

**Template**:
```typescript
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './style.css'

export interface MyAppProps {
  basename?: string      // Base URL path
  apiUrl?: string        // API endpoint (e.g., '/myapp/api')
  environment?: string   // 'development' | 'production'
  userType?: 'admin' | 'friend' | 'public'
}

export function mount(el: HTMLElement, props: MyAppProps = {}) {
  // Extract userType from URL params if not provided
  const urlParams = new URLSearchParams(window.location.search)
  const userType = props.userType || urlParams.get('userType') as any || 'public'
  
  const finalProps = { ...props, userType }
  const root = createRoot(el)
  root.render(<App {...finalProps} />)
  
  // Store root for unmounting
  ;(el as any).__root = root
  console.log('[my-app] Mounted successfully', finalProps)
}

export function unmount(el: HTMLElement) {
  ;(el as any).__root?.unmount()
}
```

**Key Points**:
- Export `mount(el, props)` - called by parent to render app
- Export `unmount(el)` - called by parent to cleanup
- Accept props interface for configuration
- Support `userType` from props or URL params
- Store root instance for cleanup

---

### `.github/workflows/build.yml` - CI/CD Pipeline

The workflow builds and deploys both client and server code to parent.

**Template**:
```yaml
name: Build and Deploy My App

on:
  push:
    branches: [ main ]
    paths:
      - 'src/**'
      - 'public/**'
      - 'package.json'
      - 'vite.config.ts'
      - 'tsconfig.json'
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout this repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build:all  # or just 'npm run build' if no server
      
      - name: Verify build output
        run: |
          # Verify client build exists
          if [ ! -f "dist/index.js" ]; then
            echo "❌ Error: dist/index.js not found"
            exit 1
          fi
          
          # If you have a server, verify it too
          # if [ ! -f "dist/server/router.js" ]; then
          #   echo "❌ Error: dist/server/router.js not found"
          #   exit 1
          # fi
      
      - name: Push built files to parent repository
        env:
          HADOKU_SITE_TOKEN: ${{ secrets.HADOKU_SITE_TOKEN }}
        run: |
          # Clone parent
          git clone https://${{ secrets.HADOKU_SITE_TOKEN }}@github.com/WolffM/hadoku_site.git parent
          cd parent
          
          # Create directories
          mkdir -p public/mf/myapp
          # mkdir -p api/apps/myapp  # If you have server code
          
          # Copy client build
          rm -rf public/mf/myapp/*
          cp -r ../dist/index.js ../dist/style.css public/mf/myapp/
          
          # Copy server build (if applicable)
          # rm -rf api/apps/myapp/*
          # cp -r ../dist/server/* api/apps/myapp/
          # cp ../package.json api/apps/myapp/
          
          # Configure git
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          
          # Commit and push
          git add public/mf/myapp/
          # git add api/apps/myapp/  # If you have server code
          
          if git diff --staged --quiet; then
            echo "✅ No changes to commit"
            echo "CHANGES_MADE=false" >> $GITHUB_ENV
          else
            git commit -m "chore: update myapp from ${{ github.sha }}"
            git push
            echo "✅ Successfully pushed myapp to hadoku_site"
            echo "CHANGES_MADE=true" >> $GITHUB_ENV
          fi
      
      - name: Trigger parent site deployment
        if: env.CHANGES_MADE == 'true'
        env:
          HADOKU_SITE_TOKEN: ${{ secrets.HADOKU_SITE_TOKEN }}
        run: |
          curl -X POST \
            "https://api.github.com/repos/WolffM/hadoku_site/dispatches" \
            -H "Authorization: Bearer $HADOKU_SITE_TOKEN" \
            -H "Accept: application/vnd.github+json" \
            -d '{"event_type":"myapp_updated","client_payload":{"sha":"${{ github.sha }}"}}'
```

**Key Points**:
- Triggers on pushes to main branch
- Requires `HADOKU_SITE_TOKEN` secret
- Builds client (and optionally server)
- Pushes to parent repository
- Triggers parent redeployment

---

## Optional: Backend Package (Universal Adapter Pattern)

If your app needs server-side logic, publish a package to GitHub Packages using the Universal Adapter Pattern.

### Universal Adapter Pattern Overview

The Universal Adapter Pattern decouples business logic from infrastructure:

- **Child exports**: Pure handler functions + storage/auth interfaces
- **Parent implements**: Storage adapters + HTTP layer (Hono, Express, etc.)
- **Benefits**: 
  - Parent can swap storage (KV → D1 → R2) without changing child
  - Child can be tested independently with mock storage
  - Multiple parents can use same child package
  - Child knows nothing about parent's HTTP framework

**Example Architecture:**
```
┌─────────────────────────────────────────────────────────────┐
│ Child Package (@wolffm/myapp)                               │
│ Published to GitHub Packages                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ exports MyAppHandlers = {                                   │
│   getData: (storage, auth) => { /* pure logic */ }         │
│   createItem: (storage, auth, data) => { /* ... */ }       │
│ }                                                            │
│                                                              │
│ exports interface MyAppStorage {                            │
│   getFile<T>(path: string): Promise<T>                     │
│   saveFile(path: string, data: any): Promise<void>         │
│ }                                                            │
│                                                              │
│ exports type AuthContext = { userType: UserType }          │
└─────────────────────────────────────────────────────────────┘
                              ↓
                     Published to GitHub Packages
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Parent Worker (workers/myapp-api)                          │
│ Imports @wolffm/myapp from GitHub Packages                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ // Implements storage adapter                               │
│ const storage: MyAppStorage = {                            │
│   getFile: async (path) => { /* Workers KV */ },          │
│   saveFile: async (path, data) => { /* Workers KV */ }    │
│ }                                                            │
│                                                              │
│ // HTTP layer with Hono                                     │
│ app.get('/myapp/api/data', authenticate, async (c) => {    │
│   const auth = { userType: c.get('userType') }            │
│   const data = await MyAppHandlers.getData(storage, auth) │
│   return c.json(data)                                      │
│ })                                                           │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── App.tsx           # React frontend
├── entry.tsx         # Mount/unmount exports
├── components/       # React components
├── hooks/            # Custom hooks
├── lib/              # Utilities & shared types
└── api/              # Backend package code (published to GitHub Packages)
    ├── index.ts      # Main exports (handlers + interfaces)
    ├── types.ts      # TypeScript types (exported)
    ├── handlers.ts   # Pure business logic functions
    └── interfaces.ts # Storage/auth interfaces for parent
```

### Package Template

**`package.json`** (for publishing):
```json
{
  "name": "@wolffm/myapp",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/api/index.js",
  "types": "./dist/api/index.d.ts",
  "files": [
    "dist/api/**/*"
  ],
  "exports": {
    "./api": {
      "import": "./dist/api/index.js",
      "types": "./dist/api/index.d.ts"
    }
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "scripts": {
    "build": "vite build",
    "build:api": "tsc -p tsconfig.api.json",
    "build:all": "npm run build && npm run build:api",
    "publish:package": "npm publish"
  }
}
```

**`src/api/index.ts`** (main exports):
```typescript
// Export handlers (pure business logic)
export * from './handlers.js'

// Export interfaces (parent implements)
export * from './interfaces.js'

// Export types (shared)
export * from './types.js'
```

**`src/api/types.ts`**:
```typescript
// User types
export type UserType = 'admin' | 'friend' | 'public'

// Auth context
export interface AuthContext {
  userType: UserType
}

// Data types
export interface MyAppItem {
  id: string
  title: string
  createdAt: string
  // ... your fields
}

export interface MyAppFile {
  items: MyAppItem[]
}
```

**`src/api/interfaces.ts`**:
```typescript
// Storage interface (parent implements)
export interface MyAppStorage {
  getFile<T>(path: string): Promise<T>
  saveFile(path: string, data: unknown): Promise<void>
}
```

**`src/api/handlers.ts`**:
```typescript
import type { MyAppStorage, AuthContext, MyAppItem, MyAppFile } from './index.js'

// Pure business logic - no HTTP, no framework coupling
export const MyAppHandlers = {
  // Get all items
  getItems: async (storage: MyAppStorage, auth: AuthContext): Promise<MyAppItem[]> => {
    const { userType } = auth
    const path = `data/myapp/${userType}/items.json`
    
    try {
      const file = await storage.getFile<MyAppFile>(path)
      return file.items
    } catch (error) {
      // Return empty array if file doesn't exist
      return []
    }
  },
  
  // Create item
  createItem: async (
    storage: MyAppStorage,
    auth: AuthContext,
    data: Omit<MyAppItem, 'id' | 'createdAt'>
  ): Promise<MyAppItem> => {
    const { userType } = auth
    const path = `data/myapp/${userType}/items.json`
    
    const newItem: MyAppItem = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...data
    }
    
    const items = await MyAppHandlers.getItems(storage, auth)
    items.push(newItem)
    
    await storage.saveFile(path, { items })
    
    return newItem
  },
  
  // Delete item
  deleteItem: async (
    storage: MyAppStorage,
    auth: AuthContext,
    id: string
  ): Promise<void> => {
    const { userType } = auth
    const path = `data/myapp/${userType}/items.json`
    
    const items = await MyAppHandlers.getItems(storage, auth)
    const filtered = items.filter(item => item.id !== id)
    
    await storage.saveFile(path, { items: filtered })
  }
}
```

### Build Configuration

**`tsconfig.api.json`**:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES2022",
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "types": []
  },
  "include": ["src/api/**/*"]
}
```

### Publishing Workflow

**`.github/workflows/publish.yml`**:
```yaml
name: Publish Package

on:
  push:
    branches: [ main ]
    paths:
      - 'src/api/**'
      - 'package.json'
      - 'tsconfig.api.json'
  workflow_dispatch:

permissions:
  contents: read
  packages: write

jobs:
  publish:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@wolffm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build package
        run: npm run build:api
      
      - name: Publish to GitHub Packages
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Get package version
        id: version
        run: echo "version=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT
      
      - name: Trigger parent update
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh api repos/WolffM/hadoku_site/dispatches \
            -f event_type=update-packages \
            -f client_payload[package]=@wolffm/myapp \
            -f client_payload[version]=${{ steps.version.outputs.version }}
```

---

## Parent Integration

### How Parent Loads Your Frontend

**`hadoku_site/src/pages/myapp/index.astro`**:
```astro
---
// Astro page that mounts your micro-frontend
---
<html>
  <head>
    <link rel="stylesheet" href="/mf/myapp/style.css">
  </head>
  <body>
    <div id="app"></div>
    <script type="module">
      import { mount } from '/mf/myapp/index.js'
      
      mount(document.getElementById('app'), {
        apiUrl: '/myapp/api',
        environment: 'production',
        userType: 'friend'
      })
    </script>
  </body>
</html>
```

### How Parent Uses Your Package (Worker Implementation)

The parent creates a Cloudflare Worker that:
1. Downloads your package from GitHub Packages
2. Implements storage adapter
3. Creates HTTP layer with Hono
4. Calls your handlers

**`hadoku_site/workers/myapp-api/package.json`**:
```json
{
  "name": "myapp-api-worker",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy"
  },
  "dependencies": {
    "@wolffm/myapp": "^1.0.0",
    "hono": "^4.0.0",
    "@octokit/rest": "^20.0.0"
  }
}
```

**`hadoku_site/workers/myapp-api/.npmrc`** (generated in CI):
```ini
@wolffm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${DEPLOY_PACKAGE_TOKEN}
```

**`hadoku_site/workers/myapp-api/wrangler.toml`**:
```toml
name = "myapp-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"
node_compat = true

[[routes]]
pattern = "task-api.hadoku.me/myapp/api/*"
```

**`hadoku_site/workers/myapp-api/src/index.ts`**:
```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Octokit } from '@octokit/rest'
import { MyAppHandlers, MyAppStorage, AuthContext, UserType } from '@wolffm/myapp/api'

interface Env {
  ADMIN_KEY: string
  FRIEND_KEY: string
  GITHUB_PAT: string
}

const app = new Hono<{ Bindings: Env }>()

app.use('/myapp/api/*', cors({ origin: 'https://hadoku.me' }))

// Helper: Get auth context from request
function getContext(c: any): { storage: MyAppStorage; auth: AuthContext } {
  const userType = c.get('userType') as UserType
  
  const storage: MyAppStorage = {
    getFile: async <T>(path: string): Promise<T> => {
      const octokit = new Octokit({ auth: c.env.GITHUB_PAT })
      
      const { data } = await octokit.repos.getContent({
        owner: 'WolffM',
        repo: 'hadoku_site',
        path
      })
      
      if ('content' in data) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8')
        return JSON.parse(content)
      }
      
      throw new Error('File not found')
    },
    
    saveFile: async (path: string, data: unknown): Promise<void> => {
      const octokit = new Octokit({ auth: c.env.GITHUB_PAT })
      
      // Get current file SHA
      let sha: string | undefined
      try {
        const { data: existing } = await octokit.repos.getContent({
          owner: 'WolffM',
          repo: 'hadoku_site',
          path
        })
        if ('sha' in existing) {
          sha = existing.sha
        }
      } catch (error) {
        // File doesn't exist yet
      }
      
      // Commit file
      await octokit.repos.createOrUpdateFileContents({
        owner: 'WolffM',
        repo: 'hadoku_site',
        path,
        message: `Update ${path}`,
        content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
        sha
      })
    }
  }
  
  return {
    storage,
    auth: { userType }
  }
}

// Middleware: Authenticate
app.use('/myapp/api/*', async (c, next) => {
  const key = c.req.header('X-Admin-Key')
  
  if (!key) {
    return c.json({ error: 'No API key provided' }, 401)
  }
  
  if (key === c.env.ADMIN_KEY) {
    c.set('userType', 'admin')
  } else if (key === c.env.FRIEND_KEY) {
    c.set('userType', 'friend')
  } else {
    return c.json({ error: 'Invalid API key' }, 401)
  }
  
  await next()
})

// Routes
app.get('/myapp/api/', (c) => c.json({ message: 'MyApp API' }))

app.get('/myapp/api/items', async (c) => {
  const { storage, auth } = getContext(c)
  const items = await MyAppHandlers.getItems(storage, auth)
  return c.json(items)
})

app.post('/myapp/api/items', async (c) => {
  const { storage, auth } = getContext(c)
  const data = await c.req.json()
  const item = await MyAppHandlers.createItem(storage, auth, data)
  return c.json(item, 201)
})

app.delete('/myapp/api/items/:id', async (c) => {
  const { storage, auth } = getContext(c)
  const id = c.req.param('id')
  await MyAppHandlers.deleteItem(storage, auth, id)
  return c.json({ ok: true })
})

export default app
```

### Deployment via GitHub Actions

**`hadoku_site/.github/workflows/deploy-workers.yml`**:
```yaml
- name: Configure npm for GitHub Packages
  run: |
    echo "@wolffm:registry=https://npm.pkg.github.com" >> workers/myapp-api/.npmrc
    echo "//npm.pkg.github.com/:_authToken=${{ secrets.DEPLOY_PACKAGE_TOKEN }}" >> workers/myapp-api/.npmrc

- name: Install dependencies
  run: npm install
  working-directory: workers/myapp-api

- name: Deploy myapp-api worker
  run: npx wrangler deploy
  working-directory: workers/myapp-api
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}

- name: Set worker secrets
  run: |
    echo "${{ secrets.ADMIN_KEY }}" | npx wrangler secret put ADMIN_KEY
    echo "${{ secrets.FRIEND_KEY }}" | npx wrangler secret put FRIEND_KEY
    echo "${{ secrets.GITHUB_PAT }}" | npx wrangler secret put GITHUB_PAT
  working-directory: workers/myapp-api
```

### Benefits of This Pattern

✅ **Decoupling**: Child knows nothing about Hono, Cloudflare Workers, or Workers KV  
✅ **Flexibility**: Parent can swap storage (KV → D1 → R2) without changing child  
✅ **Testability**: Child can be tested with mock storage independently  
✅ **Reusability**: Same child package works with Hono, Express, Elysia, etc.  
✅ **Scalability**: Worker deploys globally at Cloudflare's edge  
✅ **Automation**: Child publishes → parent updates → Workers redeploy

---

## GitHub Token Management

### Child Repository Secrets

Your child repository needs:

**`HADOKU_SITE_TOKEN`** (for deploying frontend bundles):
- **Permissions**: `repo` scope (read/write access)
- **Purpose**: Push built frontend to parent `public/mf/myapp/`
- **Scope**: Repository secret

**`GITHUB_TOKEN`** (automatic, for publishing packages):
- **Permissions**: Automatically provided by GitHub Actions
- **Purpose**: Publish to GitHub Packages, trigger repository_dispatch
- **Scope**: Built-in workflow token

### Parent Repository Secrets

The parent repository needs:

**`DEPLOY_PACKAGE_TOKEN`** (for downloading packages):
- **Permissions**: `read:packages` scope
- **Purpose**: Download @wolffm/myapp from GitHub Packages during CI
- **Scope**: Organization or repository secret

**`CLOUDFLARE_API_TOKEN`** (for deploying workers):
- **Permissions**: Workers edit permission
- **Purpose**: Deploy workers via wrangler
- **Scope**: Repository secret

### Token Setup Example

```bash
# Child repo: Add HADOKU_SITE_TOKEN
gh secret set HADOKU_SITE_TOKEN \
  --repo "WolffM/hadoku-myapp" \
  --body "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Parent repo: Add DEPLOY_PACKAGE_TOKEN
gh secret set DEPLOY_PACKAGE_TOKEN \
  --repo "WolffM/hadoku_site" \
  --body "ghp_yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"

# Parent repo: Add CLOUDFLARE_API_TOKEN
gh secret set CLOUDFLARE_API_TOKEN \
  --repo "WolffM/hadoku_site" \
  --body "your-cloudflare-api-token"
```

---

## Development Workflow

### Frontend Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
# Test with different user types:
# http://localhost:5173?userType=public
# http://localhost:5173?userType=friend
# http://localhost:5173?userType=admin
```

### Package Development (Backend)

```bash
# Install dependencies
npm install

# Build package
npm run build:api

# Verify output
ls dist/api/
# Should see: index.js, index.d.ts, handlers.js, etc.

# Test with mock storage
node test-handlers.mjs
```

**`test-handlers.mjs`** (test your handlers with mock storage):
```javascript
import { MyAppHandlers } from './dist/api/index.js'

// Mock storage
const mockStorage = {
  data: new Map(),
  
  getFile: async (path) => {
    const data = mockStorage.data.get(path)
    if (!data) throw new Error('File not found')
    return JSON.parse(JSON.stringify(data)) // Deep clone
  },
  
  saveFile: async (path, data) => {
    mockStorage.data.set(path, JSON.parse(JSON.stringify(data))) // Deep clone
  }
}

// Test handlers
const auth = { userType: 'admin' }

// Create item
const item = await MyAppHandlers.createItem(mockStorage, auth, {
  title: 'Test item'
})
console.log('Created:', item)

// Get items
const items = await MyAppHandlers.getItems(mockStorage, auth)
console.log('Items:', items)

// Delete item
await MyAppHandlers.deleteItem(mockStorage, auth, item.id)
console.log('Deleted:', item.id)

console.log('✅ All tests passed')
```

### Deployment Flow

#### Frontend Deployment
1. **Push to main** (changes in `src/`)
2. **GitHub Actions builds** frontend with Vite
3. **Workflow pushes** `dist/index.js` to parent `public/mf/myapp/`
4. **Parent serves** at `hadoku.me/myapp`

#### Package Deployment
1. **Push to main** (changes in `src/api/`)
2. **GitHub Actions builds** package with TypeScript
3. **Workflow publishes** to GitHub Packages
4. **Workflow triggers** `repository_dispatch` to parent
5. **Parent workflow runs** `npm update @wolffm/myapp`
6. **Parent redeployments** Workers with new package
7. **Workers serve** updated API at `task-api.hadoku.me/myapp/api/`

---

## Testing

### Manual Testing

1. **Local dev**: `npm run dev`
2. **Build test**: `npm run build:all`
3. **Integration test**: Copy `dist/` to parent's `public/mf/myapp/`

### Automated Testing

Add to workflow:
```yaml
- name: Run tests
  run: npm test

- name: Run E2E tests
  run: npm run test:e2e
```

---

## Checklist for New App

### Frontend Only
- [ ] Clone template repository
- [ ] Update `package.json` name
- [ ] Update `entry.tsx` with app name
- [ ] Update `.github/workflows/build.yml` paths
- [ ] Add `HADOKU_SITE_TOKEN` secret to child repo
- [ ] Create app in parent at `public/mf/myapp/`
- [ ] Create page in parent at `src/pages/myapp/index.astro`
- [ ] Test local development
- [ ] Test deployment workflow
- [ ] Verify production deployment at `hadoku.me/myapp`

### With Backend Package
- [ ] All frontend steps above, plus:
- [ ] Create `src/api/` directory with handlers, interfaces, types
- [ ] Add `tsconfig.api.json` for package build
- [ ] Add `build:api` script to `package.json`
- [ ] Update `package.json` with `publishConfig` and `exports`
- [ ] Create `.github/workflows/publish.yml`
- [ ] Add `DEPLOY_PACKAGE_TOKEN` secret to parent repo
- [ ] Create parent worker at `workers/myapp-api/`
- [ ] Add worker to `.github/workflows/deploy-workers.yml`
- [ ] Test handlers locally with mock storage
- [ ] Test package publishing workflow
- [ ] Test parent worker deployment
- [ ] Verify API at `task-api.hadoku.me/myapp/api/`

---

## Troubleshooting

### Frontend Issues

**Build fails:**
- Check `package.json` scripts
- Verify TypeScript config
- Run `npm run build` locally

**Deployment fails:**
- Verify `HADOKU_SITE_TOKEN` secret exists
- Check token has `repo` scope
- Verify parent repository structure at `public/mf/myapp/`

**App doesn't mount:**
- Check `entry.tsx` exports `mount` and `unmount`
- Verify parent is loading correct files (`/mf/myapp/index.js`)
- Check browser console for errors

### Package Issues

**Package publish fails:**
- Verify `package.json` has `publishConfig` and `exports`
- Check `tsconfig.api.json` paths
- Run `npm run build:api` locally to test

**Parent can't download package:**
- Verify `DEPLOY_PACKAGE_TOKEN` secret exists in parent repo
- Check token has `read:packages` scope
- Verify `.npmrc` is generated correctly in CI

**Worker deploy fails:**
- Check `workers/myapp-api/package.json` has `@wolffm/myapp` dependency
- Verify `wrangler.toml` configuration
- Check worker secrets are set (ADMIN_KEY, FRIEND_KEY, GITHUB_PAT)

**API not working:**
- Verify worker is deployed: `wrangler deployments list`
- Check worker logs: `wrangler tail myapp-api`
- Test handler logic locally with mock storage first
- Verify DNS/routes in `wrangler.toml`

### Testing Strategy

1. **Test handlers locally** with mock storage (cheapest, fastest)
2. **Test worker locally** with `wrangler dev`
3. **Test worker in production** with `wrangler deploy`
4. **Test via edge-router** at `hadoku.me/myapp/api/`

---

## Best Practices

### Frontend
1. **Keep entry point minimal** - Just mount/unmount logic
2. **Export TypeScript types** - For parent integration
3. **Support all user types** - public, friend, admin
4. **Handle props gracefully** - Provide defaults
5. **Clean up on unmount** - Remove listeners, timers

### Package (Backend)
1. **Pure functions only** - No HTTP framework coupling
2. **Accept storage interface** - Don't hardcode Workers KV or any specific storage
3. **Return data, not responses** - Let parent handle HTTP
4. **Export TypeScript types** - Interfaces, types, contexts
5. **Test with mock storage** - Fast, reliable unit tests
6. **Semantic versioning** - Increment versions appropriately
7. **Document exports** - Create API_EXPORTS.md reference

### Integration
1. **Test locally first** - Before deploying
2. **Use repository_dispatch** - Auto-update parent
3. **Version compatibility** - Test with multiple parent setups
4. **Monitor Worker logs** - Use `wrangler tail`
5. **Use consistent naming** - Match parent conventions

---

## Resources

### Parent Repository
- **hadoku_site**: [WolffM/hadoku_site](https://github.com/WolffM/hadoku_site)
- **ARCHITECTURE.md**: Complete system architecture documentation
- **API_EXPORTS.md**: Child package exports reference

### Example Implementations
- **Task app** (frontend): [WolffM/hadoku-task](https://github.com/WolffM/hadoku-task)
- **Task API package**: [WolffM/task-api-task-component](https://github.com/WolffM/task-api-task-component)
- **Parent worker**: `hadoku_site/workers/task-api/`

### Documentation
- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Hono Framework**: https://hono.dev/
- **GitHub Packages**: https://docs.github.com/en/packages
- **GitHub Actions**: https://docs.github.com/en/actions
- **Repository Dispatch**: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#repository_dispatch
- **Micro-frontends**: https://micro-frontends.org/
- **Adapter Pattern**: https://refactoring.guru/design-patterns/adapter

### Tools
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/
- **GitHub CLI**: https://cli.github.com/
- **Vite**: https://vitejs.dev/

---

**Template Version**: 2.0.0 (Universal Adapter Pattern)  
**Last Updated**: January 2025
