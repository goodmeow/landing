FRONTEND_DIR := .
LANDING_PROJECT := landing
BLOG_PROJECT := blog

# Prefer Docker Compose v2 plugin, fallback to v1 binary
COMPOSE := $(shell docker compose version >/dev/null 2>&1 && echo "docker compose" || (command -v docker-compose >/dev/null 2>&1 && echo docker-compose || echo "docker compose"))

.PHONY: frontend-install frontend-build frontend-preview frontend-clean frontend-sync \
        landing-deploy landing-local landing-local-down landing-local-logs landing-local-ps \
        blog-deploy blog-local blog-local-down blog-local-logs blog-local-ps \
        stack-local stack-local-down stack-local-logs stack-local-ps

frontend-install:
	cd $(FRONTEND_DIR) && npm install

frontend-build:
	cd $(FRONTEND_DIR) && npm run lint && npm run build

frontend-preview:
	cd $(FRONTEND_DIR) && npm run preview -- --host 0.0.0.0 --port 4173

frontend-clean:
	rm -rf $(FRONTEND_DIR)/dist

frontend-sync: frontend-install frontend-clean frontend-build

landing-deploy:
	$(COMPOSE) -p $(LANDING_PROJECT) -f deploy/docker-compose.yml up -d --force-recreate

blog-deploy:
	$(COMPOSE) -p $(BLOG_PROJECT) -f deploy/docker-compose.blog.yml --env-file deploy/.env.blog up -d --force-recreate

# Local-only deployment exposing Nginx on host (see deploy/docker-compose.local.yml)
landing-local: frontend-sync
	$(COMPOSE) -p $(LANDING_PROJECT) -f deploy/docker-compose.yml -f deploy/docker-compose.local.yml up -d --force-recreate

blog-local:
	$(COMPOSE) -p $(BLOG_PROJECT) -f deploy/docker-compose.blog.yml --env-file deploy/.env.blog up -d --force-recreate

stack-local: landing-local blog-local

landing-local-down:
	$(COMPOSE) -p $(LANDING_PROJECT) -f deploy/docker-compose.yml -f deploy/docker-compose.local.yml down

blog-local-down:
	$(COMPOSE) -p $(BLOG_PROJECT) -f deploy/docker-compose.blog.yml --env-file deploy/.env.blog down

stack-local-down: landing-local-down blog-local-down

landing-local-logs:
	$(COMPOSE) -p $(LANDING_PROJECT) -f deploy/docker-compose.yml -f deploy/docker-compose.local.yml logs -f landing

blog-local-logs:
	$(COMPOSE) -p $(BLOG_PROJECT) -f deploy/docker-compose.blog.yml --env-file deploy/.env.blog logs -f blog blog_db

stack-local-logs:
	$(COMPOSE) -p $(LANDING_PROJECT) -f deploy/docker-compose.yml -f deploy/docker-compose.local.yml logs -f landing
	$(COMPOSE) -p $(BLOG_PROJECT) -f deploy/docker-compose.blog.yml --env-file deploy/.env.blog logs -f blog blog_db

landing-local-ps:
	$(COMPOSE) -p $(LANDING_PROJECT) -f deploy/docker-compose.yml -f deploy/docker-compose.local.yml ps

blog-local-ps:
	$(COMPOSE) -p $(BLOG_PROJECT) -f deploy/docker-compose.blog.yml --env-file deploy/.env.blog ps

stack-local-ps: landing-local-ps blog-local-ps
