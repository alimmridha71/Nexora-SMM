"use client";

import { useState } from "react";
import { CopyButton, Field, Panel, inp, btn } from "@/components/ui";
import { SubmitButton } from "@/components/forms";
import { submitPaymentAction } from "@/app/actions/user";
import { useFormState } from "react-dom";

interface PaymentMethod {
  id: string;
  label: string;
  type?: string;
  to: string;
}

interface PaymentClientProps {
  methods: PaymentMethod[];
  currency: string;
  minDeposit: string;
  supportEmail: string;
  paymentNote?: string;
}

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export function PaymentClient({
  methods,
  currency,
  minDeposit,
  supportEmail,
  paymentNote,
}: PaymentClientProps) {
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    methods[0]?.id ?? "bKash"
  );
  const [amount, setAmount] = useState<string>(minDeposit || "100");
  const [trxId, setTrxId] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [formState, formAction] = useFormState(submitPaymentAction, null);

  const activeMethod = methods.find((m) => m.id === selectedMethodId) ?? methods[0];

  const isBkash = activeMethod?.id === "bKash";
  const isNagad = activeMethod?.id === "Nagad";
  const isRocket = activeMethod?.id === "Rocket";
  const isBinance = activeMethod?.id === "Binance";

  const getMethodTheme = (id: string, isSelected: boolean) => {
    switch (id) {
      case "bKash":
        return {
          cardBg: isSelected
            ? "border-[#e2136e] bg-[#e2136e]/15 shadow-lg shadow-[#e2136e]/20"
            : "border-ink-700 bg-ink-800/80 hover:border-[#e2136e]/50 hover:bg-[#e2136e]/5",
          accentText: "text-[#ff4081]",
          badgeBg: "bg-[#e2136e]/20 text-[#ff4081] border-[#e2136e]/40",
          icon: (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2136e] text-white font-bold text-sm shadow-md shadow-[#e2136e]/30">
              bK
            </div>
          ),
        };
      case "Nagad":
        return {
          cardBg: isSelected
            ? "border-[#f7941d] bg-[#f7941d]/15 shadow-lg shadow-[#f7941d]/20"
            : "border-ink-700 bg-ink-800/80 hover:border-[#f7941d]/50 hover:bg-[#f7941d]/5",
          accentText: "text-[#f7941d]",
          badgeBg: "bg-[#f7941d]/20 text-[#f7941d] border-[#f7941d]/40",
          icon: (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7941d] text-white font-bold text-sm shadow-md shadow-[#f7941d]/30">
              NG
            </div>
          ),
        };
      case "Rocket":
        return {
          cardBg: isSelected
            ? "border-[#8c3494] bg-[#8c3494]/15 shadow-lg shadow-[#8c3494]/20"
            : "border-ink-700 bg-ink-800/80 hover:border-[#8c3494]/50 hover:bg-[#8c3494]/5",
          accentText: "text-[#ba68c8]",
          badgeBg: "bg-[#8c3494]/20 text-[#ba68c8] border-[#8c3494]/40",
          icon: (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8c3494] text-white font-bold text-sm shadow-md shadow-[#8c3494]/30">
              🚀
            </div>
          ),
        };
      case "Binance":
        return {
          cardBg: isSelected
            ? "border-[#f3ba2f] bg-[#f3ba2f]/15 shadow-lg shadow-[#f3ba2f]/20"
            : "border-ink-700 bg-ink-800/80 hover:border-[#f3ba2f]/50 hover:bg-[#f3ba2f]/5",
          accentText: "text-[#f3ba2f]",
          badgeBg: "bg-[#f3ba2f]/20 text-[#f3ba2f] border-[#f3ba2f]/40",
          icon: (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3ba2f] text-black font-bold text-sm shadow-md shadow-[#f3ba2f]/30">
              BN
            </div>
          ),
        };
      default:
        return {
          cardBg: isSelected
            ? "border-nova-500 bg-nova-500/15"
            : "border-ink-700 bg-ink-800/80 hover:border-ink-600",
          accentText: "text-white",
          badgeBg: "bg-ink-700 text-slate-300 border-ink-600",
          icon: <div className="text-xl">💳</div>,
        };
    }
  };

  if (methods.length === 0) {
    return (
      <Panel className="p-8 text-center text-slate-400">
        <p className="text-base font-semibold text-white">Payment methods are currently updating.</p>
        <p className="mt-1 text-sm text-slate-500">Contact support at {supportEmail} for manual deposits.</p>
      </Panel>
    );
  }

  return (
    <div className="grid max-w-6xl gap-6 lg:grid-cols-12">
      {/* Left Column: Method Details & Instructions (7 cols) */}
      <div className="space-y-6 lg:col-span-7">
        {/* Step 1: Gateway Selection */}
        <Panel className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b border-ink-700/80 pb-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-nova-400">Step 1</span>
              <h2 className="text-base font-bold text-white">Select Payment Gateway</h2>
            </div>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              Personal Send Money
            </span>
          </div>

          {/* Method Cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            {methods.map((m) => {
              const isSelected = m.id === selectedMethodId;
              const theme = getMethodTheme(m.id, isSelected);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMethodId(m.id)}
                  className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${theme.cardBg}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {theme.icon}
                      <div>
                        <b className="block text-sm font-bold text-white">{m.label}</b>
                        <span className="text-[11px] text-slate-400">
                          {m.type || (m.id === "bKash" ? "Personal (Send Money)" : "Account")}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-nova-500 text-[11px] text-white font-bold">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-ink-700/60 pt-3">
                    <span className="font-mono text-sm font-semibold tracking-wider text-white select-all">
                      {m.to}
                    </span>
                    <CopyButton text={m.to} label="Copy" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Gateway Highlight Banner */}
          {activeMethod && (
            <div className="mt-5 rounded-xl border border-ink-700 bg-ink-900/90 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Selected Gateway Number:
                  </span>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="font-mono text-lg font-bold tracking-wider text-gold-400 select-all">
                      {activeMethod.to}
                    </span>
                    <span className="rounded border border-ink-600 bg-ink-800 px-2 py-0.5 text-[11px] text-slate-300">
                      {activeMethod.label} (Personal)
                    </span>
                  </div>
                </div>
                <CopyButton text={activeMethod.to} label="Copy Number" className="px-3 py-1.5 text-xs font-semibold" />
              </div>
            </div>
          )}

          {/* Step-by-Step Instructions */}
          <div className="mt-5 rounded-xl border border-ink-700/60 bg-ink-950/60 p-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
              <span>📋</span> কীভাবে টাকা পাঠাবেন ({activeMethod.label} Instructions):
            </h3>

            {isBkash && (
              <ol className="mt-3 space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e2136e]/20 text-[10px] font-bold text-[#ff4081]">
                    1
                  </span>
                  <span>আপনার বিকাশ অ্যাপ ওপেন করুন অথবা ডায়াল করুন <b className="text-white">*247#</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e2136e]/20 text-[10px] font-bold text-[#ff4081]">
                    2
                  </span>
                  <span>
                    মেনু থেকে <b className="text-white">Send Money</b> (সেন্ড মানি) অপশন নির্বাচন করুন
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e2136e]/20 text-[10px] font-bold text-[#ff4081]">
                    3
                  </span>
                  <span>
                    প্রাপক নম্বর দিন: <b className="font-mono text-white select-all">{activeMethod.to}</b>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e2136e]/20 text-[10px] font-bold text-[#ff4081]">
                    4
                  </span>
                  <span>
                    টাকার পরিমাণ লিখুন (সর্বনিম্ন <b className="text-gold-400">{currency}{minDeposit}</b>)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e2136e]/20 text-[10px] font-bold text-[#ff4081]">
                    5
                  </span>
                  <span>আপনার গোপন পিন দিয়ে সেন্ড মানি সম্পন্ন করুন</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e2136e]/20 text-[10px] font-bold text-[#ff4081]">
                    6
                  </span>
                  <span>
                    লেনদেন সম্পন্ন হলে আসা <b className="text-[#ff4081]">TrxID</b> কপি করে পাশের ফর্মে সাবমিট করুন
                  </span>
                </li>
              </ol>
            )}

            {!isBkash && (
              <ol className="mt-3 space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-nova-500/20 text-[10px] font-bold text-nova-300">
                    1
                  </span>
                  <span>
                    {activeMethod.label} অ্যাপ ওপেন করে Send Money অপশনে যান
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-nova-500/20 text-[10px] font-bold text-nova-300">
                    2
                  </span>
                  <span>
                    প্রাপক নম্বর দিন: <b className="font-mono text-white select-all">{activeMethod.to}</b>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-nova-500/20 text-[10px] font-bold text-nova-300">
                    3
                  </span>
                  <span>
                    টাকার পরিমাণ দিন (সর্বনিম্ন <b className="text-gold-400">{currency}{minDeposit}</b>) এবং পিন দিয়ে সম্পন্ন করুন
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-nova-500/20 text-[10px] font-bold text-nova-300">
                    4
                  </span>
                  <span>প্রাপ্ত TrxID কপি করে পাশের ফর্মে সাবমিট করুন</span>
                </li>
              </ol>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-ink-800 pt-3 text-[11px] text-slate-400">
              <span>⚡ নূন্যতম ডিপোজিট: <b className="text-white">{currency}{minDeposit}</b></span>
              <span>⏱️ ভেরিফিকেশন সময়: <b className="text-emerald-400">২ - ১৫ মিনিট</b></span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Right Column: Submit Form (5 cols) */}
      <div className="space-y-6 lg:col-span-5">
        <Panel className="p-5 sm:p-6">
          <div className="mb-4 border-b border-ink-700/80 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">Step 2</span>
            <h2 className="text-base font-bold text-white">Submit Transaction ID</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              টাকা পাঠানোর পর প্রাপ্ত TrxID এবং সঠিক তথ্য নিচে পূরণ করুন।
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            {/* Payment Method Selector */}
            <Field label="Selected Gateway">
              <select
                name="method"
                value={selectedMethodId}
                onChange={(e) => setSelectedMethodId(e.target.value)}
                className={inp}
              >
                {methods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} ({m.to})
                  </option>
                ))}
              </select>
            </Field>

            {/* Amount Field + Quick Presets */}
            <Field label={`Amount Sent (${currency})`} hint={`Minimum deposit: ${currency}${minDeposit}`}>
              <div className="space-y-2">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-gold-400">
                    {currency}
                  </span>
                  <input
                    name="amount"
                    type="number"
                    step="any"
                    min={Number(minDeposit)}
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Min ${minDeposit}`}
                    className={`${inp} pl-9 font-semibold text-white`}
                  />
                </div>

                {/* Quick Amount Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt.toString())}
                      className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                        amount === amt.toString()
                          ? "border-gold-500 bg-gold-500/20 text-gold-300 font-bold"
                          : "border-ink-700 bg-ink-900/60 text-slate-400 hover:border-ink-600 hover:text-white"
                      }`}
                    >
                      +{currency}{amt}
                    </button>
                  ))}
                </div>
              </div>
            </Field>

            {/* TrxID Field */}
            <Field
              label="Transaction ID (TrxID)"
              hint="bKash ফিরতি মেসেজ থেকে TrxID কপি করে দিন (e.g. BL92A4KF9)"
            >
              <input
                name="trxId"
                required
                maxLength={40}
                value={trxId}
                onChange={(e) => setTrxId(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())}
                placeholder="Enter TrxID (e.g. BL92A4KF9)"
                className={`${inp} font-mono uppercase tracking-wider text-emerald-400 placeholder:normal-case placeholder:tracking-normal placeholder:font-sans`}
              />
            </Field>

            {/* Note / Sender Number Field */}
            <Field
              label="Sender Number / Reference (ঐচ্ছিক)"
              hint="যে নম্বর থেকে টাকা পাঠিয়েছেন (e.g. 017xxxxxxxx)"
            >
              <input
                name="note"
                maxLength={200}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Sender phone number (optional)"
                className={inp}
              />
            </Field>

            {/* Status alerts */}
            {formState?.error && (
              <div
                role="alert"
                className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300"
              >
                ⚠️ {formState.error}
              </div>
            )}

            {formState?.ok && (
              <div
                role="status"
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300"
              >
                ✅ {formState.ok}
              </div>
            )}

            <SubmitButton className={`w-full ${btn} py-3 text-base`}>
              Verify & Add Funds (টাকা জমা করুন)
            </SubmitButton>
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-500">
            সমস্যা হলে সাপোর্টে যোগাযোগ করুন:{" "}
            <a href={`mailto:${supportEmail}`} className="text-nova-400 hover:underline">
              {supportEmail}
            </a>
          </p>
        </Panel>
      </div>
    </div>
  );
}
