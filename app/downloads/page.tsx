import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Gear, GearDivider, BottleIcon } from "@/components/SteampunkElements";

export const metadata: Metadata = {
  title: "Free Downloads — Open Source Barware",
  description:
    "Download free bar inventory tools. Spreadsheets, variance calculators, bottle counters. No signup required.",
};

export default function DownloadsPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden grain">
        <Image
          src="/images/bartop.png"
          alt="Overhead view of dark wood bar top with copper jigger"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/70 to-bg/40" />
        <div className="absolute right-[-40px] top-[-20px] text-copper">
          <Gear size={160} className="gear-spin opacity-12" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-12 md:pt-28 md:pb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-copper/40" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
              Downloads
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.08] max-w-xl mb-6">
            <span className="copper-text">Take what you need.</span>
            <br />
            It&rsquo;s all free.
          </h1>
          <p className="text-text-muted text-lg max-w-lg leading-relaxed">
            No signup wall. No email capture. No &ldquo;book a demo.&rdquo;
            Click download and start counting smarter tonight.
          </p>
        </div>
      </section>

      <GearDivider />

      {/* ── TOOL CARDS ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DownloadCard
            number="01"
            title="Bar Inventory Master Sheet"
            format="XLSX"
            description="Complete workbook with tabs for liquor, beer, wine, and mixers. Formulas calculate total value, usage rate, pour cost, and reorder alerts."
            status="coming-soon"
          />
          <DownloadCard
            number="02"
            title="Quick Count Template"
            format="PDF + XLSX"
            description="Stripped-down count sheet for weekly spot checks. Print it, grab a pen, count, done. Only the columns that matter."
            status="coming-soon"
          />
          <DownloadCard
            number="03"
            title="Variance Calculator"
            format="XLSX"
            description="Plug in physical counts and POS data. Calculates pour cost, shrinkage by category, flags problem products automatically."
            status="coming-soon"
          />
          <DownloadCard
            number="04"
            title="Product Database"
            format="CSV + XLSX"
            description="500+ common bar products with bottle sizes, standard costs, and pour sizes. Import and skip the data entry."
            status="coming-soon"
          />
          <DownloadCard
            number="05"
            title="AI Bottle Counter"
            format="Python"
            description="Open-source script using your phone camera to estimate fill levels. Runs locally — your data stays yours."
            status="coming-soon"
          />
          <DownloadCard
            number="06"
            title="Mobile Count App"
            format="Web App"
            description="Progressive web app for counting on your phone. Works offline behind the bar, syncs on WiFi. Replace the clipboard."
            status="coming-soon"
          />
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section className="relative bg-bg-panel border-y border-gear-border overflow-hidden grain">
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-copper">
          <Gear size={180} className="gear-spin-slow opacity-12" />
        </div>
        <div className="absolute right-[-40px] bottom-[-40px] text-copper">
          <Gear size={120} className="gear-spin-reverse opacity-10" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex items-center gap-3 mb-4">
            <div className="glow-dot" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-patina-light">
              Roadmap
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4">
            <span className="copper-text">
              Where we are. Where we&rsquo;re going.
            </span>
          </h2>
          <p className="text-text-muted mb-16 max-w-lg">
            Everything is being built live at Agave &amp; Rye. Real testing,
            real data, real feedback from working bartenders.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PhaseCard
              number="I"
              title="Foundation"
              timing="Weeks 1–2"
              status="active"
              items={[
                "Full baseline inventory count",
                "Master spreadsheet with live data",
                "Quick count template",
                "Product categorization system",
              ]}
            />
            <PhaseCard
              number="II"
              title="Intelligence"
              timing="Week 3"
              status="next"
              items={[
                "Variance calculator + POS matching",
                "Product database (500+ items)",
                "Reorder point formulas",
                "Category-level cost analysis",
              ]}
            />
            <PhaseCard
              number="III"
              title="Automation"
              timing="Post-Launch"
              status="planned"
              items={[
                "AI bottle level reader",
                "Mobile progressive web app",
                "POS data import tools",
                "Multi-location support",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── CONTRIBUTE ── */}
      <section className="relative overflow-hidden">
        <div className="absolute right-[5%] bottom-0 text-copper">
          <Gear size={80} className="gear-spin-slow opacity-10" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-copper/40" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
              Open Source
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-copper/40" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
            <span className="copper-text">Built in the open.</span>
            <br />
            Contributions welcome.
          </h2>
          <p className="text-text-muted text-lg mb-10 max-w-md mx-auto">
            Bartender with ideas? Developer who wants to help? Bar owner
            who wants to test? This is a community project &mdash; jump in.
          </p>
          <Link
            href="/about"
            className="inline-block border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-8 py-4 text-sm tracking-wide transition-all"
          >
            Learn About the Project
          </Link>
        </div>
      </section>
    </>
  );
}

function DownloadCard({
  number,
  title,
  format,
  description,
  status,
}: {
  number: string;
  title: string;
  format: string;
  description: string;
  status: "available" | "coming-soon";
}) {
  return (
    <div className="panel card-lift rounded-sm p-7 flex flex-col relative rivets">
      <div className="flex items-start justify-between mb-5">
        <span className="text-xs font-mono text-text-light tracking-wider">
          {number}
        </span>
        <span className="text-[10px] font-mono tracking-wider text-copper border border-gear-border px-2 py-0.5">
          {format}
        </span>
      </div>
      <div className="mb-4 opacity-40">
        <BottleIcon />
      </div>
      <h3 className="font-serif text-lg text-cream mb-3">{title}</h3>
      <p className="text-text-muted text-sm leading-relaxed mb-8 flex-1">
        {description}
      </p>
      {status === "available" ? (
        <button className="w-full bg-copper hover:bg-copper-bright text-bg font-semibold py-3 text-sm tracking-wide transition-all hover:shadow-[0_0_20px_rgba(205,127,50,0.2)]">
          Download Free
        </button>
      ) : (
        <div className="w-full border border-gear-border text-text-light text-xs tracking-[0.2em] uppercase py-3 text-center">
          Building at Agave &amp; Rye
        </div>
      )}
    </div>
  );
}

function PhaseCard({
  number,
  title,
  timing,
  status,
  items,
}: {
  number: string;
  title: string;
  timing: string;
  status: "active" | "next" | "planned";
  items: string[];
}) {
  return (
    <div className="panel rounded-sm p-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="font-serif text-2xl copper-text">{number}</span>
        {status === "active" && <div className="glow-dot" />}
      </div>
      <h3 className="font-serif text-xl text-cream mb-1">{title}</h3>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-text-muted">{timing}</span>
        <span
          className={`text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 border ${
            status === "active"
              ? "text-patina-light border-patina/30"
              : status === "next"
              ? "text-copper border-gear-border"
              : "text-text-light border-gear-border"
          }`}
        >
          {status === "active"
            ? "In Progress"
            : status === "next"
            ? "Up Next"
            : "Planned"}
        </span>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-text-muted text-sm flex items-start gap-3"
          >
            <span
              className={`mt-1.5 block w-1.5 h-1.5 rounded-full shrink-0 ${
                status === "active" ? "bg-patina-light" : "bg-copper/30"
              }`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
