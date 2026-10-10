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
                ? "bg-blue-50 text-blue-700 font-semibold shadow-2xs border border-blue-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span>{i.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
