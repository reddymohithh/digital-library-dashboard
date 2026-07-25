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

## Current status (last updated 2026-07-25)

- **Code**: fully built — Next.js (App Router) + TypeScript, Tailwind, Prisma
  + Postgres (Neon), custom session auth. Visual design matches
  `design-reference/Digital Library Standalone.html` (an earlier static
  prototype) as closely as possible — that file is the visual source of
  truth if a styling question comes up.
- **GitHub**: pushed to `https://github.com/reddymohithh/digital-library-dashboard`
  (branch `main`). Local `origin` remote is already configured.
- **Database**: one Neon Postgres project ("Digital Library"), used for
  **both local dev and production** — there is no separate prod database.
  Migrations already applied. An admin credential already exists in this
  database (created via the in-app "Change Login" flow during testing), so
  the `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH` env vars are bootstrap-only and
  won't be re-read — see the README section on this for why.
- **Vercel**: import was in progress as of the last session (env vars being
  entered on the Configure Project screen). Confirm with the user whether
  deploy finished and get the live URL — update this section once known.
- **Local `.env`**: has real credentials, is gitignored, never committed.
  If you need its values and can't find/read it, ask the user rather than
  guessing — don't regenerate a new `SESSION_SECRET` or password hash
  casually, since that would invalidate the existing admin session/login.

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
