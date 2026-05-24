import Link from "next/link";
import Image from "next/image";
import {
  Gear,
  GearDivider,
  BottleIcon,
} from "@/components/SteampunkElements";

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden grain">
        {/* Hero photo */}
        <Image
          src="/images/hero.png"
          alt="Bartender counting inventory"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/60 to-bg/30" />
        <div className="absolute right-[-80px] top-[-40px] text-copper">
          <Gear size={300} className="gear-spin opacity-40" />
        </div>
        <div className="absolute right-[100px] top-[120px] text-brass">
          <Gear size={140} className="gear-spin-reverse opacity-30" />
        </div>
        <div className="absolute left-[-30px] bottom-[-30px] text-copper">
          <Gear size={180} className="gear-spin-slow opacity-20" />
        </div>

        {/* Steam puffs */}
        <div className="absolute right-[20%] top-[15%] pointer-events-none">
          <div className="steam-puff w-4 h-4 rounded-full bg-cream/5 blur-md" />
        </div>
        <div className="absolute right-[25%] top-[20%] pointer-events-none">
          <div className="steam-puff-delay w-3 h-3 rounded-full bg-cream/4 blur-lg" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            {/* Pipe accent */}
            <div className="flex items-center gap-3 mb-8">
              <div className="glow-dot" />
              <div className="h-[1px] w-16 bg-gradient-to-r from-patina to-transparent" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-patina-light font-medium">
                Free &amp; Open Source
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-8">
              <span className="copper-text">Bar inventory</span>
              <br />
              shouldn&rsquo;t cost
              <br />
              <span className="text-cream">you a thing.</span>
            </h1>

            <p className="text-text-muted text-lg md:text-xl leading-relaxed max-w-md mb-12">
              We built the tools we wished existed, tested them in a real
              restaurant, then gave them to the world. No subscriptions. No
              vendor lock-in. Just count your bottles and go home.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/downloads"
                className="group relative bg-copper hover:bg-copper-bright text-bg font-semibold px-8 py-4 text-sm tracking-wide transition-all hover:shadow-[0_0_30px_rgba(205,127,50,0.25)]"
              >
                <span className="relative z-10">Download Free Tools</span>
              </Link>
              <Link
                href="/about"
                className="border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-8 py-4 text-sm tracking-wide transition-all"
              >
                Read Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom pipe accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-copper/30 to-transparent" />
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-y border-gear-border bg-bg-panel">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBlock number="$0" label="Cost, forever" />
          <StatBlock number="6" label="Free tools" />
          <StatBlock number="3" label="Weeks of field testing" />
          <StatBlock number="100%" label="Open source" />
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-copper/40" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
                The Problem
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight copper-text">
              Every bartender
              <br />
              knows the drill.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <div className="space-y-5 text-text-muted leading-relaxed text-lg">
              <p>
                Close out. Grab the clipboard. Count every bottle by tenths.
                Scribble numbers on paper. Walk to the office. Type it all into
                a spreadsheet someone made in 2014. Try to reconcile against POS
                sales. Watch it never add up. Repeat next week.
              </p>
              <p>
                The bar industry has been doing this for decades. And companies
                have profited from the pain &mdash; selling $3,000 inventory
                guns, $200/month SaaS platforms, and consulting services that
                charge by the bottle.
              </p>
              <p className="text-cream font-medium text-xl">
                AI changed everything. Now we can build these tools for free.
                So we did.
              </p>
            </div>
          </div>
        </div>
      </section>

      <GearDivider />

      {/* ── WHAT WE BUILT ── tool cards with steampunk panels */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[1px] bg-copper/40" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
            The Workshop
          </span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4 max-w-lg">
          <span className="copper-text">Precision instruments</span> for the
          craft.
        </h2>
        <p className="text-text-muted mb-12 max-w-lg">
          Each tool built for a specific job. No bloat. No feature creep.
          Just what you need behind the bar.
        </p>

        {/* Workshop photo */}
        <div className="relative rounded-sm overflow-hidden panel mb-16">
          <div className="aspect-[21/9] relative">
            <Image
              src="/images/workshop.jpg"
              alt="Craftsman workbench with bar tools, jiggers, and vintage measuring instruments"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg/40 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ToolCard
            number="01"
            title="Smart Inventory Sheets"
            description="Pre-built spreadsheets that calculate cost, usage, variance, and reorder points. Plug in your counts — the gears do the rest."
            icon={<BottleIcon />}
          />
          <ToolCard
            number="02"
            title="Variance Tracker"
            description="Compare physical counts against POS sales. See exactly where you're losing money — by category, by bottle, by shift."
            icon={<BottleIcon />}
          />
          <ToolCard
            number="03"
            title="AI Bottle Counter"
            description="Snap a photo of your shelf. AI reads the bottle levels so you're not eyeballing tenths at 2am with bleary eyes."
            icon={<BottleIcon />}
          />
          <ToolCard
            number="04"
            title="Product Database"
            description="500+ common bar products pre-loaded. Bottle sizes, costs, standard pours. Skip the data entry, start counting."
            icon={<BottleIcon />}
          />
        </div>
      </section>

      {/* ── FIELD TESTED ── image-backed mention */}
      <section className="relative bg-bg-panel border-y border-gear-border overflow-hidden">
        <Image
          src="/images/hands.png"
          alt="Bartender writing inventory counts in a notebook at the bar"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/75 to-bg/50" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 flex items-center gap-6">
          <div className="h-12 w-[2px] bg-copper/40 shrink-0" />
          <p className="text-text-muted leading-relaxed">
            Field-tested at <span className="text-cream font-medium">Agave &amp; Rye</span> in
            downtown Cleveland. Real bottles. Real counts. Real pressure.
          </p>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <blockquote className="pull-quote">
          &ldquo;If you&rsquo;re going to build inventory tools, you better do
          it standing behind a bar at 2am with a clipboard. Otherwise
          you&rsquo;re just guessing.&rdquo;
        </blockquote>
        <p className="text-sm text-text-light mt-4 pl-7">
          &mdash; The philosophy behind Open Source Barware
        </p>
      </section>

      <GearDivider />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-warm to-bg" />
        <div className="absolute right-[10%] bottom-[-20px] text-copper">
          <Gear size={100} className="gear-spin-slow opacity-15" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-copper/40" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
              Get Started
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-copper/40" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
            <span className="copper-text">Grab the tools.</span> Start tonight.
          </h2>
          <p className="text-text-muted text-lg mb-10 max-w-md mx-auto">
            No signup. No email capture. No sales pitch. Click download and get
            to work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/downloads"
              className="inline-block bg-copper hover:bg-copper-bright text-bg font-semibold px-10 py-4 text-sm tracking-wide transition-all hover:shadow-[0_0_30px_rgba(205,127,50,0.25)]"
            >
              Download Free Tools
            </Link>
            <Link
              href="/resources"
              className="inline-block border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-10 py-4 text-sm tracking-wide transition-all"
            >
              Explore Community Resources
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function StatBlock({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="stat-number copper-text">{number}</div>
      <div className="text-xs text-text-light tracking-wider uppercase mt-1">
        {label}
      </div>
    </div>
  );
}

function ToolCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="panel card-lift rounded-sm p-8 relative rivets">
      <div className="flex items-start justify-between mb-6">
        <span className="text-xs font-mono text-text-light tracking-wider">
          {number}
        </span>
        <div className="opacity-60">{icon}</div>
      </div>
      <h3 className="font-serif text-xl text-cream mb-3">{title}</h3>
      <p className="text-text-muted leading-relaxed text-sm">{description}</p>
    </div>
  );
}
