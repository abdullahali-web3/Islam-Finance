# ADR 0009: Currency & Localization Model

## Status
Accepted

## Context
Audience is the **global diaspora** (US/UK/Gulf), so money is multi-currency from day one and can't
be a bare `number`. Language is English-primary + Urdu now, Arabic/RTL deferred to Phase 4 — but the
code must not make Arabic harder later.

## Decision
- **Money is a value type**, not a number: `type Money = { amount: number; currency: CurrencyCode }`
  in `core/shared`. Calculators accept and return `Money`; formatting is a UI concern (Intl-based).
  Mixed-currency inputs (e.g. Zakat across accounts) are handled explicitly, never by silent
  addition of differing currencies.
- A **default currency** setting lives in `settingsStore` (chosen at onboarding), with a per-field
  currency selector where relevant.
- **Nisab basis** (gold vs silver) is a user-facing setting, fiqh-doc-driven — diaspora charities
  commonly use the lower silver nisab; the choice is exposed, not hardcoded.
- **i18n hygiene** to keep Arabic/RTL cheap later: no string concatenation, no baked-in word order,
  all copy via react-i18next keys, numerals/dates via locale-aware formatters. No RTL layout work
  now, but nothing that blocks flipping `I18nManager` in Phase 4.

## Consequences
- Slightly more ceremony than a bare number everywhere — the correct cost for a multi-currency,
  multi-locale product.
- `core/shared/money.ts` becomes a foundational type every financial calculator depends on.
