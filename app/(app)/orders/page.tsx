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
        <p role="status" className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Order #{searchParams.placed.replace(/\D/g, "")} placed successfully!
        </p>
      )}
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        {[undefined, ...FILTERS].map((x) => (
          <Link
            key={x ?? "all"}
            href={x ? `/orders?status=${x}` : "/orders"}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              f === x
                ? "border-blue-300 bg-blue-50 text-blue-700 font-semibold shadow-2xs"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {x ? (x === "IN_PROGRESS" ? "In progress" : x[0] + x.slice(1).toLowerCase()) : "All"}
          </Link>
        ))}
      </div>
      {/* Mobile Orders Card List (< md) */}
      <div className="grid gap-3.5 sm:grid-cols-2 md:hidden">
        {orders.length === 0 ? (
          <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-xs">
            No orders found.
          </div>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs text-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-semibold text-slate-600">
                    #{o.publicId}
                  </span>
                  <Badge status={o.status} />
                </div>
                <p className="mt-2 font-medium text-slate-900 line-clamp-2">
                  {o.service.name}
                </p>
                <div className="mt-2 text-[11px] text-slate-500 truncate">
                  🔗 <a href={o.link} target="_blank" rel="noreferrer noopener" className="underline hover:text-blue-600">
                    {shortLink(o.link, 30)}
                  </a>
                </div>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Quantity</span>
                  <span className="font-semibold text-slate-900">{o.quantity.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-500 block">Charge</span>
                  <span className="font-bold text-amber-700">{money(o.charge.toString(), s.currency)}</span>
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
              <td className="text-slate-500">#{o.publicId}</td>
              <td className="whitespace-nowrap text-slate-500">{dateTime(o.createdAt)}</td>
              <td className="max-w-[240px] truncate font-medium text-slate-900">{o.service.name}</td>
              <td className="text-slate-500">
                <a href={o.link} target="_blank" rel="noreferrer noopener" className="hover:text-blue-600 underline">
                  {shortLink(o.link, 26)}
                </a>
              </td>
              <td className="font-semibold text-slate-900">{o.quantity.toLocaleString()}</td>
              <td className="text-slate-500">{o.remains ?? "-"}</td>
              <td className="font-bold text-amber-700 whitespace-nowrap">{money(o.charge.toString(), s.currency)}</td>
              <td><Badge status={o.status} /></td>
            </tr>
          ))}
        </Table>
      </div>
    </>
  );
}
