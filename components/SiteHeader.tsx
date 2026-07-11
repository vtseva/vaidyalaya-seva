"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const nav = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/impact", label: "Impact" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white border-b border-warm-100 sticky top-0 z-40">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:px-3 focus:py-2 focus:rounded">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between gap-3 py-2">
        <Link href="/" className="flex items-center gap-2 min-h-[44px]">
          <Image src="/images/logo-vikasa-tarangini.png" alt="Vikasa Tarangini logo" width={44} height={44} />
          <span className="font-serif font-bold text-primary-900 text-lg leading-tight hidden sm:block">
            Vaidyalaya Seva
          </span>
          <Image src="/images/logo-vt-seva.png" alt="VT Seva logo" width={52} height={40} />
        </Link>
        <nav className="hidden lg:flex items-center gap-5" aria-label="Main navigation">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-gray-700 hover:text-primary-800 font-medium py-2">
              {n.label}
            </Link>
          ))}
          <Link href="/request-support" className="btn-accent !py-2 !px-4 text-sm">
            Request Hospital Support
          </Link>
          <Link href="/login" className="text-sm text-gray-500 hover:text-primary-800 py-2">
            Login
          </Link>
        </nav>
        <button
          className="lg:hidden p-3 min-h-[44px] min-w-[44px]"
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          onClick={() => setOpen(!open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-warm-100 bg-white px-4 pb-4" aria-label="Mobile navigation">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block py-3 text-gray-800 font-medium border-b border-warm-100">
              {n.label}
            </Link>
          ))}
          <Link href="/request-support" onClick={() => setOpen(false)} className="btn-accent w-full mt-3">
            Request Hospital Support
          </Link>
          <Link href="/login" onClick={() => setOpen(false)} className="block py-3 text-gray-500 text-center">
            Login
          </Link>
        </nav>
      )}
    </header>
  );
}
