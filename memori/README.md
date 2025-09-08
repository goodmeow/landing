# Memori Proyek — Landing Page Statik

Ringkasan teknis proyek ini untuk referensi development dan deployment.

## Ringkasan
- Tipe: situs landing page statik (HTML + CSS) dengan 404 page.
- Hosting: Nginx dalam Docker; diproksi oleh Nginx reverse proxy ber‑TLS.
- Fitur: SEO dasar (title/desc/OG/Twitter), sitemap, robots, web manifest (PWA meta minimal).

## Struktur Direktori
- `index.html` — halaman utama dan seluruh konten.
- `styles.css` — gaya global untuk tema gelap/terang, komponen kartu, tombol, dll.
- `404.html` — halaman error kustom.
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, ikon — aset SEO/PWA.
- `deploy/` — konfigurasi Docker Compose dan Nginx.
  - `deploy/docker-compose.yml` — service `landing` (nginx:alpine), mount file statik, expose 80 ke network Docker `web` (eksternal).
  - `deploy/nginx/site.conf` — Nginx untuk menyajikan file statik + custom 404.
  - `deploy/nginx/goodmeow.conf` — contoh konfigurasi reverse proxy TLS untuk domain `goodmeow.my.id` yang mem‑proxy ke service `landing` di network `web`.

## Teknologi & Keputusan
- **Front-end**: HTML5 semantik, CSS modern (var CSS, color-mix, grid responsif). Tidak ada JS build tool; hanya skrip kecil untuk tahun footer.
- **SEO/Meta**: Open Graph + Twitter Card, `<link rel="canonical">`, `sitemap.xml`, `robots.txt`.
- **PWA Meta**: `site.webmanifest` (name/short_name, theme/background, icons dasar).
- **Server**: Nginx statik dengan `try_files` dan custom `error_page 404`.
- **Deploy**: Docker Compose; asumsi ada reverse proxy Nginx terpisah di jaringan `web` yang mengelola TLS (Cloudflare origin cert di contoh).

## Hal yang Perlu Disesuaikan (Branding/Konten)
Edit nilai placeholder berikut agar sesuai identitas Anda:
- `index.html`
  - `<title>`: "Your Name — Developer & Writer"
  - `<meta name="description">`
  - Open Graph/Twitter: `og:title`, `og:description`, `og:image`, `twitter:*`
  - `<link rel="canonical" href="https://www.goodmeow.my.id/">` (ganti domain)
  - JSON‑LD `WebSite` + `Person`: `name`, `url`
  - Navigasi/CTA: email `mailto:you@example.com`, tautan GitHub/LinkedIn, teks hero, daftar tulisan/proyek.
- `site.webmanifest`: `name`, `short_name`, warna tema, ikon jika perlu.
- `sitemap.xml`: domain dan `lastmod` sesuai tanggal rilis.
- `robots.txt`: URL sitemap ke domain final.

## Alur Pengembangan Lokal
Opsi 1 — server statik lokal cepat:
- Jalankan `python3 -m http.server 8000` di root repo, buka `http://localhost:8000`.

Opsi 2 — via Docker (Nginx):
- Pastikan Docker jalan, lalu `docker compose -f deploy/docker-compose.yml up -d`.
- Akses melalui container reverse proxy pada network `web` (lihat bagian Deploy). Jika tanpa reverse proxy, Anda bisa publish port sementara: `docker run --rm -p 8080:80 -v "$PWD":/usr/share/nginx/html:ro nginx:alpine` dan buka `http://localhost:8080`.

## Deploy
Arsitektur: reverse proxy Nginx (TLS) → service `landing` (Nginx statik) di network Docker bernama `web`.

Langkah umum:
1) Buat network eksternal (sekali saja):
   - `docker network create web`
2) Jalankan service statik:
   - `docker compose -f deploy/docker-compose.yml up -d`
3) Pastikan reverse proxy terhubung ke network `web` dan memuat `deploy/nginx/goodmeow.conf`.
   - File ini melakukan:
     - Redirect HTTP→HTTPS dan non‑www→www.
     - Menetapkan header keamanan dasar.
     - `proxy_pass http://landing:80;` dengan `Host`, `X-Forwarded-*` header.
     - Cache 7 hari untuk aset statik umum.
4) Pasang sertifikat TLS (contoh menunjuk ke Cloudflare origin cert di `/etc/nginx/certs/...`).
5) Reload Nginx reverse proxy.

Catatan volume di `deploy/docker-compose.yml`:
- File HTML/CSS/ikon dimount read‑only ke `/usr/share/nginx/html/...`.
- `deploy/nginx/site.conf` dimount ke `/etc/nginx/conf.d/default.conf`.
- Service `landing` hanya `expose 80` (tidak publish ke host), sehingga harus diakses via network Docker `web`/reverse proxy.

## Konvensi Kode
- Simpel dan bebas dependensi: semua di `index.html` + `styles.css`.
- CSS: gunakan variabel root dan utilitas yang sudah ada agar gaya konsisten.
- Hindari JS berlebihan; jika perlu interaksi, pertahankan tanpa build tool.

## Checklist Pra-Rilis
- [ ] Ganti semua placeholder "Your Name" dan kontak.
- [ ] Perbarui `og:image` ke gambar final (ukuran OG 1200x630 disarankan).
- [ ] Perbarui `canonical`, `sitemap.xml`, dan `robots.txt` ke domain final.
- [ ] Verifikasi aksesibilitas dasar (kontras, fokus, heading order).
- [ ] Uji tampilan mobile dan desktop.
- [ ] Audit performa (ukuran aset, cache headers dari reverse proxy).
- [ ] Pastikan sertifikat TLS valid dan auto‑renewal (jika tidak via Cloudflare).

## Pengujian Cepat
- 404: akses URL yang tidak ada → harus memuat `404.html` via `error_page`.
- Cache: periksa response header aset (`Cache-Control`, `expires`) lewat reverse proxy.
- SEO: cek meta OG/Twitter di HTML source dan gunakan Debugger (FB/OG & Twitter/X validator).

## Ide Peningkatan
- Tambah halaman blog/pos terpisah atau integrasi ke platform blog.
- Tambah analitik privasi (mis. Plausible/Umami) via `<script>` ringan.
- Tambah gambar avatar kustom alih‑alih gradien CSS.
- Optimasi gambar OG (kompresi, CDN, cache immutabel).

---
Dokumen ini dimaksudkan sebagai memori proyek untuk membantu onboarding, development, dan operasional.
