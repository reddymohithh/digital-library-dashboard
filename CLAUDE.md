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
  imported their real library via CSV (76 books as of this writing) — this is
  not just a demo anymore, treat existing data as real and don't touch it
  destructively.
- **GitHub**: `https://github.com/reddymohithh/digital-library-dashboard`,
  branch `main`. Vercel auto-deploys on every push to `main` — there is no
  separate staging environment by default (see `CONTRIBUTING.md` for the
  safer branch+PR+preview pattern for non-trivial changes).
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
- **Visual design**: matches
  `design-reference/Digital Library Standalone.html` (an earlier static
  prototype) as closely as possible for desktop — that file is the visual
  source of truth if a styling question comes up. Real computed styles
  (colors, font sizes, spacing) were measured from it directly rather than
  eyeballed.

## How to work on this safely

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before making changes — it covers
the branch+PR+Vercel-preview workflow, rollback steps, and things to never
touch casually (migrations, force-push, hand-editing `.env`).

## Known gotcha worth remembering

Next.js's local `.env` loader treats `$word` as a variable reference and
will silently mangle bcrypt hashes (which are full of `$`-delimited
segments) unless every `$` is escaped as `\$` in the local `.env` file. This
already bit us once. Full explanation in `README.md` under "Generate a
bootstrap admin credential."

## Preview-tool notes (not project-specific, just a session quirk)

The browser preview tool available to Claude in this environment has
occasionally returned screenshots at inconsistent scales (e.g. 375×812 vs
750×1624) within the same session, which threw off coordinate-based clicks.
When browser automation seems to click the wrong element, prefer `read_page`
+ element refs over raw coordinates, or just re-read the page and retry.
