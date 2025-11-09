#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
D1 Key Migration Module
Migrates user_key data in the task_events D1 database table

Uses Cloudflare REST API to execute UPDATE queries on D1 database.
"""

import requests
import json
import sys
from pathlib import Path

def load_env():
    """Load environment variables from .env file."""
    env_path = Path(__file__).parent.parent.parent / '.env'
    env = {}

    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                stripped = line.strip()
                if stripped and not stripped.startswith('#') and '=' in stripped:
                    key, value = stripped.split('=', 1)
                    env[key.strip()] = value.strip().strip('"').strip("'")

    return env

def execute_d1_query(api_token: str, account_id: str, database_id: str, sql: str, params: list = None):
    """
    Execute a SQL query on D1 database using Cloudflare REST API.

    API Documentation:
    https://developers.cloudflare.com/api/operations/cloudflare-d1-query-database
    """
    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}/query"

    headers = {
        'Authorization': f'Bearer {api_token}',
        'Content-Type': 'application/json'
    }

    # Build payload
    payload = {
        "sql": sql
    }

    if params:
        payload["params"] = params

    response = requests.post(url, headers=headers, json=payload)

    return response

def count_events_for_key(api_token: str, account_id: str, database_id: str, user_key: str) -> int:
    """Count how many task_events exist for a given user_key."""
    sql = "SELECT COUNT(*) as count FROM task_events WHERE user_key = ?"

    response = execute_d1_query(api_token, account_id, database_id, sql, [user_key])

    if not response.ok:
        print(f"[ERROR] Failed to count events: {response.status_code}")
        print(f"   Response: {response.text}")
        return -1

    result = response.json()

    # Parse Cloudflare D1 API response format
    if result.get('success') and result.get('result'):
        # D1 API returns: {"success": true, "result": [{"results": [...], "success": true}]}
        query_results = result['result'][0]
        if query_results.get('success') and query_results.get('results'):
            return query_results['results'][0]['count']

    return 0

def migrate_d1_key(old_key: str, new_key: str, database_id: str = None, preview: bool = False):
    """
    Migrate all task_events from old_key to new_key in D1 database.

    Args:
        old_key: The old user authentication key
        new_key: The new user authentication key
        database_id: Optional override for database ID (default: from wrangler.toml)
        preview: If True, use preview database
    """
    print("=" * 80)
    print("D1 KEY MIGRATION - task_events table")
    print("=" * 80)
    print(f"Old key: {old_key}")
    print(f"New key: {new_key}")
    print(f"Mode: {'PREVIEW' if preview else 'PRODUCTION'}")
    print()

    env = load_env()

    api_token = env.get('CLOUDFLARE_API_TOKEN_MIGRATION') or env.get('CLOUDFLARE_API_TOKEN')
    account_id = env.get('CLOUDFLARE_ACCOUNT_ID')

    # Get database ID from wrangler.toml if not provided
    if not database_id:
        if preview:
            database_id = "5400ec8a-0951-446f-8124-f8ef86bd2165"  # Preview DB
        else:
            database_id = "17f9ea29-8035-40a5-bab0-defdfd32d7d4"  # Production DB

    if not all([api_token, account_id, database_id]):
        print("[ERROR] Missing required configuration:")
        if not api_token:
            print("   - CLOUDFLARE_API_TOKEN_MIGRATION or CLOUDFLARE_API_TOKEN")
        if not account_id:
            print("   - CLOUDFLARE_ACCOUNT_ID")
        if not database_id:
            print("   - database_id")
        return 1

    print(f"[INFO] Using database ID: {database_id}")
    print()

    # Step 1: Count events for old key
    print("[INFO] Step 1: Counting events for old key...")
    old_count = count_events_for_key(api_token, account_id, database_id, old_key)

    if old_count == -1:
        print("[ERROR] Failed to query D1 database")
        print("[INFO] This may be a permissions issue with your API token")
        print()
        print("Required token permissions:")
        print("   - Account > D1 > Edit")
        print()
        print("Check your token at: https://dash.cloudflare.com/profile/api-tokens")
        return 1

    if old_count == 0:
        print(f"[WARNING] No task_events found for old key '{old_key}'")
        print("   This is OK if:")
        print("   - The user never completed any tasks (no events logged)")
        print("   - You're testing on preview database with no data")
        print()
        response = input("Continue anyway? (y/n): ").lower()
        if response != 'y':
            print("[INFO] Migration cancelled")
            return 0
    else:
        print(f"[SUCCESS] Found {old_count} task events for old key")
    print()

    # Step 2: Check if new key already has events (potential conflict)
    print("[INFO] Step 2: Checking for conflicts with new key...")
    new_count = count_events_for_key(api_token, account_id, database_id, new_key)

    if new_count > 0:
        print(f"[WARNING] New key '{new_key}' already has {new_count} task events!")
        print("   Migrating will merge the events from both keys.")
        print()
        response = input("Continue with merge? (y/n): ").lower()
        if response != 'y':
            print("[INFO] Migration cancelled")
            return 0
    else:
        print(f"[SUCCESS] New key has no existing events (clean migration)")
    print()

    # Step 3: Migrate data
    print("[INFO] Step 3: Migrating task_events...")
    print(f"   Updating {old_count} events from '{old_key}' to '{new_key}'...")

    sql = "UPDATE task_events SET user_key = ? WHERE user_key = ?"

    response = execute_d1_query(api_token, account_id, database_id, sql, [new_key, old_key])

    if not response.ok:
        print(f"[ERROR] Migration failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return 1

    result = response.json()

    if not result.get('success'):
        print(f"[ERROR] Migration failed")
        print(f"   Response: {json.dumps(result, indent=2)}")
        return 1

    print(f"[SUCCESS] D1 migration complete!")
    print()

    # Step 4: Verify migration
    print("[INFO] Step 4: Verifying migration...")

    # Count events after migration
    final_old_count = count_events_for_key(api_token, account_id, database_id, old_key)
    final_new_count = count_events_for_key(api_token, account_id, database_id, new_key)

    print(f"   Old key events: {old_count} -> {final_old_count}")
    print(f"   New key events: {new_count} -> {final_new_count}")

    if final_old_count == 0 and final_new_count == (old_count + new_count):
        print("[SUCCESS] Verification passed! All events migrated correctly.")
    else:
        print("[WARNING] Verification mismatch!")
        print("   Expected:")
        print(f"      Old key: 0")
        print(f"      New key: {old_count + new_count}")
        print("   Actual:")
        print(f"      Old key: {final_old_count}")
        print(f"      New key: {final_new_count}")

    print()
    print("=" * 80)
    print("[INFO] D1 Migration Summary")
    print("=" * 80)
    print(f"[SUCCESS] Migrated {old_count} task events")
    print(f"[SUCCESS] New key now has {final_new_count} total events")
    print()
    print("Note: D1 migration is complete and cannot be easily reversed.")
    print("      Make sure to test the new key before deleting the old one.")
    print("=" * 80)

    return 0

def main():
    """CLI entry point for testing."""
    if len(sys.argv) < 3:
        print("Usage: python d1_key_migration.py <old-key> <new-key> [--preview]")
        print()
        print("Examples:")
        print("   python d1_key_migration.py old-test-key new-test-key --preview")
        print("   python d1_key_migration.py 4355 new-uuid-key")
        return 1

    old_key = sys.argv[1]
    new_key = sys.argv[2]
    preview = '--preview' in sys.argv

    return migrate_d1_key(old_key, new_key, preview=preview)

if __name__ == '__main__':
    sys.exit(main())
