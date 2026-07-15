# IslamFinance App
Islamic super-app — 13 calculators (Zakat, inheritance, +11) plus (planned) Quran (text+audio),
Hadith, learning, accounts. RN + Expo, Android-first, EAS/Play Store. Offline-first for calculators +
bundled Quran text; Supabase backend for OPTIONAL accounts/sync. Scope + sequence: docs/roadmap.md.

## Rules
- core/<domain>/: pure TS, zero RN imports. features/<domain>/: UI only, consumes core/ via its index.ts.
- One Zod schema + generic <CalculatorForm/> per calculator. Never hand-build a form screen.
- State: Zustand + MMKV (settings/cache/history, encrypted). Supabase backend (auth + per-user sync,
  optional login) behind the repository seam — ADR 0014/0015; WatermelonDB deferred. No secrets in
  client code, ever (only Supabase's public anon key ships; RLS guards data) — ADR 0004.
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
docs/roadmap.md, docs/fiqh/, docs/adr/, .claude/agents/, .claude/skills/ -- see each's own README/index.

## Phase
Currently: Phase 4 -- super-app pivot, define-first. Phases 0-3 done (13 calculators, all provisional).
Roadmap + open decisions: docs/roadmap.md; new architecture in ADR 0014-0016. Device build still
unproven (Metro never connected) -- the #1 blocker before Phase 4 feature code.
