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
    <div className="flex items-center gap-3 border-b border-border px-6 py-3">
      <div className="flex max-w-sm flex-1 items-center gap-2 rounded-md border border-border bg-panel px-3 py-2">
        <span className="text-muted">🔍</span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search title, author, genre…"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
      <span className="text-sm text-muted">
        {shown} of {total}
      </span>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="ml-auto rounded-md border border-border bg-panel px-3 py-2 text-sm"
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
