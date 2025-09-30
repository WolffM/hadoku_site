# Registry Configuration

## Overview

The micro-frontend registry (`public/mf/registry.json`) is **automatically generated** during the build process. It should not be edited directly.

## How It Works

1. **Configuration Source**: `scripts/generate-registry.mjs` reads configuration from:
   - Environment variables (`HADOKU_SITE_TOKEN`, `TASK_ADMIN_KEY`, `MODE`)
   - Hardcoded app configurations

2. **Build Process**: 
   - `npm run build` → runs `generate-registry.mjs` → generates `registry.json` → builds Astro site
   - `npm run dev` → same process for development mode

3. **Environment Variables**:
   - `HADOKU_SITE_TOKEN`: GitHub Personal Access Token (shared across all apps)
   - `TASK_ADMIN_KEY`: Admin key for task app operations
   - `MODE`: `production` or `development` (auto-detected from build context)

## Adding a New Micro-App

### 1. Update `scripts/generate-registry.mjs`

Add your app's configuration:

```javascript
// Your App config
const yourAppConfig = MODE === 'production'
  ? {
      // production props
      githubPat: HADOKU_SITE_TOKEN, // Always include this
      // ... other props
    }
  : {
      // development props
      githubPat: HADOKU_SITE_TOKEN, // Always include this
      // ... other props
    };

// Add to registry object
const registry = {
  // ... existing apps
  yourapp: {
    url: '/mf/yourapp/index.js',
    css: '/mf/yourapp/style.css', // optional
    basename: '/yourapp',
    props: yourAppConfig
  }
};
```

### 2. Update TypeScript Config (Optional)

If you want type safety, update `src/config/micro-frontends.ts`:

```typescript
export interface YourAppConfig {
  githubPat: string;
  // ... other props
}

const devYourAppConfig: YourAppConfig = {
  githubPat,
  // ... dev props
};

const prodYourAppConfig: YourAppConfig = {
  githubPat,
  // ... prod props
};

export const appConfigs = {
  // ... existing apps
  yourapp: MODE === 'production' ? prodYourAppConfig : devYourAppConfig,
};
```

### 3. Add to Dynamic Route

Update `src/pages/[app].astro`:

```typescript
const validApps = ['watchparty', 'task', 'contact', 'herodraft', 'home', 'yourapp'];
```

## GitHub Secrets

Required secrets in GitHub repository settings:

- `HADOKU_SITE_TOKEN`: Fine-grained PAT with repo access
- `TASK_ADMIN_KEY`: Secret key for task app admin operations

## Local Development

For local development with secrets:

```bash
# PowerShell
$env:HADOKU_SITE_TOKEN="your-local-token"
$env:TASK_ADMIN_KEY="your-local-admin-key"
npm run dev

# Bash
export HADOKU_SITE_TOKEN="your-local-token"
export TASK_ADMIN_KEY="your-local-admin-key"
npm run dev
```

## Security Notes

1. **Never commit `registry.json`** - It's in `.gitignore` and contains secrets
2. **Always use environment variables** - Never hardcode secrets in the script
3. **GitHub PAT is shared** - All apps use the same `HADOKU_SITE_TOKEN`
4. **Props are exposed** - All props in registry are sent to the browser, so only include client-safe values

## Template

See `public/mf/registry.template.json` for the expected structure.
