# ADR 0006: Navigation & Home Registry

## Status
Accepted

## Context
The home hub launches ~15-20 independent calculators. Hand-wiring each into the Home screen, the
favorites row, search, and deep links would make Home a growing edit target and let entries drift.

## Decision
- expo-router. Bottom tabs (built): Home / Learn / History / Settings. Each calculator is a stack at
  `app/calculator/[domain]/` with `index` (wizard) and `result`.
- Single source of truth: **`features/home/registry.ts`** — an array of calculator descriptors
  `{ id, titleKey, icon, route, learnArticleId, phase, enabled }`. The hub grid, favorites row, and
  search all render from it. Adding a calculator = one registry entry (plus its `core/`/schema/UI),
  never editing Home's JSX.
- Deep links via the `islamfinance://` scheme (already set) — `islamfinance://calculator/<domain>`
  so notification taps and Learn "open calculator" links route directly.
- Favorites = a list of registry ids persisted in `settingsStore`/MMKV.

## Consequences
- Home stays closed for modification, open for extension.
- The `register-calculator` skill can mechanically add a registry entry + deep-link + favorite
  default, keeping the scaffold consistent.
