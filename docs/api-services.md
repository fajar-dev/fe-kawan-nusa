# Service Layer & Pemetaan Endpoint API

Semua komunikasi HTTP berada di [app/services/](../app/services/). Setiap service adalah class
dengan export singleton (`export const xxxService = new XxxService()`), memakai
`apiService.client` (axios), melampirkan header `Authorization: Bearer <token>` per request, dan
mengalirkan error ke `handleServiceError()` (toast + throw). Tipe respons ada di
[app/types/](../app/types/).

Bentuk respons standar: `ApiResponse<T> = { success, statusCode, message, data }`.
Endpoint list menambahkan `meta: { total, perPage, currentPage, lastPage, from, to }`.
Parameter list yang umum: `q`, `sort`, `order`, `page`, `limit`, `startDate`, `endDate`.

## api-service.ts — inti axios

- `client` (getter): instance axios baru, `baseURL = runtimeConfig.public.apiUrl`.
- Interceptor: 403 → redirect `/`; 401 → refresh token sekali lalu retry, gagal → bersihkan
  localStorage + redirect `/auth/sign-in`.
- `setRefreshHandler(fn)` — dipanggil `AuthService` saat konstruksi.

## auth-service.ts (`/auth/*`) — tipe: `auth.d.ts`

| Method | Endpoint | Keterangan |
|---|---|---|
| `login(identifier, password)` | `POST /auth/login` | identifier = email/telepon; simpan sesi |
| `google(code)` | `POST /auth/google` | Login Google mitra |
| `adminGoogle(code)` | `POST /auth/admin/google` | Login Google admin |
| `sendOtp(identifier)` / `verifyOtp(identifier, code)` | `POST /auth/otp/send` / `POST /auth/otp/verify` | Login OTP |
| `register(data)` | `POST /auth/register` | JSON atau FormData |
| `verifyEmail(token)` | `GET /auth/verify-email?token=` | Verifikasi saja — **tidak** membuat sesi; halaman lalu redirect ke `/auth/sign-in` |
| `resendVerification(email)` | `POST /auth/resend-verification` | |
| `checkEmailStatus(email)` | `GET /auth/check-email-status?email=` | Cek kondisi email saat register/login |
| `forgotPassword(email)` | `POST /auth/forgot-password` | |
| `validateResetPassword(token)` | `GET /auth/validate-reset-token?token=` | |
| `resetPassword(token, newPassword)` | `POST /auth/reset-password` | |
| `refreshToken()` | `POST /auth/refresh` | Dipakai interceptor 401 |
| `validateSession()` / `refreshUser()` | `GET /auth/me` | Segarkan user + permission |
| `logout()` | `POST /auth/logout` | Bersihkan localStorage + redirect |

## profile-service.ts (`/profile/*`) — tipe: `profile.d.ts` — role: user

| Method | Endpoint |
|---|---|
| `getProfile()` | `GET /profile` |
| `updateAccount(data)` | `PUT /profile/account` |
| `updateBank({ accountHolderName, bankName, accountNumber })` | `PUT /profile/bank` |
| `updatePassword({ oldPassword?, newPassword })` | `PUT /profile/password` |
| `updatePreference({ isSubscribe?, isAutoWithdraw? })` | `PUT /profile/preference` |
| `updatePhoto(file)` | `POST /profile/photo` (FormData) |
| `updateDocuments(identityFile?, accountFile?)` | `POST /profile/documents` (FormData; KTP/rekening saat boarding) |
| `completeBoarding()` | `POST /profile/complete-boarding` |

## customer-service.ts (`/customer/*`) — tipe: `customer.d.ts` — role: user

| Method | Endpoint |
|---|---|
| `getCustomers(params)` | `GET /customer` (filter: `type[]`, `serviceCode[]`, `status[]`, `isActive`, rentang tanggal registrasi/aktivasi) |
| `getCustomerById(id)` | `GET /customer/:id` |
| `getCustomerServices(id, params)` | `GET /customer/:id/service` |
| `getCustomerRewards(id, params)` | `GET /customer/:id/point` |

## service-service.ts (`/service/*`) — tipe: `service.d.ts`

| Method | Endpoint | Keterangan |
|---|---|---|
| `getServices(params)` | `GET /service` | Katalog layanan Nusanet |
| `getServiceByCode(code)` | `GET /service/:code` | |
| `getServiceCustomers(code, params)` | `GET /service/:code/customer` | Pelanggan per layanan |
| `getCustomerServices(params)` | `GET /customer-service` | Semua layanan pelanggan milik mitra |
| `getPromotions(params)` | `GET /service/promotion` | |
| `getPromotionDetail(id)` | `GET /service/promotion/:id` | |
| `createPromotion(FormData)` / `updatePromotion(id, FormData)` / `deletePromotion(id)` | `POST/PUT/DELETE /service/promotion[/:id]` | Admin |

## point-service.ts & reward-service.ts — tipe: `point.d.ts`, `reward.d.ts` — role: user

| Method | Endpoint | Keterangan |
|---|---|---|
| `pointService.getPoint()` | `GET /point` | Saldo poin saat ini |
| `rewardService.getRewards(params)` | `GET /point/reward` | Riwayat perolehan poin (filter `type[]`) |

## point-submission-service.ts (`/point-submission`, `/nis`) — tipe: `point-submission.d.ts` — role: admin

| Method | Endpoint | Keterangan |
|---|---|---|
| `getSubmissions(params)` | `GET /point-submission` | |
| `createSubmission(data)` / `updateSubmission(id, data)` / `deleteSubmission(id)` | `POST/PUT/DELETE /point-submission[/:id]` | Tipe OTC/Bulanan, recurring |
| `approveSubmissions(ids, notes?)` | `POST /point-submission/approve` | Approve massal |
| `searchNisAccounts(q)` | `GET /nis/account?q=` | Cari akun dari sistem NIS |
| `checkAccount(custServId, userId, excludeId?)` | `GET /point-submission/check-account` | Deteksi duplikasi akun |

## redemption-service.ts (`/redemption/*`) — tipe: `redemption.d.ts`

Sisi mitra:

| Method | Endpoint |
|---|---|
| `getRedemptions(params)` | `GET /redemption` (riwayat milik sendiri; filter `type[]`, `status[]`) |
| `redeemCash({ pointsUsed })` | `POST /redemption/cash` |
| `redeemProduct({ catalogId, address })` | `POST /redemption/product` |
| `redeemVoucher({ catalogId })` | `POST /redemption/voucher` |
| `downloadReceipt(url)` | Unduh bukti transfer (client-side) |

Sisi admin (pemrosesan):

| Method | Endpoint | Keterangan |
|---|---|---|
| `getCashRedemptions(params)` | `GET /redemption/cash/list` | |
| `completeCash(id)` | `PUT /redemption/cash/list/:id` | Tandai pencairan selesai |
| `getProductRedemptions(params)` | `GET /redemption/product/list` | |
| `processProduct(id, { shipper, trackingNumber })` | `POST /redemption/product/list/:id` | Input pengiriman |
| `completeProduct(id)` | `PUT /redemption/product/list/:id` | |
| `getVoucherRedemptions(params)` | `GET /redemption/voucher/list` | |
| `processVoucher(id, { code, expiredDate? })` | `POST /redemption/voucher/list/:id` | Input kode voucher |
| `completeVoucher(id)` | `PUT /redemption/voucher/list/:id` | |
| `getStatusHistories(id)` | `GET /redemption/:id/status-histories` | Timeline status |

## catalog-service.ts (`/catalog/*`) — tipe: `catalog.d.ts` — role: admin (list juga dipakai mitra)

| Method | Endpoint |
|---|---|
| `getCatalogs(params)` / `getCatalogById(id)` | `GET /catalog[/:id]` |
| `createCatalog(FormData)` / `updateCatalog(id, FormData)` / `deleteCatalog(id)` | `POST/PUT/DELETE /catalog[/:id]` |
| `uploadCatalogImage(file)` | `POST /catalog/upload` |
| `getCategories()` | `GET /catalog/category` |
| `createCategory(name)` / `updateCategory(id, name)` / `deleteCategory(id)` | `POST/PUT/DELETE /catalog/category[/:id]` |

## education-service.ts (`/education/*`) — tipe: `education.d.ts`

| Method | Endpoint | Keterangan |
|---|---|---|
| `getArticles(params)` / `getArticleById(id)` | `GET /education/article[/:id]` | Param `isView` untuk filter publish |
| `getVideos(params)` / `getVideoById(id)` | `GET /education/video[/:id]` | |
| `getCategories()` | `GET /education/category` | |
| `createCategory/updateCategory/deleteCategory` | `POST/PUT/DELETE /education/category[/:id]` | Admin |
| `createArticle/updateArticle/deleteArticle` | `POST/PUT/DELETE /education/article[/:id]` (FormData) | Admin |
| `uploadArticleImage(file)` | `POST /education/article/upload` | Gambar inline editor Quill |
| `createVideo/updateVideo/deleteVideo` | `POST/PUT/DELETE /education/video[/:id]` (FormData) | Admin |

## template-service.ts (`/template/*`) — tipe: `template.d.ts`

| Method | Endpoint |
|---|---|
| `getTemplates(params)` / `getTemplateDetail(id)` | `GET /template[/:id]` |
| `createTemplate(FormData)` / `updateTemplate(id, FormData)` / `deleteTemplate(id)` | `POST/PUT/DELETE /template[/:id]` |

## user-service.ts (`/user/*`) — tipe: `user.d.ts` — role: admin

| Method | Endpoint | Keterangan |
|---|---|---|
| `getUsers(params)` | `GET /user` | Filter `status` (dipakai list & approval) |
| `getUserById(id)` | `GET /user/:id` | |
| `getUserServices(id, params)` | `GET /user/:id/services` | |
| `getUserRewards(id, params)` | `GET /user/:id/point` | |
| `getUserRedemptions(id, params)` | `GET /user/:id/redeem` | |
| `getUserStatistic(id)` | `GET /user/:id/statistic` | |
| `updateUserStatus(id, { status, note })` | `PATCH /user/:id/status` | Approve/reject/revisi/aktif-nonaktif |
| `getUserStatusHistories(id)` | `GET /user/:id/status-histories` | Timeline status |

## role-service.ts (`/role/*`) — tipe: `role.d.ts` — role: admin

| Method | Endpoint | Keterangan |
|---|---|---|
| `getRoles(params)` / `getRoleById(id)` | `GET /role[/:id]` | |
| `createRole(data)` / `updateRole(id, data)` / `deleteRole(id)` | `POST/PUT/DELETE /role[/:id]` | `{ name, description?, color?, permissions?, employeeIds? }` |
| `getPermissionMatrix()` | `GET /role/permission-matrix` | Master modul + aksi (L/T/E/H) |
| `getEmployees()` | `GET /role/employees` | Karyawan untuk ditugaskan ke role |

## statistic-service.ts (`/statistic/*`) — tipe: `statistic.d.ts`

| Method | Endpoint | Konsumen |
|---|---|---|
| `getAdminSummary()` | `GET /statistic/admin/summary` | Dashboard admin |
| `getCount()` | `GET /statistic/count` | Dashboard mitra |
| `getPointStatistic()` | `GET /statistic/point` | Dashboard mitra |
| `getCustomerStatistic('monthly'|'yearly')` | `GET /statistic/customer` | Dashboard mitra |
| `getRedemptionRewardStatistic()` | `GET /statistic/redemption-point` | Dashboard mitra |

## feedback-service.ts (`/feedback`) — tipe: `feedback.d.ts`

| Method | Endpoint | Keterangan |
|---|---|---|
| `createFeedback({ url, type, message, images })` | `POST /feedback` (FormData) | type: `keluhan`/`saran`/`pujian` |
| `getFeedback(params)` | `GET /feedback` | |

## additional-service.ts (`/additional/*`) — tipe: `additional.d.ts`

Master data & util lintas modul:

| Method | Endpoint | Keterangan |
|---|---|---|
| `getServices()` | `GET /additional/service` | Opsi layanan (filter) |
| `getCustomerTypes()` | `GET /additional/customer-type` | Opsi tipe pelanggan |
| `getCustomerServiceStatuses()` | `GET /additional/customer-service-status` | Opsi status layanan |
| `getRewardPointTypes()` | `GET /additional/point-type` | Opsi tipe poin |
| `getServiceCategories()` | `GET /additional/service-category` | Opsi kategori layanan |
| `search(q)` | `GET /additional/search` | Pencarian global (command palette) → `{ title, module, route }` |

## Menambah Endpoint Baru — Checklist

1. Tambahkan/level-up interface di `app/types/<domain>.d.ts` (ikuti `ApiResponse<T>` + `meta`).
2. Tambahkan method di service terkait dengan pola try/catch + `handleServiceError`.
3. Lampirkan `Authorization: Bearer ${useAuth().state.token}` di headers.
4. Upload file → `FormData` + `Content-Type: multipart/form-data`.
5. Panggil dari halaman dengan `try/catch` untuk state loading — tanpa toast tambahan.
