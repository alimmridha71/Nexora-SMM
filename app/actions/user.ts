"use server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { placeOrder } from "@/lib/orders";
import { getSettings, paymentMethods } from "@/lib/settings";
import { str } from "@/lib/util";
import type { FormState } from "@/lib/types";

export async function createOrderAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const r = await placeOrder({
    userId: user.id,
    serviceId: str(fd, "serviceId"),
    link: str(fd, "link"),
    quantity: Number(str(fd, "quantity")),
    idempotencyKey: str(fd, "key") || undefined,
  });
  if (!r.ok) return { error: r.error };
  revalidatePath("/orders");
  redirect(`/orders?placed=${r.order.publicId}`);
}

export async function submitPaymentAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const s = await getSettings();
  const method = str(fd, "method");
  const amount = Number(str(fd, "amount"));
  const trxId = str(fd, "trxId").toUpperCase();
  const note = str(fd, "note").slice(0, 200) || null;

  if (!paymentMethods(s).some((m) => m.id === method)) return { error: "Choose a payment method" };
  if (!Number.isFinite(amount) || amount < Number(s.minDeposit))
    return { error: `Minimum deposit is ${s.currency}${s.minDeposit}` };
  if (!/^[A-Z0-9]{6,40}$/.test(trxId)) return { error: "Enter a valid Transaction ID (letters and numbers only)" };

  const pending = await db.payment.count({ where: { userId: user.id, status: "PENDING" } });
  if (pending >= 5) return { error: "You have 5 payments waiting for review. Wait for them to be processed." };
  try {
    await db.payment.create({ data: { userId: user.id, method, amount, trxId, note } });
  } catch {
    return { error: "This Transaction ID was already submitted" };
  }
  revalidatePath("/add-funds");
  return { ok: "Payment submitted. We will add the funds after verification." };
}

export async function createTicketAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const subject = str(fd, "subject").slice(0, 120);
  const body = str(fd, "body").slice(0, 4000);
  if (!subject || !body) return { error: "Enter a subject and a message" };
  const open = await db.ticket.count({ where: { userId: user.id, status: { not: "CLOSED" } } });
  if (open >= 10) return { error: "Close some of your open tickets first" };
  const t = await db.ticket.create({ data: { userId: user.id, subject, messages: { create: { body } } } });
  redirect(`/tickets/${t.id}`);
}

export async function replyTicketAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = str(fd, "id");
  const body = str(fd, "body").slice(0, 4000);
  if (!body) return { error: "Write a message" };
  const t = await db.ticket.findFirst({ where: { id, userId: user.id } });
  if (!t) return { error: "Ticket not found" };
  if (t.status === "CLOSED") return { error: "This ticket is closed" };
  await db.ticket.update({ where: { id }, data: { status: "OPEN", messages: { create: { body } } } });
  revalidatePath(`/tickets/${id}`);
  return { ok: "Reply sent" };
}

export async function changePasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  if (!(await bcrypt.compare(current, user.passwordHash))) return { error: "Current password is wrong" };
  if (next.length < 8) return { error: "New password must be at least 8 characters" };
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(next, 11) } });
  return { ok: "Password updated" };
}

export async function regenerateApiKeyAction() {
  const user = await requireUser();
  await db.user.update({ where: { id: user.id }, data: { apiKey: randomBytes(24).toString("hex") } });
  revalidatePath("/api-access");
}
