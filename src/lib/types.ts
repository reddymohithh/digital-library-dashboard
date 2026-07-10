import type { Status, Format, DailyStatus } from "@prisma/client";

/** Book as returned by the API — Prisma Dates are serialized to ISO strings over JSON. */
export type BookDTO = {
  id: string;
  title: string;
  author: string;
  genre: string | null;
  yearPublished: number | null;
  pages: number | null;
  status: Status;
  format: Format;
  rating: number;
  dateStarted: string | null;
  dateFinished: string | null;
  description: string | null;
  notes: string | null;
  source: string | null;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GoalDTO = {
  id: string;
  year: number;
  booksGoal: number;
  dailyPages: number;
  targetGenre: string | null;
};

export type DailyLogDTO = {
  date: string;
  status: DailyStatus;
};

export type Facets = {
  status: { value: Status; count: number }[];
  genre: { value: string; count: number }[];
  rating: { value: number; count: number }[];
};

export type BooksResponse = {
  books: BookDTO[];
  total: number;
  page: number;
  pageSize: number;
  facets: Facets;
};
