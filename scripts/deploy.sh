#!/usr/bin/env bash
# Build the landing page and push it to the server. Run from the repo root on
# the machine that has Node; the server only serves dist/ from nginx.
set -eu

DEPLOY_HOST="${DEPLOY_HOST:?set DEPLOY_HOST to an ssh host alias, e.g. oracle-ubuntu}"
DEPLOY_TARGET="${DEPLOY_TARGET:-landing}"

if [ -n "$(git status --porcelain)" ]; then
  echo "working tree is not clean; commit or stash first" >&2
  exit 1
fi

npm ci
npm run test
npm run lint
npm run build

rsync -az --delete -e ssh dist/ "${DEPLOY_HOST}:${DEPLOY_TARGET}/dist/"

ssh "$DEPLOY_HOST" "cd ${DEPLOY_TARGET} && docker compose -p landing -f deploy/docker-compose.yml up -d"

echo "deployed: $(grep -o 'content="[^"]*" name="x-build"' dist/index.html)"
