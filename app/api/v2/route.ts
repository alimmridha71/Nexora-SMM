import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { placeOrder } from "@/lib/orders";
import { limited } from "@/lib/ratelimit";
import { getSettings } from "@/lib/settings";
import { STATUS_LABEL } from "@/lib/util";

export const dynamic = "force-dynamic";

const err = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  let p: Record<string, unknown>;
  try {
    p = (req.headers.get("content-type") ?? "").includes("application/json")
      ? await req.json()
      : Object.fromEntries((await req.formData()).entries());
  } catch {
    return err("Invalid request");
  }

  const key = String(p.key ?? "");
  if (!key) return err("Incorrect API key", 401);
  if (limited(`api:${key}`, 120, 60_000)) return err("Too many requests", 429);
  const user = await db.user.findUnique({ where: { apiKey: key } });
  if (!user || !user.active) return err("Incorrect API key", 401);

  const s = await getSettings();
  const cur = s.currency === "৳" ? "BDT" : s.currency === "$" ? "USD" : s.currency;

  switch (String(p.action)) {
    case "services": {
      const list = await db.service.findMany({
        where: { active: true, provider: { active: true } },
        orderBy: { publicId: "asc" },
      });
      return NextResponse.json(
        list.map((x) => ({
          service: x.publicId,
          name: x.name,
          type: "Default",
          category: x.category,
          rate: x.sellRate.toFixed(4),
          min: String(x.min),
          max: String(x.max),
          refill: false,
          cancel: false,
        }))
      );
    }

    case "add": {
      const svc = await db.service.findUnique({ where: { publicId: Number(p.service) || -1 } });
      if (!svc) return err("Incorrect service ID");
      const r = await placeOrder({
        userId: user.id,
        serviceId: svc.id,
        link: String(p.link ?? ""),
        quantity: Number(p.quantity),
        source: "api",
      });
      return r.ok ? NextResponse.json({ order: r.order.publicId }) : err(r.error);
    }

    case "status": {
      const ids = (p.orders ? String(p.orders).split(",") : [String(p.order ?? "")])
        .map((x) => Number(x.trim()))
        .filter((n) => Number.isInteger(n) && n > 0)
        .slice(0, 100);
      if (!ids.length) return err("Incorrect order ID");
      const found = await db.order.findMany({ where: { publicId: { in: ids }, userId: user.id } });
      const fmt = (o: (typeof found)[number]) => ({
        charge: o.charge.toFixed(4),
        start_count: "0",
        status: STATUS_LABEL[o.status] ?? o.status,
        remains: String(o.remains ?? (o.status === "COMPLETED" ? 0 : o.quantity)),
        currency: cur,
      });
      if (!p.orders) {
        const o = found[0];
        return o ? NextResponse.json(fmt(o)) : err("Incorrect order ID");
      }
      const out: Record<string, unknown> = {};
      for (const id of ids) {
        const o = found.find((x) => x.publicId === id);
        out[String(id)] = o ? fmt(o) : { error: "Incorrect order ID" };
      }
      return NextResponse.json(out);
    }

    case "balance":
      return NextResponse.json({ balance: user.balance.toFixed(4), currency: cur });

    default:
      return err("Unknown action");
  }
}
