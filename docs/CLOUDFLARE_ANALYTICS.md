# Cloudflare Web Analytics Setup

## Overview
This site uses Cloudflare Web Analytics for privacy-friendly visitor tracking. The analytics script is conditionally loaded based on environment configuration.

## How It Works

### In Development (Local)
- Analytics is **disabled by default** to avoid errors
- The `PUBLIC_CF_ANALYTICS_TOKEN` environment variable is commented out in `.env`
- No beacon script loads, preventing console errors

### In Production (Cloudflare Pages)
- Analytics can be enabled two ways:
  1. **Automatic injection** by Cloudflare Pages (if enabled in dashboard)
  2. **Manual configuration** using environment variable

## Setup Instructions

### Option 1: Cloudflare Pages Auto-Injection (Recommended)
1. Go to your Cloudflare Pages dashboard
2. Select your project (hadoku.me)
3. Navigate to **Settings → Web Analytics**
4. Enable Web Analytics
5. Cloudflare will automatically inject the beacon script

**Pros:**
- No code changes needed
- Managed by Cloudflare
- Automatic updates

**Cons:**
- Less control over when/where it loads
- May load on dev previews

### Option 2: Manual Environment Variable
1. Get your Web Analytics token:
   - Go to: https://dash.cloudflare.com/?to=/:account/web-analytics
   - Create or copy your token

2. Add to Cloudflare Pages environment:
   - Go to **Settings → Environment variables**
   - Add: `PUBLIC_CF_ANALYTICS_TOKEN` = `your_token_here`
   - Deploy to apply

3. For local testing (optional):
   ```bash
   # In .env file:
   PUBLIC_CF_ANALYTICS_TOKEN=your_token_here
   ```

**Pros:**
- Full control over analytics
- Can disable per environment
- Only loads when explicitly configured

**Cons:**
- Requires manual token management
- Need to update if token changes

## Current Implementation

The analytics beacon is loaded in `src/layouts/Base.astro`:

```astro
<!-- Cloudflare Web Analytics -->
{import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN && (
  <script 
    defer 
    src='https://static.cloudflareinsights.com/beacon.min.js' 
    data-cf-beacon={`{"token": "${import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN}"}`}
  />
)}
```

This only loads if `PUBLIC_CF_ANALYTICS_TOKEN` is defined.

## Preventing Console Errors

### If You See: `ERR_BLOCKED_BY_CLIENT`
This means:
- Your browser extension (ad blocker, privacy tool) is blocking the analytics beacon
- **This is expected and harmless**
- The site works perfectly without analytics

### To Fix Errors in Development:
1. **Option A**: Do nothing - errors are harmless
2. **Option B**: Disable browser extensions for localhost
3. **Option C**: Use incognito mode (fewer extensions)

### To Disable Analytics Completely:
1. **In development**: Leave `PUBLIC_CF_ANALYTICS_TOKEN` commented in `.env`
2. **In production**: Remove the environment variable from Cloudflare Pages
3. **In code**: Remove the script tag from `Base.astro`

## Privacy Considerations

Cloudflare Web Analytics is privacy-friendly:
- ✅ No cookies
- ✅ No personal data collection
- ✅ GDPR/CCPA compliant
- ✅ No cross-site tracking
- ✅ Aggregated data only

Learn more: https://www.cloudflare.com/web-analytics/

## Troubleshooting

### Analytics Not Working
1. Verify token is correct
2. Check environment variable is set in Cloudflare Pages
3. Confirm script is loading in browser DevTools (Network tab)
4. Allow 24-48 hours for data to appear

### Multiple Beacons Loading
If you see duplicate analytics:
1. Choose either auto-injection OR manual configuration (not both)
2. Disable one method

### Console Errors
- `ERR_BLOCKED_BY_CLIENT` → Browser extension blocking (harmless)
- `404 on beacon.min.js` → Token invalid or missing
- `CORS error` → Check token format

## Best Practice

**Recommended setup:**
1. Use Cloudflare Pages auto-injection in production
2. Leave analytics disabled in local development
3. Test in staging/preview before enabling in production
