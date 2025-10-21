# Hadoku Site Administration Guide

Quick reference for common administration tasks.

## Installation & Verification

```bash
# Verify environment and install packages
python scripts/administration.py verify-install
```

## Cloudflare KV Management

### Backup Data
```bash
# Create backup before making changes
python scripts/administration.py kv-backup
```

### View Current State
```bash
# See all boards and tasks
python scripts/administration.py kv-summary

# Inspect specific key
python scripts/administration.py kv-inspect --key "boards:4355"
```

### Restore from Backup
```bash
python scripts/administration.py kv-restore backups/kv-2025-10-21_12-33-50.json
```

### Clear All Data
```bash
# ⚠️ WARNING: This deletes everything!
python scripts/administration.py kv-flush
```

## Key Migration

If you need to move data from one authentication key to another:

```bash
python scripts/administration.py key-migrate "old-key-abc123" "new-key-xyz789"
```

This will:
- Copy all boards, tasks, stats, and preferences
- Keep old keys intact (delete manually after verification)

## GitHub Secrets

Update secrets for Cloudflare Workers:

```bash
# Update worker secrets (ADMIN_KEYS, FRIEND_KEYS, etc.)
python scripts/administration.py github-secrets cloudflare

# Update child repo secrets
python scripts/administration.py github-secrets child-repos

# Update everything
python scripts/administration.py github-secrets all
```

## Common Workflows

### Before Deploying Major Changes
```bash
# 1. Backup current state
python scripts/administration.py kv-backup

# 2. Make your changes

# 3. Test locally

# 4. Deploy

# 5. If something breaks, restore backup
python scripts/administration.py kv-restore backups/latest-backup.json
```

### Adding a New User
```bash
# 1. Generate a new key
openssl rand -hex 16

# 2. Add to .env FRIEND_KEYS array:
FRIEND_KEYS=["existing-key-1", "existing-key-2", "new-key-generated"]

# 3. Update Cloudflare secrets
python scripts/administration.py github-secrets cloudflare

# 4. Give the key to the user
```

### Migrating User to New Key
```bash
# 1. Backup first!
python scripts/administration.py kv-backup

# 2. Migrate data
python scripts/administration.py key-migrate "old-key" "new-key"

# 3. Verify migration worked
python scripts/administration.py kv-inspect --key "boards:new-key"

# 4. Update .env to remove old key and add new key

# 5. Update Cloudflare secrets
python scripts/administration.py github-secrets cloudflare
```

## For Full Documentation

See [scripts/README.md](scripts/README.md) for complete documentation of all tools and options.
