# Case Study: Building an Islamic Calculations App with Claude Code

Updated at each phase milestone. Goal-driven, statistics over narrative.

## Problem
Islamic calculations (Zakat, inheritance, Fitrana, etc.) each require distinct, religiously
sensitive rules across four Sunni madhabs. No single mobile tool covers the range with a
citable, scholar-verified accuracy trail.

## Solution
An umbrella React Native/Expo app: one home hub, N independent calculators, each backed by a
scholar-approved Fiqh Rule Specification before any code exists.

## Approach
- Phased roadmap (Zakat + Inheritance → utility tier → niche tier → polish/localization).
- `core/` (pure logic) vs `features/` (UI) split so calculation engines are independently
  reviewable and testable.
- Fiqh doc → scholar approval → implementation → fixture tests, enforced procedurally.

## How AI was used
| Stage | What Claude Code did |
|---|---|
| Research | 3 parallel subagents researched Zakat rules, Inheritance rules, and Islam360 UX/RN architecture before any code was written |
| Architecture design | 1 Plan subagent designed the `.claude/` agent/skill structure |
| Scaffolding | Direct implementation of `.claude/`, `docs/`, and app skeleton |

## Milestones

| Date | Phase | Metric |
|---|---|---|
| 2026-07-12 | Phase 0 start | `.claude/` + `docs/` scaffolded: 8 agents, 3 skills, 4 ADRs, 0 calculators |

## Design evolution
- V0: functional-first, baseline design system (green/gold, dark mode) — deep polish deferred to
  Phase 4 by deliberate decision, not oversight.
