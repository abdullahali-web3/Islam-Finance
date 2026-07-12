# ADR 0005: Styling with NativeWind

## Status
Accepted

## Context
The app needs a consistent, low-ceremony styling approach for a long, multi-calculator build where
many screens share the same visual language (card grid, wizard forms, result breakdowns). Options
considered: raw `StyleSheet` objects, a runtime CSS-in-JS library (e.g. styled-components), a
component/token library (e.g. Tamagui), or Tailwind-for-RN via NativeWind.

Design decisions already locked in (see the approved plan): deep green + gold accent, first-class
dark mode, and a "solid-but-not-final" design system now with a deliberate polish pass deferred to
Phase 4. `components/theme.ts` already holds the semantic light/dark token objects.

## Decision
- Use **NativeWind v4** (Tailwind CSS v3 for React Native) as the primary styling mechanism for all
  `features/` and `components/` UI.
- Utility classes via `className`; shared design tokens (green/gold/neutral palette, radii) are
  declared in `tailwind.config.js`, mirroring the palette in `components/theme.ts` — that file
  remains the single source of truth for token values and stays usable where an imperative style
  object is genuinely needed (e.g. navigator/`screenOptions` props that don't accept `className`).
- Dark mode uses the media-based `dark:` variant so it follows the OS appearance, consistent with
  `app.json`'s `userInterfaceStyle: "automatic"`. A future in-app override (the `colorScheme`
  setting already in `settingsStore`) can switch NativeWind to class-based dark mode when that
  feature is built; not needed now.
- Config surface: `tailwind.config.js`, `global.css` (Tailwind directives, imported once in the
  root layout), `babel.config.js` (`babel-preset-expo` with `jsxImportSource: "nativewind"` +
  `nativewind/babel`), `metro.config.js` (`withNativeWind`), and `nativewind-env.d.ts` for types.

## Consequences
- `core/` is unaffected — it has zero RN/UI imports and never sees NativeWind (consistent with the
  core/features split in ADR 0003 and CLAUDE.md).
- Two token sources exist (`tailwind.config.js` for `className`, `theme.ts` for imperative props);
  they are kept in sync by convention. Values are duplicated, not derived, to avoid coupling the
  Tailwind build to app runtime code. If drift becomes a problem, generate the Tailwind palette from
  `theme.ts` at build time — deferred until it's an actual issue.
- Adds a Metro/Babel build step for CSS; the trade-off is accepted for the velocity of utility-first
  styling across ~15-20 calculators sharing one visual system.
