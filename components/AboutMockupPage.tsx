"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const navHotspots = [
  { label: "Home", href: "/", className: "nav-home" },
  { label: "The Process", href: "/the-process", className: "nav-process" },
  { label: "About", href: "/about", className: "nav-about" },
  { label: "Resources", href: "/resources", className: "nav-resources" },
  { label: "Live Demo", href: "/inventory", className: "nav-app" },
  { label: "Free Program", href: "/downloads", className: "nav-free" },
];

export default function AboutMockupPage() {
  const storyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.location.hash !== "#story") return;

    requestAnimationFrame(() => {
      storyRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }, []);

  return (
    <div className="osb-about-mockup">
      <style>{`
        body:has(.osb-about-mockup) > header,
        body:has(.osb-about-mockup) > footer {
          display: none;
        }

        .osb-about-mockup {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 0%, rgba(58, 44, 27, 0.28), transparent 34rem),
            linear-gradient(180deg, #020202 0%, #070706 100%);
          color: #f4ead8;
        }

        .osb-about-page {
          width: min(1122px, 100vw);
          margin: 0 auto;
          background: #090807;
          box-shadow: 0 0 80px rgba(0, 0, 0, 0.72);
        }

        .osb-plate {
          position: relative;
          margin: 0;
        }

        .osb-plate img {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
          position: relative;
          z-index: 1;
        }

        .osb-hotspot {
          position: absolute;
          display: block;
          z-index: 4;
          color: transparent;
          text-decoration: none;
          outline: none;
          pointer-events: auto;
        }

        .osb-hotspot:focus-visible {
          box-shadow:
            0 0 0 2px #f1c36e,
            0 0 22px rgba(241, 195, 110, 0.6);
          background: rgba(241, 195, 110, 0.08);
        }

        .nav-home {
          left: 40.2%;
          top: 4.1%;
          width: 5.2%;
          height: 2.8%;
        }

        .nav-process {
          left: 47.1%;
          top: 4.1%;
          width: 10.4%;
          height: 2.8%;
        }

        .nav-about {
          left: 58.4%;
          top: 3.4%;
          width: 7.8%;
          height: 4.1%;
        }

        .nav-resources {
          left: 67.1%;
          top: 4.1%;
          width: 9.2%;
          height: 2.8%;
        }

        .nav-app {
          left: 77.7%;
          top: 4.1%;
          width: 4.8%;
          height: 2.8%;
        }

        .nav-free {
          left: 83.4%;
          top: 2.8%;
          width: 13.7%;
          height: 4.8%;
        }

        .support-button {
          left: 50.4%;
          top: 75.4%;
          width: 42.8%;
          height: 9.4%;
        }

        /* Legacy sign bulb overlay — keep the Ko-fi hotspot static. */
        .drink-sign-canvas-wrap,
        .drink-sign-canvas,
        .about-sign-lights {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        .osb-timeline-quip {
          position: absolute;
          z-index: 3;
          left: 53.4%;
          top: 36.9%;
          width: 41%;
          padding-left: 0.85rem;
          pointer-events: none;
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: clamp(0.66rem, 1.12vw, 0.8rem);
          line-height: 1.55;
          font-style: italic;
          color: #454545;
        }

        @media (max-width: 720px) {
          .osb-timeline-quip {
            left: 8%;
            top: 52%;
            width: 84%;
            padding-left: 0;
          }
        }

        .osb-sr-copy {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .osb-about-story {
          padding: 4rem 1.5rem 5rem;
          border-top: 1px solid rgba(168, 120, 79, 0.18);
          background: linear-gradient(180deg, #090807 0%, #0d0b09 100%);
        }

        .osb-about-story-inner {
          max-width: 42rem;
          margin: 0 auto;
        }

        .osb-about-story h2 {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          color: #b88958;
          margin: 2.5rem 0 1rem;
        }

        .osb-about-story h2:first-child {
          margin-top: 0;
        }

        .osb-about-story p,
        .osb-about-story li {
          color: #c8b9a4;
          line-height: 1.75;
          font-size: 1rem;
        }

        .osb-about-story p {
          margin-bottom: 1rem;
        }

        .osb-about-story ul {
          margin: 0 0 1rem 1.25rem;
          padding: 0;
        }

        .osb-about-story li {
          margin-bottom: 0.5rem;
        }

        .osb-about-story a {
          color: #b88958;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
      `}</style>

      <main className="osb-about-page">
        <section className="osb-plate" id="top" aria-label="Open Source Barware top page section">
          <Image
            src="/images/osb-about-top-approved.png"
            alt="Open Source Barware about page with steampunk barware hero, how it started panel, and credit section"
            width={1122}
            height={1402}
            priority
          />

          {navHotspots.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`osb-hotspot ${link.className}`}
              aria-label={link.label}
            />
          ))}

          <div className="osb-sr-copy">
            <h1>A real bar problem, built with the people living it.</h1>
            <p>Now it is free to the world.</p>
            <p>
              Open Source Barware is a free, open-source bar inventory system built around real bar
              work, real counts, and the people living the problem.
            </p>
            <p>
              Credits: Richard Jamison, Founder; Advisor; Hirado Junior &ldquo;Nito&rdquo;,
              Test Pilot.
            </p>
          </div>
        </section>

        <section
          ref={storyRef}
          className="osb-plate"
          id="story"
          aria-label="Open Source Barware story and support section"
        >
          <Image
            src="/images/osb-about-middle-bottom-approved.png"
            alt="Open Source Barware story section with timeline, Miami hidden bar tours panel, and buy us a drink support panel"
            width={1024}
            height={1106}
            priority
          />

          <p className="osb-timeline-quip" aria-hidden="true">
            Honestly — I should write a book on opening your bar post-apocalypse.
          </p>

          <a
            className="osb-hotspot support-button"
            href="https://ko-fi.com/W2J022HCH2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buy us a drink"
          />

          <div className="osb-sr-copy">
            <h2>It started with music.</h2>
            <p>
              This project is a thank-you to the bartenders, managers, musicians, guests, cooks,
              servers, barbacks, door staff, dishwashers, and friends who shaped the work.
            </p>
            <p>
              Post-2020 seasonal circuit: Hamptons, Lake Tahoe, Martha&apos;s Vineyard, Austin,
              Vail, and Aspen — Harbor View Hotel, The Wharf, Ritz-Carlton Bachelor Gulch, Molly
              Hotel with Death &amp; Co / Gin &amp; Luck. Honestly — I should write a book on
              opening your bar post-apocalypse.
            </p>
            <h2>Buy us a drink</h2>
            <p>Every donation keeps Open Source Barware alive, open, and free for everyone.</p>
          </div>
        </section>

        <section className="osb-about-story" aria-labelledby="about-story-heading">
          <div className="osb-about-story-inner">
            <h2 id="about-story-heading">Why I built this</h2>
            <p>
              Open Source Barware started with a problem every working bar manager recognizes:
              close out, grab the clipboard, count bottles by tenths, walk to the office, type
              numbers into a spreadsheet from 2014, try to reconcile against POS sales, and watch
              it never quite add up. The industry has lived that loop for decades while vendors
              sold inventory guns, monthly SaaS fees, and consulting priced by the bottle.
            </p>
            <p>
              I built the program I wished existed. It is free, open source, and designed around
              how bars actually run — voice notes on a walk-through, a spreadsheet everyone can
              read, weekly inputs for counts and invoices, and a home base that explains what
              changed instead of hiding behind a dashboard. It all runs on your laptop, on its own —
              no AI, no cloud, no subscription. No signup wall. No email capture. No investor deck
              between you and a clean count.
            </p>

            <h2>What &ldquo;open source&rdquo; means here</h2>
            <p>
              The program, documentation, and operating logic are meant to stay in the open. You can
              download the system, run it in Chrome, and keep your own inventory map and weekly
              packet on your terms — no account, no cloud, no AI required. Add your own AI key later
              only if you want invoice photos read for you. Fork it. Improve it. Share it with the
              next bar that is tired of renting their own workflow.
            </p>
            <ul>
              <li>One free Chrome-side program — not six upsells dressed as a toolkit.</li>
              <li>Customer-owned data that lives on your laptop, not a black-box cloud platform.</li>
              <li>Checks and gates before the first live count, so the map is right before the math.</li>
              <li>Weekly rhythm: count the room, add invoices and POS, read the story.</li>
            </ul>

            <h2>What&rsquo;s next</h2>
            <p>
              Now we build <strong>The World Hidden Bar Tour</strong>. City by city, every couple of
              months, we visit a new market — the bars that are popular and famous, the bartenders
              working those rooms, and the locals who actually know where to go after last call. We
              spend a few days on the floor, collect their recommendations for hidden bars, and tour
              the spots they trust to build another hidden-bar map for that city.
            </p>
            <p>
              Miami is first. Richard spent ten years there and already has five bars almost nobody
              outside the trade would think to visit — places that are absolutely brilliant once you
              know they exist. September is the first venture. That is what the fundraising is for.
            </p>
            <p>
              The inventory program is only the start. Next comes a full wine inventory system —
              updated pour logic, pitchers in depth, and hundreds of varietals of wine. A chat forum
              where bartenders can network, share what works, and talk shop with each other. And a
              full resource library — cocktail references, beer and wine references, and everything
              else worth keeping behind the bar, free for the people who use it.
            </p>

            <h2>Buy us a drink</h2>
            <p>
              The software stays free. Donations through{" "}
              <a href="https://ko-fi.com/W2J022HCH2" target="_blank" rel="noopener noreferrer">
                Ko-fi
              </a>{" "}
              help cover hosting, images, and the time it takes to keep the project open and honest
              for everyone. Every contribution keeps Open Source Barware alive without turning it into
              something we would not want to use behind our own bar.
            </p>
            <p>
              Hosting is only the floor. What you are really backing is the work still coming:
            </p>
            <ul>
              <li>Phone software built for real counts on the floor</li>
              <li>Digital scale integration — actual scale data import, not guesswork</li>
              <li>Notification systems that tell the right people at the right time</li>
              <li>
                Full liquor and wine inventory with the standards you can actually buy against
              </li>
              <li>Product history that follows a bottle from delivery to depletion</li>
              <li>
                A library for product knowledge — teaching brochures your other bartenders can use
              </li>
              <li>
                A working management-style bar bible so managers and leads stay on the same page
              </li>
            </ul>
            <p>
              And beside all of that, we are launching{" "}
              <strong>The World Hidden Bar Tour</strong> — city by city, bartender by bartender,
              mapping the bars worth knowing that most people never find.
            </p>
            <p>
              There are a lot of good reasons to buy us a drink. Your support keeps the free program
              moving and funds the next layer of tools, tours, and trade knowledge we are building
              for the people behind the stick.
            </p>

            <h2>Enterprise &amp; multi-venue</h2>
            <p>
              A lot of people are going to download this with multiple bars — and that is exactly
              what it is built for. But some operators run something bigger: multiple venues, each
              with its own liquor room, storage cases, and a lot of hands in the count. Same
              program, harder scale.
            </p>
            <p>
              I can customize this entire build for groups that need more than the free download.
              Multiple locations feeding one main system through API integrations. A different look
              and workflow for each restaurant in a chain, or each beverage program under one roof.
              For country and private clubs: restaurant inventory, membership-base purchasing, and
              every outlet in the club rolled into one collective reporting overview — so leadership
              sees the whole beverage program in one place, not twelve separate spreadsheets.
              However your operation is wired, I can build it — there are a million ways to do it
              right, and I have done this kind of work before.
            </p>
            <p>
              If you are running venues at enterprise scale and want Open Source Barware tailored
              to your group — not the off-the-shelf version — I would love to talk. I am a joy to
              work with, I love getting into the marketing side of it, and I take the build as
              seriously as the bar count.{" "}
              <a href="mailto:me@richardbjamison.com">Reach out</a> and we will figure out what
              your operation actually needs.
            </p>
            <p>
              This is{" "}
              <a
                href="https://intelligenthospitalitysystems.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                intelligenthospitalitysystems.com
              </a>{" "}
              &mdash; coming soon.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
