#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Hadoku Site Administration Tool
================================

Centralized runner for all administration tasks.

Main Operations:
  - Package Management: Install dependencies and validate tokens
  - KV Operations: Backup, restore, inspect, and cleanup key-value data
  - Key Management: Generate, migrate, and delete authentication keys
  - Secrets: Deploy configuration to GitHub Actions

Usage:
    python administration.py <command> [options]

Package Management:
    verify-install              Install and verify Python dependencies
    check-token [token]         Validate HADOKU_SITE_TOKEN or provided token

KV Operations:
    kv-backup                   Complete backup (file + clear + upload + validate)
    kv-backup-fast              Fast backup (file only)
    kv-backup-file              Backup production KV to local JSON file
    kv-backup-upload [file]     Upload backup to backup KV namespace
    kv-validate                 Validate backup KV against production
    kv-restore [source]         Restore production from backup (KV or file)
    kv-flush [--force]          Delete all KV data (destructive!)
    kv-summary                  Display summary of all boards and tasks
    kv-fetch <user-key>         Fetch all KV data for specific user key
    kv-cleanup <mode>           Clean up invalid/outdated KV keys (--dry-run|--execute)

Key Management:
    key-generate [--count N]    Generate new authentication keys (default: 1)
    key-migrate <old> <new>     Migrate all data from old key to new key (KV + D1 + sessions)
    key-delete <key> [opts]     Delete all data for a key (--include-d1 --execute)

GitHub Secrets:
    github-secrets <mode>       Update GitHub secrets (cloudflare|child-repos|all)

Cloudflare Worker Secrets:
    cloudflare-secrets [worker] Update Cloudflare Worker secrets (task-api|contact-api|all)
    cloudflare-secrets --dry-run Show what would be updated without making changes

Common Examples:
    python administration.py verify-install
    python administration.py kv-summary
    python administration.py kv-fetch <your-key>
    python administration.py key-generate --count 2
    python administration.py key-migrate "old-uuid" "new-uuid"
    python administration.py key-delete "old-uuid" --include-d1 --execute
    python administration.py github-secrets cloudflare
    python administration.py cloudflare-secrets all
    python administration.py cloudflare-secrets contact-api

Key Rotation Workflow:
    1. python administration.py key-generate
    2. python administration.py key-migrate <old> <new>
    3. python administration.py github-secrets cloudflare
    4. Verify new key works in production
    5. python administration.py key-delete <old> --include-d1 --execute

Dependencies:
    Run 'verify-install' to install all required packages automatically
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

    # Handle help flag
    if command in ['--help', '-h', 'help']:
        print_help()
        return 0
    
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
            # Complete backup (file + clear + upload + validate)
            script_path = Path(__file__).parent / 'backup-kv.py'
            result = subprocess.run([sys.executable, str(script_path), 'full-backup'])
            return result.returncode

        elif command == 'kv-backup-fast':
            # Fast backup (file only)
            script_path = Path(__file__).parent / 'backup-kv.py'
            result = subprocess.run([sys.executable, str(script_path), 'fast-backup'])
            return result.returncode

        elif command == 'kv-backup-file':
            # Backup to file only
            script_path = Path(__file__).parent / 'backup-kv.py'
            result = subprocess.run([sys.executable, str(script_path), 'backup-to-file'])
            return result.returncode

        elif command == 'kv-backup-upload':
            # Upload to backup KV
            backup_file = args[2] if len(args) > 2 else None
            script_path = Path(__file__).parent / 'backup-kv.py'
            cmd = [sys.executable, str(script_path), 'backup-to-kv']
            if backup_file:
                cmd.append(backup_file)
            result = subprocess.run(cmd)
            return result.returncode

        elif command == 'kv-validate':
            # Validate backup against production
            script_path = Path(__file__).parent / 'backup-kv.py'
            result = subprocess.run([sys.executable, str(script_path), 'validate-backup'])
            return result.returncode

        elif command == 'kv-restore':
            # Restore from backup KV or file
            source = args[2] if len(args) > 2 else 'kv'  # Default to backup KV
            script_path = Path(__file__).parent / 'backup-kv.py'
            result = subprocess.run([sys.executable, str(script_path), 'restore-from-backup', source])
            return result.returncode

        elif command == 'kv-flush':
            # Flush using backup-kv.py script
            script_path = Path(__file__).parent / 'backup-kv.py'
            cmd = [sys.executable, str(script_path), 'flush']
            if '--force' in args:
                cmd.append('--force')
            result = subprocess.run(cmd)
            return result.returncode
        
        elif command == 'kv-summary':
            from kv_summary import main as summary_main
            return summary_main()
        
        elif command == 'kv-fetch':
            if len(args) < 3:
                print("Error: kv-fetch requires a user key")
                print("Usage: python administration.py kv-fetch <user-key>")
                return 1
            script_path = ADMIN_DIR / 'kv_fetch.py'
            result = subprocess.run([sys.executable, str(script_path), args[2]])
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
        
        elif command == 'key-generate':
            # Parse count argument
            count = 1
            if '--count' in args:
                try:
                    count_index = args.index('--count')
                    if count_index + 1 < len(args):
                        count = int(args[count_index + 1])
                except (ValueError, IndexError):
                    print("Error: Invalid --count value")
                    return 1

            import uuid
            import json

            print("=" * 80)
            print("AUTHENTICATION KEY GENERATOR")
            print("=" * 80)
            print(f"Generating {count} secure authentication key(s)...\n")

            keys = []
            for i in range(count):
                # Generate UUID v4 (recommended format)
                key = str(uuid.uuid4())
                keys.append(key)
                print(f"Key {i+1}: {key}")

            print()
            print("=" * 80)
            print("USAGE")
            print("=" * 80)
            print("Add these keys to your .env file:")
            print()
            print("For admin keys:")
            if count == 1:
                print(f'  ADMIN_KEYS=["{keys[0]}"]')
            else:
                print(f'  ADMIN_KEYS={json.dumps(keys)}')
            print()
            print("For friend keys:")
            if count == 1:
                print(f'  FRIEND_KEYS=["{keys[0]}"]')
            else:
                print(f'  FRIEND_KEYS={json.dumps(keys)}')
            print()
            print("Then deploy to GitHub secrets:")
            print("  python scripts/administration.py github-secrets cloudflare")
            print("=" * 80)

            return 0

        elif command == 'key-migrate':
            if len(args) < 4:
                print("Error: key-migrate requires old and new keys")
                print("Usage: python administration.py key-migrate <old-key> <new-key>")
                return 1
            from key_migration import migrate_key
            return migrate_key(args[2], args[3])

        elif command == 'key-delete':
            if len(args) < 3:
                print("Error: key-delete requires a user key")
                print("Usage: python administration.py key-delete <user-key> [--include-d1] [--execute]")
                print()
                print("Options:")
                print("  --include-d1    Also delete D1 task_events")
                print("  --execute       Actually delete (default is dry-run)")
                return 1
            script_path = ADMIN_DIR / 'delete_key_data.py'
            cmd = [sys.executable, str(script_path), args[2]]
            if '--include-d1' in args:
                cmd.append('--include-d1')
            if '--execute' in args:
                cmd.append('--execute')
            result = subprocess.run(cmd)
            return result.returncode

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

            print(f"[INFO] Updating GitHub secrets (mode: {mode})...")
            script_path = ADMIN_DIR / 'manage_github_token.py'
            result = subprocess.run([sys.executable, str(script_path), f'--mode={mode}'])

            if result.returncode == 0:
                print("[SUCCESS] GitHub secrets updated successfully")
            else:
                print("[ERROR] Failed to update GitHub secrets")

            return result.returncode

        elif command == 'cloudflare-secrets':
            # Parse worker argument (default: all)
            worker = 'all'
            dry_run = False

            if len(args) > 2:
                if args[2] == '--dry-run':
                    dry_run = True
                else:
                    worker = args[2]

            if '--dry-run' in args:
                dry_run = True

            print(f"[INFO] Updating Cloudflare Worker secrets (worker: {worker})...")
            script_path = ADMIN_DIR / 'update_cloudflare_secrets.py'
            cmd = [sys.executable, str(script_path), '--worker', worker]
            if dry_run:
                cmd.append('--dry-run')

            result = subprocess.run(cmd)

            if result.returncode == 0:
                print("[SUCCESS] Cloudflare secrets updated successfully")
            else:
                print("[ERROR] Failed to update Cloudflare secrets")

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
