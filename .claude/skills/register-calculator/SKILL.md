---
name: register-calculator
description: Wire an already-built calculator into the home hub — add its descriptor to features/home/registry.ts, confirm its deep link resolves, and set its default favorite/enabled flags. Use as the final wiring step of new-calculator (or on its own when a calculator's core+schema+UI exist but it isn't showing on Home yet). Does not build core/, schema, or UI.
---

# Register Calculator

Adds one calculator to the single source of truth the Home hub renders from
(`features/home/registry.ts`, per ADR 0006), so a new calculator appears on the grid, is
deep-linkable, and can be favorited — **without hand-editing any Home screen JSX**. The grid,
favorites row, and search all read the registry; this skill only touches the registry (+ i18n keys
and the route folder's existence check).

## Preconditions
- `core/<domain>/`, `schemas/<domain>.schema.ts`, and `features/<domain>/` (or `app/calculator/<domain>/`)
  already exist. If they don't, this is the wrong step — run `new-calculator` first.

## Steps

1. **Read the contract**: open `features/home/registry.ts` and its `CalculatorDescriptor` type. Match
   the existing entries' shape exactly — do not invent new fields.
2. **Add one descriptor** to the registry array:
   `{ id, titleKey, icon, route: '/calculator/<domain>', learnArticleId, phase, enabled }`.
   - `id` = the domain slug (`zakat`, `inheritance`, …), unique.
   - `titleKey` = an i18n key in `locales/<lang>/common.json` (add `home.card.<domain>` to en + ur if
     missing — never hardcode the title).
   - `icon` = an `@expo/vector-icons` Ionicons name consistent with the others.
   - `route` = the deep-linkable stack route; confirm `app/calculator/<domain>/index` exists so
     `islamfinance://calculator/<domain>` resolves.
   - `enabled` = `true` only when the calculator is actually shippable; `false` renders a
     "coming soon" card that doesn't navigate.
3. **Deep link check**: verify the `route` matches the file route and that the app scheme
   (`islamfinance://`, app.json) is unchanged, so notification/Learn taps land on the wizard.
4. **Favorites default** (optional): if this calculator should be pre-favorited, add its `id` to the
   default `favorites` seed in `store/settingsStore.ts` — otherwise leave favorites user-driven.
5. **Verify**: `npm run typecheck` + `npm run lint`, and eyeball the Home grid via the dev route /
   Maestro smoke flow. The registry entry alone should make the card appear — if you had to edit a
   Home screen, the registry abstraction is being bypassed; stop and fix that instead.

Keep this mechanical: one entry in, one card out. All architecture lives in ADR 0006 and the
registry's own types — don't re-derive it here.
