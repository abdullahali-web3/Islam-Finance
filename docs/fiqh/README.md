# Fiqh Rule Specifications — Template & Process

One markdown file per calculator domain in this folder (`zakat.md`, `inheritance.md`, ...), matching
the `core/<domain>/` and `features/<domain>/` folder name exactly. No fiqh content lives anywhere
else — agents working on a domain read only that domain's file here.

## Status lifecycle

`draft` → `pending-review` → `approved`, with `revision-requested` as a loop-back from
`pending-review` (scholar asks for changes) back to a revised `draft`/`pending-review` cycle.

- **draft** — being researched/written. Not implementable.
- **pending-review** — sent to the scholar via the `scholar-review-packet` skill. Not implementable.
- **approved** — scholar has signed off. Only status at which `fiqh-to-code`, `learn-content-writer`,
  and the `new-calculator` skill are allowed to act.
- **revision-requested** — scholar asked for changes post-approval. `core/` and the Learn article are
  NOT touched again until the doc is re-approved at a bumped version.

## Frontmatter (every doc)

```yaml
---
domain: <matches core/<domain>/ and features/<domain>/ folder name>
status: draft            # draft | pending-review | approved | revision-requested
version: 0.1
last_updated: YYYY-MM-DD
scholar_reviewer: <name, once assigned>
madhab_dependent: true    # or false
---
```

## Section template

```
# Fiqh Rule Specification: <Domain Name>

## Scope
What this calculator does and does not cover.

## Definitions & Terminology
Key Arabic/fiqh terms used, with transliteration + translation.

## Nisab / Threshold Constants
Exact values, units, and source basis.

## Core Formula(s)
Step-by-step, unambiguous, implementation-ready.

## Madhab Divergence Points
Table: issue -> Hanafi / Shafi'i / Maliki / Hanbali position. State "no divergence" explicitly if
not applicable — this is what lets madhab-consistency-auditor tell "not applicable" apart from
"forgotten."

## Named Special Cases
Trigger condition + resolution per madhab, for any named exception scenario.

## Worked Examples
Numbered: inputs, expected output, madhab assumed, one-line reasoning. These become unit test
fixtures verbatim.

## Public Explanation Notes
Key ayat/ahadith to cite (with exact reference), common user misconceptions, suggested reputable
video references. Feeds the Learn article directly — write for a general reader, not an engineer.

## Sources
Cited references (Qur'an/Hadith/fiqh texts/contemporary fatwa councils), plus API sources for any
live data.

## Flagged Uncertainties
Anything the drafting agent was unsure of — never silently resolved.

## Changelog
| Date | Version | Change | Requested by |
```

## Domain index

| Domain | Status | Last updated | Scope |
|---|---|---|---|
| zakat | draft | — | Cash, gold/silver (incl. jewelry), business inventory |
| inheritance | — | — | Fara'id: fixed shares, 'Awl, Radd, named special cases |
| fitrana | — | — | Zakat al-Fitr per-person amount |
| qurbani | — | — | Udhiyah nisab eligibility check |
| prayer-times-qibla | — | — | Prayer times + Qibla direction |
| hijri-calendar | — | — | Gregorian ↔ Hijri conversion |
