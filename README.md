# Landing React Build

Static landing page for `goodmeow.my.id`, built with React 19, Vite 7, Tailwind, and HeroUI. The production bundle in `frontend/dist/` is served by an `nginx:alpine` container defined under `deploy/`.

## Quick Start
- `cd frontend && npm install` — install dependencies.
- `npm run dev` — start Vite on `http://localhost:5173`.
- `npm run build` — create a production bundle.
- `make frontend-version` — stamp `<meta name="x-build">` with the current date+SHA, or `make frontend-sync` to clean, version, and build together.

## Deployment
- `docker compose -f deploy/docker-compose.yml up -d --force-recreate` — publish the current `dist/` via nginx (requires external `web` network).
- The landing page fetches latest posts from Ghost at runtime; ensure the Vite env variables (`VITE_GHOST_CONTENT_*`) are set in `.env.local` or your deployment.
- For manual redeploys, re-run `npm run build` before the compose command so nginx serves the latest bundle.

## Documentation
- See `AGENTS.md` for the full contributor + operations guide (stack overview, Ghost integration, security notes).

## License
- Content licensed under CC BY-SA 4.0 (`LICENSE.md`).
