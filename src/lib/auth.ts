import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const SESSION_COOKIE = "dl_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Reads the session cookie from the incoming request (Server Components, route handlers). */
export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;

/**
 * Guard for mutating API routes. Returns a 401 response if the caller isn't an
 * authenticated admin, or null if the request may proceed. This check runs
 * server-side regardless of what the UI shows, so it can't be bypassed by
 * hiding/showing buttons on the client.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const ok = await isAdminSession();
  if (!ok) {
    return NextResponse.json({ error: "Admin login required." }, { status: 401 });
  }
  return null;
}

