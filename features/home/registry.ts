import type { Ionicons } from '@expo/vector-icons';

/**
 * A single calculator's home-hub descriptor (ADR 0006). The hub grid, favorites row, and search all
 * render from the `CALCULATORS` array below — **adding a calculator is one entry here**, never an
 * edit to a Home screen's JSX. The `register-calculator` skill maintains this file mechanically.
 */
export type CalculatorDescriptor = {
  /** Domain slug — unique, matches core/<id>, schemas/<id>, features/<id>, deep link path. */
  id: string;
  /** i18n key for the card title (in locales common.json), e.g. 'home.card.zakat'. */
  titleKey: string;
  /** Ionicons glyph name shown on the card. */
  icon: keyof typeof Ionicons.glyphMap;
  /** Deep-linkable stack route: islamfinance://calculator/<id>. */
  route: string;
  /** Learn article id (features/learn/content/<id>.mdx), or null until one exists. */
  learnArticleId: string | null;
  /** Roadmap phase the calculator ships in. */
  phase: number;
  /** When false the card renders "coming soon" and does not navigate. */
  enabled: boolean;
};

/**
 * The calculator catalog. Entries are listed even before they ship (enabled:false) so the hub
 * communicates what's coming; flip `enabled` to true once core+schema+UI+QA land for that domain.
 */
export const CALCULATORS: readonly CalculatorDescriptor[] = [
  {
    id: 'zakat',
    titleKey: 'home.card.zakat',
    icon: 'cash-outline',
    route: '/calculator/zakat',
    learnArticleId: 'zakat',
    phase: 1,
    enabled: true,
  },
  {
    id: 'inheritance',
    titleKey: 'home.card.inheritance',
    icon: 'people-outline',
    route: '/calculator/inheritance',
    learnArticleId: 'inheritance',
    phase: 1,
    enabled: true,
  },
  {
    id: 'fitrana',
    titleKey: 'home.card.fitrana',
    icon: 'gift-outline',
    route: '/calculator/fitrana',
    learnArticleId: 'fitrana',
    phase: 1,
    enabled: true,
  },
  {
    id: 'qurbani',
    titleKey: 'home.card.qurbani',
    icon: 'paw-outline',
    route: '/calculator/qurbani',
    learnArticleId: 'qurbani',
    phase: 1,
    enabled: true,
  },
  {
    id: 'prayer-times',
    titleKey: 'home.card.prayerTimes',
    icon: 'time-outline',
    route: '/calculator/prayer-times',
    learnArticleId: null,
    phase: 1,
    enabled: false,
  },
];

export function getCalculator(id: string): CalculatorDescriptor | undefined {
  return CALCULATORS.find((c) => c.id === id);
}
