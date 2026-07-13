import type { TFunction } from 'i18next';
import { formatMoney, money, type Money } from '@/core/shared';
import {
  GOLD_NISAB_GRAMS,
  SILVER_NISAB_GRAMS,
  getRuleModule,
  type MadhabSchool,
  type NisabBasis,
  type ZakatInput,
  type ZakatResult,
} from '@/core/zakat';
import type { BreakdownRow } from '@/components/ResultView';

type ResultViewData = {
  headline: string;
  headlineLabel: string;
  rows: BreakdownRow[];
  citation: string;
  disclaimer: string;
};

/**
 * Map a ZakatResult to presentational ResultView props: formats every Money for the active locale,
 * lists the non-zero breakdown components, and — importantly — surfaces any personal jewelry the
 * user's madhab EXEMPTS as its own labelled row, so an entered amount is never silently dropped from
 * the breakdown (it would otherwise look like a bug). Explains a $0 outcome (below nisab / haul not
 * complete). The citation names the rate, nisab basis, and madhab; the disclaimer is the provisional
 * "not yet scholar-verified" notice (ADR 0013). Actions are added by the screen.
 */
export function buildZakatResultView(
  result: ZakatResult,
  opts: { t: TFunction; locale: string; madhab: MadhabSchool; nisabBasis: NisabBasis; input: ZakatInput }
): ResultViewData {
  const { t, locale, madhab, nisabBasis, input } = opts;
  const fmt = (m: Money) => formatMoney(m, locale);
  const b = result.breakdown;
  const rule = getRuleModule(madhab);
  const madhabName = t(`settings.madhab.${madhab}`);

  const rows: BreakdownRow[] = [];
  const pushIfNonZero = (label: string, m: Money) => {
    if (m.amount !== 0) rows.push({ label, value: fmt(m) });
  };

  pushIfNonZero(t('zakat.field.cash'), b.cash);
  pushIfNonZero(t('zakat.result.goldValue'), b.goldValue);
  pushIfNonZero(t('zakat.result.silverValue'), b.silverValue);
  pushIfNonZero(t('zakat.result.businessBase'), b.businessBase);
  pushIfNonZero(t('zakat.result.debtsDeducted'), b.debtsDeducted);

  // When the selected madhab exempts personal-use jewelry, show what was exempted so the user sees
  // their entry was recognised, not ignored (QA: exempt jewelry must not vanish from the breakdown).
  if (!rule.personalJewelryZakatable) {
    const goldJewelry = input.goldGramsJewelry * input.goldPricePerGram;
    const silverJewelry = input.silverGramsJewelry * input.silverPricePerGram;
    if (goldJewelry > 0) {
      rows.push({
        label: t('zakat.result.goldJewelryExempt', { madhab: madhabName }),
        value: fmt(money(goldJewelry, input.currency)),
      });
    }
    if (silverJewelry > 0) {
      rows.push({
        label: t('zakat.result.silverJewelryExempt', { madhab: madhabName }),
        value: fmt(money(silverJewelry, input.currency)),
      });
    }
  }

  rows.push({ label: t('zakat.result.totalZakatable'), value: fmt(b.totalZakatableWealth), emphasis: true });
  rows.push({ label: t('zakat.result.nisab'), value: fmt(b.nisabValue) });

  let headlineLabel = t('zakat.result.due');
  if (result.zakatDue.amount === 0) {
    headlineLabel = !b.meetsNisab
      ? t('zakat.result.belowNisab')
      : !result.haulComplete
        ? t('zakat.result.haulIncomplete')
        : t('zakat.result.due');
  }

  return {
    headline: fmt(result.zakatDue),
    headlineLabel,
    rows,
    citation: t('zakat.result.citation', {
      rate: (result.rate * 100).toFixed(1),
      basis: t(`settings.nisabBasis.${nisabBasis}`),
      grams: nisabBasis === 'gold' ? GOLD_NISAB_GRAMS : SILVER_NISAB_GRAMS,
      madhab: madhabName,
    }),
    disclaimer: t('zakat.result.disclaimer'),
  };
}
