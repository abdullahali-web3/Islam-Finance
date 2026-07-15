---
domain: qada
status: research-provisional
version: 0.1
last_updated: 2026-07-15
scholar_reviewer: unassigned
madhab_dependent: true
---

> **Provisional build (ADR 0013).** Researched + cited, **not yet scholar-verified**. Ships with the
> disclaimer until a scholar reviews outputs. Every constant traces to ## Sources; open choices are
> pinned in ## Implementation Defaults, nothing invented silently.

# Fiqh Rule Specification: Qaḍāʾ (Making Up Missed Prayers & Fasts)

## Scope
A counting aid for **qaḍāʾ** — obligatory worship a person needs to make up. Two modes:
- **Prayers (Qaḍāʾ al-Ṣalāh):** total obligatory prayers owed over a stated period, **excluding a
  woman's menstruation days** (on which prayer is neither performed nor made up), and **adding Witr**
  for the Hanafi school (which holds Witr wājib and thus subject to qaḍāʾ).
- **Fasts (Qaḍāʾ al-Ṣawm):** Ramadan fasts to make up **one-for-one**, plus a flag that **fidya is
  also owed** if the makeup was delayed past the next Ramadan without excuse (majority; not Hanafi).

**In scope:** the count only. **NOT in scope (flagged):** determining the *start* of the obligation
(bulūgh / when the person began/stopped praying) — the user supplies the period; the actual **fidya
amount** for delayed fasts (that is the separate Fidya calculator — this only flags that it applies);
and the order (tartīb) of making up prayers.

## Definitions & Terminology
- **Qaḍāʾ** — performing an obligatory act of worship after its prescribed time, to discharge the debt.
- **Fard prayers** — the five daily obligatory prayers (Fajr, Ẓuhr, ʿAṣr, Maghrib, ʿIshāʾ).
- **Witr** — a prayer the Hanafi school rules **wājib** (so it is made up); the majority rule it a
  confirmed sunnah (not subject to qaḍāʾ).
- **Ḥayḍ** — menstruation. During it a woman does **not** pray and does **not** make those prayers up,
  but she **does** make up the Ramadan **fasts** missed.
- **Bulūgh** — puberty; when the obligations begin (not computed here — user supplies the period).

## Nisab / Threshold Constants
None (qaḍāʾ is a count, not a wealth threshold). Approximation constants for converting a period to
days: **1 year = 365 days**, **1 month = 30 days** (D1, flagged — the user may enter days directly).
Default **menstruation = 7 days per month** (D2, adjustable by the user).

## Core Formula(s)
Computed from `(mode, years, months, days, gender, menstruationDaysPerMonth, missedFastDays,
delayedPastRamadan, madhab)`.

**Prayers mode.**
```
totalDays        = years×365 + months×30 + days
menstruationDays = gender === 'female'
                     ? min(totalDays, round( (totalDays / 30) × menstruationDaysPerMonth ))
                     : 0
prayerDays       = max(0, totalDays − menstruationDays)     // days on which prayer was owed
fardTotal        = prayerDays × 5
witrTotal        = rule.includesWitr ? prayerDays : 0        // Hanafi adds Witr
total            = fardTotal + witrTotal                     // 5/day majority, 6/day Hanafi
```

**Fasts mode.**
```
fastsToMakeUp   = missedFastDays                              // one-for-one
fidyaDueForDelay = delayedPastRamadan AND rule.fidyaForDelayedFast   // majority yes, Hanafi no
```

## Madhab Divergence Points
| Issue | Hanafi | Shafiʿi | Maliki | Hanbali |
|---|---|---|---|---|
| **Witr** counted in prayer qaḍāʾ? | **Yes** — wājib, 6 prayers/day | No (sunnah) — 5/day | No — 5/day | No — 5/day |
| **Fidya** owed for delaying a fast's makeup past the next Ramadan? | **No** — make up only | **Yes** — make up + fidya | **Yes** | **Yes** |

**No divergence on:** the five daily fard prayers being owed; menstruation days being **excluded from
prayer** qaḍāʾ but **included in fast** qaḍāʾ; fasts made up one-for-one; that making up missed fard
prayers is obligatory. (A minority Ẓāhirī view — an *intentionally* abandoned prayer cannot be made up
— is noted for Learn, not modelled.)

## Named Special Cases
- **Menstruation and the two obligations differ.** The engine subtracts menstruation days in **prayers**
  mode only; in **fasts** mode the missed days (incl. menstruation) are all made up, so no subtraction.
- **Witr changes the per-day count** from 5 (majority) to 6 (Hanafi). The result names the Witr rows so
  the user sees why the Hanafi total is higher.

## Worked Examples
*("majority" = Shafiʿi/Maliki/Hanbali. Prayers use 1yr=365, 1mo=30 days.)*

**Prayers**
1. Male, 1 year, majority → 365 days × 5 = **1825 prayers**.
2. Male, 1 year, **Hanafi** → 365 × 6 = **2190 prayers** (incl. 365 Witr).
3. Female, 1 year, 7 menstruation-days/month, majority → menstruation = round(365/30×7)=85;
   prayerDays = 280; 280 × 5 = **1400 prayers**.
4. Female, 1 year, 5 menstruation-days/month, **Hanafi** → menstruation = round(365/30×5)=61;
   prayerDays = 304; 304 × 6 = **1824 prayers** (fard 1520 + Witr 304).
5. Male, 2 years 6 months, majority → 730+180 = 910 days × 5 = **4550 prayers**.
6. Male, 0 period → **0 prayers** (engine boundary — the input form itself requires a non-empty
   period, so this is a fixture for the engine, not a user-reachable screen state).

**Fasts**
7. 30 fasts, not delayed, majority → **make up 30**, no fidya.
8. 30 fasts, **delayed**, majority → **make up 30**, **fidya also due**.
9. 30 fasts, delayed, **Hanafi** → **make up 30**, **no fidya** (Hanafi: makeup only).
10. 60 fasts, not delayed → **make up 60**, no fidya.

## Public Explanation Notes
- **Menstruation asymmetry (the key evidence):** Muʿādha asked ʿĀʾisha (رضي الله عنها) why a
  menstruating woman makes up fasts but not prayers; she replied, "We were ordered to make up the fasts
  and were not ordered to make up the prayers." **Ṣaḥīḥ Muslim 335** (also al-Bukhārī, *Kitāb al-Ḥayḍ*).
- **Making up missed prayers is obligatory** — "Whoever forgets a prayer, let him pray it when he
  remembers" (al-Bukhārī 597, Muslim 684). Scholars extend the makeup duty to missed prayers generally.
- **Witr:** the Hanafi school counts Witr as wājib (a sixth make-up each day); the other schools treat
  it as a strong sunnah, not a qaḍāʾ obligation.
- **Delayed fasts:** if someone delays making up Ramadan fasts until the following Ramadan without a
  valid excuse, the majority hold they make up the fast **and** pay fidya (feed a poor person per day);
  the Hanafis require only the makeup. This calculator flags it; the **Fidya calculator** computes the
  amount.

## Sources
- **Ṣaḥīḥ Muslim 335** (and **al-Bukhārī**, *Kitāb al-Ḥayḍ*) — ʿĀʾisha: make up fasts, not prayers.
  https://sunnah.com/muslim:335c
- **Ṣaḥīḥ al-Bukhārī 597 / Muslim 684** — make up a prayer when remembered. https://sunnah.com/bukhari:597
- **SeekersGuidance (Hanafi)** — Witr wājib → 6 make-ups/day; obligation to make up missed prayers.
  https://seekersguidance.org/answers/hanafi-fiqh/what-is-the-ruling-of-praying-missed-prayers-how-do-i-correctly-make-up-missed-prayers/
- Sayyid Sābiq, *Fiqh us-Sunnah* (Ṣiyām — qaḍāʾ and fidya for delayed makeup); Ibn ʿAbbās/Abū Hurayra
  narrations on fidya for delay (majority basis).

## Flagged Uncertainties
1. **Day conversion.** 1yr=365, 1mo=30 (D1). Prayer qaḍāʾ is by calendar day; the year/month multipliers
   are approximations — user can enter days directly. Confirm the multipliers.
2. **Menstruation averaging.** A flat days/month average (default 7) is applied across the whole period
   (D2); real cycles vary. Confirm the default and the averaging approach.
3. **Start of obligation** (bulūgh / when praying began) is **not** computed — the user supplies the
   period. Confirm this is acceptable (vs a date-based bulūgh calculation).
4. **Nifās (post-natal bleeding)** is not separately modelled (same prayer-exemption logic as ḥayḍ, but
   variable length). Confirm whether to add it.
5. **Intentionally-abandoned prayers** (Ẓāhirī dissent) — V1 counts them as owed like the majority.

## Implementation Defaults (provisional)
| # | Decision | V1 default | Where |
|---|---|---|---|
| D1 | Day conversion | 1yr=365, 1mo=30 | `core/qada/constants.ts` |
| D2 | Menstruation | 7 days/month (adjustable); excluded from prayers only | schema default + engine |
| D3 | Witr in prayer qaḍāʾ | Hanafi yes (6/day), others no (5/day) — RuleModule | `core/qada/madhab/*` |
| D4 | Fidya for delayed fast | majority yes, Hanafi no — flag only (amount via Fidya calc) | `core/qada/madhab/*` |
| D5 | Fast makeup | one-for-one; menstruation days included | engine |

## Changelog
| Date | Version | Change | Requested by |
|---|---|---|---|
| 2026-07-15 | 0.1 | Initial researched draft (research-provisional): prayers (5/6 per day, menstruation exclusion, Witr divergence) + fasts (one-for-one, fidya-for-delay divergence), 10 worked examples. | user |
| 2026-07-15 | 0.2 | Post-QA: mode-based conditional field visibility added to the shared form (prayers vs fasts inputs); removed a dead constant; clarified Ex6 as an engine boundary. | qa |
