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
        className="h-9 cursor-pointer appearance-none rounded-md border border-border-soft bg-panel-soft py-0 pl-2.5 pr-7 text-[13px] text-muted-dark outline-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%237A6A58' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
        }}
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
