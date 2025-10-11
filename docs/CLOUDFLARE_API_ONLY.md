# Cloudflare Pages Functions Only Configuration

This project deploys ONLY the serverless functions to Cloudflare Pages.
The static site remains on GitHub Pages.

## Setup in Cloudflare Dashboard

1. Go to Workers & Pages → Create application → Pages → Connect to Git
2. Select this repository
3. Configure:
   - **Project name**: `hadoku-api` (or whatever you want)
   - **Production branch**: `main`
   - **Build command**: `echo "No build needed"`
   - **Build output directory**: `/` (root)
   - **Root directory**: `/` (leave blank)

4. Set environment variables:
   - `ADMIN_KEY`: Your admin UUID
   - `FRIEND_KEY`: Your friend UUID
   - `NODE_ENV`: `production`
   - `TASK_DATA_PATH`: `/tmp/hadoku-tasks`

5. Deploy!

## How it Works

Cloudflare Pages will:
- Ignore the `dist/` directory (static site is on GitHub Pages)
- Only deploy the `functions/` directory
- Make your functions available at: `https://hadoku-api.pages.dev`

## Custom Domain (Optional)

Set up a subdomain to make it cleaner:
1. In Cloudflare Pages → Custom domains
2. Add: `api.hadoku.me`
3. Cloudflare will create the DNS records automatically

Then your functions will be at:
- `https://api.hadoku.me/health`
- `https://api.hadoku.me/task/api/*`

## Update Client Code

Update your task app to call the Cloudflare domain:

```javascript
// In task app API client
const API_BASE = import.meta.env.PROD 
  ? 'https://api.hadoku.me'  // Cloudflare functions
  : 'http://localhost:3000';  // Local dev

async getTasks() {
  return (await fetch(`${API_BASE}/task/api?userType=${userType}`)).json();
}
```

## CORS Configuration

The functions already have CORS headers set to allow all origins (`*`), so your GitHub Pages site can call the Cloudflare API without issues.

## Cost

- ✅ GitHub Pages: Free
- ✅ Cloudflare Pages Functions: Free (100k requests/day)
- ✅ Total: $0/month

## Architecture

```
┌─────────────────────────────────────────────────────┐
│ GitHub Pages (hadoku.me)                            │
│ - Static HTML, CSS, JS                              │
│ - Micro-frontend bundles                            │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ API calls
                   ↓
┌─────────────────────────────────────────────────────┐
│ Cloudflare Pages (api.hadoku.me)                    │
│ - Serverless functions only                         │
│ - /health                                           │
│ - /task/api/*                                       │
└─────────────────────────────────────────────────────┘
```

## Benefits

- ✅ Keep existing GitHub Pages setup
- ✅ No workflow changes needed
- ✅ Separate concerns (static vs dynamic)
- ✅ Can update API independently
- ✅ Both platforms remain free

## Drawbacks

- ❌ Extra cross-origin API calls (small latency)
- ❌ Need to manage two deployments
- ❌ Custom domain setup required (api.hadoku.me)

## Alternative: All-in-One Cloudflare Pages

If you want everything in one place, you can migrate fully to Cloudflare Pages:
- Delete `.github/workflows/deploy.yml`
- Connect repo to Cloudflare Pages
- It will serve both static site AND functions
- See `docs/CLOUDFLARE_PAGES_FUNCTIONS.md`
