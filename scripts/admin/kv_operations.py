#!/usr/bin/env python3
"""
Cloudflare KV Operations Module
Handles backup, restore, flush, inspect, and summary operations
"""

import subprocess
import json
import sys
from pathlib import Path

def backup_kv():
    """Backup Cloudflare KV using Python script."""
    script_path = Path(__file__).parent.parent / 'backup-kv.py'
    result = subprocess.run([sys.executable, str(script_path)])
    return result.returncode

def restore_kv(backup_file: str):
    """Restore Cloudflare KV from backup file using Python script."""
    script_path = Path(__file__).parent.parent / 'restore-kv.py'
    result = subprocess.run([sys.executable, str(script_path), backup_file])
    return result.returncode

def flush_kv(force: bool = False):
    """Flush (delete) all KV data using Python script."""
    script_path = Path(__file__).parent.parent / 'flush-kv.py'
    
    if force:
        # Skip confirmation by setting env var that script can check
        # For now, just inform user they must run manually for safety
        print("⚠️  For safety, flush requires manual confirmation.")
        print(f"Run: python {script_path}")
        return 1
    
    result = subprocess.run([sys.executable, str(script_path)])
    return result.returncode

def inspect_kv(key: str = None):
    """Inspect KV data."""
    from inspect_kv import CloudflareKVInspector, load_config
    
    config = load_config()
    
    api_token = config.get('CLOUDFLARE_API_TOKEN')
    account_id = config.get('CLOUDFLARE_ACCOUNT_ID')
    namespace_id = config.get('CLOUDFLARE_NAMESPACE_ID')
    
    if not all([api_token, account_id, namespace_id]):
        print("❌ Error: Missing Cloudflare credentials in .env")
        return 1
    
    try:
        inspector = CloudflareKVInspector(api_token, account_id, namespace_id)
        
        if key:
            inspector.inspect_key(key)
        else:
            inspector.show_summary()
        
        return 0
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1

def kv_summary():
    """Display summary of all boards and tasks."""
    from kv_summary import main as summary_main
    
    try:
        summary_main()
        return 0
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
