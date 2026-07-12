---
domain: zakat
status: draft
version: 0.1
last_updated: 2026-07-13
scholar_reviewer: unassigned
madhab_dependent: true
---

# Fiqh Rule Specification: Zakat

## Scope
Covers Zakat on: cash/savings/bank balances, gold and silver (including personal-use jewelry),
business/trade inventory (Zakat al-Tijarah), and Zakat al-Fitr (Fitrana amount only — the
notification/reminder feature is out of scope for this doc). Zakat on stocks/shares, agricultural
produce (Ushr), and livestock are deferred to a later doc/phase (Phase 3) given their niche
applicability to this app's likely user base — noted here so `new-calculator` doesn't
double-scaffold them under this domain.

## Definitions & Terminology
- **Nisab**: the minimum threshold of wealth above which Zakat becomes obligatory.
- **Haul**: the one full lunar (Hijri) year a qualifying amount of wealth must be held before Zakat
  is due.
- **Zakat al-Tijarah**: Zakat on goods held with the intent to resell for profit.
- **Zakat al-Fitr / Fitrana**: a per-person obligatory charity paid before Eid al-Fitr prayer.
- **Asnaf**: the eight Quranic categories of Zakat recipients (Qur'an 9:60).

## Nisab / Threshold Constants
- **Gold nisab**: 87.48g (default) — an alternate simplified 85g figure exists in common use;
  configurable, not hardcoded singly. **Flagged for scholar decision** (see below).
- **Silver nisab**: 595g (default, AAOIFI-aligned) — an alternate 612.36g figure also exists;
  configurable. **Flagged for scholar decision.**
- **Cash/savings nisab basis**: default to **silver** nisab valuation (lower of gold/silver at
  current prices, per NZF/Islamic Relief/Zakat Foundation convention) unless the scholar directs
  otherwise. **Flagged: a live disagreement exists between IIFA (favors gold) and Muslim World
  League/Saudi Senior Scholars (favor "lower of the two," practically silver) — needs explicit
  scholar instruction, not a silent default.**
- **Zakat rate**: 2.5% for a lunar-year haul (default); 2.5772% permitted adjustment if the user
  tracks their zakat year on the Gregorian calendar instead (AAOIFI-sanctioned).
- **Business inventory nisab**: same as cash (valued in the same currency, combined with cash/gold/
  silver holdings toward one nisab check).
- **Zakat al-Fitr per-person amount**: no universal constant — this is a per-country/per-year cash
  figure set by local fatwa councils. Implementation must treat this as a configurable value
  (looked up by country + year), never a hardcoded constant.

## Core Formula(s)
1. **Cash/savings**: `zakatable_cash = total_cash_and_equivalents - deductible_debts` (see below).
   If `zakatable_cash >= nisab_value` and haul has passed: `zakat_due = zakatable_cash * rate`.
2. **Gold/silver**: `zakat_due = market_value(grams_held) * rate`, where `market_value` uses a live
   gold/silver price feed with a cached last-known-good fallback and manual override. Whether
   personal-use jewelry is included depends on madhab (see Madhab Divergence Points).
3. **Business inventory**: `zakatable_base = inventory_at_current_market_value + business_cash +
   receivables - business_liabilities_due`; `zakat_due = zakatable_base * rate` if base meets nisab.
   Only "currently due" receivables/liabilities are counted — not a full multi-year loan balance,
   only the portion due within the coming lunar year.
4. **Debt deduction (general)**: deduct only debt/installments due within the coming lunar year from
   zakatable wealth, not the full outstanding balance of long-term debts. **Flagged: this
   "next-12-months-only" convention is a contemporary practitioner convergence, not an explicit
   classical ruling — confirm with scholar.**
5. **Zakat al-Fitr**: `fitrana_due = per_person_amount(country, year) * household_size`. Default to
   cash payment (near-universal contemporary practice); do not build an in-kind/Sa'a-quantity mode
   for V1 unless the scholar requests it.

## Madhab Divergence Points

| Issue | Hanafi | Shafi'i | Maliki | Hanbali |
|---|---|---|---|---|
| Personal-use jewelry (worn, not hoarded/traded) | Zakatable regardless of use | Exempt if customary personal adornment (women); men's jewelry remains zakatable | Exempt within customary/reasonable limits; excess beyond customary use becomes zakatable | Majority position: exempt (a minority Hanbali view, incl. Ibn Taymiyyah, holds it zakatable — flagged for scholar) |
| Haul continuity | Only checks nisab at start + end of year; dips below nisab mid-year don't reset the clock (unless wealth hits zero/negative) | Requires continuous nisab throughout the year; any dip below nisab resets the haul clock | Same as Shafi'i | Same as Shafi'i |
| Cash nisab basis (classical default) | Silver | Gold | Gold | Gold |
| "Strong debt" receivables timing (business use) | Deferred until actually collected | Retroactive zakat for all years outstanding, once received | One year's zakat only, upon receipt, regardless of years outstanding | Not fully resolved in this draft — flagged for scholar |

No divergence identified for: the 2.5%/2.5772% rate mechanic, the 8 Asnaf categories, or the general
shape of the business-inventory formula.

## Named Special Cases
None identified for Zakat (unlike Inheritance) — the divergence points above are configuration-level
branches (jewelry, haul-continuity, receivables timing), not distinct named exception scenarios.

## Worked Examples

1. **Cash, straightforward**: Cash held = $10,000, no debts, silver nisab currently = $600, haul
   complete, lunar year tracking. Expected: $10,000 >= $600 → zakat due = $10,000 * 2.5% = **$250**.
2. **Cash with debt deduction**: Cash held = $10,000, $3,000 due within the coming lunar year in
   personal debt. Expected: zakatable base = $10,000 - $3,000 = $7,000 → zakat due = $7,000 * 2.5%
   = **$175**.
3. **Gold jewelry, Hanafi**: 100g personal-use gold jewelry (worn daily, not hoarded), gold price =
   $70/g, madhab = Hanafi. Expected: zakatable (Hanafi taxes jewelry regardless of use) → zakat due
   = 100 * $70 * 2.5% = **$175**.
4. **Gold jewelry, Shafi'i**: same 100g worn jewelry, madhab = Shafi'i, owner is female, customary
   personal use. Expected: **exempt, $0 zakat due** on the jewelry (Shafi'i majority position).
5. **Business inventory**: inventory at market value = $50,000, business cash = $5,000, receivables
   due now = $2,000, liabilities due now = $10,000. Expected: zakatable base = $50,000 + $5,000 +
   $2,000 - $10,000 = $47,000 → zakat due = $47,000 * 2.5% = **$1,175**.
6. **Below nisab**: Cash held = $400, silver nisab = $600. Expected: below nisab → **$0 zakat due**,
   no haul tracking needed.

*(All example rates/prices are illustrative constants for testing, not live scholar-confirmed
market values — replace with the scholar-approved nisab constants once confirmed.)*

## Public Explanation Notes
- Key evidence: Zakat is one of the five pillars of Islam (Qur'an 2:43, 9:60 for recipients); the
  2.5% cash rate and nisab concept trace to hadith (e.g., Sahih al-Bukhari's Zakat chapters) rather
  than a single Qur'anic verse specifying the exact rate.
- Common misconception to address: "I don't need to pay Zakat on jewelry I wear" — true under some
  madhabs (Shafi'i/Maliki/Hanbali, with conditions), not universally true (Hanafi) — the article
  should clearly explain this depends on the user's selected madhab, not give one blanket answer.
- Common misconception: "Zakat is due on my total savings including money I've already spent or
  owe to others" — the article should explain the debt-deduction concept simply.
- Suggested video references: reputable, established scholars/organizations explaining Zakat basics
  (to be curated by `learn-content-writer` closer to publication — no specific links pre-selected
  here to avoid the doc going stale).

## Sources
- AAOIFI Shariah Standard No. 35 (Zakah) and No. 21 (Financial Papers/Shares and Bonds).
- International Islamic Fiqh Academy (IIFA) resolutions on nisab/gold-vs-silver.
- Fiqh Council of the Muslim World League; Saudi Council of Senior Scholars ("lower of the two"
  nisab position).
- Wahbah al-Zuhayli, *Al-Fiqh al-Islami wa Adillatuh*, Vol. 3.
- Documented methodology pages: National Zakat Foundation (NZF, UK), Islamic Relief Worldwide,
  Zakat Foundation of America.
- islamqa.org (madhab-tagged) for spot-checking individual claims above.

## Flagged Uncertainties
1. Gold/silver gram constants: 85g vs 87.48g gold, 595g vs 612.36g silver — need scholar's final
   choice for the hardcoded default (both are legitimate rounding conventions, not a live dispute).
2. Cash nisab metal: IIFA (gold) vs. Muslim World League/Saudi Senior Scholars ("lower of the two")
   — needs explicit scholar instruction for the app default, and whether to expose as a user
   setting regardless.
3. Maliki's "customary/excess" jewelry test is inherently qualitative — needs scholar guidance on
   whether the app can encode any heuristic here or should simply disclaim it as a judgment call.
4. "Next-12-months-only" debt deduction convention — confirm this simplification is acceptable
   across all four madhabs for the app's default (non-accountant) mode.
5. Receivables/"strong debt" 3-way madhab split (Hanafi defer / Shafi'i retroactive / Maliki one
   year) — confirm whether V1 needs this at all, given it mainly matters for business users with
   real receivables ledgers rather than typical retail users.

## Changelog
| Date | Version | Change | Requested by |
|---|---|---|---|
| 2026-07-13 | 0.1 | Initial draft from Phase 0 research session | user |
