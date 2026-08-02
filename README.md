# Digital Library Dashboard

Digital Library Dashboard is a personal reading tracker I designed and shipped end-to-end, from problem framing, scope decisions, UX, and a real production deployment, to track my own library of 100+ books. It's live [HERE](https://digital-library-dashboard-alpha.vercel.app/) and in daily personal use, not a demo dataset.

## Background & problem

I've read over 100 books in the last few years, across physical copies, e-books, and audiobooks, and I collect physical copies I love (a habit that's half the inspiration for eventually building an actual small home library. This app is the digital rehearsal for that). Somewhere past book 30 or so, I stopped being able to remember what I had read, what I thought of it, or where I had left off with something I had paused.

What I needed to track was never just "title, author, done." For each book I care about:

- **Format**: physical, e-book, or audiobook, because it changes how and where I actually read it.
- **Genre**: so that over time I can see the shape of what I go toward, rather than what I assume I do.
- **What the book promised**: the premise/description I read at the time I picked it up.
- **What it meant to me after**: personal notes and a rating, which is the part a bare catalog entry never captures.
- **Progress and status**: reading, finished, on hold, DNF, re-reading. A book's state changes, sometimes more than once.
- **How it looks**: cover art matters to me more than I expected going in. Colors and covers are a big part of why I browse a shelf, physical or
  digital, rather than just search it.

I tried two paths before building this:

1. **A spreadsheet.** It technically captured the data, but making it look and browse the way I wanted with cover-forward, filterable, visually organized by status and genre, was constant manual formatting work that fought the tool the whole way. It's a database, not a library.
2. **Existing tools (Goodreads, StoryGraph, etc.).** They solve a version of this problem, but for a different user: someone who wants social discovery, recommendations, and community features. I don't want any of that here, and I don't want to pay for a subscription to get the parts I do want. No off-the-shelf tool gets 100% of what I actually want to track and how I want to browse it. I would always be working around its model of what a "book" is, not mine.

So the actual problem isn't "I need a place to log books." It's "I need a tool shaped exactly like how I think about my own reading, with full control over the data and the presentation, that doesn't cost me anything to run."

## Goals

- Replace the spreadsheet and the mental tracking. One place for every book, with zero compromise on the browsing experience I want.
- Make browsing feel like looking at a shelf with covers and visual status front and center.
- Capture the reflective layer (notes, ratings, what a book meant to me), not just the bibliographic layer.
- Turn a yearly reading goal into something with a feedback loop (progress visualization, daily check-ins), instead of a number I set in
  January and forget about.
- Cost nothing to run and require no ongoing technical maintenance. Every day-to-day action happens through the app itself.

## Users

| User | Description | Can do |
|---|---|---|
| **Admin** (me) | The sole owner of the library data. | Browse, search, filter. Add/edit/delete books. Import CSVs. Set reading goals. Log daily reading check-ins. Change login credentials. |
| **Viewer** (anyone else with the link) | Public visitors. | Browse, search, filter, and open book details. **Cannot** create, edit, delete, import, set goals, or log check-ins. Enforced server-side, not just hidden in the UI. |

## Success metrics

- I use it as my only reading tracker for a full calendar year. No reverting to a spreadsheet or another app.
- No manual database/terminal intervention after deployment setup. Every book, goal, and check-in is entered through the deployed app.
- The admin/viewer boundary holds up even against a technically curious visitor (verified via direct API requests, not just UI inspection).
- Running cost stays at $0 (free tiers only) through normal personal-scale usage.

## Scope

### Library browsing (all users)
- Sidebar filters: reading status, genre (built dynamically from whatever genres exist in the data), star rating.
- Search by title, author, or genre.
- Sort by recently added, title, author, rating, date finished, format, source.
- Grid view (cover-forward, so browsing feels visual first) and list view (dense/scannable). Paginated, with page size adapting to how many columns actually fit the viewport.
- Book detail view: cover, status + format (physical/audiobook/e-book) badges, rating, genre, year, page count, source, start/finish dates, description ("what the book promised"), and personal notes ("what it meant to me").

### Library management (admin only)
- **Add Book**: a form with fixed, labeled fields (not a blank text box), covering every field shown in the detail view.
- **Edit / Delete**: available from the detail view for every book, including ones brought in via CSV import.
- **Import CSV**: upload a file matching a documented column format. The app previews every row with per-row validation before committing, so bad rows are caught and reported rather than silently corrupting the library.

### Reading Goals
- Set (per calendar year): a books-read target, a daily pages target, and an optional target genre (Informational only. It doesn't affect any
  calculation).
- **Progress**: a donut chart of books finished this year vs. the yearly target.
- **Daily check-in** (admin only): mark each day Met / Partial / Missed against the daily pages target. Partial counts as half credit.
- **Monthly calendar**: color-coded circles (green/orange/red) for every logged day, so missed streaks are visible at a glance.
- **Year in Review**: books finished, a genre breakdown of those books, and total pages read (derived from the daily check-ins, not a separate manual entry).

### Access control
- A single admin identity. Credentials bootstrap from server environment variables once, then live in the database and are changeable in-app, never hardcoded, never hinted at on the login screen.
- Server-verified session (signed, httpOnly cookie). Every write endpoint re-checks the session itself, so hiding admin buttons in the UI is a convenience, not the actual security boundary.

## Non-goals (explicitly out of scope for v1)

- Multi-user accounts / multiple libraries: This is a single-owner personal tool by design, not a multi-tenant product.
- Social features: sharing, following, public reviews from other users (intentionally, this is the thing I'm opting out of by not using Goodreads).
- Native mobile app or offline support.
- Book recommendations or external metadata lookup (e.g. auto-fetching covers from an ISBN).
- Editing past daily check-ins from the calendar (only "today" is logged going forward).

## Key flows

1. **Viewer browses**: lands on `/`, filters by status/genre/rating or searches, opens a book's detail view. No login prompt, no write
   affordances visible anywhere.
2. **Admin adds a book**: logs in → "+ Add Book" → fills the form → saves → book appears immediately in the grid.
3. **Admin imports a CSV**: logs in → "Import CSV" → downloads the template if needed → uploads a file → reviews the row-by-row validation preview → confirms → sees a created/skipped summary.
4. **Admin sets a goal and checks in daily**: opens "Reading Goals" → sets books/pages targets for the year → each day, marks Met/Partial/Missed → watches the donut, calendar, and year-in-review update.

## Risks & assumptions

- **Assumption**: personal-scale data (hundreds, not tens of thousands, of books) stays comfortably within free-tier hosting/database limits indefinitely. Validated early against Neon's actual usage numbers.
- **Risk**: a single hardcoded admin identity doesn't scale past "just me." It's acceptable since multi-user is an explicit non-goal, not an oversight.
- **Risk**: no automated backups of the database beyond the provider's defaults. It's acceptable for personal data at this scale, but a real gap if the collection becomes something I would be upset to lose.

## Future considerations (not committed)

- A "physical library" mode mapping books to actual shelf/box locations, as a bridge toward the real personal library this project is a rehearsal for.
- Light analytics over time (pages/year trend, genre drift year over year).
- Bulk edit from CSV re-export rather than only one-way import.

## Technical design

### Stack and hosting

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | One deployable for both UI and API routes. Server components keep the viewer path simple. File-based routing maps cleanly onto the resource model (books, goals, daily logs). |
| Styling | Tailwind CSS | Fast to match the approved visual reference pixel-for-pixel. No separate CSS files to keep in sync. |
| Database | Postgres via [Neon](https://neon.tech) | Free tier covers personal-scale data. Serverless/pooled connections work well with Vercel's serverless functions. |
| ORM | Prisma 6 | Type-safe queries and migrations; schema-as-code doubles as living data-model documentation. |
| Auth | Custom session auth (`jose` for JWT, `bcryptjs` for hashing) | A single fixed admin identity doesn't justify a third-party auth provider or its added cost/complexity/data-sharing. |
| CSV parsing | `papaparse` + `zod` validation | Row-by-row parsing with per-row schema validation before any database write, so a malformed CSV fails loudly instead of corrupting data. |
| Hosting | Vercel | Zero-cost tier, auto-deploys on push to `main`, native Next.js support. |

### Data model

Four Prisma models back the whole app (`prisma/schema.prisma`):

- **`Book`**: the core entity: `title`, `author`, `genre`, `yearPublished`, `pages`, `status` (`READING` / `WANT_TO_READ` / `FINISHED` / `DNF` /  `ON_HOLD` / `RE_READING`), `format` (`PHYSICAL` / `AUDIOBOOK` / `EBOOK`), `rating` (0–5), `dateStarted`/`dateFinished`, `description` (what the book promised), `notes` (what it meant to me), `source`, `coverUrl`. Indexed on `status` and `genre` since sidebar filtering is the primary read pattern.
- **`Goal`**: one row per calendar year: `booksGoal`, `dailyPages`, optional `targetGenre`.
- **`DailyLog`**: one row per calendar date (`date` as primary key), holding the `DailyStatus` (`MET` / `PARTIAL` / `MISSED`) for that day's check-in.
- **`AdminCredential`**: a deliberate singleton row (`id` pinned to `1`)  holding the live admin username/password hash. Bootstrapped once from `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH` env vars on first login, then owned entirely by the database and mutable in-app via "Change Login" — so rotating credentials never requires touching env vars or redeploying.

### API surface

All routes live under `src/app/api/`, are consumed only by the app's own frontend, and every mutating route independently re-verifies the session cookie server-side (not just a UI-level check):

| Route | Methods | Purpose |
|---|---|---|
| `/api/auth/login` | `POST` | Verify credentials, issue session cookie (bootstraps `AdminCredential` from env vars on first-ever login). |
| `/api/auth/logout` | `POST` | Clear the session cookie. |
| `/api/auth/me` | `GET` | Report current session state (used by the frontend to show/hide admin UI). |
| `/api/auth/credentials` | `PUT` | Change username/password; requires the current password. |
| `/api/books` | `GET`, `POST` | List (filtered/sorted/paginated) or create a book. |
| `/api/books/[id]` | `GET`, `PUT`, `DELETE` | Read, update, or delete a single book. |
| `/api/books/import` | `POST` | Bulk-create from a validated CSV row set. |
| `/api/goals/[year]` | `GET`, `PUT` | Read or set the reading goal for a given year. |
| `/api/daily-log` | `GET` | List the current year's check-ins (feeds the calendar/donut/year-in-review). |
| `/api/daily-log/[date]` | `PUT`, `DELETE` | Set or clear a single day's check-in. |

### Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/            → login, logout, session check, change credentials
│   │   ├── books/           → list/create, single-book CRUD, CSV import
│   │   ├── goals/[year]/    → per-year reading goal
│   │   └── daily-log/       → daily check-in read/write
│   ├── layout.tsx           → root layout, global providers
│   ├── page.tsx             → main dashboard: filters, grid/list, pagination
│   └── globals.css
├── components/
│   ├── Sidebar, TopBar, ContentHeader, Pagination
│   ├── BookCard, BookListRow, BookListHeader
│   ├── BookDetailModal, BookFormModal, ImportCsvModal
│   ├── LoginModal, ChangeCredentialsModal
│   └── goals/                → GoalsPanel, GoalForm, DonutChart, GoalCalendar
└── lib/
    ├── auth.ts               → JWT sign/verify, session cookie helpers, requireAdmin() guard
    ├── prisma.ts             → Prisma client singleton
    ├── books.ts               → shared book query/formatting helpers
    ├── types.ts               → shared frontend/API types
    └── AdminContext.tsx       → client-side admin/session state

prisma/
├── schema.prisma             → data model (see 12.2)
└── migrations/                → versioned SQL migrations
```


Built with Claude as an AI-assisted product development exercise.
*All product decisions, feature scoping, and UX choices were made by me. Claude was the implementation pair.*
