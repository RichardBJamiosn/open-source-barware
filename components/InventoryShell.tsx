"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState, useSyncExternalStore } from "react";
import DojoWelcomeModal from "@/components/DojoWelcomeModal";
import SidebarNavIcon from "@/components/dojo/SidebarNavIcon";
import { CocktailIcon } from "@/components/SteampunkElements";
import { cycleLabelText } from "@/lib/dojo-admin";
import {
  hasSeenDojoWelcome,
  markDojoWelcomeSeen,
  seedDojoPlayground,
  subscribeDojoWelcome,
} from "@/lib/dojo";
import { getBar, getInventorySettings } from "@/lib/inventory-store";

const NAV_ITEMS = [
  {
    href: "/inventory/dashboard",
    label: "Dashboard",
    desc: "Cycle pulse & metrics",
    icon: "dashboard" as const,
  },
  {
    href: "/inventory/spreadsheets",
    label: "Spreadsheets",
    desc: "PARs, variance, orders — live",
    icon: "spreadsheets" as const,
  },
  {
    href: "/inventory/analytics",
    label: "Analytics",
    desc: "Cost %, movers, trends",
    icon: "analytics" as const,
  },
  {
    href: "/inventory/inhouse",
    label: "In-house inventory",
    desc: "What's on the shelf",
    icon: "inhouse" as const,
  },
  {
    href: "/inventory/inputs",
    label: "Weekly inputs",
    desc: "POS · invoices · next count",
    icon: "inputs" as const,
  },
  {
    href: "/inventory/staff",
    label: "Employee communications",
    desc: "Inventory notes · manager uploads",
    icon: "staff" as const,
  },
  {
    href: "/inventory/settings",
    label: "Settings",
    desc: "Venues, people, V1.5 tools",
    icon: "settings" as const,
  },
];

function useHydrated() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
}

function useNeedsWelcome() {
  return useSyncExternalStore(
    subscribeDojoWelcome,
    () => !hasSeenDojoWelcome(),
    () => true
  );
}

export default function InventoryShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const needsWelcome = useNeedsWelcome();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bar = hydrated ? getBar() : null;
  const settings = hydrated ? getInventorySettings() : null;
  const cycleText = settings ? cycleLabelText(settings) : "Inventory cycle";

  const finishWelcome = useCallback(() => {
    seedDojoPlayground();
    markDojoWelcomeSeen();
    if (pathname === "/inventory") {
      router.push("/inventory/dashboard");
    }
  }, [pathname, router]);

  const handleAddBar = () => {
    window.alert(
      "In the downloaded program, + Add another bar starts caterpillar setup for a new bar map. This sandbox keeps one demo bar — download the program to build your own."
    );
  };

  return (
    <div className="admin-shell flex min-h-[calc(100vh-73px)] flex-col">
      <DojoWelcomeModal open={hydrated && needsWelcome} onClose={finishWelcome} />

      <div className="dojo-demo-ribbon">
        THE OPEN SOURCE BAR PROGRAM • SALLE D&apos;ARMES SANDBOX — same home base as the download
      </div>

      <div className="flex flex-1 min-h-0">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
          admin-sidebar fixed lg:sticky top-[73px] lg:top-0 left-0 z-50 lg:z-auto
          h-[calc(100vh-73px)] lg:min-h-[calc(100vh-73px)]
          flex flex-col shrink-0
          transition-transform duration-300 lg:transition-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="sidebar-glow" aria-hidden="true" />

          <div className="sidebar-brand relative z-10">
            <div className="sidebar-mark">
              <CocktailIcon size={32} />
              <span className="sidebar-mark-label">OSB</span>
            </div>
            <p className="sidebar-welcome">Home base</p>
            <p className="sidebar-business-name">Your Bar 1 <span className="text-[10px] opacity-60">| SANDBOX</span></p>

            <label htmlFor="dojoBarSwitcher" className="sidebar-bar-label">
              Active bar
            </label>
            <select
              id="dojoBarSwitcher"
              className="dojo-bar-switcher bar-switcher"
              value={bar?.id ?? ""}
              onChange={() => undefined}
            >
              {bar ? (
                <option value={bar.id}>Your Bar 1</option>
              ) : (
                <option value="">No bar loaded</option>
              )}
            </select>
            <div className="sidebar-cycle-chip">{cycleText}</div>
          </div>

          <nav className="sidebar-nav flex-1 overflow-y-auto relative z-10" aria-label="Admin navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`sidebar-link${isActive ? " active" : ""}`}
                >
                  <SidebarNavIcon name={item.icon} />
                  <span className="sidebar-link-text">
                    <strong>{item.label}</strong>
                    <small>{item.desc}</small>
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-foot relative z-10">
            <button
              type="button"
              onClick={handleAddBar}
              className="sidebar-add-bar"
            >
              + Add another bar
            </button>
            <p className="sidebar-foot-tag">Home base</p>
            <p className="sidebar-foot-hint">
              Your numbers update every time you Process a count.
            </p>
            <Link href="/" className="sidebar-exit-link">
              ← Back to opensourcebarware.com
            </Link>
          </div>
        </aside>

        <div className="admin-main flex-1 flex flex-col min-w-0">
          <div className="admin-mobile-bar lg:hidden">
            <button
              className="admin-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 6h16M3 11h16M3 16h16" />
              </svg>
            </button>
            <span className="admin-mobile-title">Salle d&apos;Armes — Live Demo</span>
            <span className="salle-sandbox-pill">Sandbox</span>
          </div>

          <div className="admin-main-inner flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}