"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAdmin } from "@/lib/AdminContext";
import type { BookDTO, BooksResponse, Facets } from "@/lib/types";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import ContentHeader from "@/components/ContentHeader";
import BookCard from "@/components/BookCard";
import BookListRow from "@/components/BookListRow";
import BookListHeader from "@/components/BookListHeader";
import Pagination from "@/components/Pagination";
import BookDetailModal from "@/components/BookDetailModal";
import BookFormModal from "@/components/BookFormModal";
import ImportCsvModal from "@/components/ImportCsvModal";
import LoginModal from "@/components/LoginModal";
import ChangeCredentialsModal from "@/components/ChangeCredentialsModal";
import GoalsPanel from "@/components/goals/GoalsPanel";

const EMPTY_FACETS: Facets = { status: [], genre: [], rating: [] };
const LIST_PAGE_SIZE = 27;

export default function Home() {
  const { isAdmin } = useAdmin();

  const [filters, setFilters] = useState({ status: "ALL", genre: "ALL", rating: "ALL" });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"grid" | "list">("grid");

  const [data, setData] = useState<BooksResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedBook, setSelectedBook] = useState<BookDTO | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formBook, setFormBook] = useState<BookDTO | undefined>(undefined);
  const [showImport, setShowImport] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Grid page size is derived from however many columns the CSS grid
  // actually renders at the current viewport width/zoom: 4 full rows, with
  // the 4th row intentionally one short (an empty trailing cell) rather than
  // a hard-coded book count.
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridColumns, setGridColumns] = useState(7);

  useEffect(() => {
    if (view !== "grid") return;
    const el = gridRef.current;
    if (!el) return;

    let debounceTimer: ReturnType<typeof setTimeout>;

    function measure() {
      if (!el) return;
      const cols = getComputedStyle(el)
        .gridTemplateColumns.trim()
        .split(" ")
        .filter(Boolean).length;
      if (cols > 0) setGridColumns((prev) => (prev === cols ? prev : cols));
    }

    function scheduleMeasure() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(measure, 200);
    }

    measure();
    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(el);
    return () => {
      clearTimeout(debounceTimer);
      ro.disconnect();
    };
  }, [view]);

  // Below ~4 columns the grid is a narrow/mobile layout that always scrolls
  // anyway, so "4 rows fit on screen" isn't a meaningful constraint there —
  // use a generous fixed page size instead of a tiny column-derived one.
  const isNarrowGrid = gridColumns <= 3;
  const pageSize =
    view === "grid"
      ? isNarrowGrid
        ? LIST_PAGE_SIZE
        : Math.max(gridColumns * 4 - 1, gridColumns)
      : LIST_PAGE_SIZE;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [filters, debouncedSearch, sort, pageSize]);

  // Guards against out-of-order responses: pageSize can change rapidly while
  // the grid column measurement settles (e.g. during a resize), firing
  // several overlapping requests. Without this, an older, slower response
  // could resolve after a newer one and overwrite it with stale data.
  const fetchIdRef = useRef(0);

  const fetchBooks = useCallback(async () => {
    const requestId = ++fetchIdRef.current;
    setLoading(true);
    const params = new URLSearchParams({
      status: filters.status,
      genre: filters.genre,
      sort,
      page: String(page),
      pageSize: String(pageSize),
    });
    if (filters.rating !== "ALL") params.set("rating", filters.rating);
    if (debouncedSearch) params.set("search", debouncedSearch);

    const res = await fetch(`/api/books?${params.toString()}`);
    if (requestId !== fetchIdRef.current) return; // superseded by a newer request

    if (res.ok) {
      setData(await res.json());
    }
    setLoading(false);
  }, [filters, sort, page, debouncedSearch, pageSize]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this book? This cannot be undone.")) return;
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    setSelectedBook(null);
    fetchBooks();
  }

  const books = data?.books ?? [];
  const facets = data?.facets ?? EMPTY_FACETS;
  const genreOptions = facets.genre.map((g) => g.value);
  const isEmpty = !loading && books.length === 0;

  // Cumulative count shown so far (all full pages before this one, at the
  // pageSize actually used for this response, plus however many landed on
  // the current page) rather than just this page's count — accurate even
  // though pageSize varies with viewport/zoom, since changing pageSize
  // always resets to page 1 first (see the effect above).
  const shownCount = data
    ? Math.min((data.page - 1) * data.pageSize + books.length, data.total)
    : 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar
        view={view}
        onViewChange={setView}
        onOpenLogin={() => setShowLogin(true)}
        onOpenAdd={() => {
          setFormBook(undefined);
          setShowForm(true);
        }}
        onOpenImport={() => setShowImport(true)}
        onOpenAccount={() => setShowAccount(true)}
        onOpenSidebar={() => setSidebarOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          facets={facets}
          filters={filters}
          onChange={(next) => setFilters((f) => ({ ...f, ...next }))}
          onOpenGoals={() => setShowGoals(true)}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex flex-1 flex-col overflow-hidden">
          <ContentHeader
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            shown={shownCount}
            total={data?.total ?? 0}
          />

          <div className="flex-1 overflow-y-auto" style={{ scrollbarGutter: "stable" }}>
            <div className="flex min-h-full flex-col">
              {view === "grid" ? (
                <div
                  ref={gridRef}
                  className="grid flex-1 p-3 sm:p-6"
                  style={{
                    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: "16px",
                    alignContent: "start",
                  }}
                >
                  {loading && books.length === 0 ? (
                    <p className="col-span-full text-sm text-muted">Loading…</p>
                  ) : isEmpty ? (
                    <p className="col-span-full text-sm text-muted">
                      No books match these filters yet.
                      {isAdmin && " Add one, or import a CSV, using the buttons above."}
                    </p>
                  ) : (
                    books.map((book) => (
                      <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
                    ))
                  )}
                </div>
              ) : loading && books.length === 0 ? (
                <p className="flex-1 p-6 text-sm text-muted">Loading…</p>
              ) : isEmpty ? (
                <p className="flex-1 p-6 text-sm text-muted">
                  No books match these filters yet.
                  {isAdmin && " Add one, or import a CSV, using the buttons above."}
                </p>
              ) : (
                <div className="flex-1">
                  <BookListHeader />
                  {books.map((book) => (
                    <BookListRow key={book.id} book={book} onClick={() => setSelectedBook(book)} />
                  ))}
                </div>
              )}

              <Pagination
                page={data?.page ?? 1}
                pageSize={data?.pageSize ?? pageSize}
                total={data?.total ?? 0}
                onPageChange={setPage}
              />
            </div>
          </div>
        </main>
      </div>

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onEdit={() => {
            setFormBook(selectedBook);
            setShowForm(true);
            setSelectedBook(null);
          }}
          onDelete={() => handleDelete(selectedBook.id)}
        />
      )}

      {showForm && (
        <BookFormModal
          book={formBook}
          genreOptions={genreOptions}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            fetchBooks();
          }}
        />
      )}

      {showImport && (
        <ImportCsvModal
          onClose={() => setShowImport(false)}
          onImported={fetchBooks}
        />
      )}

      {showGoals && <GoalsPanel onClose={() => setShowGoals(false)} />}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {showAccount && <ChangeCredentialsModal onClose={() => setShowAccount(false)} />}
    </div>
  );
}
