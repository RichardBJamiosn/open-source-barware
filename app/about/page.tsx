import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Gear, GearDivider, CocktailIcon } from "@/components/SteampunkElements";

export const metadata: Metadata = {
  title: "About — Open Source Barware",
  description:
    "The people behind Open Source Barware. Built by Richard Jamison and Bill at Agave & Rye, downtown Cleveland.",
};

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute right-[-60px] top-[-20px] text-copper">
          <Gear size={200} className="gear-spin opacity-15" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-12 md:pt-28 md:pb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-copper/40" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
              About
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.08] max-w-2xl">
            <span className="copper-text">Two bartenders</span> who
            <br />
            got tired of counting
            <br />
            the same bottles every week.
          </h1>
        </div>
      </section>

      <GearDivider />

      {/* ── THE STORY ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-copper/40" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
                How It Started
              </span>
            </div>
            <div className="relative mt-6 rounded-sm overflow-hidden panel">
              <div className="aspect-[3/4] relative">
                <Image
                  src="/images/copper-glass.png"
                  alt="Copper bar tools and glassware on a slate surface"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-bg/20" />
              </div>
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <div className="space-y-5 text-text-muted leading-relaxed text-lg">
              <p>
                If you&rsquo;ve worked behind a bar, you know. The shift ends,
                the guests leave, and instead of going home you&rsquo;re on your
                knees behind the well, holding a bottle of Tito&rsquo;s up to
                the light trying to decide if that&rsquo;s three-tenths or
                four.
              </p>
              <p>
                You scribble numbers on a count sheet. You walk to the back
                office and type them into a spreadsheet that hasn&rsquo;t been
                updated since someone else was bar manager. You try to match it
                all against the POS report. The numbers never line up.
              </p>
              <p>
                Over the years, companies saw the pain and monetized it.
                Inventory guns for $3,000. Monthly software at $200 a location.
                Consultants who charge by the hour to do what you already know
                how to do &mdash; just with a shinier clipboard.
              </p>
            </div>

            <div className="mt-10 panel rounded-sm p-8">
              <p className="font-serif text-xl text-cream leading-relaxed">
                Then AI showed up. And suddenly, building genuinely good
                inventory tools costs{" "}
                <span className="copper-text font-bold">nothing</span>. So we
                built them. And we&rsquo;re giving them away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PEOPLE ── dark section */}
      <section className="relative bg-bg-panel border-y border-gear-border overflow-hidden grain">
        <div className="absolute -right-10 bottom-[-40px] text-copper">
          <Gear size={160} className="gear-spin-slow opacity-15" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex items-center gap-3 mb-4">
            <div className="glow-dot" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-patina-light">
              The Crew
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-16">
            <span className="copper-text">Who&rsquo;s behind the bar.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Richard */}
            <div className="panel card-lift rounded-sm overflow-hidden">
              <div className="img-placeholder aspect-[16/10] bg-gradient-to-br from-bg-card to-bg-warm">
                <span className="text-xs tracking-widest text-text-light/30">
                  PHOTO
                </span>
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl copper-text mb-1">
                  Richard Jamison
                </h3>
                <p className="text-[11px] tracking-[0.2em] uppercase text-patina-light mb-5">
                  Creator &amp; Developer
                </p>
                <p className="text-text-muted leading-relaxed">
                  Bar industry veteran turned entrepreneur and developer.
                  Richard has done more inventory counts than he cares to
                  admit &mdash; which is exactly why he built the machinery to
                  make it painless. He brings the bartender&rsquo;s eye and the
                  engineer&rsquo;s precision.
                </p>
              </div>
            </div>

            {/* Bill */}
            <div className="panel card-lift rounded-sm overflow-hidden">
              <div className="img-placeholder aspect-[16/10] bg-gradient-to-br from-bg-card to-bg-warm">
                <span className="text-xs tracking-widest text-text-light/30">
                  PHOTO
                </span>
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl copper-text mb-1">
                  Bill
                </h3>
                <p className="text-[11px] tracking-[0.2em] uppercase text-patina-light mb-5">
                  General Manager, Agave &amp; Rye &mdash; Cleveland
                </p>
                <p className="text-text-muted leading-relaxed">
                  Bill didn&rsquo;t just wish us luck. He opened his
                  restaurant, gave us his bar, his team, and three weeks of
                  real inventory sessions. That kind of partnership is the
                  difference between tools that demo well and tools that
                  actually work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FIELD TESTED ── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto flex items-start gap-6">
          <div className="h-12 w-[2px] bg-copper/40 shrink-0 mt-1" />
          <p className="text-text-muted leading-relaxed">
            Every tool was field-tested at <span className="text-cream font-medium">Agave &amp; Rye</span> in
            downtown Cleveland &mdash; three weeks of real counts, real data, and real
            feedback from bartenders who just want to go home on time. If you&rsquo;re
            ever in the neighborhood, go support them. Good people running a great spot.
          </p>
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-copper/40" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
              Beyond the Tools
            </span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl leading-tight mb-6">
            <span className="copper-text">Built for the community.</span>
          </h2>
          <div className="space-y-5 text-text-muted leading-relaxed">
            <p>
              Open Source Barware isn&rsquo;t just free spreadsheets. We connect bartenders
              with the organizations that support the craft &mdash; from the United States
              Bartenders&rsquo; Guild to education programs and mental health resources
              built specifically for hospitality workers.
            </p>
            <p>
              The bar industry takes care of everyone else. We think it&rsquo;s time
              someone built tools that take care of the bar industry.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/resources"
              className="inline-block border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-8 py-3 text-sm tracking-wide transition-all"
            >
              Explore Community Resources
            </Link>
          </div>
        </div>
      </section>

      <GearDivider />

      {/* ── MISSION ── */}
      <section className="relative overflow-hidden">
        <div className="absolute left-[-40px] bottom-[-40px] text-copper">
          <Gear size={140} className="gear-spin-slow opacity-10" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-copper/40" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
              The Mission
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-copper/40" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-8">
            <span className="copper-text">Free means free.</span>
          </h2>
          <div className="space-y-5 text-text-muted text-lg leading-relaxed max-w-xl mx-auto">
            <p>
              Every bar &mdash; from the dive on the corner to the craft
              cocktail lounge downtown &mdash; deserves proper inventory tools.
              Not everyone can afford $200/month software. We don&rsquo;t think
              they should have to.
            </p>
            <p>
              We build in the open. We test in real restaurants. We give the
              results to the industry. No premium tier. No paywall. No strings.
            </p>
          </div>
          <div className="mt-12">
            <Link
              href="/downloads"
              className="inline-block bg-copper hover:bg-copper-bright text-bg font-semibold px-10 py-4 text-sm tracking-wide transition-all hover:shadow-[0_0_30px_rgba(205,127,50,0.25)]"
            >
              Download the Free Tools
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
