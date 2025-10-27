#!/usr/bin/env python3
"""
Hadoku Site Administration Tool
================================

Centralized runner for all administration tasks including:
- Package verification and installation
- Cloudflare KV operations (backup, restore, flush, inspect)
- Key migration operations
- GitHub secrets management

Usage:
    python administration.py <command> [options]

Commands:
    verify-install              Verify and install latest packages
    check-token [token]         Validate HADOKU_SITE_TOKEN or provided token
    kv-backup                   Backup Cloudflare KV to local file
    kv-restore <file>           Restore Cloudflare KV from backup file
    kv-flush [--force]          Flush (delete) all KV data
    kv-inspect [--key KEY]      Inspect KV data (all or specific key)
    kv-summary                  Display summary of all boards and tasks
    kv-fetch <user-key>         Fetch all KV data for a specific user key
    kv-userId-update <key> <newId>  Update userId in boards data
    kv-analyze                  Analyze KV keys and identify outdated patterns
    kv-cleanup <--dry-run|--execute>  Clean up invalid/outdated KV keys
    key-migrate <old> <new>     Migrate data from old key to new key
    github-secrets <mode>       Update GitHub secrets (cloudflare/child-repos/all)

Examples:
    python administration.py verify-install
    python administration.py check-token
    python administration.py check-token ghp_xxxxxxxxxxxx
    python administration.py kv-backup
    python administration.py kv-restore backups/kv-2025-10-21.json
    python administration.py kv-inspect --key "boards:4355"
    python administration.py kv-summary
    python administration.py key-migrate "old-key-123" "new-key-456"
    python administration.py github-secrets cloudflare

Dependencies:
    All required packages will be installed automatically via verify-install
"""

import sys
import subprocess
import os
from pathlib import Path

# Add admin directory to path
ADMIN_DIR = Path(__file__).parent / 'admin'
sys.path.insert(0, str(ADMIN_DIR))

def print_help():
    """Print help message."""
    print(__doc__)

def run_command(args):
    """Parse and run the requested command."""
    if len(args) < 2:
        print_help()
        return 1
    
    command = args[1]
    
    try:
        if command == 'verify-install':
            from verify_and_install import main
            return main()
        
        elif command == 'check-token':
            token = args[2] if len(args) > 2 else None
            script_path = ADMIN_DIR / 'check_secret.py'
            if token:
                result = subprocess.run([sys.executable, str(script_path), token])
            else:
                result = subprocess.run([sys.executable, str(script_path)])
            return result.returncode
        
        elif command == 'kv-backup':
            from kv_operations import backup_kv
            return backup_kv()
        
        elif command == 'kv-restore':
            if len(args) < 3:
                print("Error: kv-restore requires a backup file path")
                print("Usage: python administration.py kv-restore <backup-file>")
                return 1
            from kv_operations import restore_kv
            return restore_kv(args[2])
        
        elif command == 'kv-flush':
            force = '--force' in args
            from kv_operations import flush_kv
            return flush_kv(force=force)
        
        elif command == 'kv-inspect':
            key = None
            if '--key' in args:
                key_index = args.index('--key')
                if key_index + 1 < len(args):
                    key = args[key_index + 1]
            from kv_operations import inspect_kv
            return inspect_kv(key=key)
        
        elif command == 'kv-summary':
            from kv_operations import kv_summary
            return kv_summary()
        
        elif command == 'kv-fetch':
            if len(args) < 3:
                print("Error: kv-fetch requires a user key")
                print("Usage: python administration.py kv-fetch <user-key>")
                return 1
            script_path = ADMIN_DIR / 'kv_fetch.py'
            result = subprocess.run([sys.executable, str(script_path), args[2]])
            return result.returncode
        
        elif command == 'kv-userId-update':
            if len(args) < 4:
                print("Error: kv-userId-update requires user key and new user ID")
                print("Usage: python administration.py kv-userId-update <user-key> <new-user-id>")
                return 1
            script_path = ADMIN_DIR / 'kv_userId_update.py'
            result = subprocess.run([sys.executable, str(script_path), args[2], args[3]])
            return result.returncode
        
        elif command == 'kv-analyze':
            script_path = ADMIN_DIR / 'kv_analyze.py'
            result = subprocess.run([sys.executable, str(script_path)])
            return result.returncode
        
        elif command == 'kv-cleanup':
            if len(args) < 3:
                print("Error: kv-cleanup requires --dry-run or --execute")
                print("Usage:")
                print("  python administration.py kv-cleanup --dry-run")
                print("  python administration.py kv-cleanup --execute")
                return 1
            script_path = ADMIN_DIR / 'kv_cleanup.py'
            result = subprocess.run([sys.executable, str(script_path), args[2]])
            return result.returncode
        
        elif command == 'key-migrate':
            if len(args) < 4:
                print("Error: key-migrate requires old and new keys")
                print("Usage: python administration.py key-migrate <old-key> <new-key>")
                return 1
            from key_migration import migrate_key
            return migrate_key(args[2], args[3])
        
        elif command == 'github-secrets':
            if len(args) < 3:
                print("Error: github-secrets requires a mode")
                print("Usage: python administration.py github-secrets <cloudflare|child-repos|all>")
                return 1
            
            mode = args[2]
            valid_modes = ['cloudflare', 'child-repos', 'all']
            if mode not in valid_modes:
                print(f"Error: Invalid mode '{mode}'")
                print(f"Valid modes: {', '.join(valid_modes)}")
                return 1
            
            print(f"🔄 Updating GitHub secrets (mode: {mode})...")
            script_path = ADMIN_DIR / 'manage_github_token.py'
            result = subprocess.run([sys.executable, str(script_path), f'--mode={mode}'])
            
            if result.returncode == 0:
                print("✅ GitHub secrets updated successfully")
            else:
                print("❌ Failed to update GitHub secrets")
            
            return result.returncode
        
        else:
            print(f"Error: Unknown command '{command}'")
            print_help()
            return 1
    
    except ImportError as e:
        print(f"Error: Failed to import command module: {e}")
        print("Make sure all dependencies are installed with 'verify-install'")
        return 1
    except Exception as e:
        print(f"Error executing command: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(run_command(sys.argv))
