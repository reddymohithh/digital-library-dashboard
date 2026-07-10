"use client";

import { SORT_OPTIONS } from "./TopBar";

export default function ContentHeader({
  search,
  onSearchChange,
  sort,
  onSortChange,
  shown,
  total,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  shown: number;
  total: number;
}) {
  return (
    <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-6">
      <div className="flex h-10 max-w-sm flex-1 items-center gap-2 rounded-md border border-border bg-panel px-3">
        <span className="text-muted">🔍</span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search title, author, genre…"
          className="h-full w-full bg-transparent text-sm outline-none"
        />
      </div>
      <span className="text-sm text-muted">
        {shown} of {total}
      </span>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="ml-auto h-10 rounded-md border border-border bg-panel px-3 text-sm"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
