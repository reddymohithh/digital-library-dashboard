import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  getOrCreateAdminCredential,
  verifyPassword,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 },
    );
  }

  let credential;
  try {
    credential = await getOrCreateAdminCredential();
  } catch {
    return NextResponse.json(
      { error: "Admin login is not configured on this server." },
      { status: 500 },
    );
  }

  const usernameMatches = username === credential.username;
  const passwordMatches = await verifyPassword(password, credential.passwordHash);

  if (!usernameMatches || !passwordMatches) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 },
    );
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
