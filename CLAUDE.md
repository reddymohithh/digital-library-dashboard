# Project context (auto-loaded — read this first in any new session)

This file is read automatically by Claude Code at the start of every session
in this folder. It exists so a brand new chat — yours or a future one — has
working context immediately, without you having to re-explain the project.

## What this is

A personal reading-tracker web app (Digital Library Dashboard) for Reddy
Mohith: browse a book library, manage it as admin (add/edit/CSV import), and
track yearly reading goals with a daily check-in, calendar, and year-in-review
stats. Built as an AI PM portfolio piece — see [`PRD.md`](PRD.md) for the full
product spec and [`README.md`](README.md) for the technical setup.

## Current status (last updated 2026-07-26)

- **Live and in real use.** Deployed at
  `https://digital-library-dashboard-alpha.vercel.app/`. The user has already
  imported their real library via CSV (84+ books as of this writing, growing)
  — this is not a demo, treat existing data as real and don't touch it
  destructively.
- **GitHub**: `https://github.com/reddymohithh/digital-library-dashboard`,
  branch `main`, fully in sync with local (last push `129d693`). Vercel
  auto-deploys on every push to `main` — no separate staging environment by
  default (see `CONTRIBUTING.md` for the safer branch+PR+preview pattern for
  non-trivial changes).
- **Git push access**: the local repo's `origin` remote is authenticated via
  a credential cached on this machine (from the user's own earlier `git
  push`), so `git push` from a Claude Code session here works the same as the
  user typing it themselves — Claude has no separate/independent GitHub
  access. Always confirm with the user before pushing (don't assume standing
  permission from one earlier "yes").
- **The user can also edit files directly on GitHub's web UI** (pencil icon
  on any file → edit → commit) for small changes without a terminal. If they
  mention having done this, `git pull` before making further local changes
  to avoid diverging.
- **Database**: one Neon Postgres project ("Digital Library"), used for
  **both local dev and production** — there is no separate prod database.
  An admin credential already exists in this database (created via the
  in-app "Change Login" flow), so `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH` env
  vars are bootstrap-only and won't be re-read — see README for why.
- **Local `.env`**: has real credentials, is gitignored, never committed. If
  you need its values and can't find/read it, ask the user rather than
  guessing — don't regenerate `SESSION_SECRET` or a password hash casually,
  since that would invalidate the existing admin session/login.
- **Responsive/mobile**: a full mobile layout pass is done (off-canvas
  sidebar drawer, compacted top bar, stacked list-view cards, full-width
  Goals panel on mobile). Verified at 375×812 and desktop widths.
- **Pagination/grid sizing**: the book grid's page size is derived from how
  many columns actually render at the current viewport width (via
  `ResizeObserver` + reading the resolved `grid-template-columns`), targeting
  4 full rows with the last row one short — except on narrow/mobile layouts
  (≤3 columns), which get a flat 27-per-page instead, since "4 rows fit on
  screen" isn't a meaningful constraint on a phone that scrolls anyway.
  Pagination controls are pinned to the bottom of the content area (not just
  following the last row) and always show exactly 3 consecutive page numbers
  centered on the current page. See `src/app/page.tsx` and
  `src/components/Pagination.tsx`.
- **Visual design**: matches
  `design-reference/Digital Library Standalone.html` (an earlier static
  prototype) as closely as possible for desktop — that file is the visual
  source of truth if a styling question comes up. Real computed styles
  (colors, font sizes, spacing) were measured from it directly rather than
  eyeballed. Pagination bar intentionally has **no** background color
  (transparent, blends with the page) — this was tried once with a white
  background and explicitly reverted, don't reintroduce it.

## How to work on this safely

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before making changes — it covers
the branch+PR+Vercel-preview workflow, rollback steps, and things to never
touch casually (migrations, force-push, hand-editing `.env`).

## Known gotchas worth remembering

- Next.js's local `.env` loader treats `$word` as a variable reference and
  will silently mangle bcrypt hashes (which are full of `$`-delimited
  segments) unless every `$` is escaped as `\$` in the local `.env` file.
  Full explanation in `README.md` under "Generate a bootstrap admin
  credential."
- **Scrollbar-width feedback loop**: a scrollable container whose content
  amount varies (e.g. a paginated grid where the last page has fewer items)
  can gain/lose a scrollbar, which changes its available width, which can
  change a column-count measurement based on that width — creating
  instability. Fixed via `scrollbar-gutter: stable` on the scroll container
  in `page.tsx`. Keep this in mind before adding similar width-dependent
  measurements elsewhere.
- **Stale-response race conditions**: any time page size/filters can change
  faster than a fetch resolves (e.g. during the grid column measurement
  settling), out-of-order network responses can overwrite newer state with
  older data. `fetchBooks` in `page.tsx` guards against this with a
  `fetchIdRef` counter that ignores responses superseded by a newer request
  — follow the same pattern for any other rapid-fire fetch added later.

## Preview-tool notes (not project-specific, just a session quirk)

The browser preview tool available to Claude in this environment has been
unreliable for coordinate-based clicks in this session — screenshots
sometimes render at inconsistent scales, and `computer` clicks at
seemingly-correct coordinates (matching a fresh `getBoundingClientRect()`
reading) have silently missed their target. The reliable fallback that
consistently worked: use `javascript_tool` to query the DOM directly and
call `.click()` on the actual element (or use `read_page` + element refs
rather than raw x/y coordinates). Prefer that approach for verification
over trusting coordinate-based clicks.
