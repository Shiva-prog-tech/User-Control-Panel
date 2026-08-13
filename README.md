# Swipeo Banking — Enterprise Banking Platform

Next.js 16 (App Router) + React 19 + TypeScript (strict) scaffold for the Swipeo
banking dashboard.

## Stack

- **Framework:** Next.js 16 App Router, React 19
- **State:** Redux Toolkit + react-redux + redux-persist (auth slice only) + redux-logger
- **Styling:** SCSS Modules (`sass`) + Tailwind v4 (`@tailwindcss/postcss`)
- **HTTP:** axios (shared instance in `utils/axios.ts`, baseURL from env)

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

Environment variables live in `.env.local` (see `.env.example`). All services
fall back to typed mock data while `NEXT_PUBLIC_API_BASE_URL` points at a
non-existent API, so the whole UI renders out of the box.

## Architecture

```
app/            Thin route wrappers only — each page.tsx renders one module
modules/        Feature modules: index.tsx ("use client") + <Feature>.module.scss
                ├── components/  Feature-private sub-components (folder each)
                └── types.ts     The module's own models and enums
Components/     Cross-feature reusable UI (shell, popups, buttons, tables…)
redux/          store.ts, provider.tsx, hooks/, reducers/ (auth persisted)
services/       All HTTP calls — typed request/response, axios instance
customHooks/    useSessionTimer, useOutsideClick, useDebounce
utils/          Config.ts (env-driven), axios.ts, ImageRelativePaths.ts, helper.ts
types/          global.ts (ApiResponse, User, SpendingTrendPoint),
                constants.ts (ROUTES, POPUPS) — only what no module owns
libs/           navigation.ts (sidebar registry)
styles/         globals.css, mixins.scss, media.scss
public/assets/  <module>/ per owning module + common/ for shell and shared
                glyphs — referenced ONLY via utils/ImageRelativePaths.ts
```

### Layering rules

1. Routes are thin: `app/<route>/page.tsx` imports exactly one module.
2. Feature UI lives in `modules/<Feature>/`; anything reused across features
   moves to `Components/`.
3. Every HTTP call goes through `services/*.service.ts` → `utils/axios.ts` →
   endpoints from `utils/Config.ts`. Components never call axios directly.
4. Modals are driven by the `PopUps` slice: `showPopUp(name)` / `hidePopUp(name)`
   with names from `types/constants.ts` → rendered by `Components/PopUpHandler`.
5. Image paths are named consts in `utils/ImageRelativePaths.ts` — never
   hardcoded strings in components. Each icon is filed under the module that
   owns it (`public/assets/accounts/wallet.svg`); shell chrome and glyphs used
   by several modules live in `public/assets/common/`.
6. A domain model belongs to the module named for it —
   `modules/Accounts/types.ts` owns `Account` and `AccountType`. Other modules
   and `services/` import from there. `types/` keeps only what no single module
   owns: the API envelope, `User`, routes and popup names.

### Provider nesting (app/layout.tsx)

```
AppProvider → ReduxProvider → AuthWrapper → LayoutWrapper → {children} → PopUpHandler
```

## Routes

| Route            | Module                  |
| ---------------- | ----------------------- |
| `/login`         | `modules/Login`         |
| `/signup`        | `modules/Signup`        |
| `/forgot-password` | `modules/ForgotPassword` |
| `/dashboard`     | `modules/Dashboard`     |
| `/accounts`      | `modules/Accounts`      |
| `/cards`         | `modules/Cards`         |
| `/transfers`     | `modules/Transfers`     |
| `/transactions`  | `modules/Transactions`  |
| `/analytics`     | `modules/Analytics`     |
| `/verification`  | `modules/Verification`  |
| `/notifications` | `modules/Notifications` |
| `/settings`      | `modules/Settings`      |
| `/help`          | `modules/Help`          |

Demo login: any email/password signs in with the mock user (Ankiit Nallwa)
while the API is mocked.
