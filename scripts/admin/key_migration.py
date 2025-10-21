#!/usr/bin/env python3
"""
Key Migration Module
Migrates data from one authentication key to another in Cloudflare KV

Complete flow:
1. Validate old key exists in KV
2. Validate new key exists in ADMIN_KEYS or FRIEND_KEYS
3. Migrate all data (boards, tasks, stats, prefs)
4. Offer to update .env and redeploy secrets
"""

import requests
import json
import os
import sys
import subprocess
from pathlib import Path

def load_env():
    """Load environment variables from .env file."""
    env_path = Path(__file__).parent.parent.parent / '.env'
    env = {}
    env_lines = []
    
    if env_path.exists():
        with open(env_path) as f:
            env_lines = f.readlines()
            for line in env_lines:
                stripped = line.strip()
                if stripped and not stripped.startswith('#') and '=' in stripped:
                    key, value = stripped.split('=', 1)
                    env[key.strip()] = value.strip().strip('"').strip("'")
    
    return env, env_lines, env_path

def check_key_in_auth_config(key: str, env: dict) -> tuple:
    """Check if key exists in ADMIN_KEYS or FRIEND_KEYS."""
    try:
        admin_keys = json.loads(env.get('ADMIN_KEYS', '{}'))
        friend_keys = json.loads(env.get('FRIEND_KEYS', '[]'))
        
        # Handle both object and array formats
        if isinstance(admin_keys, dict):
            if key in admin_keys or key in admin_keys.values():
                return True, 'admin'
        elif isinstance(admin_keys, list):
            if key in admin_keys:
                return True, 'admin'
        
        if isinstance(friend_keys, dict):
            if key in friend_keys or key in friend_keys.values():
                return True, 'friend'
        elif isinstance(friend_keys, list):
            if key in friend_keys:
                return True, 'friend'
        
        return False, None
    except:
        return False, None

def add_key_to_env(key: str, key_type: str, env_path: Path, env_lines: list) -> bool:
    """Add a new key to ADMIN_KEYS or FRIEND_KEYS in .env file."""
    try:
        new_lines = []
        key_added = False
        
        target_var = 'ADMIN_KEYS' if key_type == 'admin' else 'FRIEND_KEYS'
        
        for line in env_lines:
            if line.strip().startswith(f'{target_var}='):
                # Parse current value
                value_str = line.split('=', 1)[1].strip()
                current_keys = json.loads(value_str)
                
                # Add new key
                if isinstance(current_keys, list):
                    if key not in current_keys:
                        current_keys.append(key)
                        key_added = True
                elif isinstance(current_keys, dict):
                    if key not in current_keys and key not in current_keys.values():
                        # Add as key with key as value (placeholder)
                        current_keys[key] = key
                        key_added = True
                
                # Write updated line
                new_lines.append(f'{target_var}={json.dumps(current_keys)}\n')
            else:
                new_lines.append(line)
        
        if key_added:
            with open(env_path, 'w') as f:
                f.writelines(new_lines)
            return True
        
        return False
    except Exception as e:
        print(f"❌ Error updating .env: {e}")
        return False

def migrate_key(old_key: str, new_key: str):
    """
    Migrate all data from old_key to new_key.
    
    Complete flow with validation and optional redeployment.
    """
    print("=" * 80)
    print("KEY MIGRATION - Complete Flow")
    print("=" * 80)
    print(f"Old key: {old_key}")
    print(f"New key: {new_key}")
    print()
    
    env, env_lines, env_path = load_env()
    
    api_token = env.get('CLOUDFLARE_API_TOKEN')
    account_id = env.get('CLOUDFLARE_ACCOUNT_ID')
    namespace_id = env.get('CLOUDFLARE_NAMESPACE_ID')
    
    if not all([api_token, account_id, namespace_id]):
        print("❌ Error: Missing Cloudflare credentials in .env")
        return 1
    
    # Step 1: Validate old key exists in KV
    print("🔍 Step 1: Validating old key exists in KV...")
    base_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}"
    headers = {'Authorization': f'Bearer {api_token}'}
    
    # Check if old key has any data
    test_url = f"{base_url}/values/boards:{old_key}"
    response = requests.get(test_url, headers=headers)
    if response.status_code == 404:
        print(f"❌ Old key '{old_key}' has no data in KV")
        print(f"   Cannot migrate from a non-existent key")
        return 1
    print(f"✅ Old key exists in KV")
    print()
    
    # Step 2: Validate new key exists in auth configuration
    print("🔍 Step 2: Validating new key in authentication config...")
    key_exists, key_type = check_key_in_auth_config(new_key, env)
    
    if not key_exists:
        print(f"⚠️  New key '{new_key}' not found in ADMIN_KEYS or FRIEND_KEYS")
        print()
        response = input("Would you like to add it? (y/n): ").lower()
        
        if response == 'y':
            key_type_choice = input("Add as (a)dmin or (f)riend? ").lower()
            key_type = 'admin' if key_type_choice == 'a' else 'friend'
            
            print(f"Adding '{new_key}' to {key_type.upper()}_KEYS...")
            if add_key_to_env(new_key, key_type, env_path, env_lines):
                print(f"✅ Added to .env file")
                # Reload env
                env, env_lines, env_path = load_env()
            else:
                print("❌ Failed to add key to .env")
                return 1
        else:
            print("❌ Cannot migrate to a key that's not in auth config")
            return 1
    else:
        print(f"✅ New key exists in {key_type.upper()}_KEYS")
    print()
    
    # Step 3: Migrate data
    print("📦 Step 3: Migrating KV data...")
    
    base_url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}"
    headers = {'Authorization': f'Bearer {api_token}'}
    
    # Get all keys with old_key prefix
    old_prefixes = [
        f'boards:{old_key}',
        f'tasks:{old_key}:',
        f'stats:{old_key}:',
        f'prefs:{old_key}'
    ]
    
    migrated_count = 0
    
    for prefix in old_prefixes:
        print(f"\n🔍 Checking prefix: {prefix}")
        
        # List keys with this prefix
        list_url = f"{base_url}/keys?prefix={prefix}"
        response = requests.get(list_url, headers=headers)
        
        if not response.ok:
            print(f"❌ Error listing keys: {response.text}")
            continue
        
        keys = response.json().get('result', [])
        print(f"   Found {len(keys)} keys")
        
        for key_obj in keys:
            old_full_key = key_obj['name']
            
            # Generate new key name
            new_full_key = old_full_key.replace(f':{old_key}', f':{new_key}', 1)
            new_full_key = new_full_key.replace(f'{old_key}', f'{new_key}', 1)
            
            # Get value from old key
            get_url = f"{base_url}/values/{old_full_key}"
            response = requests.get(get_url, headers=headers)
            
            if not response.ok:
                print(f"   ⚠️  Failed to read {old_full_key}")
                continue
            
            value = response.text
            
            # Write value to new key
            put_url = f"{base_url}/values/{new_full_key}"
            response = requests.put(put_url, headers=headers, data=value)
            
            if response.ok:
                print(f"   ✅ {old_full_key} → {new_full_key}")
                migrated_count += 1
            else:
                print(f"   ❌ Failed to write {new_full_key}")
    
    print(f"\n✅ Migration complete: {migrated_count} keys migrated")
    print()
    
    # Step 4: Ask about GitHub secrets redeployment
    print("=" * 80)
    print("🔐 Step 4: GitHub Secrets Update")
    print("=" * 80)
    print("The new key has been added to your local .env file.")
    print("To make it active in production, you need to update GitHub secrets.")
    print()
    
    response = input("Would you like to redeploy secrets to GitHub now? (y/n): ").lower()
    
    if response == 'y':
        print("\n🚀 Redeploying secrets to GitHub...")
        script_path = Path(__file__).parent / 'manage_github_token.py'
        
        # Determine which mode based on key type
        mode = 'cloudflare'  # Always use cloudflare mode as it updates all keys
        
        result = subprocess.run([sys.executable, str(script_path), f'--mode={mode}'])
        
        if result.returncode == 0:
            print("\n✅ GitHub secrets updated successfully!")
        else:
            print("\n⚠️  GitHub secrets update had issues. You may need to run manually:")
            print(f"   python scripts/administration.py github-secrets cloudflare")
    else:
        print("\n⚠️  Skipping GitHub secrets update.")
        print("   Remember to update secrets manually before the new key will work:")
        print("   python scripts/administration.py github-secrets cloudflare")
    
    print()
    print("=" * 80)
    print("📋 Migration Summary")
    print("=" * 80)
    print(f"✅ Migrated {migrated_count} keys from '{old_key}' to '{new_key}'")
    print(f"✅ New key added to {key_type.upper()}_KEYS in .env")
    print(f"⚠️  Old keys still exist in KV (verify new key works, then delete old)")
    print()
    print("Next steps:")
    print("1. Test the new key by authenticating with it")
    print("2. Verify all data is accessible")
    print("3. Delete old keys if everything works:")
    print(f"   - Use kv-cleanup or delete manually")
    print("4. Remove old key from .env ADMIN_KEYS/FRIEND_KEYS")
    print("5. Redeploy secrets again to remove old key from GitHub")
    print("=" * 80)
    
    return 0
