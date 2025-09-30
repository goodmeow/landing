FRONTEND_DIR := frontend
BACKEND_SYNC := install latest-posts sitemap version

.PHONY: install latest-posts sitemap version sync frontend-install frontend-build frontend-preview

install:
	npm install

latest-posts:
	npm run update:latest-posts

sitemap:
	npm run generate:sitemap

version:
	scripts/ci_build_version_local.sh

sync: install latest-posts sitemap version

frontend-install:
	cd $(FRONTEND_DIR) && npm install

frontend-build:
	cd $(FRONTEND_DIR) && npm run build

frontend-preview:
	cd $(FRONTEND_DIR) && npm run preview -- --host 0.0.0.0 --port 4173

frontend-sync: frontend-install frontend-build
