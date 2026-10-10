import { db } from "./db";

export const DEFAULT_SETTINGS = {
  siteName: "Nexora SMM",
  currency: "৳",
  minDeposit: "100",
  supportEmail: "support@example.com",
  bkashNumber: "",
  nagadNumber: "",
  rocketNumber: "",
  binanceId: "",
  paymentNote: "Send the exact amount, then submit your Transaction ID below. Funds are added after we verify it.",
};
export type Settings = typeof DEFAULT_SETTINGS;

export async function getSettings(): Promise<Settings> {
  const out: Settings = { ...DEFAULT_SETTINGS };
  try {
    const rows = await db.setting.findMany();
    for (const r of rows) if (r.key in out) (out as Record<string, string>)[r.key] = r.value;
  } catch {
    /* db not ready (e.g. during build) -> defaults */
  }
  return out;
}

export function paymentMethods(s: Settings) {
  return [
    { id: "bKash", label: "bKash", to: s.bkashNumber },
    { id: "Nagad", label: "Nagad", to: s.nagadNumber },
    { id: "Rocket", label: "Rocket", to: s.rocketNumber },
    { id: "Binance", label: "Binance Pay", to: s.binanceId },
  ].filter((m) => m.to);
}
