import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Gear, GearDivider } from "@/components/SteampunkElements";

export const metadata: Metadata = {
  title: "Free Bartender Resources & Community — Open Source Barware",
  description:
    "Free bartender resources, bartender community links, free cocktail recipes, and bar industry tools. Organizations, education, mental health support, and open source tools for bar professionals.",
};

export default function ResourcesPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[35vh] flex items-center overflow-hidden grain">
        <Image
          src="/images/shelf.png"
          alt="Backbar shelf lined with bottles"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/70 to-bg/40" />
        <div className="absolute right-[-40px] top-[-20px] text-copper">
          <Gear size={160} className="gear-spin opacity-12" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-copper/40" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
              The Community
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.08] max-w-xl mb-6">
            <span className="copper-text">People first.</span>
            <br />
            Tools second.
          </h1>
          <p className="text-text-muted text-lg max-w-lg leading-relaxed">
            The organizations, educators, and support networks that make this
            industry worth fighting for. All free. All worth your time.
          </p>
        </div>
      </section>

      <GearDivider />

      {/* ── INDUSTRY ORGANIZATIONS ── */}
      <section className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="glow-dot" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-patina-light">
            Industry Organizations
          </span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4">
          <span className="copper-text">Your guild. Your people.</span>
        </h2>
        <p className="text-text-muted mb-12 max-w-lg">
          National and local organizations advocating for bartenders, providing
          education, and building the professional network you deserve.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResourceCard
            title="United States Bartenders' Guild"
            url="https://www.usbg.org"
            description="National bartender guild offering education, networking, competitions, and professional development for bar professionals across the country."
          />
          <ResourceCard
            title="USBG Cleveland Chapter"
            url="https://www.usbg.org"
            description="The local chapter where Open Source Barware was born. Cleveland bartenders building community, one shift at a time."
            highlight
          />
          <ResourceCard
            title="Tales of the Cocktail Foundation"
            url="https://talesofthecocktail.org"
            description="Education, grants, and industry events based in New Orleans. The premier gathering for spirits professionals worldwide."
          />
          <ResourceCard
            title="Restaurant Workers' Community Foundation"
            url="https://www.restaurantworkerscf.org"
            description="Advocacy and crisis relief for restaurant and bar workers. Policy change, emergency funds, and a voice for the workforce."
          />
        </div>
      </section>

      <GearDivider />

      {/* ── FREE EDUCATION & RECIPES ── */}
      <section className="relative bg-bg-panel border-y border-gear-border overflow-hidden grain">
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-copper">
          <Gear size={180} className="gear-spin-slow opacity-12" />
        </div>
        <div className="absolute right-[-40px] bottom-[-40px] text-copper">
          <Gear size={120} className="gear-spin-reverse opacity-10" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="glow-dot" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-patina-light">
              Free Education &amp; Recipes
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4">
            <span className="copper-text">Learn without paying.</span>
          </h2>
          <p className="text-text-muted mb-12 max-w-lg">
            World-class cocktail education and recipe databases that
            don&rsquo;t cost a dime. Level up on your own time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResourceCard
              title="BarSmarts"
              url="https://www.barsmarts.com"
              description="Free online bartender education program by Pernod Ricard. Spirits knowledge, technique, and professional standards at no cost."
            />
            <ResourceCard
              title="Difford's Guide"
              url="https://www.diffordsguide.com"
              description="Massive free cocktail recipe database with thousands of recipes, ingredient guides, and technique breakdowns."
            />
            <ResourceCard
              title="Punch Magazine"
              url="https://punchdrink.com"
              description="Free drinks journalism and cocktail education. Deep dives into spirits, bar culture, and the people behind the stick."
            />
            <ResourceCard
              title="Liquor.com"
              url="https://www.liquor.com"
              description="Recipes, techniques, and bar guides. Straightforward cocktail education and inspiration for every skill level."
            />
          </div>
        </div>
      </section>

      {/* ── INDUSTRY SUPPORT & MENTAL HEALTH ── */}
      <section className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="glow-dot" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-patina-light">
            Industry Support &amp; Mental Health
          </span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4">
          <span className="copper-text">You&rsquo;re not alone.</span>
        </h2>
        <p className="text-text-muted mb-12 max-w-lg">
          This industry is hard. These organizations exist because people in it
          decided to take care of each other. Use them.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ResourceCard
            title="Another Round Another Rally"
            url="https://www.ararally.org"
            description="Mental health and financial support for bar workers. Counseling, emergency funds, and community when you need it most."
          />
          <ResourceCard
            title="Southern Smoke Foundation"
            url="https://southernsmoke.org"
            description="Crisis grants for food and beverage workers. When the industry lets you down, Southern Smoke steps up."
          />
          <ResourceCard
            title="Ben's Friends"
            url="https://www.bensfriendshope.com"
            description="Support group for food and beverage workers dealing with substance abuse and addiction. Judgment-free, industry-specific help."
          />
        </div>
      </section>

      <GearDivider />

      {/* ── OPEN SOURCE & FREE TOOLS ── */}
      <section className="relative overflow-hidden">
        <div className="absolute right-[5%] bottom-0 text-copper">
          <Gear size={80} className="gear-spin-slow opacity-10" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 md:py-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-copper/40" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
              Open Source &amp; Free Tools
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-copper/40" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
            <span className="copper-text">Free tools.</span>
            <br />
            Built by bartenders.
          </h2>
          <p className="text-text-muted text-lg mb-4 max-w-md mx-auto">
            Inventory sheets, variance calculators, bottle counters &mdash; all
            free, no signup required. Built and tested at Agave &amp; Rye.
          </p>
          <p className="text-text-muted text-sm mb-10 max-w-md mx-auto">
            Know a free tool bartenders should have? Let us know.
          </p>
          <Link
            href="/downloads"
            className="inline-block border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-8 py-4 text-sm tracking-wide transition-all"
          >
            Browse Free Downloads
          </Link>
        </div>
      </section>
    </>
  );
}

function ResourceCard({
  title,
  url,
  description,
  highlight = false,
}: {
  title: string;
  url: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="panel card-lift rounded-sm p-7 flex flex-col relative rivets group"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-serif text-lg text-cream group-hover:text-copper transition-colors">
          {title}
        </h3>
        {highlight && (
          <span className="text-[9px] tracking-[0.15em] uppercase text-patina-light border border-patina/30 px-2 py-0.5 shrink-0 ml-3">
            Our Roots
          </span>
        )}
      </div>
      <p className="text-text-muted text-sm leading-relaxed mb-5 flex-1">
        {description}
      </p>
      <div className="flex items-center gap-2 text-copper text-xs tracking-wide opacity-60 group-hover:opacity-100 transition-opacity">
        <span>{url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M3.5 2H10V8.5M10 2L2 10"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </a>
  );
}
