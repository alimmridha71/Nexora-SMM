import Link from "next/link";
import { PageTitle, Panel } from "@/components/ui";

export const metadata = {
  title: "Admin Guide - Nexora SMM",
  description: "Master administrative operations and configuration guide for Nexora SMM.",
};

export default function AdminGuidePage() {
  return (
    <div className="space-y-8">
      <PageTitle
        title="Admin Operations Manual & Guide"
        sub="Complete administrative guide for managing providers, services, payments, orders, and system configurations."
        action={
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 rounded-lg bg-nova-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-nova-500/25 transition-all hover:bg-nova-600 active:scale-95"
          >
            ⚙️ Open Settings
          </Link>
        }
      />

      {/* Admin Quick Checklist */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-ink-700/80 bg-ink-800/80 p-5 shadow-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/15 text-xl text-gold-400">
            ⚙️
          </div>
          <h2 className="mt-3 text-base font-semibold text-white">1. Site Settings</h2>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            Configure site name, currency (৳ or $), support email, and payment numbers.
          </p>
        </div>

        <div className="rounded-xl border border-ink-700/80 bg-ink-800/80 p-5 shadow-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nova-500/15 text-xl text-nova-400">
            🔌
          </div>
          <h2 className="mt-3 text-base font-semibold text-white">2. Add Providers</h2>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            Add wholesale provider APIs. Set profit margin (e.g. 30%) & rate multiplier.
          </p>
        </div>

        <div className="rounded-xl border border-ink-700/80 bg-ink-800/80 p-5 shadow-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-xl text-emerald-400">
            💳
          </div>
          <h2 className="mt-3 text-base font-semibold text-white">3. Approve Payments</h2>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            Verify user TrxID in your bKash/Nagad app and approve deposits in 1 click.
          </p>
        </div>

        <div className="rounded-xl border border-ink-700/80 bg-ink-800/80 p-5 shadow-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/15 text-xl text-cyan-400">
            📦
          </div>
          <h2 className="mt-3 text-base font-semibold text-white">4. Manage Orders</h2>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
            Monitor live orders, handle stuck orders, and manage provider syncs.
          </p>
        </div>
      </div>

      {/* Section 1: Settings & Numbers */}
      <Panel className="p-6">
        <div className="flex items-center gap-3 border-b border-ink-700 pb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/20 text-gold-400 font-bold">
            1
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">সাইট সেটিংস ও পেমেন্ট নম্বর কনফিগারেশন</h2>
            <p className="text-xs text-slate-400">Settings page configuration: Site branding & manual payment numbers</p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-sm text-slate-300">
          <p className="text-xs leading-relaxed text-slate-400">
            এডমিন হিসেবে প্রথম কাজ হলো <Link href="/admin/settings" className="text-nova-400 underline font-medium">Settings</Link> মেনুতে গিয়ে আপনার সাইটের তথ্য এবং টাকা রিসিভ করার নম্বরগুলো সেট করা:
          </p>
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-lg bg-ink-900/80 p-4 border border-ink-700/60">
              <h3 className="font-semibold text-white">📱 পেমেন্ট নম্বর সমূহ</h3>
              <p className="mt-1 text-slate-400">
                • <b>bKash Number:</b> আপনার বিকাশ পার্সোনাল বা মার্চেন্ট নম্বর দিন।<br />
                • <b>Nagad Number:</b> নগদ নম্বর সেট করুন।<br />
                • <b>Rocket / Binance ID:</b> রকেট ও বাইনান্স পে আইডি দিন।<br />
                <i>(যে যে নম্বরগুলো এখানে দেবেন, ইউজাররা Add Funds পেজে শুধুমাত্র সেগুলোই দেখতে পাবে)</i>
              </p>
            </div>
            <div className="rounded-lg bg-ink-900/80 p-4 border border-ink-700/60">
              <h3 className="font-semibold text-white">💰 কারেন্সি ও অন্যান্য</h3>
              <p className="mt-1 text-slate-400">
                • <b>Currency:</b> ৳ (টাকা) বা $ (ডলার) সেট করুন।<br />
                • <b>Minimum Deposit:</b> সর্বনিম্ন কত টাকা ইউজার ডিপোজিট করতে পারবে (e.g. 50 বা 100)।<br />
                • <b>Payment Note:</b> ইউজারদের পেমেন্ট নির্দেশিকা মেসেজ।
              </p>
            </div>
          </div>
        </div>
      </Panel>

      {/* Section 2: Providers and Services */}
      <Panel className="p-6">
        <div className="flex items-center gap-3 border-b border-ink-700 pb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-nova-500/20 text-nova-400 font-bold">
            2
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">প্রোভাইডার যুক্ত করা এবং সার্ভিস সিঙ্ক (Providers & Services)</h2>
            <p className="text-xs text-slate-400">Connect wholesale SMM panels, set profit margins & auto-sync catalog</p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-sm text-slate-300">
          <div className="rounded-lg bg-ink-900/80 p-4 border border-ink-700/60 text-xs space-y-2">
            <h3 className="font-semibold text-white text-sm">🔌 কিভাবে নতুন প্রোভাইডার অ্যাড করবেন?</h3>
            <p className="text-slate-400">
              ১. <Link href="/admin/providers" className="text-nova-400 underline font-medium">Providers</Link> পেজে যান এবং <b>Add Provider</b> বাটনে ক্লিক করুন।
            </p>
            <p className="text-slate-400">
              ২. <b>API URL</b> (e.g. <code className="text-white">https://justanotherpanel.com/api/v2</code>) এবং আপনার <b>API Key</b> দিন।
            </p>
            <p className="text-slate-400">
              ৩. <b>Profit Margin %:</b> আপনি কত শতাংশ লাভ রাখতে চান (যেমন: <b>30%</b> বা <b>40%</b>)।
            </p>
            <p className="text-slate-400">
              ৪. <b>Rate Multiplier:</b> প্রোভাইডার যদি ডলারে (USD) দাম দেয় এবং আপনি টাকায় (BDT) বিক্রি করেন, তাহলে মাল্টিপ্লায়ার দিন <b>125</b> (১ ডলার = ১২৫ টাকা)। আর দুজনেই একই কারেন্সি হলে দিন <b>1</b>।
            </p>
            <p className="text-slate-400">
              ৫. <b>Test Connection</b> বাটনে ক্লিক করে ব্যালেন্স চেক করুন, এরপর <b>Sync Services</b> বাটনে ক্লিক করলে প্রোভাইডারের সব সার্ভিস স্বয়ংক্রিয়ভাবে আপনার সাইটে ইমপোর্ট হয়ে যাবে!
            </p>
          </div>

          <div className="rounded-lg bg-ink-900/80 p-4 border border-ink-700/60 text-xs">
            <h3 className="font-semibold text-white text-sm">🔒 কাস্টম প্রাইস ও সার্ভিস লকিং (Price Lock)</h3>
            <p className="mt-1 text-slate-400">
              আপনি যদি কোনো নির্দিষ্ট সার্ভিসের দাম নিজের মতো সেট করতে চান, তাহলে <Link href="/admin/services" className="text-nova-400 underline font-medium">Services</Link> পেজে গিয়ে সেটির রেট এডিট করুন। এডিট করলে সার্ভিসটি অটোমেটিক <b>Locked</b> হয়ে যাবে, অর্থাৎ পরবর্তীতে প্রোভাইডার সিঙ্ক হলেও আপনার সেট করা দাম পরিবর্তন হবে না!
            </p>
          </div>
        </div>
      </Panel>

      {/* Section 3: Payments Approval */}
      <Panel className="p-6">
        <div className="flex items-center gap-3 border-b border-ink-700 pb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
            3
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">পেমেন্ট ভেরিফিকেশন ও অনুমোদন (Payment Approval Flow)</h2>
            <p className="text-xs text-slate-400">Review user deposits and credit wallet balance instantly</p>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-xs text-slate-300">
          <p className="text-slate-400">
            যখন কোনো ইউজার Add Funds থেকে TrxID সাবমিট করে, সেটি <Link href="/admin/payments" className="text-nova-400 underline font-medium">Payments</Link> পেজে <b>PENDING</b> হিসেবে জমা হয়।
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5">
              <h3 className="font-semibold text-emerald-400">✅ পেমেন্ট অনুমোদন (Approve)</h3>
              <p className="mt-1 text-slate-300">
                আপনার বিকাশ/নগদ অ্যাপের স্টেটমেন্টে ইউজারের TrxID ও টাকার পরিমাণ মিলিয়ে দেখুন। মিল পেলে <b>Approve</b> বাটনে ক্লিক করুন। সাথে সাথে ইউজারের একাউন্টে ব্যালেন্স যোগ হয়ে যাবে।
              </p>
            </div>
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3.5">
              <h3 className="font-semibold text-rose-400">❌ পেমেন্ট বাতিল (Reject)</h3>
              <p className="mt-1 text-slate-300">
                যদি TrxID ভুয়া হয় বা টাকা না এসে থাকে, তাহলে <b>Reject</b> বাটনে ক্লিক করুন। ইউজারের একাউন্টে কোনো ব্যালেন্স যুক্ত হবে না।
              </p>
            </div>
          </div>
        </div>
      </Panel>

      {/* Section 4: Orders & Stuck Handling */}
      <Panel className="p-6">
        <div className="flex items-center gap-3 border-b border-ink-700 pb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold">
            4
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">অর্ডার মনিটরিং ও স্টাক অর্ডার সমাধান (Orders & Stuck Orders)</h2>
            <p className="text-xs text-slate-400">Resolve provider timeouts, cancellations & automatic refunds</p>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-xs text-slate-300">
          <div className="rounded-lg bg-ink-900/80 p-4 border border-ink-700/60 space-y-2">
            <h3 className="font-semibold text-white text-sm">⚠️ Stuck Order (PENDING_SUBMIT) কী এবং কেন হয়?</h3>
            <p className="text-slate-400">
              ইউজার যখন অর্ডার দেয়, সিস্টেম প্রোভাইডারের এপিআইতে অর্ডার পাঠায়। কোনো কারণে প্রোভাইডারের সার্ভার ডাউন থাকলে বা টাইমআউট হলে অর্ডারটি <Link href="/admin/orders" className="text-nova-400 underline font-medium">Orders</Link> পেজে <b>Pending Submit (Stuck)</b> হিসেবে থাকে।
            </p>
            <p className="text-slate-400">
              • <b>Retry:</b> প্রোভাইডারের কাছে পুনরায় অর্ডার পাঠাতে Retry বাটনে চাপুন।<br />
              • <b>Cancel & Refund:</b> যদি প্রোভাইডার সার্ভিসটি বন্ধ রাখে, Cancel করুন। সিস্টেম স্বয়ংক্রিয়ভাবে ইউজারের ব্যালেন্স রিফান্ড করে দেবে।
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
