#!/usr/bin/env bash
set -euo pipefail

# Local test runner for .github/workflows/build-version.yml
# - Computes VERSION like the workflow
# - Updates index.html meta x-build and stylesheet href (?v=VERSION)
# Usage:
#   scripts/ci_build_version_local.sh            # apply with computed version
#   VERSION=2025.09.08+abcdef0 scripts/ci_build_version_local.sh
#   DRY_RUN=1 scripts/ci_build_version_local.sh  # show diff but don't write

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

VERSION="${VERSION:-$(date -u +'%Y.%m.%d')+$(git rev-parse --short=7 HEAD)}"
FILE="index.html"

if [[ ! -f $FILE ]]; then
  echo "index.html not found" >&2
  exit 1
fi

tmp=$(mktemp)
cp "$FILE" "$tmp"

# Update meta x-build
# Use single-quoted sed script with version injected via shell concatenation
sed -i -E 's@(meta name="x-build" content=")([^"]*)(")@\1'"$VERSION"'\3@' "$tmp"

# Ensure stylesheet uses ?v=${VERSION}
sed -i -E 's@(link id="site-css"[^>]*href=")styles\.css(\?v=[^"]*)?"@\1styles.css?v='"$VERSION"'"@' "$tmp"

if [[ "${DRY_RUN:-0}" = 1 ]]; then
  echo "--- Diff (DRY RUN): $FILE -> updated with VERSION=$VERSION" >&2
  diff -u "$FILE" "$tmp" || true
  rm -f "$tmp"
else
  mv "$tmp" "$FILE"
  echo "Updated $FILE with VERSION=$VERSION"
fi
