import type { TFunction } from 'i18next';
import { formatMoney, type Money } from '@/core/shared';
import type { HeirKey, InheritanceResult, MadhabSchool } from '@/core/inheritance';
import type { BreakdownRow } from '@/components/ResultView';

type ResultViewData = {
  headline: string;
  headlineLabel: string;
  rows: BreakdownRow[];
  citation: string;
  disclaimer: string;
};

function heirLabel(t: TFunction, heir: HeirKey, count: number): string {
  const base = t(`inheritance.heir.${heir}`);
  return count > 1 ? `${base} (${count})` : base;
}

/**
 * Map an InheritanceResult to ResultView props: the headline is the estate; each row is an heir's
 * share (with a per-head figure when there's more than one). The citation names the madhab and any
 * ʿAwl/Radd adjustment and lists heirs who were present but excluded (blocked), so nothing the user
 * entered silently disappears. The disclaimer is the provisional "not yet scholar-verified" notice.
 */
export function buildInheritanceResultView(
  result: InheritanceResult,
  opts: { t: TFunction; locale: string; madhab: MadhabSchool }
): ResultViewData {
  const { t, locale, madhab } = opts;
  const fmt = (m: Money) => formatMoney(m, locale);

  const rows: BreakdownRow[] = result.shares.map((s) => ({
    label: heirLabel(t, s.heir, s.count),
    value:
      s.count > 1
        ? `${fmt(s.amount)} · ${fmt(s.perHeadAmount)} ${t('inheritance.result.each')}`
        : fmt(s.amount),
    emphasis: false,
  }));

  const citationParts = [
    t('inheritance.result.citation', { madhab: t(`settings.madhab.${madhab}`) }),
  ];
  if (result.adjustment === 'awl') citationParts.push(t('inheritance.result.awlNote'));
  if (result.adjustment === 'radd') citationParts.push(t('inheritance.result.raddNote'));
  if (result.blocked.length > 0) {
    const names = result.blocked.map((b) => heirLabel(t, b.heir, b.count)).join(', ');
    citationParts.push(t('inheritance.result.blockedNote', { heirs: names }));
  }

  return {
    headline: fmt(result.estate),
    headlineLabel: t('inheritance.result.estateLabel'),
    rows,
    citation: citationParts.join(' '),
    disclaimer: t('inheritance.result.disclaimer'),
  };
}
