"use client";

import { useEffect, useRef, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-panel px-6">
      <span
        className="font-serif-heading whitespace-nowrap text-[21px] font-bold text-foreground"
        style={{ letterSpacing: "-0.02em" }}
      >
        📚 My Library
      </span>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => onViewChange("grid")}
          aria-label="Grid view"
          className={`flex h-8 w-8 items-center justify-center rounded-md border text-[15px] ${
            view === "grid"
              ? "border-border-soft bg-wood text-white"
              : "border-border-soft bg-panel-muted text-wood"
          }`}
        >
          ⊞
        </button>
        <button
          onClick={() => onViewChange("list")}
          aria-label="List view"
          className={`flex h-8 w-8 items-center justify-center rounded-md border text-[15px] ${
            view === "list"
              ? "border-border-soft bg-wood text-white"
              : "border-border-soft bg-panel-muted text-wood"
          }`}
        >
          ☰
        </button>

        {isAdmin && (
          <>
            <button
              onClick={onOpenImport}
              className="rounded-md border border-border-soft bg-panel-soft px-3.5 py-[7px] text-[13px] text-muted-dark hover:bg-panel-muted"
            >
              ↑ Import CSV
            </button>
            <button
              onClick={onOpenAdd}
              className="rounded-md bg-wood px-3.5 py-[7px] text-[13px] font-bold text-white hover:opacity-90"
            >
              + Add Book
            </button>
          </>
        )}

        {isAdmin ? (
          <div className="relative pl-2" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-md border border-border-soft bg-panel-soft px-3 py-1.5 text-[12px] font-bold text-wood hover:bg-panel-muted"
            >
              ● Admin <span className="text-xs text-muted">▾</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-md border border-border bg-panel shadow-lg">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenAccount();
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-foreground/80 hover:bg-panel-muted"
                >
                  Change Login
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-foreground/80 hover:bg-panel-muted"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            aria-label="Admin login"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-md border border-border bg-panel-soft text-sm text-muted-light"
          >
            🔐
          </button>
        )}
      </div>
    </div>
  );
}

export { SORT_OPTIONS };
