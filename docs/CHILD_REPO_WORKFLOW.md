# Updated Child Repo Workflow (No PAT Required!)

This workflow uploads artifacts and triggers hadoku_site deployment **without** needing `HADOKU_SITE_TOKEN` in the child repo.

## Benefits
- ✅ No secrets needed in child repos
- ✅ Uses default `GITHUB_TOKEN` (auto-generated, never expires)
- ✅ PAT only stored in hadoku_site (one place to update)
- ✅ Simpler, more secure

## Example: hadoku-watchparty

```yaml
# .github/workflows/build-ui.yml
name: Build and Deploy UI

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  actions: write  # Needed to upload artifacts

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build UI
        run: npm run build
        working-directory: apps/ui
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: watchparty-dist
          path: apps/ui/dist/
          retention-days: 1
      
      - name: Trigger hadoku_site deployment
        run: |
          curl -X POST \
            -H "Accept: application/vnd.github.v3+json" \
            -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" \
            https://api.github.com/repos/WolffM/hadoku_site/dispatches \
            -d '{
              "event_type": "watchparty_updated",
              "client_payload": {
                "run_id": "${{ github.run_id }}",
                "sha": "${{ github.sha }}",
                "ref": "${{ github.ref }}"
              }
            }'
      
      - name: Deployment triggered
        run: |
          echo "✓ Build artifacts uploaded"
          echo "✓ Triggered hadoku_site deployment"
          echo "Visit https://github.com/WolffM/hadoku_site/actions to monitor deployment"
```

## For Other Apps

Just change these values:

### Task App (hadoku-task):
```yaml
- name: Upload build artifacts
  with:
    name: task-dist  # ← Change this
    path: dist/

- name: Trigger hadoku_site deployment
  run: |
    curl ... -d '{
      "event_type": "task_updated",  # ← Change this
      ...
    }'
```

### Contact App:
```yaml
- name: Upload build artifacts
  with:
    name: contact-dist  # ← Change this

- name: Trigger deployment
  run: |
    curl ... -d '{"event_type": "contact_updated", ...}'  # ← Change this
```

## How It Works

1. **Child repo builds** → Uploads artifact to GitHub Actions
2. **Child repo triggers** → Sends `repository_dispatch` to hadoku_site
3. **hadoku_site receives event** → Downloads artifact using `HADOKU_SITE_TOKEN`
4. **hadoku_site builds & deploys** → Includes new child files

## Migration Steps

### 1. Update child repo workflow
Replace `.github/workflows/build-ui.yml` with the new version above.

### 2. Remove HADOKU_SITE_TOKEN secret from child repo
The child repo no longer needs it! You can delete it from the child repo's secrets.

### 3. Ensure HADOKU_SITE_TOKEN exists in hadoku_site
Make sure `hadoku_site` repository has the `HADOKU_SITE_TOKEN` secret with a PAT that has:
- ✅ `actions:read` permission (to download artifacts)
- ✅ `contents:write` permission (optional, for future features)

### 4. Test the workflow
Push to your child repo and verify:
- ✅ Build artifacts are uploaded
- ✅ hadoku_site deployment is triggered
- ✅ New files appear at hadoku.me

## Troubleshooting

### "Resource not accessible by integration"
- Make sure `permissions: actions: write` is set in the child workflow

### "Artifact not found"
- Check that the artifact name matches in both repos
- Verify `retention-days` hasn't expired (default: 1 day)

### "Repository dispatch failed"
- Verify the child repo has `secrets.GITHUB_TOKEN` (it's automatic)
- Check the repository name is correct: `WolffM/hadoku_site`

## Advanced: Matrix Build for Multiple Apps

If you have multiple apps in one repo:

```yaml
strategy:
  matrix:
    app: [app1, app2, app3]

steps:
  - name: Build ${{ matrix.app }}
    run: npm run build
    working-directory: apps/${{ matrix.app }}
  
  - name: Upload ${{ matrix.app }}
    uses: actions/upload-artifact@v3
    with:
      name: ${{ matrix.app }}-dist
      path: apps/${{ matrix.app }}/dist/
```
