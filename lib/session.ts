import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type SessionPayload = { userId: number; role: "admin" | "staff" };

const secret = process.env.SESSION_SECRET;
if (!secret || secret.length < 32) {
  throw new Error(
    "SESSION_SECRET di .env.local belum diisi (minimal 32 karakter).",
  );
}
const key = new TextEncoder().encode(secret);
const COOKIE = "session";
const MAX_AGE = 7 * 24 * 60 * 60; // 7 hari

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(token?: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null; // token palsu / kedaluwarsa
  }
}

export async function createSession(payload: SessionPayload) {
  const token = await encrypt(payload);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, // tidak bisa dibaca JavaScript
    secure: process.env.NODE_ENV === "production", // HTTPS saat production
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE);
}

export async function readSession() {
  return decrypt((await cookies()).get(COOKIE)?.value);
}
