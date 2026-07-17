# Katalog Komponen & Konvensi Kode

Semua komponen di [app/components/](../app/components/) **auto-imported** (tanpa statement
import). Penamaan mengikuti prefiks fungsi:

- `App*` — kerangka aplikasi (header, sidebar, dsb.)
- `Modal*` — dialog (berbasis DaisyUI `modal`/`dialog`)
- `Data*` — tabel & filter data generik
- Lainnya — util UI (EmptyState, MultiSelect)

## Komponen Kerangka (App*)

| Komponen | Fungsi |
|---|---|
| `AppHeader.vue` | Bar atas: tombol drawer (mobile), pencarian global (membuka command palette), notifikasi, menu profil + logout |
| `AppSidebar.vue` | Sidebar navigasi (DaisyUI drawer): merender `topNav`/`bottomNav` dari `useNavigation()`, filter `permissionKey` via `usePermission()`, highlight item aktif |
| `AppToolbar.vue` | Toolbar judul halaman + slot aksi |
| `AppCommandPalette.vue` | Pencarian ⌘K (vue-command-palette) → `GET /additional/search`, debounce, navigasi ke `route` hasil |
| `AppNotificationPopover.vue` | Popover notifikasi di header |

## Komponen Data

### `DataTable.vue` — tabel server-side generik

Dipakai hampir semua halaman list. Props utama:

```
title, description, flat, loading, isEmpty,
columns: Column[]            // { key, label, ... } — mendukung toggle kolom
totalFrom, totalTo, totalEntries, currentPage, lastPage,   // dari meta paginasi API
currentSort, currentOrder ('asc'|'desc'),
searchQuery, searchPlaceholder, showSearch, showColumnToggle
```

Emits: `update:page`, `update:sort`, `update:order`, `update:searchQuery`.
Pola pemakaian: halaman menyimpan param query di `ref`, memanggil ulang service pada setiap emit,
lalu meneruskan `meta` respons ke props. Sel dirender via named slot per kolom.

### `DataFilter.vue` — dropdown filter

Wadah `<details>` dengan tombol Terapkan/Reset/Batal. Props: `isFilterActive`, `label`, `align`.
Emits: `apply`, `reset`, `cancel`. Konten filter (MultiSelect, rentang tanggal) diisi lewat slot.
`defineExpose({ close })` untuk menutup programatik.

### `MultiSelect.vue`

Dropdown multi-pilih dengan pencarian, `v-model` array, props `options`, `labelKey`, `valueKey`,
`placeholder`, `searchable`. Panel dropdown diposisikan fixed dan otomatis flip ke atas bila ruang
bawah kurang.

### `EmptyState.vue`

Placeholder "tidak ada data" (gambar `public/assets/no-data.png` + teks).

## Komponen Modal

Semua modal mengikuti pola props + emits (bentuk `v-model`/`open` + `close`/`success` sedikit
bervariasi — baca modal terkait sebelum memakai). Daftar per domain:

| Domain | Modal | Fungsi |
|---|---|---|
| Penukaran (mitra) | `ModalRedeemCash` | Form pencairan tunai (jumlah poin, info payout/pajak) |
| | `ModalRedeemProduct` | Penukaran produk (alamat kirim) |
| | `ModalRedeemVoucher` | Penukaran voucher |
| | `ModalConfirmRedeem` | Konfirmasi sebelum menukar |
| | `ModalRedemptionSuccess` | Sukses penukaran |
| | `ModalRedemptionHistory` | Detail/riwayat satu penukaran (+timeline status) |
| | `ModalVoucherDetail` | Detail voucher (kode, kedaluwarsa) |
| Penukaran (admin) | `ModalProcessShipping` | Input ekspedisi + resi produk |
| | `ModalProcessVoucher` | Input kode voucher + kedaluwarsa |
| Katalog (admin) | `ModalCatalogForm` | CRUD item katalog (upload gambar, stok, poin) |
| | `ModalCatalogCategoryForm` | CRUD kategori katalog |
| Edukasi (admin) | `ModalCategoryForm` | CRUD kategori edukasi |
| | `ModalTemplateForm` | CRUD template pemasaran (multi-format file) |
| | `ModalPromotionForm` | CRUD promosi |
| | `ModalTemplateDownload` | Pilih format unduhan template (PNG/JPG/MP4/PSD) |
| User (admin) | `ModalUserApproval` | Approve/reject/revisi registrasi dengan catatan |
| | `ModalApproveConfirm` | Konfirmasi approve (poin submission) |
| Poin (admin) | `ModalPointSubmissionForm` | Form input poin (cari akun NIS, OTC/Bulanan, recurring) |
| RBAC (admin) | `ModalRoleForm` | CRUD role + matriks permission + penugasan karyawan |
| Umum | `ModalConfirmDelete` | Konfirmasi hapus generik |
| | `ModalImagePreview` | Preview gambar fullscreen |
| | `ModalProfilePhoto` | Ganti foto profil |
| | `ModalFeedback` | Kirim feedback (tipe + pesan + lampiran gambar) |
| | `ModalTerms` | Syarat & ketentuan |

## Composables

| File | Ekspor | Fungsi |
|---|---|---|
| `useAuth.ts` | `useAuth()` | `state` (token/user/role/isAdmin/isUser/hasRole) + `service` (authService) |
| `usePermission.ts` | `usePermission()` | `can(module, action)`, `canView/canCreate/canEdit/canDelete` — RBAC admin dari localStorage |
| `useNavigation.ts` | `useNavigation()` | `topNav`, `bottomNav`, `isActive` — sumber tunggal struktur menu |
| `error-helper.ts` | `handleServiceError(error)` | Toast error API (+ gabung pesan validasi 422) lalu `throw` |

## Utils (auto-imported, locale id-ID)

| File | Fungsi utama |
|---|---|
| `date.ts` | `formatDate` (19 Maret 2026), `formatDateShort` (dd/MM/yyyy), `formatDateTime`, `formatDateTimeShort`, `timeAgo` (relative), `toISODate`, `isNew` (≤7 hari), `formatPeriod`, `getExpiredDate` (+1 tahun) |
| `status.ts` | `getStatusClass` (badge status layanan: aktif/inaktif/block/free), `getUserStatusClass` + `getUserStatusLabel` (status mitra: Aktif/Pending/Revisi/Ditolak/Tidak Aktif) |
| `string.ts` | `stripHtml`, `formatNumber` (pemisah ribuan titik), `formatUnit` (Monthly→Bulan), konstanta `TEMPLATE_FORMATS` |
| `initials.ts` | `getInitials(name)` — inisial avatar (maks 2 huruf) |

## Konvensi Penulisan Kode

1. **Bahasa UI: Indonesia.** Semua label, pesan, placeholder, dan toast dalam bahasa Indonesia.
2. **`<script setup lang="ts">`** untuk semua komponen/halaman; state lokal dengan `ref`/`computed`.
3. **Data fetching di halaman**: panggil service langsung dalam fungsi async (umumnya dipicu
   `onMounted` atau langsung di setup), simpan hasil di `ref`, kelola flag `loading` sendiri,
   `try/catch` tanpa toast tambahan (toast sudah di service).
4. **Styling**: DaisyUI class (`card`, `btn btn-primary`, `modal`, `alert`, `badge`, `loading`)
   + Tailwind utility. Warna hanya lewat token tema (`primary`, `base-200`, dst.).
5. **Ikon**: import langsung dari `lucide-vue-next` (satu-satunya import komponen yang eksplisit).
6. **Type-safety**: semua bentuk respons API punya interface di `app/types/*.d.ts`; gunakan dan
   perbarui saat backend berubah.
7. **Modal baru**: buat file `Modal<Nama>.vue`, kontrol dari halaman via prop terbuka + emits,
   ikuti pola modal serupa yang sudah ada di domain yang sama.
8. **Halaman admin baru**: set `definePageMeta({ role: 'admin' })`, tambah entri `navItems`
   dengan `permissionKey`, dan pastikan modul+aksi terdaftar di permission matrix backend.
