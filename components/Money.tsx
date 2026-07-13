import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { formatMoney, type Money as MoneyValue } from '@/core/shared';

type MoneyProps = {
  value: MoneyValue;
  /** Override the locale used for formatting; defaults to the active i18n language. */
  locale?: string;
  className?: string;
};

/**
 * Money display (ADR 0009 + 0012). Formats a `Money` value type locale-awarely via Intl — never a
 * bare number, never a hardcoded currency symbol. Formatting is a UI concern, so the locale comes
 * from the active language (or an explicit prop). Style via `className`; the caller owns size/color.
 */
export function Money({ value, locale, className = 'text-base text-neutral-900 dark:text-neutral-50' }: MoneyProps) {
  const { i18n } = useTranslation();
  const resolved = locale ?? i18n.language ?? 'en';
  return <Text className={className}>{formatMoney(value, resolved)}</Text>;
}
