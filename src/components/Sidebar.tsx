"use client";

import { STATUS_LABELS } from "@/lib/books";
import type { Facets } from "@/lib/types";
import type { Status } from "@prisma/client";

const STATUS_ORDER: Status[] = [
  "READING",
  "WANT_TO_READ",
  "FINISHED",
  "RE_READING",
  "ON_HOLD",
  "DNF",
];

type Filters = {
  status: string;
  genre: string;
  rating: string;
};

export default function Sidebar({
  facets,
  filters,
  onChange,
  onOpenGoals,
}: {
  facets: Facets;
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
  onOpenGoals: () => void;
}) {
  const totalBooks = facets.status.reduce((sum, s) => sum + s.count, 0);
  const statusCounts = new Map(facets.status.map((s) => [s.value, s.count]));
  const genres = [...facets.genre].sort((a, b) => b.count - a.count);
  const ratings = [5, 4, 3, 2, 1, 0];
  const ratingCounts = new Map(facets.rating.map((r) => [r.value, r.count]));

  return (
    <aside className="flex w-[224px] shrink-0 flex-col border-r border-border bg-panel-muted">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
        <button
          onClick={onOpenGoals}
          className="flex h-10 w-full items-center justify-center rounded-lg border border-wood/30 bg-panel text-sm font-bold uppercase tracking-wide text-wood-dark shadow-sm transition hover:bg-wood hover:text-white"
        >
          🎯 Reading Goals
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
        <div className="mb-6">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
            Status
          </div>
          <div className="flex flex-col gap-1">
            <FilterRow
              label="All Books"
              count={totalBooks}
              active={filters.status === "ALL"}
              onClick={() => onChange({ status: "ALL" })}
            />
            {STATUS_ORDER.map((status) => (
              <FilterRow
                key={status}
                label={STATUS_LABELS[status]}
                count={statusCounts.get(status) ?? 0}
                active={filters.status === status}
                onClick={() => onChange({ status })}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
            Genre
          </div>
          <div className="flex flex-col gap-1">
            <FilterRow
              label="All Genres"
              count={totalBooks}
              active={filters.genre === "ALL"}
              onClick={() => onChange({ genre: "ALL" })}
            />
            {genres.map((g) => (
              <FilterRow
                key={g.value}
                label={g.value}
                count={g.count}
                active={filters.genre === g.value}
                onClick={() => onChange({ genre: g.value })}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
            Rating
          </div>
          <div className="flex flex-col gap-1">
            <FilterRow
              label="All Ratings"
              count={totalBooks}
              active={filters.rating === "ALL"}
              onClick={() => onChange({ rating: "ALL" })}
            />
            {ratings.map((r) => (
              <FilterRow
                key={r}
                label={r === 0 ? "☆☆☆☆☆" : "★".repeat(r) + "☆".repeat(5 - r)}
                count={ratingCounts.get(r) ?? 0}
                active={filters.rating === String(r)}
                onClick={() => onChange({ rating: String(r) })}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function FilterRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between rounded-md px-3 py-1.5 text-left text-sm transition ${
        active ? "bg-wood-dark text-white font-bold" : "text-foreground/80 hover:bg-panel"
      }`}
    >
      <span>{label}</span>
      <span className={active ? "text-white/80" : "text-muted"}>{count}</span>
    </button>
  );
}
