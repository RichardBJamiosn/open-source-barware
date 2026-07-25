"use client";

import { Gear } from "@/components/SteampunkElements";
import { getDownloadLockMessage } from "@/lib/launch-gate";

export default function DownloadLockedModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="panel rivets pointer-events-auto w-full max-w-md px-8 py-8 text-center"
          style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.85)" }}
        >
          <div className="mb-4 flex justify-center text-copper">
            <Gear size={22} className="gear-spin-slow" />
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-text-light">
            Downloads locked
          </p>
          <h2 className="mt-3 font-serif text-2xl text-cream">
            Not open yet
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            {getDownloadLockMessage()} Explore the Live Demo and program
            guide while you wait.
          </p>
          <button
            onClick={onClose}
            className="mt-7 w-full bg-copper py-3.5 text-sm font-semibold tracking-wide text-bg transition-all hover:bg-copper-bright"
          >
            Keep exploring
          </button>
        </div>
      </div>
    </>
  );
}