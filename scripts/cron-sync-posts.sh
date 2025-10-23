#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="/home/ubuntu/landing"
FRONTEND_DIR="${ROOT_DIR}/frontend"
LOG_DIR="${ROOT_DIR}/logs"

mkdir -p "${LOG_DIR}"

export PATH="/home/ubuntu/tools/node-v22.21.0-linux-arm64/bin:${PATH:-}"

cd "${FRONTEND_DIR}"

/home/ubuntu/tools/node-v22.21.0-linux-arm64/bin/npm run sync:posts
