# Setup Checklist

Quick reference checklist for setting up and maintaining hadoku_site.

## ✅ Initial Setup (First Time Only)

- [ ] Clone repository: `git clone https://github.com/WolffM/hadoku_site.git`
- [ ] Copy `.env.example` to `.env` and fill in all values
- [ ] Copy `.npmrc.example` to `.npmrc` and add your token
- [ ] Run verification: `python scripts/verify_and_install.py`
- [ ] Install dependencies: `npm install`
- [ ] Upload secrets to GitHub: `python scripts/manage_github_token.py --mode=cloudflare`
- [ ] Test build: `npm run build`

## 🔄 When Tokens Change

- [ ] Update token in `.env` file
- [ ] Update token in `.npmrc` file (if it's DEPLOY_PACKAGE_TOKEN)
- [ ] Run verification: `python scripts/verify_and_install.py`
- [ ] Upload to GitHub: `python scripts/manage_github_token.py --mode=cloudflare`
- [ ] Test: `npm install` (should succeed)

## 🚀 Before Deploying

- [ ] Ensure all tests pass locally: `npm run build`
- [ ] Check that `package-lock.json` is committed
- [ ] Verify GitHub Secrets are up to date: `gh secret list`
- [ ] Push to main branch
- [ ] Monitor workflow: `gh run watch` or check GitHub Actions tab

## 🔧 Troubleshooting Checklist

### Package Installation Fails (401 Unauthorized)

- [ ] Check `.npmrc` file exists and has valid token
- [ ] Verify token: `python scripts/verify_and_install.py`
- [ ] Check token scopes include `read:packages`
- [ ] Try: `npm cache clean --force` then `npm install`

### GitHub Actions Workflow Fails

- [ ] Check workflow logs: `gh run list` then `gh run view <id> --log`
- [ ] Verify GitHub Secrets exist: `gh secret list`
- [ ] Check token scopes match requirements
- [ ] Re-upload secrets: `python scripts/manage_github_token.py --mode=cloudflare`

### Package Lock Out of Sync

- [ ] Delete `node_modules/` and `package-lock.json`
- [ ] Ensure `.npmrc` has valid token
- [ ] Run: `npm install`
- [ ] Commit updated `package-lock.json`
- [ ] Push changes

### Auto-Update Not Working

- [ ] Verify child repo has `HADOKU_SITE_TOKEN` secret
- [ ] Check child repo's workflow sends `repository_dispatch` event
- [ ] Test manually: `gh workflow run update-packages.yml`
- [ ] Check workflow logs for errors

## 📋 Regular Maintenance

### Monthly
- [ ] Review and rotate tokens if needed
- [ ] Check for dependency updates: `npm outdated`
- [ ] Review GitHub Actions usage/costs

### After Each Child Repo Update
- [ ] Verify auto-update workflow ran successfully
- [ ] Check that `package.json` and `package-lock.json` were updated
- [ ] Verify deployment succeeded

## 🔐 Required Token Scopes

| Token | Scopes | Used For |
|-------|--------|----------|
| HADOKU_SITE_TOKEN | `repo`, `write:packages` | Child repos to trigger updates |
| DEPLOY_PACKAGE_TOKEN | `read:packages`, `repo` | Download private packages |
| CLOUDFLARE_API_TOKEN | (Cloudflare Dashboard) | Deploy workers |

## 📞 Getting Help

- [ ] Check `SETUP.md` for detailed instructions
- [ ] Check `scripts/README.md` for script documentation
- [ ] Check `docs/` directory for architecture and guides
- [ ] Review workflow logs: `gh run view <id> --log`
- [ ] Check GitHub Actions logs online

---

**Quick Commands:**

```bash
# Verify setup
python scripts/verify_and_install.py

# Update GitHub secrets
python scripts/manage_github_token.py --mode=cloudflare

# Install dependencies
npm install

# Build project
npm run build

# Check workflow status
gh run list

# View workflow logs
gh run view <run-id> --log

# Trigger manual deployment
gh workflow run deploy.yml
```
