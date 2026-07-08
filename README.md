# Digital Library Dashboard

A personal reading tracker — browse your library, track reading goals, and log daily
reading progress. Built as a self-contained single-page app (React + Babel Standalone,
loaded from CDN at runtime — no build step).

## Files

- `index.html` — the deployed app. This is what Vercel serves.
- `Digital Library Standalone.html` — identical copy, kept as the original source export.
- `Digital Library Dashboard 4.zip` — the editable design-tool source project.
- `Digital Library - Chat Log.md` — design history / feature log from the original build.

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. In the [Vercel dashboard](https://vercel.com/new), import that repo.
3. Framework preset: choose **Other** (it's a static file, no build command / output
   directory needed — Vercel serves `index.html` automatically).
4. Deploy. No environment variables are required.

## Admin login

Default credentials: `admin` / `booklover`.

To change them, open the deployed site, sign in, then in the browser console run:

```js
localStorage.setItem('dl_cu', 'your-username');
localStorage.setItem('dl_cp', 'your-new-password');
```

## Important: how data & login actually work

This app has **no backend** — everything (books, goals, daily log, and the admin
session) lives in `localStorage`, entirely inside one browser:

- **Data doesn't sync across devices or visitors.** Books you add on your laptop
  only exist in your laptop's browser. Anyone else visiting the deployed URL sees
  the original seed data in their own browser, not your edits.
- **The admin login is a client-side gate, not real access control.** The
  username/password check and the "only admin can edit" restriction run entirely
  in the page's own JavaScript. A visitor who opens dev tools can read the
  credentials from the page source, or simply run
  `localStorage.setItem('dl_admin', '1')` to unlock admin controls without ever
  knowing the password.

This is fine for a personal/offline use case or a portfolio demo where you're the
only one actually entering data. It does **not** provide real viewer/editor
separation for a multi-user or public-write scenario — that would require a real
backend (database + server-verified auth), which this build intentionally doesn't
have.

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
