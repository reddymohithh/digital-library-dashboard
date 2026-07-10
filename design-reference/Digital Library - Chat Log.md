# Digital Library Dashboard — Design Chat Log

**Project:** Digital Library Dashboard  
**Tool:** Claude Design  
**Date:** July 7, 2026

---

## 1. Initial Brief

> "I am an avid reader. I read both fiction and non fiction. I want to build a dashboard to track the status of each book, see what it is about, find the relevant book, and do more. I just want to build a digital library."

---

## 2. Discovery Questions & Answers

| Question | Answer |
|---|---|
| How do you want to browse your library? | Shelf view, Grid of book covers, List / table view |
| Which reading statuses do you track? | Want to Read, Currently Reading, Finished, DNF, Re-reading, On Hold |
| What info do you want to store per book? | Cover image, Genre / tags, Rating (stars), Personal notes / review, Date started / finished, Page count / progress, Author & year |
| Any discovery or search features? | Filter by genre, Filter by status, Full-text search, Sort by rating / date / title |
| Roughly how many books in your library? | ~200 |
| How would you add books? | Import from CSV / Goodreads export |
| What visual vibe feels right? | Cozy & warm (wood tones, serif fonts) |
| Any reference apps? | None — something unique, clean, easy to browse, attractive |

---

## 3. Wireframe Exploration (Turn 1)

Four layout directions were presented side by side:

### 1a — Visual Bookshelf
Browse like a physical library. Books shown as colored spines standing on wooden shelves. Click a spine → detail panel slides in from the right. Hover shows cover thumbnail popup. Three rows of books with shelf planks between them.

### 1b — Sidebar + Cover Grid ✅ *(chosen)*
Left sidebar with status and genre filters + counts. Main area with book cover grid. Each card shows cover placeholder, title, author, star rating, and status badge. Top bar with search, sort, and admin controls.

### 1c — Reading Dashboard
Stats row at top (Currently Reading count, Want to Read, Finished All Time, Read This Year). Currently Reading section with progress bars. Filtered cover grid below with quick genre chips.

### 1d — Status Swimlanes
Horizontal rows per status (Currently Reading, Want to Read, Finished, On Hold). Each row shows book cards with progress bars or star ratings. Collapsible "All →" links per row.

**User chose: 1b**

---

## 4. Full Hi-Fi Build

### Layout System
- **Fonts:** Playfair Display (headings/titles) + Lato (body/UI)
- **Palette:** Warm cream background `#faf7f2`, wood brown accent `#7c5535`, muted neutrals
- **Left sidebar:** 224px fixed, `#f5efe5`
- **Top bar:** 56px fixed, white, shadow

### Features Built

#### Viewer (No Login)
- Browse books in **grid** or **list** view
- Filter by **status** (All, Reading, Want to Read, Finished, Re-reading, On Hold, DNF)
- Filter by **genre** (auto-generated from book data)
- Filter by **star rating** (★★★★★ through ☆☆☆☆☆ / Unrated)
- **Search** by title, author, or genre
- **Sort** by: Recently Added, Title A–Z, Author A–Z, Highest Rated, Date Finished, Format, Source
- Click any book → **full detail modal** (title, author, genre, year, pages, source, dates, description, notes)
- **Pagination** — 27 books per page with « ‹ 1 2 3 › » controls

#### Admin (Login Required)
- **Login modal** — username: `admin`, password: `booklover` (stored in localStorage)
- **Add Book** button (top bar, admin only)
- **Import CSV** button (top bar, admin only)
- **Edit / Delete** books from detail modal
- **Edit Reading Goals**
- **Log daily reading check-in** (Met / Partial / Missed)

#### Reading Goals Panel (sidebar button, slides in from right)
- Set yearly book target, daily page goal, optional target genre
- **Donut chart** — books finished this year vs. goal (percentage)
- **Daily check-in** — Met Goal / Partial / Missed (admin only)
- **Monthly calendar** — color-coded circles: 🟢 Met · 🟠 Partial · 🔴 Missed
- **Year in Review** — books finished, genre breakdown, total pages tracked

#### Book Detail Modal
- Cover image (via URL, falls back to texture placeholder)
- Status badge + format badge (📖 Physical / 🎧 Audiobook / 📱 E-book)
- Star rating, author, genre, year published
- Pages, source, date started, date finished
- Description / synopsis
- Personal notes (highlighted in warm yellow)

#### Add / Edit Book Form
All fields: Title*, Author, Genre, Year Published, Pages, Status, Format, Rating, Date Started, Date Finished, Source, Cover Image URL, Description, Notes

#### CSV Import
**Required format:**
```
title,author,genre,year_published,pages,status,type,rating,dateStarted,dateFinished,description,notes,source
```
- `status`: `reading` | `want-to-read` | `finished` | `dnf` | `on-hold` | `re-reading`
- `type`: `physical` | `audiobook` | `ebook`
- `rating`: `0`–`5` (0 = unrated)
- Dates: `YYYY-MM-DD`
- Wrap fields containing commas in double quotes
- Only `title` is required

#### Data Persistence
All data stored in `localStorage`:
- `dl_books` — book library
- `dl_goals` — reading goals
- `dl_daily` — daily log entries
- `dl_admin` — admin session

---

## 5. Edits & Changes Log

### Round 1 — UI Restructure
1. Added **Rating filter** to sidebar (below Genre) — star rows with gold/white toggle
2. Added **E-book** as a third format option (📱) alongside Physical and Audiobook
3. Removed book count next to "All Books" in Status filter
4. Moved **Import CSV** and **Add Book** buttons to the top nav bar (admin only)
5. Moved **Reading Goals** button to the top of the sidebar as a slim button
6. Moved **Search bar** from top nav to the content header bar
7. Added **Format** and **Source** sort options to the sort dropdown

### Round 2 — Access Control
- **Today's Check-in** buttons (Met / Partial / Missed) made admin-only
- Removed "Login as admin to log today's reading" message from viewer view

### Round 3 — Empty Stars
- "Unrated" label in Rating sidebar replaced with ☆☆☆☆☆ empty stars

### Round 4 — Pagination
- Replaced infinite scroll with **pagination** — 27 books per page
- Controls: « (first) ‹ (prev) · numbered pages · › (next) » (last)
- Page resets to 1 on any filter, search, or sort change
- Pagination bar appears in both grid and list views

### Round 5 — Sticky Goals Button
- Reading Goals button pinned to the top of the sidebar (does not scroll with filters)
- Sidebar restructured: sticky header → separator → scrollable filter area

---

## 6. Sample Data (Pre-loaded)

| Title | Author | Genre | Status | Rating |
|---|---|---|---|---|
| Sapiens | Yuval Noah Harari | Non-Fiction | Finished | ★★★★★ |
| Educated | Tara Westover | Biography | Finished | ★★★★★ |
| Pachinko | Min Jin Lee | Fiction | Finished | ★★★★★ |
| Dune | Frank Herbert | Sci-Fi | Finished | ★★★★☆ |
| Foundation | Isaac Asimov | Sci-Fi | Finished | ★★★★☆ |
| The Brothers Karamazov | Fyodor Dostoevsky | Fiction | Reading | — |
| The Warmth of Other Suns | Isabel Wilkerson | History | Reading | — |
| Noise | Daniel Kahneman | Non-Fiction | Reading (audiobook) | — |
| Piranesi | Susanna Clarke | Fantasy | Want to Read | — |
| The Midnight Library | Matt Haig | Fiction | Want to Read | — |
| Never Let Me Go | Kazuo Ishiguro | Fiction | Want to Read | — |
| Infinite Jest | David Foster Wallace | Fiction | On Hold | — |

---

## 7. Final Deliverables

- **`Digital Library.dc.html`** — live editable design file
- **`Digital Library Standalone.html`** — self-contained offline HTML (~304KB)

---

## 8. Admin Credentials

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `booklover` |

*Credentials are stored in `localStorage` keys `dl_cu` and `dl_cp` and can be changed by setting those values directly.*
