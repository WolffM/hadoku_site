#!/usr/bin/env python3
"""
Update userId in KV data for a specific user key.

This updates the userId field in boards data and can be used to normalize
cases where the key equals the ID (setting ID to 'user' by default).
"""

import requests
import json
import os
from pathlib import Path

CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4"

def load_config():
    """Load configuration from .env file."""
    env_path = Path(__file__).parent.parent.parent / '.env'
    config = {}
    
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    value = value.strip('"').strip("'")
                    config[key] = value
    
    return config

_config = load_config()
CLOUDFLARE_API_TOKEN = _config.get('CLOUDFLARE_API_TOKEN')
CLOUDFLARE_ACCOUNT_ID = _config.get('CLOUDFLARE_ACCOUNT_ID')
CLOUDFLARE_KV_NAMESPACE_ID = _config.get('CLOUDFLARE_NAMESPACE_ID')

def get_value(key):
    """Get value for a specific key."""
    url = f"{CLOUDFLARE_API_BASE}/accounts/{CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/{CLOUDFLARE_KV_NAMESPACE_ID}/values/{key}"
    headers = {'Authorization': f'Bearer {CLOUDFLARE_API_TOKEN}'}
    
    response = requests.get(url, headers=headers)
    if response.status_code == 404:
        return None
    try:
        return response.json()
    except:
        return response.text

def put_value(key, value):
    """Put value for a specific key."""
    url = f"{CLOUDFLARE_API_BASE}/accounts/{CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/{CLOUDFLARE_KV_NAMESPACE_ID}/values/{key}"
    headers = {'Authorization': f'Bearer {CLOUDFLARE_API_TOKEN}'}
    
    value_str = json.dumps(value) if isinstance(value, (dict, list)) else str(value)
    response = requests.put(url, headers=headers, data=value_str.encode('utf-8'))
    response.raise_for_status()
    return True

def update_user_id(user_key, new_user_id):
    """Update userId in boards data for a user key."""
    print("=" * 80)
    print(f"UPDATING USER ID FOR KEY: {user_key}")
    print("=" * 80)
    print()
    
    boards_key = f'boards:{user_key}'
    
    # Get current boards data
    print(f"[INFO] Fetching boards data: {boards_key}")
    boards_data = get_value(boards_key)

    if not boards_data:
        print(f"[ERROR] No boards data found for key: {user_key}")
        return 1

    if not isinstance(boards_data, dict):
        print(f"[ERROR] Invalid boards data format")
        return 1

    # Check current userId
    current_user_id = boards_data.get('userId', 'N/A')
    print(f"Current userId: {current_user_id}")
    print(f"New userId: {new_user_id}")
    print()

    if current_user_id == new_user_id:
        print(f"[SUCCESS] userId is already set to '{new_user_id}' - no update needed")
        return 0

    # Confirm update
    print(f"[WARNING] This will update the userId in boards data")
    confirm = input(f"Type 'UPDATE' to confirm: ")

    if confirm != 'UPDATE':
        print("[ERROR] Operation cancelled")
        return 1

    # Update userId
    boards_data['userId'] = new_user_id

    # Save back to KV
    print(f"\n[INFO] Saving updated boards data...")
    try:
        put_value(boards_key, boards_data)
        print(f"[SUCCESS] Successfully updated userId from '{current_user_id}' to '{new_user_id}'")
        return 0
    except Exception as e:
        print(f"[ERROR] Failed to save: {e}")
        return 1

def main(user_key, new_user_id):
    """Main entry point."""
    return update_user_id(user_key, new_user_id)

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 3:
        print("Usage: python kv_userId_update.py <user-key> <new-user-id>")
        print()
        print("Examples:")
        print("  python kv_userId_update.py X3vP9aLzR2tQ8nBw user")
        print("  python kv_userId_update.py 4355 user")
        sys.exit(1)
    sys.exit(main(sys.argv[1], sys.argv[2]))
