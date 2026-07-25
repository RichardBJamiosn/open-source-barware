import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "When Inventory Meets the Front of House",
  description:
    "How counts, POS, and guest-facing systems stop fighting each other — operational notes from free open-source bar inventory work, without the sales pitch.",
  path: "/blog/when-inventory-meets-the-front-of-house",
  keywords: [
    "bar inventory and pos",
    "front of house operations",
    "free bar inventory system",
    "restaurant operations systems",
  ],
});

export default function WhenInventoryMeetsFOH() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link href="/blog" className="text-sm text-copper hover:text-copper-bright">
            ← Back to Blog
          </Link>
        </div>

        <header className="mb-12">
          <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-2">
            Operations · 2026-07-11
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight text-cream mb-4">
            When Inventory Meets the Front of House
          </h1>
          <p className="text-lg text-text-muted">
            Counts, POS exports, and guest-facing tools are usually treated as separate problems. In a real venue they share the same truth: what sold, what moved, and what the guest experienced.
          </p>
        </header>

        <div className="prose prose-invert max-w-none text-text-muted">
          <h2>Three systems, one week</h2>
          <p>
            On a normal week a bar might touch a website or booking path for guests, a POS for sales, and an inventory walk for the cooler and wells. When those three disagree, managers argue about which number is “real” instead of fixing the leak.
          </p>
          <p>
            Open Source Barware exists so the inventory side stays free and usable. It is not a website product and it is not a booking engine. It is a floor tool. The point of this note is narrower: once counts and POS imports are honest, the rest of the stack gets easier to reason about.
          </p>

          <h2>What “connected” actually means on a shift</h2>
          <ul>
            <li>
              <strong>Guest asks for a private event</strong> — someone has to capture the request, not lose it in a DM.
            </li>
            <li>
              <strong>POS rings a busy Friday</strong> — usage should eventually reconcile to the walk, not a gut feeling.
            </li>
            <li>
              <strong>86’d item</strong> — floor, POS, and ordering should not find out at three different times.
            </li>
          </ul>
          <p>
            You do not need enterprise software day one. You need clean handoffs: what got counted, what sold, what was promised to a guest.
          </p>

          <h2>Keep the free tool free</h2>
          <p>
            This program stays free and open source on purpose. No account wall, no trial timer, no “upgrade to unlock variance.” If something around the venue needs a custom website, AI phone intake, or deeper ops wiring, that is a different job — and it should stay labeled as such. Operators should never feel sold to for downloading a count tool.
          </p>
          <p>
            For anyone mapping how guest demand and floor systems share data, there are separate notes on hospitality web systems at{" "}
            <a
              href="https://resonantwebdesign.com/industries/restaurants-hospitality-web-design/"
              className="text-copper hover:text-copper-bright"
              rel="noopener noreferrer"
            >
              Resonant’s hospitality page
            </a>
            . Read it if you care about the web side; ignore it if you only came for inventory.
          </p>

          <h2>Practical next steps this week</h2>
          <ol>
            <li>Finish one full voice or typed walk so stations are real.</li>
            <li>Import one clean POS window and compare variance at bottle level.</li>
            <li>Write down where guest requests currently die (phone, DM, host stand).</li>
            <li>Fix the worst handoff first — not the prettiest dashboard.</li>
          </ol>

          <div className="panel p-6 my-8 not-prose">
            <p className="text-cream font-medium mb-2">Stay on the free path.</p>
            <Link
              href="/download"
              className="inline-block bg-copper hover:bg-copper-bright text-bg px-6 py-3 text-sm font-semibold tracking-wide"
            >
              Download the free program
            </Link>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: "When Inventory Meets the Front of House",
              author: {
                "@type": "Organization",
                name: "Open Source Barware",
              },
              datePublished: "2026-07-11",
              description:
                "How counts, POS, and guest-facing systems stop fighting each other — operational notes from free open-source bar inventory work.",
            }),
          }}
        />
      </article>
    </main>
  );
}
