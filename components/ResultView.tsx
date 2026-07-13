import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type BreakdownRow = {
  label: string;
  /** Pre-formatted display value (e.g. via formatMoney) — ResultView stays presentational. */
  value: string;
  /** Emphasize a subtotal/total row. */
  emphasis?: boolean;
};

export type ResultAction = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

type ResultViewProps = {
  /** Big headline figure, e.g. the formatted Zakat due. */
  headline: string;
  /** What the headline represents, e.g. t('zakat.result.due'). */
  headlineLabel?: string;
  rows: BreakdownRow[];
  /** Short cited-source note — every result names where its rule comes from (CLAUDE.md). */
  citation: string;
  /** "Not yet scholar-verified" style notice while the fiqh doc is provisional (ADR 0013). */
  disclaimer?: string;
  /** Save / Share / How-this-works actions. Labels + handlers passed in (i18n-clean). */
  actions?: ResultAction[];
};

/**
 * Shared result-screen kit (ADR 0012): headline + numeric breakdown + cited source + provisional
 * disclaimer + save/share/learn actions. Every calculator's result screen composes this — never a
 * hand-built result layout. Purely presentational: all strings are pre-translated and all values
 * pre-formatted by the caller, so it renders identically in tests and on device.
 */
export function ResultView({
  headline,
  headlineLabel,
  rows,
  citation,
  disclaimer,
  actions,
}: ResultViewProps) {
  return (
    <View>
      {/* Headline */}
      <View className="rounded-lg bg-green-500 px-5 py-6 dark:bg-green-700">
        {headlineLabel ? (
          <Text className="text-sm font-medium text-green-100">{headlineLabel}</Text>
        ) : null}
        <Text
          accessibilityRole="header"
          className="mt-1 text-3xl font-bold text-neutral-0"
        >
          {headline}
        </Text>
      </View>

      {/* Breakdown */}
      <View className="mt-4 rounded-lg border border-neutral-100 bg-neutral-0 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-900">
        {rows.map((row, i) => (
          <View
            key={`${row.label}-${i}`}
            className={
              i < rows.length - 1
                ? 'flex-row items-center justify-between border-b border-neutral-100 py-3 dark:border-neutral-700'
                : 'flex-row items-center justify-between py-3'
            }
          >
            <Text
              className={
                row.emphasis
                  ? 'text-sm font-semibold text-neutral-900 dark:text-neutral-50'
                  : 'text-sm text-neutral-500 dark:text-neutral-300'
              }
            >
              {row.label}
            </Text>
            <Text
              className={
                row.emphasis
                  ? 'text-base font-bold text-neutral-900 dark:text-neutral-50'
                  : 'text-base font-medium text-neutral-900 dark:text-neutral-50'
              }
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Cited source */}
      <Text className="mt-4 text-xs leading-5 text-neutral-500 dark:text-neutral-300">
        {citation}
      </Text>

      {/* Provisional disclaimer (ADR 0013) */}
      {disclaimer ? (
        <View
          accessibilityRole="alert"
          className="mt-3 rounded-md border border-gold-500 bg-gold-100 px-3 py-2"
        >
          <Text className="text-xs leading-5 text-gold-600">{disclaimer}</Text>
        </View>
      ) : null}

      {/* Actions — save / share / how-this-works */}
      {actions && actions.length > 0 ? (
        <View className="mt-5 flex-row flex-wrap gap-3">
          {actions.map((action) => (
            <Pressable
              key={action.label}
              onPress={action.onPress}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              className="min-h-[44px] flex-row items-center gap-2 rounded-md border border-green-500 px-4 py-2.5 active:opacity-80 dark:border-green-600"
            >
              {action.icon ? <Ionicons name={action.icon} size={16} color="#1B5E20" /> : null}
              <Text className="text-sm font-semibold text-green-500 dark:text-green-100">
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
