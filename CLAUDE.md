# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

MotoSklejka is a web app for motorcyclists to find other riders for joint trips ("sklejka" = riding together). UI copy is in Polish. Current state: login/registration and the trip map are done; **teams (`app/teams`) is a deliberate placeholder**, not an unfinished bug.

`PROJECT.md` (Polish, written by the repo owner for themselves) holds the same overview plus notes on open TODOs — worth reading, but this file is the source of truth for conventions. `README.md` is a recruiter-facing project showcase, written in English.

## Commands

- `npm run dev` — start dev server (Next.js)
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)
- `npm test` — Vitest. The script is bare `vitest`, so it **watches** in an interactive terminal and runs once in CI/non-TTY. For a one-shot run use `npx vitest run`.
  - Single test file: `npx vitest run app/_components/FeatureCard.test.tsx`
  - Single test by name: `npx vitest run -t "test name"`
- `npx prisma generate` — regenerate the Prisma client into `app/generated/prisma`. There is a `postinstall: prisma generate` hook, so `npm install` covers it, but `prisma migrate`/`db push` do **not** — re-run manually after every `schema.prisma` edit.
- `npx prisma migrate dev` — create/apply a migration against the Neon database (uses `prisma.config.ts`, which loads `DATABASE_URL` from `.env`).

## Environment

Required env vars. Both `.env` and `.env.local` are gitignored (`.gitignore` has `.env*`, with `!.env.example` / `!.env.local.example` negations so the templates stay tracked). On a fresh clone: `cp .env.example .env && cp .env.local.example .env.local`, then fill in the values. Keep both templates in sync whenever a var is added or removed.

- `DATABASE_URL` — Neon Postgres connection string. **Must live in `.env`**, not `.env.local`: the Prisma CLI reads it through `prisma.config.ts`, which does `import "dotenv/config"`, and bare dotenv only loads `.env`. Next.js reads `.env` as a fallback anyway (load order: `.env.local` wins over `.env`, and `.env.local` is skipped entirely when `NODE_ENV=test`), so one copy in `.env` serves both.
- `AUTH_SECRET` — in `.env.local`. Required implicitly by next-auth v5 (never referenced in code).
- `NEXT_PUBLIC_GOOGLE_MAPS_KEY_DEMO` — in `.env.local`. Read in `MapView.tsx`; without it the map won't render.

Splitting a var across both files is only worth it to deliberately point the app at a different database than migrations run against — otherwise keep one copy so the two can't drift.

CI: `.github/workflows/github-CI.yml` runs on every push — `npm ci`, `npm run build`, `npm test`, with the three vars above supplied from GitHub secrets. No deploy step and no `vercel.json` (Vercel builds from its own dashboard settings).

## Architecture

**Next.js 16 App Router / React 19**, with one deliberate breaking-change convention (see `AGENTS.md`): the routing-interception file is `proxy.ts` at the project root, not `middleware.ts`. It exports `proxy` (aliased here as `auth(...)` from `next-auth`) and a `config.matcher`. It gates `/map` and `/teams`, redirecting unauthenticated requests to `/login?redirected=true`; `login/page.tsx` reads that flag (client component, `use(searchParams)`) and renders `RedirectedInfo`. Note `/account` is **not** in the protected list — it only degrades to an empty session client-side.

**Auth**: `next-auth` v5 (beta) configured in `auth.ts` at the project root — `Credentials` provider only, JWT sessions, Prisma-backed user lookup, bcrypt (`bcryptjs`) password hashing. `auth.ts` exports `handlers`, `auth`, `signIn`, `signOut`, consumed by:

- `app/api/auth/[...nextauth]/route.ts` — re-exports `GET`/`POST` from `handlers`.
- `app/_components/Providers.tsx` — wraps the app in next-auth's `SessionProvider` (client component), mounted in `app/layout.tsx`.
- Client components via `useSession()` / `signIn()` / `signOut()` — `NavBar/NavBarList.tsx`, `(account)/account/page.tsx`, `useLoginForm.ts`.
- Server actions, e.g. `app/(account)/sign-up/actions.ts` (`"use server"`), which creates the user with `prisma.user.create` and then calls `signIn("credentials", ...)`.

`auth.ts` defines explicit `jwt`/`session` callbacks that copy `user.id` onto the token and then onto `session.user.id`. **This is required** — the default Auth.js `session` callback (`@auth/core`) strips the session down to `{ name, email, image }` and does not expose `id`, so any server action/component needing `session.user.id` gets `undefined` without these callbacks. The matching type augmentation (`Session.user.id`, `JWT.id`) lives in `types/next-auth.d.ts` (picked up automatically by `tsconfig.json`'s `**/*.ts` include — no `typeRoots` needed). New server actions that need the current user should `const session = await auth();` and check `session?.user?.id`, following `app/map/actions.ts`.

**Database**: Prisma 7 with the newer `prisma-client` (TypeScript, ESM) generator — no Rust query-engine binary, so `PrismaClient` **requires** a driver adapter at construction time (the `datasource` block in `schema.prisma` intentionally has no `url`). Neon serverless Postgres via `@prisma/adapter-neon` / `@neondatabase/serverless`. The singleton client lives in `app/lib/db.ts` and is the only place a `PrismaClient` is constructed:

```ts
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
```

Import generated types/client from `app/generated/prisma`, **not** `@prisma/client`. Migrations live in `prisma/migrations`. Models: `User` (id/name/email/password/createdAt) and `Trip` (see below).

**Folder conventions**: `app/(account)/` is a route group (`login`, `sign-up`, `account`) that doesn't affect URLs. `_components/` folders (underscore) are excluded from routing — there's a global `app/_components/` and route-local ones like `app/map/_components/`. Feature components are colocated with the route that uses them; only genuinely shared ones go in `app/_components/`. Alias `@/*` → repo root.

**Forms** — the main convention in this codebase. Every form is a folder of four files:

```
SomeForm/
├── SomeForm.tsx        # presentation only: FormProvider + shared fields + submit button
├── useSomeForm.ts      # useForm + yupResolver, onSubmit (server action / signIn), error handling
├── schema.ts           # FormValues type, defaultValues, yup schema (Polish messages)
└── SomeForm.test.tsx   # Vitest + Testing Library, server action mocked
```

The hook returns `{ methods, handleSubmit }` (plus `serverError` where the action returns errors); the component spreads `methods` into `FormProvider`. Existing examples: `LoginForm`, `SignUpForm`, `TripForm`. Fields come from the shared components in **`app/_components/forms/`** — `TextField`, `Checkbox`, `CheckboxGroup` — which read context via `useFormContext()` and use a `Controller` to wire validation errors. Never wire raw `<input>` + `register` in a new form.

**Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + daisyUI v5 — prefer daisyUI classes (`btn`, `card`, `modal`, `fieldset`, `alert`, `skeleton`…) over custom CSS. There is **no `tailwind.config.js`**; daisyUI and both custom themes are configured with `@plugin` blocks directly in `app/globals.css`. `prettier-plugin-tailwindcss` sorts class names on format. Fonts (Inter + Space Grotesk) come from `next/font/google` in `layout.tsx`. Icons: `lucide-react`. Conditional classes: `clsx`.

**Theming**: `_components/NavBar/ThemeController.tsx` (client) drives light/dark **in JS, not via daisyUI's CSS-only theme-controller** — it sets `data-theme` on `<html>` and persists to `localStorage["theme"]`, syncing the checkbox through a `ref` (not state) in `useEffect` to avoid the `react-hooks/set-state-in-effect` lint rule. `dark` is `--default` with no `prefersdark`, deliberately ignoring `prefers-color-scheme` — the earlier CSS-only version couldn't be switched back to light on a dark-mode OS because the media query out-specified `:where(:root)`. There's no blocking `<head>` script, so a saved `light` choice can flash dark on first paint.

**Map / trip planning** (`app/map/`):

- `page.tsx` — async Server Component. Queries `prisma.trip.findMany` for upcoming trips (`startDateTime >= now`, across **all users** — the map is a community feature) using a `tripSelect` object declared `satisfies Prisma.TripSelect`, and exports `TripForMap = Prisma.TripGetPayload<{ select: typeof tripSelect }>` as the shared trip type. Passes `trips` to both `MapView` and `TripsList`.
- `loading.tsx` — daisyUI `skeleton` placeholder mirroring that layout.
- `_components/MapView.tsx` (`"use client"`) — Google Maps via `@vis.gl/react-google-maps` inside `APIProvider`. Renders one `TripMarker` per trip, plus a separate click-to-create flow: clicking the map drops an `AdvancedMarker` and opens an `InfoWindow` with a "Zaplanuj wyjazd" button that opens `TripModal`. Owns all the state (`clickedPoint`, `selectedLocation`, `openTripId`, `isModalOpen`).
- `_components/TripMarker.tsx` — one trip's marker (lucide `Rocket`) + `InfoWindow` with its details and a `DirectionButton`. It's a separate component because `useAdvancedMarkerRef` can't be called inside `.map()`.
- `_components/TripsList.tsx` — server-renderable card list under the map.
- `_components/TripModal/TripModal.tsx` — `<dialog className="modal">` driven by `showModal()`/`close()` from an `isOpen` prop effect (plain props, no `forwardRef`/`useImperativeHandle`); renders `TripForm` once a location is picked.
- `_components/TripForm/` — the standard form triple; `useTripForm` calls `createTrip`, then `reset()` + `onSuccess()` + `router.refresh()` so the server component refetches and the new trip flows back down through props (no client cache or optimistic update).
- `types.ts` — shared `Location = { lat, lng }`.
- `app/lib/tripOptions.ts` — `MOTORCYCLE_TYPES` / `RIDING_STYLES` option lists and the two limits. The option `value` strings are persisted in Postgres, so they must stay stable even if the labels change.

`createTrip` in `app/map/actions.ts` checks `session.user.id` (rejects if unauthenticated), enforces **two independent per-user limits**, then `prisma.trip.create`s, returning `{ error }` / `{ success: true }` rather than throwing:

- `DAILY_TRIP_LIMIT` (2) — max trips sharing the same `startDateTime` calendar date.
- `MAX_TRIPS_CREATED_PER_DAY` (5) — anti-spam: max trips **created** (`createdAt`) in one calendar day, whatever date they're planned for.

Note the action currently only coerces the payload (`new Date`, `Number`) — it does **not** re-run the yup schema server-side, so field validation is client-only. Re-validating in the action is the intended direction for new server actions.

The `Trip` model stores `userId` (FK to `User`), `startDateTime`, `destination`, `groupSize`/`estimatedDistanceKm` (`Int`, parsed from numeric text inputs), `estimatedDuration` (free text), `returnToStart` (`Boolean`), `motorcycleTypes`/`ridingStyle` (Postgres `String[]`), `lat`/`lng` (`Float`), and is indexed on `[userId, startDateTime]`.

## Testing

Vitest 4 with `jsdom` and `@testing-library/react`; `vitest.config.mts` uses `@vitejs/plugin-react` and `resolve: { tsconfigPaths: true }` for the `@/*` alias. `vitest.setup.ts` registers jest-dom matchers and calls `cleanup()` after each test.

Conventions in existing tests: colocate `X.test.tsx` next to `X.tsx`; `vi.mock` the server action module (and `next/navigation` when the component calls `useRouter`) and assert on the mock; query by accessible role/label (`getByLabelText("Hasło")`, `getByRole("button", { name: "Zaplanuj" })`) rather than test IDs; drive inputs with `fireEvent` and await async validation with `findBy*` / `waitFor`. Coverage is still thin — forms and a couple of presentational components only.
