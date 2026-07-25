import Link from "next/link";
import { Gear, GearDivider, PipeLine, PipeNode } from "@/components/SteampunkElements";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How Free Bar Inventory Works (Voice Walk → Count) | Open Source Barware",
  description:
    "How free bar inventory software works: voice walk, tenths, variance, POS, smart orders — local-first, no subscription. Full Open Source Barware process.",
  path: "/the-process",
});

const productBlocks = [
  {
    label: "One Program",
    title: "One Chrome-side program",
    body: "You open one place in Chrome. It starts simple for the average bartender (walk or talk your inventory in, easy and fast — English, Spanish, or mixed), then grows into the most complete, industrial-strength inventory system available — with scales and pinpoint measurements built in.",
  },
  {
    label: "The Changeover",
    title: "Caterpillar to butterfly",
    body: "At first it feels like a guided checklist for anyone — easy and fast for the average bartender. After the bar is mapped, the same page opens up into full power — mobile count, barcode, POS, recipes, multi-venue, employee communications, and scales for pinpoint measurements.",
  },
  {
    label: "The Spine",
    title: "Your voice in, a built spreadsheet out",
    body: "You talk (or walk) through the bar the way you already walk it. A parser built right into the program — no internet, no AI, no account — reads your words, lays out the map, and does the math. Station and level words work in English and Spanish (barra, pozo, fila, medio, lleno…). Full Spanish UI is next; inventory notes are ready today.",
  },
];

const homeBaseFeatures = [
  {
    title: "Home Base",
    body: "The calm landing page: last inventory, current cycle, what changed, what needs attention, and where to go next. Full industrial power under the hood.",
  },
  {
    title: "Spreadsheet View",
    body: "The full workbook stays readable: products, locations, par levels, counts, deliveries, costs, and reconciliation math. All advanced tools included.",
  },
  {
    title: "In-House Inventory",
    body: "A running view of what should still be in the building after sales, deliveries, and the latest approved count.",
  },
  {
    title: "Employee Communications",
    body: "Managers upload or paste walks and inventory notes for the house — a local staff board that works with optional PIN logins. No cloud, no third-party chat tax.",
  },
  {
    title: "Weekly Inputs",
    body: "Counts, invoice pictures, POS downloads, and manager notes enter through one weekly packet. Mobile count, barcode scan, receiving, and Spanish/English inventory notes built in.",
  },
  {
    title: "Cycle Reports",
    body: "Each cycle explains the story: betterments, losses, usage movement, spending movement, and anything worth a manager look. Smart orders and costing included.",
  },
];

const setupGates = [
  "Everything runs on your laptop — no account, no cloud, nothing to wait on",
  "Name every bar, well, row, back bar, cooler shelf, and wine space — English or Spanish station words both work",
  "Ask about unclear brands, bottle sizes, duplicate items, and missing spaces",
  "Review the first map before the first real inventory count begins",
  "Match the weekly count, purchases, and POS report to the same date window",
  "Add AI later — and only if you want invoice photos read for you",
  "Layer in mobile counting, barcode, par alerts, costing, smart orders, multi-venue, employee communications, and receiving as you grow",
];

type ProcessStep = {
  number: string;
  title: string;
  body: string;
  note: string;
  cards?: Array<{ name: string; path: string }>;
  example?: {
    label: string;
    lines: string[];
  };
};

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Install It and Bookmark It",
    body: "Download the package and double-click the installer. It installs itself into Chrome and opens one Chrome window. Bookmark that window to your bookmark bar — that bookmark is the software. Everything you build lives inside that one page, so you always come back to the same place.",
    note: "One install, one bookmark. That bookmarked page is your whole system from here on out — nothing else to open, nothing else to learn.",
  },
  {
    number: "02",
    title: "Meet the Guided Walkthrough",
    body: "The first time it opens, you land on the guided walkthrough — the caterpillar. It runs entirely on your laptop: no account to make, no cloud to reach, no AI to connect. It just walks you through loading your whole system one calm step at a time, and all you do is follow along. Starts simple for the average bartender.",
    note: "This is the caterpillar stage: patient, offline, and focused only on getting your bar understood. Later it emerges into the butterfly — your everyday industrial-strength home base with all the bells and whistles built in.",
  },
  {
    number: "03",
    title: "Name Your Bars",
    body: "First, build the bar in your head by how many physical bars stand in your building. Two bars in the room means two bars in the system. For the first build you name them plainly — Bar 1, Bar 2 — and you can rename them to their real names later. This is just the frame you pour everything else into.",
    note: "Count the bars in the building, name them Bar 1 / Bar 2 for now. Real names come after the first map is built.",
  },
  {
    number: "04",
    title: "Walk Each Bar and Say It Out Loud",
    body: "Now stand behind the bar and vocalize it the way you already walk it. Go bar by bar, well by well, row by row — say the location, then name the bottles in it. Move top-to-bottom, left-to-right, the same route every time so the map matches the real room. Speak English, Spanish, or mix them — v1.5 inventory notes understand both (barra / bar, pozo / well, fila / row, medio, lleno, vacío…).",
    note: "This first voice note is the seed. Everything the program builds for you grows out of this one walk, so speak it in order. Full Spanish menus come later; the walk language works today.",
    example: {
      label: "How to say the walk (Bar 1) — English or Spanish:",
      lines: [
        "Bar one. Well one, row one: Titos 750, Ketel One liter, Tanqueray 750",
        "Barra uno. Pozo uno, fila uno: Tito's 750, Ketel One litro…",
        "Well one, row two: Bacardi 750, Captain Morgan 750  (no row three — next well)",
        "Well two, row one: Espolon, Jameson, Hendrick's",
        "Back bar right, row one: Casamigos, row two: Don Julio, row three: Clase Azul",
        "Cooler shelf one, shelf two, shelf three: this beer, that beer",
        "Wine shelf and wine cooler: name each the same way",
      ],
    },
  },
  {
    number: "05",
    title: "Save the Note — the Program Builds It",
    body: "Save that first voice note and upload the file into the program (or paste it into Employee communications / the walk upload). The built-in parser — sitting right there on your laptop, no internet required — reads your words and builds the whole bar: the stations, the rows, the bottle list, and the first spreadsheet map. You talk it once; the program constructs the rest.",
    note: "One saved walk in, a full structured bar out. No AI, no upload to anyone else's server — the parser lives in the program and does the work itself.",
  },
  {
    number: "06",
    title: "Review the First Map",
    body: "You get a clean spreadsheet-style view of the map it built. Locations are named, look-alike bottles are flagged, and blank spaces are left on purpose so a human can verify the real room before anyone relies on it.",
    note: "This is the check-in moment. The program does the heavy lifting, but the restaurant approves the truth.",
  },
  {
    number: "07",
    title: "Download Your Count Sheets",
    body: "Once the map is populated, download the count sheets. They print with blank spaces beside every bottle so you know exactly what to do — and what to say — when you walk the bar the second time. Prefer digital? Export to CSV or pull them into your own apps.",
    note: "Printable sheets with spaces for the walk, CSV for your apps. The second count is never a guess about where to start.",
  },
  {
    number: "08",
    title: "Run the Count, Log Your Purchases",
    body: "Count quantities against the approved map — easy visual/tenths for average bartender, mobile large-tap count when you're on the floor, or use scales for pinpoint measurements when you want precision. Levels and notes can be English or Spanish. Then bring in the matching paperwork for the same date window. Type your invoice numbers or paste the invoice text — the program's parser handles it locally. Add the POS sales export, drop in manager notes, and you have the full week.",
    note: "Type it or paste it — that is the default, and it was field-tested that way. Snapping invoice photos is the one optional shortcut, and only if you connect AI (next section). Scales, barcode scan, and Spanish level words are built in.",
  },
  {
    number: "09",
    title: "Open the Butterfly Home Base",
    body: "After you Process the first cycle, the caterpillar becomes the butterfly: a calm home base that shows what happened, what changed, and what deserves attention. The same bookmarked page you started with is now your everyday industrial-strength admin panel — live spreadsheets, PAR levels, variance, smart orders, costing, POS intelligence, multi-venue, receiving, employee communications, and more, all built in.",
    note: "It should feel like hospitality: calm, clear, useful, and ready when the manager opens it. Simple to start, full power when you need it. Far better than the others and getting better every day.",
  },
  {
    number: "10",
    title: "You Have Full Control — and It's Open Source",
    body: "Inside the admin panel there are plenty of places to change the bars, rename them, and restructure how everything is laid out. The settings give you complete access — mobile counting, barcode, par alerts, recipes, POS, smart orders, multi-venue, receiving, weighing, PIN team logins, employee communications, and the Coming soon roadmap (full Spanish UI, restaurant package). And because it is open source, nothing is locked away — the program is yours to run, change, and own.",
    note: "Change the bars, restructure the layout, own the whole thing. Complete access, open source, no lock-in. We're learning things the paid systems aren't even doing.",
  },
];

const optionalAi = {
  providers: [
    { name: "Claude", note: "Bring your own key" },
    { name: "ChatGPT", note: "Bring your own key" },
    { name: "Grok", note: "Bring your own key" },
  ],
  points: [
    "The whole program works without it. Setup, voice walk, count, reconcile, Process, spreadsheets — all local, all free.",
    "Connect it only if you want to snap a phone photo of a vendor invoice instead of typing the line items.",
    "Your key is a private password for invoice photos, stored on your Mac and nowhere else.",
    "Skip it now, add it later in Settings, or never touch it — your call, every time.",
  ],
};

const whatYouNeed = [
  { item: "A laptop and Google Chrome", detail: "The program installs into Chrome and lives on one bookmarked page you always return to. It runs right there — offline, no account, no cloud." },
  { item: "A phone for voice notes", detail: "Walk each bar and speak it in order — English or Spanish — bar/barra, well/pozo, row/fila, cooler, wine — naming the bottles as you go." },
  { item: "A first bar walk", detail: "That one saved voice note is the seed the built-in parser reads to build your whole bar. Upload or paste via Employee communications." },
  { item: "Your invoices and POS report", detail: "Type or paste the invoice numbers and pull the POS export once the first real cycle is ready." },
  { item: "A careful review", detail: "The first map gets checked and approved before the program becomes your home base." },
  { item: "Optional: your own AI key", detail: "Not required for anything. Add it only if you want invoice photos read from your phone instead of typing." },
];

const weeklyRhythm = [
  {
    title: "Count",
    body: "Walk the approved map and record quantities, bottle levels, and anything that feels off — English or Spanish level words, easy visual or tenths, mobile large-tap count, or scales for pinpoint measurements.",
  },
  {
    title: "Add",
    body: "Bring in POS sales, delivery notes, and manager context for the same period. Barcode, receiving, and structured POS built in. Optional invoice photos if you connect AI.",
  },
  {
    title: "Read",
    body: "Open the home base and see the weekly story: usage, spend, variance, betterments, and next checks. Smart orders, costing, and full intelligence included.",
  },
];

const dataPromises = [
  "Your bar map stays easy for your team to understand — including mixed English/Spanish inventory notes.",
  "Your weekly packet stays tied to the correct count window.",
  "Your data lives on your laptop — no cloud account holding it hostage.",
  "Your admin panel lets you rename bars and restructure the layout anytime. Mobile count, barcode, POS, multi-venue, employee communications, and scales are built in.",
  "Your program is open source — yours to run, change, and own with no lock-in. Full Spanish UI and restaurant tools are next on the Coming soon panel.",
];

export default function TheProcess() {
  return (
    <main className="min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-gear-border">
        <div className="absolute right-[-60px] top-[-40px] text-copper pointer-events-none">
          <Gear size={240} className="gear-spin opacity-20" />
        </div>
        <div className="absolute left-[-30px] bottom-[-30px] text-copper pointer-events-none">
          <Gear size={120} className="gear-spin-slow opacity-10" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="glow-dot" />
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-patina to-transparent" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-patina-light font-medium">
              The Kitchen Table Version
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-patina to-transparent" />
            <div className="glow-dot" />
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight mb-8">
            <span className="copper-text">One Chrome-side program.</span>
            <br />
            <span className="text-cream">Simple to start. Industrial strength when needed.</span>
          </h1>

          <p className="text-text-muted text-xl leading-relaxed max-w-2xl mx-auto mb-6">
            Install it, bookmark one page in Chrome, and that page becomes your
            whole system. Starts as an easy guided walkthrough for the average
            bartender — walk or talk your inventory in (English, Spanish, or
            mixed), simple counts, no learning curve. Grows into the most
            complete free bar inventory program available.
          </p>

          <p className="text-text-muted text-lg leading-relaxed max-w-2xl mx-auto">
            Version 1.5 is live: Spanish-ready inventory notes, mobile counting,
            barcode, POS, smart orders, recipes, multi-venue, employee
            communications, and PIN team logins. Scales and pinpoint
            measurements are built in. Full Spanish UI is next — the walk
            language works today.
          </p>
        </div>
      </section>

      {/* PRODUCT VIEW */}
      <section id="system-report" className="border-b border-gear-border bg-bg-warm">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-4">
              The Big Picture
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream mb-5">
              What you are actually using
            </h2>
            <p className="text-text-muted leading-relaxed text-lg">
              One calm control panel that runs on your laptop. Starts simple for
              the average bartender — walk or talk your inventory in, easy and
              fast. Grows into the most encompassing industrial-strength bar
              inventory system available — far better than the others, and we're
              getting better every day. Built for the average bartender but it
              has all the bells and whistles, including built-in scales and
              pinpoint measurements. Scalable — it's all there for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {productBlocks.map((block) => (
              <article key={block.label} className="panel p-6 md:p-7">
                <p className="text-[10px] tracking-[0.25em] uppercase text-copper mb-5">
                  {block.label}
                </p>
                <h3 className="font-serif text-2xl text-cream mb-4">
                  {block.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {block.body}
                </p>
              </article>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="panel p-6 md:p-8 lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="glow-dot" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-patina-light">
                  Inside the Home Base
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-copper/20 bg-copper/20">
                {homeBaseFeatures.map((module) => (
                  <div key={module.title} className="bg-bg-panel/95 p-5">
                    <h4 className="font-serif text-xl text-cream mb-2">
                      {module.title}
                    </h4>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {module.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="panel p-6 md:p-8 lg:col-span-5">
              <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-5">
                Checks and Gates
              </p>
              <h3 className="font-serif text-3xl text-cream mb-5">
                The system slows down where it should — then unlocks full power.
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                Starts simple for the average bartender. These gates make sure
                the first map is clear. Then the full industrial-strength toolkit
                (mobile, barcode, par, costing, POS, smart orders, multi-venue,
                receiving, scales and pinpoint measurements and more) is yours.
                Scalable and all there for you.
              </p>
              <ul className="space-y-4">
                {setupGates.map((check, i) => (
                  <li key={check} className="flex gap-4 text-sm text-text-muted leading-relaxed">
                    <span className="font-mono text-copper text-xs mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* WHAT YOU NEED */}
      <section className="border-b border-gear-border bg-bg-panel">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-4">Before Setup</p>
            <h2 className="font-serif text-4xl text-cream mb-4">What you need at the table</h2>
            <p className="text-text-muted">
              Nothing exotic. Just the pieces a real restaurant already has,
              gathered into one guided flow.
            </p>
          </div>
          <ul className="flex flex-col gap-5">
            {whatYouNeed.map((item, i) => (
              <li key={item.item} className="panel p-5 flex items-start gap-5">
                <div className="w-8 h-8 rounded-full border border-copper/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="font-serif text-copper text-sm">{i + 1}</span>
                </div>
                <div>
                  <p className="text-cream text-sm font-semibold mb-1">{item.item}</p>
                  <p className="text-text-muted text-sm leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-b border-gear-border bg-bg-warm">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-4">First Setup</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream mb-4">How it goes from first walk to home base</h2>
            <p className="text-text-muted max-w-xl mx-auto">
              The first setup is meant to feel like a guided conversation for
              the average bartender. Do one thing, check it, then move to the
              next. Starts simple — but the full industrial toolkit is already
              inside when you need it.
            </p>
          </div>

          <PipeLine>
            {steps.map((step, i) => (
              <PipeNode key={step.number} active={i === 3}>
                <div className="panel p-7 md:p-9 mb-0">
                  <div className="flex items-start gap-5 mb-5">
                    <span className="font-mono text-2xl text-copper flex-shrink-0 mt-1">{step.number}</span>
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="font-serif text-2xl text-cream">{step.title}</h3>
                      </div>
                      <p className="text-text-muted leading-relaxed">{step.body}</p>
                    </div>
                  </div>

                  {step.cards && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 ml-0 md:ml-14">
                      {step.cards.map((card) => (
                        <div key={card.name} className="bg-bg/60 border border-gear-border rounded p-4">
                          <p className="text-xs font-semibold text-copper uppercase tracking-widest mb-2">{card.name}</p>
                          <p className="text-xs text-text-muted leading-relaxed">{card.path}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {step.example && (
                    <div className="mt-5 ml-0 md:ml-14">
                      <p className="text-xs text-text-light uppercase tracking-wider mb-3">{step.example.label}</p>
                      <div className="bg-bg/60 border border-gear-border rounded p-4 font-mono text-sm text-text-muted leading-loose">
                        {step.example.lines.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 ml-0 md:ml-14 flex items-start gap-3 bg-bg/40 border border-copper/10 rounded p-4">
                    <span className="font-mono text-copper text-xs uppercase tracking-widest flex-shrink-0 mt-0.5">Note</span>
                    <p className="text-sm text-text-muted leading-relaxed">{step.note}</p>
                  </div>
                </div>
              </PipeNode>
            ))}
          </PipeLine>
        </div>
      </section>

      {/* VOICE COUNT EXAMPLE */}
      <section className="border-b border-gear-border">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-4">Voice to Spreadsheet</p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream mb-4">What the first bar walk sounds like</h2>
            <p className="text-text-muted max-w-xl mx-auto">
              You do not have to speak like a robot. You describe the room the
              way you would explain it to a person (or walk it), and the system
              gives you a cleaner version to review. Starts simple and fast for
              the average bartender — but scales and pinpoint measurements are
              built in and ready when you need them. It's scalable; all there for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="panel p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="glow-dot" />
                <span className="text-[11px] tracking-[0.3em] uppercase text-patina-light">What You Say Into Your Phone</span>
              </div>
              <div className="font-mono text-sm text-text-muted leading-loose bg-bg/60 p-4 rounded border border-gear-border">
                <p className="text-text-light mb-1">Bar one. Well one, row one:</p>
                <p>Titos 750, Ketel One liter, Tanqueray 750</p>
                <p className="text-text-light mt-3 mb-1">Well one, row two:</p>
                <p>Bacardi 750, Captain Morgan 750 &mdash; no row three</p>
                <p className="text-text-light mt-3 mb-1">Well two, row one:</p>
                <p>Espolon, Jameson, Hendrick&apos;s</p>
                <p className="text-text-light mt-3 mb-1">Back bar right:</p>
                <p>Row one: Casamigos &middot; row two: Don Julio &middot; row three: Clase Azul</p>
                <p className="text-text-light mt-3 mb-1">Cooler and wine:</p>
                <p>Cooler shelf one, two, three &middot; wine shelf, wine cooler</p>
              </div>
              <p className="text-xs text-text-light mt-4 italic">
                Bar, well, row, back bar, cooler, wine &mdash; in order. The first pass records placement, not quantities. Simple for the average bartender (easy and fast) — but scales and pinpoint measurements are built in and available when you need them.
              </p>
            </div>

            <div className="panel p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-brass/60 shadow-[0_0_8px_var(--brass)]" />
                <span className="text-[11px] tracking-[0.3em] uppercase text-brass-light">What Comes Back to Review</span>
              </div>
              <div className="text-sm text-text-muted leading-relaxed bg-bg/60 p-4 rounded border border-gear-border">
                <p className="text-text-light text-xs uppercase tracking-wider mb-3">Bar 1 · Well 1 - Draft Map</p>
                <div className="space-y-1 mb-4">
                  <p>Row 1, Slot 1 - <span className="text-copper font-mono">Tito&apos;s 750ml</span></p>
                  <p>Row 1, Slot 2 - <span className="text-copper font-mono">Ketel One 1L</span></p>
                  <p>Row 1, Slot 3 - <span className="text-copper font-mono">Tanqueray 750ml</span></p>
                  <p>Row 2, Slot 1 - <span className="text-copper font-mono">Bacardi 750ml</span></p>
                  <p>Row 2, Slot 2 - <span className="text-copper font-mono">Captain Morgan 750ml</span></p>
                </div>
                <p className="text-text-light text-xs uppercase tracking-wider mb-3 border-t border-gear-border pt-3">Bar 1 · Back Bar Right - Draft Map</p>
                <div className="space-y-1 mb-4">
                  <p>Row 1 - <span className="text-copper font-mono">Casamigos</span></p>
                  <p>Row 2 - <span className="text-copper font-mono">Don Julio</span></p>
                  <p>Row 3 - <span className="text-copper font-mono">Clase Azul</span></p>
                </div>
                <div className="border-t border-gear-border pt-3 bg-rust/10 -mx-4 px-4 py-3 rounded-b text-xs text-rust">
                  Check-in: Well 1 stopped at Row 2 — confirm there is no Row 3 before moving to Well 2.
                </div>
              </div>
              <p className="text-xs text-text-light mt-4 italic">
                The output becomes the review sheet before the first live count.
                The full toolkit (POS, costing, smart orders, scales/pinpoint, etc.) is already there for when you need industrial strength.
              </p>
            </div>
          </div>
        </div>
      </section>

      <GearDivider />

      {/* WEEKLY RHYTHM */}
      <section className="border-b border-gear-border bg-bg-panel">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-4">After Setup</p>
            <h2 className="font-serif text-4xl text-cream mb-4">The weekly rhythm is simple</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Once the butterfly opens, the restaurant repeats the same clean
              loop: count the room, add the matching paperwork, read the story.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {weeklyRhythm.map((item, i) => (
              <article key={item.title} className="panel p-6">
                <p className="font-mono text-copper text-xs mb-4">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-serif text-2xl text-cream mb-3">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OPTIONAL AI */}
      <section className="border-b border-gear-border">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="glow-dot" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-patina-light">
                  The One Optional Extra
                </p>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-cream mb-5">
                Everything above is free and needs no AI.
              </h2>
              <p className="text-text-muted leading-relaxed mb-4">
                We mean that literally. The walk, the count, the reconcile, the
                Process, the spreadsheets, mobile counting, barcode, par alerts,
                costing, POS, smart orders, multi-venue, receiving, and built-in
                scale support for pinpoint measurements — all of it runs on your
                laptop, on its own, at no cost. You could unplug the internet and
                still close your week. Industrial strength for free.
              </p>
              <p className="text-text-muted leading-relaxed">
                There is exactly one thing you can add if you want a shortcut:
                connect your own AI key so the program can read a photo of a
                vendor invoice instead of you typing the line items. That is the
                whole pitch. No upsell hiding behind it. The most encompassing
                best program that's out there.
              </p>
            </div>

            <aside className="lg:col-span-7 panel p-6 md:p-8">
              <p className="text-[10px] tracking-[0.25em] uppercase text-copper mb-5">
                Bring Your Own Key — Or Don&apos;t
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
                {optionalAi.providers.map((p) => (
                  <div key={p.name} className="bg-bg/60 border border-gear-border rounded p-4">
                    <p className="text-sm font-semibold text-cream mb-1">{p.name}</p>
                    <p className="text-xs text-text-light">{p.note}</p>
                  </div>
                ))}
              </div>
              <ul className="space-y-4">
                {optionalAi.points.map((point) => (
                  <li key={point} className="flex gap-4 text-sm text-text-muted leading-relaxed">
                    <span className="text-copper flex-shrink-0 mt-0.5">&mdash;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-text-light italic mt-6 pt-5 border-t border-gear-border">
                Coming later: point your phone at the wine cooler and let a video
                walk do the talking. Also optional. Also yours to ignore.
                The core program is already the most complete industrial-strength
                system — free, with scales and pinpoint built in for when you want them.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* DATA + TRUST */}
      <section className="border-b border-gear-border bg-bg-warm">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-4">Your Data</p>
            <h2 className="font-serif text-3xl text-cream mb-5">Customer-owned, laptop-local. Industrial strength with scales and pinpoint measurements built in.</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              The inventory map, weekly notes, invoice details, POS reports, and
              spreadsheet outputs live on your machine, in files a manager can
              read without a translator. Nothing gets shipped off to a server to
              make the program work. The full industrial-strength toolkit — all
              features including scales and pinpoint measurements — stays yours.
            </p>
            <p className="text-text-muted leading-relaxed">
              The only thing that ever reaches out is the optional AI key — and
              only when you ask it to read an invoice photo. Skip it and the
              whole system still does its job, start to finish. Far better than
              the others and we're learning things they're not even doing.
            </p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-4">The Promise</p>
            <h2 className="font-serif text-3xl text-cream mb-5">Useful before it is fancy. The best, most encompassing program — free, with scales and pinpoint for average or pro use.</h2>
            <ul className="flex flex-col gap-4">
              {dataPromises.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-text-muted">
                  <span className="text-copper flex-shrink-0 mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 text-copper pointer-events-none opacity-10">
          <Gear size={320} className="gear-spin-slow" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-6">Ready when you are</p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream mb-6 max-w-2xl mx-auto">
            Start with the first bar walk.<br />
            <span className="copper-text">Simple for the average bartender.<br />Industrial strength for the best.</span>
          </h2>
          <p className="text-text-muted max-w-md mx-auto mb-10 text-lg">
            Built for the average bartender to start simple and fast — walk or
            talk your inventory in. But scales and pinpoint measurements are
            built in and available anytime. The most encompassing best program
            out there, free, and getting better every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory/dashboard"
              prefetch={false}
              className="inline-block bg-copper hover:bg-copper-bright text-bg font-semibold px-10 py-4 text-base tracking-wide transition-all hover:shadow-[0_0_40px_rgba(168,120,79,0.3)]"
            >
              Visit Live Demo
            </Link>
            <Link
              href="/download"
              prefetch={false}
              className="inline-block border border-copper/40 text-copper hover:bg-copper/10 font-semibold px-10 py-4 text-base tracking-wide transition-all"
            >
              Download Program
            </Link>
          </div>
          <p className="text-text-light text-sm mt-5">
            Forked kitchen table talk: simple enough for the average bartender
            (walk or talk it in, easy and fast), powerful enough to be the best
            — with scales and pinpoint measurements built in. Sturdy enough to
            run the bar — industrial strength included.
          </p>
        </div>
      </section>

      {/* HowTo structured data for SEO - backend, at bottom */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Set Up the Free Bar Inventory System",
            "description": "Step by step guide to setting up the best free inventory system for bars using voice notes and the Open Source Barware program.",
            "totalTime": "PT30M",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Install and Bookmark",
                "text": "Download the package and bookmark the page in Chrome. This becomes your inventory home base."
              },
              {
                "@type": "HowToStep",
                "name": "Name Your Bars",
                "text": "Build the bar structure by naming physical bars, wells, rows, back bars, coolers and wine spaces."
              },
              {
                "@type": "HowToStep",
                "name": "Walk and Speak the Inventory",
                "text": "Walk each bar and dictate the bottles in order. The parser builds the map from your voice note."
              },
              {
                "@type": "HowToStep",
                "name": "Review the Map",
                "text": "Review the generated spreadsheet map for accuracy before first count."
              },
              {
                "@type": "HowToStep",
                "name": "Run Counts and Reconcile",
                "text": "Count in tenths, log purchases and POS for the period, then Process to see variance and usage."
              }
            ]
          })
        }}
      />
    </main>
  );
}
