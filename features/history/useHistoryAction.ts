import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResultAction } from '@/components/ResultView';
import { useHistoryStore, type HistoryEntry } from '@/store/historyStore';

/**
 * A "Save to history" ResultView action, reused by every calculator's result screen. Adds the entry
 * once (then shows "Saved"), so tapping again doesn't duplicate it.
 */
export function useHistoryAction(entry: Omit<HistoryEntry, 'id' | 'createdAt'>): ResultAction {
  const { t } = useTranslation();
  const add = useHistoryStore((s) => s.add);
  const [saved, setSaved] = useState(false);

  return {
    label: saved ? t('common.saved') : t('common.save'),
    icon: saved ? 'checkmark-outline' : 'bookmark-outline',
    onPress: () => {
      if (saved) return;
      add(entry);
      setSaved(true);
    },
  };
}
