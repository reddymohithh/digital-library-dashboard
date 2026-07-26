"use client";

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  // Always show exactly 3 consecutive page numbers, centered on the current
  // page and clamped to the valid range (e.g. page 1 -> [1,2,3], last page
  // -> [last-2,last-1,last]).
  let windowStart = page - 1;
  if (windowStart < 1) windowStart = 1;
  if (windowStart > totalPages - 2) windowStart = Math.max(1, totalPages - 2);
  const windowSize = Math.min(3, totalPages);
  const pages = Array.from({ length: windowSize }, (_, i) => windowStart + i);

  return (
    <div className="flex shrink-0 items-center justify-center gap-1 border-t border-border bg-panel px-6 py-3 text-sm">
      <PageButton disabled={page === 1} onClick={() => onPageChange(1)} label="«" />
      <PageButton disabled={page === 1} onClick={() => onPageChange(page - 1)} label="‹" />
      {pages.map((p) => (
        <PageButton key={p} active={p === page} onClick={() => onPageChange(p)} label={String(p)} />
      ))}
      <PageButton
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        label="›"
      />
      <PageButton
        disabled={page === totalPages}
        onClick={() => onPageChange(totalPages)}
        label="»"
      />
    </div>
  );
}

function PageButton({
  label,
  onClick,
  active,
  disabled,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-8 w-8 rounded-md ${
        active
          ? "bg-wood-dark text-white font-bold"
          : "text-foreground/70 hover:bg-panel-muted disabled:opacity-30"
      }`}
    >
      {label}
    </button>
  );
}
