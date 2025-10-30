# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds all application code. Key folders: `components/` for shared UI, `pages/` for routed views, `styles/` for Tailwind v4 layers, and `config/` for site-level settings.
- `public/` contains static assets served verbatim (e.g., `favicon.ico`).
- Build output is emitted to `dist/` by Vite; treat it as disposable.
- Tailwind and HeroUI extensions live in `tailwind.config.js` and `src/hero.js`. Update both when introducing new design tokens.

## Build, Test, and Development Commands
- `npm run dev` — Launches Vite dev server with hot reload at `http://localhost:5173`.
- `npm run build` — Runs `tsc` for type-checking, then produces production-ready assets in `dist/`.
- `npm run preview` — Serves the latest build output locally; use this to validate production bundles.
- `npm run lint` — Executes ESLint with autofix; run prior to committing changes.

## Coding Style & Naming Conventions
- TypeScript + React with functional components only. Prefer hooks over class lifecycle APIs.
- Follow 2-space indentation (default in `.editorconfig`) and keep imports ordered: external packages, absolute aliases (`@/`), then relative paths.
- Components and hooks use PascalCase and camelCase respectively. CSS utility classes rely on Tailwind; add reusable styles to `globals.css` instead of inline `<style>` tags.
- Use ESLint and Prettier defaults; avoid disabling rules without justification in code review.

## Testing Guidelines
- No automated test suite exists yet; add tests alongside new features when feasible.
- For UI logic, favor Playwright or Vitest + React Testing Library (recommended stack) and place specs in `src/__tests__/` mirroring source paths.
- Test files should end with `.test.ts(x)` and clearly describe the behavior under test.

## Commit & Pull Request Guidelines
- Use concise, imperative commit subjects (`Add contact panel CTA`). Group related changes into a single commit when practical.
- Pull requests should include: purpose summary, bullet list of major changes, screenshots or GIFs for UI updates, and links to tracking issues.
- Ensure `npm run lint` and `npm run build` pass before requesting review. Mention any follow-up tasks or TODOs in the PR description.
