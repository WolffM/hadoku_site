#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Export and display current KV state in a readable format.
Shows boards and their tasks for each user key.
"""

import requests
import json
import os
import sys
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# Ensure UTF-8 encoding for output (fixes emoji display issues)
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

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
                    # Remove quotes if present
                    value = value.strip('"').strip("'")
                    config[key] = value
    
    return config

# Load config at module level
_config = load_config()
CLOUDFLARE_API_TOKEN = _config.get('CLOUDFLARE_API_TOKEN')
CLOUDFLARE_ACCOUNT_ID = _config.get('CLOUDFLARE_ACCOUNT_ID')
CLOUDFLARE_KV_NAMESPACE_ID = _config.get('CLOUDFLARE_NAMESPACE_ID')  # Note: using CLOUDFLARE_NAMESPACE_ID from .env

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
            print(f"Error: {data.get('errors')}")
            break
        
        result = data.get('result', [])
        all_keys.extend([k['name'] for k in result])
        
        result_info = data.get('result_info', {})
        cursor = result_info.get('cursor')
        
        if not cursor:
            break
    
    return all_keys

def get_value(key):
    """Get value for a specific key."""
    url = f"{CLOUDFLARE_API_BASE}/accounts/{CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/{CLOUDFLARE_KV_NAMESPACE_ID}/values/{key}"
    headers = {'Authorization': f'Bearer {CLOUDFLARE_API_TOKEN}'}
    
    response = requests.get(url, headers=headers)
    try:
        return response.json()
    except:
        return response.text

def determine_user_type(user_key):
    """Determine user type from environment configuration."""
    # Parse ADMIN_KEYS and FRIEND_KEYS from .env
    admin_keys_str = _config.get('ADMIN_KEYS', '{}')
    friend_keys_str = _config.get('FRIEND_KEYS', '{}')
    
    try:
        admin_keys = json.loads(admin_keys_str)
        friend_keys = json.loads(friend_keys_str)
        
        # Check if user_key is in admin or friend keys
        if user_key in admin_keys or user_key in admin_keys.values():
            return 'admin'
        elif user_key in friend_keys or user_key in friend_keys.values():
            return 'friend'
    except:
        pass
    
    return 'public'

def main():
    print("=" * 80)
    print("CURRENT KV STATE - BOARDS & TASKS SUMMARY")
    print("=" * 80)
    print()
    
    # Get all keys
    print("Fetching all keys...")
    all_keys = get_all_keys()
    
    # Filter to new schema keys only
    boards_keys = [k for k in all_keys if k.startswith('boards:') and k.count(':') == 1]
    tasks_keys = [k for k in all_keys if k.startswith('tasks:') and k.count(':') == 2]
    
    print(f"Found {len(boards_keys)} board keys (new schema)")
    print(f"Found {len(tasks_keys)} task keys (new schema)")
    print()
    
    # Group tasks by user key
    tasks_by_user = defaultdict(dict)
    for task_key in tasks_keys:
        parts = task_key.split(':')
        user_key = parts[1]
        board_id = parts[2]
        tasks_by_user[user_key][board_id] = task_key
    
    # Display each user's boards and tasks
    for board_key in sorted(boards_keys):
        user_key = board_key.split(':')[1]
        
        print("-" * 80)
        print(f"USER KEY: {user_key}")
        print("-" * 80)
        
        # Determine user type from auth configuration
        user_type = determine_user_type(user_key)
        
        # Get boards data
        boards_data = get_value(board_key)
        if isinstance(boards_data, dict) and 'boards' in boards_data:
            boards = boards_data['boards']
            
            print(f"User ID: {user_key}")
            print(f"User Type: {user_type}")
            print(f"Total Boards: {len(boards)}")
            print()
            
            for board in boards:
                board_id = board['id']
                board_name = board['name']
                tags = board.get('tags', [])
                
                print(f"  [INFO] Board: {board_name} (id: {board_id})")
                if tags:
                    print(f"     Tags: {', '.join(tags)}")
                
                # Get tasks for this board
                task_key = tasks_by_user.get(user_key, {}).get(board_id)
                if task_key:
                    tasks_data = get_value(task_key)
                    if isinstance(tasks_data, dict) and 'tasks' in tasks_data:
                        tasks = tasks_data['tasks']
                        active_tasks = [t for t in tasks if t.get('state') == 'Active']
                        
                        if active_tasks:
                            print(f"     Active Tasks: {len(active_tasks)}")
                            for task in active_tasks:
                                task_title = task.get('title', 'Untitled')
                                task_tag = task.get('tag')
                                tag_str = f" #{task_tag}" if task_tag else ""
                                print(f"       • {task_title}{tag_str}")
                        else:
                            print(f"     Active Tasks: 0")
                    else:
                        print(f"     [WARNING] Could not load tasks")
                else:
                    print(f"     Active Tasks: 0 (no task key)")
                
                print()
        else:
            print(f"[WARNING] Could not load boards data")
        
        print()
    
    print("=" * 80)
    print("END OF SUMMARY")
    print("=" * 80)

if __name__ == '__main__':
    main()
