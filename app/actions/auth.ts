"use server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";
import { limited } from "@/lib/ratelimit";
import { str } from "@/lib/util";
import type { FormState } from "@/lib/types";

const ip = () => headers().get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

export async function registerAction(_: FormState, fd: FormData): Promise<FormState> {
  const name = str(fd, "name");
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");

  if (limited(`reg:${ip()}`, 5, 60 * 60 * 1000)) return { error: "Too many attempts. Try again later." };
  if (!name || name.length > 60) return { error: "Enter your name" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address" };
  if (password.length < 8) return { error: "Password must be at least 8 characters" };
  if (fd.get("terms") !== "on") return { error: "Accept the Terms to continue" };
  if (await db.user.findUnique({ where: { email } })) return { error: "An account with this email already exists" };

  const user = await db.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 11), apiKey: randomBytes(24).toString("hex") },
  });
  await createSession(user.id);
  redirect("/dashboard");
}

export async function loginAction(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");

  if (limited(`login:${ip()}:${email}`, 8)) return { error: "Too many attempts. Try again in a few minutes." };
  const user = await db.user.findUnique({ where: { email } });
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) return { error: "Wrong email or password" };
  if (!user.active) return { error: "This account is suspended. Contact support." };

  await createSession(user.id);
  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}

export async function logoutAction() {
  destroySession();
  redirect("/login");
}
