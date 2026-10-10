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
    <div className="min-h-screen md:flex">
      <aside className="shrink-0 border-b border-ink-700 bg-ink-900 md:sticky md:top-0 md:h-screen md:w-60 md:overflow-y-auto md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" aria-label="Home">
            <Logo name={siteName} />
          </Link>
          {badge && <span className="rounded bg-gold-500/15 px-2 py-0.5 text-xs font-medium text-gold-400">{badge}</span>}
        </div>
        <NavLinks items={items} />
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-end gap-4 border-b border-ink-700 px-4 py-3 md:px-8">
          {balance !== undefined && (
            <span className="text-sm text-slate-400">
              Balance <b className="ml-1 text-gold-400">{money(balance, currency)}</b>
            </span>
          )}
          <span className="hidden text-sm text-slate-300 sm:inline">{userName}</span>
          <form action={logoutAction}>
            <button className="rounded-md border border-ink-600 px-3 py-1.5 text-xs text-slate-300 hover:border-nova-500 hover:text-white">
              Log out
            </button>
          </form>
        </header>
        <main className="max-w-6xl p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
