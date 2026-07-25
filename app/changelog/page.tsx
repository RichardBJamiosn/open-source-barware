import Link from "next/link";
import { Gear, GearDivider } from "@/components/SteampunkElements";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Release Notes v1.5 — Open Source Barware Changelog",
  description:
    "Open Source Barware v1.5 release notes: Spanish-ready inventory notes, mobile counting, POS import, multi-venue, smart orders. Free open source bar inventory program.",
  path: "/changelog",
});

const features = [
  {
    title: "Language / inventory notes",
    items: [
      "Spanish + English inventory notes — walks and counts understand station and level words in both languages",
      "Mixed EN/ES notes work today; full Spanish program UI is next",
    ],
  },
  {
    title: "Team & communications",
    items: [
      "Employee communications board — managers upload or paste walks and inventory notes (local-only)",
      "Team PIN logins — optional; open until you create the first admin PIN",
    ],
  },
  {
    title: "Counting & floor work",
    items: [
      "Mobile count view — large taps, presets, optional weigh mode",
      "Camera barcode scan",
      "Bottle-weight table for optional digital scale weighing",
      "Visual par alerts (green / yellow / red)",
    ],
  },
  {
    title: "Ops toolkit",
    items: [
      "Smart orders → purchase orders (copy, email, CSV, receive workflow)",
      "POS import with review step (Toast, Square, CSV, etc.)",
      "Recipe builder + menu costing",
      "Shift / cycle reports — plain-English weekly story + export",
      "Multi-venue + stock transfers",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden border-b border-gear-border">
        <div className="absolute right-[-40px] top-[-20px] text-copper pointer-events-none">
          <Gear size={160} className="gear-spin opacity-15" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-24">
          <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-4">
            Changelog
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-cream mb-4">
            <span className="copper-text">v1.5</span> public release
          </h1>
          <p className="text-text-muted text-lg leading-relaxed max-w-2xl mb-6">
            Released July 10, 2026 · Version{" "}
            <code className="text-copper text-sm">1.5.0</code> · GPL-3.0-or-later
            · Free forever. Local-first Chrome program on Mac and Windows — no
            subscription, no cloud account required.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/download"
              className="inline-block bg-copper hover:bg-copper-bright text-bg font-semibold px-8 py-3.5 text-sm tracking-wide transition-all"
            >
              Download Program
            </Link>
            <Link
              href="/inventory/dashboard"
              prefetch={false}
              className="inline-block border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-8 py-3.5 text-sm tracking-wide transition-all"
            >
              Live Demo
            </Link>
            <Link
              href="/the-process"
              className="inline-block border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-8 py-3.5 text-sm tracking-wide transition-all"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      <GearDivider />

      <section className="max-w-3xl mx-auto px-6 py-14 md:py-20 space-y-12">
        <div>
          <h2 className="font-serif text-2xl text-cream mb-4">Summary</h2>
          <p className="text-text-muted leading-relaxed">
            The July 4 free launch is now the full{" "}
            <strong className="text-cream">v1.5</strong> public drop. Same
            local-first program — installers on the Download page are v1.5.
            Built for the average bartender to start simple; industrial strength
            when needed.
          </p>
        </div>

        {features.map((block) => (
          <div key={block.title}>
            <h2 className="font-serif text-2xl text-cream mb-4">{block.title}</h2>
            <ul className="space-y-3 text-text-muted leading-relaxed">
              {block.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-copper shrink-0">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="font-serif text-2xl text-cream mb-4">Install</h2>
          <ol className="space-y-3 text-text-muted leading-relaxed list-decimal list-inside">
            <li>
              Download Mac or Windows zip from{" "}
              <Link href="/download" className="text-copper hover:text-copper-bright">
                /download
              </Link>
            </li>
            <li>
              Unzip → run <code className="text-copper">Install.command</code>{" "}
              (Mac) or <code className="text-copper">Install.bat</code> (Windows)
            </li>
            <li>
              Bookmark{" "}
              <code className="text-copper">http://localhost:5052/</code> — that
              bookmark is the software
            </li>
          </ol>
        </div>

        <div className="panel rounded-sm p-8 border border-copper/20">
          <p className="text-[11px] tracking-[0.25em] uppercase text-text-light mb-3">
            What&rsquo;s next
          </p>
          <ul className="space-y-2 text-text-muted text-sm leading-relaxed">
            <li>Full Spanish program UI</li>
            <li>Intelligent Hospitality Systems restaurant package</li>
            <li>PWA / installable mobile shell</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
