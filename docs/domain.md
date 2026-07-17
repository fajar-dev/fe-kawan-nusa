# Model Domain & Alur Bisnis

Kawan Nusa adalah program referral PT. Media Antar Nusa (Nusanet, penyedia layanan internet).
Dokumen ini menjelaskan entitas bisnis, siklus hidupnya, dan istilah yang dipakai di seluruh kode.

## Aktor

| Aktor | Role di sistem | Deskripsi |
|---|---|---|
| **Mitra referral** | `user` | Orang/perusahaan luar yang mereferensikan pelanggan ke Nusanet dan mendapat poin. |
| **Admin / karyawan** | `admin` | Karyawan Nusanet. Login khusus via Google di `/auth/admin`. Hak akses granular diatur RBAC (lihat [architecture.md](architecture.md)). |

## Siklus Hidup Mitra (`user.status`)

```
 daftar ──► verifikasi email ──► boarding (isi data + kata sandi) ──► pending
                                                                        │
                                       ┌────────────────────────────────┼───────────────┐
                                       ▼                                ▼               ▼
                                    active ◄──── (perbaiki data) ◄── revision         reject
                                       │
                                       ▼
                                   inactive (dinonaktifkan admin, bisa diaktifkan lagi)
```

| Status | Arti | Akses |
|---|---|---|
| *(belum verifikasi)* | `isVerified = false` | Terkunci di `/boarding/success` ("cek email") |
| `null` + `isBoarding=false` | Belum melengkapi data | Terkunci di `/boarding` |
| `pending` | Menunggu persetujuan admin | Terkunci di `/boarding/success` |
| `revision` | Admin minta perbaikan data (dengan `statusNote`) | Kembali ke `/boarding`, banner catatan revisi |
| `active` | Mitra aktif | Akses penuh aplikasi |
| `reject` | Ditolak (dengan catatan) | Terkunci di `/boarding/success` |
| `inactive` | Dinonaktifkan | Terkunci di `/boarding/success` |

- Admin memproses persetujuan di `/user/approval` (`PATCH /user/:id/status` dengan `status` +
  `note`). Setiap perubahan tercatat sebagai **riwayat status** (`GET /user/:id/status-histories`)
  dan tampil sebagai timeline di halaman detail user.
- Data boarding: foto KTP, NIK, NPWP, data pribadi/perusahaan, rekening bank (untuk pencairan
  tunai), lalu pembuatan kata sandi (dilewati jika kata sandi sudah ada, mis. daftar via Google).

## Pelanggan & Layanan

- **Customer** — pelanggan Nusanet hasil referral mitra. Disinkronkan dari sistem internal
  **NIS** (job backend `sync-customers`). Punya banyak telepon/email/alamat dan banyak
  **customer service**.
- **Customer Service** (`CustomerRegisteredService`) — satu langganan layanan milik pelanggan:
  kode layanan, tanggal registrasi/aktivasi/mulai/berakhir, status (Aktif, Tidak Aktif, Block,
  Free, …), dan sales penanggung jawab.
- **Service** — produk/layanan Nusanet (kode, nama, tipe, harga, unit User/Bulan/Tahun, kategori,
  fitur). Mitra melihatnya sebagai katalog yang bisa direferensikan.
- **Promotion** — promo layanan berperiode (dikelola admin, tampil di edukasi mitra).

## Poin (Reward)

- **Reward / poin** diberikan per customer-service dengan dua tipe:
  - **OTC** (one-time charge) — sekali di awal;
  - **Bulanan** — berulang tiap bulan (job backend `recurring-points`).
- Poin punya **masa kedaluwarsa** (`expiredDate`, ±1 tahun; job `expire-points` menghanguskan).
  Field penting: `point`, `remainingPoint`, `isExpired`, `price` (nilai rupiah acuan).
- **Point Submission** — pengajuan poin oleh admin di `/point-submission`:
  1. Admin mencari akun dari NIS (`GET /nis/account?q=`) → `custServId`, nama akun, layanan, sales.
  2. Duplikasi dicek via `GET /point-submission/check-account` (akun sudah dipakai user ini/lain?).
  3. Submission dibuat dengan tipe OTC/Bulanan, opsi **recurring** + `recurringEndDate`, catatan.
  4. Status `pending` → di-approve massal (`POST /point-submission/approve`, `ids[]` + `notes`)
     → menjadi reward poin untuk mitra (job `process-submissions`).

## Penukaran Poin (Redemption)

Tiga jenis penukaran (`type`): **cash**, **product**, **voucher** (plus `expired` untuk poin
hangus yang tampil di riwayat). Nomor referensi `redempNo`. Status umum:
`pending → processing → completed` (plus `cancelled`/`expired`). Setiap transisi tercatat di
riwayat status (`GET /redemption/:id/status-histories`).

| Jenis | Sisi mitra | Sisi admin |
|---|---|---|
| **Tunai** (`cash`) | Ajukan jumlah poin (`POST /redemption/cash`); payout dihitung dengan pajak; butuh rekening bank terisi; opsi auto-withdraw di preferensi | Halaman `/redemption/cash`: selesaikan pencairan (`PUT /redemption/cash/list/:id`), bukti transfer (`receipt`) dapat diunduh |
| **Produk** (`product`) | Pilih katalog produk + alamat kirim (`POST /redemption/product`) | Halaman `/redemption/product`: input ekspedisi + resi (`POST .../list/:id` dengan `shipper`, `trackingNumber`), lalu tandai selesai |
| **Voucher** (`voucher`) | Pilih katalog voucher (`POST /redemption/voucher`) | Halaman `/redemption/voucher`: input kode voucher + kedaluwarsa (`POST .../list/:id` dengan `code`, `expiredDate`), lalu tandai selesai |

## Katalog Reward

Dikelola admin di `/catalog/admin/reward`: item bertipe produk/voucher dengan nama, deskripsi,
gambar, **poin** yang dibutuhkan, **stok** (+`stockUsed`), tanggal kedaluwarsa, dan **kategori**
(CRUD kategori terpisah). Mitra menukar dari katalog ini di `/point/redeem`.

## Konten Edukasi

Dikelola admin di `/education/admin/*`, dikonsumsi mitra di `/education*`:

| Konten | Keterangan |
|---|---|
| **Kategori** | Kategori bersama untuk artikel & video |
| **Artikel** | Rich text (editor Quill), gambar sampul, waktu baca, penulis (karyawan), flag `isView` (publish) |
| **Video** | URL video + thumbnail + deskripsi |
| **Template pemasaran** | Materi promosi multi-format: PNG / JPG / PSD / MP4 (unduh per format) |
| **Promosi** | Info promo layanan berperiode |
| Halaman statis mitra | Strategi penawaran (`/education/strategy`), skema poin (`/education/scheme`), katalog layanan (`/education/service`) |

## Feedback

Mitra mengirim feedback bertipe `keluhan` / `saran` / `pujian` beserta URL halaman dan lampiran
gambar (`POST /feedback`). Admin/atau halaman feedback menampilkan entri beserta balasan (`reply`).

## Statistik

| Endpoint | Konsumen | Isi |
|---|---|---|
| `/statistic/admin/summary` | Dashboard admin | Total user, customer, customer-service, poin |
| `/statistic/count` | Dashboard mitra | Jumlah customer/layanan/poin + persentase naik-turun dari bulan lalu |
| `/statistic/point` | Dashboard mitra | Poin per bulan (chart) |
| `/statistic/customer` | Dashboard mitra | Pertumbuhan pelanggan bulanan/tahunan |
| `/statistic/redemption-point` | Dashboard mitra | Komposisi status penukaran |
| `/user/:id/statistic` | Detail user (admin) | Gabungan statistik di atas untuk satu mitra |

## Glosarium

| Istilah | Arti |
|---|---|
| **NIS** | Sistem internal Nusanet — sumber data akun/pelanggan/karyawan (disinkronkan job backend) |
| **OTC** | One-Time Charge — poin sekali bayar |
| **Bulanan** | Poin berulang bulanan |
| **Boarding / onboarding** | Proses melengkapi data mitra baru |
| **Redemption / penukaran** | Penukaran poin menjadi tunai/produk/voucher |
| **L / T / E / H** | Huruf permission RBAC: Lihat, Tambah, Edit, Hapus |
| **`redempNo`** | Nomor referensi penukaran |
| **Payout** | Nominal rupiah yang diterima mitra setelah pajak pada pencairan tunai |
