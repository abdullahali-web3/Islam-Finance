---
domain: fitrana
status: research-provisional
version: 0.1
last_updated: 2026-07-13
scholar_reviewer: unassigned
madhab_dependent: true
---

> **Provisional build (ADR 0013).** Researched + cited, **not yet scholar-verified**. Ships with the
> disclaimer until a scholar reviews outputs. Every constant traces to ## Sources; open choices are
> pinned in ## Implementation Defaults, nothing invented silently.

# Fiqh Rule Specification: Zakat al-Fitr (Fitrana)

## Scope
The per-person Zakat al-Fitr (Fitrana / Sadaqat al-Fitr) obligation and the household total. Computes
either from a **per-person amount** (as announced by the user's mosque/council) or by **estimating**
one ṣāʿ of a staple food × its price. In-kind vs cash is a madhab point (below). Distribution to the
poor, and *who* pays for whom, are explained in Public Notes but not modeled beyond a household count.

## Definitions & Terminology
- **Zakat al-Fitr / Sadaqat al-Fitr / Fitrana** — an obligatory charity per person, paid before the
  Eid al-Fitr prayer, on behalf of every member of the household the payer is responsible for.
- **Ṣāʿ** — a prophetic volume measure ≈ 4 mudd. In weight it is commonly given as **~2.5–3 kg** of a
  staple, varying by the food's density and the source (see Flagged Uncertainties).

## Nisab / Threshold Constants
- **Amount per person:** **one ṣāʿ** of a staple food (dates, barley, raisins, wheat/flour, rice), or
  its cash value. **Ṣāʿ weight default: 2.5 kg** (approx; flagged). Hanafi permit **half a ṣāʿ of
  wheat/flour** (its higher value balances the smaller volume).
- **Eligibility to owe it:** anyone with food/means beyond their and their dependents' needs for the
  day and night of Eid. (V1 does not gate on this; it's explained, and the user decides.)

## Core Formula(s)
1. `total = perPersonAmount × people`.
2. Estimator (when computing per-person from food): `perPersonAmount = saMultiplier × SA_KG × pricePerKg`,
   where `SA_KG = 2.5`, and `saMultiplier = 0.5` for **Hanafi + wheat/flour**, else `1.0`.

## Madhab Divergence Points
| Issue | Hanafi | Shafiʿi | Maliki | Hanbali |
|---|---|---|---|---|
| Paying **cash** (value) instead of food | **Permitted** | Classically **in-kind food** (cash is a contemporary accommodation many councils allow) | In-kind | In-kind |
| **Wheat/flour** quantity | **½ ṣāʿ** permitted | 1 ṣāʿ | 1 ṣāʿ | 1 ṣāʿ |

No divergence on: the one-ṣāʿ measure for dates/barley/raisins, paying before the Eid prayer, or
paying on behalf of dependents.

## Named Special Cases
None. (Whether Fitrana is due for an unborn child is a minor optional matter — noted for the Learn
article, not modeled.)

## Worked Examples
1. **By per-person amount.** 5 people, $10 per person → **$50**.
2. **By staple (non-Hanafi, dates).** 4 people, dates at $4/kg, 1 ṣāʿ = 2.5 kg → per person 2.5×4 =
   $10 → total **$40**.
3. **By staple (Hanafi, wheat).** 4 people, wheat at $2/kg, ½ ṣāʿ = 1.25 kg → per person 1.25×2 =
   $2.50 → total **$10**.
4. **By staple (Hanafi, dates — not wheat, so full ṣāʿ).** 2 people, dates $4/kg, 2.5 kg → per person
   $10 → total **$20**.

## Public Explanation Notes
- Evidence: Ibn ʿUmar (رضي الله عنه) — the Prophet ﷺ made Zakat al-Fitr **one ṣāʿ of dates or one ṣāʿ
  of barley** obligatory, to be paid before the people go out to the Eid prayer (Bukhari & Muslim).
- Common question: cash vs food — depends on the madhab; many councils today accept cash for
  convenience. The app lets the user pick and states this depends on their school.
- The payer covers themselves and their dependents (spouse, children, etc.).

## Sources
- Ṣaḥīḥ al-Bukhārī & Muslim, *Kitāb Zakāt al-Fiṭr* (Ibn ʿUmar).
- Wahba al-Zuḥaylī, *al-Fiqh al-Islāmī wa-Adillatuh* (Zakat al-Fitr chapter).
- Contemporary council per-person figures (NZF, Islamic Relief) — used to sanity-check ṣāʿ weight.

## Flagged Uncertainties
1. **Ṣāʿ weight in kg** (2.0–3.0 kg range across sources/foods). Default 2.5 kg — confirm, and whether
   to vary it per staple.
2. **Hanafi ½-ṣāʿ wheat weight** — confirm the exact kg the app should use.
3. Whether to expose an "unborn child" toggle.

## Implementation Defaults (provisional)
| # | Decision | V1 default | Where |
|---|---|---|---|
| D1 | Ṣāʿ weight | **2.5 kg** (all staples) | `core/fitrana/constants.ts` |
| D2 | Hanafi wheat | **½ ṣāʿ** (multiplier 0.5) — RuleModule | `core/fitrana/madhab/*` |
| D3 | Cash allowed | **informational note** (not blocked) per school | UI note |
| D4 | Total | `perPerson × people` | engine |

## Changelog
| Date | Version | Change | Requested by |
|---|---|---|---|
| 2026-07-13 | 0.1 | Initial researched draft (research-provisional). | user |
