import { db } from "./db";

export const DEFAULT_SETTINGS = {
  siteName: "Nexora SMM",
  currency: "৳",
  minDeposit: "100",
  supportEmail: "support@example.com",
  bkashNumber: "01716779220",
  nagadNumber: "",
  rocketNumber: "",
  binanceId: "",
  paymentNote: "Send Money (Personal) to the number below, then submit your Transaction ID (TrxID). Funds will be added after verification.",
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
    { id: "bKash", label: "bKash", type: "Personal (Send Money)", to: s.bkashNumber },
    { id: "Nagad", label: "Nagad", type: "Personal (Send Money)", to: s.nagadNumber },
    { id: "Rocket", label: "Rocket", type: "Personal (Send Money)", to: s.rocketNumber },
    { id: "Binance", label: "Binance Pay", type: "Pay ID", to: s.binanceId },
  ].filter((m) => m.to);
}
