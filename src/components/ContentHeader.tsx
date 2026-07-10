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
    <div className="flex shrink-0 items-center gap-2.5 border-b border-border bg-panel px-6 py-2.5">
      <div className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-border-soft bg-panel-soft px-3">
        <span className="text-muted-light">🔍</span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search title, author, genre…"
          className="h-full w-full bg-transparent text-sm outline-none"
        />
      </div>
      <span className="whitespace-nowrap text-[13px] text-muted-light">
        {shown} of {total}
      </span>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-9 cursor-pointer rounded-md border border-border-soft bg-panel-soft px-2.5 text-[13px] text-muted-dark outline-none"
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
