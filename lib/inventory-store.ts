// ── Data layer for bar inventory (localStorage-backed) ──

export interface Bottle {
  id: string;
  productName: string;
  category: "spirits" | "wine" | "beer" | "mixers" | "other";
  size: string;
  parLevel: number;
  currentLevel: number;
  lastCount: string; // ISO date
  costPerBottle: number;
}

export interface Station {
  id: string;
  name: string;
  type: "well" | "backbar" | "storage" | "walk-in";
  position: number;
  bottles: Bottle[];
}

export interface Bar {
  id: string;
  name: string;
  createdAt: string; // ISO date
  stations: Station[];
}

export interface CountEntry {
  bottleId: string;
  level: number;
  notes: string;
}

export interface InventoryCount {
  id: string;
  date: string; // ISO date
  entries: CountEntry[];
  notes: string;
  createdBy: string;
}

// ── localStorage key prefix ──
const PREFIX = "osb_";
const KEYS = {
  bar: `${PREFIX}bar`,
  counts: `${PREFIX}counts`,
} as const;

// ── Helpers ──

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Public API ──

export function getBar(): Bar | null {
  return read<Bar>(KEYS.bar);
}

export function saveBar(bar: Bar): void {
  write(KEYS.bar, bar);
}

export function getCounts(): InventoryCount[] {
  return read<InventoryCount[]>(KEYS.counts) ?? [];
}

export function saveCount(count: InventoryCount): void {
  const existing = getCounts();
  const idx = existing.findIndex((c) => c.id === count.id);
  if (idx >= 0) {
    existing[idx] = count;
  } else {
    existing.push(count);
  }
  write(KEYS.counts, existing);
}

export function clearAll(): void {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}

export function hasInventoryData(): boolean {
  return getBar() !== null;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
