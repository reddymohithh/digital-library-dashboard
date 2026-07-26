"use client";

import { BOOK_LIST_GRID_COLS, ratingStars, STATUS_BADGE_COLORS, STATUS_LABELS } from "@/lib/books";
import type { BookDTO } from "@/lib/types";

export default function BookListRow({
  book,
  onClick,
}: {
  book: BookDTO;
  onClick: () => void;
}) {
  const cover = (
    <div className="relative h-11 w-8 shrink-0 overflow-hidden rounded-sm border border-border">
      {book.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
      ) : (
        <div className="cover-placeholder h-full w-full" />
      )}
    </div>
  );

  const statusBadge = (
    <span
      className="w-fit rounded-full text-[10px] font-bold text-white"
      style={{ padding: "3px 9px", background: STATUS_BADGE_COLORS[book.status] }}
    >
      {STATUS_LABELS[book.status]}
    </span>
  );

  return (
    <button onClick={onClick} className="block w-full border-b border-border text-left hover:bg-panel-muted">
      {/* Mobile: stacked card layout */}
      <div className="flex gap-3 px-3 py-3 md:hidden">
        <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-sm border border-border">
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
          ) : (
            <div className="cover-placeholder h-full w-full" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-serif-heading truncate text-[13px] font-bold text-foreground">
            {book.title}
          </div>
          <div className="truncate text-[12px] text-muted">{book.author}</div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            {statusBadge}
            {book.genre && <span className="text-[11px] text-muted">{book.genre}</span>}
            <span className="text-[11px] text-accent-gold" style={{ letterSpacing: "0.02em" }}>
              {ratingStars(book.rating)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop: column-aligned grid layout */}
      <div className={`hidden ${BOOK_LIST_GRID_COLS} items-center gap-4 px-6 py-2.5 md:grid`}>
        {cover}
        <div className="font-serif-heading min-w-0 truncate text-[13px] font-bold text-foreground">
          {book.title}
        </div>
        <div className="min-w-0 truncate text-[13px] text-muted">{book.author}</div>
        <div className="min-w-0 truncate text-[13px] text-muted">{book.genre ?? "—"}</div>
        <div>{statusBadge}</div>
        <div className="text-[13px] text-accent-gold" style={{ letterSpacing: "0.02em" }}>
          {ratingStars(book.rating)}
        </div>
      </div>
    </button>
  );
}
