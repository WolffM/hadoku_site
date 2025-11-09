#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Delete all data for a specific authentication key from KV and D1

This script is used after key migration to clean up old key data.
USE WITH CAUTION - this is destructive and cannot be undone!
"""

import requests
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

def delete_key_data(user_key: str, include_d1: bool = False, dry_run: bool = True):
    """
    Delete all KV and optionally D1 data for a specific user key.

    Args:
        user_key: The authentication key to delete data for
        include_d1: If True, also delete D1 task_events
        dry_run: If True, only show what would be deleted
    """
    print("=" * 80)
    print(f"DELETE KEY DATA - {'DRY RUN' if dry_run else 'EXECUTING'}")
    print("=" * 80)
    print(f"Target key: {user_key}")
    print(f"Include D1: {include_d1}")
    print()

    if not dry_run:
        print("WARNING: This will permanently delete all data for this key!")
        print("         This action cannot be undone!")
        print()
        response = input("Are you ABSOLUTELY sure you want to proceed? (type 'DELETE' to confirm): ")
        if response != 'DELETE':
            print("[INFO] Deletion cancelled")
            return 0
        print()

    env = load_env()
    api_token = env.get('CLOUDFLARE_API_TOKEN')
    account_id = env.get('CLOUDFLARE_ACCOUNT_ID')
    namespace_id = env.get('CLOUDFLARE_NAMESPACE_ID')

    if not all([api_token, account_id, namespace_id]):
        print("[ERROR] Missing Cloudflare credentials in .env")
        return 1

    # Step 1: Delete KV data
    print("[INFO] Step 1: Scanning KV data...")
    base_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}"
    headers = {'Authorization': f'Bearer {api_token}'}

    prefixes = [
        f'boards:{user_key}',
        f'tasks:{user_key}:',
        f'prefs:{user_key}',
        f'session-map:{user_key}'
    ]

    keys_to_delete = []
    session_ids = []

    # Collect all keys
    for prefix in prefixes:
        list_url = f"{base_url}/keys?prefix={prefix}"
        response = requests.get(list_url, headers=headers)

        if response.ok:
            keys = response.json().get('result', [])
            for key_obj in keys:
                key_name = key_obj['name']
                keys_to_delete.append(key_name)

                # If this is session-map, get session IDs
                if key_name.startswith('session-map:'):
                    get_url = f"{base_url}/values/{key_name}"
                    get_resp = requests.get(get_url, headers=headers)
                    if get_resp.ok:
                        import json
                        session_map = json.loads(get_resp.text)
                        session_ids.extend(session_map.get('sessionIds', []))

    # Add session-info keys
    for session_id in session_ids:
        keys_to_delete.append(f'session-info:{session_id}')

    print(f"[INFO] Found {len(keys_to_delete)} KV keys to delete:")
    for key in keys_to_delete:
        print(f"   - {key}")
    print()

    if dry_run:
        print("[INFO] DRY RUN - No keys were actually deleted")
    else:
        print("[INFO] Deleting KV keys...")
        deleted_count = 0
        for key in keys_to_delete:
            delete_url = f"{base_url}/values/{key}"
            delete_resp = requests.delete(delete_url, headers=headers)
            if delete_resp.ok:
                print(f"   [SUCCESS] Deleted {key}")
                deleted_count += 1
            else:
                print(f"   [ERROR] Failed to delete {key}")

        print(f"\n[SUCCESS] Deleted {deleted_count}/{len(keys_to_delete)} KV keys")

    # Step 2: Delete D1 data (if requested)
    if include_d1:
        print()
        print("=" * 80)
        print("[INFO] Step 2: D1 Database Cleanup")
        print("=" * 80)

        if dry_run:
            print("[INFO] Would delete all task_events with user_key = '{user_key}'")
            print("[INFO] DRY RUN - No D1 data was actually deleted")
        else:
            from d1_key_migration import execute_d1_query, count_events_for_key

            database_id = '17f9ea29-8035-40a5-bab0-defdfd32d7d4'  # Production DB
            api_token_d1 = env.get('CLOUDFLARE_API_TOKEN_MIGRATION') or api_token

            # Count events
            event_count = count_events_for_key(api_token_d1, account_id, database_id, user_key)
            print(f"[INFO] Found {event_count} task_events for key '{user_key}'")

            if event_count > 0:
                sql = "DELETE FROM task_events WHERE user_key = ?"
                response = execute_d1_query(api_token_d1, account_id, database_id, sql, [user_key])

                if response.ok and response.json().get('success'):
                    print(f"[SUCCESS] Deleted {event_count} task_events from D1")
                else:
                    print(f"[ERROR] Failed to delete D1 data: {response.text}")
            else:
                print("[INFO] No D1 events to delete")

    print()
    print("=" * 80)
    print("[INFO] Cleanup Complete")
    print("=" * 80)
    if dry_run:
        print("This was a DRY RUN - no data was actually deleted")
        print("Run with --execute to actually delete the data")
    else:
        print(f"All data for key '{user_key}' has been deleted")
    print("=" * 80)

    return 0

def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("Usage: python delete_key_data.py <user-key> [--include-d1] [--execute]")
        print()
        print("Options:")
        print("  --include-d1    Also delete D1 task_events")
        print("  --execute       Actually delete (default is dry-run)")
        print()
        print("Examples:")
        print("  python delete_key_data.py old-key-123 --execute")
        print("  python delete_key_data.py old-key-123 --include-d1 --execute")
        return 1

    user_key = sys.argv[1]
    include_d1 = '--include-d1' in sys.argv
    dry_run = '--execute' not in sys.argv

    return delete_key_data(user_key, include_d1, dry_run)

if __name__ == '__main__':
    sys.exit(main())
