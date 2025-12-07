# src/components Agent Guide

## Package Identity
- Shared UI primitives for the landing page, implemented with HeroUI components wrapped in TypeScript.
- Lives under the main Vite app; consumed via `@/components/...` imports.

## Setup & Run
- `npm run dev` – verify component behaviour inside the live app.
- `npm run lint -- src/components` – lint only this folder when iterating.
- `npm run build` – ensures types and bundling still succeed after changes.

## Patterns & Conventions
- ✅ DO wrap HeroUI primitives with `forwardRef` like `src/components/nav-button.tsx` to keep refs intact.
- ✅ DO expose typed props (extend vendor types) so consumers inherit the upstream API.
- ✅ Styles belong in Tailwind utilities or `src/styles/globals.css`; avoid inline style objects.
- ❌ DON'T duplicate legacy patterns—follow the TypeScript `forwardRef` wrapper shown here.
- ✅ Export components as named exports to keep tree-shaking effective.

## Touch Points / Key Files
- Button wrapper pattern: `src/components/nav-button.tsx`
- Add new shared exports via index barrel when the folder grows.

## JIT Index Hints
- `rg -n "forwardRef" src/components` – find ref-aware wrappers.
- `rg -n "export const" src/components` – inspect available components.
- `rg --files -g "*.tsx" src/components` – quick file inventory.

## Common Gotchas
- Keep prop defaults aligned with HeroUI expectations (`radius`, `size`, `color`) to avoid visual regressions.
- Remember to import `clsx` or utility helpers locally; do not rely on global styles for component-specific behaviour.

## Pre-PR Checks
- `npm run lint -- src/components && npm run build`
