import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { Badge, PageTitle, Panel, Stat, Table, btn, btnGhost } from "@/components/ui";
import { money, shortLink } from "@/lib/util";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const user = await requireUser();
  const s = await getSettings();
  const [count, active, spent, recent] = await Promise.all([
    db.order.count({ where: { userId: user.id } }),
    db.order.count({ where: { userId: user.id, status: { in: ["PENDING_SUBMIT", "PENDING", "IN_PROGRESS"] } } }),
    db.order.aggregate({
      where: { userId: user.id, status: { in: ["PENDING_SUBMIT", "PENDING", "IN_PROGRESS", "COMPLETED", "PARTIAL"] } },
      _sum: { charge: true },
    }),
    db.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 8, include: { service: true } }),
  ]);

  return (
    <>
      <PageTitle
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        sub={`Manage your wallet, active orders, and social media growth campaigns.`}
        action={
          <div className="flex gap-2">
            <Link href="/add-funds" className={btnGhost}>
              Add Funds
            </Link>
            <Link href="/new-order" className={btn}>
              + New Order
            </Link>
          </div>
        }
      />

      {/* Metrics Bar */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Current Balance" value={money(user.balance.toString(), s.currency)} tone="gold" sub="Available in wallet" />
        <Stat label="Active Orders" value={active} tone="nova" sub="In queue / running" />
        <Stat label="Total Orders" value={count} sub="All time placed" />
        <Stat label="Total Spent" value={money(spent._sum.charge?.toString() ?? 0, s.currency)} sub="Delivered orders" />
      </div>

      {/* Quick Action Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/new-order"
          className="group rounded-xl border border-ink-700/80 bg-ink-800/80 p-5 transition-all hover:border-nova-500 hover:shadow-lg hover:shadow-nova-500/10"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-nova-500/15 text-xl">🚀</span>
            <div>
              <p className="font-bold text-white group-hover:text-nova-400 transition-colors">Place New Order</p>
              <p className="text-xs text-slate-400">Order likes, views, followers</p>
            </div>
          </div>
        </Link>

        <Link
          href="/add-funds"
          className="group rounded-xl border border-ink-700/80 bg-ink-800/80 p-5 transition-all hover:border-gold-500/60 hover:shadow-lg hover:shadow-gold-500/10"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/15 text-xl">💳</span>
            <div>
              <p className="font-bold text-white group-hover:text-gold-400 transition-colors">Deposit Funds</p>
              <p className="text-xs text-slate-400">bKash, Nagad, Rocket, Binance</p>
            </div>
          </div>
        </Link>

        <Link
          href="/services"
          className="group rounded-xl border border-ink-700/80 bg-ink-800/80 p-5 transition-all hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/10"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-xl">📋</span>
            <div>
              <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">View Price List</p>
              <p className="text-xs text-slate-400">Browse all 500+ services</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Recent Orders</h2>
        <Link href="/orders" className="text-xs font-medium text-nova-400 hover:underline">
          View all orders →
        </Link>
      </div>

      <Table
        head={["ID", "Service", "Target Link", "Quantity", "Charge", "Status"]}
        empty={recent.length ? undefined : "No orders yet. Place your first order to get started!"}
      >
        {recent.map((o) => (
          <tr key={o.id}>
            <td className="font-mono text-xs text-slate-400">#{o.publicId}</td>
            <td className="max-w-[260px] truncate font-medium text-white">{o.service.name}</td>
            <td className="text-slate-400 text-xs">
              <a href={o.link} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
                {shortLink(o.link, 28)}
              </a>
            </td>
            <td className="font-semibold text-white">{o.quantity.toLocaleString()}</td>
            <td className="font-semibold text-gold-400">{money(o.charge.toString(), s.currency)}</td>
            <td>
              <Badge status={o.status} />
            </td>
          </tr>
        ))}
      </Table>

      <Panel className="mt-8 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-slate-400">
            Need urgent assistance or have questions regarding an order?
          </p>
          <Link href="/tickets" className="rounded-lg bg-ink-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-nova-500 transition-colors">
            Open Support Ticket
          </Link>
        </div>
      </Panel>
    </>
  );
}
