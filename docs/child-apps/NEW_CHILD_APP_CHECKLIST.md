# New Child App Integration Checklist

This checklist ensures all necessary files are updated when adding a new micro-frontend child app to the hadoku_site ecosystem.

## Prerequisites

- [ ] Child app repository created (e.g., `WolffM/hadoku-<app-name>`)
- [ ] Child app publishes package to GitHub Packages as `@wolffm/<package-name>`
- [ ] Package includes `dist/index.js` and optionally `dist/style.css`

## Step 1: Package Configuration

### Root `package.json`
**File:** `package.json`

- [ ] Add package to `dependencies`:
  ```json
  "@wolffm/<package-name>": "^1.0.0"
  ```

- [ ] Add update script in `scripts` section:
  ```json
  "update-<app>-bundle": "node scripts/update-bundle.mjs @wolffm/<package-name>"
  ```

- [ ] Add to `prebuild` script (append to the chain):
  ```json
  "prebuild": "... && pnpm run update-<app>-bundle && ..."
  ```

**Lines to modify:** ~33 (dependencies), ~11-16 (scripts), ~17 (prebuild)

---

## Step 2: Bundle Update Script

### `scripts/update-bundle.mjs`
**File:** `scripts/update-bundle.mjs`

- [ ] Add package configuration to `PACKAGE_CONFIGS`:
  ```javascript
  '@wolffm/<package-name>': {
      targetDir: '<app-name>',
      cssSource: 'style.css', // IMPORTANT: Required if package includes CSS!
  },
  ```

**Lines to modify:** ~22-48 (PACKAGE_CONFIGS object)

**⚠️ IMPORTANT:** If your package includes CSS (check `node_modules/@wolffm/<package-name>/dist/` for `style.css`), you MUST include `cssSource: 'style.css'` in the config. Without this, the CSS won't be copied to `public/mf/<app>/` and your app will load without styles!

---

## Step 3: Registry Generator

### `scripts/generate-registry.mjs`
**File:** `scripts/generate-registry.mjs`

- [ ] Add version constant (near top):
  ```javascript
  const <app>Version = packageJson.dependencies['@wolffm/<package-name>']?.replace(/^[\^~]/, '') || Date.now().toString();
  ```

- [ ] Add registry entry in `registry` object:
  ```javascript
  <appname>: {
      url: `/mf/<app>/index.js?v=${<app>Version}`,
      css: `/mf/<app>/style.css?v=${<app>Version}`, // IMPORTANT: Include this if your app has CSS!
      basename: '/<app>',
      props: {
          basename: '/<app>',
          environment: MODE,
          userType: 'public',
          // Add any app-specific props here
      },
  },
  ```

**Lines to modify:** ~12-17 (version constants), ~63-113 (registry object)

**⚠️ IMPORTANT:** The `css` property must match the `cssSource` configuration in Step 2. If you configured `cssSource: 'style.css'` in `update-bundle.mjs`, you MUST include the `css` line in the registry. Without this, the browser won't load the stylesheet and your app will appear unstyled!

---

## Step 4: GitHub Secrets Management

### `scripts/admin/manage_github_token.py`
**File:** `scripts/admin/manage_github_token.py`

- [ ] Add repository to `child-repos` config in `SECRET_CONFIGS`:
  ```python
  'repos': [
      "WolffM/hadoku-task",
      "WolffM/hadoku-watchparty",
      "WolffM/hadoku-resume-bot",
      "WolffM/hadoku-<app-name>",  # Add this line
  ]
  ```

**Lines to modify:** ~93-98

- [ ] After updating, deploy secrets:
  ```bash
  python administration.py github-secrets child-repos
  ```

---

## Step 5: GitHub Actions - Package Updates

### `.github/workflows/update-packages.yml`
**File:** `.github/workflows/update-packages.yml`

- [ ] Add package to default packages list:
  ```yaml
  default: '@wolffm/task,...,@wolffm/<package-name>'
  ```
  **Line:** ~11

- [ ] Add package parsing logic in "Parse packages to update" step:
  ```bash
  # Check if <app> package needs update
  if echo "$PACKAGES" | jq -e 'map(select(. == "@wolffm/<package-name>")) | length > 0' > /dev/null; then
    echo "update_<app>=true" >> $GITHUB_OUTPUT
    echo "✅ Will update @wolffm/<package-name>"
  else
    echo "update_<app>=false" >> $GITHUB_OUTPUT
  fi
  ```
  **Lines:** After ~99 (add new section)

- [ ] Add bundle update step (before "Commit and push" step):
  ```yaml
  - name: Update <app> bundle
    if: steps.parse.outputs.update_<app> == 'true'
    run: |
      echo "🔨 Rebuilding <app> bundle..."
      echo "📦 Updating <app> micro-frontend bundle..."
      pnpm run update-<app>-bundle
      echo "✅ Updated public/mf/<app>/ bundle files"

      # Regenerate registry with new version numbers for cache busting
      echo "📦 Regenerating registry with cache-busting version..."
      pnpm run generate-registry
      echo "✅ Updated public/mf/registry.json with new versions"
  ```
  **Lines:** Before ~243 (before "Commit and push" step)

---

## Step 6: GitHub Actions - Deployment

### `.github/workflows/deploy.yml`
**File:** `.github/workflows/deploy.yml`

- [ ] Add bundle update command to "Update micro-frontend bundles" step:
  ```yaml
  - name: Update micro-frontend bundles
    run: |
      pnpm run update-<app>-bundle  # Add this line
      pnpm run update-contact-bundle
      # ... other bundles
  ```

**Lines to modify:** ~65-72

---

## Step 7: Create Public Directory

### `public/mf/<app>/`

- [ ] Directory will be created automatically when running:
  ```bash
  pnpm run update-<app>-bundle
  ```

Or create manually:
```bash
mkdir -p public/mf/<app>
```

---

## Step 8: Testing & Verification

- [ ] Run `pnpm install` to install the new package
- [ ] Run `pnpm run update-<app>-bundle` to verify bundle updates
- [ ] Run `pnpm run generate-registry` to verify registry generation
- [ ] Check `public/mf/registry.json` includes new app entry
- [ ] Verify `public/mf/<app>/index.js` and `public/mf/<app>/style.css` exist
- [ ] Test deployment workflow (manual trigger)
- [ ] Verify child repo can trigger package update via `repository_dispatch`

---

## Quick Reference: Files to Update

| File | Purpose | Key Lines |
|------|---------|-----------|
| `package.json` | Add dependency & scripts | ~33, ~11-16, ~17 |
| `scripts/update-bundle.mjs` | Configure bundle copying | ~22-48 |
| `scripts/generate-registry.mjs` | Add to registry | ~12-17, ~63-113 |
| `scripts/admin/manage_github_token.py` | GitHub secrets | ~93-98 |
| `.github/workflows/update-packages.yml` | Auto-update workflow | ~11, ~99+, ~243+ |
| `.github/workflows/deploy.yml` | Deployment | ~65-72 |

---

## Example: Adding "contact-ui"

See git history for commits that added `@wolffm/contact-ui` for a complete example of all changes needed.

Key commits:
- Added package dependency
- Updated bundle scripts
- Updated GitHub workflows
- Added secrets management

---

## Troubleshooting

### Package not found during install
- Verify package is published to GitHub Packages
- Check `.npmrc` has correct auth token
- Verify token has `read:packages` scope

### Bundle update fails
- Ensure package exports `dist/index.js`
- Check `PACKAGE_CONFIGS` in `update-bundle.mjs`
- Verify target directory exists or can be created

### Workflow not triggering
- Check `repository_dispatch` event type is `packages_updated`
- Verify `HADOKU_SITE_TOKEN` is set in child repo
- Check workflow permissions (contents: write, packages: read)

### App loads but has no styles (CSS missing)
**This is a common issue!** Check these in order:

1. **Verify CSS exists in package:**
   ```bash
   ls node_modules/@wolffm/<package-name>/dist/
   # Should show: index.js, style.css (or similar)
   ```

2. **Check `update-bundle.mjs` configuration:**
   - Must include `cssSource: 'style.css'` in the package config
   - Without this, CSS won't be copied to `public/mf/<app>/`

3. **Check `generate-registry.mjs` registry entry:**
   - Must include `css: '/mf/<app>/style.css?v=${<app>Version}'`
   - Without this, browser won't load the stylesheet

4. **Verify CSS was copied:**
   ```bash
   ls public/mf/<app>/
   # Should show: index.js, style.css
   ```

5. **Regenerate registry:**
   ```bash
   pnpm run generate-registry
   # Check public/mf/registry.json includes css property
   ```

6. **Hard refresh browser:** Clear cache or use Ctrl+Shift+R / Cmd+Shift+R

---

## Notes

- **Auth Keys (ADMIN_KEYS, FRIEND_KEYS)** are managed directly in Cloudflare via `wrangler secret put`, NOT in GitHub
- **CSS is optional** - some apps may only need JavaScript, but most will need CSS
- **CSS must be configured in TWO places:** `update-bundle.mjs` (to copy the file) AND `generate-registry.mjs` (to load it in the browser)
- **Registry props** can be customized per app (e.g., API URLs, environment config)
- **Version numbers** from package.json are used for cache busting in production
