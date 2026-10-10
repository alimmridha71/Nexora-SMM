import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { Badge, PageTitle, Table, btnDanger, btnGhost, inp } from "@/components/ui";
import { StateForm, SubmitButton } from "@/components/forms";
import { cancelRefundOrderAction, markCompletedOrderAction, retrySubmitOrderAction, syncOrdersNowAction } from "@/app/actions/admin";
import { dateTime, money, shortLink } from "@/lib/util";

export const metadata = { title: "Orders" };
const PAGE = 50;
const STATUSES = Object.values(OrderStatus);

export default async function AdminOrders({ searchParams }: { searchParams: { status?: string; q?: string; page?: string } }) {
  const s = await getSettings();
  const status = STATUSES.find((x) => x === searchParams.status);
  const q = (searchParams.q ?? "").trim();
  const page = Math.max(1, Number(searchParams.page) || 1);
  const where = {
    ...(status ? { status } : {}),
    ...(q ? (/^\d+$/.test(q) ? { publicId: Number(q) } : { user: { email: { contains: q, mode: "insensitive" as const } } }) : {}),
  };
  const [orders, total] = await Promise.all([
    db.order.findMany({
      where, orderBy: { createdAt: "desc" }, take: PAGE, skip: (page - 1) * PAGE,
      include: { user: { select: { email: true } }, service: { select: { name: true, provider: { select: { name: true } } } } },
    }),
    db.order.count({ where }),
  ]);
  const qs = (p: number) => `/admin/orders?status=${status ?? ""}&q=${encodeURIComponent(q)}&page=${p}`;
  return (
    <>
      <PageTitle
        title="Orders"
        sub={`${total} matching`}
        action={
          <StateForm action={syncOrdersNowAction}>
            <SubmitButton className={btnGhost}>Sync statuses now</SubmitButton>
          </StateForm>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <Link href="/admin/orders" className={`rounded-full border px-3 py-1 ${!status ? "border-nova-500 text-nova-400" : "border-ink-600 text-slate-400"}`}>All</Link>
        {STATUSES.map((x) => (
          <Link key={x} href={`/admin/orders?status=${x}`} className={`rounded-full border px-3 py-1 ${status === x ? "border-nova-500 text-nova-400" : "border-ink-600 text-slate-400 hover:text-white"}`}>
            {x.replace("_", " ").toLowerCase()}
          </Link>
        ))}
        <form className="ml-auto flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Order ID or user email" className={`${inp} w-56`} />
          <button className={btnGhost}>Search</button>
        </form>
      </div>
      <Table head={["ID", "User", "Service", "Link", "Qty", "Charge", "Status", "Actions"]} empty={orders.length ? undefined : "No orders found."}>
        {orders.map((o) => {
          const open = o.status === "PENDING_SUBMIT" || o.status === "PENDING" || o.status === "IN_PROGRESS";
          return (
            <tr key={o.id}>
              <td className="text-slate-400">
                #{o.publicId}
                <p className="text-xs">{dateTime(o.createdAt)}</p>
                {o.source === "api" && <p className="text-xs text-nova-400">via API</p>}
              </td>
              <td className="text-xs">{o.user.email}</td>
              <td className="max-w-[220px]">
                <p className="truncate">{o.service.name}</p>
                <p className="text-xs text-slate-500">{o.service.provider.name}{o.providerOrderId ? ` · #${o.providerOrderId}` : ""}</p>
              </td>
              <td className="text-xs text-slate-400">{shortLink(o.link, 24)}</td>
              <td>{o.quantity.toLocaleString()}</td>
              <td className="whitespace-nowrap">{money(o.charge.toString(), s.currency)}</td>
              <td><Badge status={o.status} /></td>
              <td>
                {open && (
                  <div className="flex flex-wrap gap-1.5">
                    {o.status === "PENDING_SUBMIT" && (
                      <form action={retrySubmitOrderAction}>
                        <input type="hidden" name="id" value={o.id} />
                        <button className={btnGhost} title="Only if you confirmed the provider did NOT receive it">Retry send</button>
                      </form>
                    )}
                    <form action={cancelRefundOrderAction}>
                      <input type="hidden" name="id" value={o.id} />
                      <button className={btnDanger}>Cancel + refund</button>
                    </form>
                    {o.status !== "PENDING_SUBMIT" && (
                      <form action={markCompletedOrderAction}>
                        <input type="hidden" name="id" value={o.id} />
                        <button className={btnGhost}>Mark done</button>
                      </form>
                    )}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </Table>
      <div className="mt-4 flex gap-3 text-sm">
        {page > 1 && <Link className="text-nova-400" href={qs(page - 1)}>Previous</Link>}
        {page * PAGE < total && <Link className="text-nova-400" href={qs(page + 1)}>Next</Link>}
      </div>
    </>
  );
}
