# ticktock — Timesheet Web App

A pixel-perfect implementation of the **ticktock** timesheet application from the
Tentwenty frontend assessment. Built with Next.js (App Router), TypeScript and
Tailwind CSS, with a self-contained mock API layer.

> **Live demo:** _add your Vercel URL here after deploying_
>
> **Demo login:** `tushar@dev` / `tushar1234`

---

## Screens

| Screen | Route | What it does |
| ------ | ----- | ------------ |
| **Login** | `/login` | Split-panel sign-in, validates against a mock user, stores a session token |
| **Table View** | `/timesheets` | Weekly timesheets with status badges, **Date Range + Status filters**, and pagination |
| **List View** | `/timesheets/[weekId]` | A week's entries grouped by day, weekly progress bar, add/edit/delete tasks |
| **Add / Edit Entry** | (modal) | Create or update an entry — project, type of work, description, hours |

---

## Getting started

**Requirements:** Node.js 18.18+ (built and tested on Node 20).

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
# open http://localhost:3000  →  redirects to /login

# 3. Sign in with the demo credentials
#    email:    tushar@dev
#    password: tushar1234
```

**Other scripts**

```bash
npm run build          # production build
npm run start          # serve the production build
npm run lint           # eslint
npm test               # run the Jest test suite
npm run test:watch     # tests in watch mode
npm run test:coverage  # tests with a coverage report
```

No environment variables are required — the app is fully self-contained.

---

## Tech stack & libraries

| Concern | Choice | Why |
| ------- | ------ | --- |
| Framework | **Next.js 16 (App Router)** | Route Handlers give a clean place for the local API; trivial Vercel deploy |
| Language | **TypeScript** (strict) | End-to-end type safety across the API boundary |
| Styling | **Tailwind CSS v4** | Design tokens centralised in `app/globals.css` (`@theme`) |
| Data fetching | **TanStack Query (React Query)** | Caching, loading/error states, mutation invalidation |
| Icons | **lucide-react** | Lightweight, consistent icon set |
| Font | **Inter** via `next/font/google` | Per the design spec |
| Testing | **Jest + React Testing Library** | Unit tests for components, utils, status logic and the API client |

---

## Architecture — the API boundary

The assessment asks for **local API endpoints** with **no direct mock-data imports
in components**. That separation is enforced strictly:

```
lib/mock/*          →   app/api/*           →   services/api/*     →   components / pages
(seed data, store)      (Route Handlers)        (typed fetchers)       (only ever see typed data)
```

- **`lib/mock/`** — seed data + an in-memory store (`users`, `projects`, `timesheets`).
  Imported **only** by route handlers, never by a component.
- **`app/api/`** — Route Handlers. They own auth, validation, filtering,
  pagination and status derivation, and add a small simulated latency so loading
  states are real.
- **`services/api/`** — typed client fetchers (`client.ts` wraps `fetch`,
  `auth.ts` / `timesheets.ts` expose the calls). Components call these; every
  request carries the bearer token and parses errors into a typed `ApiError`.
- **`context/auth/`** — the client-side session. `AuthProvider` exposes the
  current user through `useSyncExternalStore` over a small subscribe/snapshot
  store; `useAuth()` is the consumer hook. The token + user live in
  `localStorage`.
- **components / pages** — consume only the typed domain models in `lib/types.ts`.

Cross-cutting helpers live outside the data path: **`utils/`** (date formatting,
the `cn` class joiner, shared regexes) and **`constants/TEXT_CONSTANTS.ts`**
(centralised UI copy via the `TEXT` object).

### API endpoints

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| `POST` | `/api/auth/login` | Validate credentials → `{ token, user }` |
| `GET` | `/api/auth/me` | Current user for a valid token |
| `GET` | `/api/timesheets` | Weekly timesheets — `?status=&from=&to=&page=&perPage=` |
| `GET` | `/api/timesheets/[weekId]/entries` | A week's summary + its entries |
| `POST` | `/api/timesheets/[weekId]/entries` | Create an entry |
| `PATCH` | `/api/entries/[id]` | Update an entry |
| `DELETE` | `/api/entries/[id]` | Delete an entry |
| `GET` | `/api/projects` | Project + work-type options for the modal |

All endpoints except `login` require an `Authorization: Bearer <token>` header.

### Status rule

Weekly status is derived server-side from total logged hours
(`lib/status.ts`), per the spec:

- `completed` — **40h** logged
- `incomplete` — **< 40h** logged
- `missing` — **0h** logged

### Date-range filter

Selecting a range returns **every week that overlaps it** (not just weeks fully
inside it), so a multi-week range shows all the weeks it touches — as required by
the spec note.

---

## Project structure

```
app/
  layout.tsx · providers.tsx · globals.css   # Inter font, React Query, design tokens
  page.tsx                                    # → redirects to /timesheets
  login/page.tsx                              # Login
  timesheets/
    layout.tsx                                # auth guard + navbar + footer chrome
    page.tsx                                  # Table View
    [weekId]/page.tsx                         # List View
  api/…                                       # Route Handlers (the mock API)
services/api/
  client.ts                                   # fetch wrapper, ApiError, session storage
  auth.ts · timesheets.ts · types.ts          # typed client fetchers
context/auth/
  AuthProvider.tsx · AuthContext.ts           # mock session (localStorage)
  authStore.ts · useAuth.ts · types.ts        # subscribe/snapshot store + hook
lib/
  types.ts                                    # shared domain models
  status.ts                                   # weekly status derivation
  server-helpers.ts                           # route-handler helpers (token, validation)
  mock/                                       # seed data + in-memory store
utils/
  DatesFormatter.ts · cn.ts · RegExp.ts       # pure helpers
constants/
  TEXT_CONSTANTS.ts                           # centralised UI copy (`TEXT`)
components/
  ui/        Button Input Select Badge Modal DropdownMenu Stepper Spinner Field
  layout/    Navbar Footer RequireAuth
  timesheets/  TimesheetTable Filters Pagination
  list/        DayGroup TaskCard ProgressBar
  entry/       AddEntryModal
__tests__/   Jest + React Testing Library suites mirroring the tree above
```

---

## Testing

Unit tests run on **Jest** with **React Testing Library** (jsdom). The suite in
`__tests__/` mirrors the source tree:

- **components** — `ui/` (Badge, Button, DropdownMenu, Spinner) and the
  `timesheets/` + `list/` views (Filters, Pagination, TaskCard, ProgressBar)
- **context/auth** — the session store and the `useAuth` hook
- **services/api** — the `client` fetch wrapper and `ApiError` handling
- **lib** — `status` derivation (the 40h / <40h / 0h rule)
- **utils** — date formatting and the `cn` helper

```bash
npm test               # run once
npm run test:watch     # watch mode
npm run test:coverage  # coverage report
```

---

## Assumptions & notes

- **Mock auth.** A single demo user (`lib/mock/users.ts`). The token is a simple
  opaque string stored in `localStorage`; route handlers validate its presence.
  Credentials are demo-only, not real secrets. The demo login is shown on the
  sign-in screen for convenience.
- **In-memory store.** Entries live in process memory, so data resets on server
  restart. On a serverless host (e.g. Vercel) writes are not guaranteed to persist
  across cold starts / separate instances — fine for a demo, but a real build
  would back this with a database.
- **Date Range filter** is implemented as preset ranges (All time / months / Q1),
  each spanning multiple weeks to demonstrate the overlap behaviour. A full
  calendar range-picker would be a drop-in replacement for the same query params.
- **Pagination** reflects the real dataset (12 seeded weeks → 3 pages at 5/page).
  The ellipsis logic also handles large page counts.
- **Column sort arrows** in the table header are visual, matching the design;
  the data is ordered by week number.
- **Delete** asks for confirmation before removing an entry.
- **Responsive.** Layouts adapt down to mobile (the login brand panel hides, day
  rows stack); the design itself is desktop-first.

---

## Time spent

Approximately **5–6 hours** (design study, scaffolding, API layer, the four
screens, visual QA against the Figma, and this README).
