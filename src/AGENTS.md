# src Agent Guide

## Package Identity
- Main goodmeow.dev landing app using React 18, Vite 7, and HeroUI with Tailwind v4 tokens.
- TypeScript everywhere (`.ts`/`.tsx`) with path alias imports via `@/` mapping to this folder.

## Setup & Run
- `npm install` (run at repo root).
- `npm run dev` – Vite dev server with hot reload.
- `npm run build` – type-checks, stamps `dist/index.html`, and bundles.
- `npm run preview` – serve the production build for smoke tests.
- `npm run lint` – ESLint autofix across the source tree.

## Patterns & Conventions
- ✅ DO keep routing minimal: mirror `src/App.tsx` where `Routes` fan out to page components.
- ✅ DO funnel shared providers through `src/provider.tsx`; ensure new providers compose with `HeroUIProvider`.
- ✅ DO compose UI with HeroUI + Tailwind utilities as shown in `src/pages/index.tsx` (motion variants + utility classes).
- ✅ Forms/buttons should reuse patterns from `src/components/nav-button.tsx` (forward refs, HeroUI props pass-through).
- ❌ DON'T introduce untyped JavaScript components—stick with TypeScript throughout.
- ✅ Data fetching should follow the abort-safe Ghost loader section in `src/pages/index.tsx` (AbortController + guards).
- ✅ Keep helper functions module-local unless shared broadly, e.g., `formatDate` and `normaliseTags` in `src/pages/index.tsx`.

## Touch Points / Key Files
- Router entry: `src/App.tsx`
- Global provider wiring: `src/provider.tsx`
- HeroUI Tailwind plugin: `src/hero.js`
- Landing page implementation + Ghost fetch logic: `src/pages/index.tsx`
- Shared CTA button: `src/components/nav-button.tsx`
- Tailwind layers and theme tokens: `src/styles/globals.css`

## JIT Index Hints
- `rg -n "export const use" src` – locate custom hooks or utilities.
- `rg -n "motion." src/pages/index.tsx` – inspect animation usage.
- `rg -n "@/" src` – find alias-based imports for shared modules.
- `find src -name "*.test.tsx"` – confirm placement when adding tests.

## Common Gotchas
- Always wrap new UI with `HeroUIProvider` from `src/provider.tsx` or components will miss theme context.
- `@/` alias resolves only inside Vite build tooling; avoid using it in Node scripts.
- Ghost API keys must come from environment; remove the fallback key before production deployments.

## Pre-PR Checks
- `npm run lint && npm run build`
