#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Resume Data Ingestion Pipeline
==============================

Uploads resume content and system prompt to Cloudflare infrastructure.

Data Locations:
  - Resume markdown: KV namespace (CONTENT_KV) under key "resume"
  - System prompt: Cloudflare Worker secret (RESUME_SYSTEM_PROMPT)

Usage:
    python ingest_resume.py                              # Upload all (auto-detect resume)
    python ingest_resume.py path/to/resume.md            # Upload specific resume file
    python ingest_resume.py --resume                     # Upload resume only
    python ingest_resume.py --prompt                     # Upload system prompt only
    python ingest_resume.py --dry-run                    # Show what would be uploaded

Resume File Resolution:
    1. If a path argument is provided, use that file
    2. Otherwise, use the first .md file found in scripts/resume/
"""

import sys
import subprocess
import os
import glob as glob_module
from pathlib import Path
from typing import Optional

# Configuration
RESUME_KV_NAMESPACE_ID = "963eeaa358d44c88a7e4047303e20997"
RESUME_KV_KEY = "resume"
RESUME_WORKER_PATH = "workers/resume-api"
RESUME_DIR = "scripts/resume"
RESUME_DATA_ENV = "resumeData.env"


def get_repo_root() -> Path:
    """Get the repository root directory."""
    return Path(__file__).parent.parent


def find_resume_file(specified_path: Optional[str] = None) -> Optional[Path]:
    """Find the resume file to upload.

    Args:
        specified_path: Optional path to a specific resume file

    Returns:
        Path to the resume file, or None if not found
    """
    repo_root = get_repo_root()

    # If a specific path was provided, use it
    if specified_path:
        path = Path(specified_path)
        # Handle relative paths
        if not path.is_absolute():
            path = repo_root / path
        if path.exists():
            return path
        print(f"[ERROR] Specified resume file not found: {path}")
        return None

    # Otherwise, find the first .md file in scripts/resume/
    resume_dir = repo_root / RESUME_DIR
    if not resume_dir.exists():
        print(f"[ERROR] Resume directory not found: {resume_dir}")
        print(f"  Create it and add a .md resume file, or specify a path directly")
        return None

    md_files = sorted(resume_dir.glob("*.md"))
    if not md_files:
        print(f"[ERROR] No .md files found in {resume_dir}")
        return None

    if len(md_files) > 1:
        print(f"[INFO] Found {len(md_files)} resume files, using first one:")
        for f in md_files:
            print(f"  - {f.name}")

    return md_files[0]


def load_resume_content(resume_path: Path) -> Optional[str]:
    """Load resume markdown content from file."""
    if not resume_path.exists():
        print(f"[ERROR] Resume file not found: {resume_path}")
        return None

    with open(resume_path, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"[SUCCESS] Loaded resume: {resume_path.name}")
    print(f"  ({len(content)} chars, {len(content.splitlines())} lines)")
    return content


def load_system_prompt() -> Optional[str]:
    """Load system prompt from resumeData.env file.

    Handles the multi-line format:
        SYSTEM_PROMPT="line1
        line2
        line3"
    """
    repo_root = get_repo_root()
    env_path = repo_root / RESUME_DATA_ENV

    if not env_path.exists():
        print(f"[ERROR] Resume data env file not found: {env_path}")
        return None

    with open(env_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find SYSTEM_PROMPT="..." - it's a multi-line quoted string
    marker = 'SYSTEM_PROMPT="'
    if marker not in content:
        print("[ERROR] SYSTEM_PROMPT not found in resumeData.env")
        return None

    # Extract everything between SYSTEM_PROMPT=" and the final "
    start = content.find(marker) + len(marker)
    remaining = content[start:]

    # Find the closing quote - it's the last " in the file for this value
    # Since SYSTEM_PROMPT is the last variable, we can use rfind
    end = remaining.rfind('"')
    if end <= 0:
        print("[ERROR] Could not find closing quote for SYSTEM_PROMPT")
        return None

    system_prompt = remaining[:end]

    # Unescape any escaped quotes within the prompt
    system_prompt = system_prompt.replace('\\"', '"')

    print(f"[SUCCESS] Loaded system prompt ({len(system_prompt)} chars)")
    return system_prompt


def bust_resume_cache(dry_run: bool = False) -> bool:
    """Bust the KV edge cache by hitting the API with a cache-busting query param.

    KV has eventual consistency with edge caching (~60s). After uploading,
    we hit the API once with a unique query param to force a fresh read,
    which populates the edge cache with the new content.
    """
    import time
    import urllib.request
    import urllib.error

    cache_bust_url = f"https://hadoku.me/resume/api/resume?cache_bust={int(time.time())}"

    if dry_run:
        print(f"[DRY RUN] Would bust cache via: {cache_bust_url}")
        return True

    print(f"[INFO] Busting edge cache...")
    try:
        req = urllib.request.Request(cache_bust_url)
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                print(f"[SUCCESS] Edge cache refreshed")
                return True
            else:
                print(f"[WARNING] Cache bust returned status {response.status}")
                return True  # Not a failure, cache will refresh eventually
    except urllib.error.URLError as e:
        print(f"[WARNING] Could not bust cache: {e}")
        return True  # Not a failure, cache will refresh eventually
    except Exception as e:
        print(f"[WARNING] Cache bust error: {e}")
        return True


def upload_resume_to_kv(resume_path: Path, dry_run: bool = False) -> bool:
    """Upload resume content to KV namespace (remote/production)."""
    content = load_resume_content(resume_path)
    if not content:
        return False

    if dry_run:
        print(f"[DRY RUN] Would upload resume to KV:")
        print(f"  Namespace ID: {RESUME_KV_NAMESPACE_ID}")
        print(f"  Key: {RESUME_KV_KEY}")
        print(f"  File: {resume_path}")
        print(f"  Content length: {len(content)} chars")
        print(f"  First 200 chars: {content[:200]}...")
        bust_resume_cache(dry_run=True)
        return True

    print(f"[INFO] Uploading resume to KV namespace (remote)...")
    print(f"  Namespace ID: {RESUME_KV_NAMESPACE_ID}")
    print(f"  Key: {RESUME_KV_KEY}")

    repo_root = get_repo_root()
    worker_path = repo_root / RESUME_WORKER_PATH

    # Use wrangler from the worker directory (where node_modules exists)
    npx_cmd = 'npx.cmd' if os.name == 'nt' else 'npx'

    # Calculate relative path from worker directory to resume file
    resume_rel_path = os.path.relpath(resume_path, worker_path)

    try:
        # Use --remote to ensure we're uploading to production, not local dev
        result = subprocess.run(
            [npx_cmd, 'wrangler', 'kv', 'key', 'put',
             '--namespace-id', RESUME_KV_NAMESPACE_ID,
             RESUME_KV_KEY, '--path', resume_rel_path,
             '--remote'],
            capture_output=True,
            text=True,
            shell=True if os.name == 'nt' else False,
            cwd=worker_path,
            encoding='utf-8',
            errors='replace'
        )

        if result.returncode == 0:
            print(f"[SUCCESS] Resume uploaded to KV")
            # Bust the edge cache so the new content is immediately available
            bust_resume_cache(dry_run)
            return True
        else:
            print(f"[ERROR] Failed to upload resume to KV")
            if result.stderr:
                print(f"  Error: {result.stderr.strip()}")
            if result.stdout:
                print(f"  Output: {result.stdout.strip()}")
            return False

    except Exception as e:
        print(f"[ERROR] Error uploading resume: {e}")
        return False


def upload_system_prompt_secret(prompt: str, dry_run: bool = False) -> bool:
    """Upload system prompt as Cloudflare Worker secret."""
    if dry_run:
        print(f"[DRY RUN] Would upload system prompt as secret:")
        print(f"  Worker: resume-api")
        print(f"  Secret: RESUME_SYSTEM_PROMPT")
        print(f"  Content length: {len(prompt)} chars")
        print(f"  Preview: {prompt[:150]}...")
        return True

    print(f"[INFO] Uploading system prompt to Cloudflare Worker secret...")
    print(f"  Worker: resume-api")
    print(f"  Secret: RESUME_SYSTEM_PROMPT")

    repo_root = get_repo_root()
    worker_path = repo_root / RESUME_WORKER_PATH

    npx_cmd = 'npx.cmd' if os.name == 'nt' else 'npx'

    try:
        result = subprocess.run(
            [npx_cmd, 'wrangler', 'secret', 'put', 'RESUME_SYSTEM_PROMPT'],
            input=prompt,
            capture_output=True,
            text=True,
            shell=True if os.name == 'nt' else False,
            cwd=worker_path,
            encoding='utf-8',
            errors='replace'
        )

        if result.returncode == 0:
            print(f"[SUCCESS] System prompt uploaded as secret")
            return True
        else:
            print(f"[ERROR] Failed to upload system prompt secret")
            if result.stderr:
                print(f"  Error: {result.stderr.strip()}")
            if result.stdout:
                print(f"  Output: {result.stdout.strip()}")
            return False

    except Exception as e:
        print(f"[ERROR] Error uploading system prompt: {e}")
        return False


def upload_groq_api_key(dry_run: bool = False) -> bool:
    """Upload GROQ_API_KEY from resumeData.env as Cloudflare Worker secret."""
    repo_root = get_repo_root()
    env_path = repo_root / RESUME_DATA_ENV

    if not env_path.exists():
        print(f"[ERROR] Resume data env file not found: {env_path}")
        return False

    with open(env_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse GROQ_API_KEY (simple single-line value)
    groq_key = None
    for line in content.split('\n'):
        if line.startswith('GROQ_API_KEY='):
            groq_key = line[len('GROQ_API_KEY='):].strip()
            break

    if not groq_key:
        print("[WARNING] GROQ_API_KEY not found in resumeData.env")
        return True  # Not a failure, just skip

    if dry_run:
        print(f"[DRY RUN] Would upload GROQ_API_KEY as secret:")
        print(f"  Worker: resume-api")
        print(f"  Secret: GROQ_API_KEY")
        print(f"  Key preview: {groq_key[:10]}...{groq_key[-4:]}")
        return True

    print(f"[INFO] Uploading GROQ_API_KEY to Cloudflare Worker secret...")

    worker_path = repo_root / RESUME_WORKER_PATH
    npx_cmd = 'npx.cmd' if os.name == 'nt' else 'npx'

    try:
        result = subprocess.run(
            [npx_cmd, 'wrangler', 'secret', 'put', 'GROQ_API_KEY'],
            input=groq_key,
            capture_output=True,
            text=True,
            shell=True if os.name == 'nt' else False,
            cwd=worker_path,
            encoding='utf-8',
            errors='replace'
        )

        if result.returncode == 0:
            print(f"[SUCCESS] GROQ_API_KEY uploaded as secret")
            return True
        else:
            print(f"[ERROR] Failed to upload GROQ_API_KEY")
            if result.stderr:
                print(f"  Error: {result.stderr.strip()}")
            return False

    except Exception as e:
        print(f"[ERROR] Error uploading GROQ_API_KEY: {e}")
        return False


def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(
        description='Upload resume data to Cloudflare infrastructure',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument(
        'resume_file',
        nargs='?',
        help='Path to resume markdown file (default: first .md in scripts/resume/)'
    )
    parser.add_argument(
        '--resume', '-r',
        action='store_true',
        help='Upload resume markdown to KV only'
    )
    parser.add_argument(
        '--prompt', '-p',
        action='store_true',
        help='Upload system prompt secret only'
    )
    parser.add_argument(
        '--groq', '-g',
        action='store_true',
        help='Upload GROQ_API_KEY secret only'
    )
    parser.add_argument(
        '--dry-run', '-n',
        action='store_true',
        help='Show what would be uploaded without making changes'
    )

    args = parser.parse_args()

    # If no specific flags, do everything
    do_all = not (args.resume or args.prompt or args.groq)

    print("=" * 80)
    print("RESUME DATA INGESTION PIPELINE")
    print("=" * 80)

    if args.dry_run:
        print("\n[DRY RUN MODE] No changes will be made\n")

    success = True
    resume_path = None

    # Find resume file if needed
    if do_all or args.resume:
        resume_path = find_resume_file(args.resume_file)
        if not resume_path:
            success = False

    # Upload resume to KV
    if (do_all or args.resume) and resume_path:
        print("\n" + "-" * 40)
        print("STEP 1: Resume Markdown -> KV")
        print("-" * 40)
        if not upload_resume_to_kv(resume_path, args.dry_run):
            success = False

    # Upload system prompt as secret
    if do_all or args.prompt:
        print("\n" + "-" * 40)
        print("STEP 2: System Prompt -> Worker Secret")
        print("-" * 40)
        prompt = load_system_prompt()
        if prompt:
            if not upload_system_prompt_secret(prompt, args.dry_run):
                success = False
        else:
            success = False

    # Upload GROQ API key as secret
    if do_all or args.groq:
        print("\n" + "-" * 40)
        print("STEP 3: GROQ API Key -> Worker Secret")
        print("-" * 40)
        if not upload_groq_api_key(args.dry_run):
            success = False

    print("\n" + "=" * 80)
    if success:
        print("[SUCCESS] All uploads completed successfully!")
        if not args.dry_run:
            print("\nData locations:")
            print(f"  - Resume: KV namespace {RESUME_KV_NAMESPACE_ID}, key '{RESUME_KV_KEY}'")
            print(f"  - System Prompt: resume-api worker secret 'RESUME_SYSTEM_PROMPT'")
            print(f"  - GROQ API Key: resume-api worker secret 'GROQ_API_KEY'")
    else:
        print("[ERROR] Some uploads failed. Check the errors above.")
    print("=" * 80)

    return 0 if success else 1


if __name__ == '__main__':
    sys.exit(main())
