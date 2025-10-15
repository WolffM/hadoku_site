# Hadoku Site Scripts

Management and verification scripts for the hadoku_site repository.

## Available Scripts

### 1. `manage_github_token.py` - GitHub Secrets Management

Automated tool to distribute secrets to GitHub repositories.

**Features:**
- ✅ Self-bootstrapping (auto-creates venv and installs dependencies)
- ✅ Token validation before distribution
- ✅ Secure GitHub OAuth authentication
- ✅ Multi-mode support (child repos, cloudflare, all)
- ✅ Verification of successful updates

**Usage:**

```bash
# Update secrets in child repositories (hadoku-task, hadoku-watchparty)
python manage_github_token.py

# Update Cloudflare and deployment secrets in hadoku_site
python manage_github_token.py --mode=cloudflare

# Update all secrets in all repositories
python manage_github_token.py --mode=all
```

**Modes:**
- `child-repos` (default): Updates `HADOKU_SITE_TOKEN` in child micro-app repos
- `cloudflare`: Updates deployment secrets (Cloudflare, package token, access keys) in hadoku_site
- `all`: Updates all secrets in all repositories

**What it does:**
1. Reads secrets from `.env` file in repo root
2. Validates token scopes with GitHub API
3. Authenticates via GitHub OAuth Device Flow
4. Encrypts and uploads secrets to target repositories
5. Verifies all secrets were updated successfully

### 2. `verify_and_install.py` - Local Setup Verification

Verifies your local development environment is correctly configured.

**What it checks:**
- ✅ `.env` file exists and contains required secrets
- ✅ `DEPLOY_PACKAGE_TOKEN` is valid and has correct scopes
- ✅ Token can authenticate with GitHub API
- ✅ Token has `read:packages` scope
- ✅ npm can install private packages from GitHub Packages

**Usage:**

```bash
python verify_and_install.py
```

**Expected Output:**
```
📂 Project root found at: /path/to/hadoku_site
🔑 Loaded DEPLOY_PACKAGE_TOKEN (length: 40).
🔍 Verifying token scopes with GitHub API...
✅ Token is valid. Scopes: read:packages, repo
🚀 Running 'npm install' in workers/task-api...
✅ npm install completed successfully.
🎉 All steps completed successfully!
```

**When to run:**
- After initial repository setup
- When changing tokens in `.env`
- When troubleshooting package installation issues
- Before pushing changes that depend on private packages

### 3. `generate-registry.mjs` - Micro-Frontend Registry

Generates the registry file that lists all available micro-frontends.

**Usage:**
```bash
npm run generate-registry
```

**What it does:**
- Scans `public/mf/` directory for micro-frontend bundles
- Creates `public/mf/registry.json` with available apps
- Automatically runs before build

### 4. `update-task-bundle.mjs` - Task Bundle Updater

Updates the task micro-frontend bundle from the published npm package.

**Usage:**
```bash
npm run update-task-bundle
```

**What it does:**
- Copies task bundle from `node_modules/@wolffm/task/dist/`
- Places it in `public/mf/task/`
- Automatically runs before build and as part of package updates

### 5. `backup-kv.mjs` - KV Namespace Backup

Creates a timestamped backup of all keys and values in the TASKS_KV namespace.

**Usage:**
```bash
node scripts/backup-kv.mjs
```

**What it does:**
- Lists all keys in TASKS_KV namespace
- Fetches each key-value pair
- Saves to `backups/tasks-kv-backup-TIMESTAMP.json`
- Outputs backup statistics

**When it runs:**
- Automatically before `@wolffm/task` package updates (via GitHub Actions)
- Can be run manually before making risky changes
- Recommended before flushing KV namespace

**Output:**
```
📦 Creating KV backup before package update...
✅ Found 15 keys
💾 Writing backup to file...
✅ Backup saved: backups/tasks-kv-backup-2025-10-14T18-30-00.json
📊 Backup size: 0.05 MB
📊 Total keys backed up: 15
```

### 6. `restore-kv.mjs` - KV Namespace Restore

Restores a KV namespace from a backup JSON file.

**Usage:**
```bash
node scripts/restore-kv.mjs backups/tasks-kv-backup-2025-10-14T18-30-00.json
```

**What it does:**
- Loads backup file
- Validates backup structure
- Restores each key-value pair to TASKS_KV
- Reports success/failure statistics

**When to use:**
- After accidentally flushing KV
- Rolling back to a previous state
- Migrating data between environments
- Recovering from a failed update

**Output:**
```
🔄 Starting KV restore...
📂 Loading backup from: backups/tasks-kv-backup-2025-10-14T18-30-00.json
✅ Backup loaded successfully
   Timestamp: 2025-10-14T18:30:00.000Z
   Key count: 15
📦 Restoring key-value pairs...
   Progress: 15/15 keys restored
✅ Restore completed!
```

### 7. `flush-kv.mjs` - KV Namespace Flush

Deletes all keys from the TASKS_KV namespace.

**⚠️ WARNING:** This is destructive! Always backup first.

**Usage:**
```bash
# Interactive (requires typing "FLUSH" to confirm)
node scripts/flush-kv.mjs

# Auto-confirm for CI (bypasses confirmation)
FLUSH_CONFIRM=yes node scripts/flush-kv.mjs
```

**What it does:**
- Lists all keys in namespace
- Prompts for confirmation (unless auto-confirmed)
- Deletes each key
- Reports deletion statistics

**When to use:**
- Before deploying a package with incompatible storage structure
- Clearing test/development data
- Starting fresh with a new data schema
- As part of migration process

**Output:**
```
⚠️  KV NAMESPACE FLUSH
This will DELETE ALL KEYS from the TASKS_KV namespace.
Make sure you have created a backup first!

Type "FLUSH" to confirm deletion: FLUSH
🗑️  Deleting keys...
   Progress: 15/15 keys deleted
✅ Flush completed!
```

## Quick Start

### Initial Setup Verification

Run these scripts in order:

```bash
# 1. Verify local environment
python scripts/verify_and_install.py

# 2. Upload secrets to GitHub (if not already done)
python scripts/manage_github_token.py --mode=cloudflare

# 3. Test that everything works
npm install
npm run build
```

## Prerequisites

- **Python 3.8+**
- **Node.js 20+**
- **npm 9.6.5+**
- **`.env` file** in repo root with all required secrets

## Required .env Variables

The scripts expect these variables in your `.env` file:

```env
# For verify_and_install.py
DEPLOY_PACKAGE_TOKEN=ghp_...     # GitHub token with read:packages scope

# For manage_github_token.py (cloudflare mode)
HADOKU_SITE_TOKEN=github_pat_... # GitHub token with repo, write:packages
CLOUDFLARE_API_TOKEN=...         # Cloudflare API token
ROUTE_CONFIG={"..."}             # JSON routing configuration
PUBLIC_ADMIN_KEY=...             # Admin access key
PUBLIC_FRIEND_KEY=...            # Friend access key
```

## Troubleshooting

### "requests" module not found

The scripts auto-install dependencies in a virtual environment. If this fails:

```bash
cd scripts
python -m venv .venv
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # Unix
pip install requests PyNaCl
```

### Token validation fails

1. Check that your token is in `.env` and not expired
2. Verify token scopes at https://github.com/settings/tokens
3. Regenerate token if needed with correct scopes:
   - `read:packages` (for DEPLOY_PACKAGE_TOKEN)
   - `repo`, `write:packages` (for HADOKU_SITE_TOKEN)

### npm install fails with 401 Unauthorized

1. Run `python scripts/verify_and_install.py` to diagnose
2. Check that `.npmrc` file has your token
3. Ensure token in `.npmrc` matches `DEPLOY_PACKAGE_TOKEN` in `.env`

## Development Tips

- Keep `.env` and `.npmrc` files local (they're in `.gitignore`)
- Use `.env.example` and `.npmrc.example` as templates
- Run verification script after any token changes
- Use `--mode=cloudflare` when updating deployment secrets

```yaml
- name: Trigger parent site deployment
  env:
    HADOKU_SITE_TOKEN: ${{ secrets.HADOKU_SITE_TOKEN }}
  run: |
    curl -X POST "https://api.github.com/repos/WolffM/hadoku_site/dispatches" \
      -H "Authorization: Bearer $HADOKU_SITE_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      -d '{"event_type":"task_updated","client_payload":{}}'
```

## Target Repositories

Currently configured to update:
- `WolffM/hadoku-task`
- `WolffM/hadoku-watchparty`

## Security Notes

- The `.env` file contains your personal access token - **never commit it to git**
- The script uses OAuth Device Flow for secret management (requires browser authentication)
- Secrets are encrypted using repository-specific public keys before upload
- The token being distributed should have minimal permissions (only dispatch to `hadoku_site`)

## Troubleshooting

### Token validation fails
- Verify your token in `.env` is correct and not expired
- Check that the token has access to the repositories
- Ensure the token can dispatch to `WolffM/hadoku_site`

### OAuth authentication fails
- Make sure you authorize the device code at https://github.com/login/device
- The OAuth token needs `repo` scope to write secrets

### Updates fail
- Verify you have admin or write access to the target repositories
- Check that GitHub Actions is enabled on the repositories
