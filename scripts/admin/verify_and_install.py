import os
import subprocess
import sys
from pathlib import Path

def find_project_root(marker=".git"):
    """Find the project root by looking for a marker file/directory."""
    current_path = Path.cwd()
    while current_path != current_path.parent:
        if (current_path / marker).exists():
            return current_path
        current_path = current_path.parent
    raise FileNotFoundError(f"Project root with marker '{marker}' not found.")

def read_env_variable(env_file_path, key):
    """Read a specific variable from a .env file."""
    try:
        with open(env_file_path, "r") as f:
            for line in f:
                if line.strip().startswith(f"{key}="):
                    return line.strip().split("=", 1)[1]
    except FileNotFoundError:
        print(f"[ERROR] Error: .env file not found at {env_file_path}")
        return None
    return None

def check_github_token_scopes(token):
    """Check the scopes of a GitHub token via the API."""
    print("[INFO] Verifying token scopes with GitHub API...")
    try:
        import requests
    except ImportError:
        print("\n[WARNING] 'requests' library not found. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "requests"], check=True)
        import requests

    headers = {
        "Authorization": f"token {token}",
        "User-Agent": "hadoku-token-check-script"
    }
    try:
        response = requests.get("https://api.github.com/user", headers=headers)
        response.raise_for_status()
        scopes = response.headers.get("X-OAuth-Scopes", "")
        print(f"[SUCCESS] Token is valid. Scopes: {scopes}")
        if "read:packages" not in scopes:
            print("\n[WARNING] Warning: Token is missing 'read:packages' scope, which is required to download.")
            return False
        return True
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            print("[ERROR] Error: GitHub token is invalid or expired (401 Unauthorized).")
        else:
            print(f"[ERROR] Error: GitHub API request failed with status {e.response.status_code}.")
        return False
    except Exception as e:
        print(f"[ERROR] An unexpected error occurred during API request: {e}")
        return False

def run_pnpm_install(worker_dir, env):
    """Run pnpm install in the specified directory (workspace-aware)."""
    print(f"\n[INFO] Running 'pnpm install' in {worker_dir}...")
    try:
        result = subprocess.run(
            "pnpm install",
            shell=True,
            cwd=worker_dir,
            check=True,
            capture_output=True,
            text=True,
            env=env
        )
        print("[SUCCESS] pnpm install completed successfully.")
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] 'pnpm install' failed with exit code {e.returncode}.")
        print("----- STDOUT -----")
        print(e.stdout)
        print("----- STDERR -----")
        print(e.stderr)
        print("------------------")
        sys.exit(1)

def main():
    """Main function to verify token and install packages."""
    try:
        root = find_project_root()
    except FileNotFoundError as e:
        print(e)
        sys.exit(1)

    print(f"[INFO] Project root found at: {root}")
    env_file = root / ".env"
    worker_api_dir = root / "workers" / "task-api"

    token = read_env_variable(env_file, "DEPLOY_PACKAGE_TOKEN")
    if not token:
        print("[ERROR] DEPLOY_PACKAGE_TOKEN not found in .env file. Aborting.")
        sys.exit(1)

    print(f"[INFO] Loaded DEPLOY_PACKAGE_TOKEN (length: {len(token)}).")

    if not check_github_token_scopes(token):
        print("\nAborting due to token issues.")
        sys.exit(1)

    # Prepare environment for pnpm
    pnpm_env = os.environ.copy()
    pnpm_env["DEPLOY_PACKAGE_TOKEN"] = token

    run_pnpm_install(worker_api_dir, pnpm_env)

    print("\n[SUCCESS] All steps completed successfully!")

if __name__ == "__main__":
    main()
