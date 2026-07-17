# Arsitektur Aplikasi

Dokumen ini menjelaskan arsitektur frontend Kawan Nusa secara menyeluruh: bagaimana aplikasi
di-bootstrap, bagaimana autentikasi & otorisasi bekerja, bagaimana data mengalir dari halaman ke
backend, dan konfigurasi PWA.

## Gambaran Besar

```
┌──────────────────────────────────────────────────────────┐
│  Browser (SPA, ssr: false)                               │
│                                                          │
│  pages/*.vue ──► services/*-service.ts ──► api-service   │
│      │                    │                (axios)       │
│      │                    ▼                    │         │
│      │           handleServiceError            │         │
│      │           (toast + throw)               ▼         │
│      │                              GET/POST {apiUrl}/...│
│  middleware/auth.global.ts                     │         │
│  (guard setiap navigasi)                       │         │
└────────────────────────────────────────────────┼─────────┘
                                                 ▼
                              kawan-nusa-be (Hono/Bun, port 4000)
                              MySQL + MinIO + integrasi NIS
```

- **Tidak ada SSR** (`ssr: false` di `nuxt.config.ts`) — seluruh aplikasi berjalan di browser.
  Kode boleh mengakses `window`/`localStorage`, tetapi service tetap menjaga guard
  `typeof window === 'undefined'` karena constructor service dapat tereksekusi saat build.
- **Tidak ada state-management library** (Pinia/Vuex). State reaktif global disimpan sebagai
  `ref()` level-modul di dalam class service (contoh: `authService.user`, `authService.token`).
  Karena service diekspor sebagai singleton, semua komponen berbagi state yang sama.
- **Semua komponen/composable/util auto-import** (perilaku default Nuxt). Import eksplisit hanya
  untuk pihak ketiga, `~/services/*`, dan type.

## Bootstrap Aplikasi

1. [app/app.vue](../app/app.vue) — root component. Mengatur `useHead`/`useSeoMeta` global
   (judul "Kawan Nusa", bahasa `id`, manifest PWA) lalu merender `NuxtLayout > NuxtPage`.
2. Saat modul `auth-service.ts` pertama kali di-load, constructor `AuthService` langsung:
   - `restoreSession()` — sinkron, membaca `accessToken` + `user` dari localStorage sehingga UI
     langsung tahu siapa yang login tanpa menunggu jaringan;
   - `validateSession()` — asinkron, memanggil `GET /auth/me` untuk menyegarkan data user dan
     permission admin di background;
   - mendaftarkan `refreshToken` sebagai refresh-handler ke `apiService`.
3. Setiap navigasi melewati [middleware/auth.global.ts](../app/middleware/auth.global.ts)
   (lihat bagian *Route Guard* di bawah).

## Layer HTTP — `api-service.ts`

[app/services/api-service.ts](../app/services/api-service.ts) adalah inti komunikasi HTTP:

- `apiService.client` adalah **getter** yang membuat instance axios **baru setiap kali diakses**
  dengan `baseURL = runtimeConfig.public.apiUrl` (nilai `API_BASE_URL` dari `.env`).
- Interceptor response menangani dua kasus:
  - **403** → `navigateTo('/')` (tidak berwenang membuka resource).
  - **401** → sekali retry: panggil refresh-handler (`authService.refreshToken()` →
    `POST /auth/refresh` dengan `refreshToken` dari localStorage). Jika berhasil, request asli
    diulang dengan token baru; jika gagal, localStorage dibersihkan dan user diarahkan ke
    `/auth/sign-in`.
- **Tidak ada request interceptor untuk Authorization.** Setiap method service melampirkan header
  sendiri: `Authorization: Bearer ${useAuth().state.token}`. Ikuti pola ini saat menambah endpoint.

Catatan: `nuxt.config.ts` juga mendefinisikan `routeRules` proxy `/api/** → API_BASE_URL/**`,
tetapi service **tidak** memakai proxy itu — mereka memanggil backend langsung via `apiUrl`.
Proxy berguna jika `API_BASE_URL` di-set ke origin yang sama (mis. deployment satu domain).

## Pola Service Layer

Setiap domain memiliki satu file di [app/services/](../app/services/) dengan pola seragam:

```ts
export class XxxService {
  async getThings(params?: XxxQueryParams): Promise<XxxResponse> {
    try {
      const response = await apiService.client.get<XxxResponse>('/xxx', {
        params,
        headers: { Authorization: `Bearer ${useAuth().state.token}` },
      })
      return response.data
    } catch (error: any) {
      return handleServiceError(error)   // toast + throw
    }
  }
}
export const xxxService = new XxxService()
```

- [composables/error-helper.ts](../app/composables/error-helper.ts) → `handleServiceError`:
  menampilkan toast (`useToast().error`) dengan pesan dari backend — khusus **422** menggabungkan
  `errors[].message` — lalu `throw new Error()` kosong. Halaman pemanggil cukup `try/catch` untuk
  mengatur state loading; **jangan menampilkan toast kedua** untuk error API.
- Upload file memakai `FormData` + header `Content-Type: multipart/form-data`.
- Bentuk respons standar backend: `ApiResponse<T> = { success, statusCode, message, data }`;
  endpoint list menambahkan `meta` paginasi `{ total, perPage, currentPage, lastPage, from, to }`.

Daftar lengkap service ↔ endpoint ada di [api-services.md](api-services.md).

## Autentikasi

### Penyimpanan sesi (localStorage)

| Key | Isi |
|---|---|
| `accessToken` | JWT access token |
| `refreshToken` | JWT refresh token (dipakai `POST /auth/refresh`) |
| `user` | JSON `AuthUser` (id, name, role, status, isVerified, isBoarding, …) |
| `auth_permissions` | JSON `Record<module, letter[]>` — hanya admin |
| `auth_employee_role` | JSON role karyawan `{ id, name, color }` — hanya admin |

### Cara login

| Metode | Endpoint | Halaman |
|---|---|---|
| Email/telepon + kata sandi | `POST /auth/login` (`identifier`, `password`) | `/auth/sign-in` |
| Google (mitra) | `POST /auth/google` (`code`) | `/auth/sign-in` |
| Google (admin/karyawan) | `POST /auth/admin/google` (`code`) | `/auth/admin` |
| OTP | `POST /auth/otp/send` → `POST /auth/otp/verify` | `/auth/otp` |

Alur pendukung: registrasi (`POST /auth/register`, mendukung FormData), verifikasi email
(`GET /auth/verify-email?token=`), kirim-ulang verifikasi, lupa/reset kata sandi
(`POST /auth/forgot-password`, `GET /auth/validate-reset-token`, `POST /auth/reset-password`),
cek status email (`GET /auth/check-email-status`).

`setSession()` menyimpan token+user+permission ke localStorage dan mengisi `ref` reaktif.
`logout()` memanggil `POST /auth/logout`, membersihkan seluruh key, lalu redirect ke sign-in.

### Composable `useAuth()`

[app/composables/useAuth.ts](../app/composables/useAuth.ts) — pembungkus tipis di atas
`authService`: `state.token`, `state.user`, `state.role`, `state.isUser`, `state.isAdmin`,
`state.hasRole(role)`, dan `service` (akses langsung ke `authService`).

## Route Guard — `auth.global.ts`

Middleware global ini adalah **satu-satunya gerbang otorisasi navigasi**. Urutan logikanya:

1. **Halaman publik** dilewatkan: `/auth/sign-in`, `/auth/forgot-password`, `/auth/reset-password`,
   `/auth/admin`, `/auth/verify-email`, semua `/auth/register*`, semua `/auth/otp*`.
2. Tanpa token → redirect `/auth/sign-in`.
3. **Admin**: tidak punya alur boarding (akses `/boarding*` dialihkan ke `/`); hanya dicek
   `definePageMeta({ role })`.
4. **User (mitra)** — mesin status berdasarkan `user.status` + `isVerified` + `isBoarding`:

| Kondisi | Halaman yang diizinkan |
|---|---|
| `!isVerified` | hanya `/boarding/success` (tampilan "cek email") |
| `status === 'pending'` | hanya `/boarding/success` (menunggu persetujuan) |
| `status === 'reject'` | hanya `/boarding/success` (ditolak) |
| `status === 'inactive'` | hanya `/boarding/success` (dinonaktifkan) |
| `status === null` dan `!isBoarding` | hanya `/boarding*` (wajib lengkapi data) |
| `status === 'revision'` | hanya `/boarding*` (perbaiki data sesuai catatan) |
| `status === 'active'` | seluruh aplikasi; `/boarding*` diblokir |

5. Terakhir, `to.meta.role` dicek terhadap role user; tidak cocok → redirect `/`.

Middleware kedua, [guest.ts](../app/middleware/guest.ts) (non-global), dipasang di halaman auth
untuk melempar user yang sudah login kembali ke `/`.

Halaman `/boarding/success` bersifat multi-fungsi: menampilkan status yang sesuai
(cek email / menunggu approval / ditolak / nonaktif) berdasarkan state user.

## Otorisasi Granular Admin (RBAC)

- Backend mengirim `permissions: Record<string, string[]>` pada objek user admin. Huruf aksi:
  **L** = Lihat (view), **T** = Tambah (create), **E** = Edit, **H** = Hapus (delete).
- [composables/usePermission.ts](../app/composables/usePermission.ts) membaca
  `auth_permissions` dari localStorage dan mengekspos `can(module, action)`, `canView`,
  `canCreate`, `canEdit`, `canDelete`. Untuk non-admin semuanya `false`.
- [composables/useNavigation.ts](../app/composables/useNavigation.ts) mendefinisikan seluruh menu
  sidebar (`navItems`) dengan `role` dan `permissionKey`; sidebar hanya menampilkan menu yang
  role-nya cocok. Contoh `permissionKey`: `dashboard`, `user`, `user.approval`,
  `point-submission`, `redemption.cash|product|voucher`, `catalog`, `education`, `role`.
- Master data permission (modul + aksi yang tersedia) diambil dari
  `GET /role/permission-matrix`; CRUD role + penugasan karyawan dikelola di halaman
  `/role-permission` melalui `role-service.ts`.

## Layout

| Layout | Dipakai oleh | Ciri |
|---|---|---|
| `default` | Seluruh halaman aplikasi | `AppHeader` di atas + `AppSidebar` (DaisyUI drawer, terbuka permanen di ≥lg). Background konten diatur `definePageMeta({ bgColor })`, default `bg-[#F7FDF9]`. |
| `auth` | Halaman `/auth/*` | Split screen: panel kiri carousel hero (2 slide, ganti tiap 3 detik), panel kanan form (max 450px). |
| `onboarding` | Halaman `/boarding*` | Kartu header berlogo "kawan nusa" + judul dari `definePageMeta({ layoutTitle })` (default "Pendaftaran Referral Baru"). |

## Theming & Styling

- Satu file CSS global: [app/assets/css/main.css](../app/assets/css/main.css).
- Tailwind v4 `@theme` mendefinisikan token: `--color-primary: #629e43` (hijau Nusanet),
  `--color-neutral: #14293b`, `--font-sans: Montserrat` (dimuat dari Google Fonts), dst.
- DaisyUI v5 dimuat via `@plugin "daisyui"`; blok `@layer base` meng-override variabel DaisyUI
  dengan `!important` agar tema brand menang atas tema default.
- Gunakan util warna semantik (`text-primary`, `bg-base-200`, `alert-info`, …) — jangan
  menambahkan warna hijau hardcode baru.

## PWA

Dikonfigurasi via `@vite-pwa/nuxt` di [nuxt.config.ts](../nuxt.config.ts):

- Manifest: nama "Kawan Nusa", `display: standalone`, `theme_color: #629E43`, ikon
  64–512px di `public/icons/`.
- Workbox: `navigateFallback: '/'` dengan denylist `/api` (request API tidak boleh jatuh ke shell),
  precache `js/css/html/png/svg/ico`, `cleanupOutdatedCaches`.
- `registerType: autoUpdate` + `periodicSyncForUpdates: 3600` (cek update tiap jam) +
  `installPrompt`. PWA aktif juga di mode dev (`devOptions.enabled`).

## Pencarian Global (Command Palette)

`AppCommandPalette.vue` (dibuka dari header / ⌘K) memakai `vue-command-palette` dan memanggil
`GET /additional/search?q=` yang mengembalikan `{ title, module, route }` untuk lompat cepat ke
entitas mana pun (pelanggan, user, layanan, dsb.).

## Hal yang Perlu Diwaspadai

- `apiService.client` membuat instance axios baru per akses — interceptor tidak menyimpan state
  antar-instance kecuali `originalRequest._retry` pada objek config.
- `usePermission` membaca localStorage di dalam `computed` **tanpa dependensi reaktif** — nilai
  permission baru terbaca setelah komponen di-mount ulang / navigasi, bukan real-time.
- Sesi divalidasi ulang hanya saat halaman di-reload penuh (constructor service). Perubahan status
  user oleh admin baru terlihat setelah refresh atau pemanggilan `authService.refreshUser()`.
- Untuk peta lengkap route lihat [routes.md](routes.md).
