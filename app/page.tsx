import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { Logo } from "@/components/ui";
import { LandingHeader } from "@/components/landing-header";

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
    q: "What payment methods are supported in Bangladesh?",
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

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
      {
        "@type": "Service",
        name: `${s.siteName} SMM Reseller Panel`,
        serviceType: "Social Media Marketing Services",
        provider: {
          "@type": "Organization",
          name: s.siteName,
        },
        areaServed: {
          "@type": "Country",
          name: "Bangladesh",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "SMM Growth Services",
          itemListElement: PLATFORMS.map((p, idx) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: `${p.name} SMM Services`,
              description: p.desc,
            },
            position: idx + 1,
          })),
        },
      },
    ],
  };

  return (
    <div className="min-h-screen text-slate-800 bg-[#f8fafc] overflow-x-hidden">
      {/* Schema.org Rich FAQ and Service SEO Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* Top Navbar */}
      <LandingHeader siteName={s.siteName} user={user} supportEmail={s.supportEmail} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="truncate">#1 SMM Reseller & Growth Panel Bangladesh</span>
              </div>

              {/* Main Heading (SEO H1) */}
              <h1 className="mt-4 sm:mt-6 text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-slate-900 tracking-tight">
                Supercharge Your Social Growth With{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  {s.siteName}
                </span>
              </h1>

              {/* Lead description */}
              <p className="mt-4 sm:mt-6 text-sm sm:text-lg leading-relaxed text-slate-600 max-w-2xl">
                The most reliable, high-speed automated social media marketing panel. Wholesale pricing for Facebook, YouTube, Instagram, TikTok, Telegram and more — with local bKash payments.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link
                  href={user ? "/new-order" : "/register"}
                  className="inline-flex items-center justify-center rounded-xl bg-nova-500 px-6 sm:px-7 py-3.5 text-center text-sm sm:text-base font-bold text-white shadow-lg shadow-nova-500/25 transition-all hover:bg-nova-600 active:scale-95 whitespace-nowrap"
                >
                  {user ? "⚡ Place New Order" : "🚀 Create Free Account"}
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 sm:px-6 py-3.5 text-center text-sm sm:text-base font-semibold text-slate-700 transition-all hover:border-blue-500 hover:text-blue-600 hover:bg-slate-50 active:scale-95 shadow-2xs whitespace-nowrap"
                >
                  🔍 View Services & Rates
                </Link>
              </div>

              {/* Quick stats mini bar */}
              <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-4 border-t border-slate-200/90 pt-6 sm:pt-8 sm:grid-cols-4">
                {STATS.map((st) => (
                  <div key={st.label} className="rounded-xl bg-white/70 sm:bg-transparent p-3 sm:p-0 border border-slate-200/60 sm:border-0 shadow-2xs sm:shadow-none">
                    <p className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900">{st.value}</p>
                    <p className="mt-0.5 text-xs text-slate-500 font-medium">{st.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Preview Mock */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="rounded bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-emerald-700">
                    ● Instant Processing
                  </span>
                </div>

                <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4 text-sm">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-3.5">
                    <p className="text-[11px] sm:text-xs font-semibold uppercase text-slate-500">Selected Platform</p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="font-semibold text-slate-900 text-xs sm:text-sm">YouTube Monetization Package</p>
                      <span className="text-[11px] sm:text-xs font-semibold text-blue-600">High Retention</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-3.5">
                    <p className="text-[11px] sm:text-xs font-semibold uppercase text-slate-500">Target Channel Link</p>
                    <p className="mt-1 truncate font-mono text-[11px] sm:text-xs text-slate-700">https://youtube.com/@yourchannel</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-3.5">
                      <p className="text-[11px] sm:text-xs font-semibold uppercase text-slate-500">Quantity</p>
                      <p className="mt-1 font-bold text-slate-900 text-xs sm:text-sm">4,000 Hours</p>
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 sm:p-3.5">
                      <p className="text-[11px] sm:text-xs font-semibold uppercase text-amber-800">Total Price</p>
                      <p className="mt-1 font-display font-extrabold text-amber-700 text-xs sm:text-sm">
                        {s.currency} Live Calculated
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-nova-500 py-3 text-center text-xs sm:text-sm font-bold text-white shadow-md shadow-nova-500/25">
                    ⚡ Instant Submit to API
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Platforms */}
      <section id="services" className="border-t border-slate-200 bg-slate-50/70 py-14 sm:py-20 scroll-mt-14 sm:scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">All Popular Platforms in One Place</h2>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600">
              Access hundreds of verified high-quality services for every social network with guaranteed stability.
            </p>
          </div>

          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORMS.map((p) => (
              <Link
                key={p.name}
                href={`/services?q=${encodeURIComponent(p.name)}`}
                className="group relative rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-blue-500 hover:shadow-md hover:-translate-y-1 block cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="text-3xl transition-transform group-hover:scale-110">{p.icon}</div>
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    View Services →
                  </span>
                </div>
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {p.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{p.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-14 sm:py-20 bg-white border-t border-slate-200 scroll-mt-14 sm:scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Why Choose {s.siteName}?</h2>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600">
              Built specifically for agencies, influencers, and resellers who demand speed and reliability.
            </p>
          </div>

          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-600">
                  {f.icon}
                </div>
                <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="border-t border-slate-200 bg-slate-50/70 py-14 sm:py-20 scroll-mt-14 sm:scroll-mt-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600">Everything you need to know about placing orders and adding funds.</p>
          </div>

          <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-4">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition-colors"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors list-none select-none">
                  <span>{faq.q}</span>
                  <span className="ml-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0">▼</span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-12 sm:py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 sm:p-10 md:p-12 text-center shadow-xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Ready to Accelerate Your Social Presence?
            </h2>
            <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-xs sm:text-base text-blue-100">
              Join thousands of creators and resellers using {s.siteName} for instant, automated social delivery.
            </p>
            <div className="mt-6 sm:mt-8 flex justify-center">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl bg-white px-7 py-3.5 text-sm sm:text-base font-bold text-blue-700 shadow-lg hover:bg-slate-50 transition-all active:scale-95 whitespace-nowrap"
              >
                Get Started for Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-10 text-sm text-slate-600">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <Logo name={s.siteName} />
            <p className="mt-2 text-xs text-slate-500">
              © {new Date().getFullYear()} {s.siteName}. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600">
            <Link href="/services" className="hover:text-blue-600 transition-colors">
              Services
            </Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <a href={`mailto:${s.supportEmail}`} className="hover:text-blue-600 transition-colors">
              {s.supportEmail}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
