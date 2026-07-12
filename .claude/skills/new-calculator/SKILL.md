---
name: new-calculator
description: Scaffold a complete new calculator (core engine, schema, UI, Learn article, tests, home-hub registration, i18n stubs) from one approved fiqh doc, by pattern-matching the existing Zakat reference implementation. Use once docs/fiqh/<domain>.md has status:approved.
---

# New Calculator

Scaffolds calculator #N by copying the shape of an already-built reference calculator (Zakat once
it exists), not by re-deriving architecture from prose. This is the highest-leverage workflow in
the project for keeping later calculators cheap.

## Steps

1. **Gate check**: read `docs/fiqh/<domain>.md` frontmatter. If `status` is not `approved`, stop and
   report — do not scaffold anything against an unapproved doc.
2. **Core engine**: copy the folder shape of `core/zakat/` (or the most similar existing domain) into
   `core/<domain>/` — `index.ts`, `rules.ts`, `madhab/` (only if `madhab_dependent: true`),
   `__tests__/`. Delegate the actual rule-writing to the `fiqh-to-code` agent.
3. **Schema**: generate `schemas/<domain>.schema.ts` from the doc's Core Formula(s) inputs.
4. **UI**: delegate to `calculator-ui-builder` to build `features/<domain>/`, using the same
   reference domain's screen as template.
5. **Home hub**: add one entry to the single-source-of-truth registry
   `features/home/calculatorRegistry.ts` (card title, icon, route, i18n key).
6. **i18n**: add stub files `locales/en/<domain>.json` and `locales/ur/<domain>.json`.
7. **Learn article**: delegate to `learn-content-writer` for `features/learn/content/<domain>.mdx`,
   and link it from the new calculator's result screen ("How this works").
8. **Tests**: delegate to `fixture-test-writer` to derive fixtures from the doc's Worked Examples.
9. **QA**: hand off to `qa-code-reviewer` and `qa-functional-tester` (fresh agent invocations) before
   marking the calculator done — never skip this because the scaffold "looks standard."

Read `core/zakat/` and `features/zakat/` directly as the literal structural template throughout —
do not re-derive form/state architecture from `CLAUDE.md` prose each time.
