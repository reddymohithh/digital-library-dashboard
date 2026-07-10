import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { bookInputSchema, toPrismaBookData } from "@/lib/books";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return NextResponse.json({ error: "Book not found." }, { status: 404 });
  return NextResponse.json({ book });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Book not found." }, { status: 404 });

  const body = await req.json();
  const parsed = bookInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid book data.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const book = await prisma.book.update({
    where: { id },
    data: toPrismaBookData(parsed.data),
  });
  return NextResponse.json({ book });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const existing = await prisma.book.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Book not found." }, { status: 404 });

  await prisma.book.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
