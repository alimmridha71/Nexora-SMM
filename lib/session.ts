import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE = "nx_session";
const secret = () => {
  const s = process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32
    ? process.env.AUTH_SECRET
    : "nexora-smm-default-auth-secret-key-32chars-fallback-key";
  return new TextEncoder().encode(s);
};

export async function createSession(userId: string) {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function readSessionUserId(): Promise<string | null> {
  const t = cookies().get(COOKIE)?.value;
  if (!t) return null;
  try {
    const { payload } = await jwtVerify(t, secret());
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export function destroySession() {
  cookies().delete(COOKIE);
}
