"use client";

import { FORMAT_ICONS, ratingStars, STATUS_LABELS } from "@/lib/books";
import type { BookDTO } from "@/lib/types";

export default function BookCard({
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
      className="flex flex-col gap-1.5 text-left"
    >
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-sm border border-border">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="cover-placeholder h-full w-full" />
        )}
        <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-xs">
          {FORMAT_ICONS[book.format]}
        </span>
      </div>
      <div className="text-sm font-bold leading-tight text-foreground line-clamp-2">
        {book.title}
      </div>
      <div className="text-xs text-muted">{book.author}</div>
      <div className="text-xs text-amber-600">{ratingStars(book.rating)}</div>
      <span
        className={`w-fit rounded-full px-2 py-0.5 text-[11px] ${
          isFinished
            ? "bg-wood-dark text-white"
            : "border border-border text-muted"
        }`}
      >
        {STATUS_LABELS[book.status]}
      </span>
    </button>
  );
}
