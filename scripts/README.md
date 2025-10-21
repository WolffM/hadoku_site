# Hadoku Site Administration Scripts# Hadoku Site Administration Scripts# Hadoku Site Administration Scripts



Administration tools for managing Hadoku site infrastructure.



## Quick StartThis directory contains administration tools for managing the Hadoku site infrastructure.This directory contains administration tools for managing the Hadoku site infrastructure.



```bash

python administration.py <command> [options]

```## Quick Start## Quick Start



## Available Commands



### Package Management**Single entry point for all operations:**Use the main administration tool to run all operations:

- `verify-install` - Verify and install latest packages



### KV Operations

- `kv-summary` - Display all boards and tasks by user```bash```bash

- `kv-fetch <key>` - Fetch all data for a user

- `kv-inspect --key <key>` - Inspect specific key (raw JSON)python administration.py <command> [options]python administration.py <command> [options]

- `kv-analyze` - Analyze key patterns and schema

- `kv-backup` - Backup all KV data``````

- `kv-restore <file>` - Restore from backup

- `kv-flush` - Delete all KV data

- `kv-cleanup <--dry-run|--execute>` - Clean invalid keys

- `kv-userId-update <key> <newId>` - Update user ID## Available Commands## Available Commands

- `key-migrate <old> <new>` - Migrate key (complete flow)



### GitHub Secrets

- `github-secrets <cloudflare|child-repos|all>` - Update secrets### Package Management### Package Management



## Key Workflows```bash```bash



### Initial Setup# Verify and install latest packages from GitHub# Verify and install latest packages from GitHub

```bash

python administration.py verify-installpython administration.py verify-installpython administration.py verify-install

python administration.py github-secrets cloudflare

pnpm install && pnpm build``````

```



### User Key Migration

```bash### Cloudflare KV Operations### Cloudflare KV Operations

python administration.py key-migrate "4355" "N7RZK2YW9X1TQ8HP"

``````bash

Validates keys, migrates data, updates .env, offers GitHub redeployment.

**Data Inspection**# Backup all KV data to local file

### KV Cleanup

```bash```bashpython administration.py kv-backup

python administration.py kv-analyze

python administration.py kv-cleanup --dry-run# Display summary of all boards and tasks by user

python administration.py kv-cleanup --execute

```python administration.py kv-summary# Restore KV data from backup



## Current Schema (v3.0+)python administration.py kv-restore backups/kv-2025-10-21.json



```# Fetch all KV data for a specific user key

boards:{authKey}                # All boards for a user

tasks:{authKey}:{boardId}       # Tasks for a boardpython administration.py kv-fetch 4355# Flush (delete) all KV data

stats:{authKey}:{boardId}       # Statistics

prefs:{authKey}                 # Preferencespython administration.py kv-flush

```

# Inspect specific KV key (raw JSON)

## Prerequisites

python administration.py kv-inspect --key "boards:4355"# Inspect specific KV key

- Python 3.8+

- Node.js 20+python administration.py kv-inspect --key "boards:4355"

- pnpm

- `.env` file with required secrets# Analyze KV keys and identify schema issues



## .env Variablespython administration.py kv-analyze# Display summary of all boards and tasks



```env```python administration.py kv-summary

HADOKU_SITE_TOKEN=github_pat_...

CLOUDFLARE_API_TOKEN=...```

CLOUDFLARE_ACCOUNT_ID=...

CLOUDFLARE_NAMESPACE_ID=...**Data Management**

ADMIN_KEYS=["uuid1", "uuid2"]

FRIEND_KEYS=["key1", "key2"]```bash### Key Migration

DEPLOY_PACKAGE_TOKEN=ghp_...

TASK_GITHUB_TOKEN=github_pat_...# Backup all KV data to local file```bash

```

python administration.py kv-backup# Migrate data from old authentication key to new key

## pnpm Commands

python administration.py key-migrate "old-key-123" "new-key-456"

```bash

# Run tests# Restore KV data from backup```

pnpm --filter task-api test

python administration.py kv-restore backups/kv-2025-10-21.json

# Build

pnpm build### GitHub Secrets



# Deploy# Flush (delete) all KV data```bash

pnpm --filter task-api deploy

pnpm --filter edge-router deploypython administration.py kv-flush# Update Cloudflare Worker secrets

```

python administration.py github-secrets cloudflare

## Troubleshooting

# Clean up invalid/outdated KV keys

### Module not found

Scripts auto-install dependencies. If fails:python administration.py kv-cleanup --dry-run# Update child repository secrets

```bash

cd scripts/adminpython administration.py kv-cleanup --executepython administration.py github-secrets child-repos

python -m venv .venv

.venv\Scripts\activate```

pip install requests PyNaCl

```# Update all secrets



### Token issues**User Management**python administration.py github-secrets all

- Check `.env` for expired tokens

- Verify scopes at github.com/settings/tokens```bash```

- Required: `read:packages`, `repo`

# Update userId in boards data

### pnpm errors

Always use `--filter` for workspaces:python administration.py kv-userId-update 4355 "Erin <3"## Directory Structure

```bash

pnpm --filter task-api test  # Correct

pnpm test                     # Wrong

```# Migrate data from old key to new key (complete flow with validation)```



## Securitypython administration.py key-migrate "old-key-123" "new-key-456"scripts/



- `.env` is never committed (in `.gitignore`)```├── administration.py          # ⭐ Single entry point - USE THIS!

- OAuth Device Flow for GitHub auth

- Secrets encrypted with repo-specific keys├── admin/                     # Admin modules (imported/called by administration.py)

- Old keys preserved during migration

### GitHub Secrets│   ├── verify_and_install.py # Package verification

## Tips

```bash│   ├── kv_operations.py       # KV operations wrapper

- Use `kv-fetch` to debug user data

- Run `kv-analyze` after schema changes# Update Cloudflare Worker secrets│   ├── key_migration.py       # Key migration logic

- Always `kv-backup` before risky operations

- Test with `--dry-run` firstpython administration.py github-secrets cloudflare│   ├── inspect_kv.py          # KV inspection implementation


│   ├── kv_summary.py          # KV summary implementation

# Update child repository secrets│   └── manage_github_token.py # GitHub secrets management (self-contained)

python administration.py github-secrets child-repos├── backup-kv.py              # ⭐ KV backup (Python, used by CI/CD and local)

├── flush-kv.mjs              # KV flush (Node.js)

# Update all secrets├── restore-kv.mjs            # KV restore (Node.js)

python administration.py github-secrets all├── generate-registry.mjs     # Micro-frontend registry generator

```└── update-task-bundle.mjs    # Task bundle updater

```

## Directory Structure

**Note:** `backup-kv.py` is a standalone script that can be called directly by GitHub Actions 

```or through `administration.py kv-backup`. Both methods use the same implementation.

scripts/

├── administration.py          # ⭐ Main entry point - USE THIS!---

├── admin/                     # Admin modules (called by administration.py)

│   ├── verify_and_install.py # Package verification## Legacy Scripts Reference

│   ├── kv_operations.py       # KV operations wrapper

│   ├── inspect_kv.py          # KV inspection### 1. `manage_github_token.py` - GitHub Secrets Management

│   ├── kv_summary.py          # User-friendly KV summary

│   ├── kv_fetch.py            # Fetch all data for a userAutomated tool to distribute secrets to GitHub repositories.

│   ├── kv_analyze.py          # Analyze key patterns

│   ├── kv_cleanup.py          # Clean up invalid keys**Features:**

│   ├── kv_userId_update.py    # Update user IDs- ✅ Self-bootstrapping (auto-creates venv and installs dependencies)

│   ├── key_migration.py       # Complete key migration flow- ✅ Token validation before distribution

│   └── manage_github_token.py # GitHub secrets management (self-contained)- ✅ Secure GitHub OAuth authentication

├── generate-registry.mjs      # Micro-frontend registry generator (used in build)- ✅ Multi-mode support (child repos, cloudflare, all)

└── update-task-bundle.mjs     # Task bundle updater (used in build)- ✅ Verification of successful updates

```

**Usage:**

## Key Workflows

```bash

### 1. Initial Setup# Update secrets in child repositories (hadoku-task, hadoku-watchparty)

python manage_github_token.py

```bash

# 1. Verify local environment# Update Cloudflare and deployment secrets in hadoku_site

python administration.py verify-installpython manage_github_token.py --mode=cloudflare



# 2. Upload secrets to GitHub# Update all secrets in all repositories

python administration.py github-secrets cloudflarepython manage_github_token.py --mode=all

```

# 3. Test that everything works

pnpm install**Modes:**

pnpm build- `child-repos` (default): Updates `HADOKU_SITE_TOKEN` in child micro-app repos

```- `cloudflare`: Updates deployment secrets (Cloudflare, package token, access keys) in hadoku_site

- `all`: Updates all secrets in all repositories

### 2. User Key Migration

**What it does:**

Complete flow with validation and optional GitHub redeployment:1. Reads secrets from `.env` file in repo root

2. Validates token scopes with GitHub API

```bash3. Authenticates via GitHub OAuth Device Flow

python administration.py key-migrate "4355" "N7RZK2YW9X1TQ8HP"4. Encrypts and uploads secrets to target repositories

```5. Verifies all secrets were updated successfully



**What it does:**### 2. `verify_and_install.py` - Local Setup Verification

1. ✅ Validates old key exists in KV

2. ✅ Validates new key exists in auth config (or prompts to add it)Verifies your local development environment is correctly configured.

3. ✅ Migrates all data (boards, tasks, stats, prefs)

4. ✅ Updates .env file automatically**What it checks:**

5. ✅ Offers to redeploy secrets to GitHub- ✅ `.env` file exists and contains required secrets

6. ✅ Provides clear next steps- ✅ `DEPLOY_PACKAGE_TOKEN` is valid and has correct scopes

- ✅ Token can authenticate with GitHub API

### 3. KV Cleanup After Schema Changes- ✅ Token has `read:packages` scope

- ✅ npm can install private packages from GitHub Packages

```bash

# 1. Analyze current state**Usage:**

python administration.py kv-analyze

```bash

# 2. Preview what would be deletedpython verify_and_install.py

python administration.py kv-cleanup --dry-run```



# 3. Execute cleanup**Expected Output:**

python administration.py kv-cleanup --execute```

```📂 Project root found at: /path/to/hadoku_site

🔑 Loaded DEPLOY_PACKAGE_TOKEN (length: 40).

### 4. User Data Management🔍 Verifying token scopes with GitHub API...

✅ Token is valid. Scopes: read:packages, repo

```bash🚀 Running 'npm install' in workers/task-api...

# View all data for a user✅ npm install completed successfully.

python administration.py kv-fetch 4355🎉 All steps completed successfully!

```

# Update user ID (cosmetic label)

python administration.py kv-userId-update 4355 "Erin <3"**When to run:**

- After initial repository setup

# Migrate to new authentication key- When changing tokens in `.env`

python administration.py key-migrate 4355 N7RZK2YW9X1TQ8HP- When troubleshooting package installation issues

```- Before pushing changes that depend on private packages



## Current Schema (v3.0+)### 3. `generate-registry.mjs` - Micro-Frontend Registry



**Authentication:**Generates the registry file that lists all available micro-frontends.

- Keys are stored as JSON arrays in .env

- UserIds are managed separately in KV storage**Usage:**

```bash

**KV Key Format:**npm run generate-registry

``````

boards:{authKey}                # All boards for a user

tasks:{authKey}:{boardId}       # All tasks for a board**What it does:**

stats:{authKey}:{boardId}       # Statistics for a board- Scans `public/mf/` directory for micro-frontend bundles

prefs:{authKey}                 # User preferences- Creates `public/mf/registry.json` with available apps

```- Automatically runs before build



**Examples:**### 4. `update-task-bundle.mjs` - Task Bundle Updater

```

boards:a21743d9-b0f1-4c75-8e01-ba2dc37feacdUpdates the task micro-frontend bundle from the published npm package.

tasks:4355:groceries

stats:X3vP9aLzR2tQ8nBw:cleaning**Usage:**

prefs:admin```bash

```npm run update-task-bundle

```

## Prerequisites

**What it does:**

- **Python 3.8+**- Copies task bundle from `node_modules/@wolffm/task/dist/`

- **Node.js 20+**- Places it in `public/mf/task/`

- **pnpm** (installed globally)- Automatically runs before build and as part of package updates

- **`.env` file** in repo root with required secrets

### 5. `backup-kv.py` - KV Namespace Backup

## Required .env Variables

Creates a timestamped backup of all keys and values in the TASKS_KV namespace.  

```env**Uses Cloudflare API directly** to avoid Wrangler CLI caching/consistency issues.

# GitHub Authentication

HADOKU_SITE_TOKEN=github_pat_...   # With repo scope**Usage:**

```bash

# Cloudflare Configurationpython scripts/backup-kv.py

CLOUDFLARE_API_TOKEN=...           # Cloudflare API token```

CLOUDFLARE_ACCOUNT_ID=...          # Account ID

CLOUDFLARE_NAMESPACE_ID=...        # KV namespace ID**Requirements:**

- Python 3.x with `requests` library

# Access Control (JSON arrays)- `CLOUDFLARE_API_TOKEN` in environment or `.env` file

ADMIN_KEYS=["uuid1", "uuid2"]      # Admin authentication keys

FRIEND_KEYS=["key1", "key2"]       # Friend authentication keys**What it does:**

- Lists all keys via Cloudflare API

# Deployment- Fetches each key-value pair with pagination support

DEPLOY_PACKAGE_TOKEN=ghp_...       # GitHub token with read:packages- Saves to `backups/tasks-kv-backup-TIMESTAMP.json`

TASK_GITHUB_TOKEN=github_pat_...   # For triggering child deployments- Outputs backup statistics

```

**When it runs:**

## Build Scripts- Automatically before `@wolffm/task` package updates (via GitHub Actions)

- Can be run manually before making risky changes

These run automatically during `pnpm build`:- Recommended before flushing KV namespace



### `generate-registry.mjs`**Note:** The old `backup-kv.mjs` Node.js version has been deprecated due to Wrangler CLI issues with listing keys.

Scans `public/mf/` and creates `public/mf/registry.json` listing all available micro-frontends.

**Output:**

### `update-task-bundle.mjs````

Copies task bundle from `@wolffm/task` package to `public/mf/task/`.📦 Creating KV backup before package update...

✅ Found 15 keys

## Troubleshooting💾 Writing backup to file...

✅ Backup saved: backups/tasks-kv-backup-2025-10-14T18-30-00.json

### "requests" module not found📊 Backup size: 0.05 MB

📊 Total keys backed up: 15

Scripts auto-create venv and install dependencies. If this fails:```



```bash### 6. `restore-kv.mjs` - KV Namespace Restore

cd scripts/admin

python -m venv .venvRestores a KV namespace from a backup JSON file.

.venv\Scripts\activate  # Windows

source .venv/bin/activate  # Unix**Usage:**

pip install requests PyNaCl```bash

```node scripts/restore-kv.mjs backups/tasks-kv-backup-2025-10-14T18-30-00.json

```

### Token validation fails

**What it does:**

1. Check token in `.env` is not expired- Loads backup file

2. Verify scopes at https://github.com/settings/tokens- Validates backup structure

3. Required scopes:- Restores each key-value pair to TASKS_KV

   - `read:packages` (for DEPLOY_PACKAGE_TOKEN)- Reports success/failure statistics

   - `repo` (for HADOKU_SITE_TOKEN)

**When to use:**

### pnpm commands not found- After accidentally flushing KV

- Rolling back to a previous state

Use workspace filters:- Migrating data between environments

- Recovering from a failed update

```bash

# Wrong**Output:**

pnpm test```

🔄 Starting KV restore...

# Correct📂 Loading backup from: backups/tasks-kv-backup-2025-10-14T18-30-00.json

pnpm --filter task-api test✅ Backup loaded successfully

pnpm --filter edge-router deploy   Timestamp: 2025-10-14T18:30:00.000Z

```   Key count: 15

📦 Restoring key-value pairs...

## Security Notes   Progress: 15/15 keys restored

✅ Restore completed!

- `.env` contains secrets - **never commit to git**```

- OAuth Device Flow used for GitHub secrets (requires browser auth)

- Secrets encrypted with repository-specific public keys### 7. `flush-kv.mjs` - KV Namespace Flush

- Old keys preserved during migration (manual deletion after verification)

Deletes all keys from the TASKS_KV namespace.

## Development Tips

**⚠️ WARNING:** This is destructive! Always backup first.

- Use `kv-fetch` to debug user data issues

- Run `kv-analyze` after schema changes**Usage:**

- Always `kv-backup` before risky operations```bash

- Test migrations with `--dry-run` first# Interactive (requires typing "FLUSH" to confirm)

- Keep `.env` and `.npmrc` local (in `.gitignore`)node scripts/flush-kv.mjs


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
