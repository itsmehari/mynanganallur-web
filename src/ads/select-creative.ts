import { ADS } from "./registry";
import type { AdSize, Creative } from "./types";

export type SelectCreativeInput = {
  slotId: string;
  size: AdSize;
  /** Stable per request + placement, e.g. pathname + calendar day + slotId */
  seed: string;
};

/** FNV-1a 32-bit — dependency-free deterministic hash */
export function fnv1a32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Calendar day in Asia/Kolkata (YYYY-MM-DD) for daily rotation */
export function kolkataDateKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function buildRotationSeed(pathname: string, slotId: string): string {
  return `${pathname}|${kolkataDateKey()}|${slotId}`;
}

export function listEligibleCreatives(
  slotId: string,
  size: AdSize,
  catalog: readonly Creative[] = ADS,
): Creative[] {
  return catalog.filter(
    (ad) =>
      ad.active &&
      ad.slot_ids.includes(slotId) &&
      ad.sizes.includes(size),
  );
}

/**
 * Picks one creative deterministically from eligible ads, or `null` if none.
 */
export function selectCreative(input: SelectCreativeInput): Creative | null {
  const eligible = listEligibleCreatives(input.slotId, input.size);
  if (eligible.length === 0) {
    return null;
  }
  const idx = fnv1a32(input.seed) % eligible.length;
  return eligible[idx] ?? null;
}

/** Deterministic order for multi-ad rows (dedupe advertisers). */
export function pickCreativesForRow(
  slotId: string,
  size: AdSize,
  seed: string,
  count: number,
  catalog: readonly Creative[] = ADS,
): Creative[] {
  const eligible = listEligibleCreatives(slotId, size, catalog);
  if (eligible.length === 0) return [];
  const sorted = [...eligible].sort(
    (a, b) => fnv1a32(`${seed}|${a.id}`) - fnv1a32(`${seed}|${b.id}`),
  );
  return sorted.slice(0, Math.min(count, sorted.length));
}

export function warnNoEligibleAds(
  slotId: string,
  size: AdSize,
): void {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[ads] No eligible creative for slot="${slotId}" size="${size}"`,
    );
  }
}
