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
    </>
  );
}
