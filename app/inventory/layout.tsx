"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Gear, Rivet, CocktailIcon } from "@/components/SteampunkElements";

const NAV_ITEMS = [
  {
    href: "/inventory",
    label: "Dashboard",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <rect x="1" y="1" width="7" height="7" rx="1" />
        <rect x="10" y="1" width="7" height="4" rx="1" />
        <rect x="1" y="10" width="7" height="4" rx="1" />
        <rect x="10" y="7" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/inventory/count",
    label: "New Count",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <path d="M9 2v14M2 9h14" />
        <rect x="3" y="3" width="12" height="12" rx="2" />
      </svg>
    ),
  },
  {
    href: "/inventory/history",
    label: "History",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <circle cx="9" cy="9" r="7" />
        <path d="M9 5v4l3 2" />
      </svg>
    ),
  },
  {
    href: "/inventory/settings",
    label: "Settings",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <circle cx="9" cy="9" r="2.5" />
        <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.3 3.3l1.4 1.4M13.3 13.3l1.4 1.4M3.3 14.7l1.4-1.4M13.3 4.7l1.4-1.4" />
      </svg>
    ),
  },
];

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      {/* ── Sidebar (desktop: always visible, mobile: overlay) ── */}

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 lg:top-[73px] left-0 z-50 lg:z-auto
          w-64 h-full lg:h-[calc(100vh-73px)]
          bg-bg-panel border-r border-gear-border
          flex flex-col
          transition-transform duration-300 lg:transition-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar top decoration */}
        <div className="relative px-5 pt-5 pb-4 border-b border-gear-border">
          {/* Corner rivets */}
          <div className="absolute top-2 left-2">
            <Rivet />
          </div>
          <div className="absolute top-2 right-2">
            <Rivet />
          </div>

          <div className="flex items-center gap-3">
            <CocktailIcon className="w-8 h-8 shrink-0" />
            <div className="min-w-0">
              <h2 className="font-serif text-sm copper-text leading-tight truncate">
                Open Source Barware
              </h2>
              <span className="text-[9px] text-text-light uppercase tracking-[0.2em]">
                Inventory
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/inventory"
                ? pathname === "/inventory"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 text-sm tracking-wide transition-all group relative
                  ${
                    isActive
                      ? "text-copper bg-copper/10 border-l-2 border-copper"
                      : "text-text-muted hover:text-copper hover:bg-copper/5 border-l-2 border-transparent"
                  }
                `}
              >
                <span
                  className={`shrink-0 ${isActive ? "text-copper" : "text-text-light group-hover:text-copper"}`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar bottom decoration */}
        <div className="relative px-5 py-4 border-t border-gear-border">
          <div className="absolute bottom-2 left-2">
            <Rivet />
          </div>
          <div className="absolute bottom-2 right-2">
            <Rivet />
          </div>

          {/* Decorative gear */}
          <div className="flex justify-center opacity-30">
            <Gear size={40} className="gear-spin-slow text-copper" />
          </div>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-[73px] z-30 bg-bg-warm/95 backdrop-blur-sm border-b border-gear-border px-4 lg:px-6 py-3 flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-copper p-1"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 6h16M3 11h16M3 16h16" />
            </svg>
          </button>

          <h1 className="font-serif text-base lg:text-lg copper-text truncate">
            Open Source Barware{" "}
            <span className="text-text-light font-sans text-xs lg:text-sm tracking-wide">
              &mdash; Inventory
            </span>
          </h1>
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
