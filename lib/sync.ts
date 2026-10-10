import { Prisma } from "@prisma/client";
import { db } from "./db";
import { providerCall } from "./provider";
import { settle } from "./wallet";

export async function syncProviderServices(providerId: string) {
  const p = await db.provider.findUnique({ where: { id: providerId } });
  if (!p) throw new Error("Provider not found");

  const list = await providerCall(p, "services");
  if (!Array.isArray(list)) throw new Error("Unexpected response from provider");

  const existing = await db.service.findMany({ where: { providerId } });
  const map = new Map(existing.map((s) => [s.externalId, s]));
  const price = (rate: Prisma.Decimal) =>
    rate.mul(p.rateMultiplier).mul(new Prisma.Decimal(100).add(p.marginPct)).div(100).toDecimalPlaces(4);

  const creates: Prisma.ServiceCreateManyInput[] = [];
  const updates: Array<() => Promise<unknown>> = [];
  const seen = new Set<string>();

  for (const s of list) {
    const ext = String(s?.service ?? "");
    if (!ext || s.rate == null) continue;
    let rate: Prisma.Decimal;
    try {
      rate = new Prisma.Decimal(s.rate);
    } catch {
      continue;
    }
    seen.add(ext);
    const name = String(s.name ?? "Service").slice(0, 300);
    const category = String(s.category ?? "Other").slice(0, 120);
    const min = Math.max(1, Number(s.min) || 1);
    const max = Math.max(min, Number(s.max) || min);
    const cur = map.get(ext);
    if (!cur) {
      creates.push({ providerId, externalId: ext, name, category, rate, sellRate: price(rate), min, max });
      continue;
    }
    const changed =
      !cur.rate.equals(rate) || cur.name !== name || cur.category !== category || cur.min !== min || cur.max !== max || !cur.active;
    if (changed) {
      updates.push(() =>
        db.service.update({
          where: { id: cur.id },
          data: { name, category, rate, min, max, active: true, ...(cur.locked ? {} : { sellRate: price(rate) }) },
        })
      );
    }
  }

  for (let i = 0; i < creates.length; i += 500)
    await db.service.createMany({ data: creates.slice(i, i + 500), skipDuplicates: true });
  for (let i = 0; i < updates.length; i += 25) await Promise.all(updates.slice(i, i + 25).map((f) => f()));

  const missing = existing.filter((s) => !seen.has(s.externalId) && s.active).map((s) => s.id);
  for (let i = 0; i < missing.length; i += 1000)
    await db.service.updateMany({ where: { id: { in: missing.slice(i, i + 1000) } }, data: { active: false } });

  return { created: creates.length, updated: updates.length, deactivated: missing.length };
}

const MAP: Record<string, "PENDING" | "IN_PROGRESS" | "COMPLETED" | "PARTIAL" | "CANCELED"> = {
  pending: "PENDING",
  "in progress": "IN_PROGRESS",
  processing: "IN_PROGRESS",
  completed: "COMPLETED",
  partial: "PARTIAL",
  canceled: "CANCELED",
  cancelled: "CANCELED",
};

export async function syncOrders(limit = 50) {
  const orders = await db.order.findMany({
    where: { status: { in: ["PENDING", "IN_PROGRESS"] }, providerOrderId: { not: null } },
    include: { service: { include: { provider: true } } },
    orderBy: { updatedAt: "asc" },
    take: limit,
  });

  let updated = 0;
  for (const o of orders) {
    try {
      const s = await providerCall(o.service.provider, "status", { order: o.providerOrderId! });
      const next = MAP[String(s?.status ?? "").toLowerCase()];
      if (!next) continue;
      if (next === "COMPLETED" || next === "PARTIAL" || next === "CANCELED") {
        await settle(o.id, next, Number(s.remains ?? 0));
      } else if (next !== o.status) {
        await db.order.update({ where: { id: o.id }, data: { status: next } });
      } else {
        await db.order.update({ where: { id: o.id }, data: { updatedAt: new Date() } }); // rotate queue
      }
      updated++;
    } catch (e) {
      console.error(`status sync failed for order ${o.id}`, e);
    }
  }
  return { checked: orders.length, updated };
}
