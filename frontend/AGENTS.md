# frontend Agent Guide

## Package Identity
- Archived pre-TypeScript landing implementation kept for reference and parity testing.
- React (JSX) + Vite build using HeroUI v2 and Tailwind v4; lives outside the active `src/` app.

## Setup & Run
- `npm run legacy:install` – install dependencies inside `frontend/`.
- `npm run legacy:build` – emit the legacy static bundle to `frontend/dist`.
- `npm run legacy:build && docker compose -f deploy/docker-compose.yml up` – serve legacy assets through nginx.
- (Direct) `cd frontend && npm run dev` – inspect the legacy app locally.

## Patterns & Conventions
- ✅ DO treat files as read-only reference; mirror fixes into `src/` first.
- ✅ Reuse component ideas by porting them to TypeScript, e.g., model new wrappers after `frontend/src/components/NavButton.jsx` but convert to typed `forwardRef`.
- ❌ DON'T import modules from `frontend/` into the new `src/` app—they are compiled separately and lack TypeScript types.
- ✅ Keep Tailwind token changes aligned with `frontend/hero.js` if you must sync legacy theming.
- ❌ DON'T upgrade dependencies here without matching changes in the primary app; avoid version drift surprises.

## Touch Points / Key Files
- Legacy landing implementation: `frontend/src/App.jsx`
- Variant-based NavButton: `frontend/src/components/NavButton.jsx`
- Global stylesheet: `frontend/src/styles.css`
- Tailwind + HeroUI config: `frontend/hero.js`, `frontend/tailwind.config.js`

## JIT Index Hints
- `rg -n "extendVariants" frontend/src` – find HeroUI variant usage.
- `rg -n "motion." frontend/src/App.jsx` – inspect animation patterns for parity.
- `find frontend/src -name "*.jsx"` – list available legacy components.

## Common Gotchas
- Running `npm install` here creates a separate lockfile and `node_modules`; keep them isolated from the root.
- Builds expect environment variables identical to the modern app; update `.env` files in both places when testing.
- Legacy output feeds Docker compose (`../frontend/dist`); ensure you build before bringing containers up.

## Pre-PR Checks
- `npm run legacy:build`
