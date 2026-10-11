"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui";
import { logoutAction } from "@/app/actions/auth";

interface LandingHeaderProps {
  siteName: string;
  user: {
    role: string;
    email?: string;
    name?: string | null;
  } | null;
  supportEmail?: string;
}

export function LandingHeader({ siteName, user }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-3 sm:py-3.5">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label={`${siteName} Home`}
          className="transition-transform hover:scale-105 active:scale-95 shrink-0 flex items-center"
        >
          <Logo name={siteName} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Desktop Navigation"
          className="hidden items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-600 md:flex"
        >
          <Link href="#services" className="hover:text-blue-600 transition-colors">
            Services
          </Link>
          <Link href="#features" className="hover:text-blue-600 transition-colors">
            Why Us
          </Link>
          <Link href="#faq" className="hover:text-blue-600 transition-colors">
            FAQ
          </Link>
          <Link href="/terms" className="hover:text-blue-600 transition-colors">
            Terms
          </Link>
        </nav>

        {/* Right Actions & Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {user ? (
            <>
              <Link
                href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="whitespace-nowrap rounded-lg bg-nova-500 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-nova-500/20 transition-all hover:bg-nova-600 active:scale-95"
              >
                {user.role === "ADMIN" ? "Admin Panel" : "Dashboard"}
              </Link>
              <form action={logoutAction} className="hidden sm:inline-block">
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-1.5 sm:py-2 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95 shadow-2xs"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap rounded-lg px-2 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="whitespace-nowrap rounded-lg bg-nova-500 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-nova-500/20 transition-all hover:bg-nova-600 active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="inline-flex md:hidden items-center justify-center rounded-lg p-1.5 sm:p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-[57px] sm:top-[65px] z-40 bg-slate-900/30 backdrop-blur-xs md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div
            className="fixed inset-x-0 top-[57px] sm:top-[65px] z-50 border-b border-slate-200 bg-white px-4 py-5 shadow-2xl md:hidden max-h-[calc(100vh-65px)] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-3">
              <Link
                href="/services"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">⚡</span> Services & Rates
                </span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-full">Wholesale</span>
              </Link>

              <Link
                href="#features"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">⭐</span> Why Choose Nexora SMM
                </span>
                <span className="text-xs text-slate-400">→</span>
              </Link>

              <Link
                href="#faq"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">❓</span> Frequently Asked Questions
                </span>
                <span className="text-xs text-slate-400">→</span>
              </Link>

              <Link
                href="/terms"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">📜</span> Terms of Service & Policy
                </span>
                <span className="text-xs text-slate-400">→</span>
              </Link>
            </nav>

            <div className="mt-5 pt-4 border-t border-slate-100">
              {user ? (
                <div className="space-y-2.5">
                  <Link
                    href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                    onClick={closeMenu}
                    className="flex w-full items-center justify-center rounded-xl bg-nova-500 py-3 text-sm font-bold text-white shadow-md shadow-nova-500/20 active:scale-98"
                  >
                    Go to {user.role === "ADMIN" ? "Admin Panel" : "Dashboard"}
                  </Link>
                  <form action={logoutAction} className="w-full">
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 active:scale-98"
                    >
                      Log out
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="flex w-full items-center justify-center rounded-xl bg-nova-500 py-3 text-sm font-bold text-white shadow-md shadow-nova-500/25 active:scale-98"
                  >
                    🚀 Create Free Account
                  </Link>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 active:scale-98"
                  >
                    🔑 Log in
                  </Link>
                </div>
              )}

              {/* Trust Badge Bar */}
              <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Instant bKash, Nagad & Rocket 24/7 Automated Delivery</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
