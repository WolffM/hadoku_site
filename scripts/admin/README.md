# Admin Scripts

## Secret Management

### GitHub Secrets (via `manage_github_token.py`)

Updates GitHub Secrets for child repos and deployment configuration:

```bash
# Update HADOKU_SITE_TOKEN in child repositories
python manage_github_token.py

# Update Cloudflare deployment secrets (CLOUDFLARE_API_TOKEN, ROUTE_CONFIG, etc.)
python manage_github_token.py --mode=cloudflare

# Update all secrets
python manage_github_token.py --mode=all
```

**Note:** This script does NOT manage ADMIN_KEYS or FRIEND_KEYS. Those are managed directly in Cloudflare.

### Cloudflare Secrets (Authentication Keys)

`ADMIN_KEYS` and `FRIEND_KEYS` are managed directly in Cloudflare via wrangler CLI:

```bash
cd workers/task-api

# Update ADMIN_KEYS (array format)
echo '["a21743d9-b0f1-4c75-8e01-ba2dc37feacd"]' | pnpm exec wrangler secret put ADMIN_KEYS

# Update FRIEND_KEYS (array format)
echo '["key1", "key2", "key3"]' | pnpm exec wrangler secret put FRIEND_KEYS

# List all secrets
pnpm exec wrangler secret list
```

**Format:**
- Both use JSON array format: `["key1", "key2"]`
- No userId mapping (userId is stored in board metadata)
- Keys persist in Cloudflare across deployments

### Why Two Systems?

- **GitHub Secrets**: For deployment configuration that needs to be in CI/CD
- **Cloudflare Secrets**: For authentication keys that should be managed manually and persist independently of code deployments

## Workflow

1. Update code → Push to GitHub
2. GitHub Actions deploys worker (auth keys already in Cloudflare)
3. No need to update keys unless adding/removing users
4. When keys change, update directly in Cloudflare via wrangler
