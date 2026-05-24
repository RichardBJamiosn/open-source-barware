'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ── Types ──
interface Bottle {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  parLevel: number;
  size: string;
  costPerBottle: number;
}

interface Station {
  id: string;
  name: string;
  type: 'well' | 'back-bar' | 'service' | 'storage' | 'beer' | 'wine';
  bottles: Bottle[];
}

interface Bar {
  id: string;
  name: string;
  stations: Station[];
  lastCountDate: string | null;
}

interface CountEntry {
  bottleId: string;
  bottleName: string;
  stationId: string;
  previousLevel: number;
  countedLevel: number;
}

interface InventoryCount {
  id: string;
  date: string;
  entries: CountEntry[];
}

// ── LocalStorage helpers ──
const STORAGE_PREFIX = 'osb_';

function getBar(): Bar | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}bar`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function getCounts(): InventoryCount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}counts`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ── Variance helpers ──
function getVarianceClass(prev: number, current: number): string {
  const diff = current - prev;
  if (Math.abs(diff) < 0.05) return 'text-text-light'; // No significant change
  if (diff > 0.3) return 'text-patina-light';           // Large increase (restock)
  if (diff > 0) return 'text-patina';                    // Small increase
  if (diff < -0.3) return 'text-wine-glow';              // Large decrease (flag)
  return 'text-copper';                                   // Normal decrease
}

function formatVariance(prev: number, current: number): string {
  const diff = current - prev;
  if (Math.abs(diff) < 0.01) return '--';
  const sign = diff > 0 ? '+' : '';
  return `${sign}${diff.toFixed(1)}`;
}

// ── Main History Page ──
export default function HistoryPage() {
  const [counts, setCounts] = useState<InventoryCount[]>([]);
  const [bar, setBar] = useState<Bar | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCounts(getCounts());
    setBar(getBar());
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-2">
        <Link href="/inventory/dashboard" className="text-text-light hover:text-copper transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </Link>
        <div className="glow-dot" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-patina-light font-medium">
          Count History
        </span>
      </div>
      <h1 className="font-serif text-2xl sm:text-3xl copper-text mb-6">Count History</h1>

      {counts.length === 0 ? (
        <div className="panel rounded-sm p-8 sm:p-12 text-center rivets">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 opacity-40">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="var(--copper)" strokeWidth="1.5" />
            <path d="M16 2v4M8 2v4M3 10h18" stroke="var(--copper)" strokeWidth="1.5" />
          </svg>
          <p className="text-text-muted mb-4">No counts recorded yet.</p>
          <Link
            href="/inventory/count"
            className="inline-block bg-copper hover:bg-copper-bright text-bg font-semibold px-6 py-2.5 text-sm tracking-wide transition-all"
          >
            Start Your First Count
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {counts.map((count, countIdx) => {
            const date = new Date(count.date);
            const dateStr = date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const timeStr = date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            });
            const isExpanded = expandedId === count.id;

            // Stats for this count
            const totalEntries = count.entries.length;
            const significantChanges = count.entries.filter(
              (e) => Math.abs(e.countedLevel - e.previousLevel) > 0.2
            ).length;

            // Compare with next (older) count if available
            const prevCount = countIdx < counts.length - 1 ? counts[countIdx + 1] : null;

            return (
              <div key={count.id} className="panel rounded-sm overflow-hidden">
                {/* Count header row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : count.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-bg-warm/30 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-sm text-cream font-medium">{dateStr}</div>
                    <div className="text-xs text-text-light mt-0.5">{timeStr}</div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-text-light">
                        {totalEntries} item{totalEntries !== 1 ? 's' : ''}
                      </div>
                      {significantChanges > 0 && (
                        <div className="text-[10px] text-copper">
                          {significantChanges} significant change{significantChanges !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={`text-text-light transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="M5 8l5 5 5-5" />
                    </svg>
                  </div>
                </button>

                {/* Expanded detail view */}
                {isExpanded && (
                  <div className="border-t border-gear-border">
                    {/* Column headers */}
                    <div className="grid grid-cols-12 gap-2 px-4 sm:px-5 py-2 text-[10px] tracking-wider uppercase text-text-light border-b border-gear-border/50">
                      <div className="col-span-5">Product</div>
                      <div className="col-span-2 text-center">Previous</div>
                      <div className="col-span-2 text-center">Counted</div>
                      <div className="col-span-3 text-center">Variance</div>
                    </div>

                    {count.entries.map((entry, i) => {
                      const varianceClass = getVarianceClass(entry.previousLevel, entry.countedLevel);
                      const variance = formatVariance(entry.previousLevel, entry.countedLevel);
                      const isSignificant = Math.abs(entry.countedLevel - entry.previousLevel) > 0.3;

                      // Find station name
                      const station = bar?.stations.find((s) => s.id === entry.stationId);

                      return (
                        <div
                          key={`${entry.bottleId}-${i}`}
                          className={`grid grid-cols-12 gap-2 items-center px-4 sm:px-5 py-2.5 ${
                            i < count.entries.length - 1 ? 'border-b border-gear-border/30' : ''
                          } ${isSignificant ? 'bg-wine/5' : ''}`}
                        >
                          <div className="col-span-5 min-w-0">
                            <div className="text-sm text-cream truncate">{entry.bottleName}</div>
                            {station && (
                              <div className="text-[10px] text-text-light truncate">{station.name}</div>
                            )}
                          </div>
                          <div className="col-span-2 text-center">
                            <LevelPill level={entry.previousLevel} />
                          </div>
                          <div className="col-span-2 text-center">
                            <LevelPill level={entry.countedLevel} />
                          </div>
                          <div className="col-span-3 text-center">
                            <span className={`text-sm font-mono ${varianceClass}`}>
                              {variance}
                            </span>
                            {isSignificant && (
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="inline-block ml-1 -mt-0.5"
                              >
                                <path
                                  d="M12 9v4M12 17h.01"
                                  stroke="var(--wine-glow)"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Compare with previous count */}
                    {prevCount && (
                      <div className="border-t border-gear-border px-4 sm:px-5 py-3 bg-bg-warm/20">
                        <div className="text-[10px] tracking-wider uppercase text-text-light mb-2">
                          vs. Previous Count ({new Date(prevCount.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                        </div>
                        <ComparisonSummary current={count} previous={prevCount} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Level pill ──
function LevelPill({ level }: { level: number }) {
  const bgColor =
    level > 0.5
      ? 'bg-patina/15 text-patina-light'
      : level > 0.25
      ? 'bg-copper/15 text-copper'
      : 'bg-wine/15 text-wine-glow';

  return (
    <span className={`inline-block text-xs font-mono px-2 py-0.5 rounded-sm ${bgColor}`}>
      {level.toFixed(1)}
    </span>
  );
}

// ── Comparison summary between two counts ──
function ComparisonSummary({ current, previous }: { current: InventoryCount; previous: InventoryCount }) {
  // Build a map of previous entries by bottleId
  const prevMap = new Map<string, CountEntry>();
  for (const entry of previous.entries) {
    prevMap.set(entry.bottleId, entry);
  }

  let increased = 0;
  let decreased = 0;
  let unchanged = 0;

  for (const entry of current.entries) {
    const prev = prevMap.get(entry.bottleId);
    if (!prev) continue;
    const diff = entry.countedLevel - prev.countedLevel;
    if (diff > 0.05) increased++;
    else if (diff < -0.05) decreased++;
    else unchanged++;
  }

  return (
    <div className="flex gap-4 text-xs">
      <div className="flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 9V3M3 5l3-3 3 3" stroke="var(--patina-light)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-patina-light">{increased} up</span>
      </div>
      <div className="flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 3v6M3 7l3 3 3-3" stroke="var(--wine-glow)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-wine-glow">{decreased} down</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-[2px] bg-text-light rounded-full" />
        <span className="text-text-light">{unchanged} same</span>
      </div>
    </div>
  );
}
