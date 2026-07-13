---
domain: inheritance
status: research-provisional
version: 0.2
last_updated: 2026-07-13
scholar_reviewer: unassigned
madhab_dependent: true
---

> **Provisional build (ADR 0013).** Researched + cited but **not yet scholar-verified**. Implementable
> now under the provisional-build policy; the Inheritance calculator ships with a visible "not yet
> scholar-verified" disclaimer on every result until a scholar reviews the OUTPUTS and this status
> becomes `approved`. Inheritance (‘ilm al-farā’iḍ) is the most divergence-heavy domain in the app —
> **treat scholar review as especially important here.** Every rule/constant traces to ## Sources;
> open choices are pinned in ## Implementation Defaults (provisional), nothing invented silently.

# Fiqh Rule Specification: Inheritance (Farāʾiḍ / Mawārīth)

## Scope

Distribution of a deceased Muslim's **net estate** among heirs per Sunni farāʾiḍ. The calculator
distributes the **net distributable estate** — i.e. *after* (1) funeral/burial costs, (2) debts, and
(3) valid bequests (waṣiyyah, capped at ⅓ of what remains, and not to an existing heir without the
other heirs' consent). V1 takes that net figure as input (with an optional ⅓-bequest helper); it does
not manage the debts/bequests ledger itself.

**V1 heirs covered:** spouse(s) (husband, or up to four wives sharing one portion); father; mother;
sons; daughters; **grandchildren through a son (son's son and son's daughter, one generation down)**;
paternal grandfather (when no father); paternal & maternal grandmothers; full, consanguine
(paternal-only), and uterine (maternal-only) siblings. Includes fixed shares (furūḍ), residuary
inheritance (taʿṣīb), blocking (ḥajb), ʿAwl, and Radd (with its madhab/diaspora divergence).

**Deferred to V2+ (documented so `new-calculator` doesn't double-scaffold):** descendants **more than
one generation** below through a son (great-grandchildren and deeper — multi-level agnatic
substitution); residuaries more distant than siblings (paternal uncles, nephews, cousins — ʿaṣaba
bi-nafsihi beyond brothers); dhawū al-arḥām (distant kindred) when no fixed-share/residuary heir
remains; the rarest named cases (e.g. al-Akdariyya beyond a documented note); khunthā (intersex) and
mafqūd (missing person) cases; and non-Sunni schemes (Jaʿfarī etc.). These are **out of V1 scope**,
flagged for the user, and must be shown as "not yet supported" rather than silently mis-distributed.

## Definitions & Terminology

- **Tarikah / Tarakah** — the estate left by the deceased.
- **Farāʾiḍ** — the fixed inheritance shares ordained in the Qurʾān.
- **Aṣḥāb al-furūḍ** — heirs with a fixed Qurʾānic share.
- **Furūḍ** — the six Qurʾānic fractions: **½, ¼, ⅛, ⅔, ⅓, ⅙**.
- **ʿAṣaba (taʿṣīb)** — residuary heirs, who take whatever remains after the fixed shares (and take
  the whole estate if there are no fixed-share heirs).
- **Ḥajb** — exclusion of an heir by another. *Ḥajb ḥirmān* = total exclusion (e.g. a son excludes
  brothers); *ḥajb nuqṣān* = reduction of a share (e.g. a child reduces a husband from ½ to ¼).
- **ʿAwl** — when the fixed shares sum to **more** than the estate, all shares are reduced
  proportionally by raising the common denominator to the sum of the numerators.
- **Radd** — when the fixed shares sum to **less** than the estate and there is **no** residuary, the
  surplus is *returned* to the fixed-share heirs (classically **excluding the spouse**), in proportion
  to their shares. *Where the surplus goes is a madhab divergence — see below.*
- **Bayt al-Māl** — the Islamic public treasury; the classical destination of surplus/heirless estates
  in some schools. In a non-Muslim state there is no functioning Bayt al-Māl (drives the diaspora
  divergence).
- **Waṣiyyah** — a bequest; valid up to **⅓** of the net estate, and **not to an heir** without the
  other heirs' consent (hadith *lā waṣiyyata li-wārith*).
- **2:1 rule** — among residuary heirs of the same class, a male takes the share of two females
  (Qurʾān 4:11, *li-dhakari mithlu ḥaẓẓi 'l-unthayayn*). Note: **uterine siblings are the exception —
  they share equally**, male and female alike (Qurʾān 4:12).

## Nisab / Threshold Constants

Inheritance has no nisab. The fixed "constants" are the six Qurʾānic fractions and two caps:

- **Fixed fractions:** ½, ¼, ⅛, ⅔, ⅓, ⅙ (assigned per heir + condition, tables below).
- **Bequest cap:** waṣiyyah ≤ **⅓** of the net estate to non-heirs; a bequest to an heir needs the
  other heirs' consent.
- **Residuary ratio:** male : female = **2 : 1** for same-class ʿaṣaba (except uterine siblings: 1:1).

## Core Formula(s)

### Fixed shares (aṣḥāb al-furūḍ) — heir → share, by condition

"Descendant" below = an inheriting son, daughter, son's son, or son's daughter. "Male descendant" =
son **or son's son** (matters for the father's ⅙-only rule and for blocking collaterals).

| Heir | Share | Condition |
|---|---|---|
| **Husband** | ½ | no descendant |
| | ¼ | with a descendant |
| **Wife** (1–4, sharing one portion) | ¼ | no descendant |
| | ⅛ | with a descendant |
| **Father** | ⅙ + residue | with a **female-only** descendant (daughters but no son) |
| | ⅙ (fixed only) | with a **male** descendant (a son / son's son) |
| | residuary (whole residue) | **no** descendant |
| **Mother** | ⅙ | with a descendant, **or** with ≥2 siblings (of any kind) |
| | ⅓ | otherwise — **but** see *Umariyyatān* (⅓ of the *remainder* when heirs are spouse + both parents) |
| **Daughter(s)** | ½ | one daughter, no son |
| | ⅔ | two or more daughters, no son |
| | residuary 2:1 with son | when any son is present |
| **Son** | residuary (ʿaṣaba), 2:1 with daughters | always residuary |
| **Son's son** (grandson via a son) | residuary, 2:1 with son's daughters at his level | only if **no son**; **excluded by a son**; is a "male descendant" |
| **Son's daughter** (granddaughter via a son) | ½ (one) / ⅔ (two+) | no son, no son's son, **and no daughter** |
| | **⅙** (to complete the ⅔) | with exactly **one daughter** (who takes ½), and no son / no son's son |
| | residuary 2:1 **with a son's son** | whenever a son's son is present (even alongside a daughter) |
| | excluded (0) | with a **son**, or with **two+ daughters** and **no son's son** |
| **Paternal grandfather** (only if **no father**) | like the father (⅙ / ⅙+residue / residuary) | **except** the grandfather-with-siblings divergence (below) |
| **Grandmother(s)** (maternal and/or paternal) | ⅙ (shared if more than one) | maternal grandmother excluded by the **mother**; paternal grandmother excluded by the **father** (and by the mother) |
| **Full sister(s)** | ½ (one) / ⅔ (two+) | no descendant, no father/grandfather, no full brother |
| | residuary 2:1 with a full brother; **or** ʿaṣaba maʿa 'l-ghayr (residuary) alongside daughter(s) | |
| **Consanguine (paternal) sister(s)** | ½ (one) / ⅔ (two+) | as full sisters but **also** excluded by a full brother, or by a full sister who became residuary-with-daughters |
| | ⅙ (to complete ⅔) | with exactly one full sister taking ½ |
| **Consanguine brother** | residuary | excluded by son, son's son, father, full brother |
| **Uterine sibling(s)** (maternal) | ⅙ (one) / ⅓ (two+, split **equally**, male=female) | excluded by **any** descendant and by the father/paternal-grandfather |

### Distribution algorithm

1. **Net estate** `E` = assets − funeral − debts − valid bequests (≤ ⅓ to non-heirs). *Input to V1.*
2. **Resolve ḥajb** (blocking) — remove excluded heirs:
   - A **son** excludes: all siblings (full/consanguine/uterine), **and the son's son and son's
     daughter** (grandchildren via a son), and all brothers/sisters.
   - A **son's son** (a male descendant), when no son, likewise excludes collateral siblings.
   - The **father** excludes: all siblings, the (paternal) grandfather, the paternal grandmother.
   - **Any descendant** (son, daughter, son's son, or son's daughter) excludes: **uterine** siblings,
     and reduces the spouse's and mother's shares.
   - The **mother** excludes: all grandmothers.
   - A **full brother** excludes: consanguine siblings (and consanguine brother excludes their
     residuary standing), plus (with father/son) is himself excluded.
   - The paternal **grandfather** stands in for an absent father for blocking **uterine siblings** and
     grandmothers, and (in the Hanafi view) blocks full/consanguine siblings — divergence below.
3. **Assign fixed shares** to the surviving aṣḥāb al-furūḍ from the tables above.
4. **Assign the residue** to the ʿaṣaba (son > father-as-residuary > … ; siblings where applicable),
   applying the 2:1 male:female rule (uterine siblings excluded from residue — they are fixed-share
   only).
5. **ʿAwl** — if Σ(fixed shares) > 1: raise the denominator to Σ(numerators); every share is scaled
   down proportionally. (All four Sunni schools accept ʿAwl — no divergence.)
6. **Radd** — if Σ(fixed shares) < 1 **and no ʿaṣaba**: return the surplus to the fixed-share heirs in
   proportion to their shares, **excluding the spouse** — *destination is a madhab/diaspora divergence
   (below).*
7. Multiply each resolved fraction by `E` for the money amount.

## Madhab Divergence Points

| Issue | Hanafi | Shafiʿi | Maliki | Hanbali |
|---|---|---|---|---|
| **Radd (surplus, no ʿaṣaba)** | Return surplus to fixed-share heirs (not spouse) | Classically → **Bayt al-Māl** | Classically → **Bayt al-Māl** (Maliki: only if the treasury is orderly/functioning) | Return surplus to fixed-share heirs (not spouse) |
| **Radd to a sole-heir spouse** | No radd to spouse classically → surplus to distant kindred / Bayt al-Māl | Bayt al-Māl | Bayt al-Māl | No radd to spouse classically → distant kindred / Bayt al-Māl |
| **Grandfather with (full/consanguine) siblings** | **Grandfather blocks the siblings** entirely (treated like the father) | Muqāsama (Zayd b. Thābit): grandfather **shares with** the siblings, taking the **best of** {divide as a brother, ⅓ of the estate, or ⅙} | Same as Shafiʿi (muqāsama) | Same as Shafiʿi (muqāsama) |
| **Al-Mushtaraka case** (see Named Cases) | Full brothers get **nothing** (residue is 0) | Full brothers **share** the uterine ⅓ | Full brothers **share** the uterine ⅓ | Full brothers get **nothing** |

**Explicitly no Sunni divergence** on: acceptance of **ʿAwl** (all four accept Umar's precedent — the
divergence is only with some Shiʿa, out of scope); the six fixed fractions; the 2:1 residuary ratio;
the Umariyyatān rule (all four agree). The **dhawū al-arḥām** question (distant kindred vs Bayt al-Māl
when no fixed/residuary heir except spouse) parallels the Radd row (Hanafi/Hanbali distribute to
distant kindred; Shafiʿi/Maliki classically → Bayt al-Māl) — V1 defers dhawū al-arḥām but records it.

**Diaspora note (audience-critical, ADR-plan §6):** in a non-Muslim state there is **no functioning
Bayt al-Māl**. Contemporary fatwā for Muslim minorities therefore generally applies **Radd** (including,
per many contemporary councils, returning a sole-heir spouse's surplus to that spouse) rather than
forfeiting the surplus. This is the app's default (D1/D2) — **flagged for the scholar**.

## Named Special Cases

- **Al-Umariyyatān / al-Gharrāwayn** (heirs = spouse + **both** parents, no descendant/siblings): the
  mother takes **⅓ of the remainder after the spouse's share** (not ⅓ of the whole), and the father
  takes the rest. Named for ʿUmar's ruling; **all four Sunni schools agree.** *(Worked example 2.)*
- **Al-Mushtaraka / al-Ḥimāriyya / al-Ḥajariyya** (e.g. husband + mother + ≥2 uterine siblings + full
  brother(s)): the fixed shares consume the estate, leaving the full brothers (residuary) nothing.
  **Shafiʿi & Maliki:** the full brothers **join** the uterine siblings in sharing the ⅓ equally (as
  co-maternal via the mother). **Hanafi & Hanbali:** the residuary gets nothing. *(Worked example 8.)*
- **Al-Akdariyya** (husband + mother + grandfather + one full sister — only arises in the muqāsama
  schools; Hanafi's grandfather blocks the sister so it never occurs there): a special re-division
  where the sister's ½ is combined with the grandfather's portion and split 2:1. **V1: documented but
  DEFERRED** (rare, and entangled with grandfather-vs-sibling muqāsama) — surfaced as "not yet
  supported," never silently mis-distributed.
- **Al-Minbariyya** (wife + 2 daughters + both parents): a classic ʿAwl-to-27 illustration.

## Worked Examples

Net distributable estate `E` chosen so shares divide cleanly. Amounts in a single currency (USD here,
illustrative). These become unit-test fixtures verbatim.

1. **Spouse + children (residue 2:1).** Wife + 1 son + 2 daughters, `E = 100,000`. Wife ⅛ = **12,500**;
   residue 87,500 split 2:1:1 (son 2 parts, each daughter 1) → son **43,750**, each daughter **21,875**.
2. **Umariyyatān.** Husband + father + mother, no descendant, `E = 60,000`. Husband ½ = **30,000**;
   remainder 30,000 → mother ⅓ of remainder = **10,000**, father = **20,000**.
3. **Daughters + mother, Radd (default, Hanafi/Hanbali & diaspora).** 2 daughters + mother, `E = 90,000`,
   no spouse/son/father. Fixed: daughters ⅔, mother ⅙ (sum ⅚ < 1, no ʿaṣaba) → Radd in ratio 4:1:
   daughters **72,000** (each 36,000), mother **18,000**. *(Shafiʿi/Maliki classical would send the
   surplus 15,000 to Bayt al-Māl → daughters 60,000, mother 15,000; the diaspora default applies Radd.)*
4. **Sole-heir spouse (Radd-to-spouse divergence/setting).** Wife only, `E = 50,000`. Wife ¼ = 12,500;
   surplus 37,500. **Default (diaspora): radd to wife → 50,000.** *(Classical all-schools: surplus to
   Bayt al-Māl.)*
5. **ʿAwl (to 7).** Husband + 2 full sisters, no descendant/father, `E = 42,000`. Husband ½ + sisters ⅔
   = 7/6 → ʿawl to 7: husband 3/7 = **18,000**, sisters 4/7 = **24,000** (each 12,000).
6. **Grandfather + siblings (divergence).** Grandfather + 2 full brothers, `E = 90,000` (no
   father/descendant/spouse/mother). **Hanafi:** grandfather blocks brothers → grandfather **90,000**,
   brothers **0**. **Shafiʿi/Maliki/Hanbali:** muqāsama → grandfather **30,000**, each brother **30,000**.
7. **Uterine + full siblings.** Mother + 2 uterine siblings + 1 full brother, `E = 60,000` (no
   descendant/father/spouse). Mother ⅙ = **10,000**; uterine ⅓ = **20,000** (equally, 10,000 each);
   full brother (residuary) = **30,000**.
8. **Al-Mushtaraka (divergence).** Husband + mother + 2 uterine brothers + 2 full brothers, `E = 60,000`.
   Husband ½ = **30,000**; mother ⅙ = **10,000**; uterine ⅓ = 20,000. **Hanafi/Hanbali:** full brothers
   **0**, uterine split 20,000 → 10,000 each. **Shafiʿi/Maliki:** the 20,000 is split equally among all
   four (2 uterine + 2 full) → **5,000 each**.
9. **Granddaughter completes the ⅔ (takmila).** 1 daughter + 1 son's daughter + mother + father,
   `E = 60,000`, no son/son's-son/spouse. Daughter ½ = **30,000**; son's daughter ⅙ (completes ⅔) =
   **10,000**; mother ⅙ = **10,000**; father ⅙ (female-only descendants, but here the residue is 0) =
   **10,000**. (Fixed shares sum to exactly 1.)
10. **Grandson as residuary (with a daughter).** 1 daughter + 1 son's son + 1 son's daughter + father,
    `E = 90,000`, no son/spouse. Daughter ½ = **45,000**; father ⅙ (a male descendant — the son's son —
    is present) = **15,000**; residue 30,000 to son's son : son's daughter = 2:1 → son's son **20,000**,
    son's daughter **10,000**.

## Public Explanation Notes

- Key evidence: the fixed shares are Qurʾānic — **Sūrat al-Nisāʾ 4:11–12** (children, parents, spouses)
  and **4:176** (kalāla — siblings when there is no parent or child). The Prophet ﷺ said "give the fixed
  shares to those entitled to them, and whatever remains goes to the nearest male heir" (Bukhārī &
  Muslim, *Kitāb al-Farāʾiḍ*).
- Common misconception: "sons and daughters always split equally" — no; among residuary children a son
  takes twice a daughter's share (4:11), **but uterine siblings share equally** (4:12), and many
  fixed-share heirs (spouse, parents, uterine siblings) are not on a 2:1 basis at all.
- Common misconception: "you can leave your whole estate by will to whomever you want" — a bequest is
  capped at **⅓** and cannot go to an existing heir without the others' consent; the farāʾiḍ shares are
  obligatory, not optional.
- Sensitive-topic guidance: inheritance is emotionally and legally consequential. The Learn article must
  state plainly that results are a **calculation aid, not a fatwā or a legal will**, and that users
  should confirm with a qualified scholar and (for legal enforceability in their country) a lawyer —
  especially in non-Muslim jurisdictions.
- Video references: to be curated by `learn-content-writer` near publication (reputable farāʾiḍ
  teachers/institutions) — none pre-selected here to avoid staleness.

## Sources

- **Qurʾān 4:11, 4:12, 4:176** (primary text of the fixed shares).
- **Ṣaḥīḥ al-Bukhārī & Ṣaḥīḥ Muslim**, *Kitāb al-Farāʾiḍ* (e.g. Muslim, Book of Inheritance — "give the
  shares to those entitled; the remainder to the nearest male").
- **Al-Sirājiyya fī 'l-farāʾiḍ** (al-Sajāwandī) — the classical Hanafi farāʾiḍ manual.
- **Ibn Rushd, *Bidāyat al-Mujtahid*** — comparative madhab positions (ʿAwl, Radd, grandfather+siblings).
- **Wahba al-Zuḥaylī, *al-Fiqh al-Islāmī wa-Adillatuh***, vols. on al-Mawārīth.
- Comparative summaries consulted: al-Islam.org, *Inheritance according to the Five Schools of Islamic
  Law* (Mughniyya) — Radd & grandfather/siblings; wassiyyah.com (Sunni madhab summary); and a
  peer-reviewed study on Radd & Bayt al-Māl for contemporary/minority contexts (ResearchGate,
  "The Provision of Radd in Inheritance…"). Contemporary diaspora Radd position to be confirmed with the
  reviewing scholar / a recognised fiqh council (e.g. AMJA, European Council for Fatwa & Research).

## Flagged Uncertainties

1. **Radd destination for Shafiʿi/Maliki users in the diaspora** — the app defaults to applying Radd
   (no functioning Bayt al-Māl), which departs from the *classical* Shafiʿi/Maliki position. Needs
   explicit scholar instruction, and whether to expose a "surplus → heirs / treasury / charity" setting.
2. **Radd to a sole-heir spouse** — default returns the surplus to the spouse (diaspora); classical
   position does not. Confirm.
3. **Grandfather + siblings muqāsama** — the "best of {muqāsama, ⅓, ⅙}" computation and its interaction
   with other fixed-share heirs (e.g. al-Akdariyya) is intricate; confirm the V1 encoding and that
   deferring al-Akdariyya (rather than mis-computing it) is acceptable.
4. **Al-Mushtaraka** — confirm the Shafiʿi/Maliki equal-split among full + uterine siblings is encoded
   correctly and only triggers on its exact precondition.
5. **V1 scope cut** — confirm that deferring grandchildren-through-a-son, distant ʿaṣaba, and dhawū
   al-arḥām (shown as "not yet supported") is acceptable for a first release rather than risking a
   wrong distribution.
6. **ʿAwl edge interaction with Radd** — confirm no case in the V1 heir set both ʿawls and radds.

## Implementation Defaults (provisional)

| # | Decision point | V1 default in code | Basis / trace | Where |
|---|---|---|---|---|
| D1 | Radd (surplus, no ʿaṣaba) | **Apply Radd** to fixed-share heirs (not spouse), all madhabs | Diaspora: no Bayt al-Māl; Hanafi/Hanbali baseline (flag 1) | RuleModule `raddPolicy`; maybe a future setting |
| D2 | Radd to sole-heir spouse | **Return surplus to the spouse** | Diaspora contemporary fatwā (flag 2) | RuleModule `raddToSpouseWhenSole` |
| D3 | Grandfather + siblings | **Madhab-dependent**: Hanafi blocks siblings; Shafiʿi/Maliki/Hanbali muqāsama (best of divide / ⅓ / ⅙) | Divergence table (flag 3) | RuleModule `grandfatherBlocksSiblings` + muqāsama fn |
| D4 | Al-Mushtaraka | **Madhab-dependent**: Hanafi/Hanbali → full brothers 0; Shafiʿi/Maliki → share the uterine ⅓ | Divergence table / Named Cases (flag 4) | RuleModule `mushtarakaSharesFullBrothers` |
| D5 | ʿAwl | **Applied** (raise denominator to Σ numerators), all madhabs | No Sunni divergence | engine |
| D6 | Umariyyatān | Mother = ⅓ of the **remainder after spouse** when heirs = spouse + both parents | Named case, all agree | engine |
| D7 | Residuary ratio | Male : female = **2 : 1** (uterine siblings **1:1**, fixed-share only) | Qurʾān 4:11 / 4:12 | engine |
| D8 | Bequest cap | Waṣiyyah ≤ **⅓** to non-heirs (V1 input is the *net* estate; optional ⅓ helper) | Hadith / consensus (D6 defs) | schema helper |
| D9 | Al-Akdariyya, **great-grandchildren+ (deeper than one level)**, distant ʿaṣaba, dhawū al-arḥām | **Not supported in V1** — detected and surfaced as "not yet supported," never mis-distributed | Scope (flag 5) | engine guard |
| D10 | Grandchildren via a son (one level: son's son / son's daughter) | **Supported in V1.** Son's son = residuary substituting for a son (blocked by a son). Son's daughter: ½/⅔ alone; **⅙ to complete ⅔ with one daughter**; residuary 2:1 with a son's son; blocked by a son or by ≥2 daughters (absent a son's son). | Fixed-shares table + worked examples 9–10 | engine |

Because of the disclaimer + these documented defaults, none of the flagged uncertainties block the V1
build; each is a knob the scholar review can turn (RuleModule files, the engine's ʿawl/radd steps, or a
future surplus-destination setting).

## Changelog

| Date | Version | Change | Requested by |
|---|---|---|---|
| 2026-07-13 | 0.1 | Initial researched draft at status research-provisional (ADR 0013): fixed-share tables, ḥajb, ʿAwl, Radd (+ diaspora/Bayt al-Māl divergence), grandfather+siblings & Mushtaraka divergences, named cases, 8 worked examples, Implementation Defaults D1–D9, V1 scope + deferrals. | user |
| 2026-07-13 | 0.2 | Added **grandchildren through a son** (son's son / son's daughter, one level) to V1 per user: fixed-share rows (incl. ⅙ takmila and residuary-with-grandson), ḥajb updates, worked examples 9–10, D10; moved only great-grandchildren+ to deferred (D9). | user |
