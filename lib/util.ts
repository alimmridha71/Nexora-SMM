export const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export function money(v: unknown, cur = "৳", digits = 2) {
  const n = Number(v);
  return `${cur}${(Number.isFinite(n) ? n : 0).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

export function dateTime(d: Date | string) {
  return new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

export function shortLink(l: string, n = 38) {
  return l.length > n ? l.slice(0, n) + "…" : l;
}

export const STATUS_LABEL: Record<string, string> = {
  PENDING_SUBMIT: "Pending",
  PENDING: "Pending",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  PARTIAL: "Partial",
  CANCELED: "Canceled",
  FAILED: "Canceled",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  OPEN: "Open",
  ANSWERED: "Answered",
  CLOSED: "Closed",
};
