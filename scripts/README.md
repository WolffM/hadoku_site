# GitHub Token Management Script

A self-contained Python script that manages the distribution of `HADOKU_SITE_TOKEN` across multiple GitHub repositories.

## Features

- ✅ **Self-bootstrapping**: Automatically creates virtual environment and installs dependencies
- ✅ **Token validation**: Verifies the token works before distributing it
- ✅ **Secure updates**: Uses GitHub OAuth for authentication to update secrets
- ✅ **Verification**: Confirms all secrets were successfully updated

## Prerequisites

- Python 3.7+ installed
- A GitHub personal access token with dispatch permissions for `hadoku_site`
- Write access to the target repositories

## Setup

1. Create a `.env` file in the same directory as the script:

```bash
HADOKU_SITE_TOKEN=github_pat_your_token_here
```

2. (Optional) Edit the `TARGET_REPOS` list in `manage_github_token.py` to add/remove repositories

## Usage

Simply run:

```bash
python manage_github_token.py
```

The script will:

1. **Check dependencies**: Create venv and install `requests` and `PyNaCl` if needed
2. **Validate token**: 
   - Check if token exists in `.env`
   - Verify it's a valid GitHub token
   - Test repository access
   - Confirm it can dispatch to `hadoku_site`
3. **Authenticate**: Use GitHub OAuth Device Flow to get temporary credentials
4. **Update secrets**: Distribute the token to all target repositories
5. **Verify**: Confirm all secrets were successfully updated

## What it does

This script distributes your `HADOKU_SITE_TOKEN` to multiple repositories so they can trigger workflows on `hadoku_site` using repository dispatch events, like this:

```yaml
- name: Trigger parent site deployment
  env:
    HADOKU_SITE_TOKEN: ${{ secrets.HADOKU_SITE_TOKEN }}
  run: |
    curl -X POST "https://api.github.com/repos/WolffM/hadoku_site/dispatches" \
      -H "Authorization: Bearer $HADOKU_SITE_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      -d '{"event_type":"task_updated","client_payload":{}}'
```

## Target Repositories

Currently configured to update:
- `WolffM/hadoku-task`
- `WolffM/hadoku-watchparty`

## Security Notes

- The `.env` file contains your personal access token - **never commit it to git**
- The script uses OAuth Device Flow for secret management (requires browser authentication)
- Secrets are encrypted using repository-specific public keys before upload
- The token being distributed should have minimal permissions (only dispatch to `hadoku_site`)

## Troubleshooting

### Token validation fails
- Verify your token in `.env` is correct and not expired
- Check that the token has access to the repositories
- Ensure the token can dispatch to `WolffM/hadoku_site`

### OAuth authentication fails
- Make sure you authorize the device code at https://github.com/login/device
- The OAuth token needs `repo` scope to write secrets

### Updates fail
- Verify you have admin or write access to the target repositories
- Check that GitHub Actions is enabled on the repositories
