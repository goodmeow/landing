FRONTEND_DIR := frontend

# Prefer Docker Compose v2 plugin, fallback to v1 binary
COMPOSE := $(shell docker compose version >/dev/null 2>&1 && echo "docker compose" || (command -v docker-compose >/dev/null 2>&1 && echo docker-compose || echo "docker compose"))

.PHONY: frontend-install frontend-build frontend-preview frontend-clean frontend-sync frontend-version \
        landing-deploy landing-local landing-local-down landing-local-logs landing-local-ps

frontend-install:
	cd $(FRONTEND_DIR) && npm install

frontend-build:
	cd $(FRONTEND_DIR) && npm run lint && npm run build

frontend-preview:
	cd $(FRONTEND_DIR) && npm run preview -- --host 0.0.0.0 --port 4173

frontend-clean:
	rm -rf $(FRONTEND_DIR)/dist

frontend-version:
	NODE_ENV=production node scripts/update-build-meta.mjs

frontend-sync: frontend-install frontend-clean frontend-version frontend-build

landing-deploy:
	$(COMPOSE) -f deploy/docker-compose.yml up -d --force-recreate

# Local-only deployment exposing Nginx on host (see deploy/docker-compose.local.yml)
landing-local: frontend-sync
	$(COMPOSE) -f deploy/docker-compose.yml -f deploy/docker-compose.local.yml up -d --force-recreate

landing-local-down:
	$(COMPOSE) -f deploy/docker-compose.yml -f deploy/docker-compose.local.yml down

landing-local-logs:
	$(COMPOSE) -f deploy/docker-compose.yml -f deploy/docker-compose.local.yml logs -f landing

landing-local-ps:
	$(COMPOSE) -f deploy/docker-compose.yml -f deploy/docker-compose.local.yml ps
