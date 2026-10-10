"use server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { encrypt } from "@/lib/crypto";
import { providerCall } from "@/lib/provider";
import { syncProviderServices, syncOrders } from "@/lib/sync";
import { settle } from "@/lib/wallet";
import { submitToProvider } from "@/lib/orders";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { str } from "@/lib/util";
import type { FormState } from "@/lib/types";

const num = (fd: FormData, k: string) => Number(str(fd, k));

/* ---------- providers ---------- */
export async function addProviderAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const name = str(fd, "name");
  const apiUrl = str(fd, "apiUrl");
  const apiKey = str(fd, "apiKey");
  try {
    if (!/^https:\/\//.test(apiUrl)) throw new Error("API URL must start with https://");
    new URL(apiUrl);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Invalid API URL" };
  }
  if (!name || !apiKey) return { error: "Name and API key are required" };
  const marginPct = Number.isFinite(num(fd, "marginPct")) ? num(fd, "marginPct") : 30;
  const rateMultiplier = num(fd, "rateMultiplier") > 0 ? num(fd, "rateMultiplier") : 1;
  await db.provider.create({ data: { name, apiUrl, apiKeyEnc: encrypt(apiKey), marginPct, rateMultiplier } });
  revalidatePath("/admin/providers");
  return { ok: "Provider added. Click “Sync services” to import its catalog." };
}

export async function updateProviderAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const marginPct = num(fd, "marginPct");
  const rateMultiplier = num(fd, "rateMultiplier");
  if (!(marginPct >= 0) || !(rateMultiplier > 0)) return { error: "Enter a valid margin and rate multiplier" };
  const data: Prisma.ProviderUpdateInput = { marginPct, rateMultiplier, priority: Math.trunc(num(fd, "priority")) || 0 };
  const newKey = str(fd, "apiKey");
  if (newKey) data.apiKeyEnc = encrypt(newKey);
  await db.provider.update({ where: { id }, data });
  // re-price every service that is not manually locked
  await db.$executeRaw`UPDATE "Service" SET "sellRate" = ROUND("rate" * ${rateMultiplier}::numeric * (1 + ${marginPct}::numeric / 100), 4) WHERE "providerId" = ${id} AND "locked" = false`;
  revalidatePath("/admin/providers");
  return { ok: "Saved and prices recalculated" };
}

export async function toggleProviderAction(fd: FormData) {
  await requireAdmin();
  const p = await db.provider.findUnique({ where: { id: str(fd, "id") } });
  if (p) await db.provider.update({ where: { id: p.id }, data: { active: !p.active } });
  revalidatePath("/admin/providers");
}

export async function syncProviderAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const r = await syncProviderServices(str(fd, "id"));
    revalidatePath("/admin/services");
    return { ok: `Done: ${r.created} new, ${r.updated} updated, ${r.deactivated} hidden` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Sync failed" };
  }
}

export async function testProviderAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const p = await db.provider.findUnique({ where: { id: str(fd, "id") } });
  if (!p) return { error: "Provider not found" };
  try {
    const r = await providerCall(p, "balance");
    return { ok: `Connected. Balance: ${r.balance ?? "?"} ${r.currency ?? ""}` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Connection failed" };
  }
}

export async function syncOrdersNowAction(_: FormState): Promise<FormState> {
  await requireAdmin();
  const r = await syncOrders(50);
  revalidatePath("/admin/orders");
  return { ok: `Checked ${r.checked}, updated ${r.updated}` };
}

/* ---------- services ---------- */
export async function updateServiceAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const sellRate = num(fd, "sellRate");
  if (!(sellRate >= 0)) return;
  const cur = await db.service.findUnique({ where: { id } });
  if (!cur) return;
  const edited = !cur.sellRate.equals(new Prisma.Decimal(sellRate));
  await db.service.update({
    where: { id },
    data: {
      name: str(fd, "name") || cur.name,
      category: str(fd, "category") || cur.category,
      sellRate,
      active: fd.get("active") === "on",
      locked: fd.get("locked") === "on" || edited,
    },
  });
  revalidatePath("/admin/services");
}

/* ---------- users ---------- */
export async function adjustBalanceAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const amount = num(fd, "amount");
  const note = str(fd, "note").slice(0, 120) || "Admin adjustment";
  if (!Number.isFinite(amount) || amount === 0) return { error: "Enter an amount (negative to deduct)" };
  const amt = new Prisma.Decimal(amount);
  try {
    await db.$transaction(async (tx) => {
      const r = await tx.user.updateMany({
        where: { id, ...(amt.isNeg() ? { balance: { gte: amt.neg() } } : {}) },
        data: { balance: { increment: amt } },
      });
      if (r.count === 0) throw new Error("fail");
      await tx.transaction.create({ data: { userId: id, type: "ADJUST", amount: amt, note } });
    });
  } catch {
    return { error: "Failed. The user may not have enough balance to deduct." };
  }
  revalidatePath("/admin/users");
  return { ok: "Balance updated" };
}

export async function toggleUserAction(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  if (id === admin.id) return;
  const u = await db.user.findUnique({ where: { id } });
  if (u) await db.user.update({ where: { id }, data: { active: !u.active } });
  revalidatePath("/admin/users");
}

/* ---------- payments ---------- */
export async function approvePaymentAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await db.$transaction(async (tx) => {
    const claimed = await tx.payment.updateMany({
      where: { id, status: "PENDING" },
      data: { status: "APPROVED", reviewedAt: new Date() },
    });
    if (claimed.count === 0) return; // already handled -> no double credit
    const p = await tx.payment.findUniqueOrThrow({ where: { id } });
    await tx.user.update({ where: { id: p.userId }, data: { balance: { increment: p.amount } } });
    await tx.transaction.create({
      data: { userId: p.userId, type: "DEPOSIT", amount: p.amount, note: `${p.method} ${p.trxId}` },
    });
  });
  revalidatePath("/admin/payments");
}

export async function rejectPaymentAction(fd: FormData) {
  await requireAdmin();
  await db.payment.updateMany({
    where: { id: str(fd, "id"), status: "PENDING" },
    data: { status: "REJECTED", reviewedAt: new Date() },
  });
  revalidatePath("/admin/payments");
}

/* ---------- orders ---------- */
export async function cancelRefundOrderAction(fd: FormData) {
  await requireAdmin();
  await settle(str(fd, "id"), "CANCELED");
  revalidatePath("/admin/orders");
}

export async function markCompletedOrderAction(fd: FormData) {
  await requireAdmin();
  await settle(str(fd, "id"), "COMPLETED");
  revalidatePath("/admin/orders");
}

export async function retrySubmitOrderAction(fd: FormData) {
  await requireAdmin();
  await submitToProvider(str(fd, "id"));
  revalidatePath("/admin/orders");
}

/* ---------- tickets ---------- */
export async function adminReplyTicketAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const body = str(fd, "body").slice(0, 4000);
  if (!body) return { error: "Write a message" };
  await db.ticket.update({ where: { id }, data: { status: "ANSWERED", messages: { create: { body, isStaff: true } } } });
  revalidatePath(`/admin/tickets/${id}`);
  return { ok: "Reply sent" };
}

export async function closeTicketAction(fd: FormData) {
  await requireAdmin();
  await db.ticket.update({ where: { id: str(fd, "id") }, data: { status: "CLOSED" } });
  revalidatePath("/admin/tickets");
}

/* ---------- settings ---------- */
export async function saveSettingsAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    const fallback = key === "siteName" || key === "currency" ? (DEFAULT_SETTINGS as Record<string, string>)[key] : "";
    const value = str(fd, key).slice(0, 300) || fallback;
    await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  revalidatePath("/", "layout");
  return { ok: "Settings saved" };
}
