"use client";

import { BOOK_LIST_GRID_COLS } from "@/lib/books";

export default function BookListHeader() {
  return (
    <div
      className={`sticky top-0 z-10 grid ${BOOK_LIST_GRID_COLS} items-center gap-4 border-b border-border bg-panel-muted px-2 py-3 text-xs font-bold uppercase tracking-wide text-muted`}
    >
      <span />
      <span>Title</span>
      <span>Author</span>
      <span>Genre</span>
      <span>Status</span>
      <span>Rating</span>
    </div>
  );
}
