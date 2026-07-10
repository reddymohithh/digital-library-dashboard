import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  requireAdmin,
  getOrCreateAdminCredential,
  updateAdminCredential,
  verifyPassword,
} from "@/lib/auth";

const bodySchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newUsername: z.string().trim().min(1, "Username is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export async function PUT(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }

  const credential = await getOrCreateAdminCredential();
  const currentPasswordMatches = await verifyPassword(
    parsed.data.currentPassword,
    credential.passwordHash,
  );
  if (!currentPasswordMatches) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  const newPasswordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await updateAdminCredential(parsed.data.newUsername, newPasswordHash);

  return NextResponse.json({ ok: true });
}
