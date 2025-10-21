#!/usr/bin/env python3
"""
Analyze KV keys and identify outdated/invalid patterns

Current schema (v3.0+):
- boards:{userId}                 # All boards for a user
- tasks:{userId}:{boardId}        # All tasks for a specific board
- stats:{userId}:{boardId}        # Statistics for a board
- prefs:{userId}                  # User preferences

Invalid patterns to identify:
- boards with nested user types (boards:admin:userId, boards:public:userId)
- tasks/stats/prefs with nested user types
- Any other non-conforming patterns
"""

import os
import sys
import json
import requests
from pathlib import Path
from collections import defaultdict

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

def analyze_keys(keys):
    """Analyze key patterns and categorize them."""
    
    analysis = {
        'valid': defaultdict(list),
        'invalid': defaultdict(list),
        'total': len(keys),
        'patterns': defaultdict(int)
    }
    
    for key in keys:
        parts = key.split(':')
        pattern = f"{len(parts)} parts"
        analysis['patterns'][pattern] += 1
        
        # Categorize by type
        if key.startswith('boards:'):
            if len(parts) == 2:
                # Valid: boards:{userId}
                analysis['valid']['boards'].append(key)
            elif len(parts) == 3:
                # Potentially invalid: boards:{userType}:{userId}
                analysis['invalid']['boards_nested'].append(key)
            else:
                analysis['invalid']['boards_unknown'].append(key)
        
        elif key.startswith('tasks:'):
            if len(parts) == 3:
                # Valid: tasks:{userId}:{boardId}
                analysis['valid']['tasks'].append(key)
            elif len(parts) == 4:
                # Potentially invalid: tasks:{userType}:{userId}:{boardId}
                analysis['invalid']['tasks_nested'].append(key)
            else:
                analysis['invalid']['tasks_unknown'].append(key)
        
        elif key.startswith('stats:'):
            if len(parts) == 3:
                # Valid: stats:{userId}:{boardId}
                analysis['valid']['stats'].append(key)
            elif len(parts) == 4:
                # Potentially invalid: stats:{userType}:{userId}:{boardId}
                analysis['invalid']['stats_nested'].append(key)
            else:
                analysis['invalid']['stats_unknown'].append(key)
        
        elif key.startswith('prefs:'):
            if len(parts) == 2:
                # Valid: prefs:{userId}
                analysis['valid']['prefs'].append(key)
            elif len(parts) == 3:
                # Potentially invalid: prefs:{userType}:{userId}
                analysis['invalid']['prefs_nested'].append(key)
            else:
                analysis['invalid']['prefs_unknown'].append(key)
        
        else:
            # Unknown/test keys
            analysis['invalid']['other'].append(key)
    
    return analysis

def print_analysis(analysis):
    """Print analysis results."""
    print("=" * 80)
    print("KV KEY ANALYSIS REPORT")
    print("=" * 80)
    print()
    
    print(f"📊 Total Keys: {analysis['total']}")
    print()
    
    print("📈 Key Pattern Distribution:")
    for pattern, count in sorted(analysis['patterns'].items()):
        print(f"   {pattern}: {count} keys")
    print()
    
    # Valid keys
    print("✅ VALID KEYS (Current Schema)")
    print("-" * 80)
    valid_total = 0
    for category, keys in sorted(analysis['valid'].items()):
        print(f"   {category}: {len(keys)} keys")
        valid_total += len(keys)
        if len(keys) <= 5:
            for key in keys:
                print(f"      • {key}")
    print(f"   TOTAL VALID: {valid_total}")
    print()
    
    # Invalid keys
    print("❌ INVALID/OUTDATED KEYS (Should be cleaned)")
    print("-" * 80)
    invalid_total = 0
    for category, keys in sorted(analysis['invalid'].items()):
        if keys:
            print(f"   {category}: {len(keys)} keys")
            invalid_total += len(keys)
            for key in keys:
                print(f"      • {key}")
    print(f"   TOTAL INVALID: {invalid_total}")
    print()
    
    # Summary
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"✅ Valid keys: {valid_total} ({valid_total/analysis['total']*100:.1f}%)")
    print(f"❌ Invalid/outdated keys: {invalid_total} ({invalid_total/analysis['total']*100:.1f}%)")
    print()
    
    if invalid_total > 0:
        print("⚠️  RECOMMENDATION:")
        print("   Run cleanup script to remove invalid keys")
        print("   Command: python scripts/admin/kv_cleanup.py --execute")
    else:
        print("🎉 All keys are valid! No cleanup needed.")
    print()

def main():
    print('🔍 Analyzing KV key structure...\n')
    
    api_token = os.environ.get('CLOUDFLARE_API_TOKEN') or load_env()
    if not api_token:
        print('❌ Error: CLOUDFLARE_API_TOKEN not found')
        return 1
    
    try:
        keys = list_all_keys(api_token)
        analysis = analyze_keys(keys)
        print_analysis(analysis)
        
        # Save detailed report
        report_file = Path('kv-analysis-report.json')
        with open(report_file, 'w') as f:
            json.dump(analysis, f, indent=2)
        print(f"📄 Detailed report saved to: {report_file}")
        
        return 0
        
    except Exception as e:
        print(f'❌ Analysis failed: {e}')
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(main())
