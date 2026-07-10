"use client";

import { FORMAT_ICONS, ratingStars, STATUS_LABELS } from "@/lib/books";
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
      className="flex w-full items-center gap-4 border-b border-border px-2 py-3 text-left hover:bg-panel-muted"
    >
      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-sm border border-border">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
        ) : (
          <div className="cover-placeholder h-full w-full" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold">{book.title}</div>
        <div className="truncate text-xs text-muted">{book.author}</div>
      </div>
      <div className="w-24 shrink-0 text-xs text-muted">{book.genre ?? "—"}</div>
      <div className="w-20 shrink-0 text-xs text-amber-600">{ratingStars(book.rating)}</div>
      <div className="w-8 shrink-0 text-center">{FORMAT_ICONS[book.format]}</div>
      <span
        className={`w-fit shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
          isFinished ? "bg-wood-dark text-white" : "border border-border text-muted"
        }`}
      >
        {STATUS_LABELS[book.status]}
      </span>
    </button>
  );
}
