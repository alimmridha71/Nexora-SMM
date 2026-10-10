import { Shell } from "@/components/shell";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const s = await getSettings();
  const items = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/payments", label: "Payments" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/services", label: "Services" },
    { href: "/admin/providers", label: "Providers" },
    { href: "/admin/tickets", label: "Tickets" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/guide", label: "Admin Guide" },
    { href: "/dashboard", label: "User view" },
  ];
  return (
    <Shell items={items} siteName={s.siteName} userName={admin.name} currency={s.currency} badge="Admin">
      {children}
    </Shell>
  );
}
