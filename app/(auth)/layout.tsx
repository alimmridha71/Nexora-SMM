import Link from "next/link";
import { Logo } from "@/components/ui";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10 bg-slate-50 text-slate-800">
      <Link href="/" className="mb-8">
        <Logo name={s.siteName} />
      </Link>
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">{children}</div>
    </div>
  );
}
