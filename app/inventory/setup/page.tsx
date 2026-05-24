'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gear, GearDivider } from '@/components/SteampunkElements';

/* ─── Types ─── */
type StationType = 'well' | 'backbar' | 'storage' | 'walk-in';

interface Station {
  id: string;
  name: string;
  type: StationType;
  order: number;
}

interface Bottle {
  id: string;
  name: string;
  stationId: string;
  size: string;
  category: string;
  parLevel: number;
}

interface Bar {
  name: string;
  stations: Station[];
  bottles: Bottle[];
}

/* ─── Storage helpers (mock until lib/inventory-store exists) ─── */
function saveBar(bar: Bar): void {
  try {
    localStorage.setItem('osb_bar', JSON.stringify(bar));
  } catch {
    // silent fail in SSR / quota exceeded
  }
}

/* ─── Utilities ─── */
let _uid = 0;
function uid(): string {
  _uid += 1;
  return `id_${Date.now()}_${_uid}`;
}

const STATION_TYPE_MAP: Record<string, StationType> = {
  well: 'well',
  backbar: 'backbar',
  back: 'backbar',
  storage: 'storage',
  dry: 'storage',
  'walk-in': 'walk-in',
  walkin: 'walk-in',
  cooler: 'walk-in',
};

function guessStationType(name: string): StationType {
  const lower = name.toLowerCase();
  for (const [keyword, type] of Object.entries(STATION_TYPE_MAP)) {
    if (lower.includes(keyword)) return type;
  }
  return 'backbar';
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  vodka: ['vodka', 'stoli', "tito's", 'titos', 'ketel', 'absolut', 'grey goose', 'smirnoff', 'belvedere', 'ciroc'],
  gin: ['gin', 'tanqueray', 'hendricks', "hendrick's", 'bombay', 'beefeater', 'aviation'],
  rum: ['rum', 'bacardi', 'captain', 'malibu', 'havana', 'kraken', 'sailor jerry', 'diplomatico'],
  tequila: ['tequila', 'patron', 'casamigos', 'don julio', 'espolon', 'hornitos', 'milagro', 'herradura', 'clase azul'],
  whiskey: ['whiskey', 'whisky', 'bourbon', 'rye', 'jack daniels', 'jameson', 'makers mark', "maker's", 'bulleit', 'woodford', 'wild turkey', 'knob creek', 'four roses', 'buffalo trace', 'eagle rare', 'crown royal'],
  scotch: ['scotch', 'glenfiddich', 'macallan', 'glenlivet', 'johnnie walker', 'dewars', 'chivas'],
  cognac: ['cognac', 'brandy', 'hennessy', 'remy martin', 'courvoisier'],
  liqueur: ['liqueur', 'amaretto', 'kahlua', 'baileys', 'chambord', 'cointreau', 'grand marnier', 'chartreuse', 'campari', 'aperol', 'st germain', 'midori', 'frangelico', 'jagermeister'],
  beer: ['beer', 'ipa', 'lager', 'ale', 'stout', 'pilsner', 'bud', 'miller', 'coors', 'heineken', 'corona', 'modelo'],
  wine: ['wine', 'cabernet', 'merlot', 'pinot', 'chardonnay', 'sauvignon', 'riesling', 'prosecco', 'champagne', 'rose'],
  mixer: ['soda', 'juice', 'tonic', 'syrup', 'grenadine', 'bitters', 'vermouth', 'club soda', 'ginger beer', 'lime juice', 'lemon juice'],
};

function guessCategory(name: string): string {
  const lower = name.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return category;
    }
  }
  return 'spirits';
}

/* ─── Default stations ─── */
const DEFAULT_STATIONS: Omit<Station, 'id'>[] = [
  { name: 'Well 1', type: 'well', order: 0 },
  { name: 'Well 2', type: 'well', order: 1 },
  { name: 'Back Bar - Top Shelf', type: 'backbar', order: 2 },
  { name: 'Back Bar - Middle', type: 'backbar', order: 3 },
  { name: 'Back Bar - Bottom', type: 'backbar', order: 4 },
  { name: 'Walk-in Cooler', type: 'walk-in', order: 5 },
  { name: 'Dry Storage', type: 'storage', order: 6 },
];

/* ─── Step indicator ─── */
const STEPS = [
  { num: 1, label: 'Name' },
  { num: 2, label: 'Map' },
  { num: 3, label: 'Walk' },
  { num: 4, label: 'Review' },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12 md:mb-16">
      {STEPS.map((step, i) => {
        const isActive = step.num === current;
        const isDone = step.num < current;
        return (
          <div key={step.num} className="flex items-center">
            {/* Node */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono
                  border-2 transition-all duration-500
                  ${isActive
                    ? 'border-copper bg-copper/20 text-copper shadow-[0_0_16px_rgba(205,127,50,0.3)]'
                    : isDone
                      ? 'border-patina bg-patina/20 text-patina-light'
                      : 'border-gear-border bg-bg-card text-text-light'
                  }
                `}
              >
                {isDone ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`text-[10px] tracking-widest uppercase mt-2 transition-colors duration-300 ${
                  isActive ? 'text-copper' : isDone ? 'text-patina-light' : 'text-text-light'
                }`}
              >
                {step.label}
              </span>
            </div>
            {/* Pipe between nodes */}
            {i < STEPS.length - 1 && (
              <div className="relative w-12 md:w-20 h-[2px] mx-1 -mt-5">
                <div className="absolute inset-0 bg-gear-border" />
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-patina to-patina-light transition-all duration-700"
                  style={{ width: isDone ? '100%' : isActive ? '50%' : '0%' }}
                />
                {/* Rivet dots on pipe */}
                <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-bg-card border border-gear-border" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Decorative gear background ─── */
function GearBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute -right-20 -top-20 text-copper opacity-[0.04]">
        <Gear size={400} className="gear-spin" />
      </div>
      <div className="absolute -left-16 bottom-[20%] text-brass opacity-[0.03]">
        <Gear size={250} className="gear-spin-reverse" />
      </div>
      <div className="absolute right-[15%] bottom-[-40px] text-copper opacity-[0.03]">
        <Gear size={180} className="gear-spin-slow" />
      </div>
    </div>
  );
}

/* ─── Panel wrapper ─── */
function WizardPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="panel rivets rounded-sm p-8 md:p-12 relative grain">
      {children}
    </div>
  );
}

/* ─── Station type badge ─── */
function StationBadge({ type }: { type: StationType }) {
  const colors: Record<StationType, string> = {
    well: 'bg-copper/15 text-copper border-copper/30',
    backbar: 'bg-brass/15 text-brass border-brass/30',
    storage: 'bg-patina/15 text-patina-light border-patina/30',
    'walk-in': 'bg-wine/20 text-wine-glow border-wine/30',
  };
  return (
    <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 border rounded-sm ${colors[type]}`}>
      {type}
    </span>
  );
}

/* ══════════════════════════════════════════
   STEP 1 — Name Your Bar
   ══════════════════════════════════════════ */
function Step1({
  barName,
  setBarName,
  onNext,
}: {
  barName: string;
  setBarName: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <WizardPanel>
      <div className="max-w-lg mx-auto text-center">
        {/* Decorative header */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-60">
              <rect x="10" y="6" width="28" height="36" rx="2" stroke="var(--copper)" strokeWidth="1.5" />
              <rect x="14" y="12" width="20" height="2" rx="1" fill="var(--copper)" opacity="0.3" />
              <rect x="14" y="18" width="16" height="2" rx="1" fill="var(--copper)" opacity="0.2" />
              <rect x="14" y="24" width="20" height="2" rx="1" fill="var(--copper)" opacity="0.3" />
              <rect x="14" y="30" width="12" height="2" rx="1" fill="var(--copper)" opacity="0.2" />
            </svg>
          </div>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl copper-text mb-3">
          Name Your Bar
        </h2>
        <p className="text-text-muted text-sm leading-relaxed mb-10 max-w-md mx-auto">
          Let&apos;s set up your inventory. This takes about 15 minutes the first time.
          After that, weekly counts take 5.
        </p>

        <div className="relative mb-8">
          <input
            type="text"
            value={barName}
            onChange={(e) => setBarName(e.target.value)}
            placeholder="e.g. The Copper Still"
            className="
              w-full bg-bg-warm border border-gear-border rounded-sm px-5 py-4
              text-cream font-serif text-xl text-center
              placeholder:text-text-light/50 placeholder:font-sans placeholder:text-base
              focus:outline-none focus:border-copper focus:shadow-[0_0_20px_rgba(205,127,50,0.15)]
              transition-all duration-300
            "
            autoFocus
          />
          {/* Decorative line below input */}
          <div className="absolute -bottom-2 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-copper/30 to-transparent" />
        </div>

        <button
          onClick={onNext}
          disabled={!barName.trim()}
          className="
            bg-copper hover:bg-copper-bright disabled:bg-bg-card disabled:text-text-light disabled:border-gear-border
            text-bg font-semibold px-10 py-3.5 text-sm tracking-wide
            transition-all duration-300 disabled:cursor-not-allowed
            hover:shadow-[0_0_30px_rgba(205,127,50,0.25)]
          "
        >
          Continue
        </button>
      </div>
    </WizardPanel>
  );
}

/* ══════════════════════════════════════════
   STEP 2 — Map Your Bar
   ══════════════════════════════════════════ */
function Step2({
  stations,
  setStations,
  onNext,
  onBack,
}: {
  stations: Station[];
  setStations: (s: Station[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<StationType>('backbar');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editingId]);

  const addStation = () => {
    if (!newName.trim()) return;
    const s: Station = {
      id: uid(),
      name: newName.trim(),
      type: newType,
      order: stations.length,
    };
    setStations([...stations, s]);
    setNewName('');
  };

  const removeStation = (id: string) => {
    setStations(stations.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i })));
  };

  const startEdit = (s: Station) => {
    setEditingId(s.id);
    setEditName(s.name);
  };

  const commitEdit = () => {
    if (editingId && editName.trim()) {
      setStations(
        stations.map((s) =>
          s.id === editingId ? { ...s, name: editName.trim(), type: guessStationType(editName.trim()) } : s
        )
      );
    }
    setEditingId(null);
  };

  const moveStation = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= stations.length) return;
    const updated = [...stations];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setStations(updated.map((s, i) => ({ ...s, order: i })));
  };

  return (
    <WizardPanel>
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl copper-text mb-2 text-center">
          Map Your Bar
        </h2>
        <p className="text-text-muted text-sm text-center mb-8">
          Add the stations and locations where your bottles live. We&apos;ve suggested common ones to start.
        </p>

        {/* Station list */}
        <div className="space-y-2 mb-8">
          {stations.map((station, i) => (
            <div
              key={station.id}
              className="
                flex items-center gap-3 bg-bg-warm border border-gear-border rounded-sm px-4 py-3
                group hover:border-copper/30 transition-colors duration-200
              "
            >
              {/* Reorder arrows */}
              <div className="flex flex-col gap-0.5 opacity-30 group-hover:opacity-70 transition-opacity">
                <button
                  onClick={() => moveStation(i, -1)}
                  disabled={i === 0}
                  className="text-text-muted hover:text-copper disabled:opacity-20 text-xs leading-none"
                  aria-label="Move up"
                >
                  &#9650;
                </button>
                <button
                  onClick={() => moveStation(i, 1)}
                  disabled={i === stations.length - 1}
                  className="text-text-muted hover:text-copper disabled:opacity-20 text-xs leading-none"
                  aria-label="Move down"
                >
                  &#9660;
                </button>
              </div>

              {/* Station name or edit input */}
              <div className="flex-1 min-w-0">
                {editingId === station.id ? (
                  <input
                    ref={editRef}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitEdit();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="bg-bg border border-copper/40 rounded-sm px-2 py-1 text-cream text-sm w-full focus:outline-none"
                  />
                ) : (
                  <button
                    onClick={() => startEdit(station)}
                    className="text-cream text-sm hover:text-copper-bright transition-colors text-left truncate w-full"
                    title="Click to rename"
                  >
                    {station.name}
                  </button>
                )}
              </div>

              <StationBadge type={station.type} />

              {/* Delete */}
              <button
                onClick={() => removeStation(station.id)}
                className="text-text-light hover:text-wine-glow transition-colors opacity-0 group-hover:opacity-100 ml-1"
                aria-label={`Remove ${station.name}`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add new station */}
        <div className="border border-dashed border-gear-border rounded-sm p-4 mb-10">
          <p className="text-[10px] tracking-widest uppercase text-text-light mb-3">
            Add a Station
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addStation();
              }}
              placeholder="Station name..."
              className="
                flex-1 bg-bg border border-gear-border rounded-sm px-3 py-2 text-sm text-cream
                placeholder:text-text-light/50 focus:outline-none focus:border-copper/50
                transition-colors
              "
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as StationType)}
              className="
                bg-bg border border-gear-border rounded-sm px-3 py-2 text-sm text-text-muted
                focus:outline-none focus:border-copper/50 transition-colors
              "
            >
              <option value="well">Well</option>
              <option value="backbar">Back Bar</option>
              <option value="storage">Storage</option>
              <option value="walk-in">Walk-in</option>
            </select>
            <button
              onClick={addStation}
              disabled={!newName.trim()}
              className="
                bg-copper/20 hover:bg-copper/30 text-copper border border-copper/30
                px-4 py-2 text-sm rounded-sm
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all
              "
            >
              + Add
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-8 py-3 text-sm tracking-wide transition-all"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={stations.length === 0}
            className="
              bg-copper hover:bg-copper-bright text-bg font-semibold px-10 py-3 text-sm tracking-wide
              transition-all hover:shadow-[0_0_30px_rgba(205,127,50,0.25)]
              disabled:bg-bg-card disabled:text-text-light disabled:cursor-not-allowed
            "
          >
            Continue
          </button>
        </div>
      </div>
    </WizardPanel>
  );
}

/* ══════════════════════════════════════════
   STEP 3 — Walk the Bar
   ══════════════════════════════════════════ */
function Step3({
  stations,
  bottles,
  setBottles,
  onNext,
  onBack,
}: {
  stations: Station[];
  bottles: Bottle[];
  setBottles: (b: Bottle[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState(false);
  const [showManual, setShowManual] = useState(false);

  // Manual add form
  const [manualName, setManualName] = useState('');
  const [manualStation, setManualStation] = useState(stations[0]?.id ?? '');
  const [manualCategory, setManualCategory] = useState('spirits');

  const parseNotes = useCallback(() => {
    if (!rawText.trim()) return;

    const lines = rawText
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const newBottles: Bottle[] = [];
    let currentStation = stations[0] ?? null;

    for (const line of lines) {
      // Check if this line is a station header
      const matchedStation = stations.find((s) => {
        const sName = s.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const lName = line.toLowerCase().replace(/[^a-z0-9]/g, '');
        // Match if the line starts with or equals the station name
        return lName.startsWith(sName) || sName.startsWith(lName) || lName.includes(sName);
      });

      if (matchedStation) {
        currentStation = matchedStation;
        // The rest of the line after the station name might have products
        const stationPattern = new RegExp(matchedStation.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const remainder = line.replace(stationPattern, '').replace(/^[\s:,\-]+/, '').trim();
        if (remainder && currentStation) {
          // Split remainder by commas or periods
          const products = remainder.split(/[,.]/).map((p) => p.trim()).filter(Boolean);
          for (const prod of products) {
            if (prod.length > 1) {
              newBottles.push({
                id: uid(),
                name: prod.replace(/^\d+\.\s*/, ''),
                stationId: currentStation.id,
                size: '750ml',
                category: guessCategory(prod),
                parLevel: 1.0,
              });
            }
          }
        }
        continue;
      }

      // This line contains products
      if (currentStation) {
        // Split by commas, periods, or "and"
        const products = line.split(/[,.]|\band\b/).map((p) => p.trim()).filter(Boolean);
        for (const prod of products) {
          if (prod.length > 1) {
            newBottles.push({
              id: uid(),
              name: prod.replace(/^\d+\.\s*/, '').replace(/:$/, ''),
              stationId: currentStation.id,
              size: '750ml',
              category: guessCategory(prod),
              parLevel: 1.0,
            });
          }
        }
      }
    }

    setBottles([...bottles, ...newBottles]);
    setParsed(true);
  }, [rawText, stations, bottles, setBottles]);

  const addManualBottle = () => {
    if (!manualName.trim() || !manualStation) return;
    const bottle: Bottle = {
      id: uid(),
      name: manualName.trim(),
      stationId: manualStation,
      size: '750ml',
      category: manualCategory,
      parLevel: 1.0,
    };
    setBottles([...bottles, bottle]);
    setManualName('');
  };

  const removeBottle = (id: string) => {
    setBottles(bottles.filter((b) => b.id !== id));
  };

  const bottlesByStation = stations.map((s) => ({
    station: s,
    bottles: bottles.filter((b) => b.stationId === s.id),
  }));

  return (
    <WizardPanel>
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl copper-text mb-2 text-center">
          Walk the Bar
        </h2>
        <p className="text-text-muted text-sm text-center mb-8 max-w-xl mx-auto">
          The fastest way to build your first inventory. Grab your phone, walk to each station, and record what you see.
        </p>

        {/* Voice notes area */}
        {!parsed ? (
          <div className="mb-8">
            {/* Instructions panel */}
            <div className="bg-bg-warm border border-gear-border rounded-sm p-5 mb-5">
              <div className="flex gap-3 items-start">
                <div className="mt-0.5">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-copper opacity-70">
                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-cream text-sm font-medium mb-2">How it works</p>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Walk to each station. Using voice notes on your phone, list every bottle.
                    Say the station name, then each product. Paste the transcription below.
                  </p>
                  <div className="mt-3 bg-bg/60 border border-gear-border/50 rounded-sm p-3">
                    <p className="text-[10px] tracking-widest uppercase text-text-light mb-2">Example</p>
                    <p className="text-text-muted text-xs leading-relaxed italic">
                      &quot;Well one: Tito&apos;s vodka, Stoli vodka, Ketel One, Tanqueray gin, Bacardi rum, Captain Morgan, Espolon tequila, Jameson whiskey.
                      Back Bar Top Shelf: Patron Silver, Don Julio 1942, Clase Azul, Hendrick&apos;s gin, Grey Goose.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste your voice notes here..."
              rows={10}
              className="
                w-full bg-bg border border-gear-border rounded-sm px-5 py-4
                text-cream text-sm leading-relaxed
                placeholder:text-text-light/40
                focus:outline-none focus:border-copper/50 focus:shadow-[0_0_20px_rgba(205,127,50,0.1)]
                transition-all duration-300 resize-y
              "
            />

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setShowManual(!showManual)}
                className="text-text-light hover:text-copper text-xs tracking-wide transition-colors"
              >
                {showManual ? 'Hide manual entry' : 'Or add bottles manually'}
              </button>
              <button
                onClick={parseNotes}
                disabled={!rawText.trim()}
                className="
                  bg-copper hover:bg-copper-bright text-bg font-semibold px-8 py-3 text-sm tracking-wide
                  transition-all hover:shadow-[0_0_30px_rgba(205,127,50,0.25)]
                  disabled:bg-bg-card disabled:text-text-light disabled:cursor-not-allowed
                  flex items-center gap-2
                "
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Parse Notes
              </button>
            </div>
          </div>
        ) : (
          /* Parsed results */
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="glow-dot" />
              <p className="text-patina-light text-sm">
                Found <span className="text-cream font-medium">{bottles.length}</span> bottles across{' '}
                <span className="text-cream font-medium">
                  {bottlesByStation.filter((g) => g.bottles.length > 0).length}
                </span>{' '}
                stations
              </p>
              <button
                onClick={() => {
                  setParsed(false);
                  setRawText('');
                }}
                className="ml-auto text-text-light hover:text-copper text-xs transition-colors"
              >
                Re-parse
              </button>
            </div>

            {/* Show parsed bottles grouped by station */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {bottlesByStation.map(({ station, bottles: stBottles }) => (
                <div key={station.id} className="bg-bg-warm border border-gear-border rounded-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-gear-border/50">
                    <div className="flex items-center gap-2">
                      <span className="text-cream text-sm font-medium">{station.name}</span>
                      <StationBadge type={station.type} />
                    </div>
                    <span className="text-text-light text-xs">
                      {stBottles.length} bottle{stBottles.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {stBottles.length > 0 ? (
                    <div className="divide-y divide-gear-border/30">
                      {stBottles.map((b) => (
                        <div key={b.id} className="flex items-center gap-3 px-4 py-2 group">
                          <span className="text-cream text-sm flex-1 truncate">{b.name}</span>
                          <span className="text-[10px] tracking-wider uppercase text-text-light">{b.category}</span>
                          <span className="text-text-light text-xs">{b.size}</span>
                          <button
                            onClick={() => removeBottle(b.id)}
                            className="text-text-light/30 hover:text-wine-glow transition-colors opacity-0 group-hover:opacity-100"
                            aria-label={`Remove ${b.name}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-text-light text-xs italic">No bottles assigned</div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowManual(!showManual)}
              className="mt-4 text-text-light hover:text-copper text-xs tracking-wide transition-colors"
            >
              {showManual ? 'Hide manual entry' : '+ Add more bottles manually'}
            </button>
          </div>
        )}

        {/* Manual entry form */}
        {showManual && (
          <div className="border border-dashed border-gear-border rounded-sm p-5 mb-8">
            <p className="text-[10px] tracking-widest uppercase text-text-light mb-4">
              Add a Bottle
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addManualBottle();
                }}
                placeholder="Product name..."
                className="
                  md:col-span-2 bg-bg border border-gear-border rounded-sm px-3 py-2 text-sm text-cream
                  placeholder:text-text-light/50 focus:outline-none focus:border-copper/50 transition-colors
                "
              />
              <select
                value={manualStation}
                onChange={(e) => setManualStation(e.target.value)}
                className="bg-bg border border-gear-border rounded-sm px-3 py-2 text-sm text-text-muted focus:outline-none focus:border-copper/50 transition-colors"
              >
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="flex-1 bg-bg border border-gear-border rounded-sm px-2 py-2 text-sm text-text-muted focus:outline-none focus:border-copper/50 transition-colors"
                >
                  <option value="spirits">Spirits</option>
                  <option value="vodka">Vodka</option>
                  <option value="gin">Gin</option>
                  <option value="rum">Rum</option>
                  <option value="tequila">Tequila</option>
                  <option value="whiskey">Whiskey</option>
                  <option value="scotch">Scotch</option>
                  <option value="cognac">Cognac</option>
                  <option value="liqueur">Liqueur</option>
                  <option value="beer">Beer</option>
                  <option value="wine">Wine</option>
                  <option value="mixer">Mixer</option>
                </select>
                <button
                  onClick={addManualBottle}
                  disabled={!manualName.trim()}
                  className="
                    bg-copper/20 hover:bg-copper/30 text-copper border border-copper/30
                    px-3 py-2 text-sm rounded-sm
                    disabled:opacity-30 disabled:cursor-not-allowed transition-all whitespace-nowrap
                  "
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-8 py-3 text-sm tracking-wide transition-all"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="
              bg-copper hover:bg-copper-bright text-bg font-semibold px-10 py-3 text-sm tracking-wide
              transition-all hover:shadow-[0_0_30px_rgba(205,127,50,0.25)]
            "
          >
            Continue
          </button>
        </div>
      </div>
    </WizardPanel>
  );
}

/* ══════════════════════════════════════════
   STEP 4 — Review & Confirm
   ══════════════════════════════════════════ */
function Step4({
  barName,
  stations,
  bottles,
  setBottles,
  onBack,
  onFinish,
}: {
  barName: string;
  stations: Station[];
  bottles: Bottle[];
  setBottles: (b: Bottle[]) => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  const [editingBottle, setEditingBottle] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Partial<Bottle>>({});

  const startEditBottle = (b: Bottle) => {
    setEditingBottle(b.id);
    setEditFields({ name: b.name, category: b.category, parLevel: b.parLevel, stationId: b.stationId });
  };

  const commitEditBottle = () => {
    if (editingBottle) {
      setBottles(
        bottles.map((b) =>
          b.id === editingBottle ? { ...b, ...editFields } as Bottle : b
        )
      );
    }
    setEditingBottle(null);
    setEditFields({});
  };

  const removeBottle = (id: string) => {
    setBottles(bottles.filter((b) => b.id !== id));
  };

  const bottlesByStation = stations.map((s) => ({
    station: s,
    bottles: bottles.filter((b) => b.stationId === s.id),
  }));

  const totalBottles = bottles.length;
  const categories = [...new Set(bottles.map((b) => b.category))];

  return (
    <WizardPanel>
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl copper-text mb-2 text-center">
          Review & Confirm
        </h2>
        <p className="text-text-muted text-sm text-center mb-6">
          Here&apos;s your complete inventory map for <span className="text-cream">{barName}</span>. Edit anything that needs fixing.
        </p>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-bg-warm border border-gear-border rounded-sm p-4 text-center">
            <div className="stat-number text-2xl copper-text">{stations.length}</div>
            <div className="text-[10px] tracking-wider uppercase text-text-light mt-1">Stations</div>
          </div>
          <div className="bg-bg-warm border border-gear-border rounded-sm p-4 text-center">
            <div className="stat-number text-2xl copper-text">{totalBottles}</div>
            <div className="text-[10px] tracking-wider uppercase text-text-light mt-1">Bottles</div>
          </div>
          <div className="bg-bg-warm border border-gear-border rounded-sm p-4 text-center">
            <div className="stat-number text-2xl copper-text">{categories.length}</div>
            <div className="text-[10px] tracking-wider uppercase text-text-light mt-1">Categories</div>
          </div>
        </div>

        {/* Inventory map */}
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2 mb-8">
          {bottlesByStation.map(({ station, bottles: stBottles }) => (
            <div key={station.id} className="bg-bg-warm border border-gear-border rounded-sm overflow-hidden">
              {/* Station header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gear-border/50 bg-bg-card/50">
                <div className="flex items-center gap-3">
                  {/* Station icon based on type */}
                  <div className="w-7 h-7 rounded-full border border-gear-border flex items-center justify-center">
                    {station.type === 'well' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="3" y="2" width="8" height="10" rx="1" stroke="var(--copper)" strokeWidth="1" />
                        <rect x="5" y="5" width="4" height="3" fill="var(--copper)" opacity="0.3" />
                      </svg>
                    )}
                    {station.type === 'backbar' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="2" y="3" width="10" height="8" rx="1" stroke="var(--brass)" strokeWidth="1" />
                        <line x1="2" y1="6" x2="12" y2="6" stroke="var(--brass)" strokeWidth="0.5" opacity="0.5" />
                        <line x1="2" y1="9" x2="12" y2="9" stroke="var(--brass)" strokeWidth="0.5" opacity="0.5" />
                      </svg>
                    )}
                    {station.type === 'storage' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="2" y="2" width="10" height="10" rx="1" stroke="var(--patina)" strokeWidth="1" />
                        <path d="M5 6h4M7 4v4" stroke="var(--patina)" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    )}
                    {station.type === 'walk-in' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="2" y="2" width="10" height="10" rx="1" stroke="var(--wine-glow)" strokeWidth="1" />
                        <path d="M5 7a2 2 0 014 0" stroke="var(--wine-glow)" strokeWidth="1" fill="none" />
                      </svg>
                    )}
                  </div>
                  <span className="text-cream font-medium text-sm">{station.name}</span>
                  <StationBadge type={station.type} />
                </div>
                <span className="text-text-light text-xs font-mono">
                  {stBottles.length}
                </span>
              </div>

              {/* Bottles in this station */}
              {stBottles.length > 0 ? (
                <div className="divide-y divide-gear-border/20">
                  {stBottles.map((b) => (
                    <div key={b.id} className="group">
                      {editingBottle === b.id ? (
                        /* Edit mode */
                        <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-5 gap-2 bg-bg/50">
                          <input
                            value={editFields.name ?? ''}
                            onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                            className="md:col-span-2 bg-bg border border-copper/40 rounded-sm px-2 py-1.5 text-cream text-sm focus:outline-none"
                            autoFocus
                          />
                          <select
                            value={editFields.category ?? 'spirits'}
                            onChange={(e) => setEditFields({ ...editFields, category: e.target.value })}
                            className="bg-bg border border-gear-border rounded-sm px-2 py-1.5 text-sm text-text-muted focus:outline-none"
                          >
                            <option value="spirits">Spirits</option>
                            <option value="vodka">Vodka</option>
                            <option value="gin">Gin</option>
                            <option value="rum">Rum</option>
                            <option value="tequila">Tequila</option>
                            <option value="whiskey">Whiskey</option>
                            <option value="scotch">Scotch</option>
                            <option value="cognac">Cognac</option>
                            <option value="liqueur">Liqueur</option>
                            <option value="beer">Beer</option>
                            <option value="wine">Wine</option>
                            <option value="mixer">Mixer</option>
                          </select>
                          <div className="flex items-center gap-2">
                            <label className="text-text-light text-xs whitespace-nowrap">Par:</label>
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              value={editFields.parLevel ?? 1}
                              onChange={(e) => setEditFields({ ...editFields, parLevel: parseFloat(e.target.value) || 0 })}
                              className="w-16 bg-bg border border-gear-border rounded-sm px-2 py-1.5 text-sm text-cream focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={editFields.stationId ?? b.stationId}
                              onChange={(e) => setEditFields({ ...editFields, stationId: e.target.value })}
                              className="flex-1 bg-bg border border-gear-border rounded-sm px-2 py-1.5 text-xs text-text-muted focus:outline-none"
                            >
                              {stations.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                            <button
                              onClick={commitEditBottle}
                              className="text-patina-light hover:text-patina text-xs border border-patina/30 px-2 py-1 rounded-sm transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Display mode */
                        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg/30 transition-colors">
                          <span className="text-cream text-sm flex-1 truncate">{b.name}</span>
                          <span className="text-[10px] tracking-wider uppercase text-text-light">{b.category}</span>
                          <span className="text-text-light text-xs">{b.size}</span>
                          <span className="text-text-light text-xs font-mono">par {b.parLevel}</span>
                          <button
                            onClick={() => startEditBottle(b)}
                            className="text-text-light/30 hover:text-copper transition-colors opacity-0 group-hover:opacity-100"
                            aria-label={`Edit ${b.name}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M10 2l2 2-7 7H3v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            onClick={() => removeBottle(b.id)}
                            className="text-text-light/30 hover:text-wine-glow transition-colors opacity-0 group-hover:opacity-100"
                            aria-label={`Remove ${b.name}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-text-light text-xs italic">
                  No bottles at this station
                </div>
              )}
            </div>
          ))}
        </div>

        <GearDivider />

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onBack}
            className="border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-8 py-3 text-sm tracking-wide transition-all"
          >
            Back
          </button>
          <button
            onClick={onFinish}
            className="
              relative bg-copper hover:bg-copper-bright text-bg font-semibold px-10 py-4 text-sm tracking-wide
              transition-all hover:shadow-[0_0_40px_rgba(205,127,50,0.35)]
              group
            "
          >
            <span className="relative z-10 flex items-center gap-2">
              Looks Good &mdash; Start Counting
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </WizardPanel>
  );
}

/* ══════════════════════════════════════════
   MAIN WIZARD PAGE
   ══════════════════════════════════════════ */
export default function SetupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [barName, setBarName] = useState('');
  const [stations, setStations] = useState<Station[]>(
    DEFAULT_STATIONS.map((s) => ({ ...s, id: uid() }))
  );
  const [bottles, setBottles] = useState<Bottle[]>([]);

  const goNext = () => setStep((s) => Math.min(s + 1, 4));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleFinish = () => {
    const bar: Bar = {
      name: barName,
      stations,
      bottles,
    };
    saveBar(bar);
    router.push('/inventory');
  };

  return (
    <div className="relative min-h-screen">
      <GearBackground />

      {/* Top accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-copper/30 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-copper/40" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-text-light">
              First-Time Setup
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-copper/40" />
          </div>
        </div>

        <StepIndicator current={step} />

        {/* Step content with fade transition */}
        <div
          key={step}
          className="animate-[fadeSlideIn_0.4s_ease-out]"
          style={{
            animation: 'fadeSlideIn 0.4s ease-out',
          }}
        >
          {step === 1 && (
            <Step1
              barName={barName}
              setBarName={setBarName}
              onNext={goNext}
            />
          )}
          {step === 2 && (
            <Step2
              stations={stations}
              setStations={setStations}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <Step3
              stations={stations}
              bottles={bottles}
              setBottles={setBottles}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 4 && (
            <Step4
              barName={barName}
              stations={stations}
              bottles={bottles}
              setBottles={setBottles}
              onBack={goBack}
              onFinish={handleFinish}
            />
          )}
        </div>
      </div>

      {/* Bottom pipe accent */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-copper/20 to-transparent mt-12" />

      {/* CSS for fade animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
