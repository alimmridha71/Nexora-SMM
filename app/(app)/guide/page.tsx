import Link from "next/link";
import { PageTitle, Panel } from "@/components/ui";

export const metadata = {
  title: "User Guide - Nexora SMM",
  description: "Complete guide on how to deposit, place orders, and use the Nexora SMM panel.",
};

export default function UserGuidePage() {
  return (
    <div className="space-y-8">
      <PageTitle
        title="User Guide & Tutorials"
        sub="Everything you need to know about adding funds, placing orders, and using Nexora SMM efficiently."
        action={
          <Link
            href="/new-order"
            className="inline-flex items-center gap-2 rounded-lg bg-nova-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-nova-500/25 transition-all hover:bg-nova-600 active:scale-95"
          >
            ⚡ Place Order Now
          </Link>
        }
      />

      {/* Quick Summary Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-xl text-emerald-600">
            💳
          </div>
          <h2 className="mt-3 text-base font-bold text-slate-900">1. Add Balance</h2>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            Send money via bKash, Nagad, Rocket, or Binance Pay and submit your TrxID.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-600">
            🔍
          </div>
          <h2 className="mt-3 text-base font-bold text-slate-900">2. Select Service</h2>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            Choose platform & service. Check Min/Max limits and description carefully.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-xl text-amber-600">
            🔗
          </div>
          <h2 className="mt-3 text-base font-bold text-slate-900">3. Paste Public Link</h2>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            Provide public profile/post URL. Ensure privacy is set to Public (not private).
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-xl text-cyan-600">
            🛡️
          </div>
          <h2 className="mt-3 text-base font-bold text-slate-900">4. Auto Refund</h2>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            Canceled or partially delivered orders automatically refund remaining funds.
          </p>
        </div>
      </div>

      {/* Step 1: Add Funds */}
      <Panel className="p-6 bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            1
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">টাকা ডিপোজিট করবেন কীভাবে (How to Add Funds)</h2>
            <p className="text-xs text-slate-500">Wallet balance reload via bKash, Nagad, Rocket & Binance</p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-sm text-slate-700">
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="text-emerald-700 font-bold">Step A:</span> পেমেন্ট অপশনে যান
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              বাম পাশের মেনু থেকে <Link href="/add-funds" className="text-blue-600 underline font-semibold">Add Funds</Link> পেজে যান। সেখানে আমাদের অফিশিয়াল bKash, Nagad, Rocket নম্বর বা Binance Pay ID দেখতে পাবেন।
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="text-emerald-700 font-bold">Step B:</span> টাকা সেন্ড মানি করুন (Send Money)
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              আপনার bKash/Nagad অ্যাপ থেকে আমাদের নম্বরে সঠিক পরিমাণ টাকা <b>Send Money</b> করুন।
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="text-emerald-700 font-bold">Step C:</span> Transaction ID (TrxID) সাবমিট করুন
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              টাকা পাঠানোর পর প্রাপ্ত <b>Transaction ID (TrxID)</b> এবং প্রেরিত টাকার পরিমাণ (Amount) লিখে <b>Deposit</b> বাটনে ক্লিক করুন। এডমিন ভেরিফাই করে ৫-১৫ মিনিটের মধ্যে আপনার ওয়ালেটে ব্যালেন্স যুক্ত করে দেবে।
            </p>
          </div>
        </div>
      </Panel>

      {/* Step 2: Placing Orders */}
      <Panel className="p-6 bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
            2
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">অর্ডার করার সঠিক নিয়ম (How to Place an Order)</h2>
            <p className="text-xs text-slate-500">Avoid common mistakes for 100% instant processing</p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-sm text-slate-700">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
              <h3 className="font-bold text-slate-900">✅ সঠিক লিংক ফরম্যাট (Correct Link Format)</h3>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                <li>• <b>Facebook Profile:</b> https://facebook.com/username</li>
                <li>• <b>Facebook Post:</b> https://facebook.com/username/posts/123456</li>
                <li>• <b>YouTube Video:</b> https://youtube.com/watch?v=xxxx</li>
                <li>• <b>Instagram:</b> https://instagram.com/username</li>
                <li>• <b>Telegram:</b> https://t.me/channelname</li>
              </ul>
            </div>

            <div className="rounded-lg bg-rose-50 p-4 border border-rose-200">
              <h3 className="font-bold text-rose-800">❌ যা কখনোই করবেন না (Common Mistakes)</h3>
              <ul className="mt-2 space-y-1.5 text-xs text-rose-700">
                <li>• প্রোফাইল বা পোস্ট <b>Private</b> রাখবেন না (অবশ্যই <b>Public</b> রাখতে হবে)।</li>
                <li>• একই লিংকে আগের অর্ডার সম্পন্ন না হওয়া পর্যন্ত একই সার্ভিস পুনরায় অর্ডার করবেন না।</li>
                <li>• ভুল বা ভাঙা লিংক দেবেন না।</li>
                <li>• Min ও Max পরিমাণের বাইরে অর্ডার দেবেন না।</li>
              </ul>
            </div>
          </div>
        </div>
      </Panel>

      {/* Step 3: Order Status Explanation */}
      <Panel className="p-6 bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
            3
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">অর্ডারের স্ট্যাটাস সমূহ (Understanding Order Status)</h2>
            <p className="text-xs text-slate-500">Track and manage your submitted orders</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5">
            <b className="text-amber-800">PENDING / PENDING_SUBMIT</b>
            <p className="mt-1 text-slate-700">অর্ডারটি সিস্টেমে জমা হয়েছে এবং প্রোভাইডারের কাছে প্রসেস হচ্ছে।</p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3.5">
            <b className="text-blue-800">IN_PROGRESS / PROCESSING</b>
            <p className="mt-1 text-slate-700">অর্ডারের ডেলিভারি শুরু হয়েছে এবং কাজ চলমান রয়েছে।</p>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3.5">
            <b className="text-emerald-800">COMPLETED</b>
            <p className="mt-1 text-slate-700">অর্ডার সফলভাবে সম্পূর্ণ ডেলিভারি হয়েছে।</p>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-3.5">
            <b className="text-purple-800">PARTIAL (আংশিক সম্পন্ন)</b>
            <p className="mt-1 text-slate-700">অর্ডারের কিছু অংশ ডেলিভারি হয়েছে, এবং অবশিষ্ট টাকার পরিমাণ স্বয়ংক্রিয়ভাবে ওয়ালেটে রিফান্ড হয়েছে।</p>
          </div>

          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3.5">
            <b className="text-rose-800">CANCELED (বাতিল)</b>
            <p className="mt-1 text-slate-700">প্রোভাইডার অর্ডারটি বাতিল করেছে এবং ১০০% টাকা আপনার অ্যাকাউন্টে স্বয়ংক্রিয়ভাবে ফেরত দেওয়া হয়েছে।</p>
          </div>

          <div className="rounded-lg border border-slate-300 bg-slate-50 p-3.5">
            <b className="text-slate-800">SUPPORT TICKET</b>
            <p className="mt-1 text-slate-600">অর্ডারে কোনো সমস্যা হলে <Link href="/tickets" className="text-blue-600 underline">Support</Link> মেনুতে গিয়ে টিকিট তৈরি করুন।</p>
          </div>
        </div>
      </Panel>

      {/* Step 4: Reseller API v2 */}
      <Panel className="p-6 bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50 text-cyan-700 font-bold border border-cyan-200">
            4
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">রিসেলার এপিআই ইন্টিগ্রেশন (Reseller API v2)</h2>
            <p className="text-xs text-slate-500">Connect Nexora SMM directly with your panel or automation script</p>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-xs text-slate-700">
          <p>
            আপনি যদি অন্য কোনো SMM Panel (e.g., SmartPanel, PerfectPanel) বা টেলিগ্রাম বট চালান, তবে খুব সহজেই আমাদের API দিয়ে অর্ডার কানেক্ট করতে পারেন।
          </p>
          <div className="rounded-lg bg-slate-900 p-4 font-mono text-[11px] text-emerald-400 border border-slate-800">
            <p className="text-blue-400"># API Endpoint:</p>
            <p className="mt-1 text-white">POST https://nexora-smm.vercel.app/api/v2</p>
            <p className="mt-3 text-blue-400"># Supported Actions:</p>
            <p className="mt-1">• action=services (Get services list)</p>
            <p>• action=add (Place order: service, link, quantity)</p>
            <p>• action=status (Check order: order id)</p>
            <p>• action=balance (Check wallet balance)</p>
          </div>
          <p className="text-slate-600">
            আপনার ব্যক্তিগত API Key দেখতে বাম পাশের মেনু থেকে <Link href="/api-access" className="text-blue-600 underline font-semibold">API</Link> পেজে যান।
          </p>
        </div>
      </Panel>
    </div>
  );
}
