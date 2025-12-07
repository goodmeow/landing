# src/pages Agent Guide

## Package Identity
- Routed React screens for the landing experience; currently a single `index` route rendered through React Router.
- Uses Framer Motion for animations, HeroUI for layout, and Ghost Content API fetches for dynamic content.

## Setup & Run
- `npm run dev` – iterate on page UX with hot reload.
- `npm run lint -- src/pages` – quick lint pass focused on page code.
- `npm run build` – verify type safety and bundling after page edits.

## Patterns & Conventions
- ✅ DO follow the layout and animation structure in `src/pages/index.tsx` (motion variants declared near usage).
- ✅ DO keep theme state in sync with storage/media queries as shown with `THEME_STORAGE_KEY` logic in `src/pages/index.tsx`.
- ✅ DO fetch external content with AbortController, guard null payloads, and normalise data like the Ghost loader section.
- ❌ DON'T bypass shared UI (e.g., reuse `NavButton` from `@/components/nav-button` for nav CTAs instead of bespoke buttons).
- ✅ Split helpers and types inline when they are route-specific (e.g., `formatDate`, `BlogPost` types inside `index.tsx`).
- ✅ Keep routes minimal—route registration lives in `src/App.tsx`; page files should export default route components only.

## Touch Points / Key Files
- Landing route implementation: `src/pages/index.tsx`
- Not found / fallback route: `src/pages/not-found.tsx`
- Route registration: `src/App.tsx`
- Shared button CTA: `src/components/nav-button.tsx`

## JIT Index Hints
- `rg -n "motion." src/pages` – inspect animation usage.
- `rg -n "useEffect" src/pages/index.tsx` – review side effects (theme + fetch).
- `rg -n "BlogPost" src/pages/index.tsx` – locate content modeling.

## Common Gotchas
- Guard browser-only APIs (`window`, `localStorage`) before use; SSR is not enabled now but Vite preview still runs in strict mode.
- Keep the default Ghost key out of production builds—ensure `.env.local` overrides it locally.
- Verify dark mode styling after edits; theme toggles rely on CSS variables defined in `src/styles/globals.css`.

## Pre-PR Checks
- `npm run lint -- src/pages && npm run build`
