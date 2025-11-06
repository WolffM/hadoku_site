#!/usr/bin/env python3
"""
Simple KV Cleanup Script
Uses existing export file to determine what to delete
"""

import json
from inspect_kv import CloudflareKVInspector, load_config

# Valid keys configuration
FRIEND_KEYS = [
    "655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b",
    "N7RZK2YW9X1TQ8HP",
    "4355",
    "X3vP9aLzR2tQ8nBw",
    "X3vP9aLzRasdQ8nBw"
]
ADMIN_KEYS = ["a21743d9-b0f1-4c75-8e01-ba2dc37feacd"]
SYSTEM_KEYS = ["public", "admin"]
VALID_KEYS = set(FRIEND_KEYS + ADMIN_KEYS + SYSTEM_KEYS)


def main(dry_run=True, auto_confirm=False):
    # Load the export data
    print("Loading KV export data...")
    with open('kv-export-2025-11-06_10-08-27.json', 'r', encoding='utf-8') as f:
        kv_data = json.load(f)['data']

    print(f"Loaded {len(kv_data)} keys")
    print()

    # Load the deletion list we generated earlier
    print("Loading deletion list...")
    with open('keys_to_delete.json', 'r') as f:
        to_delete = json.load(f)

    print(f"Found {len(to_delete)} keys to delete")
    print()

    # Print deletion list
    print("=" * 80)
    print("KEYS TO DELETE")
    print("=" * 80)
    print()

    for entry in to_delete:
        print(f"Key: {entry['key']}")
        print(f"Type: {entry['type']}")
        print(f"Reason: {entry['reason']}")
        if 'authKey' in entry:
            print(f"AuthKey: {entry['authKey']}")
        print()

    if dry_run:
        print("=" * 80)
        print("DRY RUN - No actual deletion performed")
        print("=" * 80)
        print()
        print("Run with --execute to perform actual deletion")
        return

    # Execute deletion
    print("=" * 80)
    print("EXECUTING DELETION")
    print("=" * 80)
    print()

    if not auto_confirm:
        confirm = input(f"Delete {len(to_delete)} entries? (yes/no): ")
        if confirm.lower() != 'yes':
            print("Cancelled.")
            return
    else:
        print(f"Auto-confirming deletion of {len(to_delete)} entries...")

    # Initialize KV inspector
    config = load_config()
    api_token = config.get('CLOUDFLARE_API_TOKEN')
    account_id = config.get('CLOUDFLARE_ACCOUNT_ID')
    namespace_id = config.get('CLOUDFLARE_NAMESPACE_ID')

    if not all([api_token, account_id, namespace_id]):
        print("❌ Error: Missing Cloudflare credentials in .env")
        return

    inspector = CloudflareKVInspector(api_token, account_id, namespace_id)

    deleted_count = 0
    failed_count = 0

    for entry in to_delete:
        key = entry['key']
        try:
            if inspector.delete_key(key):
                deleted_count += 1
                print(f"[OK] Deleted: {key}")
            else:
                failed_count += 1
                print(f"[FAIL] Failed: {key}")
        except Exception as e:
            failed_count += 1
            print(f"[ERROR] Error deleting {key}: {e}")

    print()
    print("=" * 80)
    print("DELETION COMPLETE")
    print("=" * 80)
    print(f"Successfully deleted: {deleted_count}")
    print(f"Failed: {failed_count}")


if __name__ == '__main__':
    import sys
    dry_run = '--execute' not in sys.argv
    auto_confirm = '--yes' in sys.argv
    main(dry_run=dry_run, auto_confirm=auto_confirm)
