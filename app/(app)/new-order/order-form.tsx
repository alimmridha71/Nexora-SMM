"use client";
import { useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { createOrderAction } from "@/app/actions/user";
import { SubmitButton } from "@/components/forms";
import { Field, inp } from "@/components/ui";
import { money } from "@/lib/util";

type Svc = {
  id: string;
  publicId: number;
  name: string;
  category: string;
  sellRate: number;
  min: number;
  max: number;
};

export function OrderForm({
  services,
  currency,
  initialPublicId,
}: {
  services: Svc[];
  currency: string;
  initialPublicId?: number;
}) {
  const [state, action] = useFormState(createOrderAction, null);

  // Initial service finder if passed from catalog
  const preSelected = initialPublicId ? services.find((s) => s.publicId === initialPublicId) : undefined;

  const categories = useMemo(() => Array.from(new Set(services.map((s) => s.category))), [services]);
  const [category, setCategory] = useState(preSelected?.category ?? categories[0] ?? "");
  const list = useMemo(() => services.filter((s) => s.category === category), [services, category]);
  const [serviceId, setServiceId] = useState(preSelected?.id ?? "");
  const [qty, setQty] = useState("");
  const [key, setKey] = useState("");

  useEffect(() => {
    setKey(crypto.randomUUID());
  }, []);

  useEffect(() => {
    if (preSelected) {
      setCategory(preSelected.category);
      setServiceId(preSelected.id);
    }
  }, [preSelected]);

  const svc = list.find((s) => s.id === serviceId) ?? list[0];
  const n = Number(qty);
  const charge = svc && n > 0 ? (svc.sellRate * n) / 1000 : 0;

  if (!services.length)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-xs">
        <p className="text-base font-semibold text-slate-900">No active services available</p>
        <p className="mt-1 text-sm text-slate-500">The admin hasn't synced services from the provider yet.</p>
      </div>
    );

  return (
    <form action={action} className="grid max-w-5xl gap-6 lg:grid-cols-[1fr_360px]">
      <input type="hidden" name="key" value={key} />
      <input type="hidden" name="serviceId" value={svc?.id ?? ""} />

      <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <Field label="1. Category">
          <select
            className={inp}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setServiceId("");
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="2. Service">
          <select
            className={inp}
            value={svc?.id ?? ""}
            onChange={(e) => setServiceId(e.target.value)}
          >
            {list.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.publicId} · {s.name} ({currency}{s.sellRate.toFixed(2)}/1k)
              </option>
            ))}
          </select>
        </Field>

        <Field label="3. Target Link" hint="Make sure your account or post is 100% public.">
          <input
            name="link"
            required
            placeholder="https://..."
            inputMode="url"
            className={inp}
          />
        </Field>

        <Field
          label="4. Quantity"
          hint={
            svc
              ? `Min: ${svc.min.toLocaleString()} · Max: ${svc.max.toLocaleString()}`
              : undefined
          }
        >
          <input
            name="quantity"
            type="number"
            required
            min={svc?.min}
            max={svc?.max}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder={svc ? `Enter between ${svc.min} and ${svc.max}` : "Enter quantity"}
            className={inp}
          />
        </Field>

        {/* Quick info note */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">💡 Important Instructions:</p>
          <ul className="mt-1 list-disc pl-4 space-y-1">
            <li>Do not place multiple orders for the same link at the same time.</li>
            <li>Double-check your link format before submitting.</li>
          </ul>
        </div>
      </div>

      {/* Right Column: Order Summary Card */}
      <aside className="h-fit space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="border-b border-slate-200 pb-3 text-base font-bold text-slate-900">
          Order Summary
        </h3>

        {svc && (
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">Service ID:</span>
              <span className="font-mono font-semibold text-slate-900">#{svc.publicId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rate / 1k:</span>
              <span className="font-semibold text-slate-900">{currency}{svc.sellRate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Min - Max:</span>
              <span className="font-medium text-slate-900">{svc.min.toLocaleString()} - {svc.max.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Total Charge</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-amber-700">
            {currency}{charge.toFixed(2)}
          </p>
        </div>

        <SubmitButton className="w-full rounded-lg bg-nova-500 py-3 text-sm font-semibold text-white shadow-md shadow-nova-500/20 transition-all hover:bg-nova-600 active:scale-95 disabled:opacity-60">
          Confirm & Place Order
        </SubmitButton>

        {state?.error && (
          <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            ⚠️ {state.error}
          </div>
        )}
      </aside>
    </form>
  );
}
