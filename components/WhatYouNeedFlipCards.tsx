"use client";

import { useEffect, useRef } from "react";

export type NeedCard = {
  item: string;
  detail: string;
  /** Front face: centered keyword stack (before flip) */
  front: Array<{ text: string; size: "base" | "lg" | "xl" }>;
};

type Props = {
  items: NeedCard[];
};

/**
 * Scroll-scrubbed rotateX flips (Resonant / flip-program pattern).
 * Front = big keywords · Back = current numbered detail layout.
 */
export default function WhatYouNeedFlipCards({ items }: Props) {
  const rootRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>(".need-flip")
    );
    if (!cards.length) return;

    const inners = cards.map((c) =>
      c.querySelector<HTMLElement>(".need-flip-inner")
    );

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      cards.forEach((card, i) => {
        card.classList.add("is-flipped");
        if (inners[i]) inners[i]!.style.transform = "rotateX(180deg)";
        const back = card.querySelector(".need-flip-face--back");
        if (back) back.setAttribute("aria-hidden", "false");
        const front = card.querySelector(".need-flip-face--front");
        if (front) front.setAttribute("aria-hidden", "true");
      });
      return;
    }

    let ticking = false;

    function clamp(n: number, min: number, max: number) {
      return Math.max(min, Math.min(max, n));
    }

    /**
     * Flip finishes at the 50% line — never still turning after mid.
     * - start: top of tile is one card-height below mid (approaching)
     * - complete: top of tile reaches mid (fully flipped as it crosses mid)
     */
    function amountFor(card: HTMLElement) {
      const rect = card.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const midLine = vh * 0.5;
      const h = Math.max(rect.height, 1);

      // Start line: one tile-height before mid
      const startY = midLine + h;
      // End line: mid-screen (done as it crosses 50%)
      const endY = midLine;

      if (rect.top > startY) return 0;
      if (rect.top <= endY) return 1;

      return clamp((startY - rect.top) / (startY - endY), 0, 1);
    }

    function update() {
      ticking = false;
      cards.forEach((card, i) => {
        const inner = inners[i];
        if (!inner) return;
        const amount = amountFor(card);
        const deg = amount * 180;
        inner.style.transform = `rotateX(${deg}deg)`;
        card.classList.toggle("is-flipped", amount >= 0.98);
        card.classList.toggle(
          "is-flipping",
          amount > 0.02 && amount < 0.98
        );
        const front = card.querySelector(".need-flip-face--front");
        const back = card.querySelector(".need-flip-face--back");
        // After half turn, back is the readable face
        if (front) front.setAttribute("aria-hidden", amount > 0.5 ? "true" : "false");
        if (back) back.setAttribute("aria-hidden", amount > 0.5 ? "false" : "true");
      });
    }

    function onScrollOrResize() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [items]);

  return (
    <ul
      ref={rootRef}
      id="what-you-need-flip"
      className="need-flip-list flex flex-col gap-5"
      style={{ perspective: "1400px" }}
    >
      {items.map((item, i) => (
        <li key={item.item} className="need-flip">
          <div className="need-flip-inner">
            {/* FRONT — keywords (shown first) */}
            <div
              className="need-flip-face need-flip-face--front panel"
              aria-hidden="false"
            >
              <div className="need-flip-keywords">
                {item.front.map((line) => (
                  <span
                    key={line.text}
                    className={
                      line.size === "xl"
                        ? "need-kw need-kw--xl"
                        : line.size === "lg"
                          ? "need-kw need-kw--lg"
                          : "need-kw need-kw--base"
                    }
                  >
                    {line.text}
                  </span>
                ))}
              </div>
            </div>

            {/* BACK — current detail layout (number circle + title + body) */}
            <div
              className="need-flip-face need-flip-face--back panel"
              aria-hidden="true"
            >
              <div className="need-flip-back-row">
                <div className="need-flip-num" aria-hidden="true">
                  <span className="font-serif text-copper text-sm">{i + 1}</span>
                </div>
                <div className="need-flip-back-copy">
                  <p className="text-cream text-sm font-semibold mb-1">
                    {item.item}
                  </p>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
