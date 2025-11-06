#!/usr/bin/env python3
"""
KV Cleanup Script - Remove Invalid/Dead Entries

This script removes KV entries that are not associated with valid auth keys.

Valid keys:
- FRIEND_KEYS: 655b37cf-e0d4-4bf5-88cb-e2d1c2bd9c6b, N7RZK2YW9X1TQ8HP, 4355, X3vP9aLzR2tQ8nBw, X3vP9aLzRasdQ8nBw
- ADMIN_KEYS: a21743d9-b0f1-4c75-8e01-ba2dc37feacd
- SYSTEM: public, admin
"""

import json
import sys
from datetime import datetime
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


def analyze_key_for_deletion(key, value):
    """
    Determine if a key should be deleted.

    Returns: (should_delete: bool, reason: str or None)
    """
    key_type = key.split(':')[0] if ':' in key else key
    key_id = ':'.join(key.split(':')[1:]) if ':' in key else key

    # Session-info entries
    if key.startswith('session-info:'):
        if isinstance(value, dict):
            auth_key = value.get('authKey', '')
            if auth_key not in VALID_KEYS:
                return (True, f"Invalid authKey: {auth_key}")
        return (False, None)

    # Session-map entries
    elif key.startswith('session-map:'):
        auth_key = key_id
        if auth_key not in VALID_KEYS:
            return (True, f"Invalid authKey: {auth_key}")
        return (False, None)

    # Prefs entries - more complex logic
    elif key.startswith('prefs:'):
        pref_key = key_id

        # Valid authKey-based prefs
        if pref_key in VALID_KEYS:
            return (False, None)

        # SessionId-based prefs - need to check if session's authKey is valid
        # This requires looking up session-info
        # For now, we'll check in the deletion process
        return (None, "needs_session_check")

    # Boards entries
    elif key.startswith('boards:'):
        board_key = key_id

        # Valid authKey-based boards
        if board_key in VALID_KEYS:
            return (False, None)

        # SessionId-based boards - needs checking
        return (None, "needs_session_check")

    # Other entries - keep by default
    return (False, None)


def cleanup_invalid_entries(dry_run=True):
    """
    Clean up invalid KV entries.

    Args:
        dry_run: If True, only print what would be deleted without actually deleting
    """
    print("=" * 80)
    print("KV CLEANUP SCRIPT")
    print("=" * 80)
    print()
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE DELETION'}")
    print(f"Valid auth keys: {len(VALID_KEYS)}")
    print()

    # Initialize KV inspector
    config = load_config()
    api_token = config.get('CLOUDFLARE_API_TOKEN')
    account_id = config.get('CLOUDFLARE_ACCOUNT_ID')
    namespace_id = config.get('CLOUDFLARE_NAMESPACE_ID')

    if not all([api_token, account_id, namespace_id]):
        print("❌ Error: Missing Cloudflare credentials in .env")
        return 1

    inspector = CloudflareKVInspector(api_token, account_id, namespace_id)

    # Get all keys
    print("Fetching all keys...")
    key_list = inspector.list_keys()
    all_keys = [k['name'] for k in key_list]
    print(f"Total keys in KV: {len(all_keys)}")
    print()

    # Build session index for quick lookup
    print("Building session index...")
    session_to_authkey = {}
    for key in all_keys:
        if key.startswith('session-info:'):
            value_str = inspector.get_key_value(key)
            if value_str:
                try:
                    value = json.loads(value_str)
                    session_id = key.replace('session-info:', '')
                    auth_key = value.get('authKey', '')
                    session_to_authkey[session_id] = auth_key
                except json.JSONDecodeError:
                    pass

    print(f"Built session index: {len(session_to_authkey)} sessions")
    print()

    # Analyze all keys
    print("Analyzing all keys...")
    to_delete = []
    to_keep = []

    for key in all_keys:
        value_str = inspector.get_key_value(key)
        value = None
        if value_str:
            try:
                value = json.loads(value_str)
            except json.JSONDecodeError:
                value = value_str
        should_delete, reason = analyze_key_for_deletion(key, value)

        # Handle cases that need session lookup
        if reason == "needs_session_check":
            key_id = ':'.join(key.split(':')[1:])
            if key_id in session_to_authkey:
                auth_key = session_to_authkey[key_id]
                if auth_key not in VALID_KEYS:
                    should_delete = True
                    reason = f"SessionId-based entry with invalid authKey: {auth_key}"
                else:
                    should_delete = False
                    reason = None
            else:
                # Orphaned entry - no session-info
                should_delete = True
                reason = "Orphaned entry (no matching session-info)"

        if should_delete:
            to_delete.append({
                'key': key,
                'reason': reason,
                'value': value
            })
        else:
            to_keep.append(key)

    # Report findings
    print("=" * 80)
    print("ANALYSIS RESULTS")
    print("=" * 80)
    print()
    print(f"Entries to keep: {len(to_keep)}")
    print(f"Entries to delete: {len(to_delete)}")
    print()

    if to_delete:
        print("=" * 80)
        print("ENTRIES TO DELETE")
        print("=" * 80)
        print()

        for entry in to_delete:
            print(f"Key: {entry['key']}")
            print(f"Reason: {entry['reason']}")
            if isinstance(entry['value'], dict):
                print(f"Value preview: {json.dumps(entry['value'], indent=2)[:200]}...")
            print()

        # Execute deletion
        if not dry_run:
            print()
            print("=" * 80)
            print("EXECUTING DELETION")
            print("=" * 80)
            print()

            confirm = input(f"Delete {len(to_delete)} entries? (yes/no): ")
            if confirm.lower() == 'yes':
                deleted_count = 0
                failed_count = 0

                for entry in to_delete:
                    try:
                        if inspector.delete_key(entry['key']):
                            deleted_count += 1
                            print(f"✓ Deleted: {entry['key']}")
                        else:
                            failed_count += 1
                            print(f"✗ Failed to delete {entry['key']}")
                    except Exception as e:
                        failed_count += 1
                        print(f"✗ Failed to delete {entry['key']}: {e}")

                print()
                print("=" * 80)
                print("DELETION COMPLETE")
                print("=" * 80)
                print(f"Successfully deleted: {deleted_count}")
                print(f"Failed: {failed_count}")
            else:
                print("Deletion cancelled.")
        else:
            print("DRY RUN - No entries were actually deleted.")
            print("Run with --execute to perform actual deletion.")
    else:
        print("No invalid entries found!")

    # Save report
    report = {
        'timestamp': datetime.now().isoformat(),
        'mode': 'dry_run' if dry_run else 'live',
        'total_keys': len(all_keys),
        'to_keep': len(to_keep),
        'to_delete': len(to_delete),
        'entries_to_delete': to_delete
    }

    report_filename = f"cleanup_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_filename, 'w') as f:
        json.dump(report, f, indent=2)

    print()
    print(f"Report saved to: {report_filename}")


if __name__ == '__main__':
    import sys

    dry_run = '--execute' not in sys.argv

    if not dry_run:
        print()
        print("!" * 80)
        print("WARNING: LIVE DELETION MODE")
        print("!" * 80)
        print()
        confirm = input("Are you sure you want to delete entries? (yes/no): ")
        if confirm.lower() != 'yes':
            print("Cancelled.")
            sys.exit(0)

    cleanup_invalid_entries(dry_run=dry_run)
