#!/usr/bin/env python3
"""KV Restore Script"""
import requests, json, os, sys
from pathlib import Path

def load_config():
    env_path = Path(__file__).parent.parent / '.env'
    config = {'CLOUDFLARE_API_TOKEN': os.environ.get('CLOUDFLARE_API_TOKEN'),
              'CLOUDFLARE_ACCOUNT_ID': os.environ.get('CLOUDFLARE_ACCOUNT_ID'),
              'CLOUDFLARE_NAMESPACE_ID': os.environ.get('CLOUDFLARE_NAMESPACE_ID')}
    if not all(config.values()) and env_path.exists():
        with open(env_path) as f:
            for line in f:
                if '=' in line and not line.strip().startswith('#'):
                    k, v = line.split('=', 1)
                    k, v = k.strip(), v.strip().strip('"').strip("'")
                    if k in config and not config[k]: config[k] = v
    return config

def main(backup_file):
    print(f"Restoring from: {backup_file}")
    cfg = load_config()
    if not all([cfg['CLOUDFLARE_API_TOKEN'], cfg['CLOUDFLARE_ACCOUNT_ID'], cfg['CLOUDFLARE_NAMESPACE_ID']]):
        print("Error: Missing credentials"); return 1
    
    with open(backup_file) as f: data = json.load(f)
    keys = data['keys']
    print(f"Restoring {len(keys)} keys...")
    
    headers = {'Authorization': f'Bearer {cfg['CLOUDFLARE_API_TOKEN']}'}
    for i, (key, value) in enumerate(keys.items(), 1):
        url = f"https://api.cloudflare.com/client/v4/accounts/{cfg['CLOUDFLARE_ACCOUNT_ID']}/storage/kv/namespaces/{cfg['CLOUDFLARE_NAMESPACE_ID']}/values/{key}"
        val_str = json.dumps(value) if isinstance(value, (dict, list)) else str(value)
        r = requests.put(url, headers=headers, data=val_str.encode('utf-8'))
        print(f"Progress: {i}/{len(keys)}", end='\r')
    
    print(f"\nRestore complete: {len(keys)} keys")
    return 0

if __name__ == '__main__':
    if len(sys.argv) < 2: print("Usage: python restore-kv.py <backup-file>"); sys.exit(1)
    sys.exit(main(sys.argv[1]))
