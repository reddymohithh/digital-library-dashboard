import { z } from "zod";
import type { Format, Status } from "@prisma/client";

export const STATUS_CSV_TO_ENUM: Record<string, Status> = {
  reading: "READING",
  "want-to-read": "WANT_TO_READ",
  finished: "FINISHED",
  dnf: "DNF",
  "on-hold": "ON_HOLD",
  "re-reading": "RE_READING",
};

export const STATUS_ENUM_TO_CSV: Record<Status, string> = {
  READING: "reading",
  WANT_TO_READ: "want-to-read",
  FINISHED: "finished",
  DNF: "dnf",
  ON_HOLD: "on-hold",
  RE_READING: "re-reading",
};

export const STATUS_LABELS: Record<Status, string> = {
  READING: "Reading",
  WANT_TO_READ: "Want to Read",
  FINISHED: "Finished",
  DNF: "DNF",
  ON_HOLD: "On Hold",
  RE_READING: "Re-reading",
};

export const FORMAT_CSV_TO_ENUM: Record<string, Format> = {
  physical: "PHYSICAL",
  audiobook: "AUDIOBOOK",
  ebook: "EBOOK",
};

export const FORMAT_ENUM_TO_CSV: Record<Format, string> = {
  PHYSICAL: "physical",
  AUDIOBOOK: "audiobook",
  EBOOK: "ebook",
};

export const FORMAT_LABELS: Record<Format, string> = {
  PHYSICAL: "Physical",
  AUDIOBOOK: "Audiobook",
  EBOOK: "E-book",
};

const dateStringSchema = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), {
    message: "Date must be in YYYY-MM-DD format",
  })
  .optional()
  .or(z.literal(""));

/** Shared shape for both the manual add/edit form and CSV import rows. */
export const bookInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  author: z.string().trim().optional().default(""),
  genre: z.string().trim().optional().default(""),
  yearPublished: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v)))
    .refine((v) => v === undefined || (Number.isInteger(v) && v > 0 && v < 3000), {
      message: "Year published must be a valid year",
    }),
  pages: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v)))
    .refine((v) => v === undefined || (Number.isInteger(v) && v >= 0), {
      message: "Pages must be a positive number",
    }),
  status: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => v in STATUS_CSV_TO_ENUM, {
      message:
        "Status must be one of: reading, want-to-read, finished, dnf, on-hold, re-reading",
    }),
  format: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => v in FORMAT_CSV_TO_ENUM, {
      message: "Format must be one of: physical, audiobook, ebook",
    }),
  rating: z
    .union([z.number(), z.string()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? 0 : Number(v)))
    .refine((v) => v >= 0 && v <= 5, { message: "Rating must be between 0 and 5" }),
  dateStarted: dateStringSchema,
  dateFinished: dateStringSchema,
  description: z.string().trim().optional().default(""),
  notes: z.string().trim().optional().default(""),
  source: z.string().trim().optional().default(""),
  coverUrl: z.string().trim().optional().default(""),
});

export type BookInput = z.infer<typeof bookInputSchema>;

/** Converts a validated BookInput into a Prisma-ready create/update payload. */
export function toPrismaBookData(input: BookInput) {
  return {
    title: input.title,
    author: input.author || "",
    genre: input.genre || null,
    yearPublished: input.yearPublished ?? null,
    pages: input.pages ?? null,
    status: STATUS_CSV_TO_ENUM[input.status],
    format: FORMAT_CSV_TO_ENUM[input.format],
    rating: input.rating,
    dateStarted: input.dateStarted ? new Date(input.dateStarted) : null,
    dateFinished: input.dateFinished ? new Date(input.dateFinished) : null,
    description: input.description || null,
    notes: input.notes || null,
    source: input.source || null,
    coverUrl: input.coverUrl || null,
  };
}

export const CSV_TEMPLATE_HEADER =
  "title,author,genre,year_published,pages,status,type,rating,dateStarted,dateFinished,description,notes,source";

export const CSV_TEMPLATE_EXAMPLE =
  'Sapiens,Yuval Noah Harari,Non-Fiction,2011,443,finished,physical,5,2026-01-02,2026-01-28,"A brief history of humankind from the Stone Age to the present day.",Completely changed how I think about human history.,Bought';

export const CSV_TEMPLATE = `${CSV_TEMPLATE_HEADER}\n${CSV_TEMPLATE_EXAMPLE}\n`;

/** Maps a raw CSV row (keyed by the template headers) to the shared book input shape. */
export function ratingStars(rating: number): string {
  const clamped = Math.max(0, Math.min(5, rating));
  return "★".repeat(clamped) + "☆".repeat(5 - clamped);
}

export const FORMAT_ICONS: Record<Format, string> = {
  PHYSICAL: "📖",
  AUDIOBOOK: "🎧",
  EBOOK: "📱",
};

export function csvRowToBookInput(row: Record<string, string>): unknown {
  return {
    title: row.title ?? "",
    author: row.author ?? "",
    genre: row.genre ?? "",
    yearPublished: row.year_published ?? "",
    pages: row.pages ?? "",
    status: row.status ?? "",
    format: row.type ?? "",
    rating: row.rating ?? "",
    dateStarted: row.dateStarted ?? "",
    dateFinished: row.dateFinished ?? "",
    description: row.description ?? "",
    notes: row.notes ?? "",
    source: row.source ?? "",
  };
}
