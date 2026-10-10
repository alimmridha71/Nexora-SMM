import Link from "next/link";
import { ReactNode } from "react";
import { logoutAction } from "@/app/actions/auth";
import { NavLinks } from "./nav";
import { Logo } from "./ui";
import { money } from "@/lib/util";

export function Shell({
  items,
  siteName,
  userName,
  balance,
  currency,
  badge,
  children,
}: {
  items: { href: string; label: string }[];
  siteName: string;
  userName: string;
  balance?: unknown;
  currency: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-950 text-slate-100 md:flex">
      {/* Sidebar (Desktop sticky sidebar / Mobile top bar) */}
      <aside className="shrink-0 border-b border-ink-800 bg-ink-900/95 backdrop-blur-md md:sticky md:top-0 md:h-screen md:w-64 md:overflow-y-auto md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-4 py-3.5 md:py-5">
          <Link href="/" aria-label="Home" className="transition-transform hover:scale-105 active:scale-95">
            <Logo name={siteName} />
          </Link>
          {badge && (
            <span className="rounded-full bg-gold-500/15 border border-gold-500/30 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
              {badge}
            </span>
          )}
        </div>
        <NavLinks items={items} />
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-ink-800 bg-ink-900/80 px-4 py-2.5 backdrop-blur-md sm:px-6 md:py-3.5 md:px-8">
          <div className="flex items-center gap-2">
            {balance !== undefined && (
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs sm:text-sm text-slate-200 shadow-sm">
                <span className="text-slate-400 text-[11px] sm:text-xs uppercase font-medium">Balance:</span>
                <b className="font-bold text-gold-400">{money(balance, currency)}</b>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden text-xs sm:text-sm font-medium text-slate-300 md:inline">
              👤 {userName}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-ink-700 bg-ink-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-nova-500 hover:bg-ink-700 hover:text-white transition-all active:scale-95"
              >
                Log out
              </button>
            </form>
          </div>
        </header>

        {/* Page Children Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-3.5 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
