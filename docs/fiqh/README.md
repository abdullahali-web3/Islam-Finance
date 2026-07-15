# Fiqh Rule Specifications — Template & Process

One markdown file per calculator domain in this folder (`zakat.md`, `inheritance.md`, ...), matching
the `core/<domain>/` and `features/<domain>/` folder name exactly. No fiqh content lives anywhere
else — agents working on a domain read only that domain's file here.

## Status lifecycle

`draft` → `research-provisional` → `pending-review` → `approved`, with `revision-requested` as a
loop-back (scholar asks for changes) back to a revised cycle.

> **Provisional-build policy (ADR 0013) — supersedes the older "only approved is implementable"
> gate.** A doc that is fully researched + cited may be implemented at `research-provisional`. The
> calculator then ships with a visible "not yet scholar-verified" disclaimer on every result; the
> scholar reviews the OUTPUTS post-build, and `approved` drops the disclaimer. Every rule/constant
> still traces to a cited source, and any choice still open is recorded as a documented default
> (see e.g. zakat.md's "Implementation Defaults (provisional)" section) — nothing invented silently.

- **draft** — being researched/written. Not yet implementable.
- **research-provisional** — research complete + cited, open points pinned as documented defaults.
  **Implementable now** under ADR 0013, ships with the disclaimer.
- **pending-review** — bundled to the scholar via the `scholar-review-packet` skill.
- **approved** — scholar has signed off on the outputs; the disclaimer is dropped.
- **revision-requested** — scholar asked for changes. `core/` + Learn article are revised and the
  doc re-cycled at a bumped version.

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
| zakat | research-provisional | 2026-07-13 | Cash, gold/silver (incl. jewelry), business inventory |
| inheritance | research-provisional | 2026-07-13 | Fara'id: fixed shares, ḥajb, ʿAwl, Radd (+Bayt al-Māl divergence), grandfather+siblings, named cases |
| fitrana | — | — | Zakat al-Fitr per-person amount |
| livestock | research-provisional | 2026-07-15 | Zakāt al-Anʿām: camels/cattle/sheep-goats niṣāb tables, ḥawl + sāʾimah + ʿawāmil gates, camel>120 majority rule |
| ushr | research-provisional | 2026-07-15 | Agricultural zakat: 10/5/7.5% by irrigation, 5-awsuq niṣāb (Hanafi none), harvest→ʿushr→value |
| qada | research-provisional | 2026-07-15 | Missed prayers & fasts: 5/6 prayers/day (Witr Hanafi), menstruation exclusion, fasts 1-for-1 + fidya-for-delay |
| purification | research-provisional | 2026-07-15 | Investment/dividend purification (AAOIFI SS 21): dividend×impure% or shares×impure/share; non-madhab |
| qurbani | — | — | Udhiyah nisab eligibility check |
| prayer-times-qibla | — | — | Prayer times + Qibla direction |
| hijri-calendar | — | — | Gregorian ↔ Hijri conversion |
