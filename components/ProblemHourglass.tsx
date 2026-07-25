"use client";

import { useSyncExternalStore, type CSSProperties } from "react";

/**
 * Problem section hourglass — looping video (OSBW HourGlass.mp4).
 * Falls back to the still PNG when prefers-reduced-motion is on.
 * Layout/glow/offset match the original static landing-hourglass treatment.
 */

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
}

const mediaClassName =
  "relative z-10 block h-auto w-full max-w-[300px] object-center brightness-[1.04] contrast-[1.06] saturate-[1.04] md:max-w-[340px]";

const maskStyle: CSSProperties = {
  WebkitMaskImage:
    "radial-gradient(ellipse 72% 68% at 50% 46%, #000 52%, transparent 100%)",
  maskImage:
    "radial-gradient(ellipse 72% 68% at 50% 46%, #000 52%, transparent 100%)",
};

export default function ProblemHourglass() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="relative flex w-full max-w-[320px] translate-x-[13%] flex-col items-center justify-center md:max-w-[360px]"
    >
      {/* Warm lantern glow — follows hourglass offset */}
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-[130%] w-[150%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 50% 48% at 50% 44%, rgba(168,120,79,0.22) 0%, rgba(0,0,0,0) 68%), radial-gradient(ellipse 42% 28% at 50% 78%, rgba(190,140,86,0.18) 0%, rgba(0,0,0,0) 72%)",
        }}
      />

      {reduceMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/landing-hourglass.png"
          alt=""
          width={398}
          height={386}
          className={mediaClassName}
          style={maskStyle}
        />
      ) : (
        <video
          className={mediaClassName}
          style={maskStyle}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/landing-hourglass.png"
          width={398}
          height={386}
        >
          <source src="/videos/osbw-hourglass.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
