# src/hooks Agent Guide

## Package Identity
- Reusable React hooks that encapsulate shared state or DOM integrations across pages.
- Live under the main Vite app; import via `@/hooks/...`.

## Patterns & Conventions
- ✅ Prefer colocating low-level DOM/utility logic (e.g., theme preference, build metadata) here instead of duplicating in pages.
- ✅ Keep effects resilient to SSR by guarding `window`/`document`.
- ✅ Export typed return values so consumers know what shape to expect.
- ❌ Don't fetch remote data inside hooks unless they are generic data utilities (prefer page-level fetches).

## Pre-PR Checks
- `npm run lint -- src/hooks`
