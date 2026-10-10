import { ReactNode } from "react";
import { STATUS_LABEL } from "@/lib/util";
export { CopyButton } from "./copy-button";

export const inp =
  "w-full rounded-lg border border-ink-600 bg-ink-900/90 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-nova-500 focus:ring-1 focus:ring-nova-500 transition-all";
export const btn =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-nova-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-nova-600 hover:shadow-lg hover:shadow-nova-500/25 active:scale-[0.98] disabled:opacity-60";
export const btnGhost =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-ink-600 bg-ink-800/60 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-nova-500 hover:text-white hover:bg-ink-700 disabled:opacity-60";
export const btnDanger =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3.5 py-1.5 text-xs font-medium text-rose-300 transition-all hover:bg-rose-500/20 disabled:opacity-60";

export function Logo({ name = "Nexora SMM" }: { name?: string }) {
  return (
    <span className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-white group">
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-nova-600 to-nova-400 p-0.5 shadow-md shadow-nova-500/30 group-hover:shadow-nova-500/50 transition-shadow">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" fillOpacity="0.15" />
        </svg>
      </div>
      <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
        {name}
      </span>
    </span>
  );
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-ink-700/60 pb-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1.5 text-sm text-slate-400 max-w-2xl leading-relaxed">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-ink-700/80 bg-ink-800/80 shadow-lg shadow-black/20 backdrop-blur-sm ${className}`}>
      {children}
    </section>
  );
}

export function Stat({ label, value, tone, sub }: { label: string; value: ReactNode; tone?: "gold" | "emerald" | "nova"; sub?: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-ink-700/80 bg-gradient-to-br from-ink-800/90 to-ink-900/90 p-5 shadow-lg shadow-black/20 transition-all hover:border-ink-600">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p
        className={`mt-2 font-display text-2xl font-bold sm:text-3xl ${
          tone === "gold"
            ? "text-gold-400"
            : tone === "emerald"
            ? "text-emerald-400"
            : tone === "nova"
            ? "text-nova-400"
            : "text-white"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

const TONE: Record<string, { bg: string; text: string; dot: string }> = {
  COMPLETED: { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-300", dot: "bg-emerald-400" },
  APPROVED: { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-300", dot: "bg-emerald-400" },
  IN_PROGRESS: { bg: "bg-nova-500/10 border-nova-500/30", text: "text-nova-300", dot: "bg-nova-400 animate-pulse" },
  ANSWERED: { bg: "bg-nova-500/10 border-nova-500/30", text: "text-nova-300", dot: "bg-nova-400" },
  PENDING: { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-300", dot: "bg-amber-400" },
  PENDING_SUBMIT: { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-300", dot: "bg-amber-400" },
  OPEN: { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-300", dot: "bg-amber-400" },
  PARTIAL: { bg: "bg-orange-500/10 border-orange-500/30", text: "text-orange-300", dot: "bg-orange-400" },
  CANCELED: { bg: "bg-rose-500/10 border-rose-500/30", text: "text-rose-300", dot: "bg-rose-400" },
  FAILED: { bg: "bg-rose-500/10 border-rose-500/30", text: "text-rose-300", dot: "bg-rose-400" },
  REJECTED: { bg: "bg-rose-500/10 border-rose-500/30", text: "text-rose-300", dot: "bg-rose-400" },
  CLOSED: { bg: "bg-slate-500/10 border-slate-500/30", text: "text-slate-400", dot: "bg-slate-400" },
};

export function Badge({ status, raw }: { status: string; raw?: boolean }) {
  const t = TONE[status] ?? { bg: "bg-slate-500/10 border-slate-500/30", text: "text-slate-400", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${t.bg} ${t.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
      {raw ? status : STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ink-700/80 bg-ink-800/80 shadow-lg shadow-black/20">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink-700 bg-ink-900/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {head.map((h) => (
              <th key={h} className="px-4 py-3.5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-700/60 [&>tr>td]:px-4 [&>tr>td]:py-3.5 [&>tr>td]:align-middle hover:[&>tr]:bg-ink-700/30 transition-colors">
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
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-slate-500 leading-normal">{hint}</span>}
    </label>
  );
}
