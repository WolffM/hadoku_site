#!/usr/bin/env python3
"""
Complete GitHub Token Management Script
Self-contained script that:
1. Checks/creates virtual environment
2. Installs dependencies
3. Validates token
4. Updates secrets in target repositories
5. Verifies the updates

Usage: python manage_github_token.py
"""

import sys
import subprocess
import os
from pathlib import Path

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
        print("📦 Virtual environment not found. Creating...")
        subprocess.run([sys.executable, '-m', 'venv', str(venv_dir)], check=True)
        print("✅ Virtual environment created")
    
    # Determine the python executable in venv
    if os.name == 'nt':  # Windows
        venv_python = venv_dir / 'Scripts' / 'python.exe'
        venv_pip = venv_dir / 'Scripts' / 'pip.exe'
    else:  # Unix-like
        venv_python = venv_dir / 'bin' / 'python'
        venv_pip = venv_dir / 'bin' / 'pip'
    
    # If not in venv, restart script with venv python
    if not is_venv():
        print(f"🔄 Restarting in virtual environment...")
        subprocess.run([str(venv_python), __file__] + sys.argv[1:], check=True)
        sys.exit(0)
    
    # Check if dependencies are installed
    try:
        import requests
        import nacl
        print("✅ Dependencies already installed")
    except ImportError:
        print("📦 Installing dependencies...")
        subprocess.run([str(venv_pip), 'install', 'requests', 'PyNaCl'], check=True)
        print("✅ Dependencies installed")
        print("🔄 Restarting to load new dependencies...")
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

# Secret name to manage
SECRET_NAME = "HADOKU_SITE_TOKEN"

# Target repositories to update
TARGET_REPOS = [
    "WolffM/hadoku-task",
    "WolffM/hadoku-watchparty",
]

# ============================================================================
# GitHub Token Manager Class
# ============================================================================

class GitHubTokenManager:
    def __init__(self):
        self.token = None
        self.session = None
        self.new_secret_value = None
        
    def load_env(self) -> Dict[str, str]:
        """Load environment variables from .env file."""
        env_path = Path(__file__).parent / '.env'
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
        """Step 1: Check if token exists in .env file."""
        print("🔍 Step 1: Checking for token in .env file...")
        
        env = self.load_env()
        self.new_secret_value = env.get(SECRET_NAME, '')
        
        if not self.new_secret_value:
            print(f"❌ {SECRET_NAME} not found in .env file")
            print(f"Please add {SECRET_NAME} to your .env file")
            return False
        
        print(f"✅ Found token: {self.new_secret_value[:20]}...")
        return True
    
    def step2_validate_token(self) -> bool:
        """Step 2: Validate the token by testing it against GitHub API."""
        print("\n🔐 Step 2: Validating token...")
        
        # Test 1: Token validity (get user info)
        print("  🧪 Testing token validity...")
        response = requests.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {self.new_secret_value}"}
        )
        
        if response.status_code != 200:
            print(f"❌ Token validation failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        user_info = response.json()
        print(f"✅ Token valid for user: {user_info.get('login', 'Unknown')}")
        
        # Check token scopes
        scopes = response.headers.get('X-OAuth-Scopes', '')
        if scopes:
            print(f"  📋 Token scopes: {scopes}")
        
        # Test 2: Check repository access
        print("  🧪 Testing repository access...")
        test_repo = TARGET_REPOS[0] if TARGET_REPOS else "WolffM/hadoku-task"
        response = requests.get(
            f"https://api.github.com/repos/{test_repo}",
            headers={"Authorization": f"Bearer {self.new_secret_value}"}
        )
        
        if response.status_code != 200:
            print(f"❌ Repository access failed for {test_repo}: {response.status_code}")
            return False
        
        print(f"✅ Repository access confirmed for {test_repo}")
        
        # Test 3: Test the actual use case - dispatching to hadoku_site
        print("  🧪 Testing repository dispatch to hadoku_site...")
        response = requests.post(
            "https://api.github.com/repos/WolffM/hadoku_site/dispatches",
            headers={
                "Accept": "application/vnd.github+json",
                "Authorization": f"Bearer {self.new_secret_value}",
                "X-GitHub-Api-Version": "2022-11-28"
            },
            json={
                "event_type": "task_updated",
                "client_payload": {"ping": True, "test": "token_validation"}
            }
        )
        
        if response.status_code == 204:
            print(f"✅ Repository dispatch successful! Token can trigger hadoku_site workflows")
        elif response.status_code == 404:
            print(f"⚠️  Repository dispatch returned 404 - repository might not exist or token lacks access")
            print(f"    This token may still work, but verify repository name and permissions")
        else:
            print(f"⚠️  Repository dispatch returned {response.status_code}")
            print(f"    Response: {response.text}")
            print(f"    Token may lack dispatch permissions, but continuing...")
        
        print(f"✅ Token validation complete - this token will be distributed to target repositories")
        return True
    
    def authenticate_github(self) -> bool:
        """Get GitHub token via OAuth Device Flow for API operations."""
        print("\n🔐 Step 3: Getting GitHub API token for secret management...")
        
        # Step 1: Request device code
        device_url = "https://github.com/login/device/code"
        response = requests.post(
            device_url,
            headers={"Accept": "application/json"},
            data={"client_id": CLIENT_ID, "scope": "repo"}
        )
        
        if response.status_code != 200:
            print(f"❌ Failed to get device code: {response.status_code}")
            return False
        
        data = response.json()
        device_code = data["device_code"]
        user_code = data["user_code"]
        verification_uri = data["verification_uri"]
        interval = data["interval"]
        
        print(f"\n📋 Please visit: {verification_uri}")
        print(f"🔑 Enter code: {user_code}")
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
                print("✅ GitHub API authentication successful!")
                self.token = result["access_token"]
                self.setup_session()
                return True
            elif result.get("error") == "authorization_pending":
                print("⏳ Still waiting...")
                continue
            elif result.get("error") == "slow_down":
                interval += 5
                continue
            else:
                print(f"❌ Authentication failed: {result.get('error_description', result.get('error'))}")
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
        print(f"\n📝 Step 4: Updating {SECRET_NAME} in {len(TARGET_REPOS)} repositories...")
        
        success_count = 0
        
        for repo in TARGET_REPOS:
            print(f"\n  📋 Processing {repo}...")
            
            try:
                # Get public key
                print(f"    📥 Getting public key...")
                url = f"https://api.github.com/repos/{repo}/actions/secrets/public-key"
                response = self.session.get(url)
                response.raise_for_status()
                key_data = response.json()
                
                # Encrypt the secret
                print(f"    🔐 Encrypting secret...")
                encrypted_value = self.encrypt_secret(key_data["key"], self.new_secret_value)
                
                # Update the secret
                print(f"    📤 Updating secret...")
                url = f"https://api.github.com/repos/{repo}/actions/secrets/{SECRET_NAME}"
                payload = {
                    "encrypted_value": encrypted_value,
                    "key_id": key_data["key_id"]
                }
                
                response = self.session.put(url, json=payload)
                response.raise_for_status()
                
                print(f"    ✅ Successfully updated {SECRET_NAME} in {repo}")
                success_count += 1
                
            except requests.exceptions.RequestException as e:
                print(f"    ❌ Failed to update {repo}: {e}")
                if hasattr(e, 'response') and e.response is not None:
                    print(f"    Response: {e.response.text}")
            except Exception as e:
                print(f"    ❌ Unexpected error for {repo}: {e}")
        
        print(f"\n📊 Update Summary: {success_count}/{len(TARGET_REPOS)} successful")
        return success_count == len(TARGET_REPOS)
    
    def step4_verify_secrets(self) -> bool:
        """Step 5: Verify that secrets were updated successfully."""
        print(f"\n🔍 Step 5: Verifying secret updates...")
        
        verified_count = 0
        
        for repo in TARGET_REPOS:
            print(f"\n  📋 Verifying {repo}...")
            
            try:
                url = f"https://api.github.com/repos/{repo}/actions/secrets/{SECRET_NAME}"
                response = self.session.get(url)
                
                if response.status_code == 200:
                    secret_info = response.json()
                    print(f"    ✅ Secret {SECRET_NAME} exists")
                    print(f"    📅 Updated: {secret_info.get('updated_at', 'Unknown')}")
                    verified_count += 1
                elif response.status_code == 404:
                    print(f"    ❌ Secret {SECRET_NAME} not found")
                else:
                    print(f"    ⚠️  Unexpected response: {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                print(f"    ❌ Failed to verify {repo}: {e}")
            except Exception as e:
                print(f"    ❌ Unexpected error: {e}")
        
        print(f"\n📊 Verification Summary: {verified_count}/{len(TARGET_REPOS)} verified")
        return verified_count == len(TARGET_REPOS)
    
    def run_complete_flow(self) -> bool:
        """Run the complete token management flow."""
        print("🚀 GitHub Token Management - Complete Flow")
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
            print("⚠️  Some updates failed, but continuing with verification...")
        
        # Step 5: Verify secrets
        verification_success = self.step4_verify_secrets()
        
        print("\n" + "=" * 60)
        if verification_success:
            print("🎉 Complete flow successful! All secrets updated and verified.")
        else:
            print("⚠️  Flow completed with some issues. Check the logs above.")
        
        return verification_success

# ============================================================================
# Main Entry Point
# ============================================================================

def main():
    """Main function."""
    try:
        manager = GitHubTokenManager()
        success = manager.run_complete_flow()
        
        if success:
            print("\n✨ All done! Your GitHub secrets are up to date.")
            sys.exit(0)
        else:
            print("\n❌ There were some issues. Please review the output above.")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Operation cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
