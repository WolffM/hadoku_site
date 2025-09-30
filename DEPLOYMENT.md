# Hadoku Site Deployment Guide

## Overview
This site uses a micro-frontend architecture where the main Astro app acts as a shell that dynamically loads micro-apps.

## Quick Links
- **[Quick Setup Guide](docs/QUICK_SETUP.md)** - 5-minute setup with fine-grained token ⭐
- **[Automated Deployment Setup](docs/AUTOMATED_DEPLOYMENT.md)** - Complete guide with security options
- **Manual Deployment** - See sections below

## Current Setup

### Micro-Frontend Registry
The `public/mf/registry.json` file maps app names to their bundle URLs.

### Watchparty Integration
The watchparty app is loaded from the `hadoku-watchparty` repository via jsDelivr CDN:
```
https://cdn.jsdelivr.net/gh/WolffM/hadoku-watchparty@main/apps/ui/dist/index.js
```

## Deploying Updates to Watchparty

### 1. Build the Watchparty UI
In the `hadoku-watchparty` repository:
```bash
cd apps/ui
pnpm install
pnpm build
```

This creates `apps/ui/dist/index.js` which exports `mount(el, props)` and `unmount(el)` functions.

### 2. Commit and Push to GitHub
```bash
git add apps/ui/dist/
git commit -m "Build watchparty UI"
git push origin main
```

### 3. Wait for CDN Cache (Optional)
jsDelivr CDN may cache for up to 7 days. To purge cache immediately:
- Visit: `https://purge.jsdelivr.net/gh/WolffM/hadoku-watchparty@main/apps/ui/dist/index.js`

Or use a specific commit hash in the URL:
```
https://cdn.jsdelivr.net/gh/WolffM/hadoku-watchparty@{commit-sha}/apps/ui/dist/index.js
```

## Alternative: Local Development

For local testing, you can copy the built file:

### Option 1: Copy Manually
```powershell
Copy-Item ..\hadoku-watchparty\apps\ui\dist\index.js public\mf\watchparty\index.js -Force
```

### Option 2: Update Registry for Local
Edit `public/mf/registry.json`:
```json
{
  "watchparty": {
    "url": "/mf/watchparty/index.js",
    "basename": "/watchparty",
    "props": {}
  }
}
```

## External Dependencies

The watchparty UI requires these peer dependencies to be loaded by the host:
- `react` (v19)
- `react-dom/client`

These should be available in the window scope or provided by the shell app.

## Deployment to hadoku.me

### GitHub Pages Setup (Already Configured)
1. Push to main branch
2. GitHub Actions automatically builds and deploys
3. DNS is configured to point hadoku.me to GitHub Pages

### Files Created for Deployment:
- `.github/workflows/deploy.yml` - Automated deployment
- `public/CNAME` - Custom domain configuration
- `astro.config.mjs` - Site URL configuration

## Testing Locally

```bash
# Build the site
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:4321/watchparty/` to test the micro-frontend loading.

## Troubleshooting

### Watchparty not loading
1. Check browser console for errors
2. Verify the CDN URL is accessible
3. Check that `mount` and `unmount` functions are exported
4. Ensure React peer dependencies are available

### DNS not resolving
1. Verify DNS records at Cloudflare
2. Check GitHub Pages custom domain settings
3. Allow up to 48 hours for DNS propagation

### Build failures
1. Ensure all dependencies are installed: `npm install`
2. Check for TypeScript errors: `npm run build`
3. Review GitHub Actions logs for deployment issues
