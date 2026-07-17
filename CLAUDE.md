# CLAUDE.md

Guidance for AI coding agents (Claude Code, etc.) working on this repository.

## What this project is

**Kawan Nusa** — the referral partner portal of PT. Media Antar Nusa (Nusanet, an Indonesian ISP).
Referral partners ("user" role) refer customers to Nusanet services, earn points per active
customer service, and redeem those points for cash, products, or vouchers. Internal employees
("admin" role) manage partners, input/approve points, process redemptions, and manage content.

This repo is the **frontend only**: a Nuxt 4 single-page app (`ssr: false`) with PWA support.
The backend lives in a sibling repo, **kawan-nusa-be** (Bun + Hono + TypeORM + MySQL, Swagger at
`/api/docs`, default port 4000). The UI language is **Indonesian** — keep all user-facing text in
Indonesian.

Detailed docs: see [docs/](docs/) — architecture, domain model, API/service map, routes, components.

## Commands

```bash
pnpm install       # install deps (pnpm is the package manager — pnpm-lock.yaml)
pnpm dev           # dev server at http://localhost:3000 (backend must run at API_BASE_URL)
pnpm build         # production build to .output/
pnpm generate      # static generation
pnpm preview       # preview production build
```

There are **no tests and no linter** configured. Verify changes by running the dev server.
Type checking relies on Nuxt-generated tsconfigs (`.nuxt/tsconfig.*`); `npx nuxi typecheck` works
if needed.

Required `.env` (gitignored):

```
API_BASE_URL=http://localhost:4000/api   # backend base URL, exposed as runtimeConfig.public.apiUrl
GOOGLE_CLIENT_ID=...                     # Google OAuth client id (nuxt-vue3-google-signin)
```

## Tech stack

- **Nuxt 4** (Vue 3.5, TypeScript, `ssr: false` — pure SPA), `compatibilityDate: 2025-07-15`
- **Tailwind CSS v4** (via `@tailwindcss/vite`) + **DaisyUI v5** — theme defined in
  [app/assets/css/main.css](app/assets/css/main.css) (`@theme` block; primary `#629e43`, font Montserrat)
- **axios** for HTTP (NOT `$fetch`/`useFetch`) via a service-class layer
- **lucide-vue-next** for icons, `@nuxt/icon` also available
- **nuxt-notify** → `useToast()` for toasts; **nuxt-charts** for dashboard charts
- **@vite-pwa/nuxt** — PWA manifest + workbox (enabled in dev too)
- **nuxt-vue3-google-signin** — Google OAuth login (user & admin)
- **@vueup/vue-quill** — rich-text editor (education articles)
- **vue-command-palette** — Cmd/Ctrl+K global search (`AppCommandPalette.vue`)
- **zod** — form validation on some pages

## Architecture (short version)

```
app/
├── app.vue                 # root: NuxtLayout + NuxtPage, SEO meta
├── layouts/                # default (header+sidebar), auth (carousel split), onboarding (boarding)
├── middleware/
│   ├── auth.global.ts      # THE gatekeeper: token check + user-status state machine + role meta
│   └── guest.ts            # redirects logged-in users away from auth pages
├── pages/                  # file-based routes (see docs/routes.md for the full map)
├── components/             # auto-imported; App* = shell, Modal* = dialogs, Data* = table/filter
├── composables/            # useAuth, usePermission, useNavigation, error-helper (handleServiceError)
├── services/               # class-per-domain API layer, singleton exports (api-service is the axios core)
├── types/                  # *.d.ts interfaces mirroring backend API responses
└── utils/                  # date/status/string/initials helpers (auto-imported, id-ID locale)
```

Key flow: **page → service singleton → apiService.client (axios) → backend `/api/...`**.
There is no Pinia/Vuex — reactive state lives in service classes (`authService.user`,
`authService.token` are module-level `ref`s).

### Auth (read [docs/architecture.md](docs/architecture.md) before touching)

- `authService` (singleton) restores session from localStorage synchronously at construction,
  then validates via `GET /auth/me` in the background.
- localStorage keys: `accessToken`, `refreshToken`, `user`, `auth_permissions`, `auth_employee_role`.
- `apiService.client` is a **getter that builds a fresh axios instance each access**; its response
  interceptor handles 401 → refresh-token retry (once) → logout, and 403 → redirect `/`.
- Every service method attaches `Authorization: Bearer ${useAuth().state.token}` **manually** —
  there is no request interceptor for auth. Follow this pattern when adding endpoints.
- Login methods: identifier+password, Google (user), Google (admin, separate endpoint), OTP,
  plus register / verify-email / forgot-reset password flows.

### Route guarding — `auth.global.ts`

Two roles: `user` (partner) and `admin` (employee). Pages opt into admin-only via
`definePageMeta({ role: 'admin' })`. Non-admin users are additionally routed by a **status state
machine** (`user.status`): unverified/`pending`/`reject`/`inactive` → locked to `/boarding/success`;
`null`+not boarded or `revision` → locked to `/boarding`; `active` → full access, boarding blocked.
If you add a public page, add its path to the `publicPaths` list in the middleware.

### Admin RBAC — `usePermission()`

Admin fine-grained permissions are a `Record<module, letters[]>` stored in localStorage
(`auth_permissions`), letters are Indonesian: **L**ihat (view), **T**ambah (create), **E**dit,
**H**apus (delete). Use `canView('module')`, `canCreate(...)`, `canEdit(...)`, `canDelete(...)`.
Sidebar items are additionally filtered by `permissionKey` in
[useNavigation.ts](app/composables/useNavigation.ts). The permission matrix and role CRUD come from
the backend (`/role/*`), managed on `/role-permission`.

## Conventions & gotchas

- **Auto-imports everywhere**: components, composables, and utils are used without import
  statements. Only third-party symbols and `~/services/*` / type-only imports are explicit.
- **Service layer pattern**: class + singleton export (`export const xxxService = new XxxService()`),
  every method wraps in try/catch and calls `handleServiceError(error)` which shows a toast and
  `throw`s an empty `Error`. Callers rely on the throw for their own loading/error state; do not
  swallow it.
- **Error toasts** are handled inside services — pages should not double-toast API errors.
- **Pagination**: list endpoints return `{ data, meta: { total, perPage, currentPage, lastPage, from, to } }`;
  pages wire this into the shared `DataTable.vue` (server-side sort/search/pagination via emits).
- **User redemption pages** live under `/point/redeem` (folder `app/pages/point/redeem/`); the
  admin-side redemption processing lives under `/redemption/*`. Don't confuse the two.
- **File uploads** use `FormData` with explicit `Content-Type: multipart/form-data` (catalog,
  articles, videos, templates, promotions, profile photo/documents, register).
- **Page meta options** used by layouts/middleware: `layout`, `middleware`, `role: 'admin'`,
  `bgColor` (content background class, default `bg-[#F7FDF9]`), `layoutTitle` (onboarding layout).
- **Styling**: DaisyUI component classes (`card`, `btn`, `drawer`, `modal`, `alert`, `loading`) +
  Tailwind utilities. Brand colors only through the CSS variables in main.css — never hardcode new
  greens. Status badge classes come from [app/utils/status.ts](app/utils/status.ts).
- **Dates/numbers** are formatted with the `id-ID` locale helpers in [app/utils/date.ts](app/utils/date.ts)
  and [app/utils/string.ts](app/utils/string.ts) (`formatNumber` = dot thousand separator).
- **Modals** are DaisyUI-based `Modal*.vue` components controlled via props/emits
  (`v-model`-style or `open` prop + `close` emit patterns vary per modal — read the modal first).
- **Types**: every API shape has an interface in [app/types/](app/types/). Add/extend types there
  when the backend adds fields; `ApiResponse<T>` in `auth.d.ts` is the base envelope
  (`{ success, statusCode, message, data }`).
- The `routeRules` proxy (`/api/**` → `API_BASE_URL`) exists in nuxt.config.ts, but services call
  the backend **directly** via `config.public.apiUrl`; in production set `API_BASE_URL` accordingly.

## What to check before claiming done

1. `pnpm dev` compiles without errors and the affected page renders.
2. Both roles considered: does the change affect admin pages, user pages, or both?
3. Permission gating: new admin features need `permissionKey` in navigation and `usePermission`
   checks consistent with the backend permission matrix.
4. Indonesian UI text, id-ID date/number formatting.
5. Update [docs/](docs/) if you changed architecture, routes, services, or domain flows.
