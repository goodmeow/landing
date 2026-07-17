# goodmeow.dev Landing

React + Vite landing page for [goodmeow.dev](https://goodmeow.dev). The app fetches the latest posts from Ghost at runtime, presents bio/contact sections, and surfaces the current build metadata.

## Stack
- React 18, TypeScript, Vite 7
- HeroUI v2 components with Tailwind v4 utilities (`src/styles/globals.css`)
- Framer Motion for subtle entrance animations
- Ghost Content API for the “Latest Writing” section

## Getting Started
```bash
npm install            # install dependencies
npm run dev            # start Vite on http://localhost:5173
npm run lint           # lint + autofix
npm run build          # type-check, stamp dist/index.html, and emit dist/
npm run preview        # serve the production bundle locally
```

Environment variables live in `.env.local` (see `.env.example`). At minimum set:
```
VITE_GHOST_CONTENT_URL=https://blog.goodmeow.my.id/ghost/api/content/posts/
VITE_GHOST_CONTENT_KEY=<ghost-content-api-key>
```

## Local Production Stack
```bash
make landing-local     # build and serve landing via nginx on http://localhost:8088
make blog-local        # start Ghost + MySQL using deploy/.env.blog
make stack-local       # run landing-local and blog-local together
make stack-local-down  # stop the local landing and blog stacks
```

`blog-local` mirrors production wiring: Ghost joins the external `web` network as `blog`, while MySQL stays on the private compose network. Create the external network first if needed:
```bash
docker network create web
```
The Makefile uses separate Compose project names for landing and blog so each stack can be recreated without orphan-container warnings.

## Deployment Notes
- `dist/` contains the static bundle; host via nginx, Vercel, or any static host.
- The Docker/nginx manifests live under `deploy/`; use `make landing-deploy` for the static landing container and `make blog-deploy` for Ghost + MySQL.
- Vite stamps `dist/index.html` with `YYYY.MM.DD+<shortSHA>` during `npm run build` so the footer shows the current deploy without dirtying source files.

## Additional Resources
- Contributor & operations guide: [AGENTS.md](./AGENTS.md)
- SEO assets: `public/robots.txt`, `public/site.webmanifest`, `public/sitemap.xml`

## License
- Application code is licensed under [MIT](./LICENSE).
- Site content is licensed under [CC BY-SA 4.0](./LICENSE.md).
