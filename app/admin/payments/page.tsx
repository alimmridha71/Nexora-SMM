import Link from "next/link";
import { PaymentStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { Badge, PageTitle, Table, btnDanger, btnGhost } from "@/components/ui";
import { approvePaymentAction, rejectPaymentAction } from "@/app/actions/admin";
import { dateTime, money } from "@/lib/util";

export const metadata = { title: "Payments" };
const TABS = Object.values(PaymentStatus);

export default async function AdminPayments({ searchParams }: { searchParams: { status?: string } }) {
  const s = await getSettings();
  const status = TABS.find((x) => x === searchParams.status) ?? "PENDING";
  const payments = await db.payment.findMany({ where: { status }, orderBy: { createdAt: "desc" }, take: 100, include: { user: { select: { email: true } } } });
  return (
    <>
      <PageTitle title="Payments" sub="Check the Transaction ID in your bKash / Nagad / Binance app before approving." />
      <div className="mb-4 flex gap-2 text-sm">
        {TABS.map((t) => (
          <Link key={t} href={`/admin/payments?status=${t}`} className={`rounded-full border px-3 py-1 ${status === t ? "border-nova-500 bg-nova-500/15 text-nova-400" : "border-ink-600 text-slate-400 hover:text-white"}`}>
            {t[0] + t.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>
      <Table head={["Date", "User", "Method", "Transaction ID", "Amount", "Note", status === "PENDING" ? "Action" : "Status"]} empty={payments.length ? undefined : "Nothing here."}>
        {payments.map((p) => (
          <tr key={p.id}>
            <td className="whitespace-nowrap text-slate-400">{dateTime(p.createdAt)}</td>
            <td className="text-xs">{p.user.email}</td>
            <td>{p.method}</td>
            <td className="select-all font-mono text-xs">{p.trxId}</td>
            <td className="whitespace-nowrap text-gold-400">{money(p.amount.toString(), s.currency)}</td>
            <td className="max-w-[200px] text-xs text-slate-400">{p.note}</td>
            <td>
              {p.status === "PENDING" ? (
                <div className="flex gap-2">
                  <form action={approvePaymentAction}><input type="hidden" name="id" value={p.id} /><button className={btnGhost}>Approve</button></form>
                  <form action={rejectPaymentAction}><input type="hidden" name="id" value={p.id} /><button className={btnDanger}>Reject</button></form>
                </div>
              ) : (
                <Badge status={p.status} />
              )}
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
