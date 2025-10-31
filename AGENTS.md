# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains all application code: `components/` for shared UI, `pages/` for routed screens, `styles/` for Tailwind v4 layers, and `config/` for site configuration.
- `public/` holds static assets such as `favicon.ico`, `robots.txt`, and `site.webmanifest`.
- Legacy infrastructure assets from the original landing project (for example `deploy/`, `archive/`, `blog_content/`) remain under version control for reference—treat them as read-only unless you are coordinating infra changes.
- `scripts/update-build-meta.mjs` stamps `index.html` with the current build identifier; it runs automatically before `npm run build`.

## Build, Test, and Development Commands
- `npm run dev` — start the Vite dev server on `http://localhost:5173` with hot reload.
- `npm run build` — type-check (`tsc`) then create a production bundle in `dist/` and update the `x-build` meta tag.
- `npm run preview` — serve the latest production build locally for smoke testing.
- `npm run lint` — run ESLint with autofix; execute before committing.
- `npm run version:meta` — manually refresh only the `x-build` meta tag when needed.

## Coding Style & Naming Conventions
- Use TypeScript + React functional components; hooks/utilities are camelCase, components PascalCase.
- Maintain 2-space indentation (see `.editorconfig`) and order imports as packages → aliases (`@/`) → relatives.
- Prefer Tailwind utility classes captured in `src/styles/globals.css`; add new theme tokens in `tailwind.config.js` / `src/hero.js` together.
- Keep lint suppressions rare and justify them inline in code review.

## Testing Guidelines
- No automated suite yet—run `npm run lint` and `npm run build` before creating a PR.
- Document manual QA steps (theme toggle, Latest Writing fetch, contact CTAs) in the PR description.
- When adding automated tests, colocate Vitest/RTL specs next to source files using the `.test.tsx` suffix.

## Commit & Pull Request Guidelines
- Use concise, imperative commit subjects (e.g., `feat: add contact CTA`). Group related changes logically.
- PRs should include: summary, bullet list of major changes, screenshots/GIFs for UI updates, verification steps, and links to tracking issues.
- Ensure CI-equivalent commands (`npm run lint`, `npm run build`) pass locally; call out follow-up work or known gaps in the PR body.

## Operations & Deployment Notes
- The landing page fetches latest posts from Ghost at runtime via `VITE_GHOST_CONTENT_URL` / `VITE_GHOST_CONTENT_KEY` (see `.env.example`).
- When updating shared assets (favicons, manifest, SEO files), modify them under `public/` so they ship with the bundle.
- Original Docker/nginx manifests live under `deploy/`; coordinate with infra maintainers before editing.
