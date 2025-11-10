# Repository Reorganization Plan

## Current State Analysis

### ✅ What's Working Well

1. **Micro-Frontend Structure** (`public/mf/`)
   - Well-organized by feature
   - Each MF has its own bundle and styles
   - Clear registry.json for discovery

2. **Route Organization** (`workers/task-api/src/routes/`)
   - Good separation by feature (boards, tasks, tags, etc.)
   - Consistent naming convention
   - Clear responsibilities

3. **Shared Utilities** (`workers/util/`)
   - Well-structured with index.ts barrel exports
   - Good separation of concerns (auth, validation, logging, etc.)
   - Reusable across workers

### ⚠️ Issues Identified

## 1. **TEST FILES SCATTERED** (High Priority)

### Current Problem:
```
workers/task-api/src/
├── api.test.ts
├── auth.test.ts
├── batch.test.ts
├── data-isolation.test.ts
├── idempotency.test.ts
├── movement.test.ts
├── preferences.test.ts
├── routing.test.ts
├── session-kv.test.ts
├── session.test.ts
├── storage-format.test.ts
├── tag-lifecycle.test.ts
├── tasks.test.ts
├── throttle.test.ts
└── test-utils.ts  <-- Mixed with production code!
```

### Recommended Structure:
```
workers/task-api/
├── src/
│   ├── index.ts
│   ├── constants.ts
│   ├── events.ts
│   ├── kv-keys.ts
│   ├── request-utils.ts
│   ├── session.ts
│   ├── throttle.ts
│   └── routes/
│       ├── admin.ts
│       ├── boards.ts
│       ├── misc.ts
│       ├── preferences.ts
│       ├── route-utils.ts
│       ├── session.ts
│       ├── tags-batch.ts
│       └── tasks.ts
└── test/
    ├── __helpers__/
    │   └── test-utils.ts
    ├── integration/
    │   ├── api.test.ts
    │   ├── session-kv.test.ts
    │   └── storage-format.test.ts
    ├── routes/
    │   ├── routing.test.ts
    │   └── preferences.test.ts
    └── features/
        ├── auth.test.ts
        ├── batch.test.ts
        ├── data-isolation.test.ts
        ├── idempotency.test.ts
        ├── movement.test.ts
        ├── tag-lifecycle.test.ts
        ├── tasks.test.ts
        └── throttle.test.ts
```

**Benefits:**
- Clear separation of test and production code
- Tests organized by type (integration, routes, features)
- Easier to find and maintain tests
- Test utilities clearly marked as helpers

## 2. **DOCUMENTATION SCATTERED** (Medium Priority)

### Current Problem:
```
workers/task-api/
├── ARCHITECTURE.md (worker-specific)
├── ESLINT_ANALYSIS.md (temporary analysis file)
├── src/
│   ├── types-needed.md (should be in docs/)
│   └── testingInstructions.md (should be in docs/)
docs/
├── ARCHITECTURE.md (site-wide)
├── CHILD_APP_TEMPLATE.md
└── PARENT_API_EXPECTATIONS.md
```

### Recommended Structure:
```
docs/
├── architecture/
│   ├── SITE_ARCHITECTURE.md
│   ├── WORKER_ARCHITECTURE.md
│   └── MICRO_FRONTENDS.md
├── development/
│   ├── TESTING_GUIDE.md (from testingInstructions.md)
│   ├── TYPE_REQUIREMENTS.md (from types-needed.md)
│   └── CONTRIBUTION_GUIDE.md
└── templates/
    ├── CHILD_APP_TEMPLATE.md
    └── WORKER_TEMPLATE.md (from workers/WORKER_TEMPLATE.md)
```

**Benefits:**
- All documentation in one place
- Clear categorization
- Easier to maintain and discover
- Remove temporary analysis files

## 3. **SCRIPTS ORGANIZATION** (Medium Priority)

### Current Problem:
```
scripts/
├── administration.py (main CLI)
├── backup-kv.py (legacy?)
├── generate-registry.mjs
├── update-*.mjs (5 bundle update scripts)
├── update-cloudflare-secrets.ps1
└── admin/
    ├── check_secret.py
    ├── d1_key_migration.py
    ├── delete_key_data.py
    ├── key_migration.py
    ├── kv_cleanup.py
    ├── kv_fetch.py
    ├── kv_summary.py
    ├── manage_github_token.py
    └── verify_and_install.py
```

**Issues:**
- Mixed Python and JavaScript
- Unclear which scripts are current vs legacy
- `admin/` subfolder has related functionality to `administration.py`
- Bundle update scripts could be grouped

### Recommended Structure:
```
scripts/
├── admin/
│   ├── administration.py (main CLI)
│   ├── kv/
│   │   ├── backup.py
│   │   ├── cleanup.py
│   │   ├── fetch.py
│   │   └── summary.py
│   ├── keys/
│   │   ├── migration.py
│   │   ├── d1_migration.py
│   │   └── delete.py
│   └── config/
│       ├── check_secret.py
│       ├── manage_github_token.py
│       └── verify_install.py
├── build/
│   ├── generate-registry.mjs
│   ├── update-task-bundle.mjs
│   ├── update-themes-bundle.mjs
│   ├── update-ui-components-bundle.mjs
│   └── update-watchparty-bundle.mjs
└── deployment/
    └── update-cloudflare-secrets.ps1
```

**Benefits:**
- Clear separation by purpose (admin, build, deployment)
- Python scripts grouped by domain
- Easier to find the right script
- Remove duplicate/legacy scripts

## 4. **POTENTIAL CODE DUPLICATION** (Low Priority - Investigate)

### Admin Routes vs Admin Scripts
- `workers/task-api/src/routes/admin.ts` - API endpoints for admin operations
- `scripts/admin/` - CLI tools for admin operations

**Investigation Needed:**
- Are these complementary or duplicate?
- Admin routes = runtime monitoring (throttle status, incidents)
- Admin scripts = offline maintenance (KV backup, key migration)
- **Verdict: Complementary, not duplicate** ✅

### Session/Auth Handling
- `workers/task-api/src/session.ts` - Session management
- `workers/task-api/src/request-utils.ts` - Has some session ID extraction
- `workers/util/auth.ts` - General auth utilities

**Check for:**
- Overlapping session ID extraction logic
- Duplicate validation functions

## 5. **MISSING STRUCTURE** (Enhancement)

### Types Directory
Consider creating a dedicated types directory:
```
workers/task-api/src/
├── types/
│   ├── index.ts
│   ├── api.ts (API response types)
│   ├── session.ts (Session types)
│   ├── throttle.ts (Throttle types)
│   └── external.ts (Types needed from @wolffm/task)
```

### Config Directory
Centralize configuration:
```
workers/task-api/src/
├── config/
│   ├── constants.ts (from root)
│   ├── kv-keys.ts (from root)
│   └── throttle-limits.ts (extracted from throttle.ts)
```

## Recommended Implementation Order

### Phase 1: Test Organization (Immediate) 🔥
1. Create `test/` directory structure
2. Move test files to appropriate subdirectories
3. Move `test-utils.ts` to `test/__helpers__/`
4. Update import paths
5. Update `vitest.config.ts` if needed
6. Run tests to verify

### Phase 2: Documentation (Quick Win) 📚
1. Create `docs/architecture/`, `docs/development/`, `docs/templates/`
2. Move and rename documentation files
3. Update README.md with new doc locations
4. Remove temporary analysis files (ESLINT_ANALYSIS.md)

### Phase 3: Scripts Organization (Medium Effort) 🔧
1. Create subdirectories under `scripts/`
2. Move and organize Python admin scripts
3. Group build scripts
4. Update `administration.py` imports
5. Test all script paths

### Phase 4: Types & Config (Optional Enhancement) ⭐
1. Create `types/` directory
2. Extract and organize type definitions
3. Create `config/` directory
4. Extract configuration constants
5. Update imports across codebase

## Breaking Changes to Consider

### Import Path Changes
After reorganization, imports will change:
```typescript
// Before
import { createTestEnv } from './test-utils';

// After
import { createTestEnv } from '../test/__helpers__/test-utils';
```

### Documentation Links
- Update all internal documentation links
- Update README.md references
- Update GitHub Actions workflows if they reference scripts

## Files That Can Be Deleted

1. **ESLINT_ANALYSIS.md** - Temporary analysis, no longer needed
2. **backup-kv.py** - Check if superseded by `administration.py kv-backup`
3. **admin_keys.txt** - Should this be in `.gitignore`? Seems like sensitive data

## Questions to Resolve

1. **Is `backup-kv.py` still used?** Or fully replaced by `administration.py`?
2. **Should `admin_keys.txt` exist in the repo?** Security concern
3. **Are all bundle update scripts current?** Or are some legacy?
4. **Session ID handling** - Is there duplication between `session.ts` and `request-utils.ts`?

## Success Metrics

- ✅ Zero test files in `src/` directory
- ✅ All documentation in `docs/` hierarchy
- ✅ Scripts grouped by purpose
- ✅ All tests passing after reorganization
- ✅ No duplicate code identified
- ✅ Clear README.md with new structure

---

**Priority: Start with Phase 1 (Test Organization) as it's the most impactful for code maintainability.**
