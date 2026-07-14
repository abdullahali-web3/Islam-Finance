---
domain: fidya
status: research-provisional
version: 0.1
last_updated: 2026-07-13
scholar_reviewer: unassigned
madhab_dependent: false
---

> **Provisional build (ADR 0013).** Researched + cited, **not yet scholar-verified**. Ships with the
> disclaimer. Constants trace to ## Sources; open choices in ## Implementation Defaults.

# Fiqh Rule Specification: Fidya & Kaffarah (Fasting)

## Scope
Two fasting-related expiations: **Fidya** (feeding a poor person for each fast a person genuinely
cannot make up — e.g. chronic illness, old age) and **Kaffarah** (the grave expiation for
*deliberately* breaking a Ramadan fast without a valid excuse). Both reduce to feeding poor people; the
app computes the monetary total from a per-meal/per-day feeding amount the user provides (their local
mosque/council figure). **Oath (yamīn) kaffarah and other kaffārāt are out of scope** for this
calculator. `madhab_dependent: false` — the *amount per person* differs slightly by school (noted
below) but the app takes it as an input, so the arithmetic is madhab-neutral.

## Definitions & Terminology
- **Fidya** — compensation for a missed fast that cannot be made up: feed **one poor person for one
  day** per missed fast.
- **Kaffarah** — for deliberately breaking a Ramadan fast: in order, freeing a slave (not applicable
  today), else fasting **60 consecutive days**, else **feeding 60 poor people** — **for each day**
  broken.
- **Feeding amount** — one poor person's day of food; classically ~half a ṣāʿ of wheat (Hanafi) or one
  mudd (~0.6–0.75 kg) of staple (others), or its value. The app uses the user-provided cash figure.

## Nisab / Threshold Constants
- **Kaffarah multiplier:** **60** people fed per broken fast day.
- **Fidya:** 1 person fed per missed fast.

## Core Formula(s)
- **Fidya:** `total = missedFasts × perDayAmount`; `peopleFed = missedFasts`.
- **Kaffarah:** `total = brokenFasts × 60 × perDayAmount`; `peopleFed = brokenFasts × 60`.

## Madhab Divergence Points
No divergence in the **structure** (1 person for fidya, 60 for kaffarah, the kaffarah ordering). The
**quantity per person** differs (Hanafi ~½ ṣāʿ wheat; others ~1 mudd) — but the app takes the cash
amount per person as input, so this doesn't branch in code. Stated explicitly so
`madhab-consistency-auditor` reads this as "not applicable," not "forgotten."

## Named Special Cases
- Pregnant/nursing women who don't fast: whether they owe fidya, qada, or both is a **known scholarly
  difference** — explained in Learn; the calculator just computes whichever the user chooses to pay.

## Worked Examples
1. **Fidya, 30 missed fasts @ $5.** → **$150**, 30 people fed.
2. **Kaffarah, 1 broken fast @ $5/meal.** → 60 × 5 = **$300**, 60 people fed.
3. **Kaffarah, 2 broken fasts @ $5.** → 2 × 300 = **$600**, 120 people fed.
4. **Fidya, 10 missed fasts @ $3.** → **$30**.

## Public Explanation Notes
- Evidence: Qurʾān 2:184 (fidya — *feeding a poor person* for those who can only fast with hardship);
  the hadith of the man who broke his fast in Ramadan and was ordered to free a slave, else fast two
  months, else feed sixty poor people (Bukhari & Muslim) — the basis of kaffarah.
- Explain the difference between fidya (can't make up) and qada (making up the fast later), and that
  kaffarah is for *deliberate* breaking, not an excused break.

## Sources
- Qurʾān 2:184; Ṣaḥīḥ al-Bukhārī & Muslim (the kaffarah hadith).
- Wahba al-Zuḥaylī, *al-Fiqh al-Islāmī wa-Adillatuh* (Sawm chapter).

## Flagged Uncertainties
1. The default per-day feeding amount (left to the user; app suggests using a local council figure).
2. Pregnant/nursing ruling (fidya vs qada vs both) — for the Learn article and any future guidance.

## Implementation Defaults (provisional)
| # | Decision | V1 default | Where |
|---|---|---|---|
| D1 | Kaffarah multiplier | **60** per broken day | `core/fidya/index.ts` (`KAFFARAH_PEOPLE_PER_DAY`) |
| D2 | Fidya | 1 person per missed fast | engine |
| D3 | Per-day amount | user-provided (local figure) | UI |

## Changelog
| Date | Version | Change | Requested by |
|---|---|---|---|
| 2026-07-13 | 0.1 | Initial researched draft (research-provisional). | user |
