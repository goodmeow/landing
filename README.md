# Landing React Build

- Run `make frontend-version` to sync `<meta name="x-build">` with the current commit (or `make frontend-sync` to clean + build).
- GitHub Action `.github/workflows/build-version.yml` calls the same script on pushes to `main`.
- Output served from `frontend/dist/` by the Dockerised Nginx container.

## Useful commands
- `npm run dev` (inside `frontend/`) — Vite dev server.
- `npm run sync:posts` (inside `frontend/`) — refresh `src/data/latestPosts.json` from the blog RSS feed (runs automatically before `npm run build`).
- `make frontend-preview` — preview production build on `0.0.0.0:4173`.
- `docker compose -f deploy/docker-compose.yml up -d --force-recreate` — redeploy static container.
- Daily GitHub Action (`sync-latest-posts.yml`) re-syncs `latestPosts.json` at 03:00 UTC; trigger manually via the Actions tab if needed.

## License
- Content licensed under CC BY-SA 4.0 (`LICENSE.md`).
