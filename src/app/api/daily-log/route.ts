import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const yearStr = req.nextUrl.searchParams.get("year");
  const year = Number(yearStr);
  if (!Number.isInteger(year)) {
    return NextResponse.json({ error: "Invalid year." }, { status: 400 });
  }

  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

  const logs = await prisma.dailyLog.findMany({
    where: { date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ logs });
}
