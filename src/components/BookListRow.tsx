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
  return (
    <button
      onClick={onClick}
      className={`grid w-full ${BOOK_LIST_GRID_COLS} items-center gap-4 border-b border-border px-6 py-2.5 text-left hover:bg-panel-muted`}
    >
      <div className="relative h-11 w-8 shrink-0 overflow-hidden rounded-sm border border-border">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
        ) : (
          <div className="cover-placeholder h-full w-full" />
        )}
      </div>
      <div className="font-serif-heading min-w-0 truncate text-[13px] font-bold text-foreground">
        {book.title}
      </div>
      <div className="min-w-0 truncate text-[13px] text-muted">{book.author}</div>
      <div className="min-w-0 truncate text-[13px] text-muted">{book.genre ?? "—"}</div>
      <div>
        <span
          className="w-fit rounded-full text-[10px] font-bold text-white"
          style={{ padding: "3px 9px", background: STATUS_BADGE_COLORS[book.status] }}
        >
          {STATUS_LABELS[book.status]}
        </span>
      </div>
      <div className="text-[13px] text-accent-gold" style={{ letterSpacing: "0.02em" }}>
        {ratingStars(book.rating)}
      </div>
    </button>
  );
}
