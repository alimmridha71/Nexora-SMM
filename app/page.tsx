import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { Logo } from "@/components/ui";
import { logoutAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

const STATS = [
  { value: "10M+", label: "Orders Delivered" },
  { value: "99.9%", label: "Platform Uptime" },
  { value: "500+", label: "Active Services" },
  { value: "24/7", label: "Instant Delivery" },
];

const PLATFORMS = [
  { name: "Facebook", icon: "📘", desc: "Page Likes, Followers, Post Reactions & Group Members" },
  { name: "YouTube", icon: "▶️", desc: "Monetization Watchtime, Real Views, Subscribers & Likes" },
  { name: "Instagram", icon: "📸", desc: "High Quality Followers, Reels Views, Likes & Comments" },
  { name: "TikTok", icon: "🎵", desc: "Viral Video Views, Real Followers, Likes & Shares" },
  { name: "Telegram", icon: "✈️", desc: "Channel Members, Post Views & Discussion Group Members" },
  { name: "Twitter / X", icon: "🐦", desc: "Targeted Followers, Retweets, Likes & Impressions" },
];

const FEATURES = [
  {
    title: "Instant Automated Delivery",
    desc: "Our automated high-speed API handles orders in seconds. Watch your metrics grow in real-time.",
    icon: "⚡",
  },
  {
    title: "Automated Refunds",
    desc: "Canceled orders return 100% to your wallet. Partial deliveries refund the exact remaining balance.",
    icon: "🛡️",
  },
  {
    title: "Local & Crypto Payments",
    desc: "Top up your wallet easily via bKash, Nagad, Rocket or Binance Pay with instant transaction review.",
    icon: "💳",
  },
  {
    title: "Reseller API v2",
    desc: "Connect your existing panels or custom bots with our industry standard v2 API for full automation.",
    icon: "🔌",
  },
];

const FAQS = [
  {
    q: "How fast are orders processed on Nexora SMM?",
    a: "Most orders begin processing automatically within seconds of submission through our high-speed direct API connections.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support popular Bangladesh payment methods including bKash, Nagad, and Rocket, as well as global payments via Binance Pay (USDT).",
  },
  {
    q: "What happens if an order fails or cannot be completed?",
    a: "If a service is canceled or drops, our atomic refund system automatically returns the full or partial funds directly into your Nexora SMM wallet.",
  },
  {
    q: "Can I connect my own website or panel via API?",
    a: "Yes! Every registered user gets an API key with full access to our v2 API (services, add, status, balance), compatible with all major panel scripts.",
  },
];

export default async function Home() {
  const [user, s] = await Promise.all([getCurrentUser(), getSettings()]);

  return (
    <div className="min-h-screen text-slate-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="transition-transform hover:scale-105">
            <Logo name={s.siteName} />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
            <Link href="#services" className="hover:text-nova-400 transition-colors">
              Services
            </Link>
            <Link href="#features" className="hover:text-nova-400 transition-colors">
              Why Us
            </Link>
            <Link href="#faq" className="hover:text-nova-400 transition-colors">
              FAQ
            </Link>
            <Link href="/terms" className="hover:text-nova-400 transition-colors">
              Terms
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                  className="rounded-lg bg-nova-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-nova-500/25 transition-all hover:bg-nova-600 active:scale-95"
                >
                  {user.role === "ADMIN" ? "Admin Panel" : "Dashboard"}
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="rounded-lg border border-ink-700 bg-ink-800/80 px-3.5 py-2 text-xs font-medium text-slate-300 hover:border-ink-600 hover:bg-ink-700 hover:text-white transition-all active:scale-95"
                  >
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-nova-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-nova-500/25 transition-all hover:bg-nova-600 hover:shadow-nova-500/40 active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-nova-500/30 bg-nova-500/10 px-3.5 py-1 text-xs font-semibold text-nova-300">
                <span className="flex h-2 w-2 rounded-full bg-nova-400 animate-pulse" />
                #1 SMM Reseller & Growth Panel
              </div>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] sm:text-6xl text-white">
                Supercharge Your Social Growth With{" "}
                <span className="bg-gradient-to-r from-nova-400 via-nova-500 to-indigo-400 bg-clip-text text-transparent">
                  {s.siteName}
                </span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-slate-400 max-w-2xl">
                The most reliable, high-speed automated social media marketing panel. Wholesale pricing for Facebook, YouTube, Instagram, TikTok, Telegram and more — with local bKash/Nagad payments.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={user ? "/new-order" : "/register"}
                  className="rounded-lg bg-nova-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-nova-500/30 transition-all hover:bg-nova-600 hover:shadow-nova-500/50 active:scale-95"
                >
                  {user ? "Place New Order" : "Create Free Account"}
                </Link>
                <Link
                  href="/services"
                  className="rounded-lg border border-ink-600 bg-ink-800/60 px-6 py-3.5 text-base font-medium text-slate-200 transition-all hover:border-nova-500 hover:text-white hover:bg-ink-700/60"
                >
                  View Services & Rates
                </Link>
              </div>

              {/* Quick stats mini bar */}
              <div className="mt-12 grid grid-cols-2 gap-4 border-t border-ink-700/60 pt-8 sm:grid-cols-4">
                {STATS.map((st) => (
                  <div key={st.label}>
                    <p className="font-display text-2xl font-bold text-white sm:text-3xl">{st.value}</p>
                    <p className="mt-1 text-xs text-slate-400">{st.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Preview Mock */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-ink-600/80 bg-ink-900/90 p-6 shadow-2xl shadow-nova-500/10 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-ink-700/60 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="rounded bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                    ● Instant Processing
                  </span>
                </div>

                <div className="mt-5 space-y-4 text-sm">
                  <div className="rounded-xl border border-ink-700 bg-ink-950/70 p-3.5">
                    <p className="text-xs font-semibold uppercase text-slate-400">Selected Platform</p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="font-medium text-white">YouTube Monetization Package</p>
                      <span className="text-xs text-nova-400">High Retention</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-ink-700 bg-ink-950/70 p-3.5">
                    <p className="text-xs font-semibold uppercase text-slate-400">Target Channel Link</p>
                    <p className="mt-1 truncate font-mono text-xs text-slate-300">https://youtube.com/@yourchannel</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-ink-700 bg-ink-950/70 p-3.5">
                      <p className="text-xs font-semibold uppercase text-slate-400">Quantity</p>
                      <p className="mt-1 font-semibold text-white">4,000 Hours</p>
                    </div>
                    <div className="rounded-xl border border-gold-500/40 bg-gold-500/10 p-3.5">
                      <p className="text-xs font-semibold uppercase text-gold-400">Total Price</p>
                      <p className="mt-1 font-display font-bold text-gold-400">
                        {s.currency} Live Calculated
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-nova-600 to-nova-500 py-3 text-center font-semibold text-white shadow-lg shadow-nova-500/30">
                    ⚡ Instant Submit to API
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Platforms */}
      <section id="services" className="border-t border-ink-700/60 bg-ink-900/40 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold sm:text-4xl">All Popular Platforms in One Place</h2>
            <p className="mt-3 text-base text-slate-400">
              Access hundreds of verified high-quality services for every social network with guaranteed stability.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
                className="group relative rounded-xl border border-ink-700/80 bg-ink-800/70 p-6 transition-all hover:border-nova-500/60 hover:bg-ink-800 hover:shadow-xl hover:shadow-nova-500/10"
              >
                <div className="text-3xl">{p.icon}</div>
                <h3 className="mt-4 text-xl font-bold group-hover:text-nova-400 transition-colors">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold sm:text-4xl">Why Choose {s.siteName}?</h2>
            <p className="mt-3 text-base text-slate-400">
              Built specifically for agencies, influencers, and resellers who demand speed and reliability.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-ink-700/70 bg-ink-800/60 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-nova-500/15 text-2xl">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="border-t border-ink-700/60 bg-ink-900/40 py-20">
        <div className="mx-auto max-w-4xl px-5">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-3 text-base text-slate-400">Everything you need to know about placing orders and adding funds.</p>
          </div>

          <div className="mt-12 space-y-4">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-xl border border-ink-700/80 bg-ink-800/60 p-5 open:bg-ink-800 transition-colors"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-white hover:text-nova-400 transition-colors list-none">
                  <span>{faq.q}</span>
                  <span className="ml-4 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="relative overflow-hidden rounded-3xl border border-nova-500/30 bg-gradient-to-r from-ink-900 via-nova-950 to-ink-900 p-10 text-center shadow-2xl">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Accelerate Your Social Presence?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-400">
              Join thousands of creators and resellers using {s.siteName} for instant, automated social delivery.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-nova-500 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-nova-500/30 hover:bg-nova-600 transition-all active:scale-95"
              >
                Get Started for Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-700/80 bg-ink-950 py-10 text-sm text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5">
          <div>
            <Logo name={s.siteName} />
            <p className="mt-2 text-xs text-slate-500">
              © {new Date().getFullYear()} {s.siteName}. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <Link href="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a href={`mailto:${s.supportEmail}`} className="hover:text-white transition-colors">
              {s.supportEmail}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
