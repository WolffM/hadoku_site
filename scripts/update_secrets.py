#!/usr/bin/env python3
"""
Script to update HADOKU_SITE_TOKEN secret across multiple GitHub repositories.
Uses GitHub OAuth Device Flow for secure authentication.
Requires: pip install requests PyNaCl
"""

import requests
import base64
import json
import time
from pathlib import Path
from nacl import encoding, public
from typing import List, Optional

# GitHub OAuth App Client ID (public, safe to commit)
# This is the official GitHub CLI client ID
CLIENT_ID = "178c6fc778ccc68e1d6a"

# Load token from .env file
def load_env():
    """Load environment variables from .env file."""
    env_path = Path(__file__).parent.parent / '.env'
    env_vars = {}
    
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
    
    return env_vars

# Load configuration from .env
env = load_env()
NEW_SECRET_VALUE = env.get('HADOKU_SITE_TOKEN', '')
SECRET_NAME = "HADOKU_SITE_TOKEN"

# List of repositories to update
REPOS = [
    "WolffM/hadoku-task",
    "WolffM/hadoku-watchparty", 
    # Add more repos as needed
]

def github_device_flow_auth() -> Optional[str]:
    """Authenticate using GitHub Device Flow."""
    print("🔐 Starting GitHub OAuth Device Flow...")
    print("=" * 50)
    
    # Step 1: Request device and user codes
    device_code_url = "https://github.com/login/device/code"
    response = requests.post(
        device_code_url,
        headers={"Accept": "application/json"},
        data={"client_id": CLIENT_ID, "scope": "repo"}
    )
    
    if response.status_code != 200:
        print(f"❌ Failed to request device code: {response.text}")
        return None
    
    data = response.json()
    device_code = data["device_code"]
    user_code = data["user_code"]
    verification_uri = data["verification_uri"]
    interval = data.get("interval", 5)
    
    # Step 2: Display user code and wait for authorization
    print(f"\n📋 Please visit: {verification_uri}")
    print(f"🔑 Enter code: {user_code}")
    print(f"\nWaiting for authorization (this will auto-check every {interval} seconds)...")
    print("Press Ctrl+C to cancel\n")
    
    # Step 3: Poll for access token
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
            print("✅ Successfully authenticated!")
            return result["access_token"]
        elif result.get("error") == "authorization_pending":
            print("⏳ Still waiting for authorization...")
            continue
        elif result.get("error") == "slow_down":
            interval += 5
            continue
        else:
            print(f"❌ Authentication failed: {result.get('error_description', result.get('error'))}")
            return None

class GitHubSecretsManager:
    def __init__(self, token: str):
        self.token = token
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        })
    
    def get_public_key(self, repo: str) -> dict:
        """Get the repository's public key for encrypting secrets."""
        url = f"https://api.github.com/repos/{repo}/actions/secrets/public-key"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()
    
    def encrypt_secret(self, public_key: str, secret_value: str) -> str:
        """Encrypt a secret using the repository's public key."""
        public_key_bytes = base64.b64decode(public_key)
        public_key_obj = public.PublicKey(public_key_bytes)
        sealed_box = public.SealedBox(public_key_obj)
        encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
        return base64.b64encode(encrypted).decode("utf-8")
    
    def update_secret(self, repo: str, secret_name: str, secret_value: str) -> bool:
        """Update a secret in the specified repository."""
        try:
            # Get public key
            print(f"📥 Getting public key for {repo}...")
            key_data = self.get_public_key(repo)
            
            # Encrypt the secret
            print(f"🔐 Encrypting secret...")
            encrypted_value = self.encrypt_secret(key_data["key"], secret_value)
            
            # Update the secret
            print(f"📤 Updating {secret_name} in {repo}...")
            url = f"https://api.github.com/repos/{repo}/actions/secrets/{secret_name}"
            payload = {
                "encrypted_value": encrypted_value,
                "key_id": key_data["key_id"]
            }
            
            response = self.session.put(url, json=payload)
            response.raise_for_status()
            
            print(f"✅ Successfully updated {secret_name} in {repo}")
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to update {repo}: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Response: {e.response.text}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error for {repo}: {e}")
            return False

def main():
    """Main function to update secrets across all repositories."""
    print("🚀 GitHub Secrets Updater")
    print("=" * 50)
    
    # Validate that we have the secret value to distribute
    if not NEW_SECRET_VALUE:
        print("❌ HADOKU_SITE_TOKEN not found in .env file")
        print("Please add HADOKU_SITE_TOKEN to your .env file")
        return
    
    # Authenticate via OAuth Device Flow
    github_token = github_device_flow_auth()
    if not github_token:
        print("❌ Authentication failed. Exiting.")
        return
    
    print(f"\n🔄 Will update {SECRET_NAME} in {len(REPOS)} repositories")
    print(f"📦 Secret value from .env: {NEW_SECRET_VALUE[:20]}...")
    print()
    
    # Initialize manager
    manager = GitHubSecretsManager(github_token)
    
    # Update secrets
    success_count = 0
    total_count = len(REPOS)
    
    for repo in REPOS:
        print(f"\n📋 Processing {repo}...")
        if manager.update_secret(repo, SECRET_NAME, NEW_SECRET_VALUE):
            success_count += 1
        print("-" * 30)
    
    # Summary
    print(f"\n📊 Summary:")
    print(f"✅ Successful: {success_count}/{total_count}")
    print(f"❌ Failed: {total_count - success_count}/{total_count}")
    
    if success_count == total_count:
        print("🎉 All repositories updated successfully!")
    else:
        print("⚠️  Some repositories failed to update. Check the logs above.")

if __name__ == "__main__":
    main()