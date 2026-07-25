"use client";

import { useState, type MouseEvent } from "react";
import {
  getUpdatesSignupStatus,
  submitUpdatesSignup,
  US_STATES,
} from "@/lib/updates-signup";
import { areDownloadsUnlocked, getDownloadLockMessage } from "@/lib/launch-gate";
import { useLaunchNow } from "@/lib/use-launch-now";
import TotalDownloadsGauge from "@/components/TotalDownloadsGauge";

const MAC_ZIP = "/downloads/open-source-barware-program-mac.zip";
const WIN_ZIP = "/downloads/open-source-barware-program-win.zip";
const GITHUB =
  "https://github.com/RichardBJamison/open-source-barware";
const GITHUB_DISCUSSIONS =
  "https://github.com/RichardBJamison/open-source-barware/discussions";
const FEEDBACK_EMAIL = "me@richardbjamison.com";

const downloadCardClass =
  "border border-gear-border bg-bg/50 p-6 text-left transition-colors hover:border-copper/50 hover:bg-bg-warm/80 block no-underline";

export default function ProgramDownloadPanel() {
  // Launch gate only — no useSearchParams (that forced Suspense fallback "Loading…" into static HTML)
  const now = useLaunchNow();
  const unlocked = areDownloadsUnlocked(now);

  const priorStatus = getUpdatesSignupStatus();
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [programUpdates, setProgramUpdates] = useState(true);
  const [hiddenBarTour, setHiddenBarTour] = useState(true);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(priorStatus === "subscribed");

  async function joinList() {
    if (!programUpdates && !hiddenBarTour) {
      setStatus("Select at least one list to join.");
      return;
    }

    setSubmitting(true);
    setStatus("");
    const result = await submitUpdatesSignup(
      {
        email,
        city,
        state,
        programUpdates,
        hiddenBarTour,
      },
      "download-page"
    );
    setSubmitting(false);

    if (!result.ok) {
      setStatus(result.message);
      return;
    }

    setStatus(result.message);
    setSubscribed(true);
  }

  function onDownloadClick(
    e: MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string
  ) {
    if (!unlocked) {
      e.preventDefault();
      setStatus(`${getDownloadLockMessage()} Leave your email above to get notified.`);
      return;
    }
    if (typeof window !== "undefined" && "osbTrackDownload" in window) {
      (
        window as Window & {
          osbTrackDownload?: (file: string, label?: string) => void;
        }
      ).osbTrackDownload?.(href, label);
    }
    setStatus(`Downloading ${label}…`);
  }

  return (
    <div className="space-y-10">
      {/* Honest release note */}
      <div className="panel rivets rounded-sm p-8 md:p-10 relative grain border border-copper/20">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] tracking-[0.3em] uppercase text-patina-light">
            v1.5 public release
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-text-light">
            Live · July 10, 2026
          </span>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl copper-text mb-4">
          Blistering work. Real bar software. Spanish-ready notes.
        </h2>
        <div className="space-y-4 text-text-muted text-sm md:text-base leading-relaxed max-w-3xl">
          <p>
            This is the <strong className="text-cream">v1.5</strong> install —
            walks and counts understand English and Spanish station words,
            mobile counting, barcode, POS import, smart orders, recipes,
            multi-venue, employee communications, and PIN logins. Built with
            over a hundred hours of focused work — and too much coffee to fully
            explain.
          </p>
          <p>
            Expect bugs and glitches as real bars put it through hell. We push
            updates about every <strong className="text-cream">three days</strong>{" "}
            as we learn. Full Spanish UI and the restaurant package are next —
            watch Coming soon inside the program.
          </p>
          <p>
            <strong className="text-cream">Leave your email</strong> and we will
            tell you when a new build is ready — no marketing blasts, just
            release notes when something actually ships.
          </p>
        </div>
      </div>

      {/* Large signup — double toggle */}
      {!subscribed && (
        <div className="panel rivets rounded-sm p-8 md:p-12 relative grain">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[10px] tracking-[0.3em] uppercase text-patina-light mb-3">
                Stay in the loop
              </p>
              <h2 className="font-serif text-3xl md:text-4xl copper-text mb-4">
                Get release builds in your inbox
              </h2>
              <p className="text-text-muted text-sm md:text-base leading-relaxed">
                Both lists are on by default — toggle off anything you do not
                want. Email is how we ship fixes fast during month one.
              </p>
            </div>

            <label className="flex flex-col gap-2 mb-6">
              <span className="text-xs uppercase tracking-[0.15em] text-text-muted">
                Email <span className="text-copper">*</span>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbar.com"
                autoComplete="email"
                className="w-full bg-bg-warm border border-gear-border rounded-sm px-5 py-4 text-lg text-cream focus:outline-none focus:border-copper focus:shadow-[0_0_24px_rgba(168,120,79,0.15)]"
              />
            </label>

            <div className="space-y-4 mb-8">
              <label className="flex items-center gap-5 border-2 border-gear-border bg-bg/50 px-5 py-5 rounded-sm cursor-pointer transition-colors hover:border-copper/40">
                <span className="osb-toggle">
                  <input
                    type="checkbox"
                    checked={programUpdates}
                    onChange={(e) => setProgramUpdates(e.target.checked)}
                  />
                  <span className="osb-toggle-track" aria-hidden="true" />
                  <span className="osb-toggle-knob" aria-hidden="true" />
                </span>
                <span className="text-base text-cream leading-relaxed">
                  <strong>Program updates</strong> — email me when Open Source
                  Barware ships a new build, fix, or feature. This is the main
                  release list.
                </span>
              </label>

              <label className="flex items-center gap-5 border-2 border-gear-border bg-bg/50 px-5 py-5 rounded-sm cursor-pointer transition-colors hover:border-copper/40">
                <span className="osb-toggle">
                  <input
                    type="checkbox"
                    checked={hiddenBarTour}
                    onChange={(e) => setHiddenBarTour(e.target.checked)}
                  />
                  <span className="osb-toggle-track" aria-hidden="true" />
                  <span className="osb-toggle-knob" aria-hidden="true" />
                </span>
                <span className="text-base text-cream leading-relaxed">
                  <strong>Hidden Bar Tour</strong> — also invite me to discovery
                  runs and field tests in my city when we schedule them.
                </span>
              </label>

              {hiddenBarTour && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs uppercase tracking-[0.15em] text-text-muted">
                      City <span className="text-copper">*</span>
                    </span>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="city"
                      autoComplete="address-level2"
                      className="w-full bg-bg-warm border border-gear-border rounded-sm px-4 py-3 text-cream focus:outline-none focus:border-copper"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs uppercase tracking-[0.15em] text-text-muted">
                      State <span className="text-copper">*</span>
                    </span>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-bg-warm border border-gear-border rounded-sm px-4 py-3 text-cream focus:outline-none focus:border-copper"
                    >
                      <option value="">Select state</option>
                      {US_STATES.map(([abbr, name]) => (
                        <option key={abbr} value={abbr}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
            </div>

            {status && (
              <p
                className={`text-sm mb-6 text-center ${
                  status.includes("on the list") || status.includes("release list")
                    ? "text-patina-light"
                    : "text-copper"
                }`}
              >
                {status}
              </p>
            )}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={joinList}
                disabled={submitting}
                className="bg-copper hover:bg-copper-bright disabled:bg-bg-card disabled:text-text-light text-bg font-semibold px-12 py-4 text-sm tracking-wide transition-all hover:shadow-[0_0_28px_rgba(168,120,79,0.3)]"
              >
                {submitting ? "Saving…" : "Join the release list"}
              </button>
            </div>
          </div>
        </div>
      )}

      {subscribed && (
        <div className="panel rounded-sm p-8 text-center border border-patina/30">
          <h3 className="font-serif text-2xl copper-text mb-2">You&rsquo;re on the list</h3>
          <p className="text-text-muted text-sm max-w-md mx-auto">
            We only email when a new build ships. Grab the installer below and
            bookmark this page for updates every few days.
          </p>
        </div>
      )}

      {/* Downloads */}
      <div className="panel rounded-sm p-8 md:p-10" id="program-downloads">
        <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-4">
          Install
        </p>
        <h2 className="font-serif text-3xl text-cream mb-6">
          Download Open Source Barware v1.5
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          <a
            href={MAC_ZIP}
            download
            onClick={(e) => onDownloadClick(e, MAC_ZIP, "Mac program (.zip)")}
            className={downloadCardClass}
            aria-disabled={!unlocked}
          >
            <span className="block text-[10px] tracking-[0.25em] uppercase text-copper mb-3">
              macOS
            </span>
            <span className="block font-serif text-xl text-cream mb-2">
              Mac installer zip
            </span>
            <span className="block text-sm text-text-muted">
              Install.command → ~/osb-program
            </span>
          </a>
          <a
            href={WIN_ZIP}
            download
            onClick={(e) => onDownloadClick(e, WIN_ZIP, "Windows program (.zip)")}
            className={downloadCardClass}
            aria-disabled={!unlocked}
          >
            <span className="block text-[10px] tracking-[0.25em] uppercase text-copper mb-3">
              Windows
            </span>
            <span className="block font-serif text-xl text-cream mb-2">
              Windows installer zip
            </span>
            <span className="block text-sm text-text-muted">
              Install.bat → %USERPROFILE%\osb-program
            </span>
          </a>
        </div>

        <div className="mt-6 max-w-3xl space-y-2 text-sm text-text-muted leading-relaxed">
          <p>
            Unzip, run the installer, bookmark the page it opens —{" "}
            <strong className="text-cream">that bookmark is the software</strong>.
          </p>
          <p>
            <span className="text-text-light">Mac:</span> if blocked, right-click{" "}
            <code className="text-copper">Install.command</code> → Open once, or open{" "}
            <code className="text-copper">START-HERE-MAC.html</code> in the zip.
          </p>
        </div>

        {!unlocked && (
          <p className="text-copper text-sm mt-4 max-w-3xl">
            {getDownloadLockMessage()}
          </p>
        )}
        {status && !subscribed && (
          <p className="text-sm text-text-muted text-center mt-6">{status}</p>
        )}
      </div>

      <TotalDownloadsGauge />

      {/* Community */}
      <div className="panel rounded-sm p-8 md:p-10">
        <p className="text-[11px] tracking-[0.3em] uppercase text-text-light mb-4">
          Community
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-cream mb-6">
          Help us fix what breaks
        </h2>
        <ul className="space-y-4 text-text-muted text-sm md:text-base leading-relaxed max-w-3xl mb-8">
          <li className="flex gap-3">
            <span className="text-copper shrink-0">→</span>
            <span>
              <strong className="text-cream">Email us</strong> when something
              confuses you or breaks —{" "}
              <a
                href={`mailto:${FEEDBACK_EMAIL}?subject=Open%20Source%20Barware%20v1.5%20feedback`}
                className="text-copper hover:text-copper-bright underline underline-offset-4"
              >
                {FEEDBACK_EMAIL}
              </a>
              . Real bars beat lab tests.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-copper shrink-0">→</span>
            <span>
              <strong className="text-cream">Join us on GitHub</strong> — star
              the repo, open issues, send pull requests. This is a community
              build.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-copper shrink-0">→</span>
            <span>
              <strong className="text-cream">Discord is coming</strong> — we are
              standing up a community space for bar managers and contributors.
              Watch this page and the release list for the invite.
            </span>
          </li>
        </ul>
        <div className="flex flex-wrap gap-4">
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-copper hover:bg-copper-bright text-bg font-semibold px-8 py-3.5 text-sm tracking-wide transition-all"
          >
            GitHub — contribute
          </a>
          <a
            href={GITHUB_DISCUSSIONS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-8 py-3.5 text-sm tracking-wide transition-all"
          >
            GitHub Discussions
          </a>
          <a
            href={`mailto:${FEEDBACK_EMAIL}?subject=Open%20Source%20Barware%20v1.5%20feedback`}
            className="inline-block border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-8 py-3.5 text-sm tracking-wide transition-all"
          >
            Email feedback
          </a>
        </div>
      </div>
    </div>
  );
}