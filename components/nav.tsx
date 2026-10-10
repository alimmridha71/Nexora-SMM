"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks({ items }: { items: { href: string; label: string }[] }) {
  const path = usePathname();
  return (
    <nav
      className="flex gap-1.5 overflow-x-auto px-3 pb-3 pt-1 scrollbar-none md:flex-col md:overflow-visible md:pb-4 md:px-3.5 touch-pan-x"
      aria-label="Main"
    >
      {items.map((i) => {
        const active = path === i.href || (i.href !== "/admin" && i.href !== "/dashboard" && path.startsWith(i.href + "/"));
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all active:scale-95 ${
              active
                ? "bg-nova-500/20 text-nova-300 shadow-sm shadow-nova-500/10 border border-nova-500/30"
                : "text-slate-400 hover:bg-ink-800 hover:text-white"
            }`}
          >
            <span>{i.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
