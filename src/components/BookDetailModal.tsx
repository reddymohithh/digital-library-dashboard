"use client";

import { FORMAT_LABELS, ratingStars, STATUS_LABELS } from "@/lib/books";
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
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-panel-muted shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 border-b border-border bg-panel p-6">
          <div className="h-30 w-20 shrink-0 overflow-hidden rounded-sm border border-border">
            {book.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
            ) : (
              <div className="cover-placeholder h-full w-full" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-accent-green px-2 py-0.5 font-bold text-white">
                {STATUS_LABELS[book.status]}
              </span>
              <span className="text-muted">{FORMAT_LABELS[book.format]}</span>
            </div>
            <h2 className="font-serif-heading mt-1 text-2xl font-bold">{book.title}</h2>
            <p className="text-muted">{book.author}</p>
            <p className="text-amber-600">{ratingStars(book.rating)}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel-muted text-lg"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Field label="Genre" value={book.genre || "—"} />
            <Field label="Year Published" value={book.yearPublished?.toString() || "—"} />
            <Field label="Pages" value={book.pages?.toString() || "—"} />
            <Field label="Source" value={book.source || "—"} />
            <Field label="Date Started" value={book.dateStarted?.slice(0, 10) || "—"} />
            <Field label="Date Finished" value={book.dateFinished?.slice(0, 10) || "—"} />
          </div>

          {book.description && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-muted">
                Description
              </div>
              <p className="mt-1 text-sm">{book.description}</p>
            </div>
          )}

          {book.notes && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-muted">
                My Notes
              </div>
              <p className="mt-1 border-l-2 border-amber-400 bg-amber-50 p-3 text-sm">
                {book.notes}
              </p>
            </div>
          )}

          {isAdmin && (
            <div className="flex gap-2 border-t border-border pt-4">
              <button
                onClick={onEdit}
                className="rounded-md bg-wood-dark px-4 py-2 text-sm font-bold text-white hover:bg-wood"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="rounded-md border border-accent-red px-4 py-2 text-sm font-bold text-accent-red hover:bg-red-50"
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-0.5 text-sm">{value}</div>
    </div>
  );
}
