---
domain: purification
status: research-provisional
version: 0.1
last_updated: 2026-07-15
scholar_reviewer: unassigned
madhab_dependent: false
---

> **Provisional build (ADR 0013).** Researched + cited, **not yet scholar-verified**. Ships with the
> disclaimer until a scholar reviews outputs. Every constant traces to ## Sources; open choices are
> pinned in ## Implementation Defaults, nothing invented silently.

# Fiqh Rule Specification: Investment Purification (Taṭhīr / Dividend Cleansing)

## Scope
For a Muslim holding **Shariah-screened shares**, the small portion of investment income that comes
from **impermissible sources** (e.g. interest income the company earned) must be **purified** — given
to charity, **separately from Zakat and without expecting reward**. This calculator computes that
purification amount by either of two AAOIFI-aligned methods:
- **By dividend & ratio:** `dividendsReceived × (non-compliant income ÷ total income)`.
- **By impure income per share:** `sharesHeld × impureIncomePerShare` (the AAOIFI shareholding method,
  where impureIncomePerShare = company's total prohibited income ÷ shares outstanding).

**In scope:** the purification amount from a user-supplied ratio or per-share figure. **NOT in scope
(flagged):** the *screening* decision of whether a stock is investable at all (business-activity and
financial ratios — a separate concern); purification of **capital gains** (contested — V1 does income
purification only); and sourcing the ratios (the user gets them from a screening report).

## Definitions & Terminology
- **Purification (taṭhīr / taṣfiyah)** — donating the impermissible portion of one's returns to charity
  to cleanse the halal remainder. It is **not** Zakat and earns **no reward** for the donor.
- **Non-compliant / impure income** — company income from impermissible sources (riba/interest income,
  and incidental non-halal business lines) as a share of total income/revenue.
- **AAOIFI Shariah Standard 21** — *Financial Papers (Shares and Bonds)* — the reference standard for
  screening and purification.

## Nisab / Threshold Constants
None — purification is a proportion of impure income, not a threshold obligation. (Screening
thresholds like the 30% debt ratio belong to the separate screening decision, not this calculation.)

## Core Formula(s)
Computed from `(method, dividendAmount, impurePercentage, sharesHeld, impureIncomePerShare, currency)`.

**Method "byDividend".**
```
purification = dividendAmount × (impurePercentage / 100)
```

**Method "perShare".**
```
purification = sharesHeld × impureIncomePerShare
```
Both round to 2 decimal places and return Money.

## Madhab Divergence Points
**No four-madhab divergence** — investment purification is a contemporary issue (shares as an asset
class post-date the classical schools), governed by modern standards (AAOIFI) and fatwā, not by
Hanafi/Shafiʿi/Maliki/Hanbali positions. `madhab_dependent: false`; there is no RuleModule. Contemporary
scholarly differences (dividend-only vs. also capital gains; income vs. revenue basis) are recorded in
## Flagged Uncertainties, not modelled as madhab branches.

## Named Special Cases
- **0% non-compliant income** → purification is **0** (nothing to cleanse). Valid result.
- **Purification ≠ Zakat.** The amount here is given *in addition* to any Zakat on the holding, and the
  donor takes no reward for it. The result screen states this so users don't conflate the two.

## Worked Examples
*(No madhab assumed — school-independent.)*
1. byDividend: 1000 dividends, 3% non-compliant → **30**.
2. byDividend: 1000 dividends, 5% → **50**.
3. byDividend: 2000 dividends, 2.5% → **50**.
4. byDividend: 1000 dividends, 0% → **0**.
5. byDividend: 1000 dividends, 100% → **1000**.
6. byDividend: 333.33 dividends, 3% → 9.9999 → **10.00** (rounding).
7. perShare: 1000 shares, 0.02 impure/share → **20**.
8. perShare: 500 shares, 0.10/share → **50**.
9. perShare: 1234 shares, 0.015/share → 18.51 → **18.51**.

## Public Explanation Notes
- **Why purify:** even a well-screened company can earn a little impermissible income (typically riba
  on cash deposits). Keeping the halal returns requires giving away the impure slice — a mercy that
  lets Muslims participate in equity markets while staying clean of that portion.
- **It is not Zakat and brings no reward** — you give it to remove harm, not to earn merit; so it is
  not counted among your rewarded charity, and it does not replace Zakat.
- **Where to get the numbers:** stock-screening services (and many fund fact-sheets) publish either a
  "non-compliant income %" or a "purification per share" figure — enter whichever you have.
- **Common question — capital gains:** scholars differ on whether to also purify a share of price
  gains; many purify dividends/income only. This calculator does income purification; a scholar can
  advise on gains.

## Sources
- **AAOIFI Shariah Standard No. 21**, *Financial Papers (Shares and Bonds)* — screening + purification
  of non-permissible income. https://aaoifi.com/ss-21-financial-paper-shares-and-bonds/?lang=en
- **Muḥammad Taqī ʿUthmānī**, *An Introduction to Islamic Finance* — purification of the proportion of
  dividends attributable to impermissible income.
- Islamicly / Zoya purification methodology write-ups (contemporary application of the AAOIFI method).
  https://blog.islamicly.com/halal-investing-guide/purification-of-shariah-compliant-equities/

## Flagged Uncertainties
1. **Income vs. revenue basis** for the non-compliant ratio (standards differ). V1 takes whatever
   percentage the user supplies; confirm the intended denominator in the Learn guidance.
2. **Capital-gains purification** — contested; V1 purifies income only. Confirm whether to add an
   optional gains mode.
3. **Per-share figure provenance** — depends on the company's disclosed prohibited income and share
   count; V1 trusts the user's supplied per-share value.
4. **Obligatory vs. recommended** — most contemporary scholars hold purification obligatory for the
   impure portion; a minority view differs. V1 presents it as the amount to give, not a fatwā.

## Implementation Defaults (provisional)
| # | Decision | V1 default | Where |
|---|---|---|---|
| D1 | Methods | byDividend (dividends × %) and perShare (shares × impure/share) | `core/purification/constants.ts` |
| D2 | Rounding | 2 decimal places, Money | engine |
| D3 | Madhab | not applicable (`madhab_dependent: false`) — no RuleModule | — |
| D4 | Capital gains | not modelled (income purification only) | flagged |
| D5 | 0% impure | returns 0 (valid) | engine |

## Changelog
| Date | Version | Change | Requested by |
|---|---|---|---|
| 2026-07-15 | 0.1 | Initial researched draft (research-provisional): two AAOIFI-aligned methods (dividend×ratio, shares×impure/share), 9 worked examples, non-madhab. | user |
| 2026-07-15 | 0.2 | Post-QA: fixed a shared-form dead-end (hidden visibleIf fields now reset to defaults so they can't silently block submit — also benefits Qaḍāʾ); per-share breakdown shows the raw figure, not a 2-dp rounding. | qa |
