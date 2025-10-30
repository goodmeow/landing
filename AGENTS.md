# Repository Guidelines

## Overview & Stack
- Single-page app built with React 19, Vite 7, Tailwind layers (`frontend/src/styles.css`), HeroUI components, and Framer Motion animations.
- Static assets are produced in `frontend/dist/` and served by an `nginx:alpine` container defined in `deploy/docker-compose.yml`, fronted by a TLS reverse proxy (`deploy/nginx/goodmeow.conf`).
- Ghost CMS powers `blog.goodmeow.my.id`; the landing page ingests the public RSS feed to populate latest posts.

## Project Structure & Module Organization
- `frontend/` — main application; place components in `src/` and static files in `public/`.
- `frontend/scripts/` — reserved for future automation utilities.
- `scripts/` — operational helpers such as `update_build_meta.js`.
- `deploy/` — Docker Compose manifests plus nginx configs for static hosting and reverse proxying.
- `blog_content/`, `archive/` — Ghost volumes and historical assets; keep untouched unless refreshing staging content.

## Build, Test, and Development Commands
Run inside `frontend/` unless stated.
- `npm install` — install dependencies.
- `npm run dev` — Vite dev server at `http://localhost:5173`.
- `npm run build` — production bundle into `dist/`.
- `npm run preview` — serve the built bundle locally.
- `npm run lint` — ESLint flat config.
- `make frontend-version` — update `<meta name="x-build">` to `YYYY.MM.DD+<shortSHA>`.
- `make frontend-sync` — clean, version, and build in one go.
- `make frontend-preview` — preview production build on `0.0.0.0:4173`.

## Coding Style & Naming Conventions
- Functional React components in PascalCase; hooks/utilities camelCase.
- Two-space indentation, single quotes, wrap long JSX props onto new lines.
- Prefer Tailwind primitives declared in `styles.css`; use inline styles only for theme toggles/accessibility fixes.
- Run ESLint before commits; document any rule suppressions inline.

## Testing Guidelines
- No automated test suite yet; always run `npm run lint` and `npm run build` before PRs.
- For interactive changes, describe manual test steps or include focused harnesses in `src/`.
- If introducing Vitest (preferred), colocate specs next to components using `ComponentName.test.jsx`.

## Commit & Pull Request Guidelines
- Follow existing Conventional Commit prefixes (`feat:`, `landing:`, `chore(meta):`); subjects ≤72 characters, lowercase.
- Reference issues in the body; highlight RSS/config edits explicitly.
- PRs need a concise summary, screenshots for UI changes, reviewer instructions, and preview URLs when available.

## Content Sync & Configuration
- The SPA fetches latest posts from Ghost at runtime via `VITE_GHOST_CONTENT_*`.

## Key Artifacts & Branding
- `frontend/index.html` holds document metadata, analytics, JSON-LD, and the `x-build` meta tag.
- `frontend/src/App.jsx` defines hero copy, blog cards, about/contact sections, theme toggle, and footer license/version display.
- Avatar references a Gravatar hash baked into `index.html`; update only with explicit branding changes.
- Footer must continue to show the CC BY-SA 4.0 badge and link to the current build commit when available.

## Deployment & Operations
- Build locally (`npm run build`) or via CI; ensure `frontend/dist/` is up to date before redeploying.
- Redeploy static hosting with `docker compose -f deploy/docker-compose.yml up -d --force-recreate`; requires the external `web` network.
- TLS reverse proxy (`deploy/nginx/goodmeow.conf`) enforces CSP, HSTS, AI crawler blocks, and routes `/` to the landing container, `/blog/` to Ghost. Preserve security headers when editing.
- Ghost CMS volumes live under `blog_content/` and `blog_mysql/`; keep backups before upgrades.

## Operational Tips
- If Ghost data needs to be pre-fetched for testing, implement a local script in `frontend/scripts/` as required.
- When editing SEO/PWA assets (`robots.txt`, `sitemap.xml`, `site.webmanifest`, favicons), copy updates into `frontend/public/` so they ship with the bundle.
- For router-aware components, pass `navigate`/`useHref` implementations to `HeroUIProvider`; otherwise the default anchor usage suffices.
- To disable ripples globally, the app sets `disableRipple` on `HeroUIProvider` in `frontend/src/main.jsx`.

## Quality Checks & Runbooks
- Smoke test theme switching, blog cards, and contact CTAs in both dev (`npm run dev`) and preview (`make frontend-preview`) modes.
- After `make frontend-version`, confirm the footer displays the new build string and that `index.html` has the updated `x-build` meta.
- If Nginx config changes, validate with `nginx -t` inside the container or via `docker compose exec landing_www nginx -t` before reloads.

## Contact
- Primary email: `aarunalr@pm.me`.
- Social links in `App.jsx` (GitHub, LinkedIn, Credly) should stay current; update only when instructed.
