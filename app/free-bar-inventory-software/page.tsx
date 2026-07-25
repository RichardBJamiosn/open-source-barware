import Link from "next/link";
import OptimizedPicture from "@/components/OptimizedPicture";
import { Gear, GearDivider } from "@/components/SteampunkElements";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Bar Inventory Software — Bottle-Level Variance | Open Source Barware",
  description:
    "Free bar inventory software with bottle-level variance—download tonight, no monthly fee. Open source, local-first, no subscription.",
  path: "/free-bar-inventory-software",
  keywords: [
    "free inventory system",
    "best free bar inventory system",
    "free bar inventory software",
    "bar inventory software free",
    "free bar inventory system",
    "best bar inventory system",
    "open source bar inventory",
  ],
});

const comparisons = [
  {
    label: "Spreadsheets",
    cost: "Free (your labor)",
    setup: "Manual formulas, no bottle map",
    variance: "End-of-month guesswork",
    lockIn: "File chaos, version drift",
  },
  {
    label: "Paid bar SaaS",
    cost: "$50–$300+/mo per location",
    setup: "Vendor onboarding, seat limits",
    variance: "Often strong, behind a paywall",
    lockIn: "Subscription + export friction",
  },
  {
    label: "Open Source Barware",
    cost: "Free — GPLv3, no seats",
    setup: "Walk your bar, voice or keyboard",
    variance: "Bottle, category, or shift level",
    lockIn: "Your data stays yours",
  },
];

const features = [
  {
    title: "Location-mapped inventory",
    body: "Wells, back bar, liquor room, and storage bins — counted where bottles actually live, not dumped into one sheet tab.",
  },
  {
    title: "Pour cost and variance",
    body: "See where liquor cost leaked before month-end close. Category and bottle-level views for managers who run tight numbers.",
  },
  {
    title: "Voice walk-through setup",
    body: "Dictate stations while you walk the room on the first night. Built for a real shift, not a conference demo.",
  },
  {
    title: "Invoice and POS inputs",
    body: "Upload delivery invoices and tie receiving to counts. Reconcile what came in against what should be on the shelf.",
  },
  {
    title: "500+ product starter database",
    body: "Common brands, bottle sizes, and pours pre-loaded so you are not building a SKU list from scratch at midnight.",
  },
  {
    title: "Open source forever",
    body: "Source code published. No black-box cloud lock-in. Fork it, audit it, run it on your own machines.",
  },
];

const faqs = [
  {
    q: "Is Open Source Barware really free bar inventory software?",
    a: "Yes. The program is free to download and use under GPLv3. There is no subscription, no per-seat fee, and no trial that expires.",
  },
  {
    q: "How does free bar inventory software compare to paid systems?",
    a: "Paid systems often charge monthly per location and gate exports or advanced variance behind tiers. Open Source Barware ships the full count, map, variance, and reconciliation workflow without a paywall — because it was built for working bars, not recurring billing.",
  },
  {
    q: "Do I need to sign up or create an account?",
    a: "No account is required to download. Optional email signup on the download page is only for release updates and Hidden Bar Tour invites — both are opt-in.",
  },
  {
    q: "Who built this?",
    a: "Bartenders and operators. Open Source Barware is a Richard B. Jamison project under Intelligent Hospitality Systems.",
  },
  {
    q: "Does it work for liquor and wine only?",
    a: "It tracks the full bar — liquor, wine, beer, modifiers, and in-house prep. See our liquor and wine inventory pages for category-specific workflows.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Open Source Barware",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Windows, macOS, Chrome",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  url: `${SITE_URL}/download`,
  description:
    "Free open-source bar inventory software for restaurants and bars. Bottle-level tracking, pour cost, and variance.",
};

export default function FreeBarInventorySoftwarePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      <section className="relative min-h-[40vh] flex items-center overflow-hidden grain">
        <OptimizedPicture
          webpSrc="/images/bartop.webp"
          fallbackSrc="/images/bartop.png"
          alt="Bartop with bottles ready for free bar inventory count"
          className="absolute inset-0 h-full w-full object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/92 via-bg/75 to-bg/45" />
        <div className="absolute right-[-40px] top-[-20px] text-copper">
          <Gear size={160} className="gear-spin opacity-15" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-copper/40" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
              Free Bar Inventory Software
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.08] max-w-3xl mb-6">
            <span className="copper-text">The free bar inventory program</span>{" "}
            that beats what most places pay for.
          </h1>
          <p className="text-text-muted text-lg max-w-2xl leading-relaxed mb-8">
            Open Source Barware is bar inventory software you download once and
            run on your own machines — bottle maps, pour cost, variance, and
            weekly counts without a monthly invoice.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/download"
              className="inline-block bg-copper hover:bg-copper-bright text-bg font-semibold px-8 py-3.5 text-sm tracking-wide transition-all hover:shadow-[0_0_30px_rgba(168,120,79,0.25)]"
            >
              Download Free
            </Link>
            <Link
              href="/bar-inventory-software-comparison"
              className="inline-block border border-copper/40 text-copper hover:bg-copper/10 px-8 py-3.5 text-sm tracking-wide transition-colors"
            >
              Compare vs paid apps
            </Link>
            <Link
              href="/the-process"
              className="inline-block border border-copper/40 text-copper hover:bg-copper/10 px-8 py-3.5 text-sm tracking-wide transition-colors"
            >
              See The Process
            </Link>
          </div>
        </div>
      </section>

      <GearDivider />

      <section className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="glow-dot" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-patina-light">
            Compare Your Options
          </span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-10 max-w-2xl">
          <span className="copper-text">Spreadsheets, SaaS, or open source.</span>{" "}
          Pick the workflow that respects your margin.
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-gear-border text-left">
                <th className="py-4 pr-4 text-text-light font-normal tracking-wide uppercase text-[10px]">
                  Approach
                </th>
                <th className="py-4 px-4 text-text-light font-normal tracking-wide uppercase text-[10px]">
                  Cost
                </th>
                <th className="py-4 px-4 text-text-light font-normal tracking-wide uppercase text-[10px]">
                  Setup
                </th>
                <th className="py-4 px-4 text-text-light font-normal tracking-wide uppercase text-[10px]">
                  Variance
                </th>
                <th className="py-4 pl-4 text-text-light font-normal tracking-wide uppercase text-[10px]">
                  Data ownership
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row) => (
                <tr
                  key={row.label}
                  className={`border-b border-gear-border/60 ${
                    row.label === "Open Source Barware" ? "bg-copper/5" : ""
                  }`}
                >
                  <td className="py-5 pr-4 font-serif text-lg text-cream">
                    {row.label}
                  </td>
                  <td className="py-5 px-4 text-text-muted">{row.cost}</td>
                  <td className="py-5 px-4 text-text-muted">{row.setup}</td>
                  <td className="py-5 px-4 text-text-muted">{row.variance}</td>
                  <td className="py-5 pl-4 text-text-muted">{row.lockIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 md:py-14 border-t border-gear-border/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="glow-dot" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-patina-light">
            What You Get
          </span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-10">
          Built for a working bar, not a slide deck.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => (
            <div key={item.title} className="panel rounded-sm p-6 relative rivets">
              <h3 className="font-serif text-xl text-cream mb-3">{item.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HubLink
            href="/liquor-inventory"
            title="Free Liquor Inventory"
            body="Highest shrinkage category — bottle-level tracking and cost."
          />
          <HubLink
            href="/wine-inventory"
            title="Free Wine Inventory"
            body="Bins, vintages, and bottle-level wine program counts."
          />
          <HubLink
            href="/manifesto"
            title="The Manifesto"
            body="Why the program is free and stays free for the trade."
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 md:py-14 border-t border-gear-border/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="glow-dot" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-patina-light">
            FAQ
          </span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-8">
          Questions operators ask before they download.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((item) => (
            <div key={item.q} className="panel rounded-sm p-6">
              <h3 className="font-serif text-lg text-cream mb-2">{item.q}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-warm to-bg" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 md:py-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
            <span className="copper-text">Download the program.</span> Count
            tonight.
          </h2>
          <p className="text-text-muted text-lg mb-10 max-w-md mx-auto">
            Free bar inventory software — Mac, Windows, or Chrome. No signup
            required.
          </p>
          <Link
            href="/download"
            className="inline-block bg-copper hover:bg-copper-bright text-bg font-semibold px-10 py-4 text-sm tracking-wide transition-all hover:shadow-[0_0_30px_rgba(168,120,79,0.25)]"
          >
            Download Program
          </Link>
        </div>
      </section>

      {/* Image structured data for SEO - at bottom, backend only */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "contentUrl": "https://opensourcebarware.com/images/bartop.webp",
            "name": "Bartop with bottles ready for free bar inventory count",
            "description": "Dark wood bartop with bottles ready for free bar inventory system count. Part of the best free inventory system for bars.",
            "width": "1200",
            "height": "630"
          })
        }}
      />
    </>
  );
}

function HubLink({
  href,
  title,
  body,
}: {
  href: string;
  title: string;
  body: string;
}) {
  return (
    <Link href={href} className="group block panel card-lift rounded-sm p-6 relative rivets">
      <h3 className="font-serif text-xl text-cream mb-3 group-hover:text-copper transition-colors">
        {title}
      </h3>
      <p className="text-text-muted text-sm leading-relaxed">{body}</p>
    </Link>
  );
}