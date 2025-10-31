# goodmeow.dev Landing

React + Vite landing page for [goodmeow.dev](https://goodmeow.dev). The app fetches the latest posts from Ghost at runtime, presents bio/contact sections, and surfaces the current build metadata.

## Stack
- React 18, TypeScript, Vite 6
- HeroUI v2 components with Tailwind v4 utilities (`src/styles/globals.css`)
- Framer Motion for subtle entrance animations
- Ghost Content API for the “Latest Writing” section

## Getting Started
```bash
npm install            # install dependencies
npm run dev            # start Vite on http://localhost:5173
npm run lint           # lint + autofix
npm run version:meta   # manually refresh <meta name="x-build">
npm run build          # type-check, version stamp, and emit dist/
npm run preview        # serve the production bundle locally
```

Environment variables live in `.env.local` (see `.env.example`). At minimum set:
```
VITE_GHOST_CONTENT_URL=https://blog.goodmeow.my.id/ghost/api/content/posts/
VITE_GHOST_CONTENT_KEY=<ghost-content-api-key>
```

## Deployment Notes
- `dist/` contains the static bundle; host via nginx, Vercel, or any static host.
- The original Docker/nginx manifests remain under `deploy/` for reference (`docker compose -f deploy/docker-compose.yml up -d`).
- `scripts/update-build-meta.mjs` runs automatically before `npm run build`, stamping `index.html` with `YYYY.MM.DD+<shortSHA>` so the footer shows the current deploy.

## Additional Resources
- Contributor & operations guide: [AGENTS.md](./AGENTS.md)
- SEO assets: `public/robots.txt`, `public/site.webmanifest`, `public/sitemap.xml`

## License
- Application code is licensed under [MIT](./LICENSE).
- Site content is licensed under [CC BY-SA 4.0](./LICENSE.md).
