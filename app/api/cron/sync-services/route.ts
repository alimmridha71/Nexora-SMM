import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { syncProviderServices } from "@/lib/sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const providers = await db.provider.findMany({ where: { active: true } });
  const results: Record<string, unknown> = {};
  for (const p of providers) {
    try {
      results[p.name] = await syncProviderServices(p.id);
    } catch (e) {
      results[p.name] = { error: e instanceof Error ? e.message : "failed" };
    }
  }
  return NextResponse.json(results);
}
