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

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2,
  );

  return (
    <div className="flex items-center justify-center gap-1 border-t border-border px-6 py-3 text-sm">
      <PageButton disabled={page === 1} onClick={() => onPageChange(1)} label="«" />
      <PageButton disabled={page === 1} onClick={() => onPageChange(page - 1)} label="‹" />
      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-muted">…</span>}
          <PageButton active={p === page} onClick={() => onPageChange(p)} label={String(p)} />
        </span>
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
