# ADR 0008: Gold/Silver Price Source (Auto-Pricing)

## Status
Accepted (implements ADR 0004 for the price-API case). **Revised 2026-07-15 (Phase 4 pivot):** pricing
is now **auto-only** — manual price entry is removed from the normal flow — and the proxy is realized
as a **Supabase Edge Function** (ADR 0014) rather than a separate deploy.

## Context
Zakat nisab needs a live gold/silver spot price. Per ADR 0004, the provider key must never ship in the
client bundle; the provider (MetalpriceAPI / GoldAPI.io) offers no safely-embeddable restricted key,
so a server-side proxy is required. **Product decision (2026-07-15): users must NOT enter the price
manually — it is fetched automatically.** With Supabase now in the stack (ADR 0014), the proxy has a
natural home as an Edge Function, avoiding a second deploy.

## Decision
- The proxy is a **Supabase Edge Function** (ADR 0014) that holds the provider key server-side and
  exposes one read-only endpoint returning `{ goldPerGram, silverPerGram, currency, asOf }`. It does
  nothing else — no user data, no writes, public read (no auth needed). (A standalone Vercel /
  Cloudflare Worker stays an acceptable alternative, but the Edge Function avoids extra infra.)
- **Automatic pricing, not manual.** The client fetches on demand and **caches** the last value in
  MMKV (`asOf` timestamped). The Zakat calculator consumes the fetched/cached price; the **manual
  gold/silver price fields are removed** from the Zakat schema and UI.
- **Offline behaviour:** use the last cached price and **show its `asOf` date** so the user knows how
  fresh it is. The one real gap is **cold-start offline** (never fetched + no cache) — resolve with a
  **bundled seed price** (clearly dated/stale, refreshed on first connect) or a "prices unavailable —
  connect once to fetch" state. **Not** a manual field. *(Flagged — pick one at build time.)*
- Currency: the function returns per-gram prices; the client converts to the user's currency
  (ADR 0009), or requests the function in that currency if the provider supports it.

## Consequences
- The Edge Function is scoped strictly to secret-holding (no user data), consistent with ADR
  0004/0014. No separate proxy deploy once Supabase exists.
- **Zakat code change (Phase 4):** manual price fields leave the schema/UI; a price-fetch service +
  MMKV cache is added. The Zakat **engine tests are unaffected** — prices are still injected into the
  pure engine; only the *source* changes from user input to fetched value.
- Cold-start-offline handling (seed price vs. blocked state) is a flagged build-time decision.
- `qa-functional-tester` greps the bundle to confirm no provider key leaked (unchanged).
