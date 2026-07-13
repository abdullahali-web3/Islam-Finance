import Constants from 'expo-constants';
import { storage } from '@/services/storage';
import type { CurrencyCode } from '@/core/shared';
import { parseMetalPrices, type MetalPrices, type PriceSource } from './metalPrices';

/**
 * Gold/silver price client (ADR 0008). Resolves a nisab price offline-first:
 *   live (via the proxy) → cached (MMKV) → manual override → nothing.
 * The provider API key NEVER lives here — only the proxy's PUBLIC url does (app.json extra). Until
 * the proxy is deployed, `fetchLivePrices` is a no-op stub, so the app runs on cache/manual-override
 * pricing and Zakat stays buildable and testable without any server (ADR 0008 consequence).
 */

const CACHE_KEY = 'metal_prices_cache_v1';
const OVERRIDE_KEY = 'metal_prices_override_v1';

export type PriceResult =
  | { prices: MetalPrices; source: PriceSource }
  | { prices: null; source: null };

/** The proxy's public URL from config, or null when it isn't deployed yet. */
function getProxyUrl(): string | null {
  const extra = Constants.expoConfig?.extra as { priceProxyUrl?: string } | undefined;
  const url = extra?.priceProxyUrl;
  return url && url.length > 0 ? url : null;
}

function readPrices(key: string): MetalPrices | null {
  const raw = storage.getString(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { currency?: string };
    const currency = parsed.currency as CurrencyCode | undefined;
    if (!currency) return null;
    return parseMetalPrices(parsed, currency);
  } catch {
    return null;
  }
}

export function getCachedPrices(): MetalPrices | null {
  return readPrices(CACHE_KEY);
}

export function getManualOverride(): MetalPrices | null {
  return readPrices(OVERRIDE_KEY);
}

/** User-entered fallback price (last resort when offline with no cache). Pass null to clear. */
export function setManualOverride(prices: MetalPrices | null): void {
  if (prices === null) {
    storage.remove(OVERRIDE_KEY);
    return;
  }
  storage.set(OVERRIDE_KEY, JSON.stringify(prices));
}

/** Fetch fresh prices through the proxy and cache them. Returns null on no-proxy/offline/bad data. */
export async function fetchLivePrices(currency: CurrencyCode): Promise<MetalPrices | null> {
  const base = getProxyUrl();
  if (!base) return null; // proxy not deployed yet — stub path
  try {
    const res = await fetch(`${base}?currency=${encodeURIComponent(currency)}`);
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const prices = parseMetalPrices(json, currency);
    if (prices) storage.set(CACHE_KEY, JSON.stringify(prices));
    return prices;
  } catch {
    return null; // offline / network error → caller falls back to cache/override
  }
}

/**
 * Resolve the nisab price offline-first. Tries live, then cache, then manual override. The `source`
 * lets the UI show an OfflineNotice when the value isn't live.
 */
export async function getMetalPrices(currency: CurrencyCode): Promise<PriceResult> {
  const live = await fetchLivePrices(currency);
  if (live) return { prices: live, source: 'live' };

  const cached = getCachedPrices();
  if (cached) return { prices: cached, source: 'cache' };

  const override = getManualOverride();
  if (override) return { prices: override, source: 'override' };

  return { prices: null, source: null };
}
