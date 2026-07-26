"use client";

import { useState } from "react";
import type { BookDTO } from "@/lib/types";
import {
  FORMAT_ENUM_TO_CSV,
  FORMAT_LABELS,
  STATUS_ENUM_TO_CSV,
  STATUS_LABELS,
} from "@/lib/books";
import type { Format, Status } from "@prisma/client";

type FormState = {
  title: string;
  author: string;
  genre: string;
  yearPublished: string;
  pages: string;
  status: string;
  format: string;
  rating: string;
  dateStarted: string;
  dateFinished: string;
  source: string;
  coverUrl: string;
  description: string;
  notes: string;
};

function bookToFormState(book?: BookDTO): FormState {
  if (!book) {
    return {
      title: "",
      author: "",
      genre: "",
      yearPublished: "",
      pages: "",
      status: "want-to-read",
      format: "physical",
      rating: "0",
      dateStarted: "",
      dateFinished: "",
      source: "",
      coverUrl: "",
      description: "",
      notes: "",
    };
  }
  return {
    title: book.title,
    author: book.author,
    genre: book.genre ?? "",
    yearPublished: book.yearPublished?.toString() ?? "",
    pages: book.pages?.toString() ?? "",
    status: STATUS_ENUM_TO_CSV[book.status],
    format: FORMAT_ENUM_TO_CSV[book.format],
    rating: String(book.rating ?? 0),
    dateStarted: book.dateStarted?.slice(0, 10) ?? "",
    dateFinished: book.dateFinished?.slice(0, 10) ?? "",
    source: book.source ?? "",
    coverUrl: book.coverUrl ?? "",
    description: book.description ?? "",
    notes: book.notes ?? "",
  };
}

export default function BookFormModal({
  book,
  genreOptions,
  onClose,
  onSaved,
}: {
  book?: BookDTO;
  genreOptions: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => bookToFormState(book));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(book);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch(isEdit ? `/api/books/${book!.id}` : "/api/books", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSubmitting(false);
    if (res.ok) {
      onSaved();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please check your entries.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-[14px] bg-panel-soft shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between rounded-t-[14px] border-b border-border bg-panel px-4 py-[18px] sm:px-6">
          <h2 className="font-serif-heading text-[17px] font-bold text-foreground">
            {isEdit ? "Edit Book" : "Add Book"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-full text-lg text-muted hover:bg-panel-muted"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3.5 p-4 sm:grid-cols-2 sm:p-6">
          <TextField label="Title *" placeholder="e.g. Sapiens" value={form.title} onChange={(v) => set("title", v)} required className="col-span-2" />
          <TextField label="Author" placeholder="e.g. Yuval Noah Harari" value={form.author} onChange={(v) => set("author", v)} />
          <div>
            <FieldLabel>Genre</FieldLabel>
            <input
              list="genre-options"
              placeholder="e.g. Non-Fiction"
              value={form.genre}
              onChange={(e) => set("genre", e.target.value)}
              className="mt-1 w-full rounded-lg border border-border-soft px-3 py-2 text-[13px] focus:border-wood focus:outline-none"
            />
            <datalist id="genre-options">
              {genreOptions.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </div>
          <TextField label="Year Published" placeholder="e.g. 2011" value={form.yearPublished} onChange={(v) => set("yearPublished", v)} type="number" />
          <TextField label="Pages" placeholder="e.g. 443" value={form.pages} onChange={(v) => set("pages", v)} type="number" />
          <SelectField
            label="Status"
            value={form.status}
            onChange={(v) => set("status", v)}
            options={Object.entries(STATUS_ENUM_TO_CSV).map(([enumVal, csvVal]) => ({
              value: csvVal,
              label: STATUS_LABELS[enumVal as Status],
            }))}
          />
          <SelectField
            label="Format"
            value={form.format}
            onChange={(v) => set("format", v)}
            options={Object.entries(FORMAT_ENUM_TO_CSV).map(([enumVal, csvVal]) => ({
              value: csvVal,
              label: FORMAT_LABELS[enumVal as Format],
            }))}
          />
          <SelectField
            label="Rating"
            value={form.rating}
            onChange={(v) => set("rating", v)}
            options={[0, 1, 2, 3, 4, 5].map((r) => ({
              value: String(r),
              label: r === 0 ? "Unrated" : "★".repeat(r) + "☆".repeat(5 - r),
            }))}
          />
          <TextField label="Date Started" placeholder="YYYY-MM-DD" value={form.dateStarted} onChange={(v) => set("dateStarted", v)} type="date" />
          <TextField label="Date Finished" placeholder="YYYY-MM-DD" value={form.dateFinished} onChange={(v) => set("dateFinished", v)} type="date" />
          <TextField label="Source" placeholder="e.g. Bought, Library" value={form.source} onChange={(v) => set("source", v)} />
          <TextField label="Cover Image URL" placeholder="https://…" value={form.coverUrl} onChange={(v) => set("coverUrl", v)} className="col-span-2" />
          <TextAreaField label="Description" placeholder="What's this book about?" value={form.description} onChange={(v) => set("description", v)} className="col-span-2" />
          <TextAreaField label="Notes" placeholder="Your personal notes or review" value={form.notes} onChange={(v) => set("notes", v)} className="col-span-2" />

          {error && <div className="col-span-2 text-[13px] text-accent-red">{error}</div>}

          <div className="col-span-2 flex gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-[7px] bg-wood px-4 py-[11px] text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Book"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[7px] border border-border-soft bg-panel-soft px-5 py-[11px] text-[13px] text-muted hover:bg-panel-muted"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-[10px] font-bold uppercase text-muted-light"
      style={{ letterSpacing: "0.08em" }}
    >
      {children}
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border-soft px-3 py-2 text-[13px] focus:border-wood focus:outline-none"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-lg border border-border-soft px-3 py-2 text-[13px] focus:border-wood focus:outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border-soft bg-panel-soft px-3 py-2 text-[13px] focus:border-wood focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
