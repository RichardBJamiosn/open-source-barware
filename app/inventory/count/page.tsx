'use client';

import { useState, useEffect, useCallback } from 'react';
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

function saveBar(bar: Bar): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_PREFIX}bar`, JSON.stringify(bar));
}

function saveCount(count: InventoryCount): void {
  if (typeof window === 'undefined') return;
  const counts = getCounts();
  counts.unshift(count);
  localStorage.setItem(`${STORAGE_PREFIX}counts`, JSON.stringify(counts));
}

function getCounts(): InventoryCount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}counts`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ── Voice/text parser ──
interface ParsedItem {
  bottleId: string | null;
  bottleName: string;
  matchedName: string | null;
  level: number;
  confidence: 'high' | 'medium' | 'low';
  suggestions: string[];
}

function parseVoiceNotes(text: string, allBottles: { bottle: Bottle; stationId: string }[]): ParsedItem[] {
  const items: ParsedItem[] = [];
  // Split on commas, newlines, periods, or semicolons
  const fragments = text
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const fragment of fragments) {
    const lower = fragment.toLowerCase();

    // Extract level from the fragment
    let level = -1;

    // "empty" / "dead"
    if (/\b(empty|dead|out|gone|zero)\b/.test(lower)) {
      level = 0;
    }
    // "full" / "new" / "sealed" / "unopened"
    else if (/\b(full|new|sealed|unopened)\b/.test(lower)) {
      level = 1.0;
    }
    // "half" (not "half quarter" etc)
    else if (/\bhalf\b/.test(lower) && !/quarter/.test(lower)) {
      level = 0.5;
    }
    // "quarter"
    else if (/\bquarter\b/.test(lower)) {
      level = 0.25;
    }
    // "three quarter" / "three-quarter" / "3/4"
    else if (/\b(three[- ]?quarter|3\/4)\b/.test(lower)) {
      level = 0.75;
    }
    // "point X" / ".X" patterns: "point four" = 0.4, "point two" = 0.2
    else {
      const pointWordMatch = lower.match(/point\s+(zero|one|two|three|four|five|six|seven|eight|nine)/);
      if (pointWordMatch) {
        const wordToNum: Record<string, number> = {
          zero: 0, one: 0.1, two: 0.2, three: 0.3, four: 0.4,
          five: 0.5, six: 0.6, seven: 0.7, eight: 0.8, nine: 0.9,
        };
        level = wordToNum[pointWordMatch[1]] ?? -1;
      }
    }

    // Numeric patterns: "0.4", ".4", "40%"
    if (level === -1) {
      const decimalMatch = lower.match(/\b(0?\.\d+)\b/);
      if (decimalMatch) {
        level = parseFloat(decimalMatch[1]);
      }
      const pctMatch = lower.match(/\b(\d+)\s*%/);
      if (pctMatch) {
        level = parseInt(pctMatch[1]) / 100;
      }
      // "X/10" pattern: "3/10" = 0.3
      const tenthMatch = lower.match(/\b(\d+)\s*\/\s*10\b/);
      if (tenthMatch) {
        level = parseInt(tenthMatch[1]) / 10;
      }
    }

    // Multi-unit: "two bottles" or "1 case 3 bottles" (storage context)
    if (level === -1) {
      const bottleCountMatch = lower.match(/\b(\d+)\s*bottle/);
      if (bottleCountMatch) {
        level = parseInt(bottleCountMatch[1]); // Store as-is, >1 means multiple
      }
      const caseMatch = lower.match(/(\d+)\s*case[s]?\s*(\d+)?\s*bottle/);
      if (caseMatch) {
        const cases = parseInt(caseMatch[1]);
        const extra = caseMatch[2] ? parseInt(caseMatch[2]) : 0;
        level = cases * 12 + extra; // Approximate: 12 bottles per case
      }
    }

    if (level === -1) level = 0.5; // Default if can't parse

    // Clamp single-bottle levels
    if (level > 1.0 && level <= 10) {
      // Probably a tenths reading like "6" meaning 0.6
      level = level / 10;
    }

    // Match to bottle
    const cleanedName = lower
      .replace(/\b(empty|dead|out|gone|zero|full|new|sealed|unopened|half|quarter|three[- ]?quarter|point\s+\w+|0?\.\d+|\d+\s*%|\d+\s*\/\s*10|\d+\s*bottle[s]?|\d+\s*case[s]?\s*\d*\s*bottle[s]?)\b/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();

    let bestMatch: { bottle: Bottle; stationId: string } | null = null;
    let bestScore = 0;
    const suggestions: string[] = [];

    for (const entry of allBottles) {
      const bName = entry.bottle.name.toLowerCase();
      const score = fuzzyScore(cleanedName, bName);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
      if (score > 0.3 && score < 0.8) {
        suggestions.push(entry.bottle.name);
      }
    }

    const confidence: 'high' | 'medium' | 'low' = bestScore > 0.7 ? 'high' : bestScore > 0.4 ? 'medium' : 'low';

    items.push({
      bottleId: bestMatch && confidence !== 'low' ? bestMatch.bottle.id : null,
      bottleName: cleanedName || fragment,
      matchedName: bestMatch && confidence !== 'low' ? bestMatch.bottle.name : null,
      level: Math.min(level, 1.0),
      confidence,
      suggestions: confidence === 'low' ? suggestions.slice(0, 3) : [],
    });
  }

  return items;
}

function fuzzyScore(query: string, target: string): number {
  if (!query || !target) return 0;
  const q = query.toLowerCase().split(/\s+/);
  const t = target.toLowerCase();
  let matched = 0;
  for (const word of q) {
    if (word.length < 2) continue;
    if (t.includes(word)) matched++;
  }
  return q.length > 0 ? matched / q.length : 0;
}

// ── Quick level buttons ──
const QUICK_LEVELS = [
  { label: 'Empty', value: 0 },
  { label: '1/4', value: 0.25 },
  { label: '1/2', value: 0.5 },
  { label: '3/4', value: 0.75 },
  { label: 'Full', value: 1.0 },
] as const;

// ── Main Count Page ──
export default function CountPage() {
  const [bar, setBar] = useState<Bar | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'voice' | 'manual'>('voice');
  const [voiceText, setVoiceText] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [showParsed, setShowParsed] = useState(false);

  // Manual mode state
  const [currentStationIdx, setCurrentStationIdx] = useState(0);
  const [manualLevels, setManualLevels] = useState<Record<string, number>>({});

  // Completion state
  const [saved, setSaved] = useState(false);
  const [summary, setSummary] = useState<{ counted: number; belowPar: number; needReorder: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    const loaded = getBar();
    setBar(loaded);
    if (loaded) {
      // Initialize manual levels from current levels
      const levels: Record<string, number> = {};
      for (const station of loaded.stations) {
        for (const bottle of station.bottles) {
          levels[bottle.id] = bottle.currentLevel;
        }
      }
      setManualLevels(levels);
    }
  }, []);

  const allBottles = bar
    ? bar.stations.flatMap((s) => s.bottles.map((b) => ({ bottle: b, stationId: s.id })))
    : [];

  const handleProcessNotes = useCallback(() => {
    if (!voiceText.trim() || !bar) return;
    const parsed = parseVoiceNotes(voiceText, allBottles);
    setParsedItems(parsed);
    setShowParsed(true);
  }, [voiceText, bar, allBottles]);

  const handleSave = useCallback(() => {
    if (!bar) return;

    let entries: CountEntry[];

    if (mode === 'voice' && showParsed) {
      entries = parsedItems
        .filter((item) => item.bottleId)
        .map((item) => {
          const match = allBottles.find((b) => b.bottle.id === item.bottleId);
          return {
            bottleId: item.bottleId!,
            bottleName: item.matchedName || item.bottleName,
            stationId: match?.stationId || '',
            previousLevel: match?.bottle.currentLevel || 0,
            countedLevel: item.level,
          };
        });
    } else {
      // Manual mode
      entries = allBottles.map(({ bottle, stationId }) => ({
        bottleId: bottle.id,
        bottleName: bottle.name,
        stationId,
        previousLevel: bottle.currentLevel,
        countedLevel: manualLevels[bottle.id] ?? bottle.currentLevel,
      }));
    }

    const now = new Date();
    const count: InventoryCount = {
      id: `count-${Date.now()}`,
      date: now.toISOString(),
      entries,
    };
    saveCount(count);

    // Update bar's current levels
    const updatedBar = { ...bar, lastCountDate: now.toISOString().split('T')[0] };
    updatedBar.stations = updatedBar.stations.map((station) => ({
      ...station,
      bottles: station.bottles.map((bottle) => {
        const entry = entries.find((e) => e.bottleId === bottle.id);
        return entry ? { ...bottle, currentLevel: entry.countedLevel } : bottle;
      }),
    }));
    saveBar(updatedBar);
    setBar(updatedBar);

    const belowPar = entries.filter((e) => {
      const b = allBottles.find((ab) => ab.bottle.id === e.bottleId);
      return b && e.countedLevel < b.bottle.parLevel;
    }).length;
    const needReorder = entries.filter((e) => e.countedLevel <= 0.2).length;

    setSummary({ counted: entries.length, belowPar, needReorder });
    setSaved(true);
  }, [bar, mode, showParsed, parsedItems, allBottles, manualLevels]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!bar) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-text-muted mb-4">No bar configured. Set up your inventory first.</p>
        <Link href="/inventory/dashboard" className="text-copper hover:text-copper-bright transition-colors">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // ── Saved summary ──
  if (saved && summary) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="panel rounded-sm p-6 sm:p-10 text-center rivets">
          <div className="mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4">
              <circle cx="12" cy="12" r="10" stroke="var(--patina-light)" strokeWidth="1.5" />
              <path d="M8 12l3 3 5-6" stroke="var(--patina-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="font-serif text-2xl sm:text-3xl copper-text mb-2">Count Complete</h2>
            <p className="text-text-muted text-sm">{today}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="font-serif text-2xl text-cream">{summary.counted}</div>
              <div className="text-[10px] tracking-wider uppercase text-text-light mt-1">Items Counted</div>
            </div>
            <div className="text-center">
              <div className={`font-serif text-2xl ${summary.belowPar > 0 ? 'text-copper' : 'text-patina-light'}`}>
                {summary.belowPar}
              </div>
              <div className="text-[10px] tracking-wider uppercase text-text-light mt-1">Below Par</div>
            </div>
            <div className="text-center">
              <div className={`font-serif text-2xl ${summary.needReorder > 0 ? 'text-wine-glow' : 'text-patina-light'}`}>
                {summary.needReorder}
              </div>
              <div className="text-[10px] tracking-wider uppercase text-text-light mt-1">Need Reorder</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/inventory/dashboard"
              className="bg-copper hover:bg-copper-bright text-bg font-semibold px-6 py-2.5 text-sm tracking-wide transition-all"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/inventory/history"
              className="border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-6 py-2.5 text-sm tracking-wide transition-all"
            >
              View History
            </Link>
          </div>
        </div>
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
          Weekly Count
        </span>
      </div>
      <h1 className="font-serif text-2xl sm:text-3xl copper-text mb-1">Weekly Count</h1>
      <p className="text-text-muted text-sm mb-6">{today}</p>

      {/* ── Mode Toggle ── */}
      <div className="flex border border-gear-border rounded-sm overflow-hidden mb-6">
        <button
          onClick={() => { setMode('voice'); setShowParsed(false); }}
          className={`flex-1 py-2.5 text-sm font-medium tracking-wide transition-all ${
            mode === 'voice' ? 'bg-copper text-bg' : 'text-text-muted hover:text-copper'
          }`}
        >
          Voice / Text
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 py-2.5 text-sm font-medium tracking-wide transition-all ${
            mode === 'manual' ? 'bg-copper text-bg' : 'text-text-muted hover:text-copper'
          }`}
        >
          Manual
        </button>
      </div>

      {/* ── Voice/Text Mode ── */}
      {mode === 'voice' && (
        <div>
          {!showParsed ? (
            <>
              <div className="panel rounded-sm p-4 sm:p-5 mb-4">
                <label className="block text-xs text-text-light tracking-wider uppercase mb-3">
                  Paste your voice notes
                </label>
                <textarea
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  placeholder="Walk the bar with your phone. Use voice notes to list each bottle and its level. Example: 'Tito's half bottle, Stoli point two, Tanqueray point four, empty Bacardi...'"
                  rows={8}
                  className="w-full bg-bg-warm border border-gear-border rounded-sm p-4 text-cream text-sm leading-relaxed placeholder:text-text-light/50 focus:outline-none focus:border-copper/50 resize-y"
                />
                <p className="text-[11px] text-text-light mt-3 leading-relaxed">
                  Supported formats: &quot;half&quot; = 0.5 | &quot;quarter&quot; = 0.25 | &quot;point four&quot; = 0.4 | &quot;empty&quot; = 0 | &quot;full&quot; = 1.0 | &quot;0.6&quot; | &quot;60%&quot; | &quot;6/10&quot;
                </p>
              </div>
              <button
                onClick={handleProcessNotes}
                disabled={!voiceText.trim()}
                className="w-full bg-copper hover:bg-copper-bright disabled:opacity-40 disabled:cursor-not-allowed text-bg font-semibold py-3 text-sm tracking-wide transition-all"
              >
                Process Notes
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <button
                  onClick={() => setShowParsed(false)}
                  className="text-sm text-text-light hover:text-copper transition-colors flex items-center gap-1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                  Edit notes
                </button>
              </div>

              <div className="space-y-2 mb-6">
                {parsedItems.map((item, i) => (
                  <div
                    key={i}
                    className={`panel rounded-sm p-4 ${
                      item.confidence === 'low' ? 'border-wine/40' : item.confidence === 'medium' ? 'border-copper/40' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {item.matchedName ? (
                          <div className="text-sm text-cream">{item.matchedName}</div>
                        ) : (
                          <div className="text-sm text-wine-glow">&quot;{item.bottleName}&quot;</div>
                        )}
                        {item.confidence === 'low' && item.suggestions.length > 0 && (
                          <div className="text-xs text-text-light mt-1">
                            Could not match. Did you mean:{' '}
                            {item.suggestions.map((s, si) => (
                              <button
                                key={si}
                                onClick={() => {
                                  const match = allBottles.find(
                                    (ab) => ab.bottle.name === s
                                  );
                                  if (match) {
                                    const updated = [...parsedItems];
                                    updated[i] = {
                                      ...updated[i],
                                      bottleId: match.bottle.id,
                                      matchedName: match.bottle.name,
                                      confidence: 'high',
                                      suggestions: [],
                                    };
                                    setParsedItems(updated);
                                  }
                                }}
                                className="text-copper hover:text-copper-bright underline mx-1"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                        {item.confidence === 'low' && item.suggestions.length === 0 && (
                          <div className="text-xs text-text-light mt-1">
                            No matches found in inventory
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <ConfidenceDot confidence={item.confidence} />
                        <span className="text-sm font-mono text-copper">{item.level.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-copper hover:bg-copper-bright text-bg font-semibold py-3 text-sm tracking-wide transition-all"
              >
                Save Count
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Manual Mode ── */}
      {mode === 'manual' && (
        <div>
          {/* Station tabs */}
          <div className="flex overflow-x-auto gap-1 mb-4 pb-1 -mx-1 px-1">
            {bar.stations.map((station, idx) => (
              <button
                key={station.id}
                onClick={() => setCurrentStationIdx(idx)}
                className={`whitespace-nowrap px-4 py-2 text-sm rounded-sm border transition-all shrink-0 ${
                  currentStationIdx === idx
                    ? 'bg-copper text-bg border-copper font-medium'
                    : 'border-gear-border text-text-muted hover:text-copper hover:border-copper/50'
                }`}
              >
                {station.name}
              </button>
            ))}
          </div>

          {/* Current station bottles */}
          {bar.stations[currentStationIdx] && (
            <div className="space-y-3 mb-6">
              {bar.stations[currentStationIdx].bottles.map((bottle) => {
                const currentManualLevel = manualLevels[bottle.id] ?? bottle.currentLevel;

                return (
                  <div key={bottle.id} className="panel rounded-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="min-w-0">
                        <div className="text-sm text-cream truncate">{bottle.name}</div>
                        <div className="text-[10px] text-text-light">
                          Last count: {bottle.currentLevel.toFixed(1)} | Par: {bottle.parLevel.toFixed(1)}
                        </div>
                      </div>
                      <span className="font-mono text-lg copper-text shrink-0 ml-3">
                        {currentManualLevel.toFixed(1)}
                      </span>
                    </div>

                    {/* Slider */}
                    <div className="mb-3">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={currentManualLevel}
                        onChange={(e) =>
                          setManualLevels((prev) => ({
                            ...prev,
                            [bottle.id]: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, var(--copper) 0%, var(--copper-bright) ${currentManualLevel * 100}%, var(--bg-warm) ${currentManualLevel * 100}%, var(--bg-warm) 100%)`,
                        }}
                      />
                    </div>

                    {/* Quick buttons */}
                    <div className="flex gap-1.5">
                      {QUICK_LEVELS.map((ql) => (
                        <button
                          key={ql.label}
                          onClick={() =>
                            setManualLevels((prev) => ({
                              ...prev,
                              [bottle.id]: ql.value,
                            }))
                          }
                          className={`flex-1 py-1.5 text-xs rounded-sm border transition-all ${
                            Math.abs(currentManualLevel - ql.value) < 0.01
                              ? 'bg-copper text-bg border-copper font-medium'
                              : 'border-gear-border text-text-light hover:text-copper hover:border-copper/50'
                          }`}
                        >
                          {ql.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation + Save */}
          <div className="flex gap-3">
            {currentStationIdx > 0 && (
              <button
                onClick={() => setCurrentStationIdx((prev) => prev - 1)}
                className="border border-gear-border text-text-muted hover:text-copper hover:border-copper/50 px-5 py-2.5 text-sm tracking-wide transition-all"
              >
                Previous
              </button>
            )}
            {currentStationIdx < bar.stations.length - 1 ? (
              <button
                onClick={() => setCurrentStationIdx((prev) => prev + 1)}
                className="flex-1 bg-copper hover:bg-copper-bright text-bg font-semibold py-2.5 text-sm tracking-wide transition-all"
              >
                Next Station
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex-1 bg-copper hover:bg-copper-bright text-bg font-semibold py-2.5 text-sm tracking-wide transition-all"
              >
                Save Count
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Confidence indicator dot ──
function ConfidenceDot({ confidence }: { confidence: 'high' | 'medium' | 'low' }) {
  const colors = {
    high: 'bg-patina-light shadow-[0_0_6px_var(--patina)]',
    medium: 'bg-copper shadow-[0_0_6px_var(--copper)]',
    low: 'bg-wine-glow shadow-[0_0_6px_var(--wine)]',
  };
  const labels = { high: 'High confidence', medium: 'Medium confidence', low: 'Low confidence' };

  return (
    <div className={`w-2 h-2 rounded-full ${colors[confidence]}`} title={labels[confidence]} />
  );
}
