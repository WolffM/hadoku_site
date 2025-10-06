# Cloudflare Deployment Setup Guide

## Current Status

✅ **API Server Setup Complete**
- Express server running on `http://localhost:3000`
- Task API integration working at `/api/task`
- Health check available at `/health`
- Data directories created and configured
- ES module imports fixed in task app files

## Next Steps: Cloudflare Deployment Configuration

### Current Setup
- **Current Deployment**: GitHub Pages (via `.github/workflows/deploy.yml`)
- **Domain**: hadoku.me
- **Status**: Need to migrate to Cloudflare for API support

### Deployment Options

#### Option 1: Cloudflare Pages + Functions (Recommended ⭐)
- **hadoku.me**: Static Astro site via Cloudflare Pages
- **API routes**: Cloudflare Functions (serverless) at `/api/*`
- **Benefits**: Single deployment, single domain, simpler management
- **Deployment**: Single Cloudflare Pages project

#### Option 2: Dual Deployment
- **hadoku.me**: Static site via Cloudflare Pages
- **api.hadoku.me**: API server via Cloudflare Workers
- **Benefits**: Separate scaling, separate deployments
- **Deployment**: Two separate Cloudflare projects

---

## Required Information from Cloudflare Panel

### 1. Domain Configuration
- [ ] Is `hadoku.me` already configured in Cloudflare DNS?
- [ ] Preferred approach: Single domain (`hadoku.me/api/*`) or subdomain (`api.hadoku.me`)?

### 2. Cloudflare Pages Project
- [ ] Do you have an existing Cloudflare Pages project for hadoku.me?
- [ ] If yes, what's the project name?

### 3. API Token Setup
**Required for automated deployment:**

1. Go to: [Cloudflare Dashboard → My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Choose "Custom token"
4. Configure permissions:
   - **Zone**: `Zone:Read`, `Zone:Edit`
   - **Page**: `Cloudflare Pages:Edit`
   - **Zone Resources**: `Include - Specific zone - hadoku.me`
5. Copy the token for GitHub Secrets

---

## Files to Create/Update

### 1. Astro Configuration Update
**File**: `astro.config.mjs`
```javascript
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://hadoku.me',
  output: 'hybrid', // Enable both static and server-side rendering
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    build: {
      target: 'esnext'
    }
  }
});
```

### 2. Cloudflare Functions (Option 1)
**Directory**: `functions/api/[...path].js`
```javascript
// Cloudflare Function to handle API routes
import { createTaskRouter } from '../../api/apps/task/router.js';

export async function onRequest(context) {
  // Cloudflare Function implementation
  // Will route to Express router
}
```

### 3. GitHub Actions Update
**File**: `.github/workflows/deploy.yml`
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: hadoku-site
          directory: dist
```

### 4. Environment Variables
**Required GitHub Secrets:**
- `CLOUDFLARE_API_TOKEN` - From step 3 above
- `CLOUDFLARE_ACCOUNT_ID` - From Cloudflare Dashboard → Right sidebar
- `ADMIN_KEY` - Keep existing
- `FRIEND_KEY` - Keep existing
- `HADOKU_SITE_TOKEN` - Keep existing

---

## Implementation Steps

### Phase 1: Cloudflare Setup
1. [ ] Configure domain in Cloudflare (if not already)
2. [ ] Create Cloudflare Pages project
3. [ ] Generate API token with required permissions
4. [ ] Get Account ID from dashboard

### Phase 2: Code Changes
1. [ ] Update `astro.config.mjs` for hybrid mode
2. [ ] Create Cloudflare Functions for API routes (Option 1) OR Wrangler config (Option 2)
3. [ ] Update `.github/workflows/deploy.yml` for Cloudflare
4. [ ] Add required environment variables to GitHub

### Phase 3: Deployment
1. [ ] Test build locally: `npm run build`
2. [ ] Push changes and verify GitHub Actions
3. [ ] Test deployed endpoints:
   - `https://hadoku.me` (static site)
   - `https://hadoku.me/api/health` (API health check)
   - `https://hadoku.me/api/task?userType=public` (task API)

### Phase 4: DNS & SSL
1. [ ] Configure DNS records for optimal routing
2. [ ] Verify SSL certificates
3. [ ] Test from different locations

---

## Current File Structure
```
hadoku_site/
├── api/
│   ├── server.js              # Express server (for local dev)
│   └── apps/task/             # Task app (deployed from child repo)
├── data/task/                 # Runtime data (not committed)
│   ├── friend/
│   └── admin/
├── .github/workflows/
│   └── deploy.yml             # Needs updating for Cloudflare
├── astro.config.mjs           # Needs hybrid mode
├── package.json               # Has API dependencies
└── functions/                 # Will create for Cloudflare Functions
```

---

## Notes

- **Current Server**: Running locally on port 3000
- **Task App**: Successfully integrated and working
- **Data Persistence**: Configured for friend/admin users
- **CORS**: Configured for hadoku.me domain
- **Health Checks**: Available at `/health` endpoint

## Questions to Resolve

1. **Domain preference**: `hadoku.me/api/*` or `api.hadoku.me`?
2. **Deployment approach**: Single project (Option 1) or dual projects (Option 2)?
3. **Existing Cloudflare setup**: Any current Pages projects?

---

## Next Session Tasks

1. Collect Cloudflare information (domain, project, API token)
2. Choose deployment option (1 or 2)
3. Implement chosen configuration
4. Update GitHub Actions workflow
5. Test deployment pipeline
6. Verify all endpoints work in production

---

*Last updated: October 6, 2025*
*Status: Ready for Cloudflare configuration*