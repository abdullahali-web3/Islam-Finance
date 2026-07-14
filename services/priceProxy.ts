import { storage } from '@/services/storage';
import type { CurrencyCode } from '@/core/shared';
import { parseMetalPrices, type MetalPrices } from './metalPrices';

/**
 * Gold/silver manual-override price store (ADR 0008). Zakat's nisab currently runs on a user-entered
 * price cached locally in MMKV. The LIVE proxy-fetch path (fetch → cache → fallback) is intentionally
 * deferred until the price proxy (`/proxy`) is deployed — it will be re-added here behind a user
 * action + OfflineNotice at that point. The provider API key never lives in the app; only the proxy
 * holds it (the app config only carries the proxy's public URL).
 */

const OVERRIDE_KEY = 'metal_prices_override_v1';

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

export function getManualOverride(): MetalPrices | null {
  return readPrices(OVERRIDE_KEY);
}

/** User-entered price, cached locally so it prefills next time. Pass null to clear. */
export function setManualOverride(prices: MetalPrices | null): void {
  if (prices === null) {
    storage.remove(OVERRIDE_KEY);
    return;
  }
  storage.set(OVERRIDE_KEY, JSON.stringify(prices));
}
