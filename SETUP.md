# Hadoku Site - Setup Guide

Complete setup guide for the hadoku_site repository, including local development and CI/CD configuration.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Environment Configuration](#environment-configuration)
- [GitHub Secrets Configuration](#github-secrets-configuration)
- [Verification](#verification)
- [Automatic Package Updates](#automatic-package-updates)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js**: v20 or higher
- **npm**: v9.6.5 or higher
- **Python**: 3.8+ (for management scripts)
- **GitHub CLI** (optional but recommended): `winget install --id GitHub.cli`

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/WolffM/hadoku_site.git
cd hadoku_site
```

### 2. Copy Environment Files

```bash
# Copy and customize your .env file
cp .env.example .env

# Copy and customize your .npmrc file
cp .npmrc.example .npmrc
```

### 3. Configure .env

Edit `.env` and set all required values:

```env
# GitHub Personal Access Token (for all micro-apps)
HADOKU_SITE_TOKEN=github_pat_YOUR_TOKEN_HERE

# Access Control Keys (generate with: openssl rand -hex 16)
PUBLIC_ADMIN_KEY=your-admin-key-here
PUBLIC_FRIEND_KEY=your-friend-key-here

# Cloudflare API Token
CLOUDFLARE_API_TOKEN=your-cloudflare-token-here

# Route Configuration (JSON)
ROUTE_CONFIG={"global_priority":"12","task_priority":"21","watchparty_priority":"1"}

# GitHub Package Token (needs read:packages scope)
DEPLOY_PACKAGE_TOKEN=ghp_YOUR_TOKEN_HERE
```

### 4. Configure .npmrc

Edit `.npmrc` and replace `YOUR_GITHUB_TOKEN_HERE` with your `DEPLOY_PACKAGE_TOKEN`:

```
@wolffm:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_YOUR_TOKEN_HERE
```

**⚠️ Important:** `.npmrc` is in `.gitignore` to protect your token. Never commit it!

### 5. Install Dependencies

```bash
npm install
```

This will install all dependencies, including private packages from GitHub Packages.

---

## Environment Configuration

### Required Tokens and Their Scopes

#### 1. HADOKU_SITE_TOKEN
- **Purpose**: Used by child micro-apps to trigger updates in this repo
- **Required Scopes**: `repo`, `write:packages`
- **Generate at**: https://github.com/settings/tokens

#### 2. DEPLOY_PACKAGE_TOKEN
- **Purpose**: Download private packages from GitHub Packages
- **Required Scopes**: `read:packages`, `repo`
- **Generate at**: https://github.com/settings/tokens

#### 3. CLOUDFLARE_API_TOKEN
- **Purpose**: Deploy workers to Cloudflare
- **Get from**: Cloudflare Dashboard → API Tokens
- **Permissions**: Edit Cloudflare Workers

---

## GitHub Secrets Configuration

### Automated Setup (Recommended)

Use the provided Python script to automatically configure all GitHub Secrets:

```bash
python scripts/manage_github_token.py --mode=cloudflare
```

This script will:
1. ✅ Read secrets from your `.env` file
2. ✅ Validate token scopes
3. ✅ Authenticate with GitHub
4. ✅ Upload all secrets to your repository
5. ✅ Verify the secrets were set correctly

### Manual Setup

If you prefer to set secrets manually:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

| Secret Name | Value From .env | Description |
|-------------|----------------|-------------|
| `DEPLOY_PACKAGE_TOKEN` | `DEPLOY_PACKAGE_TOKEN` | Token to download private packages |
| `CLOUDFLARE_API_TOKEN` | `CLOUDFLARE_API_TOKEN` | Token to deploy to Cloudflare |
| `ROUTE_CONFIG` | `ROUTE_CONFIG` | JSON routing configuration |
| `ADMIN_KEY` | `PUBLIC_ADMIN_KEY` | Admin access key |
| `FRIEND_KEY` | `PUBLIC_FRIEND_KEY` | Friend access key |
| `TASK_GITHUB_TOKEN` | `HADOKU_SITE_TOKEN` | Token for task app |

---

## Verification

### 1. Verify Local Setup

Run the verification script to check your local environment:

```bash
python scripts/verify_and_install.py
```

This will:
- ✅ Check that `.env` file exists and has all required secrets
- ✅ Validate your `DEPLOY_PACKAGE_TOKEN` scopes
- ✅ Test GitHub API authentication
- ✅ Install worker dependencies using your token

Expected output:
```
📂 Project root found at: ...
🔑 Loaded DEPLOY_PACKAGE_TOKEN (length: 40).
🔍 Verifying token scopes with GitHub API...
✅ Token is valid. Scopes: read:packages, repo
🚀 Running 'npm install' in workers/task-api...
✅ npm install completed successfully.
🎉 All steps completed successfully!
```

### 2. Verify GitHub Secrets

Check that your GitHub Secrets are properly configured:

```bash
# List secrets (names only, values are hidden)
gh secret list
```

### 3. Test Workflows

Trigger a manual workflow run to test your setup:

```bash
# Test package update workflow
gh workflow run update-packages.yml

# Test deployment workflow
gh workflow run deploy.yml
```

---

## Automatic Package Updates

### How It Works

When a child repository (e.g., `hadoku-task`) publishes a new package version:

1. **Child Repo** publishes `@wolffm/task` to GitHub Packages
2. **Child Repo** sends a `repository_dispatch` event to `hadoku_site`
3. **hadoku_site** receives the event via the `update-packages.yml` workflow
4. **hadoku_site** automatically:
   - Updates `@wolffm/task` to the latest version
   - Updates `package.json` and `package-lock.json` in root
   - Updates `package.json` and `package-lock.json` in `workers/task-api`
   - Commits and pushes the changes
5. **Push to main** triggers the deployment workflows automatically

### Workflow Files

- **`.github/workflows/update-packages.yml`**: Handles automatic package updates
- **`.github/workflows/deploy.yml`**: Deploys to GitHub Pages
- **`.github/workflows/deploy-workers.yml`**: Deploys Cloudflare Workers

### Testing Automatic Updates

You can manually trigger a package update:

```bash
# Using GitHub CLI
gh workflow run update-packages.yml

# Or via repository dispatch (simulating child repo)
gh api repos/WolffM/hadoku_site/dispatches \
  -X POST \
  -f event_type='package_updated' \
  -f client_payload[package]='@wolffm/task'
```

---

## Troubleshooting

### Token Authentication Errors

**Error**: `401 Unauthorized` when installing packages

**Solution**:
1. Verify your token in `.npmrc` is correct
2. Check token scopes: `python scripts/verify_and_install.py`
3. Regenerate token if needed and update both `.env` and `.npmrc`

### Package Lock File Out of Sync

**Error**: `npm ci` fails with "lock file out of sync"

**Solution**:
```bash
# Regenerate package-lock.json
npm install

# Commit the updated lock file
git add package-lock.json
git commit -m "chore: update package-lock.json"
git push
```

### Workflow Fails with Missing Secrets

**Error**: Workflow step fails with "secret is empty"

**Solution**:
1. Run the secret management script: `python scripts/manage_github_token.py --mode=cloudflare`
2. Or manually add the missing secret in GitHub Settings → Secrets and variables → Actions

### Python Script Errors

**Error**: `ModuleNotFoundError: No module named 'requests'`

**Solution**: The script auto-creates a virtual environment and installs dependencies. If it fails:
```bash
cd scripts
python -m venv .venv
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # Unix
pip install requests PyNaCl
```

---

## Quick Reference

### Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Update task bundle
npm run update-task-bundle

# Generate micro-frontend registry
npm run generate-registry

# Verify local setup
python scripts/verify_and_install.py

# Update GitHub secrets
python scripts/manage_github_token.py --mode=cloudflare

# Trigger manual deployment
gh workflow run deploy.yml
```

### File Structure

```
.
├── .env                    # Local environment variables (DO NOT COMMIT)
├── .npmrc                  # npm authentication (DO NOT COMMIT)
├── .npmrc.example          # Template for .npmrc
├── package.json            # Root dependencies
├── package-lock.json       # Locked dependency versions
├── scripts/
│   ├── verify_and_install.py      # Verify local setup
│   └── manage_github_token.py     # Manage GitHub secrets
├── .github/workflows/
│   ├── update-packages.yml        # Auto-update packages
│   ├── deploy.yml                 # Deploy to GitHub Pages
│   └── deploy-workers.yml         # Deploy Cloudflare Workers
└── workers/
    ├── edge-router/        # Edge routing worker
    └── task-api/           # Task API worker
```

---

## Getting Help

- **Documentation**: Check `docs/` directory for detailed guides
- **GitHub Issues**: https://github.com/WolffM/hadoku_site/issues
- **Workflow Logs**: Use `gh run list` and `gh run view <run-id> --log`

---

**Last Updated**: October 13, 2025
