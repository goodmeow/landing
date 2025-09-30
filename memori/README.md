# Memori Proyek — Landing Page Statik

Ringkasan teknis proyek ini untuk referensi development dan deployment.

## Ringkasan
- Tipe: situs landing page statik (HTML + CSS) dengan 404 page.
- Hosting: Nginx dalam Docker; diproksi oleh Nginx reverse proxy ber‑TLS.
- Fitur: SEO dasar (title/desc/OG/Twitter), sitemap, robots, web manifest (PWA meta minimal).
- Branding: "goodmeow's blog" (About, kontak, LinkedIn, GitHub disesuaikan).
- Avatar/ikon: memakai Gravatar (endpoint publik) untuk favicon, Apple touch icon, OG/Twitter image, dan avatar di About.
- Lisensi konten: CC BY‑SA 4.0 (lihat `LICENSE.md`, badge di footer).
- Versioning: footer menampilkan versi `YYYY.MM.DD+<shortSHA>` dari meta `x-build` (auto‑update via GitHub Actions).
  - Seksi "Latest Writing" otomatis diisi ulang dari RSS Ghost (lihat bagian "Integrasi RSS").

## Struktur Direktori
- `index.html` — halaman utama dan seluruh konten.
- `styles.css` — gaya global untuk tema gelap/terang, komponen kartu, tombol, dll.
- `404.html` — halaman error kustom.
- `robots.txt`, `sitemap.xml`, `site.webmanifest` — aset SEO/PWA.
- `assets/` — ikon statik (`favicon.svg`, `favicon-32x32.png`, `apple-touch-icon.png`).
- `deploy/` — konfigurasi Docker Compose dan Nginx.
  - `deploy/docker-compose.yml` — service `landing` (nginx:alpine), mount file statik, expose 80 ke network Docker `web` (eksternal).
  - `deploy/nginx/site.conf` — Nginx untuk menyajikan file statik + custom 404.
- `deploy/nginx/goodmeow.conf` — contoh konfigurasi reverse proxy TLS untuk domain `goodmeow.my.id` yang mem‑proxy ke service `landing` di network `web`.
- `package.json`, `package-lock.json` — tool Node lokal (tidak dibundle) untuk sinkronisasi posting Ghost.
- `scripts/update_latest_posts.js` — skrip Node yang menarik RSS Ghost dan menulis ulang kartu konten terbaru.
- `sitemap.config.json`, `scripts/generate_sitemap.js` — konfigurasi URL dan generator sitemap statik.

## Teknologi & Keputusan
- **Front-end**: HTML5 semantik, CSS modern (var CSS, color-mix, grid responsif). Tanpa build tool; JS ringan untuk set versi dan cache-busting CSS.
- **SEO/Meta**: Open Graph + Twitter Card, `<link rel="canonical">`, `sitemap.xml`, `robots.txt`.
- **PWA Meta**: `site.webmanifest` (name/short_name, theme/background, icons dasar).
- **Avatar/Ikon**: Gravatar endpoint publik (hash MD5 email) digunakan di `<link rel="icon">`, `<link rel="apple-touch-icon">`, OG/Twitter, dan `.avatar` CSS (About). CSP mengizinkan `img-src` ke `https://www.gravatar.com`.
- **Server**: Nginx statik dengan `try_files` dan custom `error_page 404`.
- **Security/Hardening (reverse proxy)**: rate limit (10 r/s, burst 30), limit_conn per IP, blokir metode selain GET/HEAD/OPTIONS, header keamanan (`HSTS`, `X-CTO`, `CSP`, `Permissions-Policy`, `X-Robots-Tag: noai,noimageai`), dan pemblokiran UA crawler AI.
- **Deploy**: Docker Compose; asumsi ada reverse proxy Nginx terpisah di jaringan `web` yang mengelola TLS (Cloudflare origin cert di contoh).

## Hal yang Perlu Disesuaikan (Branding/Konten)
Edit nilai berikut agar sesuai identitas:
- `index.html`
  - `<title>`, `<meta name="description">`, OG/Twitter (`og:title`, `og:description`, `twitter:*`).
  - `<link rel="canonical" href="https://www.goodmeow.my.id/">` (ganti domain jika berubah).
  - JSON‑LD `WebSite` + `Person`: `name`, `url`.
  - Kontak: `mailto:aarunalr@pm.me`, LinkedIn, GitHub.
  - Avatar/ikon: ganti GRAVATAR_HASH jika email berubah (lihat Catatan Gravatar).
- `site.webmanifest`: `name`, `short_name`, warna tema, ikon jika perlu.
- `sitemap.xml`: domain dan `lastmod` sesuai tanggal rilis.
- `robots.txt`: URL sitemap ke domain final.
- Footer: lisensi CC BY‑SA 4.0 dan versi akan terisi otomatis dari meta `x-build`.
- `index.html` (Latest Writing): blok `<!-- latest-posts:start --> ... <!-- latest-posts:end -->` diupdate dari RSS; jalankan skrip bila ada rilis baru.
- `sitemap.config.json`: tambahkan entri jika ada halaman baru; sitemap akan di-generate otomatis.
- `assets/`: simpan ikon statik (`favicon.svg`, `favicon-32x32.png`, `apple-touch-icon.png`); pastikan manifest & 404 mengarah ke path baru.

## Alur Pengembangan Lokal
Opsi 1 — server statik lokal cepat:
- Jalankan `python3 -m http.server 8000` di root repo, buka `http://localhost:8000`.

Opsi 2 — via Docker (Nginx):
- Pastikan Docker jalan, lalu `docker compose -f deploy/docker-compose.yml up -d`.
- Akses melalui container reverse proxy pada network `web` (lihat bagian Deploy). Jika tanpa reverse proxy, Anda bisa publish port sementara: `docker run --rm -p 8080:80 -v "$PWD":/usr/share/nginx/html:ro nginx:alpine` dan buka `http://localhost:8080`.

Opsi 3 — uji lokal workflow versi (tanpa GitHub Actions):
- Jalankan `DRY_RUN=1 scripts/ci_build_version_local.sh` untuk melihat diffs.
- Jalankan `scripts/ci_build_version_local.sh` untuk menulis versi ke `index.html` dan bump `styles.css?v=<versi>`.
- Jalankan `npm run update:latest-posts` untuk sync section Latest Writing dengan feed blog (memerlukan Node 18+).
- Jalankan `npm run generate:sitemap` untuk menulis ulang `sitemap.xml` (otomatis juga berjalan di GitHub Actions pada push ke `main`).

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
     - Hardening: rate limit, UA block AI, CSP/Permissions‑Policy.
4) Pasang sertifikat TLS (contoh menunjuk ke Cloudflare origin cert di `/etc/nginx/certs/...`).
5) Reload Nginx reverse proxy.

Catatan volume di `deploy/docker-compose.yml`:
- File HTML/CSS/ikon dimount read‑only ke `/usr/share/nginx/html/...`.
- `deploy/nginx/site.conf` dimount ke `/etc/nginx/conf.d/default.conf`.
- Service `landing` hanya `expose 80` (tidak publish ke host), sehingga harus diakses via network Docker `web`/reverse proxy.

## Konvensi Kode
- Simpel dan bebas dependensi: semua di `index.html` + `styles.css`.
- CSS: gunakan variabel root dan utilitas yang sudah ada agar gaya konsisten.
- JS: kecil & inline untuk set versi dan bump query string CSS berdasar meta `x-build`.

## Checklist Pra-Rilis
- [ ] Branding & kontak sudah final.
- [ ] OG/Twitter image memakai Gravatar atau gambar khusus.
- [ ] `canonical`, `sitemap.xml`, dan `robots.txt` sesuai domain final.
- [ ] Aksesibilitas dasar (kontras, fokus, heading).
- [ ] Tampilan mobile dan desktop oke.
- [ ] Performa (ukuran aset, cache headers reverse proxy).
- [ ] TLS valid, auto‑renewal.
- [ ] Hardening aktif (CSP, rate limit, UA blockers) dan tidak memblokir resource sah.
- [ ] Lisensi tampak di footer + `LICENSE.md` ada.
- [ ] Versi tampil di footer; meta `x-build` telah diupdate oleh CI.

## Pengujian Cepat
- 404: akses URL yang tidak ada → harus memuat `404.html` via `error_page`.
- Cache: periksa response header aset (`Cache-Control`, `expires`) lewat reverse proxy.
- SEO: cek meta OG/Twitter di HTML source dan gunakan Debugger (FB/OG & Twitter/X validator).
- Security: uji limit rate (dapat 429 jika spam), UA AI (403), dan CSP (resource eksternal hanya Gravatar).

## Perapian Repo
- Hapus bagian proyek (cards) dari landing; navigasi & CTA sudah disesuaikan.
- Ganti favicon/OG/Apple touch ke Gravatar via endpoint publik; tetap dukung ikon lokal pada web manifest.
- Footer memakai lisensi CC BY‑SA (badge) dan menampilkan versi build.
- `.gitignore` menolak `.env*` dan `deploy/.env.*`; contoh `deploy/.env.blog.example` dipertahankan.
- Script util lokal: `scripts/ci_build_version_local.sh` untuk meniru workflow versi.

## Catatan Gravatar
- Hash yang digunakan: MD5 dari email `harunbam3@gmail.com` (tidak mengekspos email).
- Endpoint yang dipakai (contoh):
  - Favicon: `https://www.gravatar.com/avatar/<hash>?s=32&d=identicon`
  - Apple touch: `...s=180...`
  - OG/Twitter: `...s=512...`
  - Avatar About (CSS background): `...s=180...`
- Jika ingin sepenuhnya tanpa ketergantungan eksternal, ambil Gravatar dan simpan lokal; perbarui CSP `img-src` bila perlu.

## Versioning & CI
- Versi tersimpan di meta `x-build` lalu ditampilkan di footer.
- GitHub Actions `build-version.yml` otomatis:
  - Menghitung versi `YYYY.MM.DD+<shortSHA>`.
  - Mengupdate meta `x-build` di `index.html`.
  - Meng‑set query string stylesheet `styles.css?v=<versi>` untuk cache‑busting.
  - Commit kembali ke `main` jika ada perubahan.

## Ide Peningkatan
- Tambah halaman blog/pos terpisah atau integrasi ke platform blog.
- Tambah analitik privasi (mis. Plausible/Umami) via `<script>` ringan.
- Tambah gambar avatar kustom alih‑alih gradien CSS.
- Optimasi gambar OG (kompresi, CDN, cache immutabel).

---
Dokumen ini dimaksudkan sebagai memori proyek untuk membantu onboarding, development, dan operasional.

## Staging: Opsi C (Ghost CMS) — cabang `staging/ghost-blog`
Struktur staging (cabang terpisah):
- `deploy/docker-compose.blog.yml` — service `blog` (Ghost) + `blog_db` (MySQL 8). `url` default `https://blog.goodmeow.my.id`.
- `deploy/.env.blog` — konfigurasi MySQL & SMTP Oracle Cloud + `GHOST_PUBLIC_URL` (override jika perlu).
- `deploy/nginx/goodmeow.conf` — dua cara akses:
  - Subdomain `blog.goodmeow.my.id` (server block khusus) → proxy ke `blog:2368/` (root).
  - Subpath `/blog/` di domain utama tetap tersedia.
- `blog_content/` — volume konten Ghost (commit `.gitkeep` kosong saja).

Jalankan staging lokal:
- `docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.blog.yml up -d`
- Akses via reverse proxy: `https://blog.goodmeow.my.id/` (pastikan sertifikat subdomain), atau `https://www.goodmeow.my.id/blog`.

Notes:
- Ghost mendukung subdirektori jika `url` diset ke `https://domain.tld/blog`; namun subdomain direkomendasikan.
- Reverse proxy meneruskan `X-Forwarded-*` header; tidak perlu path rewrite tambahan.
- Produksi: gunakan MySQL dan SMTP Oracle Cloud agar magic link berfungsi.
- Latest posts di landing diisi ulang dari `https://blog.goodmeow.my.id/rss/`. Pastikan feed publik aktif.
- Workflow GitHub `build-version.yml` kini juga menjalankan `npm ci` + `npm run generate:sitemap` sebelum memperbarui meta versi.

### Email Delivery (Oracle Cloud) — DNS & SMTP
- Provider: Oracle Email Delivery (region `ap-batam-1`).
- SMTP endpoint: `smtp.email.ap-batam-1.oci.oraclecloud.com:587` (STARTTLS)
  - Ghost env: `mail__transport=smtp`, `mail__options__secure=false`, `mail__options__requireTLS=true`.
  - Username: SMTP credential dari OCI. Password: kutip jika ada karakter khusus.

Konfigurasi DNS di Cloudflare (DNS only / bukan proxied):
- DKIM CNAME (dari tab DKIM pada Email Domain):
  - Type: `CNAME`
  - Name: `<selector>._domainkey` (contoh: `aa-batam-202509._domainkey`)
  - Target: `<selector>.goodmeow.my.id.dkim.<cluster>.oracleemaildelivery.com`

- Custom Return Path (bounce domain):
  - Type: `CNAME`
  - Name: `return`
  - Target: `hsg1.rp.oracleemaildelivery.com`

- SPF untuk Return Path (agar “SPF Configured” menjadi Yes di OCI):
  - Type: `TXT`
  - Name: `return`
  - Content: `v=spf1 include:_spf.email.ap-batam-1.oci.oraclecloud.com ~all`
  - Catatan: pakai persis nilai “SPF Record Value” dari OCI jika berbeda.

- (Opsional) SPF untuk root domain pengirim:
  - Type: `TXT`
  - Name: `@`
  - Content: `v=spf1 include:_spf.email.ap-batam-1.oci.oraclecloud.com ~all`
  - Jika sudah ada SPF lain, gabungkan menjadi satu baris (satu TXT saja di root).

- DMARC (disarankan):
  - Type: `TXT`
  - Name: `_dmarc`
  - Content (contoh): `v=DMARC1; p=quarantine; rua=mailto:dmarc@yourmail; pct=100`

Verifikasi:
- DNS: `dig +short CNAME return.goodmeow.my.id`, `dig +short TXT return.goodmeow.my.id`, `dig +short TXT goodmeow.my.id`.
- OCI Console: status DKIM Active; Custom Return Path Active; “SPF Configured: Yes”.
- Kirim test dari Ghost; cek header `Received-SPF` dan hasil di mail‑tester.com.

## Log Pekerjaan — 2025‑09‑08

Ringkasan perubahan besar hari ini:
- Branding & konten: set identitas “goodmeow’s blog”, About, kontak, dan tautan sosial.
- Ikon/OG: pakai Gravatar (hash Gmail) untuk favicon, Apple touch, OG/Twitter; avatar About pakai gambar Gravatar.
- Lisensi: konten dilisensikan CC BY‑SA 4.0; badge di footer.
- Versioning: footer menampilkan versi dari meta `x-build`; CI GitHub Action menulis otomatis dan bump `styles.css?v=...`. Script lokal tersedia `scripts/ci_build_version_local.sh`.
- Keamanan: hardening Nginx (rate limit, limit_conn, method allowlist, headers `HSTS`, CSP, `Permissions-Policy`, `X-Robots-Tag noai,noimageai`), tambah blokir UA crawler AI; robots.txt disesuaikan.
- Staging Ghost (opsi C):
  - Subdomain `blog.goodmeow.my.id` via server block khusus; sub-path `/blog/` tetap tersedia.
  - Compose: `deploy/docker-compose.blog.yml` berisi `blog` (Ghost) + `blog_db` (MySQL 8), volume `blog_content/` dan `blog_mysql/`.
  - Env: `deploy/.env.blog` (git‑ignored) menyimpan `GHOST_PUBLIC_URL`, kredensial MySQL, dan SMTP Oracle ap‑batam‑1.
  - CSP untuk host blog dilonggarkan agar Portal/Stripe berfungsi (`js.stripe.com`, `unpkg.com`), tetap ketat untuk yang lain.
  - Nginx: izinkan `POST` pada `location /blog/` dan host blog agar API Ghost (signin/signup/webhook) berjalan.
- Email Oracle (ap‑batam‑1):
  - SMTP: `smtp.email.ap-batam-1.oci.oraclecloud.com:587`, `secure=false`, `requireTLS=true`.
  - DNS: DKIM selector (CNAME), Return Path (CNAME), SPF TXT untuk `return`, opsional SPF di root `@`, dan DMARC.
  - Sender: gunakan root domain — `no-reply@goodmeow.my.id`.

Perbaikan signup (root cause dan tindakan):
- Error 405 pada signup → karena method `POST` diblokir hardening. Solusi: izinkan `POST` di lokasi blog.
- Error SMTP 535 “Envelope From not authorized” → karena Ghost mengirim `noreply@blog.goodmeow.my.id`.
  - Solusi: set sender ke root domain di dua tempat:
    - Env: `members__fromAddress=no-reply@goodmeow.my.id`.
    - DB Ghost: `settings.members_from_address = 'no-reply@goodmeow.my.id'` dan newsletter `sender_email` di `newsletters`.
- Error 429 (throttle) saat tes berulang → clear brute force table.

Snippet operasional (troubleshooting cepat):
- Tailing log Ghost selama 60 detik:
  - `timeout 60s bash -lc 'docker logs -f --since=1s blog_ghost 2>&1'`
- Reset throttle login (brute‑force):
  - `docker exec -i blog_mysql mysql -uroot -e "USE ghost; TRUNCATE TABLE brute;"`
- Paksa sender root domain di DB:
  - `docker exec -i blog_mysql mysql -uroot -e "USE ghost; UPDATE settings SET value='no-reply@goodmeow.my.id' WHERE \`key\`='members_from_address'; UPDATE newsletters SET sender_email='no-reply@goodmeow.my.id', sender_name='goodmeow' WHERE sender_email IS NULL OR sender_email='';"`
- Cek user/db MySQL dan buat jika perlu:
  - `docker exec blog_mysql mysql -uroot -e "CREATE USER IF NOT EXISTS 'gmblog'@'%' IDENTIFIED BY '<strong-password>'; CREATE DATABASE IF NOT EXISTS ghost; GRANT ALL PRIVILEGES ON ghost.* TO 'gmblog'@'%'; FLUSH PRIVILEGES;"`
- Recreate layanan staging:
  - `docker compose -f deploy/docker-compose.yml -f deploy/docker-compose.blog.yml up -d --force-recreate`

Catatan integrasi Cloudflare DNS (contoh):
- DKIM: `aa-batam-202509._domainkey` → `aa-batam-202509.goodmeow.my.id.dkim.hsg1.oracleemaildelivery.com` (CNAME, DNS only).
- Return Path: `return` → `hsg1.rp.oracleemaildelivery.com` (CNAME, DNS only).
- SPF Return Path: TXT `return` → `v=spf1 include:_spf.email.ap-batam-1.oci.oraclecloud.com ~all`.
- Opsional SPF root `@` → sertakan include Oracle agar DMARC align.

Status akhir (staging blog):
- `blog_mysql`: healthy; user `gmblog` dan DB `ghost` aktif.
- `blog_ghost`: running; signup via magic link berhasil (HTTP 201), email terkirim.
- Reverse proxy: CSP/headers + method POST sudah sesuai untuk Ghost.
  - SMTP Oracle Cloud: host `smtp.email.ap-batam-1.oci.oraclecloud.com`, port `587`, `secure=false`, `requireTLS=true`.
  - Jika password SMTP mengandung karakter khusus (mis. `#`), gunakan tanda kutip di `.env`.
