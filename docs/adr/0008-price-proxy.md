# ADR 0008: Gold/Silver Price Proxy

## Status
Accepted (implements ADR 0004 for the specific price-API case)

## Context
Zakat nisab needs a live gold/silver spot price. Per ADR 0004, the provider key must never ship in
the client bundle. The provider (MetalpriceAPI / GoldAPI.io) offers no safely-embeddable restricted
key, so a proxy is required.

## Decision
- A **minimal serverless function** (Vercel or Cloudflare Worker) holds the provider key and exposes
  one read-only endpoint returning `{ goldPerGram, silverPerGram, currency, asOf }`. It does nothing
  else — no user data, no writes.
- The proxy lives **outside the app repo** (or in an isolated `/proxy` dir with its own deploy), so
  no secret is ever near the client source.
- Client behaviour: fetch through the proxy → cache the last value in MMKV (`asOf` timestamped) →
  on failure/offline fall back to the cached value → then to **manual override** (user enters the
  price). Nisab price is thus always resolvable offline.
- Currency: the proxy returns per-gram prices; the client converts to the user's currency
  (see ADR 0009) or requests the proxy in that currency if the provider supports it.

## Consequences
- One tiny piece of server infra earlier than the "no backend" posture, scoped strictly to
  secret-holding — consistent with ADR 0004/0007.
- Until the proxy exists, the app runs on manual-override pricing (a stub), so Zakat is buildable
  and testable without it.
- `qa-functional-tester` greps the bundle to confirm no provider key leaked.
