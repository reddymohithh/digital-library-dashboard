# Working on this project later (even in a new chat)

This file is here so that if you come back to this project without the
original conversation history — a new Claude Code session, a different
machine, or just months later — you (or a fresh Claude instance) can pick up
safely without re-deriving all the context from scratch.

## Getting oriented

Point a new session at these, in order:

1. **`PRD.md`** — what this product is and why it exists.
2. **`README.md`** — the stack, one-time setup, and how every feature is meant
   to be used day-to-day.
3. **This file** — how to make changes safely.

A reasonable first message to Claude Code in a fresh session: *"Read PRD.md
and README.md, then help me [describe the change]."*

## How deploys actually work here

Vercel is connected to the `main` branch of the GitHub repo: **every push to
`main` deploys to the live production URL automatically.** There is no manual
"click deploy" step and no staging environment by default. Keep that in mind —
pushing to `main` is the same action as shipping to the site anyone can visit.

## Safer workflow for changes

For anything beyond a trivial tweak, don't push straight to `main`. Instead:

1. Ask Claude to make the change on a **new branch**
   (`git checkout -b some-change`), not directly on `main`.
2. Push that branch and open a pull request on GitHub instead of pushing to
   `main` directly.
3. Vercel automatically builds a **preview deployment** for every PR — a
   throwaway URL with the change live, separate from your real site. Check
   that preview URL yourself before merging.
4. Only merge the PR into `main` once the preview looks right. That merge is
   what triggers the real deploy.

This costs a couple extra minutes per change and means a bad change never
reaches your actual site before you've seen it working.

For truly small copy/text tweaks you're confident about, pushing directly to
`main` is fine — just know that's what you're doing.

## Rolling back a bad deploy

If something goes live and breaks:

- **Fastest fix**: Vercel dashboard → your project → **Deployments** → find
  the last good deployment → **"Promote to Production"** (or equivalent
  redeploy action). This is instant and doesn't require touching git.
- **Proper fix**: `git revert <bad-commit>` and push — this undoes the change
  in git history too, so the next deploy stays consistent with what's live.

## Things to never do casually

- **Don't hand-edit `.env` without re-reading the `$`-escaping note in
  README.md.** Bcrypt hashes contain `$` characters that Next.js's local
  `.env` loader treats as variable references — get this wrong and login
  breaks silently. (This only applies to local `.env` files, not the Vercel
  dashboard's env var UI.)
- **Don't delete or hand-edit files under `prisma/migrations/`.** If the data
  model needs to change, add a new migration (`npx prisma migrate dev --name
  describe_the_change`) rather than editing an applied one.
- **Don't run destructive Prisma/git commands** (`prisma migrate reset`,
  `git push --force`, `git reset --hard`) without being certain — they can
  wipe the production database or lose committed work. Ask for a second
  opinion first if unsure.
- **Don't put real secrets in chat or commit them to git.** `.env` is already
  gitignored; keep it that way. If a credential ever leaks (e.g. pasted
  somewhere it shouldn't have been), rotate it: new Neon password from the
  Neon dashboard, new `SESSION_SECRET` via `openssl rand -hex 32`, or just
  use "Change Login" in-app for the admin password.

## Where things live

- **Admin username/password**: in the database, changeable in-app via
  "Change Login" while signed in. Not in an env var after first login.
- **Database**: Neon dashboard (neon.tech) — connection strings, usage,
  backups/branching.
- **Env vars for production**: Vercel dashboard → Project Settings →
  Environment Variables.
- **Everything else** (books, goals, daily logs): only ever touched through
  the deployed app's own UI — never a database console.
