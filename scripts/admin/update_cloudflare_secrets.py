#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Update Cloudflare Worker Secrets Directly
==========================================

This script updates Cloudflare Worker secrets (ADMIN_KEYS, FRIEND_KEYS, RESEND_API_KEY)
directly to Cloudflare Workers using wrangler CLI.

These secrets are managed separately from GitHub Actions secrets because they contain
sensitive authentication data that should only exist in Cloudflare's secure storage.

Usage:
    python update_cloudflare_secrets.py                    # Update all worker secrets
    python update_cloudflare_secrets.py --worker task-api  # Update specific worker
    python update_cloudflare_secrets.py --dry-run          # Show what would be updated

Workers:
    - task-api: ADMIN_KEYS, FRIEND_KEYS
    - contact-api: RESEND_API_KEY

Note: This requires wrangler CLI to be installed (npm install -g wrangler)
"""

import sys
import subprocess
import json
import os
from pathlib import Path
from typing import Dict, List, Optional

# Secret configurations for each worker
WORKER_CONFIGS = {
    'task-api': {
        'path': 'workers/task-api',
        'secrets': ['ADMIN_KEYS', 'FRIEND_KEYS'],
        'description': 'Task API authentication keys'
    },
    'contact-api': {
        'path': 'workers/contact-api',
        'secrets': ['RESEND_API_KEY'],
        'description': 'Contact API email service key'
    }
}

def load_env() -> Dict[str, str]:
    """Load environment variables from .env file."""
    # Look for .env in the repo root (two levels up from admin/)
    env_path = Path(__file__).parent.parent.parent / '.env'
    env_vars = {}

    if not env_path.exists():
        print(f"[ERROR] .env file not found at: {env_path}")
        return env_vars

    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                env_vars[key.strip()] = value.strip()

    return env_vars

def mask_secret(value: str, max_length: int = 40) -> str:
    """Mask a secret value for display, showing only first and last few characters."""
    if len(value) <= 12:
        # For very short values, just show asterisks
        return '*' * len(value)

    # Show first 4 and last 4 characters for non-JSON values
    if not value.strip().startswith('['):
        return f"{value[:4]}...{value[-4:]}"

    # For JSON arrays, show partial content
    if len(value) > max_length:
        return f"{value[:max_length]}..."
    return value

def validate_secret_format(key: str, value: str) -> bool:
    """Validate that secret values are properly formatted."""
    if key in ['ADMIN_KEYS', 'FRIEND_KEYS']:
        # Should be JSON array format
        try:
            data = json.loads(value)
            if not isinstance(data, list):
                print(f"  [ERROR] {key} must be a JSON array")
                return False
            if not all(isinstance(item, str) for item in data):
                print(f"  [ERROR] {key} must contain only strings")
                return False
            print(f"  [SUCCESS] {key} is valid JSON array with {len(data)} keys")
            return True
        except json.JSONDecodeError as e:
            print(f"  [ERROR] {key} is not valid JSON: {e}")
            return False
    elif key == 'RESEND_API_KEY':
        # Should be a string starting with 're_'
        if not value.startswith('re_'):
            print(f"  [WARNING] {key} doesn't match expected format (should start with 're_')")
        print(f"  [SUCCESS] {key} found (length: {len(value)})")
        return True

    return True

def update_worker_secrets(worker_name: str, env_vars: Dict[str, str], dry_run: bool = False) -> bool:
    """Update secrets for a specific worker."""
    if worker_name not in WORKER_CONFIGS:
        print(f"[ERROR] Unknown worker: {worker_name}")
        print(f"Available workers: {', '.join(WORKER_CONFIGS.keys())}")
        return False

    config = WORKER_CONFIGS[worker_name]
    repo_root = Path(__file__).parent.parent.parent
    worker_path = repo_root / config['path']

    if not worker_path.exists():
        print(f"[ERROR] Worker directory not found: {worker_path}")
        return False

    print(f"\n{'='*80}")
    print(f"Updating {worker_name}: {config['description']}")
    print(f"{'='*80}\n")

    missing_secrets = []
    invalid_secrets = []

    # Validate all secrets first
    for secret_name in config['secrets']:
        if secret_name not in env_vars:
            missing_secrets.append(secret_name)
            print(f"[WARNING] {secret_name} not found in .env")
        else:
            if not validate_secret_format(secret_name, env_vars[secret_name]):
                invalid_secrets.append(secret_name)

    if missing_secrets:
        print(f"\n[ERROR] Missing secrets: {', '.join(missing_secrets)}")
        print("Please add them to your .env file")
        return False

    if invalid_secrets:
        print(f"\n[ERROR] Invalid secrets: {', '.join(invalid_secrets)}")
        return False

    if dry_run:
        print(f"\n[DRY RUN] Would update {len(config['secrets'])} secrets to {worker_name}")
        for secret_name in config['secrets']:
            value = env_vars[secret_name]
            preview = mask_secret(value)
            print(f"  - {secret_name}: {preview}")
        return True

    # Update each secret
    print(f"\n[INFO] Updating {len(config['secrets'])} secrets...")
    success_count = 0

    for secret_name in config['secrets']:
        try:
            print(f"\n[INFO] Updating {secret_name}...")
            value = env_vars[secret_name]
            preview = mask_secret(value)
            print(f"   Preview: {preview}")

            # Use wrangler to update the secret
            # Note: We use 'npx' to ensure we use the local wrangler installation
            # On Windows, we need to use the .cmd extension
            npx_cmd = 'npx.cmd' if os.name == 'nt' else 'npx'
            result = subprocess.run(
                [npx_cmd, 'wrangler', 'secret', 'put', secret_name],
                input=value,
                text=True,
                cwd=worker_path,
                capture_output=True,
                shell=True,  # Required on Windows for .cmd files
                encoding='utf-8',  # Use UTF-8 encoding
                errors='replace'  # Replace invalid characters instead of crashing
            )

            if result.returncode == 0:
                print(f"   [SUCCESS] {secret_name} updated successfully")
                success_count += 1
            else:
                print(f"   [ERROR] Failed to update {secret_name}")
                if result.stderr:
                    # Only show error if it exists and is readable
                    error_msg = result.stderr.strip() if result.stderr else 'Unknown error'
                    print(f"   Error: {error_msg}")

        except Exception as e:
            print(f"   [ERROR] Error updating {secret_name}: {e}")

    print(f"\n{'='*80}")
    if success_count == len(config['secrets']):
        print(f"[SUCCESS] All {success_count} secrets updated successfully!")
        print(f"\n[INFO] These secrets are now stored in Cloudflare.")
        print(f"[INFO] They will persist across deployments until you update them again.")
        return True
    else:
        print(f"[WARNING] Updated {success_count}/{len(config['secrets'])} secrets")
        return False

def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(
        description='Update Cloudflare Worker secrets from .env file'
    )
    parser.add_argument(
        '--worker',
        choices=list(WORKER_CONFIGS.keys()) + ['all'],
        default='all',
        help='Which worker to update (default: all)'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be updated without making changes'
    )

    args = parser.parse_args()

    print("[CLOUDFLARE SECRETS] Worker Secrets Updater")
    print("="*80)

    # Load environment variables
    print("\n[INFO] Loading secrets from .env...")
    env_vars = load_env()

    if not env_vars:
        return 1

    print(f"[SUCCESS] Loaded {len(env_vars)} environment variables")

    # Determine which workers to update
    workers_to_update = []
    if args.worker == 'all':
        workers_to_update = list(WORKER_CONFIGS.keys())
    else:
        workers_to_update = [args.worker]

    # Update each worker
    all_success = True
    for worker in workers_to_update:
        if not update_worker_secrets(worker, env_vars, args.dry_run):
            all_success = False

    return 0 if all_success else 1

if __name__ == '__main__':
    sys.exit(main())
