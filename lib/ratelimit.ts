// Best-effort in-memory limiter (per server instance). On serverless, use Upstash Ratelimit for strict limits.
const hits = new Map<string, number[]>();

export function limited(key: string, max = 8, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}
