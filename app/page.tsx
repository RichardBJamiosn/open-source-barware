import Link from "next/link";
import {
  Gear,

  BottleIcon,
} from "@/components/SteampunkElements";
import HeroVideo from "@/components/HeroVideo";
import OptimizedPicture from "@/components/OptimizedPicture";
import ProblemHourglass from "@/components/ProblemHourglass";
import { pageMetadata } from "@/lib/seo";

// Title deliberately leads with the brand, NOT "Free Bar Inventory Software".
// GSC 2026-07-25: this page held 188 impressions while /free-bar-inventory-software
// and /bar-inventory-software-comparison sat at "Discovered - currently not indexed"
// with zero. Five pages shared the same head phrase and the homepage's authority
// suppressed the dedicated ones. The exact-match phrase now belongs to
// /free-bar-inventory-software alone. Do not put it back at the front of this title.
export const metadata = pageMetadata({
  title: "Open Source Barware — Free Bar Inventory Built by Bartenders",
  description:
    "Free, open-source bar inventory that runs on your own laptop. Counts, variance, pour cost—no subscription, no account, no cloud lock-in. Built by operators.",
  path: "/",
  keywords: [
    "open source bar inventory",
    "open source barware",
    "local-first bar inventory",
    "bar inventory software no subscription",
    "self-hosted bar inventory",
    "free inventory system",
  ],
});

const primaryCtaClass =
  "group relative inline-flex w-full items-center justify-center bg-copper px-8 py-4 text-center text-sm font-semibold tracking-wide text-bg transition-all hover:bg-copper-bright hover:shadow-[0_0_30px_rgba(168,120,79,0.25)] sm:w-[210px]";

const workshopTools = [
  {
    number: "01",
    title: "Smart Inventory Sheets",
    description:
      "Pre-built spreadsheets that calculate cost, usage, variance, and reorder points.",
  },
  {
    number: "02",
    title: "Variance Tracker",
    description:
      "Compare physical counts against POS sales by category, bottle, and shift.",
  },
  {
    number: "03",
    title: "Optional Invoice Photos",
    description:
      "Type invoice numbers yourself — or connect AI to read paper invoice photos from your phone.",
  },
  {
    number: "04",
    title: "Product Database",
    description:
      "500+ common bar products with bottle sizes, costs, and standard pours.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden grain">
        {/* Hero video */}
        <HeroVideo />
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
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-8">
              <span className="copper-text">Bar inventory</span>
              <br />
              shouldn&rsquo;t cost
              <br />
              <span className="text-cream">you a thing.</span>
            </h1>

            <p className="text-text-muted text-lg md:text-xl leading-relaxed max-w-md mb-12">
              A brilliantly built inventory program that lives on your laptop.
              Voice-walk, count, reconcile, and Process &mdash; no AI required.
              Optional AI only if you want invoice photos read for you.
              Free. No subscriptions. No vendor lock-in.
            </p>

            {/* Signal design: Download first only after /download serves real zips (not Loading…).
                Wrong order used to push traffic into a broken funnel and poison engagement signals. */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/download"
                className={primaryCtaClass}
              >
                <span className="relative z-10">Download Program</span>
              </Link>
              <Link
                href="/the-process"
                className={primaryCtaClass}
              >
                <span className="relative z-10">Learn This System</span>
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
          <StatBlock number="$0" label="Cost" />
          <StatBlock number="1" label="Free program" />
          <StatBlock number="3" label="Easy steps" detail="Each week" />
          <StatBlock number="100%" label="Simple" detail="Add data. Get inventory." />
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="bg-black px-6 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex flex-col items-center">
            <p className="mb-5 text-[10px] uppercase tracking-[0.32em] text-text-light/80">
              The Problem
            </p>
            <ProblemHourglass />
          </div>

          <h2 className="mt-8 font-serif text-4xl leading-[1.08] copper-text md:text-5xl lg:text-[3.25rem]">
            Every bar manager knows the drill.
          </h2>

          <div className="mx-auto mt-8 max-w-xl space-y-4 text-center text-sm leading-relaxed text-text-muted md:text-base">
            <p>
              End of the calendar month. Grab a barback &amp; clipboard. Count
              every bottle by tenths. Scribble numbers on paper. Walk to the
              office. Type it all into a spreadsheet someone made in 2014. Try
              to reconcile against POS sales. Watch it never add up. Repeat next
              month.
            </p>
            <p>
              The bar industry has been doing this for decades. And companies
              have profited from the pain &mdash; selling $3,000 inventory guns,
              $200/month SaaS platforms, and consulting services that charge by
              the bottle.
            </p>
            <p className="text-cream font-medium">
              AI changed everything. Now we can build this program for free. So
              we did.
            </p>
            <p className="sr-only">
              <Link href="/manifesto">Read the full manifesto</Link>
            </p>
          </div>

          <p className="mt-12 text-[10px] uppercase tracking-[0.28em] text-text-light/70">
            Get Your Time Back
          </p>
        </div>
      </section>

      {/* ── WHAT WE BUILT ── program card with steampunk panels */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-12 md:pt-10 md:pb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[1px] bg-copper/40" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
            The Workshop
          </span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4 max-w-2xl">
          <span className="copper-text">Precision instruments</span>
          <span className="whitespace-nowrap"> for the craft.</span>
        </h2>
        <p className="text-text-muted mb-12 max-w-lg">
          We provide one simple system. Here you will find the free program
          and the markdown that explains how it works.
        </p>

        {/* Workshop photo */}
        <div className="relative rounded-sm overflow-hidden panel mb-16">
          <div className="aspect-[21/9] relative">
            <OptimizedPicture
              webpSrc="/images/workshop-1280.webp"
              fallbackSrc="/images/workshop.jpg"
              alt="Craftsman workbench with bar tools, jiggers, and vintage measuring instruments for the free bar inventory system"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg/40 to-transparent" />
          </div>
        </div>

        <Link
          href="/download"
          aria-label="Download the complete Open Source Barware program"
          className="group block panel card-lift rounded-sm p-6 md:p-8 relative rivets focus:outline-none focus-visible:ring-2 focus-visible:ring-copper/70"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-8">
            <div>
              <span className="text-xs font-mono text-text-light tracking-wider">
                01-04
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-cream mt-5 mb-3 group-hover:text-copper transition-colors">
                One free program, the full workflow inside.
              </h3>
              <p className="text-text-muted leading-relaxed max-w-2xl">
                The pieces below live inside one free program for the full
                inventory workflow.
              </p>
            </div>
            <div className="flex items-center gap-4 text-copper">
              <span className="text-sm font-semibold tracking-wide text-copper">
                Download Program
              </span>
              <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                <BottleIcon />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-copper/25 bg-copper/20">
            {workshopTools.map((tool) => (
              <div
                key={tool.number}
                className="min-h-[132px] bg-bg-panel/95 p-6 md:p-7"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <span className="text-xs font-mono text-text-light tracking-wider">
                    {tool.number}
                  </span>
                  <div className="text-copper opacity-50">
                    <BottleIcon />
                  </div>
                </div>
                <h4 className="font-serif text-xl text-cream mb-2">
                  {tool.title}
                </h4>
                <p className="text-text-muted leading-relaxed text-sm">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-6 text-sm text-text-muted">
          <span className="text-text-light">Tracking one category?</span>
          <Link href="/liquor-inventory" className="text-copper hover:text-copper-bright transition-colors">
            Free Liquor Inventory
          </Link>
          <span className="text-text-light">&middot;</span>
          <Link href="/wine-inventory" className="text-wine-glow hover:text-copper transition-colors">
            Free Wine Inventory
          </Link>
        </div>
      </section>

      {/* ── FIELD TESTED ── image-backed mention */}
      <section className="relative bg-bg-panel border-y border-gear-border overflow-hidden min-h-[220px]">
        <OptimizedPicture
          webpSrc="/images/hands.webp"
          fallbackSrc="/images/hands.png"
          alt="Bartender writing inventory counts in a notebook at the bar using free inventory system"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/75 to-bg/50" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 flex items-center gap-6">
          <div className="h-12 w-[2px] bg-copper/40 shrink-0" />
          <p className="text-text-muted leading-relaxed text-lg">
            Years of field-tested knowledge &mdash; spoken the way it was meant to be.
          </p>
        </div>
      </section>

      {/* ── PULL QUOTE + CTA ── */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-10 pb-4 md:pt-12">
          <blockquote className="pull-quote">
            &ldquo;If you help enough people get what they need, the universe will
            provide what you need.&rdquo;
          </blockquote>
          <p className="text-sm text-text-light mt-4 pl-7">
            &mdash; The philosophy behind Open Source Barware
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-warm to-bg" />
        <div className="absolute right-[10%] bottom-[-20px] text-copper">
          <Gear size={100} className="gear-spin-slow opacity-15" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 pb-12 md:pb-16 pt-2 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-copper/40" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
              Get Started
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-copper/40" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
            <span className="copper-text">Open the program.</span> Start tonight.
          </h2>
          <p className="text-text-muted text-lg mb-10 max-w-md mx-auto">
            No signup. No email capture. No sales pitch. Download the program
            and get to work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/download"
              className="inline-block bg-copper hover:bg-copper-bright text-bg font-semibold px-10 py-4 text-sm tracking-wide transition-all hover:shadow-[0_0_30px_rgba(168,120,79,0.25)]"
            >
              Download Program
            </Link>
            <Link
              href="/download"
              className="inline-block border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-10 py-4 text-sm tracking-wide transition-all"
            >
              Explore Community Resources
            </Link>
          </div>
        </div>
      </section>

      {/* Video and Image structured data for SEO - backend only */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "VideoObject",
                "name": "Free Bar Inventory System Demo - Open Source Barware",
                "description": "See the free bar inventory system in action: voice walk mapping, tenths counting, variance tracking, and smart orders. The best free inventory system for bars, built by bartenders.",
                "thumbnailUrl": "https://opensourcebarware.com/images/hero-poster.jpg",
                "uploadDate": "2026-07-04T00:00:00Z",
                "contentUrl": "https://opensourcebarware.com/videos/hero-bartender-compressed.mp4",
                "duration": "PT0M30S",
                "transcript": "The video shows a bartender in a professional bar setting demonstrating the free bar inventory program. It highlights voice notes for mapping stations, counting bottles in tenths, reconciling with POS and purchases, and viewing variance and orders on the home base dashboard. The program runs entirely on the laptop with no cloud or subscription required.",
                "interactionStatistic": {
                  "@type": "InteractionCounter",
                  "interactionType": { "@type": "WatchAction" },
                  "userInteractionCount": 1000
                }
              },
              {
                "@type": "ImageObject",
                "contentUrl": "https://opensourcebarware.com/images/workshop-1280.webp",
                "name": "Craftsman workbench with bar tools for free bar inventory system",
                "description": "Precision tools for the free bar inventory system - jiggers, measures for accurate counts."
              },
              {
                "@type": "ImageObject",
                "contentUrl": "https://opensourcebarware.com/images/hands.webp",
                "name": "Bartender using free inventory system to count bottles",
                "description": "Field-tested free bar inventory system in action - writing counts the old school way."
              }
            ]
          })
        }}
      />
    </>
  );
}

function StatBlock({
  number,
  label,
  detail,
}: {
  number: string;
  label: string;
  detail?: string;
}) {
  return (
    <div className="text-center">
      <div className="stat-number copper-text">{number}</div>
      <div
        aria-label={`${number} ${label}${detail ? `, ${detail}` : ""}`}
        className="mt-2 min-h-[38px] text-[11px] uppercase leading-relaxed tracking-[0.18em] text-text-light"
      >
        {label}
        {detail ? (
          <>
            {" "}
            <span className="mt-0.5 block text-[10px] tracking-[0.14em] text-text-light/75">
              {detail}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}
