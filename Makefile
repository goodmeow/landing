.PHONY: install latest-posts sitemap version sync

install:
	npm install

latest-posts:
	npm run update:latest-posts

sitemap:
	npm run generate:sitemap

version:
	scripts/ci_build_version_local.sh

sync: install latest-posts sitemap version
