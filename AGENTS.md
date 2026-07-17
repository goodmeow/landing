# goodmeow.dev Agent Guide

## Project Snapshot
- Simple single-app repo: Vite + React 18 landed under `src/`, infra and scripts alongside.
- TypeScript-first with HeroUI/Tailwind v4 styling and Ghost Content API integration.
- Each major directory ships its own `AGENTS.md`; closest file wins when editing.

## Root Setup Commands
- `npm install` – install dependencies (root package only).
- `npm run dev` – start Vite dev server on `http://localhost:5173`.
- `npm run build` – type-checks via `tsc`, stamps `dist/index.html`, and emits `dist/`.
- `npm run lint` – ESLint with autofix; run before commits.
- `npm run preview` – serve the last production build.
- `make landing-local` – build and serve landing via nginx on `http://localhost:8088`.
- `make stack-local` – run local production-like landing + Ghost + MySQL stack.

## Universal Conventions
- TypeScript + React functional components, 2-space indent, imports ordered packages → `@/` aliases → relatives.
- Tailwind utilities live in `src/styles/globals.css`; extend tokens through `tailwind.config.js` + `src/hero.js` together.
- Keep lint disables rare and justified; rely on ESLint autofix where possible.
- Commits stay short and imperative (e.g., `feat: add hero animation`); PRs list manual QA steps and screenshots for UI shifts.

## Security & Secrets
- Never commit API keys or tokens; reference `.env.example` and keep secrets in `.env.local`.
- Ghost credentials surface via `VITE_GHOST_CONTENT_URL` / `VITE_GHOST_CONTENT_KEY`; treat them as secrets.
- PII should not enter the repo or logs; scrub sample data before sharing.

## JIT Index (what to open, not what to paste)

### Directory Map
- Web app source: `src/` → [see src/AGENTS.md](src/AGENTS.md)
- Shared components: `src/components/` → [see src/components/AGENTS.md](src/components/AGENTS.md)
- Routed pages: `src/pages/` → [see src/pages/AGENTS.md](src/pages/AGENTS.md)
- Styling system: `src/styles/` → [see src/styles/AGENTS.md](src/styles/AGENTS.md)
- Build scripts: `scripts/` → [see scripts/AGENTS.md](scripts/AGENTS.md)
- Infra manifests: `deploy/` → [see deploy/AGENTS.md](deploy/AGENTS.md)

### Quick Find Commands
- `rg -n "export function" src` – enumerate exported React functions.
- `rg -n "useState" src/pages` – inspect stateful page logic.
- `rg -n "NavButton" -g'*.tsx' src` – locate component usage.
- `rg -n "fetch(" src/pages/index.tsx` – review Ghost API access.
- `rg -n "docker-compose" deploy` – scan compose manifests.

## Definition of Done
- `npm run lint` and `npm run build` succeed locally; address warnings.
- Manual QA covers theme toggle, Ghost “Latest Writing” fetch, and footer build tag.
- Update relevant `AGENTS.md` entries when adding patterns or commands.
