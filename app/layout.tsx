import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Nexora SMM", template: "%s · Nexora SMM" },
  description: "Place, track and top up social media marketing orders from one wallet.",
};
export const viewport: Viewport = { themeColor: "#0a0e17", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
