import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getSettings, paymentMethods } from "@/lib/settings";
import { Badge, CopyButton, Field, PageTitle, Panel, Table, inp } from "@/components/ui";
import { StateForm, SubmitButton } from "@/components/forms";
import { submitPaymentAction } from "@/app/actions/user";
import { dateTime, money } from "@/lib/util";

export const metadata = { title: "Add funds" };

const METHOD_THEMES: Record<string, { bg: string; text: string; icon: string }> = {
  bKash: { bg: "bg-[#e2136e]/15 border-[#e2136e]/40", text: "text-[#ff4081]", icon: "🌸" },
  Nagad: { bg: "bg-[#f7941d]/15 border-[#f7941d]/40", text: "text-[#f7941d]", icon: "🟠" },
  Rocket: { bg: "bg-[#8c3494]/15 border-[#8c3494]/40", text: "text-[#ba68c8]", icon: "🚀" },
  Binance: { bg: "bg-[#f3ba2f]/15 border-[#f3ba2f]/40", text: "text-[#f3ba2f]", icon: "🟡" },
};

export default async function AddFunds() {
  const user = await requireUser();
  const s = await getSettings();
  const methods = paymentMethods(s);
  const history = await db.payment.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 30 });

  return (
    <>
      <PageTitle title="Add Funds" sub={s.paymentNote} />

      {methods.length === 0 ? (
        <Panel className="p-8 text-center text-slate-400">
          <p className="text-base font-semibold text-white">Payment methods are currently updating.</p>
          <p className="mt-1 text-sm text-slate-500">Contact support at {s.supportEmail} for manual deposits.</p>
        </Panel>
      ) : (
        <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
          {/* Step 1: Send Money */}
          <Panel className="p-6">
            <div className="mb-4 flex items-center justify-between border-b border-ink-700/80 pb-3">
              <h2 className="text-base font-bold text-white">Step 1: Send Money to Number</h2>
              <span className="rounded bg-nova-500/15 px-2 py-0.5 text-xs font-semibold text-nova-300">
                Send Money / Cash In
              </span>
            </div>

            <ul className="space-y-3">
              {methods.map((m) => {
                const theme = METHOD_THEMES[m.id] ?? { bg: "bg-ink-700/60 border-ink-600", text: "text-white", icon: "💳" };
                return (
                  <li
                    key={m.id}
                    className={`flex items-center justify-between rounded-xl border p-3.5 transition-all ${theme.bg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{theme.icon}</span>
                      <div>
                        <span className={`block font-bold text-sm ${theme.text}`}>{m.label}</span>
                        <b className="font-mono text-sm tracking-wider text-white select-all">{m.to}</b>
                      </div>
                    </div>
                    <CopyButton text={m.to} label="Copy" />
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 rounded-lg border border-gold-500/30 bg-gold-500/10 p-3.5 text-xs text-gold-300">
              ⚡ <b>Minimum Deposit:</b> {money(s.minDeposit, s.currency, 0)}
              <br />
              Funds will be credited automatically once the Transaction ID is verified by our team.
            </div>
          </Panel>

          {/* Step 2: Submit TrxID */}
          <Panel className="p-6">
            <div className="mb-4 border-b border-ink-700/80 pb-3">
              <h2 className="text-base font-bold text-white">Step 2: Submit Transaction ID</h2>
              <p className="text-xs text-slate-400 mt-1">Enter the exact TrxID you received in the SMS/Receipt.</p>
            </div>

            <StateForm action={submitPaymentAction} className="space-y-4">
              <Field label="Selected Gateway">
                <select name="method" className={inp}>
                  {methods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} ({m.to})
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={`Amount Sent (${s.currency})`}>
                <input
                  name="amount"
                  type="number"
                  step="any"
                  min={Number(s.minDeposit)}
                  required
                  placeholder={`Min ${s.minDeposit}`}
                  className={inp}
                />
              </Field>

              <Field label="Transaction ID (TrxID)" hint="Letters and numbers only (e.g. BL92A4KF9)">
                <input
                  name="trxId"
                  required
                  maxLength={40}
                  placeholder="Enter TrxID"
                  className={`${inp} font-mono uppercase tracking-wider`}
                />
              </Field>

              <Field label="Note (optional)" hint="Sender number or reference (optional)">
                <input name="note" maxLength={200} placeholder="e.g. 017xxxxxxxx" className={inp} />
              </Field>

              <SubmitButton className="w-full">Submit Payment Verification</SubmitButton>
            </StateForm>
          </Panel>
        </div>
      )}

      {/* Payment History */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-white">Your Deposit History</h2>
        <Table
          head={["Date", "Method", "Transaction ID", "Amount", "Status"]}
          empty={history.length ? undefined : "No payments submitted yet."}
        >
          {history.map((p) => (
            <tr key={p.id}>
              <td className="whitespace-nowrap text-slate-400">{dateTime(p.createdAt)}</td>
              <td className="font-semibold text-white">{p.method}</td>
              <td className="font-mono text-xs text-slate-300">{p.trxId}</td>
              <td className="font-semibold text-gold-400">{money(p.amount.toString(), s.currency)}</td>
              <td>
                <Badge status={p.status} />
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </>
  );
}
