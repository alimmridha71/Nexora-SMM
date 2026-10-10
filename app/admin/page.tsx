import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { PageTitle, Panel, Stat, btn, btnGhost } from "@/components/ui";
import { money } from "@/lib/util";
import { StateForm, SubmitButton } from "@/components/forms";
import { syncOrdersNowAction } from "@/app/actions/admin";

export const metadata = { title: "Admin" };

export default async function AdminHome() {
  const s = await getSettings();
  const since = new Date(Date.now() - 24 * 3600 * 1000);
  const okStatuses = ["PENDING_SUBMIT", "PENDING", "IN_PROGRESS", "COMPLETED", "PARTIAL"] as const;
  const [users, orders, today, revenue, pendingPay, stuck, openTickets, wallets] = await Promise.all([
    db.user.count(),
    db.order.count(),
    db.order.count({ where: { createdAt: { gte: since } } }),
    db.order.aggregate({ where: { status: { in: [...okStatuses] } }, _sum: { charge: true } }),
    db.payment.count({ where: { status: "PENDING" } }),
    db.order.count({ where: { status: "PENDING_SUBMIT", createdAt: { lt: new Date(Date.now() - 5 * 60 * 1000) } } }),
    db.ticket.count({ where: { status: "OPEN" } }),
    db.user.aggregate({ _sum: { balance: true } }),
  ]);

  const todo: [string, number, string, string][] = [
    ["Payments to Review", pendingPay, "/admin/payments", "💳"],
    ["Orders Stuck", stuck, "/admin/orders?status=PENDING_SUBMIT", "⚠️"],
    ["Open Tickets", openTickets, "/admin/tickets", "✉️"],
  ];

  return (
    <>
      <PageTitle
        title="Admin Control Center"
        sub="System overview, user balance liabilities, and live order throughput."
        action={
          <div className="flex gap-2">
            <StateForm action={syncOrdersNowAction}>
              <SubmitButton className={btnGhost}>⚡ Sync Orders Now</SubmitButton>
            </StateForm>
            <Link href="/admin/providers" className={btn}>
              + Add Provider
            </Link>
          </div>
        }
      />

      {/* Primary KPI Metrics */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total Users" value={users} tone="nova" sub="Registered accounts" />
        <Stat label="Orders (Last 24h)" value={today} sub="Recent volume" />
        <Stat label="Total Orders" value={orders} sub="All-time orders placed" />
        <Stat label="Delivered Sales" value={money(revenue._sum.charge?.toString() ?? 0, s.currency)} tone="gold" sub="Net revenue" />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="User Wallets Liability" value={money(wallets._sum.balance?.toString() ?? 0, s.currency)} sub="Current user balances" />
      </div>

      {/* Actionable Alerts / Pending Items */}
      <h2 className="mb-4 text-lg font-bold text-white">Action Required</h2>
      <div className="grid max-w-4xl gap-4 sm:grid-cols-3">
        {todo.map(([label, n, href, icon]) => (
          <Link
            key={label}
            href={href}
            className={`group rounded-xl border p-5 transition-all hover:scale-[1.02] ${
              n > 0
                ? "border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                : "border-ink-700 bg-ink-800/80 hover:border-ink-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{icon}</span>
              <span className={`font-display text-3xl font-extrabold ${n > 0 ? "text-amber-300" : "text-white"}`}>
                {n}
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">Click to resolve →</p>
          </Link>
        ))}
      </div>

      {/* Admin Quick Management Links */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-white">Management Shortlinks</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/providers" className="rounded-xl border border-ink-700/80 bg-ink-800/60 p-4 hover:border-nova-500 transition-colors">
            <p className="font-bold text-white">Providers</p>
            <p className="text-xs text-slate-400 mt-1">Manage upstream APIs and sync margins</p>
          </Link>
          <Link href="/admin/services" className="rounded-xl border border-ink-700/80 bg-ink-800/60 p-4 hover:border-nova-500 transition-colors">
            <p className="font-bold text-white">Services</p>
            <p className="text-xs text-slate-400 mt-1">Set resale rates, hide/show services</p>
          </Link>
          <Link href="/admin/payments" className="rounded-xl border border-ink-700/80 bg-ink-800/60 p-4 hover:border-nova-500 transition-colors">
            <p className="font-bold text-white">Payments</p>
            <p className="text-xs text-slate-400 mt-1">Approve bKash/Nagad/Rocket deposits</p>
          </Link>
          <Link href="/admin/settings" className="rounded-xl border border-ink-700/80 bg-ink-800/60 p-4 hover:border-nova-500 transition-colors">
            <p className="font-bold text-white">Settings</p>
            <p className="text-xs text-slate-400 mt-1">Update payment numbers & site name</p>
          </Link>
        </div>
      </div>
    </>
  );
}
