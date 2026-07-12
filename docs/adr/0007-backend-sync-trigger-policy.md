# ADR 0007: Backend / Sync Trigger Policy

## Status
Accepted

## Context
The app is offline-first with no backend in V1, but "backend-ready." The open question was *when*
Supabase (or any backend) enters. A date-based answer invites premature complexity; a never answer
forecloses real features.

## Decision
- **Trigger-based, not date-based.** Stay fully local through Phases 1-3. Adopt a backend (Supabase
  the likely choice) only when one of these concrete needs arrives: cross-device **history sync**,
  **user accounts**, a remote **Learn CMS**, or **remote push** (as opposed to local scheduled
  notifications).
- The *only* server surface permitted before then is the gold/silver **price proxy** (ADR 0008) —
  a secret-holder, not a backend, not accounts.
- To keep the future adapter cheap, all calculation-history reads/writes go through a thin
  **repository layer** now (over WatermelonDB), so a sync adapter drops in without touching feature
  code. WatermelonDB's sync primitives are the chosen seam.

## Consequences
- No auth/RLS/sync surface (and its security burden) until a feature genuinely needs it.
- History access is indirected through a repository from day one — minor extra indirection, large
  future payoff.
