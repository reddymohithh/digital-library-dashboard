# Digital Library Dashboard

A personal reading tracker: browse a library, manage it (add/edit/import) as an
admin, and track yearly reading goals with a daily check-in, calendar, and
year-in-review stats. Built with Next.js, Prisma, and Postgres, deployed on
Vercel. See [`PRD.md`](PRD.md) for the full product spec.

## Stack

- Next.js 16 (App Router) + TypeScript, Tailwind CSS
- Postgres via [Neon](https://neon.tech), accessed through Prisma ORM
- Custom session auth (jose + bcryptjs) — no third-party auth provider, since
  there's a single hardcoded admin identity
- papaparse for CSV import

## One-time setup

Everything below is a one-time step to get the app running. After this,
every book, goal, and daily check-in is entered through the app itself — no
further terminal or database work is needed.

### 1. Create a free Neon Postgres database

1. Go to [neon.tech](https://neon.tech) and sign up (free tier is enough).
2. Create a new project.
3. From the project's connection details, copy **two** connection strings:
   - The **pooled** connection string (has `-pooler` in the hostname) → this
     becomes `DATABASE_URL`.
   - The **direct** connection string (no `-pooler`) → this becomes
     `DIRECT_URL`. Prisma needs the direct connection to run migrations.

### 2. Generate a bootstrap admin credential

`ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` are only used to create the admin
login **the first time anyone logs in against a given database** — the login
route checks whether an `AdminCredential` row already exists, and only reads
these env vars to create one if it doesn't. After that, the real credential
lives in the database, and you change it in-app (see "Change Login" below).

Because of this, if you're deploying to Vercel using the **same** database
you already used locally (the common case for a single-DB personal project),
the bootstrap row was already created during local testing — so these two env
vars won't actually be read again on Vercel, even though you still set them
there. Nothing to worry about; it just means your real login is whatever you
last set via "Change Login," not necessarily what's in these env vars.

Pick a starting username and password, then hash the password locally (never
commit the plain password anywhere):

```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 10))" "your-password-here"
```

Copy the printed hash — you'll paste it as `ADMIN_PASSWORD_HASH`.

> **If you're setting this in a local `.env` file**, escape every `$` in the
> hash as `\$` (e.g. `\$2b\$10\$abc...`). Next.js's `.env` loader treats
> `$word` as a variable reference and will silently strip parts of the hash
> otherwise, breaking login. This only applies to `.env` files — pasting the
> hash into the Vercel dashboard's environment variable UI does **not** need
> escaping.

Generate a random session secret too:

```bash
openssl rand -hex 32
```

### 3. Configure environment variables

Locally, copy `.env.example` to `.env` and fill in the four values from steps
1–2. On Vercel, add the same four variables under **Project Settings →
Environment Variables**:

- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `SESSION_SECRET`

### 4. Run the initial database migration

```bash
npm install
npx prisma migrate deploy
```

(Locally during development, use `npx prisma migrate dev` instead, which also
keeps your local Prisma Client in sync as the schema evolves.)

### 5. Deploy

Push this repo to GitHub, then import it in the
[Vercel dashboard](https://vercel.com/new). Vercel auto-detects Next.js — no
custom build settings needed as long as the environment variables from step 3
are set.

## Everyday usage (no terminal required)

- **Add a book**: sign in → "+ Add Book" → fill in the form → Save.
- **Import books**: sign in → "Import CSV" → download the template if you need
  it → upload your file → review the validation preview → confirm.
- **Edit or delete a book** (including ones brought in via CSV): open its
  detail view → Edit or Delete.
- **Set a reading goal**: open "Reading Goals" → Set Goal → enter your yearly
  books target, daily pages target, and (optional) target genre.
- **Daily check-in**: in the Reading Goals panel, mark Met / Partial / Missed
  each day. Partial counts as half credit toward the derived pages-read stat.
- **Change your login**: sign in → "Change Login" (next to Sign out) → enter
  your current password plus a new username/password. Takes effect
  immediately, no redeploy or env var edit needed.

Everything above is a normal admin login + clicking around the deployed site —
never a database console or a script.

## CSV import format

```
title,author,genre,year_published,pages,status,type,rating,dateStarted,dateFinished,description,notes,source
```

- `status`: `reading` | `want-to-read` | `finished` | `dnf` | `on-hold` | `re-reading`
- `type`: `physical` | `audiobook` | `ebook`
- `rating`: `0`–`5` (`0` = unrated)
- Dates: `YYYY-MM-DD`
- Wrap any field containing commas in double quotes
- Only `title` is required
- A downloadable template with these headers is available from the Import CSV
  screen in the app.

## Access control model

- The login screen shows no default/hint credentials — the only way in is
  knowing the real username and password.
- On successful login, the server sets a signed, httpOnly session cookie.
- Every write endpoint (`POST`/`PUT`/`DELETE` on books, goals, and daily logs)
  independently re-verifies that cookie server-side. Hiding the admin buttons
  in the UI for logged-out visitors is a convenience — the actual boundary is
  enforced on the server, so a viewer can't bypass it by inspecting the page
  or calling the API directly.

## Local development

```bash
npm install
npx prisma migrate dev
npm run dev
```
