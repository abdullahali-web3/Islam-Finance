---
domain: qurbani
status: research-provisional
version: 0.1
last_updated: 2026-07-13
scholar_reviewer: unassigned
madhab_dependent: true
---

> **Provisional build (ADR 0013).** Researched + cited, **not yet scholar-verified**. Ships with the
> disclaimer. Constants trace to ## Sources; open choices in ## Implementation Defaults.

# Fiqh Rule Specification: Qurbani / Udhiyah

## Scope
The Eid al-Adha sacrifice (Qurbani / Udhiyah): an **eligibility indication** (obligatory vs strongly
recommended, by madhab), the **number of shares/animals** needed for a given number of people, and a
**cost estimate**. It does not choose animals or handle distribution of meat (explained in Learn only).

## Definitions & Terminology
- **Udhiyah / Qurbani** — the sacrifice of a permitted animal on the days of Nahr (10–13 Dhul-Hijjah).
- **Share** — a portion of a sacrificial animal. A **sheep or goat = 1 share** (one whole animal); a
  **cow, buffalo, or camel = up to 7 shares**.
- **Nisab** — here, owning wealth beyond one's needs at the Zakat-nisab level, on the days of Nahr
  (the Hanafi trigger for obligation).

## Nisab / Threshold Constants
- **Shares per animal:** sheep/goat **1**, cow/buffalo **7**, camel **7**.
- **Days:** 10–13 Dhul-Hijjah (the days of sacrifice). Not modeled beyond a note.

## Core Formula(s)
1. **Eligibility:** `obligatory` if (madhab treats it as wajib **and** the person owns nisab and is a
   resident adult); otherwise `recommended` (sunnah muʾakkadah). V1 assumes an adult Muslim user.
2. `shares = people` (one share per person's Qurbani intention).
3. `animals = ceil(shares / sharesPerAnimal(animal))`.
4. `cost = shares × pricePerShare` (per-share pricing; a sheep/goat share = the whole animal's price).

## Madhab Divergence Points
| Issue | Hanafi | Shafiʿi | Maliki | Hanbali |
|---|---|---|---|---|
| Ruling | **Wajib** on every resident adult who owns nisab | Sunnah muʾakkadah | Sunnah muʾakkadah | Sunnah muʾakkadah |
| Per person vs household | **Per eligible person** | One per household suffices | One per household suffices | One per household suffices |

No divergence on: shares per animal (1 sheep/goat, 7 cow/camel), or the days of sacrifice.

## Named Special Cases
None modeled. (Animal age/health conditions are a selection matter for Learn, not this calculator.)

## Worked Examples
1. **Hanafi, owns nisab, 1 person, sheep @ $150.** → **obligatory**, 1 share, 1 animal, **$150**.
2. **Shafiʿi, 1 person, sheep @ $150.** → **recommended**, 1 share, 1 animal, **$150**.
3. **Hanafi, owns nisab, 7 people, cow @ $100/share.** → obligatory, 7 shares, **1 cow**, **$700**.
4. **3 people, cow @ $100/share.** → 3 shares, ceil(3/7) = **1 cow**, **$300**.
5. **10 people, cow @ $100/share.** → 10 shares, ceil(10/7) = **2 cows**, **$1,000**.
6. **Hanafi, does NOT own nisab, 1 person, sheep @ $150.** → **recommended** (not obligatory), **$150**.

## Public Explanation Notes
- Evidence: Qurʾān 108:2 (*fa-ṣalli li-rabbika wa-nḥar*) and the Prophet's ﷺ practice; hadith on the
  days of sacrifice and permitted animals (Bukhari/Muslim). One sheep suffices for a man and his
  household (hadith) — the basis of the non-Hanafi per-household view.
- Explain: the wajib-vs-sunnah difference by school, and that a cow/camel is shared by up to 7.

## Sources
- Qurʾān 108:2; Ṣaḥīḥ al-Bukhārī & Muslim (Kitāb al-Aḍāḥī).
- Wahba al-Zuḥaylī, *al-Fiqh al-Islāmī wa-Adillatuh* (Udhiyah chapter); Ibn Rushd, *Bidāyat al-Mujtahid*.

## Flagged Uncertainties
1. Exact nisab basis for the Hanafi obligation trigger (same as Zakat nisab? beyond-needs wealth?) —
   confirm what the app should test.
2. Whether to model the per-person (Hanafi) vs per-household (others) count automatically or leave the
   people count to the user (V1 leaves it to the user, with a note).

## Implementation Defaults (provisional)
| # | Decision | V1 default | Where |
|---|---|---|---|
| D1 | Shares/animal | sheep-goat 1, cow-camel 7 | `core/qurbani/constants.ts` |
| D2 | Obligation | Hanafi wajib-if-nisab; others recommended — RuleModule | `core/qurbani/madhab/*` |
| D3 | People count | user-entered (per-person vs household explained, not auto) | UI note |
| D4 | Cost | `shares × pricePerShare` | engine |

## Changelog
| Date | Version | Change | Requested by |
|---|---|---|---|
| 2026-07-13 | 0.1 | Initial researched draft (research-provisional). | user |
