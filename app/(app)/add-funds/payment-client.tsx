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
            ? "border-[#e2136e] bg-[#fdf2f8] shadow-md shadow-[#e2136e]/10 ring-2 ring-[#e2136e]/30"
            : "border-slate-200 bg-white hover:border-[#e2136e]/50 hover:bg-[#fdf2f8]/50",
          accentText: "text-[#be185d]",
          badgeBg: "bg-[#fdf2f8] text-[#be185d] border-[#fbcfe8]",
          icon: (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2136e] text-white font-bold text-sm shadow-md shadow-[#e2136e]/20">
              bK
            </div>
          ),
        };
      case "Nagad":
        return {
          cardBg: isSelected
            ? "border-[#ea580c] bg-[#fff7ed] shadow-md shadow-[#ea580c]/10 ring-2 ring-[#ea580c]/30"
            : "border-slate-200 bg-white hover:border-[#ea580c]/50 hover:bg-[#fff7ed]/50",
          accentText: "text-[#c2410c]",
          badgeBg: "bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]",
          icon: (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ea580c] text-white font-bold text-sm shadow-md shadow-[#ea580c]/20">
              NG
            </div>
          ),
        };
      case "Rocket":
        return {
          cardBg: isSelected
            ? "border-[#9333ea] bg-[#faf5ff] shadow-md shadow-[#9333ea]/10 ring-2 ring-[#9333ea]/30"
            : "border-slate-200 bg-white hover:border-[#9333ea]/50 hover:bg-[#faf5ff]/50",
          accentText: "text-[#7e22ce]",
          badgeBg: "bg-[#faf5ff] text-[#7e22ce] border-[#e9d5ff]",
          icon: (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9333ea] text-white font-bold text-sm shadow-md shadow-[#9333ea]/20">
              🚀
            </div>
          ),
        };
      case "Binance":
        return {
          cardBg: isSelected
            ? "border-[#d97706] bg-[#fffbeb] shadow-md shadow-[#d97706]/10 ring-2 ring-[#d97706]/30"
            : "border-slate-200 bg-white hover:border-[#d97706]/50 hover:bg-[#fffbeb]/50",
          accentText: "text-[#b45309]",
          badgeBg: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
          icon: (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d97706] text-white font-bold text-sm shadow-md shadow-[#d97706]/20">
              BN
            </div>
          ),
        };
      default:
        return {
          cardBg: isSelected
            ? "border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-500/30"
            : "border-slate-200 bg-white hover:border-slate-300",
          accentText: "text-slate-900",
          badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
          icon: <div className="text-xl">💳</div>,
        };
    }
  };

  if (methods.length === 0) {
    return (
      <Panel className="p-8 text-center text-slate-500">
        <p className="text-base font-semibold text-slate-900">Payment methods are currently updating.</p>
        <p className="mt-1 text-sm text-slate-500">Contact support at {supportEmail} for manual deposits.</p>
      </Panel>
    );
  }

  return (
    <div className="grid max-w-6xl gap-6 lg:grid-cols-12">
      {/* Left Column: Method Details & Instructions (7 cols) */}
      <div className="space-y-6 lg:col-span-7">
        {/* Step 1: Gateway Selection */}
        <Panel className="p-5 sm:p-6 bg-white border border-slate-200 shadow-xs">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Step 1</span>
              <h2 className="text-base font-bold text-slate-900">Select Payment Gateway</h2>
            </div>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
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
                        <b className="block text-sm font-bold text-slate-900">{m.label}</b>
                        <span className="text-[11px] text-slate-500">
                          {m.type || (m.id === "bKash" ? "Personal (Send Money)" : "Account")}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] text-white font-bold">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-200/80 pt-3">
                    <span className="font-mono text-sm font-bold tracking-wider text-slate-900 select-all">
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
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Selected Gateway Number:
                  </span>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="font-mono text-xl font-bold tracking-wider text-slate-900 select-all">
                      {activeMethod.to}
                    </span>
                    <span className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {activeMethod.label} (Personal)
                    </span>
                  </div>
                </div>
                <CopyButton text={activeMethod.to} label="Copy Number" className="px-3 py-1.5 text-xs font-semibold" />
              </div>
            </div>
          )}

          {/* Step-by-Step Instructions */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
              <span>📋</span> কীভাবে টাকা পাঠাবেন ({activeMethod.label} Instructions):
            </h3>

            {isBkash && (
              <ol className="mt-3 space-y-2 text-xs text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fdf2f8] border border-[#fbcfe8] text-[10px] font-bold text-[#be185d]">
                    1
                  </span>
                  <span>আপনার বিকাশ অ্যাপ ওপেন করুন অথবা ডায়াল করুন <b className="text-slate-900 font-bold">*247#</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fdf2f8] border border-[#fbcfe8] text-[10px] font-bold text-[#be185d]">
                    2
                  </span>
                  <span>
                    মেনু থেকে <b className="text-slate-900 font-bold">Send Money</b> (সেন্ড মানি) অপশন নির্বাচন করুন
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fdf2f8] border border-[#fbcfe8] text-[10px] font-bold text-[#be185d]">
                    3
                  </span>
                  <span>
                    প্রাপক নম্বর দিন: <b className="font-mono text-slate-900 font-bold select-all">{activeMethod.to}</b>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fdf2f8] border border-[#fbcfe8] text-[10px] font-bold text-[#be185d]">
                    4
                  </span>
                  <span>
                    টাকার পরিমাণ লিখুন (সর্বনিম্ন <b className="text-amber-700 font-bold">{currency}{minDeposit}</b>)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fdf2f8] border border-[#fbcfe8] text-[10px] font-bold text-[#be185d]">
                    5
                  </span>
                  <span>আপনার গোপন পিন দিয়ে সেন্ড মানি সম্পন্ন করুন</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#fdf2f8] border border-[#fbcfe8] text-[10px] font-bold text-[#be185d]">
                    6
                  </span>
                  <span>
                    লেনদেন সম্পন্ন হলে আসা <b className="text-[#be185d] font-bold">TrxID</b> কপি করে পাশের ফর্মে সাবমিট করুন
                  </span>
                </li>
              </ol>
            )}

            {!isBkash && (
              <ol className="mt-3 space-y-2 text-xs text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-700">
                    1
                  </span>
                  <span>
                    {activeMethod.label} অ্যাপ ওপেন করে Send Money অপশনে যান
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-700">
                    2
                  </span>
                  <span>
                    প্রাপক নম্বর দিন: <b className="font-mono text-slate-900 font-bold select-all">{activeMethod.to}</b>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-700">
                    3
                  </span>
                  <span>
                    টাকার পরিমাণ দিন (সর্বনিম্ন <b className="text-amber-700 font-bold">{currency}{minDeposit}</b>) এবং পিন দিয়ে সম্পন্ন করুন
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-700">
                    4
                  </span>
                  <span>প্রাপ্ত TrxID কপি করে পাশের ফর্মে সাবমিট করুন</span>
                </li>
              </ol>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-[11px] text-slate-600">
              <span>⚡ নূন্যতম ডিপোজিট: <b className="text-slate-900 font-bold">{currency}{minDeposit}</b></span>
              <span>⏱️ ভেরিফিকেশন সময়: <b className="text-emerald-700 font-bold">২ - ১৫ মিনিট</b></span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Right Column: Submit Form (5 cols) */}
      <div className="space-y-6 lg:col-span-5">
        <Panel className="p-5 sm:p-6 bg-white border border-slate-200 shadow-xs">
          <div className="mb-4 border-b border-slate-200 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Step 2</span>
            <h2 className="text-base font-bold text-slate-900">Submit Transaction ID</h2>
            <p className="mt-0.5 text-xs text-slate-500">
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
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-600">
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
                    className={`${inp} pl-9 font-bold text-slate-900`}
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
                          ? "border-amber-400 bg-amber-100 text-amber-900 font-bold shadow-2xs"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
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
                className={`${inp} font-mono uppercase tracking-wider text-slate-900 font-bold placeholder:normal-case placeholder:tracking-normal placeholder:font-sans placeholder:font-normal`}
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
                className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"
              >
                ⚠️ {formState.error}
              </div>
            )}

            {formState?.ok && (
              <div
                role="status"
                className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700"
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
            <a href={`mailto:${supportEmail}`} className="text-blue-600 hover:underline">
              {supportEmail}
            </a>
          </p>
        </Panel>
      </div>
    </div>
  );
}
