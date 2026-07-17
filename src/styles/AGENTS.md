# src/styles Agent Guide

## Package Identity
- Tailwind v4 layer definitions and global CSS for the landing page.
- Integrates HeroUI theme plugin (`@plugin "../hero.js"`) and configures light/dark tokens.

## Setup & Run
- `npm run dev` – watch Tailwind classes resolve in the browser.
- `npm run build` – runs PostCSS pipeline; ensures directives (`@config`, `@plugin`) stay valid.
- `npm run lint` – catches unused classes via ESLint Tailwind rules in JSX.

## Patterns & Conventions
- ✅ DO extend HeroUI themes in `src/hero.js`; `tailwind.config.js` stays limited to scan paths and Tailwind-level settings.
- ✅ DO define reusable utility classes (e.g., `.navbar-overhead-base`) when multiple components share styling.
- ✅ Prefer CSS custom properties for theming like the `--heroui-*` variables declared at the top of `globals.css`.
- ❌ DON'T hardcode colors in components; add tokens in `src/hero.js` and consume via `hsl(var(--token))`.
- ✅ Use media queries and variants consistent with existing patterns (see responsive blocks around `.navbar-overhead-wrapper`).
- ✅ Place any additional `@source` directives carefully so Tailwind purges correctly.

## Touch Points / Key Files
- Global Tailwind layers and overrides: `src/styles/globals.css`
- HeroUI token source: `src/hero.js`
- Root Tailwind config: `tailwind.config.js` (content/dark mode only)

## JIT Index Hints
- `rg -n "@media" src/styles/globals.css` – find responsive rules.
- `rg -n "--heroui" src/styles/globals.css` – inspect CSS variable definitions.
- `rg -n "\\.navbar" src/styles/globals.css` – track navigation styling hooks.

## Common Gotchas
- Keep `@config` and relative paths accurate; moving files breaks Tailwind resolution.
- Tailwind v4 purges aggressively—ensure class names appear in JSX or add `@source` entries.
- Avoid duplicating HeroUI plugin/theme config outside `src/hero.js`.

## Pre-PR Checks
- `npm run build`
