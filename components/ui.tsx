import { ReactNode } from "react";
import { STATUS_LABEL } from "@/lib/util";
export { CopyButton } from "./copy-button";

export const inp =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-nova-500 focus:ring-1 focus:ring-nova-500 transition-all shadow-xs";
export const btn =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-nova-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-nova-600 hover:shadow-lg hover:shadow-nova-500/25 active:scale-[0.98] disabled:opacity-60 shadow-xs";
export const btnGhost =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-all hover:border-nova-500 hover:text-nova-600 hover:bg-slate-50 disabled:opacity-60 shadow-2xs";
export const btnDanger =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-medium text-rose-700 transition-all hover:bg-rose-100 disabled:opacity-60";

export function Logo({
  name = "Nexora SMM",
  showText = true,
  size = "md",
}: {
  name?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dims = size === "lg" ? 44 : size === "sm" ? 28 : 36;
  const sizeClass = size === "lg" ? "h-11 w-11" : size === "sm" ? "h-7 w-7" : "h-9 w-9";

  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5 font-display text-base sm:text-lg font-bold tracking-tight text-slate-900 group select-none shrink-0">
      <img
        src="/logo.png"
        alt={`${name} - Social Media Marketing Panel`}
        width={dims}
        height={dims}
        className={`${sizeClass} rounded-xl object-contain shadow-xs border border-slate-200/90 group-hover:scale-105 transition-transform duration-200 shrink-0`}
      />
      {showText && (
        <span className="text-slate-900 font-extrabold tracking-tight whitespace-nowrap">
          {name}
        </span>
      )}
    </span>
  );
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1.5 text-sm text-slate-500 max-w-2xl leading-relaxed">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-xs ${className}`}>
      {children}
    </section>
  );
}

export function Stat({ label, value, tone, sub }: { label: string; value: ReactNode; tone?: "gold" | "emerald" | "nova"; sub?: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p
        className={`mt-2 font-display text-2xl font-bold sm:text-3xl ${
          tone === "gold"
            ? "text-amber-600"
            : tone === "emerald"
            ? "text-emerald-600"
            : tone === "nova"
            ? "text-nova-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

const TONE: Record<string, { bg: string; text: string; dot: string }> = {
  COMPLETED: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700 font-semibold", dot: "bg-emerald-500" },
  APPROVED: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700 font-semibold", dot: "bg-emerald-500" },
  IN_PROGRESS: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700 font-semibold", dot: "bg-blue-500 animate-pulse" },
  ANSWERED: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700 font-semibold", dot: "bg-blue-500" },
  PENDING: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700 font-semibold", dot: "bg-amber-500" },
  PENDING_SUBMIT: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700 font-semibold", dot: "bg-amber-500" },
  OPEN: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700 font-semibold", dot: "bg-amber-500" },
  PARTIAL: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700 font-semibold", dot: "bg-orange-500" },
  CANCELED: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700 font-semibold", dot: "bg-rose-500" },
  FAILED: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700 font-semibold", dot: "bg-rose-500" },
  REJECTED: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700 font-semibold", dot: "bg-rose-500" },
  CLOSED: { bg: "bg-slate-100 border-slate-200", text: "text-slate-600 font-semibold", dot: "bg-slate-400" },
};

export function Badge({ status, raw }: { status: string; raw?: boolean }) {
  const t = TONE[status] ?? { bg: "bg-slate-100 border-slate-200", text: "text-slate-600 font-semibold", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${t.bg} ${t.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
      {raw ? status : STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-600">
            {head.map((h) => (
              <th key={h} className="px-4 py-3.5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-800 [&>tr>td]:px-4 [&>tr>td]:py-3.5 [&>tr>td]:align-middle hover:[&>tr]:bg-slate-50/70 transition-colors">
          {children}
        </tbody>
      </table>
      {empty && <p className="px-4 py-12 text-center text-sm text-slate-500">{empty}</p>}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-slate-500 leading-normal">{hint}</span>}
    </label>
  );
}
