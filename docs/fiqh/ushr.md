---
domain: ushr
status: research-provisional
version: 0.1
last_updated: 2026-07-15
scholar_reviewer: unassigned
madhab_dependent: true
---

> **Provisional build (ADR 0013).** Researched + cited, **not yet scholar-verified**. Ships with the
> disclaimer until a scholar reviews outputs. Every constant traces to ## Sources; open choices are
> pinned in ## Implementation Defaults, nothing invented silently.

# Fiqh Rule Specification: ʿUshr (Zakat on Agricultural Produce)

## Scope
ʿUshr — the zakat due on **harvested agricultural produce**, computed from the harvest weight and how
the land was watered. Rate is **10%** (naturally watered), **5%** (artificially irrigated), or **7.5%**
(both). Unlike wealth-zakat there is **no ḥawl** — it falls due on the day of harvest. Output is the
ʿushr owed as a **quantity of produce (kg)**, and — if the user enters a price — its cash value.

**In scope:** the 10 / 5 / 7.5% rate by irrigation method; the 5-awsuq (~653 kg) niṣāb for the
majority; the Hanafi "no niṣāb" position; the produce-weight → ʿushr-weight → optional value chain.

**Explicitly NOT modelled in V1 (see Flagged Uncertainties):** *which* crops are zakatable (majority
restrict to stored staples — grains, dates, raisins; Abū Ḥanīfa includes nearly all produce). V1
assumes the amount entered is a zakatable crop and computes on it; the school-scope point is
explained, not gated. Deduction of cultivation costs before the rate is applied is also not modelled
(V1 uses gross), and honey/mined produce are out of scope.

## Definitions & Terminology
- **ʿUshr** (lit. "a tenth") — zakat on agricultural output, at 10% or its half.
- **Niṣf al-ʿUshr** ("half of ʿushr") — the 5% rate for artificially irrigated land.
- **Wasq** (pl. *awsuq*) — a measure = **60 ṣāʿ**. The niṣāb is **5 awsuq = 300 ṣāʿ**.
- **Sāʾimah/ḥawl do not apply** — ʿushr is tied to the harvest, not a lunar year of holding.
- **Natural irrigation** — rain, springs, rivers, flood — no cost/labour to water. **Artificial** —
  wells, pumps, purchased/carried water, machinery. The distinction is about **cost/effort**, not the
  water's origin.

## Nisab / Threshold Constants
- **Niṣāb (majority — Maliki, Shafiʿi, Hanbali):** **5 awsuq = 300 ṣāʿ ≈ 653 kg** of the staple crop
  (D1; the kg figure varies with the ṣāʿ weight used — flagged). Below it, no ʿushr.
- **Niṣāb (Hanafi / Abū Ḥanīfa):** **none** — ʿushr is due on any quantity of produce, because the
  command is "on the day of its harvest" with no stated minimum.
- **Rate by irrigation:** natural **10%**; artificial **5%**; both **7.5%** (three-quarters of ʿushr).

## Core Formula(s)
Computed from `(harvestKg, irrigation, pricePerKg, madhab)`.

**Formula 1 — rate.**
```
natural    → 0.10
artificial → 0.05
both       → 0.075
```

**Formula 2 — eligibility (niṣāb).**
```
if rule.requiresNisab AND harvestKg < rule.nisabKg  → not due (below niṣāb)   // majority
else if harvestKg <= 0                              → not due (no harvest)
else                                                → due                      // Hanafi: any amount
```

**Formula 3 — amount.**
```
ushrKg    = harvestKg × rate
ushrValue = ushrKg × pricePerKg     (Money, rounded to 2 dp; 0 when no price entered)
```

## Madhab Divergence Points
| Issue | Hanafi | Shafiʿi | Maliki | Hanbali |
|---|---|---|---|---|
| **Niṣāb** (5 awsuq / ~653 kg) required? | **No** — due on any amount (Abū Ḥanīfa) | **Yes** | **Yes** | **Yes** |
| **Which crops** are zakatable | Nearly **all produce** (Abū Ḥanīfa; his students Abū Yūsuf & Muḥammad restrict it) | Stored **staples** (grains, dates, raisins) | Stored **staples** | Weighed/measured crops (incl. grapes, olives) |

**No divergence on:** the 10% / 5% rates and the both-methods 7.5% rate; that there is **no ḥawl**
(due at harvest); that the rate turns on cost of irrigation, not the water source.

*(V1 models only the niṣāb divergence — the crop-scope row is surfaced in the Learn/notes, not gated;
see Flagged Uncertainties.)*

## Named Special Cases
- **Mixed irrigation (both methods).** Rate is **7.5%** (¾ ʿushr) — the midpoint the majority apply
  when land is watered both ways over the season. If one method clearly predominates, that method's
  rate applies (not modelled — the user picks natural/artificial/both).

## Worked Examples
*(madhab = "majority" = Shafiʿi/Maliki/Hanbali; Hanafi noted where it differs. Niṣāb = 653 kg.)*
1. 1000 kg, **natural**, majority → above niṣāb → 10% → **100 kg**.
2. 1000 kg, **artificial**, majority → 5% → **50 kg**.
3. 1000 kg, **both**, majority → 7.5% → **75 kg**.
4. 500 kg, natural, majority → below niṣāb (500 < 653) → **none**.
5. 500 kg, natural, **Hanafi** → no niṣāb → 10% → **50 kg**.
6. 653 kg, natural, majority → exactly niṣāb → 10% → **65.3 kg**.
7. 652 kg, natural, majority → below niṣāb → **none**.
8. 10 kg, natural, **Hanafi** → 10% → **1 kg**.
9. 1000 kg, natural, majority, **price 2/kg** → 100 kg × 2 → **value 200**.
10. 2000 kg, artificial, majority, **price 1.5/kg** → 100 kg × 1.5 → **value 150**.

## Public Explanation Notes
- **Evidence (rate):** the Prophet ﷺ — "On what is watered by rain and springs or draws its own
  water, a tenth; and on what is watered by artificial means, half of a tenth." **Ṣaḥīḥ al-Bukhārī 1483.**
- **Evidence (harvest, not ḥawl):** "…and give its due (ḥaqqahu) on the day of its harvest." **Qurʾān
  al-Anʿām 6:141.**
- **Evidence (niṣāb):** "There is no ṣadaqah on less than five awsuq." **Bukhārī & Muslim.** The
  Hanafi school reads the harvest command as having no minimum, hence "any amount."
- **Common question:** "Do I deduct my costs (seed, labour, fertiliser)?" The classical majority
  apply ʿushr to the **gross** harvest; some contemporary scholars permit deducting expenses first.
  V1 uses gross and flags this — confirm with a scholar.
- **Vegetables/fruit:** whether perishable produce is zakatable is a school difference; V1 computes on
  whatever quantity you enter and explains the scope rather than deciding it for you.

## Sources
- **Ṣaḥīḥ al-Bukhārī 1483** (rate: tenth vs half-tenth) and **1484** (no ṣadaqah below 5 awsuq),
  *Kitāb al-Zakāt*. https://sunnah.com/bukhari:1483
- **Qurʾān 6:141** — "give its due on the day of its harvest."
- **Islam Q&A (islamqa.info) 99843** — zakat on grains/fruits: niṣāb 5 awsuq ≈ 653 kg, rates, crop
  scope. https://islamqa.info/en/answers/99843
- **SeekersGuidance (Hanafi) — ʿUshr rulings** — Abū Ḥanīfa's no-niṣāb / all-produce position and his
  students' restriction. https://seekersguidance.org/answers/hanafi-fiqh/what-are-the-rulings-for-zakat-on-agricultural-produce-in-the-hanafi-school/
- Sayyid Sābiq, *Fiqh us-Sunnah*, vol. 3 (Zakah on plants and fruit) — cross-madhab summary.

## Flagged Uncertainties
1. **Niṣāb weight in kg.** 5 awsuq = 300 ṣāʿ; the kg equivalent depends on the ṣāʿ weight (≈2.04–2.18
   kg), giving ~612–653 kg across sources. V1 default **653 kg** — confirm the exact figure.
2. **Cost deduction.** V1 applies the rate to the **gross** harvest (classical majority). Confirm
   whether to offer an expenses-deducted mode.
3. **Crop scope** (which produce is zakatable) is a real madhab divergence but **not gated** in V1 —
   the calculator computes on the entered quantity. Confirm this is acceptable, or add a crop-type gate.
4. **Both-methods rate.** V1 uses a flat **7.5%** for "both"; the "predominant method" refinement isn't
   modelled. Confirm.
5. Honey, mined/extracted produce, and rented-land / share-cropping splits are out of V1 scope.

## Implementation Defaults (provisional)
| # | Decision | V1 default | Where |
|---|---|---|---|
| D1 | Niṣāb weight | **653 kg** (5 awsuq) | `core/ushr/constants.ts` |
| D2 | Niṣāb required | Hanafi **false**; majority **true** — RuleModule | `core/ushr/madhab/*` |
| D3 | Rates | natural 10% / artificial 5% / both 7.5% | `core/ushr/constants.ts` |
| D4 | Cost deduction | **none** (gross harvest) | engine |
| D5 | Crop scope | not gated — computes on entered quantity | engine + notes |
| D6 | Value | `ushrKg × pricePerKg`, 2 dp; 0 when no price | engine |

## Changelog
| Date | Version | Change | Requested by |
|---|---|---|---|
| 2026-07-15 | 0.1 | Initial researched draft (research-provisional): 10/5/7.5% rates, 5-awsuq niṣāb, Hanafi no-niṣāb divergence, harvest→ʿushr→value, 10 worked examples. | user |
| 2026-07-15 | 0.2 | Post-QA fixes: not-due UI distinguishes "below niṣāb" from "no harvest" (Hanafi correctness); price-per-kg made genuinely optional. | qa |
