"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Table, btnGhost } from "@/components/ui";
import { money } from "@/lib/util";

type SvcItem = {
  id: string;
  publicId: number;
  name: string;
  category: string;
  sellRate: string;
  min: number;
  max: number;
};

export function ServicesCatalog({
  services,
  currency,
}: {
  services: SvcItem[];
  currency: string;
}) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCat = searchParams.get("cat") || "ALL";

  const [search, setSearch] = useState(initialQuery);
  const [selectedCat, setSelectedCat] = useState(initialCat);

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("cat");
    if (q !== null) setSearch(q);
    if (cat !== null) setSelectedCat(cat);
  }, [searchParams]);

  const categories = useMemo(() => {
    const set = new Set(services.map((s) => s.category));
    return ["ALL", ...Array.from(set)];
  }, [services]);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchCat = selectedCat === "ALL" || s.category === selectedCat;
      const q = search.trim().toLowerCase();
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        String(s.publicId).includes(q);
      return matchCat && matchQuery;
    });
  }, [services, selectedCat, search]);

  return (
    <div className="space-y-6">
      {/* Search & Filter bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search services by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-ink-600 bg-ink-900/90 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-nova-500 focus:ring-1 focus:ring-nova-500"
          />
          <svg
            className="absolute left-3.5 top-3 h-4 w-4 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="rounded-xl border border-ink-600 bg-ink-900/90 px-3.5 py-2.5 text-sm text-white focus:border-nova-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services count */}
      <p className="text-xs text-slate-400">
        Showing <span className="font-semibold text-white">{filtered.length}</span> of {services.length} services
      </p>

      {/* Mobile Services Card List (< md) */}
      <div className="grid gap-3.5 sm:grid-cols-2 md:hidden">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-xl border border-ink-700 bg-ink-800/80 p-8 text-center text-sm text-slate-400">
            No services match your search.
          </div>
        ) : (
          filtered.map((x) => (
            <div
              key={x.id}
              className="flex flex-col justify-between rounded-xl border border-ink-700/80 bg-ink-800/90 p-4 shadow-md transition-all active:scale-[0.99]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded bg-ink-900 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-400 border border-ink-700">
                    #{x.publicId}
                  </span>
                  <span className="rounded-full bg-nova-500/15 border border-nova-500/30 px-2 py-0.5 text-[10px] font-semibold text-nova-300">
                    {x.category}
                  </span>
                </div>
                <h4 className="mt-2.5 text-sm font-semibold text-white leading-snug">
                  {x.name}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-ink-700/60">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Rate / 1k:</span>
                  <span className="font-display text-base font-bold text-gold-400">
                    {money(x.sellRate, currency)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>Limits:</span>
                  <span>{x.min.toLocaleString()} - {x.max.toLocaleString()}</span>
                </div>

                <Link
                  href={`/new-order?service=${x.publicId}`}
                  className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-nova-500 py-2.5 text-xs font-semibold text-white shadow-md shadow-nova-500/20 active:scale-95 transition-all"
                >
                  ⚡ Order This Service
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Services Table (>= md) */}
      <div className="hidden md:block">
        <Table
          head={["ID", "Service Name", "Category", "Rate / 1k", "Min", "Max", "Action"]}
          empty={filtered.length === 0 ? "No services match your search." : undefined}
        >
          {filtered.map((x) => (
            <tr key={x.id}>
              <td className="font-mono text-xs text-slate-400">#{x.publicId}</td>
              <td className="font-medium text-white max-w-md">{x.name}</td>
              <td className="text-xs text-slate-400">{x.category}</td>
              <td className="whitespace-nowrap font-semibold text-gold-400">
                {money(x.sellRate, currency)}
              </td>
              <td className="text-xs text-slate-300">{x.min.toLocaleString()}</td>
              <td className="text-xs text-slate-300">{x.max.toLocaleString()}</td>
              <td>
                <Link href={`/new-order?service=${x.publicId}`} className={btnGhost}>
                  Order
                </Link>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
