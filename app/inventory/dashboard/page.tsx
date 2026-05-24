'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ── Types ──
interface Bottle {
  id: string;
  name: string;
  category: string;
  currentLevel: number; // 0.0 - 1.0
  parLevel: number;     // 0.0 - 1.0
  size: string;         // e.g. "750ml", "1L"
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

interface InventoryCount {
  id: string;
  date: string;
  entries: CountEntry[];
}

interface CountEntry {
  bottleId: string;
  bottleName: string;
  stationId: string;
  previousLevel: number;
  countedLevel: number;
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

function saveBar(bar: Bar): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_PREFIX}bar`, JSON.stringify(bar));
}

function getCounts(): InventoryCount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}counts`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ── Station type icons ──
function StationIcon({ type }: { type: Station['type'] }) {
  const icons: Record<Station['type'], string> = {
    well: '\u2693',       // anchor
    'back-bar': '\u2728', // sparkles
    service: '\u2615',    // coffee/service
    storage: '\u{1F4E6}', // package
    beer: '\u{1F37A}',    // beer
    wine: '\u{1F377}',    // wine
  };
  return <span className="text-lg">{icons[type] || '\u{1F37E}'}</span>;
}

// ── Level color logic ──
function getLevelStatus(current: number, par: number): 'good' | 'warning' | 'critical' {
  if (current > par) return 'good';
  if (current >= par * 0.8) return 'warning';
  return 'critical';
}

function getLevelColor(status: 'good' | 'warning' | 'critical') {
  switch (status) {
    case 'good': return { bar: 'bg-patina-light', text: 'text-patina-light', border: 'border-patina/40' };
    case 'warning': return { bar: 'bg-copper', text: 'text-copper', border: 'border-copper/40' };
    case 'critical': return { bar: 'bg-wine-glow', text: 'text-wine-glow', border: 'border-wine/40' };
  }
}

// ── Bottle gauge bar ──
function BottleGauge({ current, par }: { current: number; par: number }) {
  const status = getLevelStatus(current, par);
  const colors = getLevelColor(status);
  const pct = Math.min(Math.max(current * 100, 0), 100);

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex-1 h-3 rounded-full bg-bg-warm border border-gear-border overflow-hidden relative">
        {/* Par level marker */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-text-light/40 z-10"
          style={{ left: `${par * 100}%` }}
          title={`Par: ${(par * 10).toFixed(0)}/10`}
        />
        {/* Fill */}
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
          style={{
            width: `${pct}%`,
            background: status === 'good'
              ? 'linear-gradient(90deg, var(--patina) 0%, var(--patina-light) 100%)'
              : status === 'warning'
              ? 'linear-gradient(90deg, var(--copper-dark) 0%, var(--copper-bright) 100%)'
              : 'linear-gradient(90deg, var(--wine) 0%, var(--wine-glow) 100%)',
          }}
        />
      </div>
      <span className={`text-xs font-mono w-8 text-right ${colors.text}`}>
        {current.toFixed(1)}
      </span>
    </div>
  );
}

// ── Category badge ──
function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block text-[10px] tracking-wider uppercase px-2 py-0.5 border border-copper/30 rounded-full text-copper whitespace-nowrap">
      {category}
    </span>
  );
}

// ── Demo data seeder ──
function seedDemoBar(): Bar {
  const demo: Bar = {
    id: 'bar-1',
    name: 'Main Bar',
    lastCountDate: new Date().toISOString().split('T')[0],
    stations: [
      {
        id: 'well-1',
        name: 'Well 1',
        type: 'well',
        bottles: [
          { id: 'b1', name: "Tito's Vodka", category: 'Vodka', currentLevel: 0.6, parLevel: 0.5, size: '1L', costPerBottle: 18 },
          { id: 'b2', name: 'Tanqueray Gin', category: 'Gin', currentLevel: 0.3, parLevel: 0.5, size: '1L', costPerBottle: 22 },
          { id: 'b3', name: 'Bacardi Silver', category: 'Rum', currentLevel: 0.1, parLevel: 0.4, size: '1L', costPerBottle: 14 },
          { id: 'b4', name: 'Jim Beam', category: 'Bourbon', currentLevel: 0.7, parLevel: 0.5, size: '1L', costPerBottle: 16 },
          { id: 'b5', name: 'Jose Cuervo', category: 'Tequila', currentLevel: 0.4, parLevel: 0.5, size: '1L', costPerBottle: 19 },
        ],
      },
      {
        id: 'well-2',
        name: 'Well 2',
        type: 'well',
        bottles: [
          { id: 'b6', name: 'Stolichnaya', category: 'Vodka', currentLevel: 0.2, parLevel: 0.5, size: '1L', costPerBottle: 17 },
          { id: 'b7', name: 'Jameson', category: 'Whiskey', currentLevel: 0.8, parLevel: 0.5, size: '750ml', costPerBottle: 24 },
          { id: 'b8', name: 'Captain Morgan', category: 'Rum', currentLevel: 0.5, parLevel: 0.5, size: '1L', costPerBottle: 15 },
        ],
      },
      {
        id: 'back-1',
        name: 'Back Bar - Top Shelf',
        type: 'back-bar',
        bottles: [
          { id: 'b9', name: 'Grey Goose', category: 'Vodka', currentLevel: 0.9, parLevel: 0.4, size: '750ml', costPerBottle: 32 },
          { id: 'b10', name: 'Hendricks Gin', category: 'Gin', currentLevel: 0.5, parLevel: 0.4, size: '750ml', costPerBottle: 34 },
          { id: 'b11', name: 'Patron Silver', category: 'Tequila', currentLevel: 0.3, parLevel: 0.4, size: '750ml', costPerBottle: 42 },
          { id: 'b12', name: 'Woodford Reserve', category: 'Bourbon', currentLevel: 0.6, parLevel: 0.4, size: '750ml', costPerBottle: 36 },
          { id: 'b13', name: 'Macallan 12', category: 'Scotch', currentLevel: 0.2, parLevel: 0.3, size: '750ml', costPerBottle: 58 },
          { id: 'b14', name: 'Clase Azul', category: 'Tequila', currentLevel: 0.7, parLevel: 0.3, size: '750ml', costPerBottle: 120 },
        ],
      },
      {
        id: 'service-1',
        name: 'Service Bar',
        type: 'service',
        bottles: [
          { id: 'b15', name: 'Triple Sec', category: 'Liqueur', currentLevel: 0.4, parLevel: 0.5, size: '1L', costPerBottle: 9 },
          { id: 'b16', name: 'Kahlua', category: 'Liqueur', currentLevel: 0.6, parLevel: 0.4, size: '750ml', costPerBottle: 22 },
          { id: 'b17', name: 'Baileys', category: 'Liqueur', currentLevel: 0.1, parLevel: 0.4, size: '750ml', costPerBottle: 26 },
          { id: 'b18', name: 'Campari', category: 'Amaro', currentLevel: 0.8, parLevel: 0.3, size: '750ml', costPerBottle: 28 },
        ],
      },
      {
        id: 'storage-1',
        name: 'Back Storage',
        type: 'storage',
        bottles: [
          { id: 'b19', name: "Tito's Vodka (backup)", category: 'Vodka', currentLevel: 1.0, parLevel: 0.5, size: '1L', costPerBottle: 18 },
          { id: 'b20', name: 'Tanqueray Gin (backup)', category: 'Gin', currentLevel: 1.0, parLevel: 0.5, size: '1L', costPerBottle: 22 },
          { id: 'b21', name: 'Bacardi Silver (backup)', category: 'Rum', currentLevel: 1.0, parLevel: 0.5, size: '1L', costPerBottle: 14 },
        ],
      },
    ],
  };
  saveBar(demo);
  return demo;
}

// ── Main Dashboard ──
export default function DashboardPage() {
  const [bar, setBar] = useState<Bar | null>(null);
  const [expandedStations, setExpandedStations] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let loaded = getBar();
    if (!loaded) {
      loaded = seedDemoBar();
    }
    setBar(loaded);
    // Expand first station by default on mobile
    if (loaded.stations.length > 0) {
      setExpandedStations(new Set([loaded.stations[0].id]));
    }
  }, []);

  if (!mounted || !bar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted animate-pulse">Loading inventory...</div>
      </div>
    );
  }

  // ── Stats calculations ──
  const allBottles = bar.stations.flatMap((s) => s.bottles);
  const totalProducts = allBottles.length;
  const totalValue = allBottles.reduce((sum, b) => sum + b.costPerBottle * b.currentLevel, 0);
  const belowPar = allBottles.filter((b) => b.currentLevel < b.parLevel).length;
  const lastCount = bar.lastCountDate
    ? new Date(bar.lastCountDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Never';

  const toggleStation = (id: string) => {
    setExpandedStations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="glow-dot" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-patina-light font-medium">
              Inventory Dashboard
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl copper-text">{bar.name}</h1>
        </div>

        {/* ── Quick Actions ── */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/inventory/count"
            className="bg-copper hover:bg-copper-bright text-bg font-semibold px-5 py-2.5 text-sm tracking-wide transition-all hover:shadow-[0_0_20px_rgba(205,127,50,0.3)]"
          >
            Start Count
          </Link>
          <button
            onClick={() => {
              const name = prompt('Product name:');
              if (!name) return;
              const category = prompt('Category (e.g. Vodka, Gin, Rum):') || 'Other';
              const stationId = bar.stations[0]?.id;
              if (!stationId) return;
              const newBottle: Bottle = {
                id: `b-${Date.now()}`,
                name,
                category,
                currentLevel: 1.0,
                parLevel: 0.5,
                size: '750ml',
                costPerBottle: 20,
              };
              const updated = {
                ...bar,
                stations: bar.stations.map((s) =>
                  s.id === stationId ? { ...s, bottles: [...s.bottles, newBottle] } : s
                ),
              };
              saveBar(updated);
              setBar(updated);
            }}
            className="border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-5 py-2.5 text-sm tracking-wide transition-all"
          >
            Add Product
          </button>
          <Link
            href="/inventory/history"
            className="border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-5 py-2.5 text-sm tracking-wide transition-all"
          >
            View History
          </Link>
        </div>
      </div>

      {/* ── Overview Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <StatCard label="Total Products" value={String(totalProducts)} icon={<BottleSvg />} />
        <StatCard label="Est. Value" value={`$${totalValue.toFixed(0)}`} icon={<DollarSvg />} />
        <StatCard
          label="Below Par"
          value={String(belowPar)}
          icon={<AlertSvg />}
          accent={belowPar > 0 ? 'critical' : 'good'}
        />
        <StatCard label="Last Count" value={lastCount} icon={<CalendarSvg />} />
      </div>

      {/* ── Station Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {bar.stations.map((station) => {
          const isExpanded = expandedStations.has(station.id);
          const stationBelowPar = station.bottles.filter((b) => b.currentLevel < b.parLevel).length;

          return (
            <div key={station.id} className="panel rounded-sm relative rivets overflow-hidden">
              {/* Station header */}
              <button
                onClick={() => toggleStation(station.id)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-bg-warm/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StationIcon type={station.type} />
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg text-cream truncate">{station.name}</h3>
                    <p className="text-xs text-text-light">
                      {station.bottles.length} bottle{station.bottles.length !== 1 ? 's' : ''}
                      {stationBelowPar > 0 && (
                        <span className="text-wine-glow ml-2">
                          {stationBelowPar} below par
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className={`text-text-light transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                >
                  <path d="M5 8l5 5 5-5" />
                </svg>
              </button>

              {/* Expanded bottle list */}
              {isExpanded && (
                <div className="border-t border-gear-border">
                  {station.bottles.map((bottle, i) => {
                    const status = getLevelStatus(bottle.currentLevel, bottle.parLevel);
                    return (
                      <div
                        key={bottle.id}
                        className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 ${
                          i < station.bottles.length - 1 ? 'border-b border-gear-border/50' : ''
                        } ${status === 'critical' ? 'bg-wine/5' : ''}`}
                      >
                        {/* Name + category */}
                        <div className="flex items-center gap-2 sm:w-2/5 min-w-0">
                          <div
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              status === 'good'
                                ? 'bg-patina-light'
                                : status === 'warning'
                                ? 'bg-copper'
                                : 'bg-wine-glow'
                            }`}
                          />
                          <span className="text-sm text-cream truncate">{bottle.name}</span>
                          <CategoryBadge category={bottle.category} />
                        </div>

                        {/* Gauge */}
                        <div className="sm:w-3/5">
                          <BottleGauge current={bottle.currentLevel} par={bottle.parLevel} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Empty state ── */}
      {bar.stations.length === 0 && (
        <div className="panel rounded-sm p-12 text-center">
          <p className="text-text-muted mb-4">No stations configured yet.</p>
          <button
            onClick={() => {
              const name = prompt('Station name (e.g. Well 1, Back Bar):');
              if (!name) return;
              const updated = {
                ...bar,
                stations: [
                  ...bar.stations,
                  { id: `s-${Date.now()}`, name, type: 'well' as const, bottles: [] },
                ],
              };
              saveBar(updated);
              setBar(updated);
            }}
            className="bg-copper hover:bg-copper-bright text-bg font-semibold px-6 py-2.5 text-sm tracking-wide transition-all"
          >
            Add First Station
          </button>
        </div>
      )}
    </div>
  );
}

// ── Stat Card ──
function StatCard({
  label,
  value,
  icon,
  accent = 'neutral',
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: 'good' | 'critical' | 'neutral';
}) {
  const accentBorder =
    accent === 'critical' ? 'border-wine/40' : accent === 'good' ? 'border-patina/40' : 'border-gear-border';

  return (
    <div className={`panel rounded-sm p-4 sm:p-5 ${accentBorder}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] tracking-[0.2em] uppercase text-text-light">{label}</span>
        <div className="opacity-50">{icon}</div>
      </div>
      <div
        className={`font-serif text-2xl sm:text-3xl ${
          accent === 'critical' ? 'text-wine-glow' : accent === 'good' ? 'text-patina-light' : 'copper-text'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

// ── Inline SVG icons ──
function BottleSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 32 48" fill="none" className="w-5 h-5">
      <rect x="12" y="2" width="8" height="6" rx="1" stroke="var(--copper)" strokeWidth="1" />
      <path d="M13 8L10 16v26a2 2 0 002 2h8a2 2 0 002-2V16l-3-8H13z" stroke="var(--copper)" strokeWidth="1.5" />
    </svg>
  );
}

function DollarSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

function AlertSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 9v4M12 17h.01M10.29 3.86l-8.6 14.86A2 2 0 003.43 22h17.14a2 2 0 001.74-3.28l-8.6-14.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}

function CalendarSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--copper)" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
