# Cloudflare Workers

This directory contains the Cloudflare Workers that power the API routing and fallback logic for hadoku.me.

## Structure

```
workers/
├── edge-router/        # Main traffic handler with fallback logic
│   ├── src/
│   │   └── index.ts   # Edge router implementation
│   ├── wrangler.toml  # Worker configuration
│   └── package.json
│
└── task-api/          # Task API with GitHub-backed storage
    ├── src/
    │   └── index.ts   # Hono-based API routes
    ├── wrangler.toml  # Worker configuration
    └── package.json
```

## Workers

### edge-router

The main entry point for all `hadoku.me/*` traffic. Implements intelligent fallback routing:

- **API routes** (`/task/api/*`, `/watchparty/api/*`): Tries providers in configured order
- **Static routes**: Proxies to GitHub Pages

**Configuration**: Reads `ROUTE_CONFIG` from GitHub Secrets (injected at deploy time)

**Example routing priority**:
```json
{
  "global_priority": "12",      // Try tunnel → Worker
  "task_priority": "21",         // Try Worker → tunnel
  "watchparty_priority": "1"     // Tunnel only
}
```

### task-api

A stateless API that stores tasks in GitHub repository as JSON files. Provides:

- Authentication (public/friend/admin)
- CRUD operations for tasks
- GitHub API integration for persistence

## Local Development

### Prerequisites

- Node.js 20+
- Wrangler CLI: `npm install -g wrangler`
- Cloudflare account with API token

### Setup

```bash
# Install dependencies for edge-router
cd workers/edge-router
npm install

# Install dependencies for task-api
cd ../task-api
npm install
```

### Testing Locally

```bash
# Run edge-router in dev mode
cd workers/edge-router
wrangler dev

# Run task-api in dev mode (in another terminal)
cd workers/task-api
wrangler dev
```

### Setting Secrets (Local)

```bash
# For task-api
cd workers/task-api
echo "your-admin-key" | wrangler secret put ADMIN_KEY --env local
echo "your-friend-key" | wrangler secret put FRIEND_KEY --env local
echo "your-github-pat" | wrangler secret put GITHUB_PAT --env local
```

## Deployment

### Via GitHub Actions (Recommended)

Workers are automatically deployed via `.github/workflows/deploy-workers.yml` when:

- Code in `workers/` directory changes
- Workflow is manually triggered
- `repository_dispatch` event with type `config_updated` or `deploy_workers`

**Required GitHub Secrets**:
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Workers edit permissions
- `ROUTE_CONFIG`: JSON string with routing configuration
- `ADMIN_KEY`: Admin access key for task API
- `FRIEND_KEY`: Friend access key for task API
- `GITHUB_PAT`: GitHub Personal Access Token for task API storage

### Manual Deployment

```bash
# Deploy edge-router
cd workers/edge-router
export CLOUDFLARE_API_TOKEN="your-token"
export ROUTE_CONFIG='{"global_priority":"12"}'
wrangler deploy --var ROUTE_CONFIG:"$ROUTE_CONFIG"

# Deploy task-api
cd workers/task-api
export CLOUDFLARE_API_TOKEN="your-token"
echo "your-admin-key" | wrangler secret put ADMIN_KEY
echo "your-friend-key" | wrangler secret put FRIEND_KEY
echo "your-github-pat" | wrangler secret put GITHUB_PAT
wrangler deploy
```

## Configuration Updates

To update routing configuration:

1. **Via GitHub UI**: Update `ROUTE_CONFIG` secret in repository settings
2. **Via Python script**: Run `python scripts/manage_github_token.py --update-route-config`
3. **Trigger redeployment**: Manually trigger the `deploy-workers` workflow or push a change

The new configuration will be active within ~30 seconds after deployment.

## Monitoring

```bash
# View live logs
wrangler tail edge-router
wrangler tail task-api

# Check deployment status
wrangler deployments list edge-router
wrangler deployments list task-api
```

## Testing

### Test edge-router fallback

```bash
# Should try tunnel first (if running), then Worker
curl -H "X-Admin-Key: your-key" https://hadoku.me/task/api

# Check which backend served the request
curl -i https://hadoku.me/task/api | grep X-Backend-Source
```

### Test task-api directly

```bash
# Health check
curl https://task-api.hadoku.workers.dev/health

# List tasks (requires auth)
curl -H "X-Admin-Key: your-admin-key" https://task-api.hadoku.workers.dev/

# Create task
curl -X POST \
  -H "X-Admin-Key: your-admin-key" \
  -H "Content-Type: application/json" \
  -d '{"text":"Test task"}' \
  https://task-api.hadoku.workers.dev/
```

## Troubleshooting

### Worker not receiving config updates

- Verify `ROUTE_CONFIG` secret is set in GitHub
- Check GitHub Actions logs for deployment errors
- Confirm the workflow injected the config: Look for `--var ROUTE_CONFIG:` in logs

### Task API returning 500 errors

- Check Worker logs: `wrangler tail task-api`
- Verify GitHub PAT has `repo` scope
- Ensure `data/task/admin/` and `data/task/friend/` directories exist in repo

### Fallback not working

- Check `X-Backend-Source` header in response
- Verify tunnel is running: `curl https://api.hadoku.me/health`
- Check edge-router logs: `wrangler tail edge-router`

## Architecture

See [docs/hadoku_route_fallback_design.md](../../docs/hadoku_route_fallback_design.md) for complete architecture documentation.
