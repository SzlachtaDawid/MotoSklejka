# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

MotoSklejka is a web app for motorcyclists to find other riders for joint trips ("sklejka" = riding together). Planned/in-progress features: a map of trips/meetups, teams (open/closed groups with shared trip planning, rankings, team chat), and account login/registration. UI copy is in Polish.

## Commands

- `npm run dev` — start dev server (Next.js)
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)
- `npm test` — run Vitest test suite once (no separate watch script defined)
  - Single test file: `npx vitest run app/_components/FeatureCard.test.tsx`
  - Single test by name: `npx vitest run -t "test name"`
- `npx prisma generate` — regenerate the Prisma client into `app/generated/prisma` after editing `prisma/schema.prisma`. This is **not** run automatically by `prisma db push`/`migrate` or `npm install`, so re-run it manually whenever the schema changes.
- `npx prisma migrate dev` — create/apply a migration against the Neon database (uses `prisma.config.ts`, which loads `DATABASE_URL` from `.env`).

## Architecture

**Next.js App Router**, with one deliberate breaking-change convention (see `AGENTS.md`): the routing-interception file is `proxy.ts` at the project root, not `middleware.ts`. It exports `proxy` (aliased here as `auth(...)` from `next-auth`) and a `config.matcher`. It gates `/map` and `/teams` behind authentication, redirecting unauthenticated requests to `/login`.

**Auth**: `next-auth` v5 (beta) configured in `auth.ts` at the project root using the `Credentials` provider only, JWT sessions, and a Prisma-backed user lookup (bcrypt password hashing via `bcryptjs`). `auth.ts` exports `handlers`, `auth`, `signIn`, `signOut`, consumed by:
- `app/api/auth/[...nextauth]/route.ts` — re-exports `GET`/`POST` from `handlers`.
- `app/_components/Providers.tsx` — wraps the app in next-auth's `SessionProvider` (client component), mounted in `app/layout.tsx`.
- `app/_components/NavBar/NavBarList.tsx` — reads `useSession()` client-side to toggle login/sign-up links vs. user menu/sign-out.
- Server actions, e.g. `app/(account)/sign-up/actions.ts` (`"use server"`), call `signIn("credentials", ...)` directly after creating a user with `prisma.user.create`.

`auth.ts` defines explicit `jwt`/`session` callbacks that copy `user.id` onto the token and then onto `session.user.id`. **This is required** — the default Auth.js `session` callback (`@auth/core`) strips the session down to `{ name, email, image }` and does not expose `id`, so any server action/component that needs `session.user.id` will get `undefined` without these callbacks. The corresponding type augmentation (`Session.user.id`, `JWT.id`) lives in `types/next-auth.d.ts` (picked up automatically by `tsconfig.json`'s `**/*.ts` include — no `typeRoots` config needed). Any new server action needing the current user should call `const session = await auth();` and check `session?.user?.id`, following the pattern in `app/map/actions.ts`.

**Database**: Prisma 7 with the newer `prisma-client` (TypeScript, ESM) generator — there is no Rust query-engine binary, so `PrismaClient` **requires** a driver adapter at construction time (the `datasource` block in `schema.prisma` intentionally has no `url`). The app uses Neon serverless Postgres via `@prisma/adapter-neon` / `@neondatabase/serverless`. The singleton client lives in `app/lib/db.ts`:
```ts
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
```
Generated client output goes to `app/generated/prisma` (gitignored-style generated code) — import from there, not `@prisma/client` directly. Migrations live in `prisma/migrations`.

**Forms**: built with `react-hook-form` + `yup` (via `@hookform/resolvers/yup`), wrapped in `FormProvider`. `app/_components/TextField/TextField.tsx` is the shared field component — it reads form context via `useFormContext()` (so it must be rendered inside a `FormProvider`), and uses a `Controller` to wire up validation error display. New form fields should reuse this component rather than wiring raw `<input>` + `register`.

**Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`) plus daisyUI v5 component classes (`btn`, `card`, `drawer`, `fieldset`, `alert`, etc.) — prefer daisyUI utility classes over custom CSS for new UI. `prettier-plugin-tailwindcss` auto-sorts class names on format.

**Route groups**: `app/(account)/` holds `login` and `sign-up` pages without affecting the URL path. Protected feature areas (`app/map`, `app/teams`) are plain top-level routes gated by `proxy.ts`.

**Map / trip planning** (`app/map/`): `app/map/page.tsx` is an **async Server Component** — it queries `prisma.trip.findMany` for upcoming trips (`startDateTime >= now`, across **all users**, not just the logged-in one — the map is a community feature) and passes them as a `trips` prop into `MapView.tsx`. `MapView.tsx` (`"use client"`) renders Google Maps via `@vis.gl/react-google-maps`, wrapped in `APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY_DEMO!}` — this env var must be set locally (and on deploy) or the map won't render. It renders one 🏁 `AdvancedMarker`/`InfoWindow` per fetched trip (via an inline `TripMarker` subcomponent, since `useAdvancedMarkerRef` can't be called inside `.map()`), alongside the separate, pre-existing click-to-create flow: clicking the map drops a red `AdvancedMarker` and opens an `InfoWindow` with an option to open `TripModal.tsx`, a `<dialog>`-based modal (shown via `showModal()`/`close()`, exposed to the parent through `forwardRef`/`useImperativeHandle`) containing the "Zaplanuj wyjazd" (plan a trip) form. The form uses the same `react-hook-form` + `yup` + `FormProvider` pattern as auth forms, plus two shared field components: `app/_components/Checkbox/Checkbox.tsx` and `app/_components/CheckboxGroup/CheckboxGroup.tsx` (both read form context the same way `TextField` does). Option lists (motorcycle types, riding styles) and the two trip-creation limits (`DAILY_TRIP_LIMIT`, `MAX_TRIPS_CREATED_PER_DAY`) live in `app/lib/tripOptions.ts`.

On submit, `TripModal` calls the `createTrip` server action in `app/map/actions.ts`, which: checks `session.user.id` (rejects if unauthenticated), defensively re-validates the payload server-side, enforces **two independent limits** per user, then `prisma.trip.create`s the row:
- `DAILY_TRIP_LIMIT` (default 2) — max trips with the **same `startDateTime` calendar date** (counted by `startDateTime`, not by when they were created).
- `MAX_TRIPS_CREATED_PER_DAY` (default 5) — anti-spam: max trips **created** (`createdAt`) in one calendar day, regardless of what date they're planned for.

On success, `TripModal` calls `router.refresh()` (no client-side cache/optimistic update) so `page.tsx`'s server-side fetch re-runs and the new trip flows back down through the `trips` prop. The `Trip` model (`prisma/schema.prisma`) stores `userId` (FK to `User`), `startDateTime`, `destination`, `groupSize`/`estimatedDistanceKm` (`Int`, parsed from the form's numeric text inputs), `estimatedDuration` (free text), `returnToStart` (`Boolean`), `motorcycleTypes`/`ridingStyle` (Postgres `String[]`, validated against the `tripOptions.ts` value lists), and `lat`/`lng` (`Float`).

**Testing**: Vitest with `jsdom` environment and `@testing-library/react`; setup file `vitest.setup.ts` registers jest-dom matchers and calls `cleanup()` after each test. Path alias `@/*` (defined in `tsconfig.json`) resolves to the project root.
