# IslamFinance App
Umbrella Islamic-calculations app (Zakat, inheritance, more). RN + Expo, offline-first, EAS/Play Store.

## Rules
- core/<domain>/: pure TS, zero RN imports. features/<domain>/: UI only, consumes core/ via its index.ts.
- One Zod schema + generic <CalculatorForm/> per calculator. Never hand-build a form screen.
- State: Zustand + MMKV (settings/cache, encrypted) + WatermelonDB (history). No secrets in client
  code, ever — see docs/adr/0004-secrets.md.
- Madhab logic: core/<domain>/madhab/<school>.ts behind a RuleModule interface. Never inline
  madhab if/else elsewhere.
- i18n: react-i18next keys only, en + ur.

## Fiqh workflow (mandatory) -- see docs/adr/0013 (provisional-build policy)
docs/fiqh/<domain>.md researched+cited (status draft/research-provisional) -> implement from it ->
doc's Worked Examples become test fixtures -> results ship with a "not yet scholar-verified"
disclaimer -> scholar reviews OUTPUTS post-build -> corrections loop back -> status:approved drops
the disclaimer. Every rule/constant still traces to a cited source; nothing invented silently.
Same policy for features/learn/content/<domain>.mdx (scripture quotes must still be accurate).

## QA (mandatory, never self-reviewed)
Every calculator passes qa-code-reviewer + qa-functional-tester (fresh agents, no builder context)
+ /security-review before merge.

## Git
Commit + push to GitHub at session end. No autonomous deploy/CI actions -- confirm with user first.

## Map
docs/fiqh/, docs/adr/, .claude/agents/, .claude/skills/ -- see each's own README/index.

## Phase
Currently: Phase 0 -- foundation.
