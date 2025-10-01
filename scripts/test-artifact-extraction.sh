#!/usr/bin/env bash
set -euo pipefail

# This script simulates the logic in .github/workflows/deploy.yml that
# downloads and extracts micro-frontend build artifacts. It verifies that
# archives with or without a nested top-level directory are handled
# correctly without hitting duplicate file extraction issues.

# Create an isolated temporary working directory so the repository files
# are not modified during the simulation.
work_root=$(mktemp -d)
trap 'rm -rf "$work_root"' EXIT
mkdir -p "$work_root/public/mf"

create_zip() {
  local artifact="$1"
  local has_nested_dir="$2"
  local tmp_dir
  tmp_dir=$(mktemp -d)

  if [[ "$has_nested_dir" == "true" ]]; then
    local nested_dir="$tmp_dir/${artifact}-dist"
    mkdir -p "$nested_dir"
    echo "console.log(\"${artifact} nested\");" > "$nested_dir/index.js"
    echo "body { background: ${artifact}; }" > "$nested_dir/style.css"
    (cd "$tmp_dir" && zip -qr "${artifact}-dist.zip" "${artifact}-dist")
  else
    echo "console.log(\"${artifact} flat\");" > "$tmp_dir/index.js"
    echo "body { background: ${artifact}; }" > "$tmp_dir/style.css"
    (cd "$tmp_dir" && zip -qr "${artifact}-dist.zip" index.js style.css)
  fi

  printf '%s' "$tmp_dir/${artifact}-dist.zip"
}

extract_artifact() {
  local artifact="$1"
  local zip_path="$2"

  (cd "$work_root" && \
    temp_dir=$(mktemp -d) && \
    trap 'rm -rf "$temp_dir"' RETURN && \
    cp "$zip_path" "$temp_dir/${artifact}-dist.zip" && \
    unzip -qo "$temp_dir/${artifact}-dist.zip" -d "$temp_dir/extracted" && \
    contents_dir="$temp_dir/extracted" && \
    if [[ -d "$temp_dir/extracted/${artifact}-dist" ]]; then \
      contents_dir="$temp_dir/extracted/${artifact}-dist"; \
    fi && \
    rm -rf "./public/mf/${artifact}" && \
    mkdir -p "./public/mf/${artifact}" && \
    shopt -s dotglob && \
    cp -a "$contents_dir"/* "./public/mf/${artifact}/" && \
    shopt -u dotglob && \
    ls -1 "./public/mf/${artifact}")
}

run_case() {
  local artifact="$1"
  local description="$2"
  local has_nested_dir="$3"

  echo "--- Testing ${artifact} artifact (${description}) ---"
  local zip_path
  zip_path=$(create_zip "$artifact" "$has_nested_dir")
  extract_artifact "$artifact" "$zip_path" > /dev/null
  echo "Success: ${artifact} artifact (${description})"
}

run_case "task" "nested directory" "true"
run_case "task" "flat archive" "false"
run_case "watchparty" "nested directory" "true"
run_case "watchparty" "flat archive" "false"

echo "All extraction scenarios completed successfully in $work_root"
