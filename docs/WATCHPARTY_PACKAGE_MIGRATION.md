# Watchparty Package Migration Guide

**Migrating watchparty from direct file push to GitHub Packages**

---

## Current Implementation (What We Have Now)

### How Files Are Currently Deployed

Watchparty currently uses **direct file push** from the child repository:

```yaml
# watchparty repo: .github/workflows/build.yml
- name: Push built files to parent repository
  run: |
    # Clone parent
    git clone https://${{ secrets.HADOKU_SITE_TOKEN }}@github.com/WolffM/hadoku_site.git parent
    cd parent
    
    # Copy built files directly
    mkdir -p public/mf/watchparty
    rm -rf public/mf/watchparty/*
    cp -r ../dist/index.js ../dist/style.css public/mf/watchparty/
    
    # Commit and push
    git add public/mf/watchparty/
    git commit -m "chore: update watchparty from ${{ github.sha }}"
    git push
```

### Current File Structure

```
hadoku_site/
└── public/
    └── mf/
        └── watchparty/
            ├── index.js       # ← Pushed directly from watchparty repo
            ├── index.js.map
            └── style.css      # ← Pushed directly from watchparty repo
```

### How Parent Loads Watchparty (Current)

**Registry generation** (`scripts/generate-registry.mjs`):
```javascript
// Uses timestamp for cache-busting (no version tracking)
watchparty: {
  url: `/mf/watchparty/index.js?v=${timestamp}`,
  css: `/mf/watchparty/style.css?v=${timestamp}`,
  basename: '/watchparty',
  props: watchpartyConfig
}
```

**Loading** (`src/components/mf-loader.js`):
```javascript
// Parent loads directly from public/mf/watchparty/
const module = await import('/mf/watchparty/index.js?v=1761169676818')
module.mount(root, props)
```

---

## New Implementation (GitHub Packages Pattern)

### Overview

The new pattern matches how the **task package** works:

1. **Child publishes package** to GitHub Packages (`@wolffm/watchparty`)
2. **Parent installs package** via `pnpm add @wolffm/watchparty`
3. **Parent copies bundle** from `node_modules/@wolffm/watchparty/dist` to `public/mf/watchparty/`
4. **Registry tracks version** for proper cache-busting

### What We Need From Watchparty Repository

To migrate to the package pattern, the watchparty repository needs to provide:

#### 1. **Package Structure**

```
watchparty/
├── package.json          # ← Must be publishable to GitHub Packages
├── dist/                 # ← Built files for distribution
│   ├── index.js         # ← Main entry point with mount/unmount
│   ├── index.js.map     # ← Source map (optional)
│   └── style.css        # ← Styles
└── src/
    └── entry.tsx        # ← Must export mount/unmount functions
```

#### 2. **Package.json Configuration**

**Required fields** for GitHub Packages:

```json
{
  "name": "@wolffm/watchparty",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "files": [
    "dist/**/*"
  ],
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "scripts": {
    "build": "vite build",
    "publish:package": "npm publish"
  }
}
```

**Key questions for watchparty team:**

- ✅ Does `package.json` have `@wolffm/watchparty` as the name?
- ✅ Does `package.json` have `publishConfig.registry` set to GitHub Packages?
- ✅ Does `dist/` contain `index.js` and `style.css` after build?
- ✅ Are these files the bundle outputs (not source files)?

#### 3. **Entry Point Exports**

**Required exports** in `dist/index.js`:

```typescript
// Must export mount function
export function mount(el: HTMLElement, props: WatchpartyProps): void {
  const root = createRoot(el)
  root.render(<App {...props} />)
  
  // Store root for cleanup
  ;(el as any).__root = root
}

// Must export unmount function
export function unmount(el: HTMLElement): void {
  ;(el as any).__root?.unmount()
}
```

**Key questions for watchparty team:**

- ✅ Does `dist/index.js` export a `mount(el, props)` function?
- ✅ Does `dist/index.js` export an `unmount(el)` function?
- ✅ Does `mount()` accept props similar to: `{ basename, serverOrigin, environment, userType, userId, sessionId }`?

#### 4. **Publishing Workflow**

**New workflow** needed: `.github/workflows/publish.yml`

```yaml
name: Publish Watchparty Package

on:
  push:
    branches: [ main ]
    paths:
      - 'src/**'
      - 'package.json'
      - 'vite.config.ts'
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
        run: npm run build
      
      - name: Publish to GitHub Packages
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Get package version
        id: version
        run: echo "version=$(node -p \"require('./package.json').version\")" >> $GITHUB_OUTPUT
      
      - name: Trigger parent update
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh api repos/WolffM/hadoku_site/dispatches \
            -f event_type=watchparty_package_updated \
            -f client_payload[package]=@wolffm/watchparty \
            -f client_payload[version]=${{ steps.version.outputs.version }}
```

**Key questions for watchparty team:**

- ✅ Can you add this workflow to trigger `repository_dispatch` to parent?
- ✅ Does `npm run build` produce the final distributable files in `dist/`?
- ✅ Is the built output standalone (doesn't need `node_modules` to run)?

---

## Parent Changes (Already Complete)

### ✅ New Files Created

1. **`.github/workflows/update-watchparty.yml`**
   - Listens for `repository_dispatch` with type `watchparty_package_updated`
   - Runs `pnpm add @wolffm/watchparty@latest`
   - Runs `pnpm run update-watchparty-bundle` to copy files
   - Regenerates registry with version-based cache-busting
   - Commits and pushes changes

2. **`scripts/update-watchparty-bundle.mjs`**
   - Copies `index.js` and `style.css` from `node_modules/@wolffm/watchparty/dist/` to `public/mf/watchparty/`
   - Validates files exist before copying
   - Provides clear error messages

### ✅ Updated Files

3. **`package.json`**
   - Added script: `"update-watchparty-bundle": "node scripts/update-watchparty-bundle.mjs"`
   - Updated `prebuild` to include watchparty bundle update

4. **`scripts/generate-registry.mjs`**
   - Now reads `@wolffm/watchparty` version from `package.json`
   - Uses package version for cache-busting instead of timestamp
   - Example: `/mf/watchparty/index.js?v=1.2.3` instead of `?v=1761169676818`

---

## Migration Checklist

### Watchparty Repository (Child)

- [ ] **Update `package.json`**
  - [ ] Set name to `@wolffm/watchparty`
  - [ ] Add `publishConfig.registry` for GitHub Packages
  - [ ] Add `files: ["dist/**/*"]` to include dist in package
  - [ ] Ensure `main: "./dist/index.js"` points to built entry point

- [ ] **Verify Entry Point**
  - [ ] `dist/index.js` exports `mount(el, props)` function
  - [ ] `dist/index.js` exports `unmount(el)` function
  - [ ] `mount()` accepts standard props: `{ basename, serverOrigin, environment, userType, userId, sessionId }`
  - [ ] Built files are standalone (don't require `node_modules` at runtime)

- [ ] **Create Publishing Workflow**
  - [ ] Add `.github/workflows/publish.yml`
  - [ ] Configure to trigger on pushes to main
  - [ ] Publish to GitHub Packages using `GITHUB_TOKEN`
  - [ ] Trigger `repository_dispatch` to `hadoku_site` with event type `watchparty_package_updated`

- [ ] **Remove Direct File Push** (after package publishing works)
  - [ ] Remove or comment out file push steps in `build.yml`
  - [ ] Keep build steps but stop pushing to parent `public/mf/`

### Parent Repository (Hadoku Site)

- [x] **Create Update Workflow** ✅ Done
  - [x] `.github/workflows/update-watchparty.yml` created
  - [x] Listens for `watchparty_package_updated` dispatch event
  - [x] Runs `pnpm add @wolffm/watchparty@latest`
  - [x] Copies bundle files via `update-watchparty-bundle` script
  - [x] Regenerates registry with version
  - [x] Commits and pushes changes

- [x] **Create Bundle Update Script** ✅ Done
  - [x] `scripts/update-watchparty-bundle.mjs` created
  - [x] Copies from `node_modules/@wolffm/watchparty/dist/`
  - [x] Validates source files exist
  - [x] Clear error messages

- [x] **Update Build Scripts** ✅ Done
  - [x] Added `update-watchparty-bundle` to `package.json`
  - [x] Updated `prebuild` to include watchparty

- [x] **Update Registry Generation** ✅ Done
  - [x] Modified `generate-registry.mjs` to use package version
  - [x] Falls back to timestamp if package not installed

- [ ] **Install Package** (after watchparty publishes)
  - [ ] Run `pnpm add @wolffm/watchparty@latest` manually first time
  - [ ] Verify files copy correctly to `public/mf/watchparty/`
  - [ ] Verify registry has correct version
  - [ ] Test loading at `hadoku.me/watchparty`

- [ ] **Test Automation**
  - [ ] Trigger `repository_dispatch` manually to test workflow
  - [ ] Verify workflow updates package automatically
  - [ ] Verify deployment pipeline works end-to-end

---

## Testing Strategy

### Phase 1: Initial Package Setup (Watchparty)

1. **Local build test**:
   ```bash
   # In watchparty repo
   npm run build
   ls dist/
   # Should see: index.js, style.css
   ```

2. **Verify exports**:
   ```javascript
   // test-exports.mjs
   import { mount, unmount } from './dist/index.js'
   console.log('mount:', typeof mount)      // Should be 'function'
   console.log('unmount:', typeof unmount)  // Should be 'function'
   ```

3. **Test package publishing locally**:
   ```bash
   npm pack
   # Creates @wolffm-watchparty-1.0.0.tgz
   # Verify it contains dist/index.js and dist/style.css
   tar -tzf @wolffm-watchparty-1.0.0.tgz
   ```

### Phase 2: First Package Publish (Watchparty)

1. **Publish to GitHub Packages**:
   ```bash
   npm publish
   # Verify at: https://github.com/WolffM/watchparty/packages
   ```

2. **Trigger dispatch to parent**:
   ```bash
   gh api repos/WolffM/hadoku_site/dispatches \
     -f event_type=watchparty_package_updated \
     -f client_payload[package]=@wolffm/watchparty
   ```

3. **Check parent workflow runs**:
   - Go to `https://github.com/WolffM/hadoku_site/actions`
   - Should see "Update Watchparty Package" workflow running

### Phase 3: Parent Integration Test

1. **Manual package install first**:
   ```bash
   # In hadoku_site repo
   pnpm add @wolffm/watchparty@latest
   pnpm run update-watchparty-bundle
   pnpm run generate-registry
   ```

2. **Verify files copied**:
   ```bash
   ls public/mf/watchparty/
   # Should see: index.js, style.css
   ```

3. **Check registry**:
   ```bash
   cat public/mf/registry.json | jq '.watchparty'
   # Should show version-based cache busting: ?v=1.0.0
   ```

4. **Test loading locally**:
   ```bash
   pnpm run dev
   # Visit http://localhost:4321/watchparty
   # Check console for mount logs
   ```

### Phase 4: End-to-End Automation

1. **Watchparty makes a change**:
   ```bash
   # In watchparty repo
   git add .
   git commit -m "feat: update UI"
   git push
   ```

2. **Verify automation chain**:
   - [ ] Watchparty workflow builds and publishes package
   - [ ] Watchparty workflow triggers `repository_dispatch`
   - [ ] Parent workflow receives dispatch
   - [ ] Parent workflow updates package
   - [ ] Parent workflow copies bundle files
   - [ ] Parent workflow regenerates registry
   - [ ] Parent workflow commits and pushes
   - [ ] Parent deployment workflow deploys to production

3. **Verify production**:
   - Visit `https://hadoku.me/watchparty`
   - Check that new version is loaded
   - Verify cache-busting URL has new version number

---

## Expected Props Interface

Based on current parent implementation, watchparty should accept these props:

```typescript
export interface WatchpartyProps {
  // Required
  basename: string              // e.g., '/watchparty'
  
  // Optional but provided by parent
  serverOrigin?: string        // e.g., 'https://api.hadoku.me' or 'http://localhost:8080'
  environment?: 'development' | 'production'
  
  // Authentication (from parent session)
  userType?: 'admin' | 'friend' | 'public'
  userId?: string              // User identifier
  sessionId?: string | null    // Session ID for API requests
}
```

**Key questions for watchparty team:**

- ✅ Does your current `mount()` function accept these props?
- ✅ Do you use `sessionId` for making authenticated API requests?
- ✅ Do you need any additional props not listed here?
- ✅ Do any prop names need to change?

---

## Differences from Current Implementation

### Before (Direct Push)
```
Watchparty builds → Push dist/ to parent public/mf/watchparty/ → Parent deploys
```

### After (Package)
```
Watchparty builds → Publish to GitHub Packages → Parent installs package → 
Parent copies dist/ to public/mf/watchparty/ → Parent deploys
```

### Key Benefits

✅ **Versioning**: Proper semantic versioning with npm packages  
✅ **Rollback**: Can rollback to previous versions easily  
✅ **Dependencies**: Can declare dependencies in package.json  
✅ **Discovery**: Package visible in GitHub Packages registry  
✅ **Consistency**: Same pattern as task package  
✅ **CI/CD**: Cleaner separation of build and deploy

### Potential Concerns

⚠️ **Complexity**: More steps in the deployment chain  
⚠️ **Auth**: Requires GitHub Package token (`DEPLOY_PACKAGE_TOKEN` already exists)  
⚠️ **Learning curve**: Team needs to understand package publishing  

---

## Rollback Plan

If something goes wrong during migration:

1. **Keep direct push temporarily**:
   - Don't remove direct file push from watchparty workflow
   - Run both patterns in parallel during transition
   - Disable direct push only after package pattern is proven

2. **Manual fallback**:
   ```bash
   # In hadoku_site repo
   cd public/mf/watchparty
   # Manually copy working version of files
   cp /backup/index.js .
   cp /backup/style.css .
   git add .
   git commit -m "rollback: restore working watchparty"
   git push
   ```

3. **Package version rollback**:
   ```bash
   # In hadoku_site repo
   pnpm add @wolffm/watchparty@1.0.0  # Specific working version
   pnpm run update-watchparty-bundle
   pnpm run generate-registry
   git add .
   git commit -m "rollback: downgrade watchparty to 1.0.0"
   git push
   ```

---

## Questions for Watchparty Team

### Critical Questions (Must Answer)

1. **Package Name**: Is `@wolffm/watchparty` the correct package name?
2. **Entry Exports**: Does `dist/index.js` export `mount` and `unmount` functions?
3. **Props Interface**: Do the expected props match your current implementation?
4. **Build Output**: Does `npm run build` produce standalone files in `dist/`?

### Nice to Know

5. **Timeline**: When can you implement the publishing workflow?
6. **Testing**: Can we test with a beta version first (`@wolffm/watchparty@beta`)?
7. **Dependencies**: Does watchparty have runtime dependencies that need to be bundled?
8. **Versioning**: Do you follow semantic versioning for releases?

---

## Next Steps

### Immediate (Watchparty Team)

1. **Review this document** and answer critical questions
2. **Verify package.json** has correct configuration
3. **Test local build** and verify dist/ structure
4. **Create publish workflow** (use template in this doc)

### After Watchparty Publishes First Package

1. **Parent installs package** manually first time
2. **Test automation** with manual dispatch trigger
3. **Verify production** deployment
4. **Remove direct push** from watchparty workflow

### Future Enhancements

- Add beta/staging channel support (`@wolffm/watchparty@beta`)
- Automated testing before publish
- Version compatibility checking
- Changelog generation

---

**Document Version**: 1.0.0  
**Created**: October 27, 2025  
**Parent Migration**: ✅ Complete (workflows and scripts ready)  
**Watchparty Migration**: ⏳ Pending (waiting for package setup)
