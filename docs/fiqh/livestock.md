---
domain: livestock
status: research-provisional
version: 0.2
last_updated: 2026-07-15
scholar_reviewer: unassigned
madhab_dependent: true
---

> **Provisional build (ADR 0013).** Researched + cited, **not yet scholar-verified**. Ships with the
> disclaimer until a scholar reviews outputs. Every constant traces to ## Sources; open choices are
> pinned in ## Implementation Defaults, nothing invented silently.

# Fiqh Rule Specification: Zakat on Livestock (Zakāt al-Anʿām)

## Scope
Zakat on the three classical grazing-livestock categories — **camels (ibil)**, **cattle (baqar,
incl. buffalo)**, and **sheep & goats (ghanam)** — for a **single owner** whose herd has completed a
lunar year (ḥawl). Output is the **in-kind due** described by animal type and age (e.g. "1 bint labūn
— a 2-year-old she-camel", or "3 sheep"), plus a per-madhab note on whether its cash value may be
paid instead.

**In scope:** the agreed niṣāb tables for all three species (camels 5→120 exactly, cattle by the
30/40 rule, sheep/goats through the 1-per-100-above-300 rule); the ḥawl gate; the grazing (sāʾimah)
and working-animal (ʿawāmil) conditions with their madhab split; the camel-above-120 majority rule.

**Explicitly NOT modelled in V1 (see Flagged Uncertainties):** horses (khayl); mixed-ownership herds
(khulṭa); the distinct Hanafi camel-above-120 scheme; paying value/cash as a *computed* branch (it is
surfaced as a note, not a second number); cross-species aggregation (each species is assessed on its
own count). These are flagged, never silently resolved.

## Definitions & Terminology
- **Zakāt al-Anʿām** — zakat on grazing livestock.
- **Sāʾimah** — livestock that **freely graze** on public pasture for **most of the year**, as
  opposed to *maʿlūfah* (fodder-fed) and *ʿawāmil* (working animals used for plough/haulage/irrigation).
- **Ḥawl** — one full lunar year of continuous ownership of a niṣāb-reaching herd.
- **Niṣāb** — the minimum count below which no zakat is due (camels 5, cattle 30, sheep/goats 40).
- **Waqṣ** (pl. *awqāṣ*) — the gap **between** two niṣāb tiers on which **no additional** zakat is
  owed (e.g. a herd of 9 camels pays the same as 5). Built into the tiered tables below.
- **Ghanam** — sheep (*ḍaʾn*) and goats (*maʿz*) counted together as one category.
- Camel ages (she-camels): **bint makhāḍ** (completed 1 yr) · **bint labūn** (completed 2 yrs) ·
  **ḥiqqah** (completed 3 yrs) · **jadhaʿah** (completed 4 yrs).
- Cattle ages: **tabīʿ / tabīʿah** (completed 1 yr) · **musinnah** (completed 2 yrs).
- **Shāh / shiyāh** — a sheep or goat given as the zakat unit for small camel herds (5–24).

## Nisab / Threshold Constants
- **Camels — niṣāb 5.** Below 5: no zakat.
- **Cattle — niṣāb 30.** Below 30: no zakat.
- **Sheep & goats — niṣāb 40.** Below 40: no zakat.
- **Ḥawl:** one lunar year of ownership must elapse on the herd.

### Camel table (agreed across all four madhabs for 5–120)
| Herd size | Zakat due |
|---|---|
| 5–9 | 1 shāh (sheep/goat) |
| 10–14 | 2 shāh |
| 15–19 | 3 shāh |
| 20–24 | 4 shāh |
| 25–35 | 1 bint makhāḍ (♀ camel, completed 1 yr) |
| 36–45 | 1 bint labūn (completed 2 yrs) |
| 46–60 | 1 ḥiqqah (completed 3 yrs) |
| 61–75 | 1 jadhaʿah (completed 4 yrs) |
| 76–90 | 2 bint labūn |
| 91–120 | 2 ḥiqqah |
| **above 120** | **majority rule:** for every 40 → 1 bint labūn, for every 50 → 1 ḥiqqah (see Formula 4) |

### Cattle table (per the 30/40 rule, agreed)
| Herd size | Zakat due |
|---|---|
| 30–39 | 1 tabīʿ (completed 1 yr) |
| 40–59 | 1 musinnah (completed 2 yrs) |
| 60–69 | 2 tabīʿ |
| 70–79 | 1 tabīʿ + 1 musinnah |
| 80–89 | 2 musinnah |
| 90–99 | 3 tabīʿ |
| 100–109 | 2 tabīʿ + 1 musinnah |
| 110–119 | 1 tabīʿ + 2 musinnah |
| 120 | 3 musinnah *(or 4 tabīʿ — owner's choice; see Special Cases)* |
| … | continue by the 30/40 decomposition in Formula 3 |

### Sheep & goat table (agreed)
| Herd size | Zakat due |
|---|---|
| 40–120 | 1 sheep |
| 121–200 | 2 sheep |
| 201–300 | 3 sheep |
| above 300 | 1 sheep per full 100 → `floor(n / 100)` (so 400→4, 500→5, …) |

## Core Formula(s)
A result is computed **per species** from `(count, grazing, working, hawlMet, madhab)`.

**Formula 0 — eligibility gate (all species).** Zakat due is **none** if *any* of:
1. `count < nisab(species)`, or
2. `hawlMet === false`, or
3. the herd is **not grazing** (`grazing === false`) **and** the madhab requires sāʾimah, or
4. the herd is **working animals** (`working === true`) **and** the madhab exempts ʿawāmil.
(Conditions 3–4 are madhab-driven — see Divergence table. Under Maliki, neither exempts.)

**Formula 1 — sheep/goats.**
```
n < 40   → none
40..120  → 1 sheep
121..200 → 2 sheep
201..300 → 3 sheep
n > 300  → floor(n / 100) sheep
```

**Formula 2 — camels 5..120.** Direct table lookup (Camel table above).

**Formula 3 — cattle (n ≥ 30).** Decompose `n` into `t` tabīʿ (unit 30) + `m` musinnah (unit 40):
choose `(t, m)`, `t,m ≥ 0`, that **minimises the waqṣ** `r = n − 30t − 40m` with `r ≥ 0`; among
minimal-`r` solutions pick the **fewest total animals**; on a remaining tie pick the one with **more
musinnah** (the older animal). This reproduces the classical table (incl. 120 → 3 musinnah, with
4 tabīʿ flagged as the owner's alternative).

**Formula 4 — camels above 120 (majority).** Decompose `n` into `bl` bint labūn (unit 40) + `h`
ḥiqqah (unit 50) by the **same** minimise-waqṣ → fewest-animals → prefer-ḥiqqah rule. Yields e.g.
130 → 2 bl + 1 ḥiqqah; 150 → 3 ḥiqqah; 200 → 4 ḥiqqah (5 bint labūn is the flagged alternative).

## Madhab Divergence Points
| Issue | Hanafi | Shafiʿi | Maliki | Hanbali |
|---|---|---|---|---|
| **Grazing (sāʾimah) required?** — is fodder-fed (maʿlūfah) livestock exempt? | **Yes, required** (fodder-fed exempt) | **Yes** | **No** — zakat due whether grazing or fodder-fed | **Yes** |
| **Working animals (ʿawāmil)** exempt? | **Yes, exempt** | **Yes** | **No** — still due | **Yes** |
| **Pay cash value** instead of the animal | **Permitted** | In-kind (cash a contemporary accommodation) | In-kind | In-kind |
| **Camels above 120** scheme | **Distinct Hanafi scheme** (restarts the small awqāṣ above 120) — *flagged, not modelled in V1* | Majority per-40/per-50 rule | Majority | Majority |

**No divergence on:** the niṣāb values (5 / 30 / 40); the camel table 5–120; the cattle 30/40 rule;
the sheep tiers through "1 per 100 above 300"; the one-ḥawl requirement; sheep+goats counted as one
category (ghanam) and cattle+buffalo as one.

## Named Special Cases
- **Camel herd 121 (drop in animal rank).** Going 120 → 121, the due moves from 2 ḥiqqah (3-yr-olds)
  to 3 bint labūn (2-yr-olds) — *younger animals, higher count*. This is correct per the sources, not
  a bug; worth a Learn-article note.
- **Common multiples where each age alone composes the herd** — **cattle 120** (3 musinnah *or*
  4 tabīʿ), **camels 200** (4 ḥiqqah *or* 5 bint labūn), and higher common multiples (cattle 240,
  360…; camels 400…). The engine returns the deterministic default (fewest animals, older type) and
  the result screen names the "either whole type" alternative. Mixed alternatives at
  non-common-multiple sizes (e.g. cattle 150) are **not** presented — their equal validity isn't cited.
- **Camels 5–24 pay sheep, not camels.** The unit paid is a shāh (sheep/goat), not a camel.

## Worked Examples
*(madhab = "majority" means Hanafi/Shafiʿi/Hanbali agree; Maliki noted where it differs. All assume
`hawlMet = true` and `grazing = true`, `working = false`, unless stated.)*

**Sheep & goats**
1. 39 sheep → **none** (below niṣāb).
2. 40 sheep → **1 sheep**.
3. 120 sheep → **1 sheep**.
4. 121 sheep → **2 sheep**.
5. 200 sheep → **2 sheep**.
6. 201 sheep → **3 sheep**.
7. 400 sheep → **4 sheep**.
8. 500 sheep → **5 sheep**.

**Camels**
9. 4 camels → **none** (below niṣāb).
10. 5 camels → **1 sheep**.
11. 24 camels → **4 sheep**.
12. 25 camels → **1 bint makhāḍ**.
13. 36 camels → **1 bint labūn**.
14. 46 camels → **1 ḥiqqah**.
15. 61 camels → **1 jadhaʿah**.
16. 76 camels → **2 bint labūn**.
17. 91 camels → **2 ḥiqqah**.
18. 120 camels → **2 ḥiqqah**.
19. 130 camels → **2 bint labūn + 1 ḥiqqah**.
20. 200 camels → **4 ḥiqqah** (alternative: 5 bint labūn).

**Cattle**
21. 29 cattle → **none** (below niṣāb).
22. 30 cattle → **1 tabīʿ**.
23. 40 cattle → **1 musinnah**.
24. 60 cattle → **2 tabīʿ**.
25. 70 cattle → **1 tabīʿ + 1 musinnah**.
26. 80 cattle → **2 musinnah**.
27. 90 cattle → **3 tabīʿ**.
28. 100 cattle → **2 tabīʿ + 1 musinnah**.
29. 120 cattle → **3 musinnah** (alternative: 4 tabīʿ).

**Conditions**
30. 100 sheep, `grazing = false`, **majority** → **none** (fodder-fed exempt).
31. 100 sheep, `grazing = false`, **Maliki** → **1 sheep** (Maliki levies regardless).
32. 40 cattle, `working = true`, **majority** → **none** (working animals exempt).
33. 40 cattle, `working = true`, **Maliki** → **1 musinnah**.
34. 40 sheep, `hawlMet = false` → **none**.

## Public Explanation Notes
- **Primary evidence:** the letter Abū Bakr al-Ṣiddīq (رضي الله عنه) wrote for ʿAnas on the ṣadaqah
  the Prophet ﷺ enjoined — it lays out the camel tiers (5→sheep, 25→bint makhāḍ, 36→bint labūn,
  46→ḥiqqah, 61→jadhaʿah, …) and the sheep tiers (40→1, 121→2, 201→3, "over 300, one per hundred").
  **Ṣaḥīḥ al-Bukhārī 1454.**
- **Grazing is the everyday point people miss:** for most scholars, only free-grazing herds are
  zakatable — commercially fed / stall-fed livestock are treated differently (they may instead be
  business assets). Maliki is the exception. The app asks, and the answer depends on the user's school.
- **You pay in the animals themselves** on the majority view (an average one — not the best of the
  herd, nor a defective one). Hanafis permit giving the cash value, which many people find easier
  today; the result screen notes this per school.
- Trading/farmed-for-sale animals are **business inventory**, not livestock-zakat — that is the
  Zakat calculator, not this one.

## Sources
- **Ṣaḥīḥ al-Bukhārī 1454**, *Kitāb al-Zakāt* — Abū Bakr's zakat letter (camel & sheep tables, age
  definitions, "over 300 → one per hundred"). https://sunnah.com/bukhari:1454
- **Islam Q&A (islamqa.info) 71267** — conditions (sāʾimah, ḥawl), working-animal exemption, majority
  vs. Maliki on fodder-fed. https://islamqa.info/en/answers/71267
- **al-feqh.com — "Nisab of zakat on livestock"** — consolidated camel/cattle/sheep tiers incl.
  camels 61–120 and above-120 per-40/per-50 rule. https://www.al-feqh.com/en/zakat-on-cattle
- **Muḥammad Jawād Mughniyya, *The Five Schools of Islamic Law*** (al-islam.org) — cross-madhab
  contrast, incl. Maliki on working animals. https://al-islam.org/five-schools-islamic-law-muhammad-jawad-mughniyya/zakat
- Wahba al-Zuḥaylī, *al-Fiqh al-Islāmī wa-Adillatuh*, Zakāt al-Anʿām chapter (madhab divergence,
  camel-above-120 schemes) — standard secondary reference.

## Flagged Uncertainties
1. **Camels above 120 — Hanafi scheme.** V1 implements only the majority per-40/per-50 rule (Formula
   4). The distinct Hanafi treatment above 120 is documented as out-of-scope; confirm whether to add
   it as a RuleModule branch. (Rare for app users — very large camel herds.)
2. **Sheep 301–399 band.** `floor(n/100)` yields 3 sheep for 301–399 and 4 at 400 (majority reading).
   Confirm this matches the reviewer's preferred position vs. any Hanafi nuance in that band.
3. **Tie-break & owner's-choice alternative.** At common multiples of both age-unit sizes (cattle
   120, 240…; camels 200, 400…) the engine returns fewest-animals/older-type and shows the pure
   "either whole type" alternative; mixed alternatives at other sizes are suppressed. Confirm this
   default is acceptable to present as *the* number.
4. **Working-animal / grazing toggles** are single herd-level booleans. Real herds can be mixed
   (some working, some grazing); confirm V1's all-or-nothing modelling is acceptable.
5. **Khulṭa (mixed ownership)** and **horses (khayl)** are out of V1 scope — confirm deferral.
6. Whether to surface a Hanafi **cash-value estimate** (needs a per-animal price input) or keep it a
   text note only. V1 = note only.

## Implementation Defaults (provisional)
| # | Decision | V1 default | Where |
|---|---|---|---|
| D1 | Niṣāb | camels 5 / cattle 30 / ghanam 40 | `core/livestock/constants.ts` |
| D2 | Grazing required (fodder-fed exempt) | true for Hanafi/Shafiʿi/Hanbali, false for Maliki | `core/livestock/madhab/*` |
| D3 | Working animals exempt | same split as D2 | `core/livestock/madhab/*` |
| D4 | Cash value allowed | Hanafi = note "value permitted"; others = in-kind note | `core/livestock/madhab/*` + UI |
| D5 | Camels > 120 | majority per-40/per-50 (Formula 4); Hanafi scheme flagged, not built | engine |
| D6 | Decomposition tie-break | minimise waqṣ → fewest animals → older type; owner's-choice alternative shown only at common multiples of both age units | engine |
| D7 | Cross-species | each species assessed on its own count; no aggregation | engine + schema |
| D8 | Default toggles | `grazing = true`, `working = false`, `hawlMet = true` | schema defaults |

## Changelog
| Date | Version | Change | Requested by |
|---|---|---|---|
| 2026-07-15 | 0.1 | Initial researched draft (research-provisional): camel/cattle/ghanam tables, ḥawl + sāʾimah + ʿawāmil gates, camel>120 majority rule, madhab split, 34 worked examples. | user |
| 2026-07-15 | 0.2 | Post-QA fixes: owner's-choice alternative restricted to common multiples of both age units (traceability); herd-size sanity cap; i18n error keys added. | qa |
