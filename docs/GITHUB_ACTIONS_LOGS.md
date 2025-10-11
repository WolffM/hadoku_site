# GitHub Actions Logs - Quick Reference

This guide shows you how to download GitHub Actions workflow logs for debugging.

## Prerequisites

Make sure you have GitHub CLI installed and authenticated:

```powershell
# Check if gh is installed
gh --version

# Authenticate (if needed)
gh auth login
```

## Quick Commands

### 1. List Recent Workflow Runs

```powershell
# See all recent runs
gh run list --limit 10

# Filter by workflow name
gh run list --workflow "Deploy to GitHub Pages" --limit 5
gh run list --workflow "Deploy Cloudflare Workers" --limit 5

# Filter by status
gh run list --status failure --limit 10
```

### 2. View Logs in Terminal

```powershell
# View logs for a specific run
gh run view <RUN_ID> --log

# Example
gh run view 18435824505 --log
```

### 3. Download Logs to Files

```powershell
# Create logs directory if it doesn't exist
mkdir -p logs

# Download logs for a specific run
gh run view <RUN_ID> --log > logs/workflow-<RUN_ID>.log

# Download latest failed runs
gh run list --status failure --limit 1 --json databaseId --jq '.[0].databaseId' | ForEach-Object { gh run view $_ --log > logs/latest-failure.log }
```

### 4. Useful One-Liners

```powershell
# Get the most recent failed GitHub Pages deployment log
gh run list --workflow "Deploy to GitHub Pages" --status failure --limit 1 --json databaseId --jq '.[0].databaseId' | ForEach-Object { gh run view $_ --log > logs/deploy-pages-latest.log }

# Get the most recent failed Cloudflare Workers deployment log
gh run list --workflow "Deploy Cloudflare Workers" --status failure --limit 1 --json databaseId --jq '.[0].databaseId' | ForEach-Object { gh run view $_ --log > logs/deploy-workers-latest.log }

# Get ALL recent logs (last 5 runs)
gh run list --limit 5 --json databaseId,name,conclusion --jq '.[] | "\(.databaseId) \(.name) \(.conclusion)"' | ForEach-Object {
    $parts = $_ -split ' ', 3
    $id = $parts[0]
    $name = $parts[1] -replace ' ', '-'
    gh run view $id --log > "logs/$name-$id.log"
}
```

## Common Workflows

### Debugging a Failed Deployment

1. List recent failures:
   ```powershell
   gh run list --status failure --limit 5
   ```

2. Download the log:
   ```powershell
   gh run view <RUN_ID> --log > logs/debug.log
   ```

3. Open in your editor and search for errors:
   - Look for `ERROR`, `FAIL`, `401`, `404`, etc.

### Comparing Two Runs

```powershell
# Download both logs
gh run view <OLD_RUN_ID> --log > logs/run-old.log
gh run view <NEW_RUN_ID> --log > logs/run-new.log

# Use your favorite diff tool
code --diff logs/run-old.log logs/run-new.log
```

## Troubleshooting

### "gh: command not found"

Install GitHub CLI:
- **Windows:** `winget install --id GitHub.cli`
- **macOS:** `brew install gh`
- **Linux:** See https://github.com/cli/cli/blob/trunk/docs/install_linux.md

### Authentication Issues

```powershell
# Re-authenticate
gh auth login

# Check current auth status
gh auth status
```

### Rate Limiting

If you hit GitHub API rate limits, wait a few minutes or authenticate with a token that has higher limits.

## Tips

- Add `logs/` to your `.gitignore` so logs don't get committed
- Use descriptive filenames when saving logs: `logs/deploy-pages-2025-10-11.log`
- Keep logs temporarily for debugging, then delete them to save space
- Search logs with `grep`, `Select-String`, or your editor's search function

## Example: Full Debugging Session

```powershell
# 1. Create logs directory
mkdir -p logs

# 2. See what failed
gh run list --status failure --limit 5

# 3. Download the logs
gh run view 18435824505 --log > logs/debug-session.log

# 4. Search for errors
Select-String -Path logs/debug-session.log -Pattern "error|fail|401|404" -Context 2,2

# 5. Fix the issue, commit, and push

# 6. Monitor the new run
gh run watch
```

---

**Last Updated:** October 11, 2025
