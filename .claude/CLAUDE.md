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

## Fiqh workflow (mandatory)
docs/fiqh/<domain>.md drafted -> scholar approves (frontmatter `status`) -> only then implement ->
doc's Worked Examples become test fixtures. Same gate applies to features/learn/content/<domain>.mdx.

## QA (mandatory, never self-reviewed)
Every calculator passes qa-code-reviewer + qa-functional-tester (fresh agents, no builder context)
+ /security-review before merge.

## Git
Commit + push to GitHub at session end. No autonomous deploy/CI actions -- confirm with user first.

## Map
docs/fiqh/, docs/adr/, .claude/agents/, .claude/skills/ -- see each's own README/index.

## Phase
Currently: Phase 0 -- foundation.
