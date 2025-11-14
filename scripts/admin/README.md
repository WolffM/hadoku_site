# Admin Scripts

**Last Updated:** November 6, 2025

## Overview

This directory contains Python scripts for managing and maintaining the Cloudflare Workers KV storage used by the task-api worker.

⚠️ **WARNING:** These scripts directly modify production data. Always use dry-run mode first!

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Configuration](#configuration)
3. [Script Inventory](#script-inventory)
4. [Common Operations](#common-operations)
5. [Safety Guidelines](#safety-guidelines)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required

- **Python 3.8+**
- **requests** library: `pip install requests`
- **Cloudflare API Token** with KV edit permissions
- **Account ID** from Cloudflare dashboard
- **Namespace ID** for TASKS_KV

### Environment Variables

Create a `.env` file in `scripts/admin/` (or set environment variables):

```bash
# Cloudflare API Credentials
CF_API_TOKEN=your-cloudflare-api-token-here
ACCOUNT_ID=your-cloudflare-account-id
NAMESPACE_ID=your-kv-namespace-id

# Optional: For legacy GitHub operations
GITHUB_TOKEN=your-github-pat (if needed)
```

**Finding Your IDs:**

```bash
# Get Account ID
# Go to Cloudflare Dashboard → Workers & Pages → Overview
# Account ID is in the URL: dash.cloudflare.com/ACCOUNT_ID/workers

# Get Namespace ID
wrangler kv:namespace list
# Find TASKS_KV namespace ID
```

---

## Configuration

### API Token Permissions

Your Cloudflare API Token needs:

- ✅ **Workers KV Storage: Edit** permission
- ✅ Scoped to your account
- ✅ Scoped to TASKS_KV namespace (recommended)

**Create Token:**

1. Go to Cloudflare Dashboard → My Profile → API Tokens
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Add KV Storage permissions
5. Set Account and Zone restrictions

---

## Script Inventory

### Core KV Operations

#### `inspect_kv.py`

**Purpose:** Core library for KV operations (list, get, put, delete)

**Usage:**

```python
from inspect_kv import CloudflareKVInspector

inspector = CloudflareKVInspector(api_token, account_id, namespace_id)

# List all keys
keys = inspector.list_keys()

# Get value
value = inspector.get_key('prefs:session-123')

# Put value
inspector.put_key('test-key', {'data': 'value'})

# Delete key
inspector.delete_key('test-key')
```

**Dependencies:** None (base library)

---

### Data Inspection

#### `kv_fetch.py`

**Purpose:** Export KV data to JSON file

**Usage:**

```bash
python kv_fetch.py

# Output: kv-export-YYYY-MM-DD_HH-MM-SS.json
```

**Example Output:**

```json
{
  "export_date": "2025-11-06T10:30:00Z",
  "total_keys": 45,
  "keys": [
    {
      "name": "prefs:session-abc123",
      "value": { "theme": "dark", "layout": "horizontal" }
    },
    {
      "name": "boards:session-abc123",
      "value": { "boards": [{ "id": "main", "name": "main" }] }
    }
  ]
}
```

**When to Use:**

- Before major operations (backup)
- Debugging data issues
- Auditing storage usage
- Migration planning

---

#### `kv_analyze.py`

**Purpose:** Analyze KV data and generate statistics

**Usage:**

```bash
python kv_analyze.py kv-export-2025-11-06.json

# Output: Detailed analysis report
```

**Reports:**

- Key type distribution (prefs, boards, tasks, etc.)
- User count by type (admin, friend)
- Storage size estimates
- Orphaned keys detection
- Session mapping analysis

**When to Use:**

- Understanding storage usage
- Identifying cleanup opportunities
- Detecting data anomalies
- Planning optimizations

---

#### `kv_summary.py`

**Purpose:** Quick summary of KV contents

**Usage:**

```bash
python kv_summary.py

# Output:
# Total Keys: 45
# - prefs: 15
# - boards: 10
# - tasks: 12
# - session-info: 10
# - session-map: 5
```

**When to Use:**

- Quick health check
- Monitoring storage growth
- Before/after cleanup operations

---

### Data Cleanup

#### `cleanup_dead_simple.py` ⭐ **RECOMMENDED**

**Purpose:** Remove invalid KV entries (safest cleanup script)

**Usage:**

```bash
# DRY RUN (shows what would be deleted, doesn't delete anything)
python cleanup_dead_simple.py

# LIVE MODE (actually deletes, requires confirmation)
python cleanup_dead_simple.py --live

# AUTO-CONFIRM (for scripts/CI, skips confirmation)
python cleanup_dead_simple.py --live --yes
```

**What It Removes:**

- Entries with invalid authKeys (not in FRIEND_KEYS, ADMIN_KEYS, or system keys)
- Orphaned board/task entries
- Entries for test keys (e.g., "hello", "test", "hi")

**What It Keeps:**

- All entries for valid authKeys
- System entries (public, admin)
- Recent entries (safety margin)

**Example Output:**

```
=== DRY RUN MODE ===
Found 8 entries to delete:

1. Key: boards:test-key
   Reason: Invalid authKey 'test-key'

2. Key: prefs:hello
   Reason: Invalid authKey 'hello'

...

Total: 8 entries would be deleted
Run with --live to actually delete
```

**When to Use:**

- After development/testing (remove test data)
- Periodic maintenance (monthly)
- After user churn (remove abandoned accounts)
- Storage cleanup (reduce KV usage)

---

#### `cleanup_dead_kv.py`

**Purpose:** More aggressive cleanup with custom rules

**Usage:**

```bash
python cleanup_dead_kv.py --dry-run
python cleanup_dead_kv.py  # Live mode
```

**Additional Rules:**

- Age-based cleanup (configurable threshold)
- Pattern-based removal
- Custom validation logic

**When to Use:**

- Complex cleanup scenarios
- Custom data validation
- Migrating storage formats

⚠️ **Warning:** More aggressive than `cleanup_dead_simple.py` - review dry-run carefully!

---

#### `kv_cleanup.py`

**Purpose:** General cleanup utilities

**Usage:**

```bash
python kv_cleanup.py --type orphaned
python kv_cleanup.py --type duplicates
```

**Cleanup Types:**

- `orphaned` - Remove entries without parent references
- `duplicates` - Remove duplicate entries
- `expired` - Remove expired sessions (if TTL implemented)

**When to Use:**

- Specific cleanup scenarios
- After data corruption
- Post-migration cleanup

---

### Data Migration

#### `key_migration.py`

**Purpose:** Migrate data between storage formats

**Usage:**

```bash
# Dry run
python key_migration.py --from authKey --to sessionId --dry-run

# Live migration
python key_migration.py --from authKey --to sessionId
```

**Migration Types:**

- `authKey → sessionId` - Migrate legacy storage format
- `sessionId → sessionId` - Consolidate sessions
- Custom transformations

**When to Use:**

- Storage format changes
- Schema updates
- Data consolidation

⚠️ **Warning:** Always backup data first (`kv_fetch.py`) before migration!

---

#### `kv_userId_update.py`

**Purpose:** Update user IDs in KV entries

**Usage:**

```bash
python kv_userId_update.py --old old-id --new new-id --dry-run
python kv_userId_update.py --old old-id --new new-id  # Live
```

**When to Use:**

- User ID changes
- Data consolidation
- Fixing incorrect IDs

---

### Legacy/Deprecated Scripts

#### `manage_github_token.py`

**Purpose:** ⚠️ DEPRECATED - Managed GitHub PAT (pre-Workers KV migration)

**Status:** No longer needed after October 2025 migration to Workers KV

---

#### `verify_and_install.py`

**Purpose:** Check script dependencies

**Usage:**

```bash
python verify_and_install.py
```

**Checks:**

- Python version
- Required libraries
- Environment variables
- Cloudflare API connectivity

---

#### `check_secret.py`

**Purpose:** Test Cloudflare API connectivity

**Usage:**

```bash
python check_secret.py
```

**Output:**

```
✓ CF_API_TOKEN is set
✓ ACCOUNT_ID is set
✓ NAMESPACE_ID is set
✓ API connection successful
✓ Found 45 keys in TASKS_KV
```

---

## Common Operations

### Backup Before Major Changes

**Always export data first:**

```bash
# Export current state
python kv_fetch.py

# Save with descriptive name
mv kv-export-2025-11-06_10-30-00.json backups/before-cleanup-2025-11-06.json
```

### Clean Up Test Data

```bash
# Step 1: Dry run to see what would be deleted
python cleanup_dead_simple.py

# Step 2: Review output carefully

# Step 3: Run live mode with confirmation
python cleanup_dead_simple.py --live

# Step 4: Verify cleanup worked
python kv_summary.py
```

### Investigate User Data Issues

```bash
# Step 1: Export data
python kv_fetch.py

# Step 2: Analyze export
python kv_analyze.py kv-export-2025-11-06.json

# Step 3: Check specific user
grep "N7RZK2YW9X1TQ8HP" kv-export-2025-11-06.json

# Step 4: Inspect with Python
python
>>> from inspect_kv import CloudflareKVInspector
>>> inspector = CloudflareKVInspector(token, account, namespace)
>>> inspector.get_key('prefs:session-abc123')
```

### Migrate Storage Format

```bash
# Step 1: Backup
python kv_fetch.py
mv kv-export-*.json backups/pre-migration-$(date +%Y%m%d).json

# Step 2: Dry run migration
python key_migration.py --from authKey --to sessionId --dry-run

# Step 3: Review migration plan

# Step 4: Run migration
python key_migration.py --from authKey --to sessionId

# Step 5: Verify
python kv_analyze.py kv-export-post-migration.json
```

### Monitor Storage Usage

```bash
# Quick check
python kv_summary.py

# Detailed analysis
python kv_fetch.py
python kv_analyze.py kv-export-*.json

# Watch for growth
watch -n 300 'python kv_summary.py'  # Every 5 minutes
```

---

## Safety Guidelines

### ⚠️ Before Running ANY Script

1. ✅ **Backup first:** Always run `kv_fetch.py` before modifications
2. ✅ **Dry run:** Use `--dry-run` or script's dry-run mode
3. ✅ **Review output:** Carefully read what will be changed
4. ✅ **Test credentials:** Run `check_secret.py` to verify API access
5. ✅ **Know rollback:** Have backup ready to restore

### ⚠️ Never Do This

- ❌ Run cleanup scripts without dry-run first
- ❌ Delete KV entries manually without script
- ❌ Share API tokens in code or logs
- ❌ Run multiple cleanup scripts simultaneously
- ❌ Skip backups before major operations
- ❌ Commit `.env` file to git

### ⚠️ Production Safety

**Required approvals for:**

- 🔴 Any deletion operations
- 🔴 Any migration operations
- 🔴 Any bulk updates

**Rollback plan required for:**

- Major cleanup (>10 keys)
- Storage migrations
- Schema changes
- User data modifications

---

## Troubleshooting

### "API token invalid"

**Causes:**

- Token expired
- Token lacks KV edit permissions
- Wrong account ID

**Solution:**

1. Regenerate token in Cloudflare dashboard
2. Verify permissions include "Workers KV Storage: Edit"
3. Update `.env` with new token
4. Run `python check_secret.py` to verify

### "Namespace not found"

**Causes:**

- Wrong namespace ID
- Token not scoped to this namespace

**Solution:**

```bash
# List namespaces
wrangler kv:namespace list

# Find TASKS_KV ID
# Update NAMESPACE_ID in .env
```

### "Rate limit exceeded"

**Causes:**

- Too many API requests too quickly
- Cloudflare API rate limits

**Solution:**

- Scripts have built-in rate limiting
- Wait 60 seconds and retry
- For bulk operations, use pagination

### "UnicodeEncodeError" on Windows

**Cause:** Windows console encoding issues

**Solution:**

```bash
# Use UTF-8 encoding
chcp 65001

# Or redirect to file
python script.py > output.txt
```

### Script hangs or times out

**Causes:**

- Large dataset (>1000 keys)
- Network issues
- API timeouts

**Solution:**

- Check network connectivity
- Increase timeout in script
- Use pagination for large datasets
- Run during low-traffic periods

---

## Best Practices

### Regular Maintenance

**Monthly:**

- Export data for backup
- Run cleanup for test/invalid keys
- Review storage usage trends

**Quarterly:**

- Audit user access patterns
- Clean up abandoned sessions
- Optimize storage formats

**As-Needed:**

- After development sprints (remove test data)
- After user reports (investigate data issues)
- Before major changes (backup + analysis)

### Documentation

When running scripts, document:

- Date and time
- Script name and parameters
- Dry-run output
- Live execution results
- Any issues encountered
- Rollback steps if needed

### Automation

**Safe to automate:**

- `kv_fetch.py` - Daily backups
- `kv_summary.py` - Monitoring
- `check_secret.py` - Health checks

**Requires human review:**

- Any cleanup scripts
- Any migration scripts
- Any deletion operations

---

## Script Dependencies

```
inspect_kv.py (base library)
  ↓ Used by
  ├── kv_fetch.py
  ├── cleanup_dead_simple.py
  ├── cleanup_dead_kv.py
  └── kv_userId_update.py

kv_fetch.py (data export)
  ↓ Produces
  └── kv-export-*.json
        ↓ Used by
        ├── kv_analyze.py
        ├── cleanup_dead_simple.py
        └── kv_summary.py
```

---

## Related Documentation

- [SESSION_ARCHITECTURE.md](../../docs/SESSION_ARCHITECTURE.md) - Session & storage design
- [SECURITY.md](../../docs/SECURITY.md) - Security considerations
- [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) - Overall system architecture

---

## Emergency Procedures

### Data Loss Recovery

If data is accidentally deleted:

1. **Stop immediately** - Don't run any more scripts
2. **Find backup** - Locate most recent `kv-export-*.json`
3. **Review backup** - Verify it has the missing data
4. **Restore data:**

   ```python
   from inspect_kv import CloudflareKVInspector
   import json

   inspector = CloudflareKVInspector(token, account, namespace)

   with open('backup.json') as f:
       data = json.load(f)

   # Restore specific keys
   for entry in data['keys']:
       if entry['name'].startswith('prefs:user-xyz'):
           inspector.put_key(entry['name'], entry['value'])
   ```

5. **Verify restoration** - Check affected user can access data
6. **Document incident** - Record what happened and how it was fixed

### Script Malfunction

If script behaves unexpectedly:

1. **Kill script** - Ctrl+C or kill process
2. **Check KV state** - Run `python kv_summary.py`
3. **Compare to backup** - Diff current state vs backup
4. **Review logs** - Check script output for errors
5. **Report issue** - Document unexpected behavior
6. **Rollback if needed** - Restore from backup if data corrupted

---

**Document Version:** 1.0
**Last Updated:** November 6, 2025
**Maintained By:** Engineering Team
**Change Log:**

- 2025-11-06: Initial creation documenting all admin scripts and operations
