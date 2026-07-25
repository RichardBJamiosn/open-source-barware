"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

import { AppButton } from "@/components/AppUI";

interface DojoWelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

const HOUSE_RULES = [
  "No live steel in the well",
  "No glass in the well",
  "Salute before you pour",
  "Bro's before ego's",
  "Leave your nonsense at the door",
] as const;

export default function DojoWelcomeModal({ open, onClose }: DojoWelcomeModalProps) {
  const [entering, setEntering] = useState(false);

  const enterSalle = useCallback(() => {
    setEntering(true);
    onClose();
  }, [onClose]);

  // No armory grid here — the Salle opens straight to the working admin panel (home base).
  // Advanced tools and V1.5 features live in the sidebar Settings + playful interactions on the dashboard.

  if (!open) return null;

  return (
    <div
      className="salle-welcome-overlay fixed inset-0 z-[180] overflow-y-auto overscroll-contain p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="salle-welcome-title"
      aria-describedby="salle-welcome-desc"
    >
      <div
        className="salle-welcome-backdrop fixed inset-0 bg-black/90 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* min-h-full + flex center keeps short content centered; tall content
          scrolls from the top instead of clipping under the viewport edge. */}
      <div className="relative z-10 flex min-h-full items-center justify-center py-4">
      <div
        className="salle-sign-popup w-full max-w-[380px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="salle-sign-glow" aria-hidden="true" />

        <div className="salle-sign-popup-body">
          <div className="salle-sign-popup-scroll">
            <Image
              src="/images/salle-darmes-sign.jpg"
              alt="Salle d'Armes — The Open Source Barware Live Demo"
              width={832}
              height={1248}
              priority
              className="salle-sign-popup-img"
            />
          </div>

          {/* Clean entry — no feature button grid. The Salle opens directly to the working admin panel (home base with your metrics, variance, and quick paths). All the power tools live in the sidebar Settings. */}

          <div className="sr-only" id="salle-welcome-desc">
            Salle d&apos;Armes — The Open Source Barware Live Demo. Opens to the real working admin panel (Home base). Your demo bar is pre-mapped so you can click around the metrics, in-house view, and quick links immediately. This is exactly what the program looks like week after week after you finish your first setup. All advanced tools are in Settings. House Rules: {HOUSE_RULES.join("; ")}. Demo data only.
          </div>

          <div className="salle-sign-popup-actions">
            <p className="salle-sign-popup-quip" id="salle-welcome-title">
              Welcome to Salle d&apos;Armes — The Open Source Barware Live Demo. This is the live admin panel you&apos;ll use after your bar is mapped — totals, variance, quick paths, everything in one calm home base.
              <br />
              <span style={{ fontSize: '11px', opacity: 0.8 }}>
                First time? In the real program a quick voice walk sets up your stations in minutes. Here the demo bar is ready — just click around and play.
              </span>
            </p>
            <AppButton
              onClick={enterSalle}
              disabled={entering}
              className="salle-sign-popup-btn w-full"
            >
              {entering ? "Opening the home base..." : "Enter the Home Base"}
            </AppButton>
            <button
              type="button"
              onClick={onClose}
              className="salle-sign-popup-dismiss"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}