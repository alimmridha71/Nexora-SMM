import { randomUUID } from "crypto";
import { db } from "./db";
import { providerCall, ProviderRejected } from "./provider";
import { settle } from "./wallet";

export type PlaceResult =
  | { ok: true; order: { publicId: number; charge: string; status: string } }
  | { ok: false; error: string };

export async function submitToProvider(orderId: string): Promise<"ok" | "rejected" | "uncertain" | "skipped"> {
  const o = await db.order.findUnique({ where: { id: orderId }, include: { service: { include: { provider: true } } } });
  if (!o || o.status !== "PENDING_SUBMIT") return "skipped";
  try {
    const res = await providerCall(o.service.provider, "add", {
      service: o.service.externalId,
      link: o.link,
      quantity: o.quantity,
    });
    if (res?.order === undefined || res?.order === null) return "uncertain";
    await db.order.updateMany({
      where: { id: o.id, status: "PENDING_SUBMIT" },
      data: { providerOrderId: String(res.order), status: "PENDING" },
    });
    return "ok";
  } catch (e) {
    if (e instanceof ProviderRejected) {
      await settle(o.id, "FAILED"); // provider clearly refused -> full refund
      return "rejected";
    }
    return "uncertain"; // timeout/network: provider may have accepted it -> admin reviews
  }
}

export async function placeOrder(input: {
  userId: string;
  serviceId: string;
  link: string;
  quantity: number;
  source?: string;
  idempotencyKey?: string;
}): Promise<PlaceResult> {
  const { userId, serviceId, link, quantity } = input;
  const idempotencyKey = input.idempotencyKey || randomUUID();

  if (!Number.isInteger(quantity) || quantity <= 0) return { ok: false, error: "Invalid quantity" };
  let url: URL;
  try {
    url = new URL(link);
    if (!/^https?:$/.test(url.protocol)) throw new Error();
  } catch {
    return { ok: false, error: "Enter a valid link starting with https://" };
  }

  // Same submit twice (double click / retry) returns the first order, never charges twice
  const dup = await db.order.findUnique({ where: { idempotencyKey } });
  if (dup) {
    return dup.userId === userId
      ? { ok: true, order: { publicId: dup.publicId, charge: dup.charge.toString(), status: dup.status } }
      : { ok: false, error: "Invalid request" };
  }

  const service = await db.service.findUnique({ where: { id: serviceId }, include: { provider: true } });
  if (!service || !service.active || !service.provider.active) return { ok: false, error: "This service is not available" };
  if (quantity < service.min || quantity > service.max)
    return { ok: false, error: `Quantity must be between ${service.min} and ${service.max}` };

  const charge = service.sellRate.mul(quantity).div(1000).toDecimalPlaces(4);

  let order;
  try {
    order = await db.$transaction(async (tx) => {
      const r = await tx.user.updateMany({
        where: { id: userId, active: true, balance: { gte: charge } },
        data: { balance: { decrement: charge } },
      });
      if (r.count === 0) throw new Error("INSUFFICIENT_BALANCE");
      const o = await tx.order.create({
        data: { userId, serviceId, link: url.toString(), quantity, charge, idempotencyKey, source: input.source ?? "web" },
      });
      await tx.transaction.create({
        data: { userId, type: "ORDER_DEBIT", amount: charge.neg(), orderId: o.id, note: `Order #${o.publicId}` },
      });
      return o;
    });
  } catch (e) {
    if (e instanceof Error && e.message === "INSUFFICIENT_BALANCE") return { ok: false, error: "Not enough balance. Add funds first." };
    throw e;
  }

  const result = await submitToProvider(order.id);
  if (result === "rejected") return { ok: false, error: "The order could not be placed and your balance was returned." };

  const fresh = await db.order.findUnique({ where: { id: order.id } });
  return { ok: true, order: { publicId: order.publicId, charge: charge.toString(), status: fresh?.status ?? order.status } };
}
