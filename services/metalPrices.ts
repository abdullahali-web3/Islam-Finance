// Pure metal-price types + parsing (ADR 0008). No expo/MMKV/fetch here, so parsing and staleness
// are unit-testable in plain Jest. services/priceProxy.ts wraps this with MMKV-backed storage.
import type { CurrencyCode } from '@/core/shared';

/** Gold/silver spot price for nisab, per gram, in a given currency, timestamped. */
export type MetalPrices = {
  goldPerGram: number;
  silverPerGram: number;
  currency: CurrencyCode;
  /** ISO 8601 timestamp of when the provider priced these. */
  asOf: string;
};

/**
 * Validate + normalize a raw proxy/cache/override payload into MetalPrices, or null if it's not a
 * usable price. The proxy is expected to return { goldPerGram, silverPerGram, currency, asOf };
 * `currency` is authoritative from the caller (we requested that currency).
 */
export function parseMetalPrices(raw: unknown, currency: CurrencyCode): MetalPrices | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const gold = Number(r.goldPerGram);
  const silver = Number(r.silverPerGram);
  if (!Number.isFinite(gold) || gold <= 0) return null;
  if (!Number.isFinite(silver) || silver <= 0) return null;
  const asOf = typeof r.asOf === 'string' ? r.asOf : new Date().toISOString();
  return { goldPerGram: gold, silverPerGram: silver, currency, asOf };
}

/** True when `prices.asOf` is older than `maxAgeMs` (used to show a "prices may be stale" hint). */
export function isStale(prices: MetalPrices, maxAgeMs: number, now: number = Date.now()): boolean {
  const asOfMs = new Date(prices.asOf).getTime();
  if (Number.isNaN(asOfMs)) return true;
  return now - asOfMs > maxAgeMs;
}
