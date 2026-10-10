import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "./db";
import { readSessionUserId } from "./session";

export const getCurrentUser = cache(async () => {
  try {
    const id = await readSessionUserId();
    if (!id) return null;
    const u = await db.user.findUnique({ where: { id } });
    return u && u.active ? u : null;
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return null;
  }
});

export async function requireUser() {
  const u = await getCurrentUser();
  if (!u) redirect("/login");
  return u;
}

export async function requireAdmin() {
  const u = await requireUser();
  if (u.role !== "ADMIN") redirect("/dashboard");
  return u;
}
