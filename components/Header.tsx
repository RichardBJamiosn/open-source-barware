"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import SignMarqueeLights from "@/components/SignMarqueeLights";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDojo = pathname?.startsWith("/inventory");

  const logo = <BrandLogo />;

  return (
    <header className="bg-bg border-b border-gear-border">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="group opacity-100 hover:opacity-90 transition-opacity">
          {isDojo ? <SignMarqueeLights>{logo}</SignMarqueeLights> : logo}
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/" className="text-text-muted hover:text-copper transition-colors tracking-wide">Home</Link>
          <Link href="/the-process" className="text-text-muted hover:text-copper transition-colors tracking-wide">The Process</Link>
          <Link href="/about" className="text-text-muted hover:text-copper transition-colors tracking-wide">About</Link>
          <Link href="/resources" className="text-text-muted hover:text-copper transition-colors tracking-wide">Resources</Link>
          <Link
            href="/inventory/dashboard"
            className={`tracking-wide transition-colors ${isDojo ? "text-copper" : "text-text-muted hover:text-copper"}`}
          >
            Live Demo
          </Link>
          <Link
            href="/download"
            className="relative bg-copper hover:bg-copper-bright text-bg font-semibold px-6 py-2.5 tracking-wide transition-all hover:shadow-[0_0_20px_rgba(168,120,79,0.3)]"
          >
            Download Program
          </Link>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden text-copper"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-gear-border px-6 py-6 bg-bg-warm flex flex-col gap-4 text-sm">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-copper transition-colors py-1">Home</Link>
          <Link href="/the-process" onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-copper transition-colors py-1">The Process</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-copper transition-colors py-1">About</Link>
          <Link href="/resources" onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-copper transition-colors py-1">Resources</Link>
          <Link
            href="/inventory/dashboard"
            onClick={() => setMenuOpen(false)}
            className={`py-1 transition-colors ${isDojo ? "text-copper" : "text-text-muted hover:text-copper"}`}
          >
            Live Demo
          </Link>
          <Link href="/download" onClick={() => setMenuOpen(false)} className="bg-copper text-bg font-semibold px-6 py-2.5 tracking-wide text-center">Download Program</Link>
        </div>
      )}
    </header>
  );
}
