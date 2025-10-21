#!/usr/bin/env python3
"""
Fetch all KV data for a specific user key in a compact view.
Shows boards, tasks, stats, and preferences for the user.
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

def get_all_keys():
    """Get all keys from KV namespace."""
    url = f"{CLOUDFLARE_API_BASE}/accounts/{CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/{CLOUDFLARE_KV_NAMESPACE_ID}/keys"
    headers = {'Authorization': f'Bearer {CLOUDFLARE_API_TOKEN}'}
    
    all_keys = []
    cursor = None
    
    while True:
        params = {'limit': 1000}
        if cursor:
            params['cursor'] = cursor
        
        response = requests.get(url, headers=headers, params=params)
        data = response.json()
        
        if not data.get('success'):
            break
        
        result = data.get('result', [])
        all_keys.extend([k['name'] for k in result])
        
        cursor = data.get('result_info', {}).get('cursor')
        if not cursor:
            break
    
    return all_keys

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

def determine_user_type(user_key):
    """Determine user type from environment configuration."""
    admin_keys_str = _config.get('ADMIN_KEYS', '{}')
    friend_keys_str = _config.get('FRIEND_KEYS', '{}')
    
    try:
        admin_keys = json.loads(admin_keys_str)
        friend_keys = json.loads(friend_keys_str)
        
        if user_key in admin_keys or user_key in admin_keys.values():
            return 'admin'
        elif user_key in friend_keys or user_key in friend_keys.values():
            return 'friend'
    except:
        pass
    
    return 'public'

def fetch_user_data(user_key):
    """Fetch all data for a specific user key."""
    print("=" * 80)
    print(f"KV DATA FOR USER KEY: {user_key}")
    print("=" * 80)
    print()
    
    user_type = determine_user_type(user_key)
    print(f"User Type: {user_type}")
    print()
    
    # Get all keys for this user
    all_keys = get_all_keys()
    user_keys = [k for k in all_keys if f':{user_key}' in k or k.endswith(f':{user_key}')]
    
    if not user_keys:
        print(f"❌ No keys found for user: {user_key}")
        return 1
    
    print(f"Found {len(user_keys)} keys")
    print()
    
    # Organize by type
    boards_key = f'boards:{user_key}'
    prefs_key = f'prefs:{user_key}'
    tasks_keys = [k for k in user_keys if k.startswith(f'tasks:{user_key}:')]
    stats_keys = [k for k in user_keys if k.startswith(f'stats:{user_key}:')]
    
    # Boards
    print("📋 BOARDS")
    print("-" * 80)
    boards_data = get_value(boards_key)
    if boards_data:
        boards = boards_data.get('boards', [])
        print(f"Total boards: {len(boards)}")
        for board in boards:
            print(f"  • {board['name']} (id: {board['id']})")
            if board.get('tags'):
                print(f"    Tags: {', '.join(board['tags'])}")
    else:
        print("  No boards data")
    print()
    
    # Tasks (for each board)
    print("✓ TASKS")
    print("-" * 80)
    if tasks_keys:
        for task_key in sorted(tasks_keys):
            board_id = task_key.split(':')[2]
            tasks_data = get_value(task_key)
            if tasks_data and isinstance(tasks_data, dict):
                tasks = tasks_data.get('tasks', [])
                active = [t for t in tasks if t.get('state') == 'Active']
                completed = [t for t in tasks if t.get('state') == 'Completed']
                print(f"  Board: {board_id}")
                print(f"    Active: {len(active)}, Completed: {len(completed)}")
                if active:
                    for task in active[:3]:  # Show first 3
                        print(f"      • {task.get('title', 'Untitled')}")
                    if len(active) > 3:
                        print(f"      ... and {len(active) - 3} more")
    else:
        print("  No tasks data")
    print()
    
    # Stats
    print("📊 STATS")
    print("-" * 80)
    if stats_keys:
        for stats_key in sorted(stats_keys):
            board_id = stats_key.split(':')[2]
            stats_data = get_value(stats_key)
            if stats_data and isinstance(stats_data, dict):
                counters = stats_data.get('counters', {})
                print(f"  Board: {board_id}")
                print(f"    Created: {counters.get('created', 0)}, " +
                      f"Completed: {counters.get('completed', 0)}, " +
                      f"Edited: {counters.get('edited', 0)}, " +
                      f"Deleted: {counters.get('deleted', 0)}")
    else:
        print("  No stats data")
    print()
    
    # Preferences
    print("⚙️  PREFERENCES")
    print("-" * 80)
    prefs_data = get_value(prefs_key)
    if prefs_data:
        print(f"  {json.dumps(prefs_data, indent=2)}")
    else:
        print("  No preferences data")
    print()
    
    print("=" * 80)
    return 0

def main(user_key):
    """Main entry point."""
    return fetch_user_data(user_key)

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print("Usage: python kv_fetch.py <user-key>")
        sys.exit(1)
    sys.exit(main(sys.argv[1]))
