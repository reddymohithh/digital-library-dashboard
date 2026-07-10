# Product Requirements Document — Digital Library Dashboard

**Owner:** Reddy Mohith · **Status:** v1 (MVP) · **Last updated:** 2026-07-10

## 1. Problem

I read constantly across fiction and non-fiction, in physical, audiobook, and
e-book form. Today that's tracked (if at all) across spreadsheets, sticky
notes, and memory — none of which let me browse my collection, see a book's
full details at a glance, or hold myself to a yearly reading goal with any
real feedback loop. Existing tools (Goodreads, StoryGraph) are built for social
discovery, not for a private, fast, opinionated personal library.

## 2. Users

| User | Description | Can do |
|---|---|---|
| **Admin** (me) | The sole owner of the library data. | Browse, search, filter; add/edit/delete books; import CSVs; set reading goals; log daily reading check-ins. |
| **Viewer** (anyone else with the link) | Public visitors — friends, recruiters, portfolio reviewers. | Browse, search, filter, and open book details. **Cannot** create, edit, delete, import, set goals, or log check-ins — enforced server-side, not just hidden in the UI. |

## 3. Success metrics

- I use it as my only reading tracker for a full calendar year (no reverting
  to a spreadsheet).
- Zero manual database/terminal intervention after initial deployment setup —
  every book, goal, and check-in is entered through the deployed app.
- The admin/viewer boundary holds up even against a technically curious
  visitor (verified via direct API requests, not just UI inspection).

## 4. MVP scope

### 4.1 Library browsing (all users)
- Sidebar filters: reading status, genre (built dynamically from whatever
  genres exist in the data), star rating.
- Search by title, author, or genre.
- Sort by recently added, title, author, rating, date finished, format, source.
- Grid view (cover-forward) and list view (dense/scannable); paginated at 27
  books per page.
- Book detail view: cover, status + format (physical/audiobook/e-book)
  badges, rating, genre, year, page count, source, start/finish dates,
  description, personal notes.

### 4.2 Library management (admin only)
- **Add Book** — a form with fixed, labeled fields (not a blank text box),
  covering every field shown in the detail view.
- **Edit / Delete** — available from the detail view for every book,
  including ones brought in via CSV import.
- **Import CSV** — upload a file matching a documented column format; the app
  previews every row with per-row validation before committing, so bad rows
  are caught and reported rather than silently corrupting the library.

### 4.3 Reading Goals
- Set (per calendar year): a books-read target, a daily pages target, and an
  optional target genre (informational only — does not affect any
  calculation, matching the original ask).
- **Progress**: a donut chart of books finished this year vs. the yearly
  target.
- **Daily check-in** (admin only): mark each day Met / Partial / Missed
  against the daily pages target; Partial counts as half credit.
- **Monthly calendar**: color-coded circles (green/orange/red) for every
  logged day, so missed streaks are visible at a glance.
- **Year in Review**: books finished, a genre breakdown of those books, and
  total pages read (derived from the daily check-ins, not a separate manual
  entry).

### 4.4 Access control
- A single admin identity, credentials set via server environment variables
  (never hardcoded, never hinted at on the login screen).
- Server-verified session (signed, httpOnly cookie) — every write endpoint
  re-checks the session itself, so hiding admin buttons in the UI is a
  convenience, not the actual security boundary.

## 5. Non-goals (explicitly out of scope for v1)

- Multi-user accounts / multiple libraries.
- Social features — sharing, following, public reviews from other users.
- Native mobile app or offline support.
- Book recommendations or external metadata lookup (e.g. auto-fetching covers
  from an ISBN).
- Editing past daily check-ins from the calendar (only "today" is logged
  going forward, matching the original ask).

## 6. Key flows

1. **Viewer browses**: lands on `/`, filters by status/genre/rating or
   searches, opens a book's detail view. No login prompt, no write affordances
   visible anywhere.
2. **Admin adds a book**: logs in → "+ Add Book" → fills the form → saves →
   book appears immediately in the grid.
3. **Admin imports a CSV**: logs in → "Import CSV" → downloads the template if
   needed → uploads a file → reviews the row-by-row validation preview →
   confirms → sees a created/skipped summary.
4. **Admin sets a goal and checks in daily**: opens "Reading Goals" → sets
   books/pages targets for the year → each day, marks Met/Partial/Missed →
   watches the donut, calendar, and year-in-review update.

## 7. Technical approach (summary — see README for setup)

Next.js (App Router) + TypeScript on Vercel, Postgres via Neon through
Prisma, server-verified session auth (no third-party auth provider needed for
a single admin identity), Tailwind for styling. Full architecture notes live
in the implementation plan and inline code comments where non-obvious.
