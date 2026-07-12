import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';

export default function LearnScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <EmptyState title={t('learn.emptyTitle')} subtitle={t('learn.emptySubtitle')} />
    </ScreenContainer>
  );
}
