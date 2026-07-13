# IslamFinance — Gold/Silver Price Proxy

A minimal, read-only serverless function that returns the current gold/silver spot price per gram,
so **Zakat nisab has a live price without the provider API key ever entering the app bundle**
(ADR 0004 + ADR 0008).

This is deliberately **separate from the app**. It holds a secret (the provider key); the app does
not. It has its own deploy and its own `package.json`. It is excluded from the app's typecheck/lint.

## Endpoint

```
GET /api/prices?currency=USD
→ 200 { "goldPerGram": 65.4, "silverPerGram": 0.82, "currency": "USD", "asOf": "2026-07-13T…Z" }
```

Errors are generic (`{ "error": "…" }`) and never leak key state. Responses are edge-cached for an
hour (`s-maxage=3600`).

## The one secret

The provider API key is read from `METAL_PRICE_API_KEY` (see `.env.example`). Set it:

- **Locally:** copy `.env.example` → `.env` (gitignored) for `vercel dev`.
- **Production:** in the Vercel/Cloudflare dashboard env vars.

It is **never committed** and never sent to the client. The app's `qa-functional-tester` greps the
app bundle to confirm no provider key leaked (ADR 0008).

## Provider

`api/prices.ts` is written against **MetalpriceAPI** (`rates` as base→metal; price-per-ounce =
`1/rate`, converted to grams via 31.1034768 g/troy-oz). Swap in another provider (e.g. GoldAPI.io,
which returns per-ounce directly) by adjusting only the mapping block — the response contract to the
app stays the same.

## Deploy

```
npm install
vercel deploy --prod        # or: npm run deploy
```

Then set the deployed URL as `extra.priceProxyUrl` in the app's `app.json`. Until that URL is set,
the app runs on cached / manual-override pricing (ADR 0008), so Zakat is fully buildable and testable
without this proxy.

## Scope guard

This function must stay a **secret-holder only** — no user data, no writes, no accounts. Anything
beyond that is a backend, which is trigger-gated by ADR 0007, not something to grow here.
