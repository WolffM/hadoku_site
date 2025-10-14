#!/usr/bin/env bash
# Setup script for edge-router KV namespace

set -e

echo "Creating SESSIONS_KV namespace for edge-router..."

cd workers/edge-router

echo ""
echo "=== Production Namespace ==="
wrangler kv:namespace create SESSIONS_KV

echo ""
echo "=== Preview Namespace ==="
wrangler kv:namespace create SESSIONS_KV --preview

echo ""
echo "✓ Done! Copy the IDs from above into workers/edge-router/wrangler.toml"
echo ""
echo "Replace these lines:"
echo "  id = \"CREATE_THIS_KV_NAMESPACE\""
echo "  preview_id = \"CREATE_THIS_KV_NAMESPACE_PREVIEW\""
echo ""
echo "with the IDs printed above, then run:"
echo "  cd workers/edge-router && wrangler deploy"
