#!/usr/bin/env python3
"""
Cloudflare KV Inspector

This script fetches and displays the current state of your Cloudflare KV namespace
using the Cloudflare API. It helps you inspect data stored in your task API KV store.

Usage:
    python inspect_kv.py                    # List all keys
    python inspect_kv.py --key boards:4355  # Get specific key value
    python inspect_kv.py --prefix boards:   # List keys with prefix
    python inspect_kv.py --export           # Export all data to JSON file

Prerequisites:
    pip install requests
"""

import sys
import json
import requests
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional

# Configuration
CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4"

class CloudflareKVInspector:
    def __init__(self, api_token: str, account_id: str, namespace_id: str):
        self.api_token = api_token
        self.account_id = account_id
        self.namespace_id = namespace_id
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        })
    
    def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Make a request to the Cloudflare API."""
        url = f"{CLOUDFLARE_API_BASE}{endpoint}"
        response = self.session.request(method, url, **kwargs)

        if response.status_code != 200:
            print(f"[ERROR] API Error: {response.status_code}")
            print(f"Response: {response.text}")
            sys.exit(1)

        data = response.json()
        if not data.get('success'):
            print(f"[ERROR] API Error: {data.get('errors', 'Unknown error')}")
            sys.exit(1)
        
        return data
    
    def list_keys(self, prefix: Optional[str] = None, limit: int = 1000) -> List[Dict[str, Any]]:
        """List all keys in the KV namespace."""
        endpoint = f"/accounts/{self.account_id}/storage/kv/namespaces/{self.namespace_id}/keys"
        params = {'limit': limit}
        
        if prefix:
            params['prefix'] = prefix

        print(f"[INFO] Listing KV keys{f' with prefix: {prefix}' if prefix else ''}...")
        
        all_keys = []
        cursor = None
        
        while True:
            if cursor:
                params['cursor'] = cursor
            
            data = self._make_request('GET', endpoint, params=params)
            keys = data['result']
            all_keys.extend(keys)
            
            # Check if there are more results
            cursor = data.get('result_info', {}).get('cursor')
            if not cursor:
                break

        print(f"[SUCCESS] Found {len(all_keys)} keys")
        return all_keys
    
    def get_key_value(self, key: str) -> Optional[str]:
        """Get the value for a specific key."""
        endpoint = f"/accounts/{self.account_id}/storage/kv/namespaces/{self.namespace_id}/values/{key}"
        url = f"{CLOUDFLARE_API_BASE}{endpoint}"

        try:
            response = self.session.get(url)

            if response.status_code == 404:
                return None

            if response.status_code != 200:
                print(f"[ERROR] API Error: {response.status_code}")
                print(f"Response: {response.text}")
                return None

            # The values endpoint returns raw value, not JSON wrapped
            return response.text
        except Exception as e:
            print(f"[ERROR] Could not retrieve value for key: {key} - {e}")
            return None

    def delete_key(self, key: str) -> bool:
        """Delete a specific key from the KV namespace."""
        endpoint = f"/accounts/{self.account_id}/storage/kv/namespaces/{self.namespace_id}/values/{key}"

        try:
            data = self._make_request('DELETE', endpoint)
            return True
        except Exception as e:
            print(f"[ERROR] Could not delete key: {key} - {e}")
            return False
    
    def inspect_key(self, key: str) -> None:
        """Inspect a specific key and its value."""
        print(f"\n[INFO] Inspecting key: {key}")
        print("=" * 60)

        value = self.get_key_value(key)
        if value is None:
            print("[ERROR] Key not found or could not retrieve value")
            return

        # Try to parse as JSON for pretty printing
        try:
            json_data = json.loads(value)
            print("[INFO] Value (JSON):")
            print(json.dumps(json_data, indent=2))

            # Show some stats if it's a known structure
            if isinstance(json_data, dict):
                if 'boards' in json_data:
                    boards = json_data['boards']
                    print(f"\n[INFO] Boards Summary: {len(boards)} boards")
                    for board in boards:
                        task_count = len(board.get('tasks', []))
                        print(f"  • {board.get('name', board.get('id', 'Unknown'))}: {task_count} tasks")


                elif 'tasks' in json_data:
                    tasks = json_data['tasks']
                    print(f"\n[INFO] Tasks Summary: {len(tasks)} tasks")
                    active = sum(1 for t in tasks if t.get('state') == 'Active')
                    completed = sum(1 for t in tasks if t.get('state') == 'Completed')
                    print(f"  • Active: {active}")
                    print(f"  • Completed: {completed}")

                elif 'counters' in json_data:
                    counters = json_data['counters']
                    print(f"\n[INFO] Stats Summary:")
                    for key, value in counters.items():
                        print(f"  • {key}: {value}")

        except json.JSONDecodeError:
            print("[INFO] Value (Raw):")
            print(value)
        
        print("\n" + "=" * 60)
    
    def export_all_data(self, output_file: str = None) -> None:
        """Export all KV data to a JSON file."""
        if not output_file:
            timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            output_file = f"kv-export-{timestamp}.json"

        print(f"[INFO] Exporting all KV data to: {output_file}")

        keys = self.list_keys()
        export_data = {
            'metadata': {
                'exported_at': datetime.now().isoformat(),
                'namespace_id': self.namespace_id,
                'total_keys': len(keys)
            },
            'data': {}
        }

        print("[INFO] Fetching values for all keys...")
        for i, key_info in enumerate(keys):
            key_name = key_info['name']
            print(f"  [{i+1}/{len(keys)}] {key_name}")
            
            value = self.get_key_value(key_name)
            if value:
                try:
                    # Try to parse as JSON
                    export_data['data'][key_name] = json.loads(value)
                except json.JSONDecodeError:
                    # Store as raw string if not JSON
                    export_data['data'][key_name] = value
        
        # Write to file
        with open(output_file, 'w') as f:
            json.dump(export_data, f, indent=2)

        print(f"[SUCCESS] Export complete: {output_file}")
        print(f"[INFO] Exported {len(export_data['data'])} keys")
    
    def show_summary(self) -> None:
        """Show a summary of the KV namespace."""
        print("[INFO] Cloudflare KV Namespace Summary")
        print("=" * 50)

        keys = self.list_keys()

        # Categorize keys
        categories = {
            'boards': [],
            'tasks': [],
            'prefs': [],
            'session-info': [],
            'session-map': [],
            'other': []
        }

        for key_info in keys:
            key_name = key_info['name']

            if key_name.startswith('boards:'):
                categories['boards'].append(key_name)
            elif key_name.startswith('tasks:'):
                categories['tasks'].append(key_name)
            elif key_name.startswith('prefs:'):
                categories['prefs'].append(key_name)
            elif key_name.startswith('session-info:'):
                categories['session-info'].append(key_name)
            elif key_name.startswith('session-map:'):
                categories['session-map'].append(key_name)
            else:
                categories['other'].append(key_name)

        # Display summary
        print(f"[INFO] Total Keys: {len(keys)}")
        print()

        for category, key_list in categories.items():
            if key_list:
                print(f"[INFO] {category.upper()}: {len(key_list)} keys")
                if category in ['boards', 'tasks', 'prefs']:
                    # Show unique users/keys
                    users = set()
                    for key in key_list:
                        parts = key.split(':')
                        if len(parts) >= 2:
                            users.add(parts[1])  # The user key/identifier
                    print(f"   [INFO] Unique users: {len(users)}")
                    if len(users) <= 10:  # Only show if not too many
                        for user in sorted(users):
                            user_keys = [k for k in key_list if f':{user}:' in k or k.endswith(f':{user}')]
                            print(f"      • {user}: {len(user_keys)} keys")
                print()

def load_config() -> Dict[str, str]:
    """Load configuration from .env file."""
    env_path = Path(__file__).parent.parent.parent / '.env'
    config = {}
    
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    value = value.strip('"').strip("'")
                    config[key.strip()] = value
    
    return config

def main():
    parser = argparse.ArgumentParser(description='Inspect Cloudflare KV namespace')
    parser.add_argument('--key', help='Get value for specific key')
    parser.add_argument('--prefix', help='List keys with specific prefix')
    parser.add_argument('--export', action='store_true', help='Export all data to JSON file')
    parser.add_argument('--output', help='Output file for export (default: auto-generated)')
    parser.add_argument('--api-token', help='Cloudflare API token (or set CLOUDFLARE_API_TOKEN env var)')
    parser.add_argument('--account-id', help='Cloudflare Account ID')
    parser.add_argument('--namespace-id', help='KV Namespace ID')
    
    args = parser.parse_args()
    
    # Load configuration
    config = load_config()
    
    # Get credentials
    api_token = args.api_token or config.get('CLOUDFLARE_API_TOKEN')
    account_id = args.account_id or config.get('CLOUDFLARE_ACCOUNT_ID')
    namespace_id = args.namespace_id or config.get('CLOUDFLARE_NAMESPACE_ID')

    if not api_token:
        print("[ERROR] Error: CLOUDFLARE_API_TOKEN not found")
        print("Set it in .env file or use --api-token parameter")
        sys.exit(1)

    if not account_id:
        print("[ERROR] Error: CLOUDFLARE_ACCOUNT_ID not found")
        print("You can find it in your Cloudflare dashboard")
        sys.exit(1)

    if not namespace_id:
        print("[ERROR] Error: CLOUDFLARE_NAMESPACE_ID not found")
        print("You can find it in your Workers KV dashboard")
        sys.exit(1)
    
    # Create inspector
    inspector = CloudflareKVInspector(api_token, account_id, namespace_id)
    
    try:
        if args.key:
            # Inspect specific key
            inspector.inspect_key(args.key)
        elif args.export:
            # Export all data
            inspector.export_all_data(args.output)
        elif args.prefix:
            # List keys with prefix
            keys = inspector.list_keys(prefix=args.prefix)
            print(f"\n[INFO] Keys with prefix '{args.prefix}':")
            for key_info in keys:
                print(f"  • {key_info['name']}")
        else:
            # Show summary
            inspector.show_summary()

    except KeyboardInterrupt:
        print("\n[WARNING] Operation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()