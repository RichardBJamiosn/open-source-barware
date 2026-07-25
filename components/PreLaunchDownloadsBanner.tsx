"use client";

import { useSearchParams } from "next/navigation";
import { areDownloadsUnlocked, getDownloadLockMessage } from "@/lib/launch-gate";
import { useLaunchNow } from "@/lib/use-launch-now";

export default function PreLaunchDownloadsBanner() {
  const searchParams = useSearchParams();
  const now = useLaunchNow();
  const previewParam =
    searchParams.get("preview") === "july4" ||
    searchParams.get("july4") === "1";
  const downloadsUnlocked = areDownloadsUnlocked(now, { preview: previewParam });

  if (downloadsUnlocked) {
    return null;
  }

  return (
    <div className="border-b border-copper/30 bg-copper/10">
      <div className="mx-auto max-w-6xl px-6 py-4 text-center text-sm leading-relaxed text-cream">
        <span className="font-semibold text-copper-bright">Explore freely.</span>{" "}
        {getDownloadLockMessage()} Read the guide, tour the Live Demo, and
        join the release list on the download page.
      </div>
    </div>
  );
}
