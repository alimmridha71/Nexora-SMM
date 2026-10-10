import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { Badge, PageTitle, Table } from "@/components/ui";
import { dateTime, money, shortLink } from "@/lib/util";

export const metadata = { title: "Orders" };
const FILTERS = ["PENDING", "IN_PROGRESS", "COMPLETED", "PARTIAL", "CANCELED"] as const;

export default async function Orders({ searchParams }: { searchParams: { status?: string; placed?: string } }) {
  const user = await requireUser();
  const s = await getSettings();
  const f = FILTERS.find((x) => x === searchParams.status);
  const statuses: OrderStatus[] | undefined =
    f === "PENDING" ? ["PENDING", "PENDING_SUBMIT"] : f === "CANCELED" ? ["CANCELED", "FAILED"] : f ? [f] : undefined;
  const orders = await db.order.findMany({
    where: { userId: user.id, ...(statuses ? { status: { in: statuses } } : {}) },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { service: { select: { name: true } } },
  });
  return (
    <>
      <PageTitle title="Orders" />
      {searchParams.placed && (
        <p role="status" className="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Order #{searchParams.placed.replace(/\D/g, "")} placed.
        </p>
      )}
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        {[undefined, ...FILTERS].map((x) => (
          <Link
            key={x ?? "all"}
            href={x ? `/orders?status=${x}` : "/orders"}
            className={`rounded-full border px-3 py-1 ${f === x ? "border-nova-500 bg-nova-500/15 text-nova-400" : "border-ink-600 text-slate-400 hover:text-white"}`}
          >
            {x ? (x === "IN_PROGRESS" ? "In progress" : x[0] + x.slice(1).toLowerCase()) : "All"}
          </Link>
        ))}
      </div>
      {/* Mobile Orders Card List (< md) */}
      <div className="grid gap-3.5 sm:grid-cols-2 md:hidden">
        {orders.length === 0 ? (
          <div className="col-span-full rounded-xl border border-ink-700 bg-ink-800/80 p-8 text-center text-sm text-slate-400">
            No orders found.
          </div>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              className="flex flex-col justify-between rounded-xl border border-ink-700/80 bg-ink-800/90 p-4 shadow-md text-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-semibold text-slate-300">
                    #{o.publicId}
                  </span>
                  <Badge status={o.status} />
                </div>
                <p className="mt-2 font-medium text-white line-clamp-2">
                  {o.service.name}
                </p>
                <div className="mt-2 text-[11px] text-slate-400 truncate">
                  🔗 <a href={o.link} target="_blank" rel="noreferrer noopener" className="underline hover:text-white">
                    {shortLink(o.link, 30)}
                  </a>
                </div>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-ink-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Quantity</span>
                  <span className="font-semibold text-white">{o.quantity.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 block">Charge</span>
                  <span className="font-bold text-gold-400">{money(o.charge.toString(), s.currency)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Orders Table (>= md) */}
      <div className="hidden md:block">
        <Table head={["ID", "Date", "Service", "Link", "Qty", "Remains", "Charge", "Status"]} empty={orders.length ? undefined : "No orders found."}>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="text-slate-400">#{o.publicId}</td>
              <td className="whitespace-nowrap text-slate-400">{dateTime(o.createdAt)}</td>
              <td className="max-w-[240px] truncate">{o.service.name}</td>
              <td className="text-slate-400">
                <a href={o.link} target="_blank" rel="noreferrer noopener" className="hover:text-white">
                  {shortLink(o.link, 26)}
                </a>
              </td>
              <td>{o.quantity.toLocaleString()}</td>
              <td className="text-slate-400">{o.remains ?? "-"}</td>
              <td>{money(o.charge.toString(), s.currency)}</td>
              <td><Badge status={o.status} /></td>
            </tr>
          ))}
        </Table>
      </div>
    </>
  );
}
