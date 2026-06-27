# ticktock — Timesheet Web App

A pixel-perfect implementation of the **ticktock** timesheet application from the
Tentwenty frontend assessment. Built with Next.js (App Router), TypeScript and
Tailwind CSS, with a self-contained mock API layer.

> **Live demo:** _add your Vercel URL here after deploying_
>
> **Demo login:** `john@ticktock.dev` / `password123`

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
#    email:    john@ticktock.dev
#    password: password123
```

**Other scripts**

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
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

---

## Architecture — the API boundary

The assessment asks for **local API endpoints** with **no direct mock-data imports
in components**. That separation is enforced strictly:

```
lib/mock/*          →   app/api/*           →   lib/api/*          →   components / pages
(seed data, store)      (Route Handlers)        (typed fetchers)       (only ever see typed data)
```

- **`lib/mock/`** — seed data + an in-memory store (`users`, `projects`, `timesheets`).
  Imported **only** by route handlers, never by a component.
- **`app/api/`** — Route Handlers. They own auth, validation, filtering,
  pagination and status derivation, and add a small simulated latency so loading
  states are real.
- **`lib/api/`** — typed client fetchers. Components call these; every request
  carries the bearer token and parses errors into a typed `ApiError`.
- **components / pages** — consume only the typed domain models in `lib/types.ts`.

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
lib/
  types.ts · status.ts · date.ts · cn.ts
  auth-context.tsx                            # mock session (localStorage)
  api/                                        # client fetchers + base client
  mock/                                       # seed data + in-memory store
components/
  ui/        Button Input Select Badge Modal DropdownMenu Stepper Spinner Field
  layout/    Navbar Footer RequireAuth
  timesheets/  TimesheetTable Filters Pagination
  list/        DayGroup TaskCard ProgressBar
  entry/       AddEntryModal
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
# ticktock
