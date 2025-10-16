#!/usr/bin/env python3
"""
Backup KV Namespace to JSON using Cloudflare API

Dumps all keys and values from TASKS_KV to a timestamped JSON file.
Uses Cloudflare API directly to avoid Wrangler CLI caching/consistency issues.

Usage:
    python scripts/backup-kv.py

Output:
    backups/tasks-kv-backup-TIMESTAMP.json

Requires:
    - CLOUDFLARE_API_TOKEN environment variable (or in .env file)
"""

import os
import sys
import json
import requests
from datetime import datetime
from pathlib import Path

# Configuration
KV_NAMESPACE_ID = '6cdcc2053b224eb1819a680be8342eb3'  # task-api-TASKS_KV
ACCOUNT_ID = 'cfd477d9f1d7ac75e31d4e53952020f2'
BACKUP_DIR = Path('backups')

def load_env():
    """Load API token from .env file if exists"""
    env_file = Path('.env')
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    if key == 'CLOUDFLARE_API_TOKEN':
                        return value
    return None

def list_keys(api_token):
    """List all keys in the KV namespace"""
    url = f'https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/storage/kv/namespaces/{KV_NAMESPACE_ID}/keys'
    headers = {
        'Authorization': f'Bearer {api_token}',
        'Content-Type': 'application/json'
    }
    
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
        
        result = data['result']
        all_keys.extend(result)
        
        # Check if there are more pages
        result_info = data.get('result_info', {})
        cursor = result_info.get('cursor')
        if not cursor:
            break
    
    return all_keys

def get_key_value(api_token, key_name):
    """Get the value for a specific key"""
    url = f'https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/storage/kv/namespaces/{KV_NAMESPACE_ID}/values/{key_name}'
    headers = {
        'Authorization': f'Bearer {api_token}'
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    # Try to parse as JSON, otherwise return as string
    content = response.text
    try:
        return json.loads(content)
    except:
        return content

def main():
    print('🔍 Starting KV backup (using Cloudflare API directly)...\n')
    
    # Get API token
    api_token = os.environ.get('CLOUDFLARE_API_TOKEN') or load_env()
    if not api_token:
        print('❌ Error: CLOUDFLARE_API_TOKEN not found in environment or .env file')
        print('\nPlease set the token:')
        print('  export CLOUDFLARE_API_TOKEN=your_token')
        print('  or add it to .env file')
        sys.exit(1)
    
    # Create backup directory
    BACKUP_DIR.mkdir(exist_ok=True)
    print(f'✅ Backup directory ready: {BACKUP_DIR}\n')
    
    # List all keys
    print('📋 Listing all KV keys...')
    try:
        keys = list_keys(api_token)
        print(f'✅ Found {len(keys)} keys\n')
        
        if len(keys) == 0:
            print('⚠️  No keys found in KV namespace. Backup not needed.')
            sys.exit(0)
        
        # Fetch all values
        print('📦 Fetching all key-value pairs...')
        backup_data = {}
        
        for i, key_info in enumerate(keys, 1):
            key_name = key_info['name']
            try:
                value = get_key_value(api_token, key_name)
                backup_data[key_name] = value
                print(f'\r   Progress: {i}/{len(keys)} keys', end='', flush=True)
            except Exception as e:
                print(f'\n❌ Failed to get key {key_name}: {e}')
        
        print('\n')
        
        # Save backup
        timestamp = datetime.now().isoformat().replace(':', '-').split('.')[0]
        backup_file = BACKUP_DIR / f'tasks-kv-backup-{timestamp}.json'
        
        print('💾 Writing backup to file...')
        backup_obj = {
            'timestamp': datetime.now().isoformat(),
            'namespace': 'TASKS_KV',
            'namespaceId': KV_NAMESPACE_ID,
            'accountId': ACCOUNT_ID,
            'keyCount': len(backup_data),
            'data': backup_data
        }
        
        with open(backup_file, 'w') as f:
            json.dump(backup_obj, f, indent=2)
        
        file_size_mb = backup_file.stat().st_size / (1024 * 1024)
        print(f'✅ Backup saved: {backup_file}')
        print(f'📊 Backup size: {file_size_mb:.2f} MB')
        print(f'📊 Total keys backed up: {len(backup_data)}')
        print('\n✨ Backup completed successfully!')
        
    except requests.exceptions.HTTPError as e:
        print(f'\n❌ API request failed: {e}')
        print(f'Response: {e.response.text}')
        sys.exit(1)
    except Exception as e:
        print(f'\n❌ Backup failed: {e}')
        sys.exit(1)

if __name__ == '__main__':
    main()
