#!/usr/bin/env python3
"""KV Flush Script"""
import requests, os, sys
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

def main():
    print("WARNING: This will delete ALL keys from KV!")
    cfg = load_config()
    if not all([cfg['CLOUDFLARE_API_TOKEN'], cfg['CLOUDFLARE_ACCOUNT_ID'], cfg['CLOUDFLARE_NAMESPACE_ID']]):
        print("Error: Missing credentials"); return 1
    
    url = f"https://api.cloudflare.com/client/v4/accounts/{cfg['CLOUDFLARE_ACCOUNT_ID']}/storage/kv/namespaces/{cfg['CLOUDFLARE_NAMESPACE_ID']}/keys"
    headers = {'Authorization': f'Bearer {cfg['CLOUDFLARE_API_TOKEN']}'}
    
    all_keys, cursor = [], None
    while True:
        params = {'limit': 1000}
        if cursor: params['cursor'] = cursor
        r = requests.get(url, headers=headers, params=params)
        if r.status_code != 200: print(f"Error: {r.status_code}"); return 1
        data = r.json()
        all_keys.extend([k['name'] for k in data.get('result', [])])
        cursor = data.get('result_info', {}).get('cursor')
        if not cursor: break
    
    print(f"Found {len(all_keys)} keys to delete")
    if not all_keys: print("Nothing to delete"); return 0
    
    if os.environ.get('FLUSH_CONFIRM') != 'yes':
        confirm = input('Type "FLUSH" to confirm deletion: ')
        if confirm != 'FLUSH': print("Cancelled"); return 1
    
    for i, key in enumerate(all_keys, 1):
        delete_url = f"https://api.cloudflare.com/client/v4/accounts/{cfg['CLOUDFLARE_ACCOUNT_ID']}/storage/kv/namespaces/{cfg['CLOUDFLARE_NAMESPACE_ID']}/values/{key}"
        requests.delete(delete_url, headers=headers)
        print(f"Progress: {i}/{len(all_keys)}", end='\r')
    
    print(f"\nFlush complete: {len(all_keys)} keys deleted")
    return 0

if __name__ == '__main__':
    sys.exit(main())
