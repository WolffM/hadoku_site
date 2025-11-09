#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Check GitHub Token Validity
============================

Validates that HADOKU_SITE_TOKEN has the required permissions:
- repo scope (read/write access to repositories)
- Ability to push commits to hadoku_site repository

Usage:
    python check_secret.py [token]
    
If no token is provided, reads from HADOKU_SITE_TOKEN environment variable.
"""

import os
import sys
import requests
from pathlib import Path

def load_env():
    """Load environment variables from .env file."""
    env_path = Path(__file__).parent.parent.parent / '.env'
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    key = key.strip()
                    value = value.strip()
                    if key and value and not os.environ.get(key):
                        os.environ[key] = value

def check_token(token):
    """
    Check if the GitHub token is valid and has required permissions.
    
    Args:
        token: GitHub Personal Access Token
        
    Returns:
        tuple: (success: bool, message: str)
    """
    if not token:
        return False, "No token provided"
    
    if not token.startswith('ghp_') and not token.startswith('github_pat_'):
        return False, "Invalid token format (should start with 'ghp_' or 'github_pat_')"
    
    # Check token validity and get user info
    headers = {
        'Authorization': f'token {token}',
        'Accept': 'application/vnd.github.v3+json'
    }


    print("[INFO] Validating token...")

    # 1. Check if token is valid and get user info
    response = requests.get('https://api.github.com/user', headers=headers)
    
    if response.status_code == 401:
        return False, "Token is invalid or expired"
    
    if response.status_code != 200:
        return False, f"Failed to validate token: {response.status_code} - {response.text}"
    
    user_data = response.json()
    username = user_data.get('login', 'unknown')
    print(f"[SUCCESS] Token is valid for user: {username}")

    # 2. Check token scopes
    scopes = response.headers.get('X-OAuth-Scopes', '')
    print(f"[INFO] Token scopes: {scopes}")
    
    required_scopes = ['repo']
    missing_scopes = []
    
    for scope in required_scopes:
        if scope not in scopes:
            missing_scopes.append(scope)
    
    if missing_scopes:
        return False, f"Token is missing required scopes: {', '.join(missing_scopes)}\nCurrent scopes: {scopes}"

    print("[SUCCESS] Token has required 'repo' scope")

    # 3. Check access to hadoku_site repository
    print("\n[INFO] Checking access to WolffM/hadoku_site...")
    response = requests.get('https://api.github.com/repos/WolffM/hadoku_site', headers=headers)
    
    if response.status_code == 404:
        return False, "Cannot access WolffM/hadoku_site repository (not found or no access)"
    
    if response.status_code != 200:
        return False, f"Failed to access repository: {response.status_code} - {response.text}"
    
    repo_data = response.json()
    permissions = repo_data.get('permissions', {})

    print(f"[SUCCESS] Repository access confirmed")
    print(f"   - Can read: {permissions.get('pull', False)}")
    print(f"   - Can write: {permissions.get('push', False)}")
    print(f"   - Is admin: {permissions.get('admin', False)}")

    if not permissions.get('push', False):
        return False, "Token does not have write (push) access to the repository"

    print("[SUCCESS] Token has write access to repository")

    # 4. Check rate limit
    print("\n[INFO] Checking rate limits...")
    response = requests.get('https://api.github.com/rate_limit', headers=headers)
    
    if response.status_code == 200:
        rate_data = response.json()
        core = rate_data.get('resources', {}).get('core', {})
        remaining = core.get('remaining', 0)
        limit = core.get('limit', 0)
        print(f"   Rate limit: {remaining}/{limit} requests remaining")
    
    return True, f"Token is valid and has all required permissions for user: {username}"

def main():
    """Main function."""
    load_env()
    
    # Get token from command line or environment
    if len(sys.argv) > 1:
        token = sys.argv[1]
        print("Using token from command line argument")
    else:
        token = os.environ.get('HADOKU_SITE_TOKEN')
        if not token:
            print("[ERROR] Error: No token provided")
            print("\nUsage:")
            print("  python check_secret.py <token>")
            print("  OR set HADOKU_SITE_TOKEN environment variable")
            return 1
        print("Using token from HADOKU_SITE_TOKEN environment variable")

    # Validate token
    success, message = check_token(token)

    print("\n" + "="*60)
    if success:
        print("[SUCCESS] VALIDATION SUCCESSFUL")
        print(message)
        print("\n[INFO] This token can be used for:")
        print("   - Pushing commits to hadoku_site")
        print("   - Triggering workflows")
        print("   - Creating/updating files")
        return 0
    else:
        print("[ERROR] VALIDATION FAILED")
        print(message)
        print("\n[INFO] To fix:")
        print("   1. Go to https://github.com/settings/tokens")
        print("   2. Generate a new token with 'repo' scope")
        print("   3. Update HADOKU_SITE_TOKEN in .env file")
        return 1

if __name__ == '__main__':
    sys.exit(main())
