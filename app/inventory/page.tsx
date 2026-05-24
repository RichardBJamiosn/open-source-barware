"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasInventoryData } from "@/lib/inventory-store";
import { AppButton, AppPanel } from "@/components/AppUI";
import { Gear, BottleIcon, SteamPuffs } from "@/components/SteampunkElements";

export default function InventoryPage() {
  const router = useRouter();
  const [hasData, setHasData] = useState<boolean | null>(null);

  useEffect(() => {
    setHasData(hasInventoryData());
  }, []);

  // Loading state while checking localStorage
  if (hasData === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Gear size={48} className="gear-spin text-copper" />
      </div>
    );
  }

  // Has existing data: show dashboard summary
  if (hasData) {
    return <DashboardRedirect />;
  }

  // No data: welcome screen
  return <WelcomeScreen onStart={() => router.push("/inventory/setup")} />;
}

// ── Dashboard placeholder (shown when data exists) ──

function DashboardRedirect() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl copper-text">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AppPanel>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-copper/15 flex items-center justify-center">
              <BottleIcon className="w-4 h-6" />
            </div>
            <span className="text-xs uppercase tracking-[0.15em] text-text-muted">
              Total Bottles
            </span>
          </div>
          <p className="stat-number copper-text">--</p>
        </AppPanel>

        <AppPanel>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-patina/15 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="var(--patina-light)"
                strokeWidth="1.3"
              >
                <circle cx="8" cy="8" r="6" />
                <path d="M8 4v4l3 2" />
              </svg>
            </div>
            <span className="text-xs uppercase tracking-[0.15em] text-text-muted">
              Last Count
            </span>
          </div>
          <p className="text-lg text-text">No counts yet</p>
        </AppPanel>

        <AppPanel>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-wine/15 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="var(--wine-glow)"
                strokeWidth="1.3"
              >
                <path d="M2 14l4-6V2h4v6l4 6" />
                <path d="M3 14h10" />
              </svg>
            </div>
            <span className="text-xs uppercase tracking-[0.15em] text-text-muted">
              Below Par
            </span>
          </div>
          <p className="stat-number copper-text">--</p>
        </AppPanel>
      </div>

      <AppPanel className="text-center py-12">
        <p className="text-text-muted mb-2">
          Dashboard will populate with live data as you add counts.
        </p>
        <p className="text-text-light text-sm">
          Start a new count or add bottles to your stations.
        </p>
      </AppPanel>
    </div>
  );
}

// ── Welcome screen (no data yet) ──

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[65vh]">
      <div className="relative max-w-lg w-full">
        {/* Background accent image */}
        <div
          className="absolute inset-0 -m-8 opacity-10 bg-cover bg-center blur-sm pointer-events-none"
          style={{ backgroundImage: "url(/images/copper-glass.png)" }}
        />

        {/* Decorative gears */}
        <div className="absolute -top-8 -right-6 opacity-20">
          <Gear size={80} className="gear-spin text-copper" />
        </div>
        <div className="absolute -bottom-6 -left-4 opacity-15">
          <Gear size={60} className="gear-spin-reverse text-brass" />
        </div>

        {/* Steam */}
        <SteamPuffs className="top-0 right-12" />

        <AppPanel className="relative text-center py-12 px-8">
          <div className="mb-6">
            <BottleIcon className="mx-auto w-12 h-16 opacity-60" />
          </div>

          <h2 className="font-serif text-3xl lg:text-4xl copper-text mb-4">
            Welcome to Inventory
          </h2>

          <p className="text-text-muted max-w-sm mx-auto mb-2 leading-relaxed">
            Set up your bar, define your stations, and start counting. Free,
            open source, no sign-up required.
          </p>

          <p className="text-text-light text-sm mb-8">
            All data stays in your browser &mdash; nothing leaves this machine.
          </p>

          <AppButton onClick={onStart} className="text-base px-10 py-4">
            Set Up Your Bar
          </AppButton>

          <div className="mt-8 flex items-center justify-center gap-6 text-[11px] text-text-light uppercase tracking-[0.15em]">
            <span className="flex items-center gap-1.5">
              <div className="glow-dot" />
              Local Storage
            </span>
            <span className="w-px h-3 bg-gear-border" />
            <span>No Account</span>
            <span className="w-px h-3 bg-gear-border" />
            <span>100% Free</span>
          </div>
        </AppPanel>
      </div>
    </div>
  );
}
