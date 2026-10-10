import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexorasmm.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nexora SMM — #1 Fastest Social Media Marketing Panel Bangladesh",
    template: "%s · Nexora SMM",
  },
  description:
    "Nexora SMM is Bangladesh's top-tier, instant-delivery SMM panel. Boost Facebook, YouTube, TikTok, Telegram and Instagram with automated bKash deposit & 24/7 service.",
  keywords: [
    "SMM panel Bangladesh",
    "Nexora SMM",
    "bKash SMM panel",
    "Facebook boost Bangladesh",
    "YouTube watch time buy",
    "TikTok followers Bangladesh",
    "Instagram followers BD",
    "Telegram members boost",
    "cheap SMM panel bd",
    "instant delivery SMM",
    "Nagad SMM panel",
  ],
  authors: [{ name: "Nexora SMM Team", url: siteUrl }],
  creator: "Nexora SMM",
  publisher: "Nexora SMM",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Nexora SMM — Fastest Social Media Marketing Panel Bangladesh",
    description:
      "Automated SMM panel with instant bKash payment, lightning-fast order processing, and 24/7 reliable support.",
    siteName: "Nexora SMM",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora SMM — Premier SMM Panel Bangladesh",
    description:
      "Instant social media marketing services with automatic bKash wallet top-up and real-time order tracking.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Nexora SMM",
      description: "Fastest Social Media Marketing Panel in Bangladesh",
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/services?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Nexora SMM",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: ["English", "Bengali"],
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}
