FRONTEND_DIR := frontend

.PHONY: frontend-install frontend-build frontend-preview frontend-clean frontend-sync frontend-version landing-deploy

frontend-install:
	cd $(FRONTEND_DIR) && npm install

frontend-build:
	cd $(FRONTEND_DIR) && npm run build

frontend-preview:
	cd $(FRONTEND_DIR) && npm run preview -- --host 0.0.0.0 --port 4173

frontend-clean:
	rm -rf $(FRONTEND_DIR)/dist

frontend-version:
	NODE_ENV=production node scripts/update_build_meta.js

frontend-sync: frontend-install frontend-clean frontend-version frontend-build

landing-deploy:
	docker compose -f deploy/docker-compose.yml up -d --force-recreate
