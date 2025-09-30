# Memori Proyek — Landing Page (React/Tailwind)

Ringkasan teknis proyek ini untuk referensi development dan deployment.

## Ringkasan
- Front-end sekarang React + Vite (Tailwind CSS 4 + HeroUI) dengan output statik di `frontend/dist/`.
- Backend: Nginx container (Docker) yang menyajikan build statik; diproksi oleh Nginx reverse proxy TLS (Cloudflare).
- Fitur: SEO dasar (OG/Twitter, canonical, sitemap, robots), web manifest, versi footer (`x-build`).
- Branding: "goodmeow's blog" (About, kontak, LinkedIn, GitHub).
- Ikon: Gravatar (hash publik) untuk favicon, Apple touch, OG/Twitter, avatar.
- Lisensi konten: CC BY-SA 4.0 (`LICENSE.md`, badge footer).

## Struktur Direktori
- `frontend/` — aplikasi React utama.
  - `src/` — komponen React + Tailwind (`styles.css`).
  - `tailwind.config.js` — konfigurasi Tailwind + plugin HeroUI.
  - `vite.config.js` — Vite + plugin Tailwind.
  - `dist/` — hasil build (dipakai Nginx).
- `index.html` (legacy) + `styles.css` — file statik lama (tetap ada untuk kompatibilitas tooling).
- `assets/` — ikon lokal.
- `deploy/` — Compose & Nginx konfigurasi.
- `scripts/` — util Node (update RSS, sitemap, x-build).
- `memori/` — dokumentasi proyek ini.

## Build & Deploy Workflow
- `make frontend-version` → jalankan `node scripts/update_build_meta.js` (set meta `x-build` berdasarkan tanggal + SHA HEAD).
- `make frontend-build` → `npm run build` (Vite).
- `make frontend-sync` → install dep, clean `dist`, update versi, build.
- Deploy: `docker compose -f deploy/docker-compose.yml up -d --force-recreate` (menyajikan `frontend/dist`).
- GitHub Action `.github/workflows/build-version.yml` menjalankan script versi + sitemap saat push ke `main`.

## Checklist Pra-Rilis
- [ ] `frontend/src/App.jsx` konten (hero/blog/about/contact) sesuai branding terbaru.
- [ ] Meta (title/description/OG/Twitter) di `frontend/index.html` sudah sesuai domain.
- [ ] `scripts/update_build_meta.js` atau `make frontend-sync` dijalankan sebelum commit/push sehingga `x-build` mencerminkan HEAD.
- [ ] Build React (`npm run build`) dan redeploy Nginx.
- [ ] Periksa SEO/aksesibilitas/performa sesuai kebutuhan.

## Pengujian Cepat
- `npm run dev` (Vite) → manual QA.
- `npm run build && npm run preview` atau `make frontend-preview` → cek build produksi.
- `docker compose ... up -d` → refresh container; `curl` melalui proxy (ingat Cloudflare bisa challenge curl).

## Catatan
- `scripts/update_latest_posts.js`, `scripts/generate_sitemap.js` tetap tersedia bila ingin sinkron RSS + sitemap (tidak otomatis).
- `scripts/update_build_meta.js` dapat dioverride versi manual via `VERSION=...` apabila butuh.
- Legacy HTML/CSS lama tetap ada sampai 100% migrasi React selesai; jangan dihapus sebelum memutus dependency.
- Cloudflare Bot Fight Mode/WAF masih bisa memblokir curl; whitelist IP/UA jika perlu.

