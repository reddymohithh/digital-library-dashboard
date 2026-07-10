import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { bookInputSchema, toPrismaBookData } from "@/lib/books";
import type { Prisma, Status } from "@prisma/client";

const SORT_MAP: Record<string, Prisma.BookOrderByWithRelationInput> = {
  recent: { createdAt: "desc" },
  title: { title: "asc" },
  author: { author: "asc" },
  rating: { rating: "desc" },
  dateFinished: { dateFinished: "desc" },
  format: { format: "asc" },
  source: { source: "asc" },
};

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  const genre = params.get("genre");
  const rating = params.get("rating");
  const search = params.get("search")?.trim();
  const sort = params.get("sort") ?? "recent";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.get("pageSize")) || 27));

  const where: Prisma.BookWhereInput = {};
  if (status && status !== "ALL") where.status = status as Status;
  if (genre && genre !== "ALL") where.genre = genre;
  if (rating) where.rating = Number(rating);
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { author: { contains: search, mode: "insensitive" } },
      { genre: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy = SORT_MAP[sort] ?? SORT_MAP.recent;

  const [books, total, statusCounts, genreCounts, ratingCounts] = await Promise.all([
    prisma.book.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.book.count({ where }),
    prisma.book.groupBy({ by: ["status"], _count: true }),
    prisma.book.groupBy({ by: ["genre"], _count: true }),
    prisma.book.groupBy({ by: ["rating"], _count: true }),
  ]);

  return NextResponse.json({
    books,
    total,
    page,
    pageSize,
    facets: {
      status: statusCounts.map((s) => ({ value: s.status, count: s._count })),
      genre: genreCounts
        .filter((g) => g.genre)
        .map((g) => ({ value: g.genre, count: g._count })),
      rating: ratingCounts.map((r) => ({ value: r.rating, count: r._count })),
    },
  });
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await req.json();
  const parsed = bookInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid book data.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const book = await prisma.book.create({ data: toPrismaBookData(parsed.data) });
  return NextResponse.json({ book }, { status: 201 });
}
