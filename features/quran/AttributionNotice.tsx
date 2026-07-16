import { useState } from 'react';
import { Linking, Text, View, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { QURAN_ATTRIBUTION } from '@/core/quran';

type Props = {
  /**
   * Compact renders a single always-visible source line, for placement above the fold. The full
   * variant adds the separator and sits at the end of a scroll view.
   */
  compact?: boolean;
};

/**
 * Tanzil source + licence attribution.
 *
 * This is a **licence condition, not decoration** (ADR 0016). The Tanzil text is CC BY 3.0, which
 * permits shipping it in this ad-supported (commercial) app only if the source is clearly indicated
 * and a link to tanzil.net is provided so users can track upstream changes. Remove this and we lose
 * the right to bundle the text.
 *
 * Two consequences deliberately encoded here:
 *  - It is NEVER rendered conditionally. A `surahs.length > 0 &&` guard previously hid it whenever a
 *    search matched nothing; conditional attribution is how licence drift starts.
 *  - The URL renders as text regardless of whether the link opens, so the source stays "clearly
 *    indicated" even on a device with no browser to handle the tap.
 */
export function AttributionNotice({ compact = false }: Props) {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  const url = QURAN_ATTRIBUTION.source;

  const open = () => {
    // openURL rejects when nothing can handle the URL; without a catch that is an unhandled
    // rejection and a tap that appears to do nothing.
    Linking.openURL(url).catch(() => setFailed(true));
  };

  return (
    <View
      className={
        compact ? 'mb-4' : 'mt-8 border-t border-neutral-100 pt-4 dark:border-neutral-700'
      }
    >
      <Text className="text-xs text-neutral-500 dark:text-neutral-300">
        {t('quran.attribution', {
          edition: QURAN_ATTRIBUTION.edition,
          license: QURAN_ATTRIBUTION.license,
        })}
      </Text>
      <Pressable
        onPress={open}
        accessibilityRole="link"
        accessibilityLabel={t('quran.attributionLink', { url })}
        className={compact ? 'justify-center py-1' : 'min-h-[44px] justify-center'}
      >
        <Text
          selectable
          className="text-xs font-semibold text-green-500 underline dark:text-green-100"
        >
          {url}
        </Text>
      </Pressable>
      {failed ? (
        <Text className="text-xs text-neutral-500 dark:text-neutral-300">
          {t('quran.attributionOpenFailed')}
        </Text>
      ) : null}
    </View>
  );
}
