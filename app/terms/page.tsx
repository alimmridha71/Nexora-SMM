import Link from "next/link";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "Terms" };

export default async function Terms() {
  const s = await getSettings();
  const items = [
    ["Platform rules", "Social platforms such as YouTube and Facebook have their own rules about artificial engagement. Orders can be removed, reduced or flagged by the platform at any time, and accounts can be limited or closed. You place orders at your own risk."],
    ["No guarantees", "We pass your order to our supply partners. We cannot guarantee delivery speed, retention, or that any result will count toward monetization or eligibility programs."],
    ["Refunds", "Canceled orders are refunded in full to your wallet. Partial orders are refunded for the undelivered quantity. Completed orders are not refundable."],
    ["Your account", "Keep your password and API key private. You are responsible for orders placed with them."],
    ["Deposits", "Deposits are credited after we verify the payment. Wallet balance is for buying services and is not paid out as cash."],
    ["Support", `Questions: ${s.supportEmail}`],
  ];
  return (
    <main className="mx-auto max-w-2xl px-5 py-14">
      <Link href="/" className="text-sm text-nova-400 hover:underline">Back to {s.siteName}</Link>
      <h1 className="mt-4 text-3xl font-semibold">Terms of service</h1>
      <div className="mt-8 space-y-6">
        {items.map(([t, d]) => (
          <section key={t}>
            <h2 className="text-lg font-semibold">{t}</h2>
            <p className="mt-1.5 leading-relaxed text-slate-400">{d}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
