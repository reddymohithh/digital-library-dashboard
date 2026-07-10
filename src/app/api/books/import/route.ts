import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { bookInputSchema, csvRowToBookInput, toPrismaBookData } from "@/lib/books";

const MAX_ROWS = 2000;

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await req.json().catch(() => null);
  const rows = body?.rows;
  if (!Array.isArray(rows)) {
    return NextResponse.json({ error: "Expected a 'rows' array." }, { status: 400 });
  }
  if (rows.length === 0) {
    return NextResponse.json({ error: "No rows to import." }, { status: 400 });
  }
  if (rows.length > MAX_ROWS) {
    return NextResponse.json(
      { error: `Cannot import more than ${MAX_ROWS} rows at once.` },
      { status: 400 },
    );
  }

  const toCreate: ReturnType<typeof toPrismaBookData>[] = [];
  const errors: { row: number; messages: string[] }[] = [];

  rows.forEach((rawRow: Record<string, string>, index: number) => {
    const parsed = bookInputSchema.safeParse(csvRowToBookInput(rawRow));
    if (!parsed.success) {
      errors.push({
        row: index + 1,
        messages: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      });
      return;
    }
    toCreate.push(toPrismaBookData(parsed.data));
  });

  let created = 0;
  if (toCreate.length > 0) {
    const result = await prisma.book.createMany({ data: toCreate });
    created = result.count;
  }

  return NextResponse.json({ created, skipped: errors.length, errors });
}
