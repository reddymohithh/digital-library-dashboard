import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

type RouteParams = { params: Promise<{ date: string }> };

function parseDateParam(dateStr: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

const bodySchema = z.object({ status: z.enum(["MET", "PARTIAL", "MISSED"]) });

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { date: dateStr } = await params;
  const date = parseDateParam(dateStr);
  if (!date) return NextResponse.json({ error: "Invalid date." }, { status: 400 });

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const log = await prisma.dailyLog.upsert({
    where: { date },
    create: { date, status: parsed.data.status },
    update: { status: parsed.data.status },
  });

  return NextResponse.json({ log });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { date: dateStr } = await params;
  const date = parseDateParam(dateStr);
  if (!date) return NextResponse.json({ error: "Invalid date." }, { status: 400 });

  await prisma.dailyLog.deleteMany({ where: { date } });
  return NextResponse.json({ ok: true });
}
