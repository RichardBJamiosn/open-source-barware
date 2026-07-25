import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { Gear } from "./SteampunkElements";

export default function Footer() {
  return (
    <footer className="relative border-t border-gear-border mt-auto overflow-hidden">
      {/* Decorative gears */}
      <div className="absolute -right-10 -bottom-10 text-copper">
        <Gear size={120} className="gear-spin-slow opacity-30" />
      </div>
      <div className="absolute -left-6 -top-6 text-copper">
        <Gear size={60} className="gear-spin-reverse opacity-20" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand — same martini wordmark as header */}
          <div className="md:col-span-5">
            <Link
              href="/"
              className="inline-block mb-4 opacity-100 hover:opacity-90 transition-opacity"
              aria-label="Open Source Barware — home"
            >
              <BrandLogo />
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-sm">
              Crafted by bartenders. Given to the trade, no strings attached.
              Because a good program shouldn&rsquo;t cost you a shift&rsquo;s worth of tips.
            </p>
          </div>

          {/* Nav */}
          <div className="md:col-span-3 md:col-start-7">
            <span className="text-[10px] text-text-light tracking-[0.3em] uppercase block mb-4">
              Navigate
            </span>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm text-text-muted hover:text-copper transition-colors">Home</Link>
              <Link href="/the-process" className="text-sm text-text-muted hover:text-copper transition-colors">The Process</Link>
              <Link href="/about" className="text-sm text-text-muted hover:text-copper transition-colors">About</Link>
              <Link href="/manifesto" className="text-sm text-text-muted hover:text-copper transition-colors">Manifesto</Link>
              <Link href="/resources" className="text-sm text-text-muted hover:text-copper transition-colors">Resources</Link>
              <Link href="/blog" className="text-sm text-text-muted hover:text-copper transition-colors">Blog</Link>
              <Link href="/download" className="text-sm text-text-muted hover:text-copper transition-colors">Download Program</Link>
              <Link href="/downloads" className="text-sm text-text-muted hover:text-copper transition-colors">Program Guide</Link>
              <Link href="/open-source-compliance" className="text-sm text-text-muted hover:text-copper transition-colors">Compliance</Link>
              <Link href="/inventory/dashboard" className="text-sm text-text-muted hover:text-copper transition-colors">Live Demo</Link>
              <Link href="/changelog" className="text-sm text-text-muted hover:text-copper transition-colors">Release notes</Link>
            </div>
          </div>

          {/* Inventory by category */}
          <div className="md:col-span-3">
            <span className="text-[10px] text-text-light tracking-[0.3em] uppercase block mb-4">
              Free Inventory
            </span>
            <div className="flex flex-col gap-3 mb-8">
              <Link href="/free-bar-inventory-software" className="text-sm text-text-muted hover:text-copper transition-colors">Bar Inventory Software</Link>
              <Link href="/liquor-inventory" className="text-sm text-text-muted hover:text-copper transition-colors">Liquor Inventory</Link>
              <Link href="/wine-inventory" className="text-sm text-text-muted hover:text-copper transition-colors">Wine Inventory</Link>
            </div>
            <span className="text-[10px] text-text-light tracking-[0.3em] uppercase block mb-4">
              Workshop
            </span>
            <p className="text-sm text-text-muted leading-relaxed">
              A Richard B. Jamison project.
              <br />
              Forged in Cleveland, Ohio.
              <br />
              Free forever.
              <br />
              {/* Stealth entry to NEXUS — looks like plain text, not a link */}
              <Link
                href="/B-ATCAVE/"
                className="text-sm text-text-muted no-underline hover:no-underline hover:text-text-muted cursor-default focus:outline-none"
                style={{ textDecoration: "none", color: "inherit" }}
                aria-label="Legal"
              >
                Legal
              </Link>
            </p>
            <p className="text-[11px] text-text-light leading-relaxed mt-4 max-w-[14rem]">
              Web &amp; systems notes:{" "}
              <a
                href="https://resonantwebdesign.com/industries/restaurants-hospitality-web-design/"
                className="text-text-light hover:text-copper transition-colors underline-offset-2 hover:underline"
                rel="noopener noreferrer"
              >
                Resonant
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gear-border mt-12 pt-6 flex flex-wrap items-center justify-center gap-3 text-center">
          <div className="w-1.5 h-1.5 rounded-full bg-copper/30" />
          <p className="text-xs text-text-light">
            &copy; {new Date().getFullYear()} Open Source Barware &mdash; All
            the program is free and open source under GPLv3
          </p>
          <Link
            href="/open-source-compliance"
            className="text-xs text-copper hover:text-copper-bright transition-colors"
          >
            License and source
          </Link>
          <div className="w-1.5 h-1.5 rounded-full bg-copper/30" />
        </div>
      </div>
    </footer>
  );
}
