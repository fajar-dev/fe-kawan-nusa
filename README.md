# Kawan Nusa

**Portal Referral PT. Media Antar Nusa (Nusanet)** — aplikasi web untuk program referral Nusanet.
Mitra referral mendaftarkan diri, mereferensikan pelanggan ke layanan Nusanet, mengumpulkan poin
dari setiap layanan pelanggan yang aktif, lalu menukarkan poin tersebut dengan **uang tunai,
produk, atau voucher**. Karyawan internal (admin) mengelola mitra, menginput & menyetujui poin,
memproses penukaran, serta mengelola konten edukasi dan katalog reward.

Repositori ini adalah **frontend** (Nuxt 4 SPA + PWA). Backend berada di repositori terpisah
[`kawan-nusa-be`](../kawan-nusa-be) (Bun + Hono + TypeORM + MySQL).

> 📚 Dokumentasi lengkap ada di folder [`docs/`](docs/) dan panduan untuk AI coding agent ada di
> [`CLAUDE.md`](CLAUDE.md).

## Fitur Utama

### Untuk Mitra Referral (role `user`)
- **Registrasi & Onboarding** — daftar via email/Google, verifikasi email, lengkapi data diri
  (KTP, NPWP, rekening bank), buat kata sandi, lalu menunggu persetujuan admin.
- **Dashboard** — ringkasan jumlah pelanggan, layanan, dan poin beserta tren bulanan (chart).
- **Customer Saya** — daftar pelanggan hasil referral beserta layanan & poin per pelanggan.
- **Produk dan Layanan** — katalog layanan Nusanet yang dapat direferensikan.
- **Poin Saya** — riwayat perolehan poin (reward) dan riwayat penukaran.
- **Tukar Poin** — penukaran tunai (transfer bank, dengan pajak & payout), produk (dikirim via
  ekspedisi), dan voucher (kode + masa berlaku).
- **Edukasi** — artikel, video, template pemasaran (PNG/JPG/PSD/MP4), update promo, strategi
  penawaran, dan skema poin.
- **Pengaturan** — profil akun, rekening bank, kata sandi, preferensi (auto-withdraw, langganan
  info), foto profil.
- **Feedback** — kirim keluhan/saran/pujian dengan lampiran gambar.

### Untuk Admin (role `admin`, login khusus via Google `/auth/admin`)
- **Dashboard admin** — statistik keseluruhan (pengguna, pelanggan, layanan, poin tersalurkan).
- **Referral** — data mitra, detail lengkap (profil, layanan, poin, penukaran, statistik, riwayat
  status), serta **persetujuan registrasi** (approve / reject / minta revisi dengan catatan).
- **Input Poin Referral** — input poin manual dari akun NIS (sistem internal Nusanet), tipe
  OTC/Bulanan, dukungan poin berulang (recurring), approval berjenjang.
- **Tukar Poin** — pemrosesan penukaran tunai (upload bukti transfer), produk (input resi
  pengiriman), voucher (input kode voucher), lengkap dengan riwayat status.
- **Katalog Reward** — CRUD katalog produk/voucher (stok, poin, kategori, kedaluwarsa).
- **Konten Edukasi** — CRUD kategori, artikel (rich-text editor Quill), video, template pemasaran,
  dan promosi.
- **Pengaturan Akses (RBAC)** — kelola role karyawan dengan matriks permission per modul
  (Lihat/Tambah/Edit/Hapus) dan penugasan karyawan ke role.

## Tech Stack

| Bagian | Teknologi |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) (Vue 3.5, TypeScript, `ssr: false` — SPA) |
| Styling | Tailwind CSS v4 + DaisyUI v5, font Montserrat, warna utama `#629e43` |
| HTTP client | axios (service-class layer, bukan `useFetch`) |
| Ikon | lucide-vue-next, @nuxt/icon |
| PWA | @vite-pwa/nuxt (installable, auto-update, offline shell) |
| Auth | JWT (access + refresh token) + Google Sign-In (`nuxt-vue3-google-signin`) |
| Notifikasi | nuxt-notify (`useToast`) |
| Chart | nuxt-charts |
| Editor | @vueup/vue-quill (artikel edukasi) |
| Lainnya | zod (validasi), vue-command-palette (pencarian ⌘K), modern-screenshot |
| Package manager | **pnpm** |

## Menjalankan Project

### Prasyarat
- Node.js ≥ 20 dan pnpm
- Backend `kawan-nusa-be` berjalan (default `http://localhost:4000`, Swagger di `/api/docs`)

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Buat file .env
cat > .env <<'EOF'
API_BASE_URL=http://localhost:4000/api
GOOGLE_CLIENT_ID=<google-oauth-client-id>
EOF

# 3. Jalankan dev server → http://localhost:3000
pnpm dev
```

### Perintah lain

```bash
pnpm build      # build produksi → .output/
pnpm preview    # preview hasil build
pnpm generate   # static generation
```

### Environment Variables

| Variabel | Deskripsi |
|---|---|
| `API_BASE_URL` | Base URL API backend (mis. `http://localhost:4000/api`). Diekspos ke client sebagai `runtimeConfig.public.apiUrl`. |
| `GOOGLE_CLIENT_ID` | Client ID Google OAuth untuk login Google (user & admin). |

## Struktur Direktori

```
app/
├── app.vue               # Root component (NuxtLayout + NuxtPage, SEO meta)
├── assets/css/main.css   # Tailwind v4 @theme + DaisyUI (satu-satunya file CSS global)
├── layouts/              # default (sidebar+header), auth (split carousel), onboarding
├── middleware/           # auth.global.ts (guard token+status+role), guest.ts
├── pages/                # Routing file-based (lihat docs/routes.md)
├── components/           # Auto-imported: App* (shell), Modal* (dialog), Data* (tabel/filter)
├── composables/          # useAuth, usePermission, useNavigation, error-helper
├── services/             # Layer API per-domain (class + singleton), api-service = axios core
├── types/                # Interface TypeScript untuk semua bentuk respons API
└── utils/                # Helper tanggal/status/string (locale id-ID, auto-imported)
public/                   # Ikon PWA, gambar statis, robots.txt
nuxt.config.ts            # Modul, PWA manifest, proxy /api, runtimeConfig
```

## Dokumentasi

| Dokumen | Isi |
|---|---|
| [docs/architecture.md](docs/architecture.md) | Arsitektur aplikasi: alur auth, middleware, service layer, PWA, state |
| [docs/domain.md](docs/domain.md) | Model bisnis: siklus hidup mitra, poin, penukaran, glosarium istilah |
| [docs/api-services.md](docs/api-services.md) | Pemetaan lengkap service frontend → endpoint API backend |
| [docs/routes.md](docs/routes.md) | Peta seluruh halaman/route beserta role, layout, dan fungsinya |
| [docs/components.md](docs/components.md) | Katalog komponen bersama & konvensi penulisan kode |
| [CLAUDE.md](CLAUDE.md) | Panduan ringkas untuk AI coding agent |

## Catatan Penting

- **Tidak ada test & linter** — verifikasi perubahan lewat dev server.
- Penukaran poin sisi mitra ada di `/point/redeem`; pemrosesan penukaran sisi admin ada di
  `/redemption/*` — keduanya berbeda.
- Semua teks UI berbahasa **Indonesia**; format tanggal & angka memakai locale `id-ID`.
- Sesi disimpan di `localStorage` (`accessToken`, `refreshToken`, `user`, `auth_permissions`);
  refresh token otomatis dilakukan oleh interceptor axios saat menerima 401.

## Repositori Terkait

| Repo | Deskripsi |
|---|---|
| `kawan-nusa-be` | Backend API — Bun + Hono + TypeORM + MySQL + MinIO. Modul: auth, user, customer, service, point, point-submission, redemption, catalog, education, role, statistic, template, feedback, dll. Job terjadwal: sync-users/customers/employees (dari NIS), expire-points, process-submissions, recurring-points. |
