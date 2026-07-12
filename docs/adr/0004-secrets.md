# ADR 0004: No Secrets in Client Code

## Status
Accepted

## Context
The app needs a gold/silver spot-price API (for Zakat nisab) and, later, other third-party services.
A React Native/Expo JS bundle is fully extractable by anyone with the installed app — any API key
embedded in client code is effectively public, regardless of obfuscation. This project has a
zero-tolerance policy on data exposure.

## Decision
- No API key that grants write access, spends a paid quota tied to this business, or could be
  abused if leaked is ever embedded directly in client code.
- For the gold/silver price API specifically: prefer a provider that supports a
  domain/app-restricted public key (safe to embed) for V1; if the chosen provider has no such
  restricted-key option, proxy the request through a minimal serverless function (introduces a tiny
  backend surface earlier than planned, but only as a secret-holding proxy — not a full backend) so
  the real key never ships in the bundle.
- Any future service needing a genuinely private key (payments, push notification service keys,
  etc.) is proxied through a backend once one exists (Phase 4) — never added to the client
  beforehand.
- MMKV storage of anything sensitive (calculation history, future account data) uses MMKV's
  encrypted mode, not plaintext, even pre-backend.

## Consequences
- Slightly more setup for the price-fetching feature (checking each API provider's key-restriction
  options before choosing one, or standing up a thin proxy) than "just embed the key" — accepted
  cost given the zero-tolerance security requirement.
- `qa-functional-tester` explicitly greps built bundle output for embedded secrets as part of its
  standard pass — this ADR is the rule that check enforces.
