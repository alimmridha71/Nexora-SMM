import Link from "next/link";
import { Logo } from "@/components/ui";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10">
      <Link href="/" className="mb-8">
        <Logo name={s.siteName} />
      </Link>
      <div className="w-full max-w-sm rounded-xl border border-ink-700 bg-ink-800 p-6">{children}</div>
    </div>
  );
}
