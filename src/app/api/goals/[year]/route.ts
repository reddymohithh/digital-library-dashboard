import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

type RouteParams = { params: Promise<{ year: string }> };

function yearBounds(year: number) {
  return {
    start: new Date(Date.UTC(year, 0, 1)),
    end: new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)),
  };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { year: yearStr } = await params;
  const year = Number(yearStr);
  if (!Number.isInteger(year)) {
    return NextResponse.json({ error: "Invalid year." }, { status: 400 });
  }

  const { start, end } = yearBounds(year);

  const [goal, finishedBooks, dailyLogs] = await Promise.all([
    prisma.goal.findUnique({ where: { year } }),
    prisma.book.findMany({
      where: { status: "FINISHED", dateFinished: { gte: start, lte: end } },
      select: { genre: true },
    }),
    prisma.dailyLog.findMany({ where: { date: { gte: start, lte: end } } }),
  ]);

  const finishedCount = finishedBooks.length;
  const percent = goal && goal.booksGoal > 0
    ? Math.round((finishedCount / goal.booksGoal) * 100)
    : 0;

  const genreBreakdown = Object.entries(
    finishedBooks.reduce<Record<string, number>>((acc, b) => {
      const key = b.genre || "Unspecified";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);

  const dailyPages = goal?.dailyPages ?? 0;
  const pagesRead = dailyLogs.reduce((sum, log) => {
    if (log.status === "MET") return sum + dailyPages;
    if (log.status === "PARTIAL") return sum + dailyPages / 2;
    return sum;
  }, 0);

  return NextResponse.json({
    goal,
    stats: {
      finishedCount,
      percent,
      genreBreakdown,
      pagesRead: Math.round(pagesRead),
    },
  });
}

const goalInputSchema = z.object({
  booksGoal: z.number().int().min(1).max(1000),
  dailyPages: z.number().int().min(1).max(5000),
  targetGenre: z.string().trim().optional().default(""),
});

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { year: yearStr } = await params;
  const year = Number(yearStr);
  if (!Number.isInteger(year)) {
    return NextResponse.json({ error: "Invalid year." }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = goalInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid goal data.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const goal = await prisma.goal.upsert({
    where: { year },
    create: { year, ...parsed.data, targetGenre: parsed.data.targetGenre || null },
    update: { ...parsed.data, targetGenre: parsed.data.targetGenre || null },
  });

  return NextResponse.json({ goal });
}
