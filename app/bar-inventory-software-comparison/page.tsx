import Link from "next/link";
import OptimizedPicture from "@/components/OptimizedPicture";
import { Gear, GearDivider } from "@/components/SteampunkElements";
import { pageMetadata, SITE_URL } from "@/lib/seo";

// Retitled to own alternative/comparison intent instead of repeating the
// "Free Bar Inventory Software" head phrase, which /free-bar-inventory-software owns.
export const metadata = pageMetadata({
  title: "Backbar vs Partender vs Open Source Barware — Compared (2026)",
  description:
    "Honest comparison of Backbar, Partender, Bar Patrol, Provi and Open Source Barware on cost, free tiers, data ownership and lock-in. Backbar and Provi have free tiers too—here's the real difference.",
  path: "/bar-inventory-software-comparison",
  keywords: [
    "Backbar alternative",
    "Partender alternative",
    "Bar Patrol alternative",
    "Provi inventory alternative",
    "bar inventory software comparison",
    "open source alternative to bar inventory saas",
  ],
});

const rows = [
  {
    name: "Open Source Barware",
    cost: "Free (GPLv3)",
    data: "Local files you control",
    pos: "Manual / file inputs",
    variance: "Bottle, category, shift",
    multi: "Supported in program",
    offline: "Yes — runs on your machines",
    lockIn: "None — open source",
    highlight: true,
  },
  // Competitor cost/tier facts verified against first-party pricing pages 2026-07-25.
  // Backbar and Provi both offer genuine free tiers — do not describe either as paid-only.
  {
    name: "Backbar",
    cost: "Freemium — free 1-location tier; $79–99/mo",
    data: "Vendor cloud",
    pos: "Cloud integrations (plan-dependent)",
    variance: "Strong product focus",
    multi: "Cloud multi-location",
    offline: "Cloud-first",
    lockIn: "Account + vendor cloud required",
    highlight: false,
  },
  {
    name: "Partender",
    cost: "Paid SaaS — from $199/mo",
    data: "Vendor cloud",
    pos: "Cloud ecosystem",
    variance: "Fast tap-the-bottle counting",
    multi: "Cloud multi-location",
    offline: "App + cloud",
    lockIn: "Subscription seats, annual term",
    highlight: false,
  },
  {
    name: "Bar Patrol",
    cost: "Paid SaaS — $49–69/mo",
    data: "Vendor cloud",
    pos: "Vendor workflows",
    variance: "Scale-based counting",
    multi: "Plan-dependent",
    offline: "Cloud-first",
    lockIn: "Subscription",
    highlight: false,
  },
  {
    name: "Provi",
    cost: "Free for buyers — account + license",
    data: "Vendor ecosystem",
    pos: "Strong ordering / vendor path",
    variance: "Not the same job as local counts",
    multi: "Vendor network",
    offline: "Cloud",
    lockIn: "US-only; needs your distributors onboarded",
    highlight: false,
  },
];

const faqs = [
  {
    q: "Is Open Source Barware really free forever?",
    a: "Yes. GPLv3. No subscription required to run the core program.",
  },
  {
    q: "Why not just use Backbar or Partender?",
    a: "Sometimes you should. Backbar has a free tier for a single location and Provi is free for buyers, so \"free\" alone is not the difference. Cloud apps win on hosted multi-user sync and vendor workflows. Open Source Barware wins when you want the software and the files in your own hands — GPLv3 source, runs locally, no account, no cloud required, nothing to cancel. Different jobs.",
  },
  {
    q: "Is Open Source Barware just the cheapest option?",
    a: "No — several competitors have free plans. The difference is custody. Their free tiers still require an account and their cloud; ours requires neither. You keep the program and your inventory files whether or not we exist.",
  },
  {
    q: "Do I need an account?",
    a: "No account required to download and run. Optional email is for release notes only.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Open Source Barware",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Windows, macOS, Chrome",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: `${SITE_URL}/download`,
  description:
    "Free open-source bar inventory software. Compare cost, data ownership, variance, and lock-in to paid bar inventory apps.",
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Free Bar Inventory Software vs Paid Apps",
  url: `${SITE_URL}/bar-inventory-software-comparison`,
  description:
    "Honest comparison of Open Source Barware vs Backbar, Partender, Bar Patrol, and Provi.",
};

export default function ComparisonPage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <section className="relative min-h-[40vh] flex items-center overflow-hidden grain">
        <OptimizedPicture
          webpSrc="/images/bartop.webp"
          fallbackSrc="/images/bartop.png"
          alt="Bar inventory software comparison — free open source vs paid apps"
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
              Honest comparison
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.08] max-w-4xl mb-6">
            <span className="copper-text">Free open-source bar inventory vs paid apps</span>
            —pick the constraint you care about
          </h1>
          <p className="text-text-muted text-lg max-w-2xl leading-relaxed mb-8">
            This is not a hit piece. Cloud bar inventory products are good at cloud
            jobs. Open Source Barware is free, local, and open source—for operators
            who want counts and variance without a seat tax.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/download"
              className="inline-block bg-copper hover:bg-copper-bright text-bg font-semibold px-8 py-3.5 text-sm tracking-wide transition-all hover:shadow-[0_0_30px_rgba(168,120,79,0.25)]"
            >
              Download Free
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
            Side-by-side
          </span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-8 max-w-3xl">
          Cost, ownership, POS, variance, multi-venue, offline, lock-in.
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-gear-border text-left">
                {[
                  "Product",
                  "Cost",
                  "Data ownership",
                  "POS",
                  "Variance",
                  "Multi-venue",
                  "Offline / local",
                  "Lock-in",
                ].map((h) => (
                  <th
                    key={h}
                    className="py-4 pr-4 text-text-light font-normal tracking-wide uppercase text-[10px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.name}
                  className={`border-b border-gear-border/60 ${
                    row.highlight ? "bg-copper/5" : ""
                  }`}
                >
                  <td className="py-4 pr-4 font-medium text-text">
                    {row.name}
                  </td>
                  <td className="py-4 pr-4 text-text-muted">{row.cost}</td>
                  <td className="py-4 pr-4 text-text-muted">{row.data}</td>
                  <td className="py-4 pr-4 text-text-muted">{row.pos}</td>
                  <td className="py-4 pr-4 text-text-muted">{row.variance}</td>
                  <td className="py-4 pr-4 text-text-muted">{row.multi}</td>
                  <td className="py-4 pr-4 text-text-muted">{row.offline}</td>
                  <td className="py-4 pr-4 text-text-muted">{row.lockIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-text-muted text-sm mt-6 max-w-3xl">
          Feature claims for third-party products change by plan and market. Treat
          the table as decision framing, not a vendor brochure. Verify current
          pricing and capabilities on each vendor&apos;s site before you buy.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
          When paid SaaS is the better pick
        </h2>
        <ul className="space-y-3 text-text-muted max-w-3xl">
          <li>
            You need multi-location cloud sync and vendor-managed onboarding more
            than you need local control.
          </li>
          <li>
            Your group already standardized on a cloud inventory stack and the
            cost is not the pain—integration is.
          </li>
          <li>
            You want purchasing/ordering network features that live inside a
            specific vendor ecosystem (e.g. ordering platforms).
          </li>
        </ul>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6 mt-12">
          When Open Source Barware wins
        </h2>
        <ul className="space-y-3 text-text-muted max-w-3xl">
          <li>You refuse another $50–$300/mo seat tax for basic counts.</li>
          <li>You want bottle-level variance on machines you control.</li>
          <li>You want open source you can audit—not a black box export later.</li>
          <li>
            Parent systems thinking lives at{" "}
            <a
              href="https://intelligenthospitalitysystems.com/"
              className="text-copper hover:text-copper-bright"
              rel="noopener"
            >
              Intelligent Hospitality Systems
            </a>
            ; the free product is here.
          </li>
        </ul>
      </section>

      <GearDivider />

      <section className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <h2 className="font-serif text-3xl mb-8">FAQ</h2>
        <div className="space-y-6 max-w-3xl">
          {faqs.map((item) => (
            <div key={item.q} className="border-b border-gear-border pb-6">
              <h3 className="text-lg text-text mb-2">{item.q}</h3>
              <p className="text-text-muted leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/download"
            className="inline-block bg-copper hover:bg-copper-bright text-bg font-semibold px-8 py-3.5 text-sm tracking-wide"
          >
            Download Free
          </Link>
          <Link
            href="/free-bar-inventory-software"
            className="inline-block border border-copper/40 text-copper hover:bg-copper/10 px-8 py-3.5 text-sm tracking-wide"
          >
            Free software overview
          </Link>
          <Link
            href="/blog/best-free-bar-inventory-system"
            className="inline-block border border-copper/40 text-copper hover:bg-copper/10 px-8 py-3.5 text-sm tracking-wide"
          >
            Best free bar inventory guide
          </Link>
        </div>
      </section>
    </>
  );
}
