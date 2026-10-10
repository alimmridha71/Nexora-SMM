import { Shell } from "@/components/shell";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const s = await getSettings();
  const items = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/new-order", label: "New order" },
    { href: "/orders", label: "Orders" },
    { href: "/services", label: "Services" },
    { href: "/add-funds", label: "Add funds" },
    { href: "/tickets", label: "Support" },
    { href: "/api-access", label: "API" },
    { href: "/guide", label: "User Guide" },
    { href: "/account", label: "Account" },
    ...(user.role === "ADMIN" ? [{ href: "/admin", label: "Admin panel" }] : []),
  ];
  return (
    <Shell items={items} siteName={s.siteName} userName={user.name} balance={user.balance.toString()} currency={s.currency}>
      {children}
    </Shell>
  );
}
