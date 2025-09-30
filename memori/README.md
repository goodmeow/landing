# Memori Proyek — Landing Page (React/Tailwind)

Ringkasan singkat untuk pengembangan dan deployment.

## Ringkasan
- Front-end: React + Vite + Tailwind CSS 4, komponen HeroUI.
- Build statik disajikan via Nginx (Docker) di belakang reverse proxy TLS/Cloudflare.
- SEO dasar: meta OG/Twitter, canonical, sitemap statik, robots, web manifest.
- Branding: "goodmeow's blog" + ikon Gravatar.
- Versi halaman ditampilkan lewat meta `x-build` (format `YYYY.MM.DD+<shortSHA>`).

## Struktur Direktori Penting
- `frontend/`
  - `src/` — komponen React, styling Tailwind (`styles.css`).
  - `tailwind.config.js` — plugin Tailwind + HeroUI.
  - `vite.config.js` — konfigurasi build.
  - `dist/` — output produksi (dipakai Nginx).
- `deploy/` — `docker-compose.yml` + konfigurasi Nginx.
- `scripts/update_build_meta.js` — update meta `x-build` berdasarkan commit.
- `memori/` — dokumentasi proyek (file ini).
- `robots.txt`, `sitemap.xml`, `site.webmanifest` — aset SEO/PWA statik.

## Workflow Build & Deploy
- `make frontend-version` → jalankan script versi (`node scripts/update_build_meta.js`).
- `make frontend-build` → build produksi (`npm run build`).
- `make frontend-sync` → install dep, bersihkan `dist`, update versi, build.
- `make frontend-preview` → preview di `0.0.0.0:4173`.
- Deploy container: `docker compose -f deploy/docker-compose.yml up -d --force-recreate`.
- GitHub Action `.github/workflows/build-version.yml` menjalankan script versi (tidak lagi generate sitemap) dan commit perubahan jika ada.

## Checklist Pra-Rilis
- [ ] Konten di `frontend/src/App.jsx` sudah sesuai (hero/blog/about/contact).
- [ ] Meta SEO di `frontend/index.html` benar (title, description, OG/Twitter, JSON-LD).
- [ ] `make frontend-version` atau `make frontend-sync` dijalankan sebelum commit/push.
- [ ] Build React sukses dan container Nginx di-redeploy.
- [ ] Review performa/aksesibilitas/SEO sesuai kebutuhan.

## Pengujian Cepat
- `npm run dev` (Vite) untuk QA.
- `npm run build && npm run preview` atau `make frontend-preview` untuk cek build produksi.
- `docker compose ... up -d` dan akses melalui reverse proxy (ingat Cloudflare bisa memblokir curl).

## Catatan
- Sitemap + konten blog kini dikelola manual; skrip lama telah dihapus.
- `scripts/update_build_meta.js` bisa dioverride dengan `VERSION=... node scripts/update_build_meta.js` bila perlu.
- Cloudflare Bot Fight Mode/WAF masih bisa memblokir curl; whitelist IP/UA jika diperlukan.
