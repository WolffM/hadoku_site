# Watchparty UI Integration Status

**Status**: ✅ Ready for Integration  
**Package**: `@wolffm/watchparty-ui@0.1.3`  
**Last Updated**: October 27, 2025

---

## ✅ Completed Setup

All infrastructure is in place to receive the `@wolffm/watchparty-ui` package from the watchparty team.

### 1. Workflow Created ✅
- **File**: `.github/workflows/update-watchparty.yml`
- **Trigger**: `repository_dispatch` with event type `watchparty_ui_updated`
- **Actions**: Updates package, copies bundle, regenerates registry, commits changes
- **Manual trigger**: Available via `workflow_dispatch`

### 2. Bundle Update Script ✅
- **File**: `scripts/update-watchparty-bundle.mjs`
- **Source**: `node_modules/@wolffm/watchparty-ui/dist/`
- **Target**: `public/mf/watchparty/`
- **Files copied**: `index.js`, `style.css`

### 3. Registry Generation Updated ✅
- **File**: `scripts/generate-registry.mjs`
- **Package tracking**: Reads `@wolffm/watchparty-ui` version from `package.json`
- **Cache busting**: Uses package version (e.g., `?v=0.1.3`) instead of timestamp
- **Fallback**: Uses timestamp if package not installed

### 4. Package Scripts ✅
- **File**: `package.json`
- **Scripts added**:
  - `update-watchparty-bundle`: Copies bundle from package
  - `generate-registry`: Generates registry with version tracking
  - `prebuild`: Runs both bundle updates before build

### 5. GitHub Packages Auth ✅
- **File**: `.npmrc`
- **Registry**: Configured for `@wolffm` scope → GitHub Packages
- **Token**: Uses `GITHUB_TOKEN` env var (set in CI)

### 6. Required Secrets ✅
Verify these secrets exist in repository settings:
- ✅ `HADOKU_SITE_TOKEN` - For committing changes
- ✅ `DEPLOY_PACKAGE_TOKEN` - For reading GitHub Packages

---

## 🧪 Testing Checklist

### When Package is Published

Once watchparty team publishes `@wolffm/watchparty-ui@0.1.3`:

#### Step 1: Manual Installation Test
```bash
# Install the package
pnpm add @wolffm/watchparty-ui@latest

# Copy bundle files
pnpm run update-watchparty-bundle

# Regenerate registry
pnpm run generate-registry

# Verify files
ls public/mf/watchparty/
# Expected: index.js, style.css

# Check registry
cat public/mf/registry.json | jq '.watchparty'
# Expected: version-based URLs like ?v=0.1.3
```

#### Step 2: Test Workflow Trigger
```bash
# Trigger manually via GitHub CLI
gh workflow run update-watchparty.yml

# Or simulate repository_dispatch
gh api repos/WolffM/hadoku_site/dispatches \
  -f event_type=watchparty_ui_updated \
  -f client_payload[package]=@wolffm/watchparty-ui \
  -f client_payload[version]=0.1.3
```

#### Step 3: Verify Automation
- [ ] Workflow runs successfully
- [ ] Package updates to latest version
- [ ] Bundle files copy to `public/mf/watchparty/`
- [ ] Registry regenerates with version
- [ ] Changes commit and push automatically
- [ ] Deployment workflow triggers

#### Step 4: Production Test
- [ ] Visit `https://hadoku.me/watchparty`
- [ ] Verify new version loads
- [ ] Check browser network tab for cache-busting version
- [ ] Test mount/unmount functionality

---

## 📋 Integration Requirements Met

Based on watchparty team's `PARENT_INTEGRATION_GUIDE.md`:

| Requirement | Status | Notes |
|-------------|--------|-------|
| `.npmrc` with GitHub Packages | ✅ | Created |
| Workflow `update-watchparty-ui.yml` | ✅ | Created as `update-watchparty.yml` |
| Script `update-watchparty-bundle.mjs` | ✅ | Created |
| Registry version tracking | ✅ | Updated `generate-registry.mjs` |
| Package scripts | ✅ | Added to `package.json` |
| Event type `watchparty_ui_updated` | ✅ | Configured in workflow |
| Package name `@wolffm/watchparty-ui` | ✅ | All references updated |
| Secrets verification | ✅ | Documented |

---

## 🔄 Expected Deployment Flow

Once integrated:

1. **Developer pushes** to `hadoku-watchparty` main branch
2. **Husky auto-bumps** version (e.g., `0.1.3` → `0.1.4`)
3. **Tests run** via pre-commit hook
4. **Package publishes** to GitHub Packages
5. **Dispatch triggers** to `hadoku_site` with event `watchparty_ui_updated`
6. **Workflow runs** in `hadoku_site`:
   - Installs `@wolffm/watchparty-ui@latest`
   - Copies bundle to `public/mf/watchparty/`
   - Regenerates registry with new version
   - Commits and pushes changes
7. **Deployment workflow** triggers (existing CD pipeline)
8. **Site deploys** with new watchparty version

**Total time**: ~5-10 minutes from push to production

---

## 🚨 Known Issues / Caveats

### None Currently

All infrastructure matches the watchparty team's expectations based on their integration guide.

---

## 📝 Next Steps

### For Parent (hadoku_site) Team - DONE ✅
- [x] Create workflow file
- [x] Create bundle update script
- [x] Update registry generation
- [x] Add package scripts
- [x] Create `.npmrc` file
- [x] Verify secrets exist

### For Watchparty Team - PENDING ⏳
- [ ] Publish first package to GitHub Packages (`@wolffm/watchparty-ui@0.1.3`)
- [ ] Verify package exports `mount` and `unmount` functions
- [ ] Test `repository_dispatch` trigger works
- [ ] Coordinate first integration test

### For Both Teams - PENDING ⏳
- [ ] Run manual installation test (Step 1 above)
- [ ] Test workflow automation (Step 2 above)
- [ ] Verify end-to-end flow (Step 3 above)
- [ ] Production verification (Step 4 above)

---

## 📞 Contact Points

### Questions About Parent Setup?
- Files to review:
  - `.github/workflows/update-watchparty.yml`
  - `scripts/update-watchparty-bundle.mjs`
  - `scripts/generate-registry.mjs`
  - `.npmrc`

### Ready to Test?
1. Watchparty team publishes package
2. Share package version (e.g., `0.1.3`)
3. Parent team runs manual test
4. Both teams verify automation

---

## 🔗 Related Documentation

- **Parent Integration Guide**: `docs/PARENT_INTEGRATION_GUIDE.md` (from watchparty team)
- **Migration Guide**: `docs/WATCHPARTY_PACKAGE_MIGRATION.md` (detailed migration plan)
- **Architecture**: `docs/ARCHITECTURE.md` (overall system design)
- **Child App Template**: `docs/CHILD_APP_TEMPLATE.md` (general pattern)

---

**Integration Status**: ✅ Parent is ready. Waiting for watchparty team to publish `@wolffm/watchparty-ui@0.1.3`
