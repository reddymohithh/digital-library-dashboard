"use client";

import { BOOK_LIST_GRID_COLS, ratingStars, STATUS_LABELS } from "@/lib/books";
import type { BookDTO } from "@/lib/types";

export default function BookListRow({
  book,
  onClick,
}: {
  book: BookDTO;
  onClick: () => void;
}) {
  const isFinished = book.status === "FINISHED";

  return (
    <button
      onClick={onClick}
      className={`grid w-full ${BOOK_LIST_GRID_COLS} items-center gap-4 border-b border-border px-2 py-2.5 text-left hover:bg-panel-muted`}
    >
      <div className="relative h-11 w-8 shrink-0 overflow-hidden rounded-sm border border-border">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
        ) : (
          <div className="cover-placeholder h-full w-full" />
        )}
      </div>
      <div className="min-w-0 truncate text-sm font-bold">{book.title}</div>
      <div className="min-w-0 truncate text-sm text-muted">{book.author}</div>
      <div className="min-w-0 truncate text-sm text-muted">{book.genre ?? "—"}</div>
      <div>
        <span
          className={`w-fit rounded-full px-2 py-0.5 text-[11px] ${
            isFinished ? "bg-wood-dark text-white" : "border border-border text-muted"
          }`}
        >
          {STATUS_LABELS[book.status]}
        </span>
      </div>
      <div className="text-sm text-amber-600">{ratingStars(book.rating)}</div>
      <div className="text-sm text-muted">{book.pages ?? "—"}</div>
    </button>
  );
}
