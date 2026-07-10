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
    <aside className="flex w-[224px] shrink-0 flex-col bg-panel-muted border-r border-border">
      <div className="shrink-0 border-b border-border px-4 py-2.5">
        <button
          onClick={onOpenGoals}
          className="flex h-9 w-full items-center justify-center gap-1 rounded-md border border-border-soft bg-panel-soft text-[12px] font-bold uppercase tracking-wide text-wood shadow-sm hover:bg-panel"
        >
          🎯 Reading Goals
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3.5">
        <div className="mb-4">
          <SectionLabel>Status</SectionLabel>
          <div className="flex flex-col">
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

        <div className="mb-4">
          <SectionLabel>Genre</SectionLabel>
          <div className="flex flex-col">
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
          <SectionLabel>Rating</SectionLabel>
          <div className="flex flex-col">
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-[9px] text-[10px] font-bold uppercase text-muted-light"
      style={{ letterSpacing: "0.1em" }}
    >
      {children}
    </div>
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
      className={`mb-0.5 flex w-full items-center justify-between rounded-md px-2.5 py-[7px] text-left text-[13px] ${
        active ? "bg-wood font-bold text-white" : "bg-transparent text-muted-dark hover:bg-panel"
      }`}
    >
      <span>{label}</span>
      <span className={active ? "text-white/80" : "text-muted-light"}>{count}</span>
    </button>
  );
}
