#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Complete GitHub Secrets Management Script
Self-contained script that:
1. Checks/creates virtual environment
2. Installs dependencies
3. Validates secrets
4. Updates secrets in target repositories
5. Verifies the updates

Note: ADMIN_KEYS and FRIEND_KEYS are managed directly in Cloudflare, not GitHub.
To update those, run: pnpm --filter task-api exec wrangler secret put ADMIN_KEYS

Usage: 
  python manage_github_token.py                    # Update HADOKU_SITE_TOKEN in child repos
  python manage_github_token.py --mode=cloudflare  # Update Cloudflare deployment secrets (NOT auth keys)
  python manage_github_token.py --mode=all         # Update all secrets
"""

import sys
import subprocess
import os
from pathlib import Path
import argparse

# Check if we're running in a virtual environment
def is_venv():
    return hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix)

# Bootstrap: Setup virtual environment and install dependencies
def bootstrap():
    """Setup virtual environment and install dependencies if needed."""
    script_dir = Path(__file__).parent
    venv_dir = script_dir / '.venv'
    
    # Check if venv exists
    if not venv_dir.exists():
        print("[INFO] Virtual environment not found. Creating...")
        subprocess.run([sys.executable, '-m', 'venv', str(venv_dir)], check=True)
        print("[SUCCESS] Virtual environment created")
    
    # Determine the python executable in venv
    if os.name == 'nt':  # Windows
        venv_python = venv_dir / 'Scripts' / 'python.exe'
        venv_pip = venv_dir / 'Scripts' / 'pip.exe'
    else:  # Unix-like
        venv_python = venv_dir / 'bin' / 'python'
        venv_pip = venv_dir / 'bin' / 'pip'
    
    # If not in venv, restart script with venv python
    if not is_venv():
        print(f"[INFO] Restarting in virtual environment...")
        subprocess.run([str(venv_python), __file__] + sys.argv[1:], check=True)
        sys.exit(0)

    # Check if dependencies are installed
    try:
        import requests
        import nacl
        print("[SUCCESS] Dependencies already installed")
    except ImportError:
        print("[INFO] Installing dependencies...")
        subprocess.run([str(venv_pip), 'install', 'requests', 'PyNaCl'], check=True)
        print("[SUCCESS] Dependencies installed")
        print("[INFO] Restarting to load new dependencies...")
        subprocess.run([str(venv_python), __file__] + sys.argv[1:], check=True)
        sys.exit(0)

# Run bootstrap
bootstrap()

# Now we can safely import the dependencies
import requests
import base64
import json
import time
from nacl import encoding, public
from typing import List, Optional, Dict, Any

# ============================================================================
# Configuration
# ============================================================================

# GitHub OAuth App Client ID (official GitHub CLI client ID)
CLIENT_ID = "178c6fc778ccc68e1d6a"

# Secret configurations
SECRET_CONFIGS = {
    'child-repos': {
        'description': 'HADOKU_SITE_TOKEN for child micro-app repositories',
        'secrets': ['HADOKU_SITE_TOKEN'],
        'repos': [
            "WolffM/hadoku-task",
            "WolffM/hadoku-watchparty",
            "WolffM/hadoku-resume-bot",
            "WolffM/hadoku-contact-ui",
        ]
    },
    'cloudflare': {
        'description': 'Deployment secrets for hadoku_site (Cloudflare Workers)',
        'secrets': [
            'CLOUDFLARE_API_TOKEN', 
            'CLOUDFLARE_WORKER_FLUSH_TOKEN', 
            'ROUTE_CONFIG', 
            'TASK_GITHUB_TOKEN', 
            'DEPLOY_PACKAGE_TOKEN'
        ],
        'repos': [
            "WolffM/hadoku_site",
        ],
        # Map .env names to GitHub Secret names
        'secret_mapping': {
            'TASK_GITHUB_TOKEN': 'HADOKU_SITE_TOKEN',
            'DEPLOY_PACKAGE_TOKEN': 'DEPLOY_PACKAGE_TOKEN'
        }
    }
}

# ============================================================================
# GitHub Token Manager Class
# ============================================================================

class GitHubTokenManager:
    def __init__(self, mode='child-repos'):
        self.token = None
        self.session = None
        self.mode = mode
        self.config = SECRET_CONFIGS.get(mode)
        if not self.config:
            raise ValueError(f"Invalid mode: {mode}. Valid modes: {list(SECRET_CONFIGS.keys())}")
        self.secret_values = {}
        
    def load_env(self) -> Dict[str, str]:
        """Load environment variables from .env file."""
        # Look for .env in the repo root (two levels up from admin/)
        env_path = Path(__file__).parent.parent.parent / '.env'
        env_vars = {}
        
        if env_path.exists():
            with open(env_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        env_vars[key.strip()] = value.strip()
        
        return env_vars
    
    def step1_check_token(self) -> bool:
        """Step 1: Check if secrets exist in .env file."""
        print(f"[INFO] Step 1: Checking for secrets in .env file...")
        print(f"  Mode: {self.mode} ({self.config['description']})")

        env = self.load_env()
        missing_secrets = []
        secret_mapping = self.config.get('secret_mapping', {})

        for secret_name in self.config['secrets']:
            # Check if there's a mapping (e.g., ADMIN_KEY -> PUBLIC_ADMIN_KEY in .env)
            env_name = secret_mapping.get(secret_name, secret_name)
            secret_value = env.get(env_name, '')

            if not secret_value:
                missing_secrets.append(f"{secret_name} (looking for {env_name} in .env)")
            else:
                self.secret_values[secret_name] = secret_value
                if env_name != secret_name:
                    print(f"  [SUCCESS] Found {secret_name} (from {env_name}): {secret_value[:20]}...")
                else:
                    print(f"  [SUCCESS] Found {secret_name}: {secret_value[:20]}...")

        if missing_secrets:
            print(f"[ERROR] Missing secrets: {', '.join(missing_secrets)}")
            print(f"Please add them to your .env file")
            return False

        print(f"[SUCCESS] All {len(self.config['secrets'])} secrets found")
        return True
    
    def step2_validate_token(self) -> bool:
        """Step 2: Validate the secrets."""
        print("\n[INFO] Step 2: Validating secrets...")

        # For child-repos mode, validate HADOKU_SITE_TOKEN
        if self.mode == 'child-repos' and 'HADOKU_SITE_TOKEN' in self.secret_values:
            token = self.secret_values['HADOKU_SITE_TOKEN']

            # Test 1: Token validity (get user info)
            print("  [INFO] Testing HADOKU_SITE_TOKEN validity...")
            response = requests.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {token}"}
            )

            if response.status_code != 200:
                print(f"[ERROR] Token validation failed: {response.status_code}")
                print(f"Response: {response.text}")
                return False

            user_info = response.json()
            print(f"[SUCCESS] Token valid for user: {user_info.get('login', 'Unknown')}")

            # Check token scopes
            scopes = response.headers.get('X-OAuth-Scopes', '')
            if scopes:
                print(f"  [INFO] Token scopes: {scopes}")

            # Test 2: Check repository access
            print("  [INFO] Testing repository access...")
            test_repo = self.config['repos'][0]
            response = requests.get(
                f"https://api.github.com/repos/{test_repo}",
                headers={"Authorization": f"Bearer {token}"}
            )

            if response.status_code != 200:
                print(f"[ERROR] Repository access failed for {test_repo}: {response.status_code}")
                return False

            print(f"[SUCCESS] Repository access confirmed for {test_repo}")
        
        # For cloudflare mode, validate structure
        elif self.mode == 'cloudflare':
            if 'CLOUDFLARE_API_TOKEN' in self.secret_values:
                token = self.secret_values['CLOUDFLARE_API_TOKEN']
                print(f"  [SUCCESS] CLOUDFLARE_API_TOKEN present (length: {len(token)})")

            if 'ROUTE_CONFIG' in self.secret_values:
                route_config = self.secret_values['ROUTE_CONFIG']
                print(f"  [INFO] Validating ROUTE_CONFIG JSON structure...")
                try:
                    import json
                    config_data = json.loads(route_config)
                    print(f"  [SUCCESS] ROUTE_CONFIG is valid JSON with keys: {list(config_data.keys())}")
                except json.JSONDecodeError as e:
                    print(f"  [ERROR] ROUTE_CONFIG is not valid JSON: {e}")
                    return False

            # Note: ADMIN_KEYS and FRIEND_KEYS are now managed directly in Cloudflare
            # via: pnpm --filter task-api exec wrangler secret put <SECRET_NAME>
            print(f"  [INFO] Note: ADMIN_KEYS and FRIEND_KEYS are managed directly in Cloudflare")

        print(f"[SUCCESS] Validation complete")
        return True
    
    def authenticate_github(self) -> bool:
        """Get GitHub token via OAuth Device Flow for API operations."""
        print("\n[INFO] Step 3: Getting GitHub API token for secret management...")

        # Step 1: Request device code
        device_url = "https://github.com/login/device/code"
        response = requests.post(
            device_url,
            headers={"Accept": "application/json"},
            data={"client_id": CLIENT_ID, "scope": "repo"}
        )

        if response.status_code != 200:
            print(f"[ERROR] Failed to get device code: {response.status_code}")
            return False

        data = response.json()
        device_code = data["device_code"]
        user_code = data["user_code"]
        verification_uri = data["verification_uri"]
        interval = data["interval"]

        print(f"\n[INFO] Please visit: {verification_uri}")
        print(f"[INFO] Enter code: {user_code}")
        print("\nWaiting for authorization (press Ctrl+C to cancel)...")

        # Step 2: Poll for access token
        token_url = "https://github.com/login/oauth/access_token"
        while True:
            time.sleep(interval)

            response = requests.post(
                token_url,
                headers={"Accept": "application/json"},
                data={
                    "client_id": CLIENT_ID,
                    "device_code": device_code,
                    "grant_type": "urn:ietf:params:oauth:grant-type:device_code"
                }
            )

            result = response.json()

            if "access_token" in result:
                print("[SUCCESS] GitHub API authentication successful!")
                self.token = result["access_token"]
                self.setup_session()
                return True
            elif result.get("error") == "authorization_pending":
                print("[INFO] Still waiting...")
                continue
            elif result.get("error") == "slow_down":
                interval += 5
                continue
            else:
                print(f"[ERROR] Authentication failed: {result.get('error_description', result.get('error'))}")
                return None
    
    def setup_session(self):
        """Setup requests session with authentication."""
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"token {self.token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        })
    
    def encrypt_secret(self, public_key: str, secret_value: str) -> str:
        """Encrypt a secret using the repository's public key."""
        public_key_bytes = base64.b64decode(public_key)
        public_key_obj = public.PublicKey(public_key_bytes)
        sealed_box = public.SealedBox(public_key_obj)
        encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
        return base64.b64encode(encrypted).decode("utf-8")
    
    def step3_update_secrets(self) -> bool:
        """Step 4: Update secrets in all target repositories."""
        target_repos = self.config['repos']
        secret_names = self.config['secrets']

        print(f"\n[INFO] Step 4: Updating {len(secret_names)} secret(s) in {len(target_repos)} repository(ies)...")

        total_operations = len(target_repos) * len(secret_names)
        success_count = 0

        for repo in target_repos:
            print(f"\n  [INFO] Processing {repo}...")

            try:
                # Get public key for this repo
                print(f"    [INFO] Getting public key...")
                url = f"https://api.github.com/repos/{repo}/actions/secrets/public-key"
                response = self.session.get(url)
                response.raise_for_status()
                key_data = response.json()

                # Update each secret
                for secret_name in secret_names:
                    secret_value = self.secret_values[secret_name]

                    print(f"    [INFO] Encrypting {secret_name}...")
                    encrypted_value = self.encrypt_secret(key_data["key"], secret_value)

                    print(f"    [INFO] Updating {secret_name}...")
                    url = f"https://api.github.com/repos/{repo}/actions/secrets/{secret_name}"
                    payload = {
                        "encrypted_value": encrypted_value,
                        "key_id": key_data["key_id"]
                    }

                    response = self.session.put(url, json=payload)
                    response.raise_for_status()

                    print(f"    [SUCCESS] Successfully updated {secret_name} in {repo}")
                    success_count += 1

            except requests.exceptions.RequestException as e:
                print(f"    [ERROR] Failed to update {repo}: {e}")
                if hasattr(e, 'response') and e.response is not None:
                    print(f"    Response: {e.response.text}")
            except Exception as e:
                print(f"    [ERROR] Unexpected error for {repo}: {e}")

        print(f"\n[INFO] Update Summary: {success_count}/{total_operations} successful")
        return success_count == total_operations
    
    def step4_verify_secrets(self) -> bool:
        """Step 5: Verify that secrets were updated successfully."""
        target_repos = self.config['repos']
        secret_names = self.config['secrets']

        print(f"\n[INFO] Step 5: Verifying secret updates...")

        total_operations = len(target_repos) * len(secret_names)
        verified_count = 0

        for repo in target_repos:
            print(f"\n  [INFO] Verifying {repo}...")

            for secret_name in secret_names:
                try:
                    url = f"https://api.github.com/repos/{repo}/actions/secrets/{secret_name}"
                    response = self.session.get(url)

                    if response.status_code == 200:
                        secret_info = response.json()
                        print(f"    [SUCCESS] Secret {secret_name} exists")
                        print(f"       [INFO] Updated: {secret_info.get('updated_at', 'Unknown')}")
                        verified_count += 1
                    elif response.status_code == 404:
                        print(f"    [ERROR] Secret {secret_name} not found")
                    else:
                        print(f"    [WARNING] Unexpected response for {secret_name}: {response.status_code}")

                except requests.exceptions.RequestException as e:
                    print(f"    [ERROR] Failed to verify {secret_name}: {e}")
                except Exception as e:
                    print(f"    [ERROR] Unexpected error for {secret_name}: {e}")

        print(f"\n[INFO] Verification Summary: {verified_count}/{total_operations} verified")
        return verified_count == total_operations
    
    def run_complete_flow(self) -> bool:
        """Run the complete secret management flow."""
        print("[INFO] GitHub Secrets Management - Complete Flow")
        print(f"[INFO] Mode: {self.mode}")
        print(f"[INFO] Secrets: {', '.join(self.config['secrets'])}")
        print(f"[INFO] Target Repos: {', '.join(self.config['repos'])}")
        print("=" * 60)

        # Step 1: Check for token
        if not self.step1_check_token():
            return False

        # Step 2: Validate token
        if not self.step2_validate_token():
            return False

        # Step 3: Get GitHub API token for secret management
        if not self.authenticate_github():
            return False

        # Step 4: Update secrets
        if not self.step3_update_secrets():
            print("[WARNING] Some updates failed, but continuing with verification...")

        # Step 5: Verify secrets
        verification_success = self.step4_verify_secrets()

        print("\n" + "=" * 60)
        if verification_success:
            print("[SUCCESS] Complete flow successful! All secrets updated and verified.")
        else:
            print("[WARNING] Flow completed with some issues. Check the logs above.")

        return verification_success

# ============================================================================
# Main Entry Point
# ============================================================================

def main():
    """Main function."""
    parser = argparse.ArgumentParser(
        description='Manage GitHub Secrets for hadoku_site repositories',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python manage_github_token.py                    # Update HADOKU_SITE_TOKEN in child repos
  python manage_github_token.py --mode=cloudflare  # Update Cloudflare deployment secrets (NOT auth keys)
  python manage_github_token.py --mode=all         # Update all secrets in all repos

Note: 
  ADMIN_KEYS and FRIEND_KEYS are managed directly in Cloudflare via wrangler CLI.
  To update: cd workers/task-api && pnpm exec wrangler secret put ADMIN_KEYS
        """
    )
    
    parser.add_argument(
        '--mode',
        choices=['child-repos', 'cloudflare', 'all'],
        default='child-repos',
        help='Which secrets to update (default: child-repos)'
    )
    
    args = parser.parse_args()
    
    try:
        # If mode is 'all', run both modes sequentially
        if args.mode == 'all':
            modes = ['child-repos', 'cloudflare']
        else:
            modes = [args.mode]
        
        all_success = True
        
        for mode in modes:
            if len(modes) > 1:
                print(f"\n{'='*60}")
                print(f"Running mode: {mode}")
                print(f"{'='*60}\n")
            
            manager = GitHubTokenManager(mode=mode)
            success = manager.run_complete_flow()
            
            if not success:
                all_success = False
        
        if all_success:
            print("\n[SUCCESS] All done! Your GitHub secrets are up to date.")
            sys.exit(0)
        else:
            print("\n[ERROR] There were some issues. Please review the output above.")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n[WARNING] Operation cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
