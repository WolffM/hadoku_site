# Automated Deployment Workflow Setup

This guide sets up automatic deployment where pushing to `hadoku-watchparty` triggers a rebuild of `hadoku_site`.

## Architecture

```
hadoku-watchparty (push to main)
    ↓
  Build UI → Commit dist/ → Purge CDN cache
    ↓
  Trigger hadoku_site via repository_dispatch
    ↓
hadoku_site rebuilds and deploys to GitHub Pages
```

## Setup Instructions

### Authentication Options Comparison

| Method | Security | Setup Complexity | Maintenance | Best For |
|--------|----------|------------------|-------------|----------|
| **Fine-grained PAT** ⭐ | High - Scoped to specific repos | Easy (5 min) | Renew every 90-365 days | Personal projects, quick setup |
| Classic PAT | Medium - Broad access | Easy (3 min) | Renew every 90 days | Legacy, less secure |
| **GitHub App** 🏆 | Highest - App-level isolation | Complex (15-30 min) | **None - never expires!** | Production, set-and-forget |

**Important Note:** The token is used **on every workflow run**, not just for setup. When it expires, auto-deployment stops working until you renew it.

**Recommendation for your use case:** 
- **Quick start:** Fine-grained PAT with 1-year expiration (renew annually)
- **Long-term/production:** GitHub App (set up once, never worry about expiration)

### Step 1: Create GitHub Fine-Grained Personal Access Token (Recommended)

**Why fine-grained?** More secure - you can limit access to specific repositories only.

1. Go to GitHub Settings → Developer Settings → Personal Access Tokens → **Fine-grained tokens**
   - Direct link: https://github.com/settings/tokens?type=beta
2. Click "Generate new token"
3. Configure:
   - **Token name**: `hadoku-watchparty-to-site-trigger`
   - **Expiration**: 90 days (or 1 year for less maintenance)
     - ⚠️ **Important**: This token is used **every time** the workflow runs, not just once!
     - The workflow uses it to trigger hadoku_site on every push
     - When it expires, your auto-deployment will stop working
     - You'll need to generate a new token and update the secret
   - **Resource owner**: Your account (WolffM)
   - **Repository access**: "Only select repositories"
     - Select **only** `hadoku_site`
   - **Repository permissions**:
     - Contents: Read and write (for repository_dispatch)
     - Metadata: Read (automatically selected)
4. Click "Generate token" and **copy it immediately** (you can't see it again!)

**Alternative (Classic - Less Secure):**
If you prefer the classic token:
- Go to: https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Select scopes: `repo` + `workflow`
- This gives broader access - fine-grained is better!

### Step 2: Add Secret to hadoku-watchparty Repository

1. Go to `https://github.com/WolffM/hadoku-watchparty/settings/secrets/actions`
2. Click "New repository secret"
3. Name: `HADOKU_SITE_TRIGGER_TOKEN`
4. Value: Paste the token from Step 1
5. Click "Add secret"

### Step 3: Create Workflow in hadoku-watchparty

Create `.github/workflows/build-ui.yml` in the **hadoku-watchparty** repository:

```yaml
name: Build and Publish UI

on:
  push:
    branches: [ main ]
    paths:
      - 'apps/ui/**'
      - 'packages/**'
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build shared package
        run: pnpm --filter @watchparty/shared build
      
      - name: Build UI
        run: pnpm --filter watchparty-ui build
      
      - name: Commit dist files
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add apps/ui/dist/
          git diff --staged --quiet || git commit -m "chore: build watchparty UI [skip ci]"
          git push
      
      - name: Purge jsDelivr cache
        run: |
          curl -f "https://purge.jsdelivr.net/gh/${{ github.repository }}@main/apps/ui/dist/index.js" || echo "Cache purge failed but continuing"
      
      - name: Trigger hadoku_site deployment
        run: |
          curl -X POST \
            -H "Accept: application/vnd.github.v3+json" \
            -H "Authorization: token ${{ secrets.HADOKU_SITE_TRIGGER_TOKEN }}" \
            https://api.github.com/repos/WolffM/hadoku_site/dispatches \
            -d '{"event_type":"watchparty_updated","client_payload":{"commit":"${{ github.sha }}"}}'
```

### Step 4: Verify hadoku_site Workflow (Already Done ✅)

The `hadoku_site/.github/workflows/deploy.yml` has been updated to listen for the `repository_dispatch` event.

## How It Works

### When you push to hadoku-watchparty:

1. **GitHub Actions builds the UI**
   - Installs dependencies with pnpm
   - Builds the watchparty UI to `apps/ui/dist/index.js`
   
2. **Commits the dist files back to the repo**
   - Uses `[skip ci]` to prevent infinite loops
   - Pushes the built files to the main branch

3. **Purges jsDelivr CDN cache**
   - Forces the CDN to fetch the new version
   - Your site will immediately serve the latest build

4. **Triggers hadoku_site rebuild**
   - Sends a `repository_dispatch` event to hadoku_site
   - hadoku_site workflow runs automatically
   - Deploys the updated site to GitHub Pages

### Timeline:
- **hadoku-watchparty build**: ~2-3 minutes
- **CDN cache purge**: instant
- **hadoku_site rebuild**: ~1-2 minutes
- **Total**: ~3-5 minutes from commit to live

## Testing the Workflow

### Manual Trigger (Testing)
1. Go to hadoku-watchparty → Actions → "Build and Publish UI"
2. Click "Run workflow" → "Run workflow"
3. Watch both repositories update

### Automatic Trigger
1. Make a change in `hadoku-watchparty/apps/ui/src/`
2. Commit and push to main
3. Check Actions tab in both repos
4. Visit `https://hadoku.me/watchparty/` after ~5 minutes

## Troubleshooting

### Build fails in hadoku-watchparty
- Check the Actions logs for errors
- Ensure pnpm workspace is configured correctly
- Verify the build command works locally

### hadoku_site doesn't trigger
- Verify `HADOKU_SITE_TRIGGER_TOKEN` secret is set
- Check that the token has `repo` and `workflow` scopes
- Look for curl errors in the workflow logs

### Old version still showing
- CDN cache may take a few minutes to purge
- Try force-refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check that dist files were committed to hadoku-watchparty

### Infinite build loop
- Ensure commit message includes `[skip ci]`
- Check that the workflow only triggers on `apps/ui/**` paths

## Alternative: Manual Deployment

If you prefer manual control, you can:
1. Remove the `repository_dispatch` trigger from hadoku_site
2. Manually trigger hadoku_site deployment from the Actions tab
3. Or just let the CDN cache purge work (hadoku_site doesn't need to rebuild unless you want to)

## Alternative: Using GitHub App (Most Secure)

For production use, consider creating a **GitHub App** instead of a personal access token:

### Benefits:
- ✅ Doesn't use your personal credentials
- ✅ Survives if you leave the organization
- ✅ More granular permissions
- ✅ Better audit logging
- ✅ **No expiration issues** - tokens never expire!
- ✅ Set it up once and forget about it

### Setup:
1. Go to: https://github.com/settings/apps/new
2. Configure:
   - **App name**: `hadoku-deployment-bot`
   - **Homepage URL**: `https://hadoku.me`
   - **Webhook**: Uncheck "Active"
   - **Repository permissions**:
     - Contents: Read & write
     - Metadata: Read only
   - **Where can this GitHub App be installed?**: Only on this account
3. Create the app
4. Generate a private key (download and store securely)
5. Install the app on both repositories
6. Use a GitHub Action like `tibdex/github-app-token@v1` to generate installation tokens

### Workflow changes:
```yaml
- name: Generate token
  id: generate-token
  uses: tibdex/github-app-token@v1
  with:
    app_id: ${{ secrets.APP_ID }}
    private_key: ${{ secrets.APP_PRIVATE_KEY }}

- name: Trigger hadoku_site deployment
  run: |
    curl -X POST \
      -H "Authorization: token ${{ steps.generate-token.outputs.token }}" \
      https://api.github.com/repos/WolffM/hadoku_site/dispatches \
      -d '{"event_type":"watchparty_updated"}'
```

This is more complex but significantly more secure for long-term use.

---

## Security Best Practices

### Token Management:
1. **Set expiration dates** - Rotate tokens every 90-365 days
   - **90 days**: GitHub's recommended maximum for fine-grained tokens
   - **1 year**: Less frequent rotation (more convenient, slightly less secure)
   - **No expiration**: Not available for fine-grained tokens (by design for security)
2. **The token is used on every workflow run** - not just initial setup!
   - Every push to hadoku-watchparty uses the token to trigger hadoku_site
   - When the token expires, you'll need to update the secret with a new one
3. **Set a calendar reminder** - Renew 1 week before expiration
   - Go to: https://github.com/WolffM/hadoku-watchparty/settings/secrets/actions
   - Update `HADOKU_SITE_TRIGGER_TOKEN` with a new token
   - Takes 2 minutes, no code changes needed
4. **Principle of least privilege** - Only grant permissions you need
5. **Scope to specific repos** - Use fine-grained tokens
6. **Monitor usage** - Check GitHub's security log regularly
7. **Revoke compromised tokens immediately** - Settings → Developer Settings → Tokens

### GitHub Secrets:
- ✅ Never commit tokens to your repository
- ✅ Use GitHub Secrets (encrypted at rest)
- ✅ Secrets are redacted in logs automatically
- ✅ Only accessible during workflow execution

### Workflow Security:
```yaml
# Good: Require approval for external triggers
repository_dispatch:
  types: [watchparty_updated]

# Good: Validate payload
- name: Validate trigger
  run: |
    if [ -z "${{ github.event.client_payload.commit }}" ]; then
      echo "Invalid payload"
      exit 1
    fi
```

---

## Cost Considerations

- GitHub Actions: 2,000 minutes/month free (plenty for this workflow)
- GitHub Pages: Free for public repositories
- jsDelivr CDN: Free, unlimited bandwidth
