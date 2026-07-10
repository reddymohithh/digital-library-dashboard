"use client";

import { useAdmin } from "@/lib/AdminContext";

const SORT_OPTIONS = [
  { value: "recent", label: "Recently Added" },
  { value: "title", label: "Title A–Z" },
  { value: "author", label: "Author A–Z" },
  { value: "rating", label: "Highest Rated" },
  { value: "dateFinished", label: "Date Finished" },
  { value: "format", label: "Format" },
  { value: "source", label: "Source" },
];

export default function TopBar({
  view,
  onViewChange,
  onOpenLogin,
  onOpenAdd,
  onOpenImport,
  onOpenAccount,
}: {
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
  onOpenLogin: () => void;
  onOpenAdd: () => void;
  onOpenImport: () => void;
  onOpenAccount: () => void;
}) {
  const { isAdmin, logout } = useAdmin();

  return (
    <div className="flex items-center gap-3 border-b border-wood-dark/80 bg-panel-muted px-6 py-3">
      <span className="font-serif-heading text-xl font-bold text-foreground">
        📚 My Library
      </span>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => onViewChange("grid")}
          aria-label="Grid view"
          className={`flex h-[34px] w-[34px] items-center justify-center rounded-md border text-sm ${
            view === "grid"
              ? "border-wood-dark bg-wood-dark text-white"
              : "border-border bg-panel text-foreground/70"
          }`}
        >
          ⊞
        </button>
        <button
          onClick={() => onViewChange("list")}
          aria-label="List view"
          className={`flex h-[34px] w-[34px] items-center justify-center rounded-md border text-sm ${
            view === "list"
              ? "border-wood-dark bg-wood-dark text-white"
              : "border-border bg-panel text-foreground/70"
          }`}
        >
          ☰
        </button>

        {isAdmin && (
          <>
            <button
              onClick={onOpenImport}
              className="rounded-md border border-border bg-panel px-3 py-1.5 text-sm font-medium text-foreground/80 hover:bg-panel-muted"
            >
              ↑ Import CSV
            </button>
            <button
              onClick={onOpenAdd}
              className="rounded-md bg-wood-dark px-3 py-1.5 text-sm font-bold text-white hover:bg-wood"
            >
              + Add Book
            </button>
          </>
        )}

        {isAdmin ? (
          <div className="flex items-center gap-2 pl-2">
            <span className="text-sm font-bold text-wood-dark">● Admin</span>
            <button
              onClick={onOpenAccount}
              className="text-sm text-muted hover:text-foreground"
            >
              Change Login
            </button>
            <button
              onClick={logout}
              className="text-sm text-muted hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            aria-label="Admin login"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-border bg-panel text-base"
          >
            🔐
          </button>
        )}
      </div>
    </div>
  );
}

export { SORT_OPTIONS };
