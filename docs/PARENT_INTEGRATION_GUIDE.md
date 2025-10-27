# Parent Integration Quick Reference

**Quick guide for hadoku_site to consume `@wolffm/watchparty-ui` package**

---

## 1. Initial Setup (One-Time)

### Add GitHub Packages Authentication

Create/update `.npmrc` in the parent repository:

```bash
# .npmrc
@wolffm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### Install the Package

```bash
pnpm add @wolffm/watchparty-ui
```

---

## 2. Update Workflow (Already Created)

The parent needs `.github/workflows/update-watchparty-ui.yml`:

```yaml
name: Update Watchparty UI Package

on:
  repository_dispatch:
    types: [watchparty_ui_updated]  # ← Triggered by hadoku-watchparty publish
  workflow_dispatch:

permissions:
  contents: write
  packages: read

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.HADOKU_SITE_TOKEN }}
      
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Create .npmrc for GitHub Packages
        run: |
          echo "@wolffm:registry=https://npm.pkg.github.com" > .npmrc
          echo "//npm.pkg.github.com/:_authToken=${{ secrets.DEPLOY_PACKAGE_TOKEN }}" >> .npmrc
      
      - name: Update watchparty-ui package
        run: |
          echo "📦 Updating @wolffm/watchparty-ui to latest..."
          pnpm add -w @wolffm/watchparty-ui@latest
          
          echo "📦 Copying bundle to public/mf/watchparty/..."
          pnpm run update-watchparty-bundle
          
          echo "📦 Regenerating registry with new version..."
          pnpm run generate-registry
      
      - name: Commit and push changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          
          if git diff --quiet package.json pnpm-lock.yaml public/mf/; then
            echo "ℹ️  No updates needed"
          else
            NEW_VERSION=$(node -p "require('./package.json').dependencies['@wolffm/watchparty-ui']")
            git add package.json pnpm-lock.yaml public/mf/
            git commit -m "chore: update @wolffm/watchparty-ui to $NEW_VERSION"
            git push
            echo "✅ Updated and pushed changes"
          fi
```

---

## 3. Create Bundle Update Script

Create `scripts/update-watchparty-bundle.mjs`:

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Source: node_modules package
const packagePath = path.join(projectRoot, 'node_modules', '@wolffm', 'watchparty-ui', 'dist');

// Destination: public/mf/watchparty/
const destPath = path.join(projectRoot, 'public', 'mf', 'watchparty');

console.log('📦 Updating watchparty UI bundle...');

// Ensure destination directory exists
fs.mkdirSync(destPath, { recursive: true });

// Files to copy
const filesToCopy = ['index.js', 'style.css'];

for (const file of filesToCopy) {
  const src = path.join(packagePath, file);
  const dest = path.join(destPath, file);
  
  if (!fs.existsSync(src)) {
    console.error(`❌ Source file not found: ${src}`);
    console.error('   Make sure @wolffm/watchparty-ui is installed: pnpm add @wolffm/watchparty-ui');
    process.exit(1);
  }
  
  fs.copyFileSync(src, dest);
  console.log(`✅ Copied ${file}`);
}

console.log('✅ Watchparty UI bundle updated successfully');
```

---

## 4. Update Registry Generation

Modify `scripts/generate-registry.mjs` to use package version:

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Read package.json to get watchparty-ui version
let watchpartyVersion = Date.now().toString(); // Fallback to timestamp

try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8')
  );
  
  if (packageJson.dependencies && packageJson.dependencies['@wolffm/watchparty-ui']) {
    // Extract version (remove ^ or ~ if present)
    watchpartyVersion = packageJson.dependencies['@wolffm/watchparty-ui'].replace(/^[\^~]/, '');
    console.log(`📦 Using @wolffm/watchparty-ui version: ${watchpartyVersion}`);
  }
} catch (err) {
  console.warn('⚠️  Could not read watchparty-ui version, using timestamp');
}

// Build registry
const registry = {
  watchparty: {
    url: `/mf/watchparty/index.js?v=${watchpartyVersion}`,
    css: `/mf/watchparty/style.css?v=${watchpartyVersion}`,
    basename: '/watchparty',
    props: {
      serverOrigin: process.env.SERVER_ORIGIN || '',
      environment: process.env.ENVIRONMENT || 'production'
    }
  },
  // ... other microfrontends
};

// Write registry
const registryPath = path.join(projectRoot, 'public', 'mf', 'registry.json');
fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));
console.log('✅ Registry generated with version-based cache busting');
```

---

## 5. Update package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "update-watchparty-bundle": "node scripts/update-watchparty-bundle.mjs",
    "generate-registry": "node scripts/generate-registry.mjs",
    "prebuild": "pnpm run update-watchparty-bundle && pnpm run generate-registry"
  }
}
```

---

## 6. Loading Pattern (No Changes Needed)

Your existing loader should work as-is. The package exports `mount` and `unmount`:

```javascript
// Parent's mf-loader.js (existing code)
const module = await import('/mf/watchparty/index.js?v=0.1.3');

// Call mount with props
module.mount(containerElement, {
  basename: '/watchparty',
  serverOrigin: 'https://api.hadoku.me',
  environment: 'production',
  userType: 'admin',
  userId: 'user-123',
  sessionId: 'sess-456'
});

// Later, unmount
module.unmount(containerElement);
```

---

## 7. Required GitHub Secrets

Ensure these secrets are set in **hadoku_site** repository settings:

- `HADOKU_SITE_TOKEN` - PAT with `repo` scope (for pushing commits)
- `DEPLOY_PACKAGE_TOKEN` - PAT with `read:packages` scope (for reading GitHub Packages)

---

## 8. Testing the Integration

### Manual Test (First Time)

```bash
# In hadoku_site repository
pnpm add @wolffm/watchparty-ui@latest
pnpm run update-watchparty-bundle
pnpm run generate-registry

# Verify files
ls public/mf/watchparty/
# Should show: index.js, style.css

# Check registry
cat public/mf/registry.json | jq '.watchparty'
# Should show version: ?v=0.1.3 (not timestamp)
```

### Test Automation

```bash
# Trigger the workflow manually
gh workflow run update-watchparty-ui.yml

# Or trigger via API (simulate hadoku-watchparty dispatch)
gh api repos/WolffM/hadoku_site/dispatches \
  -f event_type=watchparty_ui_updated \
  -f client_payload[package]=@wolffm/watchparty-ui \
  -f client_payload[version]=0.1.3
```

---

## 9. Deployment Flow

### Automatic Flow (After Setup)

1. **Developer pushes to hadoku-watchparty** `main` branch
2. **Husky auto-bumps version** (e.g., `0.1.3` → `0.1.4`)
3. **Tests run** via pre-commit hook
4. **Commit succeeds** and is pushed
5. **`publish-ui.yml` triggers** in hadoku-watchparty
6. **Package publishes** to GitHub Packages as `@wolffm/watchparty-ui@0.1.4`
7. **Workflow dispatches** to hadoku_site with event type `watchparty_ui_updated`
8. **`update-watchparty-ui.yml` triggers** in hadoku_site
9. **Package updates** via `pnpm add @wolffm/watchparty-ui@latest`
10. **Bundle copies** to `public/mf/watchparty/`
11. **Registry regenerates** with new version `?v=0.1.4`
12. **Changes commit and push** to hadoku_site
13. **Deployment workflow triggers** (your existing CD)
14. **Site deploys** with new watchparty version

---

## 10. Troubleshooting

### Package Not Found

```bash
# Verify package is published
gh api /orgs/WolffM/packages/npm/watchparty-ui

# Check authentication
cat .npmrc
# Should have: //npm.pkg.github.com/:_authToken=...
```

### Bundle Files Missing

```bash
# Check if package installed correctly
ls node_modules/@wolffm/watchparty-ui/dist/
# Should show: index.js, style.css

# Manually run bundle update
pnpm run update-watchparty-bundle
```

### Cache Busting Not Working

```bash
# Check registry has version (not timestamp)
cat public/mf/registry.json | jq '.watchparty.url'
# Should be: "/mf/watchparty/index.js?v=0.1.3"
# NOT: "/mf/watchparty/index.js?v=1761594876543"
```

### Workflow Not Triggering

```bash
# Verify secret exists
gh secret list --repo WolffM/hadoku_site
# Should include: DEPLOY_PACKAGE_TOKEN

# Check workflow file
gh workflow view update-watchparty-ui.yml

# View recent runs
gh run list --workflow=update-watchparty-ui.yml
```

---

## 11. Rollback Procedure

If something breaks:

```bash
# In hadoku_site repository

# Option 1: Rollback to specific version
pnpm add @wolffm/watchparty-ui@0.1.3  # Known good version
pnpm run update-watchparty-bundle
pnpm run generate-registry
git add package.json pnpm-lock.yaml public/mf/
git commit -m "rollback: downgrade watchparty-ui to 0.1.3"
git push

# Option 2: Use git revert
git revert HEAD  # Reverts the last package update commit
git push
```

---

## Key Differences from Old Pattern

| Aspect | Old (Direct Push) | New (Package) |
|--------|------------------|---------------|
| **Deployment** | hadoku-watchparty pushes to hadoku_site | hadoku-watchparty publishes package |
| **Versioning** | Timestamp-based | Semantic versioning |
| **Trigger** | Direct git push | Repository dispatch |
| **Rollback** | Manual file restoration | Install previous version |
| **Tracking** | Git history only | Package registry + git history |
| **Cache Busting** | `?v=1761594876543` | `?v=0.1.3` |

---

## Summary Checklist

- [ ] Create `.npmrc` with GitHub Packages auth
- [ ] Create `.github/workflows/update-watchparty-ui.yml`
- [ ] Create `scripts/update-watchparty-bundle.mjs`
- [ ] Update `scripts/generate-registry.mjs` to use package version
- [ ] Add scripts to `package.json` (`update-watchparty-bundle`, `generate-registry`)
- [ ] Verify secrets: `HADOKU_SITE_TOKEN`, `DEPLOY_PACKAGE_TOKEN`
- [ ] Test: `pnpm add @wolffm/watchparty-ui@latest`
- [ ] Test: `pnpm run update-watchparty-bundle`
- [ ] Test: `pnpm run generate-registry`
- [ ] Verify: Files in `public/mf/watchparty/`
- [ ] Verify: Registry has version-based URLs
- [ ] Test: Manual workflow trigger
- [ ] Test: End-to-end automation
- [ ] Deploy and verify production

---

**Ready to integrate!** The hadoku-watchparty repository is now publishing `@wolffm/watchparty-ui@0.1.3` to GitHub Packages.
