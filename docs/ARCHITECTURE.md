# Architecture Overview - Hadoku Site

**Last Updated:** October 10, 2025

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Cloudflare Pages                            │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Static Site (Astro Build - /dist)                        │  │
│  │  ├─ Home page with app directory                          │  │
│  │  ├─ Micro-frontend loader (mf-loader.js)                  │  │
│  │  └─ Child app bundles (/mf/task/, /mf/watchparty/, etc.)  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Serverless Functions (/functions)                        │  │
│  │  └─ /task/api/[[path]].js                                 │  │
│  │     ├─ Authenticates admin/friend users                   │  │
│  │     ├─ Blocks public users (403)                          │  │
│  │     ├─ Adapts Express router to serverless               │  │
│  │     └─ Routes to task operations                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

### Public User (No Key)
```
1. Browser → https://hadoku.me/task
2. Loads static HTML + JS bundle
3. Task app mounts with userType='public'
4. All operations use localStorage
5. Zero API calls, zero serverless invocations
```

### Authenticated User (Admin/Friend)
```
1. Browser → https://hadoku.me/task?key=<uuid>
2. mf-loader.js validates key → determines userType
3. Stores key in sessionStorage, cleans URL
4. Overrides window.fetch to add X-Admin-Key header
5. Task app mounts with userType='admin'
6. User creates task → fetch('/task/api', {POST})
7. Fetch override adds X-Admin-Key header automatically
8. Request → Cloudflare Pages Function
9. Function validates key, authenticates
10. Routes through Express task router
11. Response → User
```

## Technology Stack

### Frontend
- **Framework:** Astro (Static Site Generator)
- **Architecture:** Micro-frontends
- **Child Apps:** React (bundled with Vite)
- **Styling:** CSS (scoped per app)
- **Storage:** localStorage (public), API (admin/friend)

### Backend - Local Development
- **Runtime:** Node.js
- **Framework:** Express.js
- **Pattern:** Nested Express Apps
- **Authentication:** Middleware-based key validation
- **Storage:** File system (JSON files)

### Backend - Production
- **Platform:** Cloudflare Pages Functions
- **Runtime:** V8 isolates (serverless)
- **Pattern:** Express router adapted to Cloudflare format
- **Authentication:** Header-based key validation
- **Storage:** Ephemeral /tmp (migrate to KV/R2 for persistence)

### Build & Deploy
- **Static Build:** Astro → /dist
- **CI/CD:** GitHub Actions + Cloudflare Pages auto-deploy
- **Registry:** Auto-generated micro-frontend registry

## Key Design Patterns

### 1. Nested Express Apps (Local)
```javascript
const taskMicro = express()
taskMicro.use('/api', createTaskRouter({ dataPath, environment }))
app.use('/task', authenticate, passUserType, taskMicro)

// Routes to: /task/api/*
```

### 2. Serverless Adapter (Production)
```javascript
// functions/task/api/[[path]].js
export async function onRequest(context) {
  // Cloudflare Request → Express-like request
  // Express router processes
  // Express response → Cloudflare Response
}

// Routes to: /task/api/*
```

### 3. Fetch Override (Authentication)
```javascript
window.fetch = function(url, options = {}) {
  const authKey = sessionStorage.getItem('hadoku-auth-key');
  if (authKey && url.startsWith('/')) {
    options.headers = { ...options.headers, 'X-Admin-Key': authKey };
  }
  return originalFetch(url, options);
};
```

### 4. Conditional API Client (Public vs Auth)
```javascript
function createApiClient(userType) {
  if (userType === 'public') {
    return createLocalStorageClient(); // Browser-only
  }
  return createFetchClient(); // Server API
}
```

## User Types & Permissions

| User Type | Auth | Storage | API Access | Operations |
|-----------|------|---------|------------|------------|
| **Public** | None | localStorage | ❌ Blocked (403) | CRUD (local only) |
| **Friend** | Friend Key | Server (file/KV) | ✅ Authenticated | CRUD + Stats |
| **Admin** | Admin Key | Server (file/KV) | ✅ Authenticated | CRUD + Stats + Clear |

## Environment Variables

### Local Development (.env)
```bash
ADMIN_KEY=<uuid>
FRIEND_KEY=<uuid>
TASK_DATA_PATH=./data/task
NODE_ENV=development
```

### Production (Cloudflare Dashboard)
```bash
ADMIN_KEY=<uuid>          # Different from local
FRIEND_KEY=<uuid>         # Different from local
TASK_DATA_PATH=/tmp/hadoku-tasks
NODE_ENV=production
```

## API Endpoints

All routes follow the pattern: `/task/api/*`

| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | `/task/api` | List tasks | Admin/Friend |
| GET | `/task/api/stats` | Get stats | Admin/Friend |
| POST | `/task/api` | Create task | Admin/Friend |
| PATCH | `/task/api/:id` | Update task | Admin/Friend |
| POST | `/task/api/:id/complete` | Complete task | Admin/Friend |
| DELETE | `/task/api/:id` | Delete task | Admin/Friend |
| POST | `/task/api/clear` | Clear all tasks | Admin only |

**Note:** Public users never call these endpoints - they use localStorage exclusively.

## Data Flow

### Public Mode (Browser-Only)
```
User Action → React State → localStorage → Browser Storage
           ← React State ← localStorage ← (on mount)
```

### Admin/Friend Mode (Server-Backed)
```
User Action → React State → fetch() → Fetch Override (adds auth) 
           → Cloudflare Function → Express Router → File System
           ← JSON Response ← Cloudflare Function ← Express Router
```

## Security Model

### Client-Side
- ✅ Keys never exposed in code (only in sessionStorage)
- ✅ URL cleaned immediately after reading key
- ✅ Fetch override adds auth headers transparently
- ✅ Public users can't access API (403 response)

### Server-Side
- ✅ All API requests validate X-Admin-Key header
- ✅ Keys compared against environment variables
- ✅ userType determined server-side only
- ✅ Child apps never see or validate keys
- ✅ CORS configured for hadoku.me origin

## Performance Characteristics

### Public Mode
- **Initial Load:** ~7KB (gzipped)
- **Operations:** < 1ms (localStorage)
- **Offline:** ✅ Fully functional
- **Cost:** $0 (zero API calls)

### Admin/Friend Mode
- **Initial Load:** ~7KB (gzipped) + auth overhead
- **Operations:** ~50-200ms (serverless function)
- **Offline:** ❌ Requires API access
- **Cost:** ~1-10 requests/day per user (well within free tier)

### Cloudflare Free Tier
- **Quota:** 100,000 requests/day (shared with Workers)
- **Expected Usage:** < 1,000 requests/day (1% of quota)
- **Static Assets:** Unlimited (free)

## Development Workflow

### Local Development
```bash
# Start Express server
$env:ADMIN_KEY="test-admin-key"
$env:FRIEND_KEY="test-friend-key"
node api/server.js

# Start Astro dev server (separate terminal)
npm run dev

# Test at http://localhost:3000/task?key=test-admin-key
```

### Production Deployment
```bash
# Push to GitHub (triggers Cloudflare build)
git push

# Cloudflare automatically:
# 1. Runs: npm run build
# 2. Deploys /dist to CDN
# 3. Deploys /functions to Edge
# 4. Updates https://hadoku.me
```

## File Structure

```
hadoku_site/
├── src/                          # Astro source
│   ├── pages/
│   │   ├── index.astro          # Home with app directory
│   │   └── [app].astro          # Dynamic route for apps
│   ├── components/
│   │   └── mf-loader.js         # Micro-frontend loader
│   └── layouts/
│       └── Base.astro           # Base layout
│
├── public/                       # Static assets
│   └── mf/                      # Micro-frontend bundles
│       ├── registry.json        # App registry
│       ├── task/
│       │   ├── index.js         # Task app bundle
│       │   └── style.css        # Task app styles
│       └── watchparty/
│           └── index.js         # Watchparty bundle
│
├── api/                          # Express server (local dev)
│   ├── server.js                # Main server
│   └── apps/
│       └── task/
│           ├── router.js        # Task Express router
│           ├── handlers/        # Business logic
│           └── routes/          # HTTP endpoints
│
├── functions/                    # Cloudflare Pages Functions (production)
│   └── task/
│       └── api/
│           └── [[path]].js      # Serverless adapter
│
├── data/                         # Local data storage
│   └── task/
│       ├── admin/               # Admin data
│       └── friend/              # Friend data
│
└── docs/                         # Documentation
    ├── PARENT_INTEGRATION.md    # Integration guide
    ├── CLOUDFLARE_PAGES_FUNCTIONS.md  # Deployment guide
    ├── TASK_APP_PUBLIC_MODE.md  # Public localStorage guide
    └── TASK_APP_AUTH_UPDATE.md  # Auth architecture
```

## Migration Path

### Current State
- ✅ Local Express server working
- ✅ Cloudflare Pages Functions adapter created
- ✅ Authentication flow implemented
- ⏳ Public localStorage mode (needs task app rebuild)
- ⏳ Production deployment pending

### Next Steps
1. Rebuild task app with localStorage for public mode
2. Deploy to Cloudflare Pages
3. Set environment variables in Cloudflare dashboard
4. Test production deployment
5. Monitor Cloudflare Functions usage

### Future Enhancements
- Migrate to Cloudflare KV for persistent storage
- Add rate limiting for API endpoints
- Implement caching strategies
- Add more child apps (watchparty, etc.)

## References

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Express Documentation:** https://expressjs.com/
- **Astro Documentation:** https://docs.astro.build/
- **Micro-frontends:** https://micro-frontends.org/

---

**For detailed information, see:**
- `PARENT_INTEGRATION.md` - Server and client integration
- `CLOUDFLARE_PAGES_FUNCTIONS.md` - Deployment to Cloudflare
- `TASK_APP_PUBLIC_MODE.md` - Public mode localStorage implementation
- `TASK_APP_AUTH_UPDATE.md` - Authentication flow details
