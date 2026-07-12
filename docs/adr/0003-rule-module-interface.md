# ADR 0003: Multi-Madhab Logic — the RuleModule Interface

## Status
Accepted

## Context
Research (see docs/fiqh/zakat.md and inheritance.md once drafted) shows most Zakat rules are
near-universal across the four Sunni madhabs, but a few points (Zakat jewelry treatment, haul
continuity, Inheritance's Radd and grandfather+siblings cases) genuinely diverge. Scattering
`if (madhab === 'hanafi')` checks through general calculation code would make those divergence
points hard to find, hard for a scholar to review in isolation, and easy to get subtly wrong as
more calculators are added.

## Decision
Every domain with `madhab_dependent: true` (per its fiqh doc frontmatter) implements a shared
`RuleModule` TypeScript interface once, then provides one file per school:
`core/<domain>/madhab/{hanafi,shafii,maliki,hanbali}.ts`. The domain's main engine calls into
whichever module the user has selected; it never branches on madhab string itself. Non-divergent
domains have no `madhab/` folder at all.

## Consequences
- Every madhab-dependent rule is reviewable as four small, parallel files instead of scattered
  conditionals — directly supports the scholar-review workflow.
- `madhab-consistency-auditor` can mechanically check "all four schools present or explicitly N/A"
  across the whole codebase, catching an incomplete divergence before release.
- Slightly more files per divergent domain than an inline-conditional approach would produce — an
  accepted cost for the review/auditability benefit.
