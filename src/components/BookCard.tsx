"use client";

import { FORMAT_ICONS, ratingStars, STATUS_BADGE_COLORS, STATUS_LABELS } from "@/lib/books";
import type { BookDTO } from "@/lib/types";

export default function BookCard({
  book,
  onClick,
}: {
  book: BookDTO;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col gap-2 text-left">
      <div
        className="cover-placeholder relative aspect-2/3 w-full overflow-hidden rounded-[5px]"
        style={{
          boxShadow: "2px 4px 10px rgba(44,30,16,0.15), 0 0 0 1px rgba(0,0,0,0.06) inset",
          backgroundImage: book.coverUrl ? "none" : undefined,
        }}
      >
        {book.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        )}
        <span
          className="absolute bottom-[7px] left-[7px] rounded text-[11px] font-bold text-white"
          style={{ background: "rgba(0,0,0,0.52)", padding: "2px 7px", borderRadius: 4 }}
        >
          {FORMAT_ICONS[book.format]}
        </span>
      </div>
      <div
        className="font-serif-heading text-[13px] font-bold leading-[1.3] text-foreground line-clamp-2"
      >
        {book.title}
      </div>
      <div className="truncate text-[12px] text-muted">{book.author}</div>
      <div className="text-[13px] text-accent-gold" style={{ letterSpacing: "0.02em" }}>
        {ratingStars(book.rating)}
      </div>
      <span
        className="w-fit rounded-full text-[10px] font-bold text-white"
        style={{ padding: "3px 9px", background: STATUS_BADGE_COLORS[book.status] }}
      >
        {STATUS_LABELS[book.status]}
      </span>
    </button>
  );
}
