"use client";

import { useState } from "react";
import Papa from "papaparse";
import { bookInputSchema, csvRowToBookInput, CSV_TEMPLATE } from "@/lib/books";

type RowResult = {
  row: number;
  raw: Record<string, string>;
  ok: boolean;
  messages: string[];
  title: string;
};

function downloadTemplate() {
  const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "digital-library-import-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function ImportCsvModal({
  onClose,
  onImported,
}: {
  onClose: () => void;
  onImported: () => void;
}) {
  const [fileName, setFileName] = useState("");
  const [results, setResults] = useState<RowResult[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [summary, setSummary] = useState<{ created: number; skipped: number } | null>(null);
  const [parseError, setParseError] = useState("");

  function handleFile(file: File) {
    setFileName(file.name);
    setParseError("");
    setSummary(null);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (parsed) => {
        if (parsed.errors.length > 0) {
          setParseError(parsed.errors[0].message);
          return;
        }
        const rows: RowResult[] = parsed.data.map((raw, i) => {
          const parsedRow = bookInputSchema.safeParse(csvRowToBookInput(raw));
          return {
            row: i + 2, // account for header row, 1-indexed
            raw,
            ok: parsedRow.success,
            messages: parsedRow.success
              ? []
              : parsedRow.error.issues.map((iss) => `${iss.path.join(".")}: ${iss.message}`),
            title: raw.title || "(no title)",
          };
        });
        setResults(rows);
      },
      error: (err) => setParseError(err.message),
    });
  }

  async function handleImport() {
    if (!results) return;
    const validRows = results.filter((r) => r.ok).map((r) => r.raw);
    if (validRows.length === 0) return;

    setImporting(true);
    const res = await fetch("/api/books/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: validRows }),
    });
    setImporting(false);

    if (res.ok) {
      const data = await res.json();
      setSummary({ created: data.created, skipped: results.length - data.created });
      onImported();
    } else {
      const data = await res.json().catch(() => ({}));
      setParseError(data.error ?? "Import failed.");
    }
  }

  const validCount = results?.filter((r) => r.ok).length ?? 0;
  const invalidCount = (results?.length ?? 0) - validCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[14px] bg-panel-soft shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between rounded-t-[14px] border-b border-border bg-panel px-6 py-[18px]">
          <h2 className="font-serif-heading text-[17px] font-bold text-foreground">
            Import Books from CSV
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-full text-lg text-muted hover:bg-panel-muted"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 rounded-lg border border-border bg-panel-muted p-4 text-sm">
            <p className="mb-2 text-[13px] font-bold uppercase tracking-wide text-muted-light">
              Required CSV Format
            </p>
            <code className="block overflow-x-auto whitespace-nowrap rounded bg-panel-soft p-2 text-xs text-muted-dark">
              title,author,genre,year_published,pages,status,type,rating,dateStarted,dateFinished,description,notes,source
            </code>
            <ul className="mt-2 space-y-0.5 text-xs text-muted">
              <li>status: reading | want-to-read | finished | dnf | on-hold | re-reading</li>
              <li>type: physical | audiobook | ebook</li>
              <li>rating: 0–5 (0 = unrated)</li>
              <li>dates: YYYY-MM-DD</li>
            </ul>
            <p className="mt-2 text-xs text-muted">
              Wrap fields containing commas in double quotes. Only title is required.
            </p>
            <button
              onClick={downloadTemplate}
              className="mt-3 rounded-md border border-border-soft bg-panel-soft px-3 py-1.5 text-xs font-bold text-muted-dark hover:bg-panel"
            >
              ⬇ Download template CSV
            </button>
          </div>

          {!summary && (
            <div className="mb-4">
              <label
                htmlFor="csv-file-input"
                className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-border-soft bg-panel-muted px-4 py-4 transition hover:border-wood hover:bg-panel"
              >
                <span className="shrink-0 rounded-md bg-wood px-4 py-2 text-[13px] font-bold text-white">
                  Choose File
                </span>
                <span className="truncate text-sm text-muted">
                  {fileName || "No file chosen — click to browse"}
                </span>
                <input
                  id="csv-file-input"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
              {parseError && <p className="mt-2 text-sm text-accent-red">{parseError}</p>}
            </div>
          )}

          {results && !summary && (
            <>
              <div className="mb-2 flex gap-4 text-sm">
                <span className="text-accent-green">{validCount} rows ready to import</span>
                {invalidCount > 0 && (
                  <span className="text-accent-red">{invalidCount} rows will be skipped</span>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-panel-muted">
                    <tr>
                      <th className="p-2">Row</th>
                      <th className="p-2">Title</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.row} className="border-t border-border">
                        <td className="p-2">{r.row}</td>
                        <td className="p-2">{r.title}</td>
                        <td className="p-2">
                          {r.ok ? (
                            <span className="text-accent-green">✓ Ready</span>
                          ) : (
                            <span className="text-accent-red">✗ {r.messages.join("; ")}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleImport}
                  disabled={validCount === 0 || importing}
                  className="rounded-[7px] bg-wood px-4 py-[11px] text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-60"
                >
                  {importing
                    ? "Importing…"
                    : `Import ${validCount} book${validCount === 1 ? "" : "s"}`}
                </button>
                <button
                  onClick={onClose}
                  className="rounded-[7px] border border-border-soft bg-panel-soft px-5 py-[11px] text-[13px] text-muted hover:bg-panel-muted"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {summary && (
            <div className="rounded-lg border border-border bg-panel-muted p-4 text-sm">
              <p className="font-bold text-accent-green">
                Imported {summary.created} book{summary.created === 1 ? "" : "s"}.
              </p>
              {summary.skipped > 0 && (
                <p className="mt-1 text-accent-red">{summary.skipped} rows were skipped.</p>
              )}
              <button
                onClick={onClose}
                className="mt-3 rounded-[7px] bg-wood px-4 py-[11px] text-[13px] font-bold text-white hover:opacity-90"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
