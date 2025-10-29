#!/usr/bin/env python3
"""
Enhanced KV Backup and Restore System
=====================================

This script provides comprehensive backup/restore functionality for Cloudflare KV:

1. backup-to-file: Download production KV to local JSON file
2. backup-to-kv: Upload local backup to backup KV namespace  
3. validate-backup: Compare production vs backup KV
4. restore-from-backup: Restore production from backup KV
5. flush: Delete all keys from production KV
6. full-backup: Complete backup (file + clear + upload + validate)
7. fast-backup: Quick backup (file only, for CI/automation)

Environment Variables Required:
- CLOUDFLARE_API_TOKEN: Cloudflare API token with KV permissions
- CLOUDFLARE_ACCOUNT_ID: Cloudflare account ID
- CLOUDFLARE_NAMESPACE_ID: Production KV namespace ID
- CLOUDFLARE_BACKUP_NAMESPACE_ID: Backup KV namespace ID (optional, defaults to preview)
"""

import requests
import json
import os
import sys
import time
from pathlib import Path
from datetime import datetime
import time

def load_config():
    """Load configuration from environment and .env file."""
    env_path = Path(__file__).parent.parent / '.env'
    
    config = {
        'CLOUDFLARE_API_TOKEN': os.environ.get('CLOUDFLARE_API_TOKEN'),
        'CLOUDFLARE_ACCOUNT_ID': os.environ.get('CLOUDFLARE_ACCOUNT_ID'),
        'CLOUDFLARE_NAMESPACE_ID': os.environ.get('CLOUDFLARE_NAMESPACE_ID'),
        'CLOUDFLARE_BACKUP_NAMESPACE_ID': os.environ.get('CLOUDFLARE_BACKUP_NAMESPACE_ID', '3fb96829c28b497a9101dd554c97fdec')  # Default to preview
    }
    
    # Load from .env file if environment variables are missing
    if not all([config['CLOUDFLARE_API_TOKEN'], config['CLOUDFLARE_ACCOUNT_ID'], config['CLOUDFLARE_NAMESPACE_ID']]) and env_path.exists():
        with open(env_path) as f:
            for line in f:
                if '=' in line and not line.strip().startswith('#'):
                    k, v = line.split('=', 1)
                    k, v = k.strip(), v.strip().strip('"').strip("'")
                    if k in config and not config[k]:
                        config[k] = v
    
    return config

def get_kv_keys(config, namespace_id):
    """Get all keys from a KV namespace."""
    url = f"https://api.cloudflare.com/client/v4/accounts/{config['CLOUDFLARE_ACCOUNT_ID']}/storage/kv/namespaces/{namespace_id}/keys"
    headers = {'Authorization': f'Bearer {config["CLOUDFLARE_API_TOKEN"]}'}
    
    all_keys = []
    cursor = None
    
    while True:
        params = {'limit': 1000}
        if cursor:
            params['cursor'] = cursor
        
        response = requests.get(url, headers=headers, params=params)
        if response.status_code != 200:
            print(f"❌ Error fetching keys: {response.status_code} {response.text}")
            return None
        
        data = response.json()
        batch_keys = [k['name'] for k in data.get('result', [])]
        all_keys.extend(batch_keys)
        
        cursor = data.get('result_info', {}).get('cursor')
        if not cursor:
            break
    
    return all_keys

def get_kv_values(config, namespace_id, keys):
    """Get values for all keys from KV namespace."""
    base_url = f"https://api.cloudflare.com/client/v4/accounts/{config['CLOUDFLARE_ACCOUNT_ID']}/storage/kv/namespaces/{namespace_id}/values"
    headers = {'Authorization': f'Bearer {config["CLOUDFLARE_API_TOKEN"]}'}
    
    values = {}
    total = len(keys)
    
    for i, key in enumerate(keys):
        url = f"{base_url}/{key}"
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            try:
                values[key] = response.json()
            except:
                values[key] = response.text
        else:
            print(f"⚠️ Failed to get value for key {key}: {response.status_code}")
            values[key] = None
        
        if (i + 1) % 10 == 0 or i == total - 1:
            print(f"Progress: {i + 1}/{total}")
        
        # Minimal rate limiting for GET requests too
        if i % 50 == 0:
            time.sleep(0.05)
    
    return values

def put_kv_values(config, namespace_id, data):
    """Put values into KV namespace."""
    base_url = f"https://api.cloudflare.com/client/v4/accounts/{config['CLOUDFLARE_ACCOUNT_ID']}/storage/kv/namespaces/{namespace_id}/values"
    headers = {'Authorization': f'Bearer {config["CLOUDFLARE_API_TOKEN"]}'}
    
    total = len(data)
    success_count = 0
    
    for i, (key, value) in enumerate(data.items()):
        url = f"{base_url}/{key}"
        
        if isinstance(value, (dict, list)):
            response = requests.put(url, headers={**headers, 'Content-Type': 'application/json'}, json=value)
        else:
            response = requests.put(url, headers=headers, data=str(value))
        
        if response.status_code in [200, 201]:
            success_count += 1
        else:
            print(f"⚠️ Failed to put key {key}: {response.status_code}")
        
        if (i + 1) % 10 == 0 or i == total - 1:
            print(f"Upload progress: {i + 1}/{total} ({success_count} successful)")
        
        # Minimal rate limiting - Cloudflare can handle more
        if i % 50 == 0:  # Only sleep every 50 requests
            time.sleep(0.05)
    
    return success_count

def backup_to_file(config):
    """Backup production KV to local JSON file."""
    print("📦 Starting KV backup to file...")
    
    # Get all keys
    keys = get_kv_keys(config, config['CLOUDFLARE_NAMESPACE_ID'])
    if keys is None:
        return 1
    
    print(f"✅ Found {len(keys)} keys")
    
    # Get all values
    values = get_kv_values(config, config['CLOUDFLARE_NAMESPACE_ID'], keys)
    
    # Create backup data
    backup_data = {
        'timestamp': datetime.now().isoformat() + 'Z',
        'namespace_id': config['CLOUDFLARE_NAMESPACE_ID'],
        'total_keys': len(keys),
        'keys': values
    }
    
    # Save to file
    backup_dir = Path(__file__).parent / 'backups'
    backup_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y-%m-%dT%H-%M-%S')
    backup_file = backup_dir / f'tasks-kv-backup-{timestamp}.json'
    
    with open(backup_file, 'w') as f:
        json.dump(backup_data, f, indent=2)
    
    print(f"✅ Backup saved: {backup_file}")
    print(f"📊 Total keys: {len(keys)}")
    return str(backup_file)

def backup_to_kv(config, backup_file=None):
    """Upload backup to backup KV namespace."""
    if backup_file:
        print(f"📤 Uploading backup file {backup_file} to backup KV...")
        with open(backup_file) as f:
            backup_data = json.load(f)
        data_to_upload = backup_data['keys']
    else:
        print("📤 Creating fresh backup and uploading to backup KV...")
        # Get fresh data from production
        keys = get_kv_keys(config, config['CLOUDFLARE_NAMESPACE_ID'])
        if keys is None:
            return 1
        data_to_upload = get_kv_values(config, config['CLOUDFLARE_NAMESPACE_ID'], keys)
    
    # Upload to backup namespace
    success_count = put_kv_values(config, config['CLOUDFLARE_BACKUP_NAMESPACE_ID'], data_to_upload)
    
    print(f"✅ Uploaded {success_count}/{len(data_to_upload)} keys to backup KV")
    return 0 if success_count == len(data_to_upload) else 1

def validate_backup(config):
    """Compare production vs backup KV."""
    print("🔍 Validating backup against production...")
    
    # Get production keys
    prod_keys = get_kv_keys(config, config['CLOUDFLARE_NAMESPACE_ID'])
    if prod_keys is None:
        return 1
    
    # Get backup keys  
    backup_keys = get_kv_keys(config, config['CLOUDFLARE_BACKUP_NAMESPACE_ID'])
    if backup_keys is None:
        return 1
    
    prod_set = set(prod_keys)
    backup_set = set(backup_keys)
    
    print(f"📊 Production keys: {len(prod_keys)}")
    print(f"📊 Backup keys: {len(backup_keys)}")
    
    missing_in_backup = prod_set - backup_set
    extra_in_backup = backup_set - prod_set
    
    if missing_in_backup:
        print(f"⚠️ Keys missing in backup: {len(missing_in_backup)}")
        for key in list(missing_in_backup)[:5]:
            print(f"  - {key}")
        if len(missing_in_backup) > 5:
            print(f"  ... and {len(missing_in_backup) - 5} more")
    
    if extra_in_backup:
        print(f"ℹ️ Extra keys in backup: {len(extra_in_backup)}")
        for key in list(extra_in_backup)[:5]:
            print(f"  - {key}")
        if len(extra_in_backup) > 5:
            print(f"  ... and {len(extra_in_backup) - 5} more")
    
    if not missing_in_backup and not extra_in_backup:
        print("✅ Backup validation successful - all keys match!")
        return 0
    else:
        print("⚠️ Backup validation found differences")
        return 1

def flush_namespace(config, namespace_id, confirm=False):
    """Delete all keys from a namespace."""
    if not confirm:
        print("⚠️ This will delete ALL data from the namespace!")
        print(f"Namespace ID: {namespace_id}")
        response = input("Type 'DELETE' to confirm: ")
        if response != 'DELETE':
            print("❌ Operation cancelled")
            return 1
    
    print(f"🗑️ Flushing namespace {namespace_id}...")
    
    # Get all keys
    keys = get_kv_keys(config, namespace_id)
    if keys is None:
        return 1
    
    print(f"Found {len(keys)} keys to delete")
    
    # Delete in batches
    base_url = f"https://api.cloudflare.com/client/v4/accounts/{config['CLOUDFLARE_ACCOUNT_ID']}/storage/kv/namespaces/{namespace_id}/bulk"
    headers = {'Authorization': f'Bearer {config["CLOUDFLARE_API_TOKEN"]}', 'Content-Type': 'application/json'}
    
    batch_size = 10000  # Cloudflare's limit
    deleted_count = 0
    
    for i in range(0, len(keys), batch_size):
        batch = keys[i:i + batch_size]
        response = requests.delete(base_url, headers=headers, json=batch)
        
        if response.status_code == 200:
            deleted_count += len(batch)
            print(f"Deleted batch: {deleted_count}/{len(keys)}")
        else:
            print(f"❌ Failed to delete batch: {response.status_code}")
            return 1
    
    print(f"✅ Deleted {deleted_count} keys")
    return 0

def restore_from_backup(config, source='kv'):
    """Restore production from backup."""
    print("🔄 Starting restore process...")
    
    if source == 'kv':
        print("📥 Loading data from backup KV...")
        keys = get_kv_keys(config, config['CLOUDFLARE_BACKUP_NAMESPACE_ID'])
        if keys is None:
            return 1
        data_to_restore = get_kv_values(config, config['CLOUDFLARE_BACKUP_NAMESPACE_ID'], keys)
    else:
        print(f"📥 Loading data from backup file: {source}")
        with open(source) as f:
            backup_data = json.load(f)
        data_to_restore = backup_data['keys']
    
    print(f"Found {len(data_to_restore)} keys to restore")
    
    # Confirm before flushing production
    print("⚠️ This will FLUSH production KV and restore from backup!")
    response = input("Type 'RESTORE' to confirm: ")
    if response != 'RESTORE':
        print("❌ Operation cancelled")
        return 1
    
    # Flush production
    if flush_namespace(config, config['CLOUDFLARE_NAMESPACE_ID'], confirm=True) != 0:
        print("❌ Failed to flush production namespace")
        return 1
    
    # Upload backup data to production
    success_count = put_kv_values(config, config['CLOUDFLARE_NAMESPACE_ID'], data_to_restore)
    
    print(f"✅ Restored {success_count}/{len(data_to_restore)} keys to production")
    return 0 if success_count == len(data_to_restore) else 1

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    
    command = sys.argv[1]
    config = load_config()
    
    # Validate configuration
    required_keys = ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_NAMESPACE_ID']
    missing = [k for k in required_keys if not config[k]]
    if missing:
        print(f"❌ Missing required configuration: {', '.join(missing)}")
        return 1
    
    print(f"🎯 Production Namespace: {config['CLOUDFLARE_NAMESPACE_ID']}")
    print(f"🎯 Backup Namespace: {config['CLOUDFLARE_BACKUP_NAMESPACE_ID']}")
    print()
    
    if command == 'backup-to-file':
        return 0 if backup_to_file(config) else 1
    
    elif command == 'backup-to-kv':
        backup_file = sys.argv[2] if len(sys.argv) > 2 else None
        return backup_to_kv(config, backup_file)
    
    elif command == 'validate-backup':
        return validate_backup(config)
    
    elif command == 'restore-from-backup':
        source = sys.argv[2] if len(sys.argv) > 2 else 'kv'
        return restore_from_backup(config, source)
    
    elif command == 'flush':
        # Flush production namespace
        force = '--force' in sys.argv
        return flush_namespace(config, config['CLOUDFLARE_NAMESPACE_ID'], confirm=force)
    
    elif command == 'full-backup':
        print("🚀 Starting full backup process...")
        
        # Step 1: Backup to file
        backup_file = backup_to_file(config)
        if not backup_file:
            return 1
        
        # Step 2: Clear backup KV for clean validation
        print("🧹 Clearing backup KV for clean validation...")
        if flush_namespace(config, config['CLOUDFLARE_BACKUP_NAMESPACE_ID'], confirm=True) != 0:
            print("⚠️ Failed to clear backup KV, continuing anyway...")
        
        # Step 3: Upload to backup KV
        if backup_to_kv(config, backup_file) != 0:
            return 1
        
        # Step 4: Validate
        if validate_backup(config) != 0:
            print("⚠️ Validation failed but backup files created")
            return 1
        
        print("✅ Full backup process completed successfully!")
        return 0
    
    elif command == 'fast-backup':
        print("⚡ Starting fast backup (file only)...")
        
        # Just backup to file, skip KV upload and validation for speed
        backup_file = backup_to_file(config)
        if not backup_file:
            return 1
        
        print("✅ Fast backup completed successfully!")
        return 0
    
    else:
        print(f"❌ Unknown command: {command}")
        print(__doc__)
        return 1

if __name__ == '__main__':
    sys.exit(main())