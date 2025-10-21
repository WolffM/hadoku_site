#!/usr/bin/env python3
"""
KV Cleanup Script - Remove outdated/invalid keys

This script removes keys that don't match the current schema:
- Valid: boards:{userId}, tasks:{userId}:{boardId}, stats:{userId}:{boardId}, prefs:{userId}
- Invalid: nested user types (boards:admin:userId, tasks:public:userId:boardId, etc.)

Usage:
    python kv_cleanup.py --dry-run    # Show what would be deleted (safe)
    python kv_cleanup.py --execute    # Actually delete the keys
"""

import os
import sys
import json
import requests
import argparse
from pathlib import Path

KV_NAMESPACE_ID = '6cdcc2053b224eb1819a680be8342eb3'
ACCOUNT_ID = 'cfd477d9f1d7ac75e31d4e53952020f2'

def load_env():
    script_dir = Path(__file__).parent
    env_file = script_dir.parent.parent / '.env'
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    if key == 'CLOUDFLARE_API_TOKEN':
                        return value.strip('"').strip("'")
    return None

def list_all_keys(api_token):
    url = f'https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/storage/kv/namespaces/{KV_NAMESPACE_ID}/keys'
    headers = {'Authorization': f'Bearer {api_token}'}
    
    all_keys = []
    cursor = None
    
    while True:
        params = {'limit': 1000}
        if cursor:
            params['cursor'] = cursor
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        if not data.get('success'):
            raise Exception(f"API error: {data.get('errors')}")
        
        all_keys.extend([k['name'] for k in data['result']])
        cursor = data.get('result_info', {}).get('cursor')
        
        if not cursor:
            break
    
    return all_keys

def identify_invalid_keys(keys):
    """Identify keys that should be deleted."""
    invalid_keys = []
    
    for key in keys:
        parts = key.split(':')
        
        # Check for invalid patterns
        if key.startswith('boards:'):
            if len(parts) != 2:
                invalid_keys.append(key)
        
        elif key.startswith('tasks:'):
            if len(parts) != 3:
                invalid_keys.append(key)
        
        elif key.startswith('stats:'):
            if len(parts) != 3:
                invalid_keys.append(key)
        
        elif key.startswith('prefs:'):
            if len(parts) != 2:
                invalid_keys.append(key)
        
        else:
            # Unknown keys (like health-test-key)
            if key != 'health-test-key':  # Keep health test key
                pass  # For now, don't delete unknown keys
    
    return invalid_keys

def delete_key(api_token, key):
    """Delete a single key from KV."""
    url = f'https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/storage/kv/namespaces/{KV_NAMESPACE_ID}/values/{key}'
    headers = {'Authorization': f'Bearer {api_token}'}
    
    response = requests.delete(url, headers=headers)
    response.raise_for_status()
    
    return response.status_code == 200

def main():
    parser = argparse.ArgumentParser(description='Clean up invalid KV keys')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be deleted without deleting')
    parser.add_argument('--execute', action='store_true', help='Actually delete the invalid keys')
    args = parser.parse_args()
    
    if not args.dry_run and not args.execute:
        print("❌ Error: Must specify either --dry-run or --execute")
        print("Usage:")
        print("  python kv_cleanup.py --dry-run    # Preview deletions")
        print("  python kv_cleanup.py --execute    # Actually delete")
        return 1
    
    print('🔍 KV Cleanup Script\n')
    
    api_token = os.environ.get('CLOUDFLARE_API_TOKEN') or load_env()
    if not api_token:
        print('❌ Error: CLOUDFLARE_API_TOKEN not found')
        return 1
    
    try:
        # Get all keys
        print('📋 Fetching all keys...')
        all_keys = list_all_keys(api_token)
        print(f'✅ Found {len(all_keys)} total keys\n')
        
        # Identify invalid keys
        invalid_keys = identify_invalid_keys(all_keys)
        print(f'❌ Found {len(invalid_keys)} invalid/outdated keys:\n')
        
        if not invalid_keys:
            print('🎉 No invalid keys found! KV is clean.')
            return 0
        
        # Group by category for display
        categories = {}
        for key in invalid_keys:
            category = key.split(':')[0]
            if category not in categories:
                categories[category] = []
            categories[category].append(key)
        
        for category, keys in sorted(categories.items()):
            print(f'  {category}: {len(keys)} keys')
            for key in keys[:5]:  # Show first 5
                print(f'    • {key}')
            if len(keys) > 5:
                print(f'    ... and {len(keys) - 5} more')
            print()
        
        # Dry run or execute
        if args.dry_run:
            print('=' * 80)
            print('🔍 DRY RUN MODE - No keys will be deleted')
            print('=' * 80)
            print(f'\nWould delete {len(invalid_keys)} keys')
            print('\nTo actually delete these keys, run:')
            print('  python scripts/admin/kv_cleanup.py --execute')
            return 0
        
        # Execute deletion
        print('=' * 80)
        print('⚠️  DELETION MODE - Keys will be permanently deleted!')
        print('=' * 80)
        confirm = input(f'\nType "DELETE" to confirm deletion of {len(invalid_keys)} keys: ')
        
        if confirm != 'DELETE':
            print('❌ Deletion cancelled')
            return 1
        
        print('\n🗑️  Deleting invalid keys...')
        success_count = 0
        failed_count = 0
        
        for i, key in enumerate(invalid_keys, 1):
            try:
                delete_key(api_token, key)
                success_count += 1
                print(f'\r  Progress: {i}/{len(invalid_keys)} ({success_count} deleted)', end='', flush=True)
            except Exception as e:
                failed_count += 1
                print(f'\n  ❌ Failed to delete {key}: {e}')
        
        print(f'\n\n✅ Cleanup complete!')
        print(f'   Deleted: {success_count}')
        print(f'   Failed: {failed_count}')
        print(f'   Remaining keys: {len(all_keys) - success_count}')
        
        return 0 if failed_count == 0 else 1
        
    except Exception as e:
        print(f'❌ Cleanup failed: {e}')
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(main())
