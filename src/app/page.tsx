"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdmin } from "@/lib/AdminContext";
import type { BookDTO, BooksResponse, Facets } from "@/lib/types";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import ContentHeader from "@/components/ContentHeader";
import BookCard from "@/components/BookCard";
import BookListRow from "@/components/BookListRow";
import Pagination from "@/components/Pagination";
import BookDetailModal from "@/components/BookDetailModal";
import BookFormModal from "@/components/BookFormModal";
import ImportCsvModal from "@/components/ImportCsvModal";
import LoginModal from "@/components/LoginModal";
import GoalsPanel from "@/components/goals/GoalsPanel";

const EMPTY_FACETS: Facets = { status: [], genre: [], rating: [] };

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

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [filters, debouncedSearch, sort]);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      status: filters.status,
      genre: filters.genre,
      sort,
      page: String(page),
    });
    if (filters.rating !== "ALL") params.set("rating", filters.rating);
    if (debouncedSearch) params.set("search", debouncedSearch);

    const res = await fetch(`/api/books?${params.toString()}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [filters, sort, page, debouncedSearch]);

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

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar
        view={view}
        onViewChange={setView}
        onOpenLogin={() => setShowLogin(true)}
        onOpenAdd={() => {
          setFormBook(undefined);
          setShowForm(true);
        }}
        onOpenImport={() => setShowImport(true)}
      />

      <div className="flex flex-1">
        <Sidebar
          facets={facets}
          filters={filters}
          onChange={(next) => setFilters((f) => ({ ...f, ...next }))}
          onOpenGoals={() => setShowGoals(true)}
        />

        <main className="flex flex-1 flex-col">
          <ContentHeader
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            shown={books.length}
            total={data?.total ?? 0}
          />

          {loading && books.length === 0 ? (
            <p className="p-6 text-sm text-muted">Loading…</p>
          ) : books.length === 0 ? (
            <p className="p-6 text-sm text-muted">
              No books match these filters yet.
              {isAdmin && " Add one, or import a CSV, using the buttons above."}
            </p>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-5 p-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
              {books.map((book) => (
                <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
              ))}
            </div>
          ) : (
            <div className="px-6 py-2">
              {books.map((book) => (
                <BookListRow key={book.id} book={book} onClick={() => setSelectedBook(book)} />
              ))}
            </div>
          )}

          <div className="mt-auto">
            <Pagination
              page={data?.page ?? 1}
              pageSize={data?.pageSize ?? 27}
              total={data?.total ?? 0}
              onPageChange={setPage}
            />
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
    </div>
  );
}
