# ADR 0002: State Management & Local Storage

## Status
Accepted

## Context
The app is offline-first with no backend in V1, but should be "backend-ready" for a later cloud
sync phase. Needs: per-module UI/app state, fast key-value settings/cache, and structured,
queryable calculation history.

## Decision
- **Zustand** for state — one store per calculator module, minimal boilerplate, composes well with
  many independent domains. Redux Toolkit only reconsidered if the team grows to 10+ engineers or
  an audit-trail requirement emerges; Jotai only if a future form needs atom-level fine-grained
  reactivity beyond what RHF already isolates.
- **MMKV** (`react-native-mmkv`) for settings, cached values (e.g. last-fetched gold/silver price),
  and as the Zustand persistence backend. Used in its **encrypted** mode from day one, even though
  there's no login yet — see ADR 0004.
- **WatermelonDB** (or `op-sqlite` if raw SQL control is preferred later) for calculation history —
  structured, filterable/sortable records, with sync-protocol hooks that align with the later
  backend-ready goal.

## Consequences
- Settings/cache reads are synchronous and fast (MMKV); history queries are relational and
  filterable (WatermelonDB) — right tool for each shape of data, not one storage mechanism forced
  to do both jobs.
- A future cloud-sync backend can adopt WatermelonDB's sync primitives rather than retrofitting a
  sync layer onto ad hoc storage.
