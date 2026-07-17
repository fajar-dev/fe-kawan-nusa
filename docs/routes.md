# Peta Route & Halaman

Routing memakai konvensi file-based Nuxt dari [app/pages/](../app/pages/). Semua navigasi dijaga
oleh [middleware/auth.global.ts](../app/middleware/auth.global.ts) (lihat
[architecture.md](architecture.md#route-guard--authglobalts)).

Page meta yang dipakai: `layout` (`auth` / `onboarding`; default `default`), `middleware`
(`guest` di halaman auth), `role: 'admin'` (halaman khusus admin), `bgColor` (kelas background
konten), `layoutTitle` (judul di layout onboarding).

## Autentikasi (`layout: auth`, `middleware: guest`)

| Route | File | Fungsi |
|---|---|---|
| `/auth/sign-in` | `pages/auth/sign-in.vue` | Login email/telepon + kata sandi, tombol Google, tautan OTP/daftar/lupa sandi |
| `/auth/admin` | `pages/auth/admin.vue` | Login admin — hanya Google Sign-In |
| `/auth/otp` | `pages/auth/otp.vue` | Login OTP (kirim + verifikasi kode) |
| `/auth/register` | `pages/auth/register/index.vue` | Form pendaftaran mitra baru |
| `/auth/register/success` | `pages/auth/register/success.vue` | Konfirmasi pendaftaran (cek email) |
| `/auth/verify-email` | `pages/auth/verify-email.vue` | Landing tautan verifikasi (`?token=`); setelah sukses **tidak** auto-login — diarahkan ke `/auth/sign-in` untuk login manual |
| `/auth/forgot-password` | `pages/auth/forgot-password.vue` | Kirim email reset |
| `/auth/reset-password` | `pages/auth/reset-password.vue` | Form kata sandi baru (`?token=`) |

## Onboarding (`layout: onboarding`, role user)

| Route | File | Fungsi |
|---|---|---|
| `/boarding` | `pages/boarding/index.vue` | Step 1 — lengkapi data: KTP, data pribadi/perusahaan, rekening bank. Mode revisi menampilkan banner catatan admin |
| `/boarding/password` | `pages/boarding/password.vue` | Step 2 — buat kata sandi (dilewati bila sudah punya, mis. daftar via Google) |
| `/boarding/success` | `pages/boarding/success.vue` | Halaman status multi-fungsi: cek email / menunggu persetujuan / ditolak / nonaktif |

## Halaman Bersama (kedua role)

| Route | File | Fungsi |
|---|---|---|
| `/` | `pages/index.vue` | Dashboard — bercabang `isAdmin`: ringkasan global (admin) vs statistik referral pribadi + chart (mitra) |
| `/feedback` | `pages/feedback/index.vue` | Daftar/riwayat feedback |
| `/setting` | `pages/setting.vue` + `pages/setting/*` | Pengaturan (parent + child routes) |
| `/setting/account` | `pages/setting/account.vue` | Profil akun |
| `/setting/bank` | `pages/setting/bank.vue` | Rekening bank |
| `/setting/password` | `pages/setting/password.vue` | Ganti kata sandi |

## Halaman Mitra (role `user`)

| Route | File | Fungsi |
|---|---|---|
| `/customer` | `pages/customer/index.vue` | Daftar pelanggan hasil referral (tabel + filter) |
| `/customer/:id` | `pages/customer/[id].vue` | Detail pelanggan: alamat, layanan, poin |
| `/service` | `pages/service/index.vue` | Katalog produk & layanan Nusanet |
| `/service/:id` | `pages/service/[id].vue` | Detail layanan + pelanggan pengguna layanan |
| `/point/activity` | `pages/point/activity.vue` + `activity/*` | Parent tab aktivitas poin; index me-redirect ke `/point/activity/reward` |
| `/point/activity/reward` | `pages/point/activity/reward.vue` | Riwayat perolehan poin |
| `/point/activity/history` | `pages/point/activity/history.vue` | Riwayat penukaran/transaksi poin |
| `/point/redeem` | `pages/point/redeem/index.vue` | Tukar poin: katalog reward + modal penukaran tunai/produk/voucher |
| `/point/redeem/history` | `pages/point/redeem/history.vue` | Riwayat penukaran |
| `/education` | `pages/education/index.vue` | Hub edukasi (artikel & video unggulan) |
| `/education/article/:id` | `pages/education/article/[id].vue` | Baca artikel |
| `/education/video` / `/education/video/:id` | `pages/education/video/*` | Daftar & tonton video |
| `/education/service` | `pages/education/service.vue` | Katalog layanan (versi edukasi) |
| `/education/promotion` | `pages/education/promotion.vue` | Update promo |
| `/education/strategy` | `pages/education/strategy.vue` | Strategi penawaran |
| `/education/scheme` | `pages/education/scheme.vue` | Skema perolehan poin |

## Halaman Admin (`definePageMeta({ role: 'admin' })`)

| Route | File | Fungsi | permissionKey |
|---|---|---|---|
| `/user` | `pages/user/index.vue` | Data mitra referral (tabel, filter status) | `user` |
| `/user/:id` | `pages/user/[id].vue` + `[id]/*` | Detail mitra (parent + tab) dengan timeline riwayat status, aksi ubah status | `user` |
| `/user/:id/services` | `pages/user/[id]/services.vue` | Tab layanan pelanggan si mitra | |
| `/user/:id/reward` | `pages/user/[id]/reward.vue` | Tab perolehan poin | |
| `/user/:id/redeem` | `pages/user/[id]/redeem.vue` | Tab penukaran | |
| `/user/approval` | `pages/user/approval/index.vue` | Antrian persetujuan registrasi | `user.approval` |
| `/user/approval/:id` | `pages/user/approval/[id].vue` | Review data mitra → approve/reject/revisi (dengan catatan) | `user.approval` |
| `/point-submission` | `pages/point-submission/index.vue` | Input & approval poin dari akun NIS (OTC/Bulanan/recurring) | `point-submission` |
| `/redemption/cash` | `pages/redemption/cash/index.vue` | Proses pencairan tunai | `redemption.cash` |
| `/redemption/product` | `pages/redemption/product/index.vue` | Proses pengiriman produk (resi) | `redemption.product` |
| `/redemption/voucher` | `pages/redemption/voucher/index.vue` | Proses voucher (kode + kedaluwarsa) | `redemption.voucher` |
| `/catalog/admin/reward` | `pages/catalog/admin/reward.vue` | CRUD katalog reward + kategori | `catalog` |
| `/education/admin/category` | `pages/education/admin/category.vue` | CRUD kategori edukasi | `education` |
| `/education/admin/article` | `pages/education/admin/article/index.vue` | Daftar artikel | `education` |
| `/education/admin/article/create` | `.../article/create.vue` | Tulis artikel (editor Quill) | `education` |
| `/education/admin/article/:id` | `.../article/[id].vue` | Edit artikel | `education` |
| `/education/admin/video` (+ `create`, `:id`) | `pages/education/admin/video/*` | CRUD video | `education` |
| `/education/admin/template` | `pages/education/admin/template.vue` | CRUD template pemasaran | `education` |
| `/education/admin/promotion` | `pages/education/admin/promotion.vue` | CRUD promosi | `education` |
| `/role-permission` | `pages/role-permission/index.vue` | RBAC: CRUD role, matriks permission (L/T/E/H), penugasan karyawan | `role` |

## Struktur Navigasi Sidebar

Didefinisikan statis di [app/composables/useNavigation.ts](../app/composables/useNavigation.ts)
(`navItems`), difilter per role, dan item admin difilter lagi dengan `permissionKey` terhadap
permission user:

**Admin (atas):** Beranda · Referral (Data Referral, Persetujuan Registrasi) · Input Poin Referral ·
Tukar Poin (Tunai, Produk, Voucher) · Katalog Reward · Konten Edukasi (Kategori, Artikel, Video,
Template, Promosi). **Admin (bawah):** Pengaturan Akses.

**Mitra (atas):** Beranda · Customer Saya · Produk dan Layanan · Poin Saya (Aktivitas Poin, Tukar
Poin). **Mitra (bawah):** Edukasi · Pengaturan.

Item punya `match` (prefix path untuk state aktif) dan opsional `exact` (khusus Beranda `/`).
