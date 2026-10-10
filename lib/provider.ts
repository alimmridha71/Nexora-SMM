import { decrypt } from "./crypto";

/** Provider explicitly refused (safe to refund). Network/timeout errors are NOT this class. */
export class ProviderRejected extends Error {}

type P = { apiUrl: string; apiKeyEnc: string };

export async function providerCall(p: P, action: string, params: Record<string, string | number> = {}) {
  const body = new URLSearchParams({ key: decrypt(p.apiKeyEnc), action });
  for (const [k, v] of Object.entries(params)) body.set(k, String(v));

  const res = await fetch(p.apiUrl, { method: "POST", body, signal: AbortSignal.timeout(20_000), cache: "no-store" });
  if (!res.ok) throw new Error(`Provider HTTP ${res.status}`);
  const data = await res.json();
  if (data && !Array.isArray(data) && data.error) throw new ProviderRejected(String(data.error));
  return data;
}
