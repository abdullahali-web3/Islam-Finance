import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Gold/silver price proxy (ADR 0008). A minimal, READ-ONLY serverless function whose only job is to
 * hold the metal-price provider's API key so it never ships in the app bundle (ADR 0004). It does
 * nothing else — no user data, no writes, no accounts.
 *
 * Deployed SEPARATELY from the app (this /proxy dir has its own deploy). The app calls it with a
 * `currency` query param and expects: { goldPerGram, silverPerGram, currency, asOf }.
 *
 * The provider key is read from the `METAL_PRICE_API_KEY` environment variable at deploy time
 * (set in the Vercel/Cloudflare dashboard) — NEVER committed. See .env.example and README.md.
 */

const TROY_OUNCE_IN_GRAMS = 31.1034768;
const SUPPORTED = new Set(['USD', 'GBP', 'EUR', 'PKR', 'INR', 'BDT', 'SAR', 'AED', 'CAD', 'AUD', 'MYR', 'TRY']);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.METAL_PRICE_API_KEY;
  if (!apiKey) {
    // Fail closed — never expose that the key is missing beyond a generic 500.
    res.status(500).json({ error: 'proxy_not_configured' });
    return;
  }

  const currency = String(req.query.currency ?? 'USD').toUpperCase();
  if (!SUPPORTED.has(currency)) {
    res.status(400).json({ error: 'unsupported_currency' });
    return;
  }

  try {
    // Provider example: MetalpriceAPI. Returns `rates` as base->metal where the metal rate is the
    // amount of metal per 1 unit of base currency, so price-per-ounce = 1 / rate. Adjust this
    // mapping to whichever provider you deploy against (GoldAPI.io returns per-ounce directly).
    const url =
      `https://api.metalpriceapi.com/v1/latest` +
      `?api_key=${encodeURIComponent(apiKey)}&base=${currency}&currencies=XAU,XAG`;

    const upstream = await fetch(url);
    if (!upstream.ok) {
      res.status(502).json({ error: 'provider_unavailable' });
      return;
    }
    const data = (await upstream.json()) as { rates?: { XAU?: number; XAG?: number } };
    const xau = data.rates?.XAU;
    const xag = data.rates?.XAG;
    if (!xau || !xag) {
      res.status(502).json({ error: 'provider_bad_response' });
      return;
    }

    const goldPerOunce = 1 / xau;
    const silverPerOunce = 1 / xag;

    const body = {
      goldPerGram: goldPerOunce / TROY_OUNCE_IN_GRAMS,
      silverPerGram: silverPerOunce / TROY_OUNCE_IN_GRAMS,
      currency,
      asOf: new Date().toISOString(),
    };

    // Cache at the edge for an hour — prices move slowly and this shields the provider quota.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json(body);
  } catch {
    res.status(502).json({ error: 'provider_error' });
  }
}
