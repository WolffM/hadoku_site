# Quick Setup: Fine-Grained Token (5 minutes)

## ⚠️ Important: Token Usage

**The token is used on EVERY workflow run** - not just for initial setup!
- Every time you push to hadoku-watchparty, the workflow uses this token
- When the token expires, auto-deployment stops working
- **Recommendation**: Set expiration to **1 year** (less maintenance) or use GitHub App for permanent solution

## Step-by-Step

### 1. Create Token
🔗 https://github.com/settings/tokens?type=beta

Click "Generate new token"

**Settings:**
```
Name: hadoku-watchparty-to-site-trigger
Expiration: Custom - 1 year (365 days recommended)
  💡 Why 1 year? Less maintenance, only renew once per year
  ⚠️ Set calendar reminder to renew 1 week before expiration!
Repository access: Only select repositories
  ✓ hadoku_site
Permissions:
  Contents: Read and write
```

**Copy the token** (starts with `github_pat_...`)

### 2. Add to hadoku-watchparty Secrets
🔗 https://github.com/WolffM/hadoku-watchparty/settings/secrets/actions

Click "New repository secret"

```
Name: HADOKU_SITE_TRIGGER_TOKEN
Secret: <paste your token>
```

### 3. Create Workflow in hadoku-watchparty

Copy from: `hadoku_site/docs/workflow-for-hadoku-watchparty.yml`

To: `hadoku-watchparty/.github/workflows/build-ui.yml`

### 4. Test

Push any change to `hadoku-watchparty/apps/ui/src/`

Watch:
- hadoku-watchparty Actions: https://github.com/WolffM/hadoku-watchparty/actions
- hadoku_site Actions: https://github.com/WolffM/hadoku_site/actions

### 5. Done! 🎉

Your workflow:
```
Edit code → git push → wait 5 min → live on hadoku.me
```

---

## Troubleshooting

### "Resource not accessible by personal access token"
❌ Token doesn't have `Contents: Read and write` permission
✅ Recreate token with correct permissions

### "Workflow didn't trigger"
❌ Token expired or secret not set
✅ Check token expiration, verify secret name matches

### "Build failed"
❌ Check the Actions tab logs
✅ Test build locally first: `pnpm build`

---

## Token Renewal (Once per year with 1-year token)

**When your token expires, auto-deployment will stop working.** Here's how to renew:

1. Generate new token with same settings (5 min)
2. Go to: https://github.com/WolffM/hadoku-watchparty/settings/secrets/actions
3. Edit `HADOKU_SITE_TRIGGER_TOKEN` → Update value
4. Done! No code changes needed.

**💡 Pro tip:** Set a calendar reminder for 1 week before expiration date.

## Alternative: GitHub App (Zero Maintenance)

If you don't want to deal with token expiration:
- Tokens from GitHub Apps **never expire**
- Takes 15-30 min to set up initially
- Then forget about it forever
- See full guide: `AUTOMATED_DEPLOYMENT.md`

---

## Troubleshooting
