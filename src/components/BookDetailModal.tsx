"use client";

import { FORMAT_LABELS, ratingStars, STATUS_BADGE_COLORS, STATUS_LABELS } from "@/lib/books";
import type { BookDTO } from "@/lib/types";
import { useAdmin } from "@/lib/AdminContext";

export default function BookDetailModal({
  book,
  onClose,
  onEdit,
  onDelete,
}: {
  book: BookDTO;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { isAdmin } = useAdmin();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-[14px] bg-panel-muted shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 rounded-t-[14px] border-b border-border bg-panel p-5">
          <div className="h-[105px] w-[70px] shrink-0 overflow-hidden rounded-[5px] border border-border">
            {book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
            ) : (
              <div className="cover-placeholder h-full w-full" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className="rounded-full text-[10px] font-bold text-white"
                style={{ padding: "3px 9px", background: STATUS_BADGE_COLORS[book.status] }}
              >
                {STATUS_LABELS[book.status]}
              </span>
              <span className="text-[13px] text-muted">{FORMAT_LABELS[book.format]}</span>
            </div>
            <h2 className="font-serif-heading mt-1.5 text-[19px] font-bold leading-tight text-foreground">
              {book.title}
            </h2>
            <p className="text-[13px] text-muted">{book.author}</p>
            <p className="text-[13px] text-accent-gold" style={{ letterSpacing: "0.02em" }}>
              {ratingStars(book.rating)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base text-muted hover:bg-panel-muted"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-x-5 gap-y-3">
            <Field label="Genre" value={book.genre || "—"} />
            <Field label="Year Published" value={book.yearPublished?.toString() || "—"} />
            <Field label="Pages" value={book.pages?.toString() || "—"} />
            <Field label="Source" value={book.source || "—"} />
            <Field label="Date Started" value={book.dateStarted?.slice(0, 10) || "—"} />
            <Field label="Date Finished" value={book.dateFinished?.slice(0, 10) || "—"} />
          </div>

          {book.description && (
            <div>
              <SectionLabel>Description</SectionLabel>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground">
                {book.description}
              </p>
            </div>
          )}

          {book.notes && (
            <div>
              <SectionLabel>My Notes</SectionLabel>
              <p className="mt-1 border-l-2 border-amber-400 bg-amber-50 p-3 text-[13px] leading-relaxed">
                {book.notes}
              </p>
            </div>
          )}

          {isAdmin && (
            <div className="flex gap-2 border-t border-border pt-4">
              <button
                onClick={onEdit}
                className="rounded-[7px] bg-wood px-4 py-[9px] text-[13px] font-bold text-white hover:opacity-90"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="rounded-[7px] border border-accent-red px-4 py-[9px] text-[13px] font-bold text-accent-red hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10px] font-bold uppercase text-muted-light"
      style={{ letterSpacing: "0.08em" }}
    >
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-0.5 text-[13px] text-foreground">{value}</div>
    </div>
  );
}
