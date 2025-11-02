# deploy Agent Guide

## Package Identity
- Legacy Docker Compose manifests and nginx configs for serving the static landing bundle and (optionally) a Ghost blog.
- Treated as reference infrastructure—coordinate with ops before changing.

## Setup & Run
- `docker compose -f deploy/docker-compose.yml up -d` – serve the built `frontend/dist` bundle via nginx.
- `docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.local.yml up` – include localhost port exposure.
- `docker compose -f deploy/docker-compose.blog.yml up -d` – bring up the Ghost + MySQL stack (requires `.env.blog`).
- `docker compose -f deploy/docker-compose.yml down` – tear everything down.

## Patterns & Conventions
- ✅ DO keep volumes relative to repo root (e.g., `../frontend/dist`) so CI/CD paths remain stable.
- ✅ DO update nginx configuration in `deploy/nginx/site.conf` and `deploy/nginx/goodmeow.conf` together when making changes.
- ❌ DON'T commit secrets into `.env.blog`; rely on local files ignored by git.
- ✅ Maintain external network references (`web`)—they assume Traefik/Reverse-proxy orchestration in production.
- ✅ Document any new compose services in PRs so infra partners stay aligned.

## Touch Points / Key Files
- Primary compose file: `deploy/docker-compose.yml`
- Local overrides: `deploy/docker-compose.local.yml`
- Ghost stack: `deploy/docker-compose.blog.yml`
- nginx configs: `deploy/nginx/site.conf`, `deploy/nginx/goodmeow.conf`

## JIT Index Hints
- `rg -n "image:" deploy/docker-compose*.yml` – inspect container base images.
- `rg -n "server_name" deploy/nginx` – find host configuration.
- `rg -n "volumes" deploy/docker-compose.yml` – review bind mounts.

## Common Gotchas
- Compose files expect prebuilt assets under `frontend/dist`; run legacy build before spinning containers.
- External network `web` must exist (`docker network create web`) prior to `up`.
- MySQL volume paths (`../blog_mysql`) store persistent data—do not delete without backups.

## Pre-PR Checks
- `docker compose -f deploy/docker-compose.yml config`
