# Multiple Authentication Keys Setup

This document explains how to use multiple admin and friend keys with the hadoku_site workers.

## Overview

Previously, the system supported only one admin key and one friend key. Now you can have multiple keys of each type, mapped to specific user IDs.

## Format

Keys are stored as JSON objects in environment variables:

```json
// ADMIN_KEYS
{
  "a21743d9-b0f1-4c75-8e01-ba2dc37feacd": "admin",
  "another-key-here": "admin2", 
  "yet-another-key": "james"
}

// FRIEND_KEYS
{
  "655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b": "friend1",
  "another-friend-key": "alice",
  "more-keys": "bob"
}
```

## Configuration

### 1. Update `.env` File

Edit your `.env` file:

```bash
# New JSON format (recommended)
ADMIN_KEYS={"a21743d9-b0f1-4c75-8e01-ba2dc37feacd": "admin", "another-key": "admin2"}
FRIEND_KEYS={"655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b": "friend1", "another-key": "alice"}

# Legacy single keys (kept for backwards compatibility)
PUBLIC_ADMIN_KEY=a21743d9-b0f1-4c75-8e01-ba2dc37feacd
PUBLIC_FRIEND_KEY=655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b
```

### 2. Update GitHub Secrets

Use the management script to update secrets:

```bash
# Update all Cloudflare secrets (including keys)
python scripts/manage_github_token.py --mode=cloudflare

# Or update everything
python scripts/manage_github_token.py --mode=all
```

The script will:
1. Read keys from `.env`
2. Validate JSON format
3. Authenticate with GitHub
4. Update secrets in repository
5. Verify the updates

## Generate New Keys

Generate a new authentication key:

```bash
# Using openssl
openssl rand -hex 16

# Using uuidgen (macOS/Linux)
uuidgen
```

## Adding Keys

### Option 1: Via `.env` and Script (Recommended)

1. Edit `.env` and add your new key to the JSON object:
```bash
ADMIN_KEYS={"existing-key": "admin", "NEW-KEY-HERE": "newadmin"}
```

2. Run the update script:
```bash
python scripts/manage_github_token.py --mode=cloudflare
```

### Option 2: Via Wrangler CLI

```bash
# Update the secret directly
cd workers/task-api
npx wrangler secret put ADMIN_KEYS
# Paste the JSON when prompted: {"key1": "admin1", "key2": "admin2"}
```

### Option 3: Via Cloudflare Dashboard

1. Go to Workers & Pages
2. Select your worker
3. Go to Settings > Variables
4. Edit `ADMIN_KEYS` or `FRIEND_KEYS`
5. Enter the JSON object

## How It Works

### Code Implementation

The `parseKeysFromEnv()` utility function handles both formats:

```typescript
import { createKeyAuth, parseKeysFromEnv } from '../../util';

app.use('*', createKeyAuth<Env>(
  (env) => {
    // Parses JSON keys with fallback to legacy single keys
    const adminKeys = parseKeysFromEnv(env.ADMIN_KEYS, env.ADMIN_KEY, 'admin');
    const friendKeys = parseKeysFromEnv(env.FRIEND_KEYS, env.FRIEND_KEY, 'friend');
    return { ...adminKeys, ...friendKeys };
  },
  {
    sources: ['header:X-User-Key', 'query:key'],
    defaultUserType: 'public',
    includeHelpers: true
  }
));
```

### Authentication Flow

1. User sends request with `X-User-Key` header
2. Worker extracts the key
3. Worker checks against all keys in `ADMIN_KEYS` and `FRIEND_KEYS`
4. If key matches, sets `authContext.userType` to the mapped value
5. If no match, defaults to `'public'`

## User ID Mapping

The value in the JSON object becomes the `userId`:

```json
{
  "key-abc-123": "james",
  "key-def-456": "alice"
}
```

When James uses `key-abc-123`:
- `authContext.userType = 'admin'` (or 'friend' depending on which keys object)
- `authContext.userId = 'james'`

This allows you to track which specific user made which requests.

## Backwards Compatibility

The system supports both formats:

- **Legacy:** Single `PUBLIC_ADMIN_KEY` and `PUBLIC_FRIEND_KEY` variables
- **New:** JSON `ADMIN_KEYS` and `FRIEND_KEYS` objects

If both are present, the JSON format takes precedence. The legacy keys are used as fallbacks if JSON parsing fails.

## Security Best Practices

1. **Rotate Keys Regularly**: Generate new keys every 3-6 months
2. **Use Strong Keys**: At least 32 characters (use `openssl rand -hex 16`)
3. **Track Usage**: Map keys to specific user IDs for audit trails
4. **Revoke Compromised Keys**: Simply remove them from the JSON object
5. **Never Commit Keys**: Keep them in `.env` (which is `.gitignore`d)

## Troubleshooting

### Invalid JSON Error

If you see "ADMIN_KEYS is not valid JSON":

1. Check JSON syntax (use [jsonlint.com](https://jsonlint.com))
2. Ensure quotes are properly escaped
3. Make sure it's a proper object `{}`

Example valid JSON:
```json
{"key1": "user1", "key2": "user2"}
```

### Keys Not Working

1. Check the key is in the correct JSON object (`ADMIN_KEYS` vs `FRIEND_KEYS`)
2. Verify the secret was updated in GitHub/Cloudflare
3. Redeploy the worker after updating secrets
4. Check worker logs for authentication errors

### Script Fails

If `manage_github_token.py` fails:

1. Ensure `.env` file exists with valid keys
2. Check JSON format in `.env`
3. Verify GitHub authentication (script will prompt)
4. Check you have write access to the repository

## Migration Guide

### From Legacy to JSON Keys

1. Note your current keys:
```bash
PUBLIC_ADMIN_KEY=abc123
PUBLIC_FRIEND_KEY=def456
```

2. Convert to JSON in `.env`:
```bash
ADMIN_KEYS={"abc123": "admin"}
FRIEND_KEYS={"def456": "friend"}
```

3. Keep legacy keys for safety:
```bash
# Keep these during migration
PUBLIC_ADMIN_KEY=abc123
PUBLIC_FRIEND_KEY=def456
```

4. Update secrets:
```bash
python scripts/manage_github_token.py --mode=cloudflare
```

5. Test thoroughly

6. Remove legacy keys once confirmed working

## Examples

### Single User Per Type

```bash
ADMIN_KEYS={"a21743d9-b0f1-4c75-8e01-ba2dc37feacd": "admin"}
FRIEND_KEYS={"655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b": "friend"}
```

### Multiple Admins

```bash
ADMIN_KEYS={"key1": "james", "key2": "alice", "key3": "bob"}
FRIEND_KEYS={"key4": "charlie"}
```

### Team Setup

```bash
# Dev team has admin access
ADMIN_KEYS={"dev-key-1": "james", "dev-key-2": "alice"}

# Beta testers have friend access
FRIEND_KEYS={"beta-1": "charlie", "beta-2": "diana", "beta-3": "eve"}
```

## Related Files

- `.env` - Local environment variables
- `scripts/manage_github_token.py` - Secret management script  
- `workers/util/auth.ts` - Authentication utilities
- `workers/task-api/src/index.ts` - Task API implementation
- `workers/task-api/wrangler.toml` - Worker configuration
