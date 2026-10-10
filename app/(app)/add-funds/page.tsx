import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getSettings, paymentMethods } from "@/lib/settings";
import { Badge, CopyButton, PageTitle, Table } from "@/components/ui";
import { dateTime, money } from "@/lib/util";
import { PaymentClient } from "./payment-client";

export const metadata = { title: "Add funds - Nexora SMM" };

export default async function AddFunds() {
  const user = await requireUser();
  const s = await getSettings();
  const methods = paymentMethods(s);
  const history = await db.payment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const pendingPayments = history.filter((p) => p.status === "PENDING");

  return (
    <div className="space-y-8">
      <PageTitle
        title="Add Funds (ডিপোজিট)"
        sub={s.paymentNote || "Send Money to the bKash number below, then submit your Transaction ID (TrxID)."}
      />

      {/* Pending Notice Banner if user has payments under review */}
      {pendingPayments.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300">
          <div className="flex items-center gap-2 font-bold text-amber-200">
            <span>⏳</span> You have {pendingPayments.length} deposit{pendingPayments.length > 1 ? "s" : ""} waiting for admin review:
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {pendingPayments.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-ink-900/80 px-2.5 py-1 font-mono text-[11px]"
              >
                <span>{p.method}</span> • <b>{money(p.amount.toString(), s.currency)}</b> • TrxID: {p.trxId}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Payment Interactive Component */}
      <PaymentClient
        methods={methods}
        currency={s.currency}
        minDeposit={s.minDeposit}
        supportEmail={s.supportEmail}
        paymentNote={s.paymentNote}
      />

      {/* Payment History */}
      <div className="mt-12 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Deposit History (লেনদেনের ইতিহাস)</h2>
            <p className="text-xs text-slate-400">Track all your submitted manual deposits and verification status.</p>
          </div>
          <span className="text-xs text-slate-500">Last 30 deposits</span>
        </div>

        <Table
          head={["Date", "Method", "Transaction ID", "Amount", "Note / Sender", "Status"]}
          empty={history.length ? undefined : "No payments submitted yet. Make your first deposit above!"}
        >
          {history.map((p) => (
            <tr key={p.id}>
              <td className="whitespace-nowrap text-slate-400">{dateTime(p.createdAt)}</td>
              <td className="font-semibold text-white">
                <span className="inline-flex items-center gap-1.5">
                  {p.method === "bKash" && <span className="text-[#ff4081]">🌸</span>}
                  {p.method === "Nagad" && <span>🟠</span>}
                  {p.method === "Rocket" && <span>🚀</span>}
                  {p.method === "Binance" && <span>🟡</span>}
                  {p.method}
                </span>
              </td>
              <td className="font-mono text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="select-all font-bold">{p.trxId}</span>
                  <CopyButton text={p.trxId} label="Copy" className="px-1.5 py-0.5 text-[10px]" />
                </div>
              </td>
              <td className="font-semibold text-gold-400 whitespace-nowrap">
                {money(p.amount.toString(), s.currency)}
              </td>
              <td className="text-xs text-slate-400 max-w-[160px] truncate">
                {p.note || "—"}
              </td>
              <td>
                <Badge status={p.status} />
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
