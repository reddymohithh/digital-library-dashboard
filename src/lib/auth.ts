import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

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

const ADMIN_ROW_ID = 1;

/**
 * Returns the admin credential row, creating it from the ADMIN_USERNAME /
 * ADMIN_PASSWORD_HASH env vars the first time anyone logs in. After that,
 * the env vars are only a bootstrap default — the real credential lives in
 * the database so it can be changed in-app via the Account settings modal.
 */
export async function getOrCreateAdminCredential() {
  const existing = await prisma.adminCredential.findUnique({ where: { id: ADMIN_ROW_ID } });
  if (existing) return existing;

  const bootstrapUsername = process.env.ADMIN_USERNAME;
  const bootstrapHash = process.env.ADMIN_PASSWORD_HASH;
  if (!bootstrapUsername || !bootstrapHash) {
    throw new Error(
      "No admin credential exists yet, and ADMIN_USERNAME/ADMIN_PASSWORD_HASH are not set to bootstrap one.",
    );
  }

  return prisma.adminCredential.create({
    data: { id: ADMIN_ROW_ID, username: bootstrapUsername, passwordHash: bootstrapHash },
  });
}

export async function updateAdminCredential(username: string, passwordHash: string) {
  return prisma.adminCredential.upsert({
    where: { id: ADMIN_ROW_ID },
    create: { id: ADMIN_ROW_ID, username, passwordHash },
    update: { username, passwordHash },
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

