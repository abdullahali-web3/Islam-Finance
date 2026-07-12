import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';

export default function HistoryScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <EmptyState title={t('history.emptyTitle')} subtitle={t('history.emptySubtitle')} />
    </ScreenContainer>
  );
}
