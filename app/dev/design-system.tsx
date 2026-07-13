import { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/Card';
import { Money } from '@/components/Money';
import { ResultView } from '@/components/ResultView';
import { WizardChrome } from '@/components/WizardChrome';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { OfflineNotice } from '@/components/OfflineNotice';
import { EmptyState } from '@/components/EmptyState';
import { formatMoney, money } from '@/core/shared';

/**
 * DEV-ONLY design-system gallery (ADR 0012). Renders every shared component so the kit can be
 * eyeballed in light + dark without a Storybook. Reachable at /dev/design-system, linked from
 * Settings in __DEV__ only. Not shipped to users.
 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-8">
      <Text className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-300">
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function DesignSystemGallery() {
  const [step, setStep] = useState(1);
  const due = money(250, 'USD');

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: 'Design system' }} />
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-16">
        <Section title="ScreenHeader">
          <ScreenHeader title="Zakat" subtitle="Annual wealth purification" />
        </Section>

        <Section title="Card">
          <Card className="mb-3">
            <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
              Static card
            </Text>
            <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-300">
              Surface primitive — token-driven, light + dark.
            </Text>
          </Card>
          <Card onPress={() => {}} accessibilityLabel="Pressable card example">
            <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
              Pressable card →
            </Text>
          </Card>
        </Section>

        <Section title="Money">
          <View className="flex-row items-baseline gap-4">
            <Money value={due} className="text-2xl font-bold text-neutral-900 dark:text-neutral-50" />
            <Text className="text-sm text-neutral-500 dark:text-neutral-300">
              raw: {formatMoney(due)}
            </Text>
          </View>
        </Section>

        <Section title="ResultView">
          <ResultView
            headline={formatMoney(due)}
            headlineLabel="Zakat due"
            rows={[
              { label: 'Total zakatable wealth', value: formatMoney(money(10000, 'USD')) },
              { label: 'Nisab threshold', value: formatMoney(money(500, 'USD')) },
              { label: 'Zakat due (2.5%)', value: formatMoney(due), emphasis: true },
            ]}
            citation="Illustrative only — sourced from docs/fiqh/zakat.md worked examples."
            disclaimer="Not yet scholar-verified (provisional per ADR 0013)."
            actions={[
              { label: 'Save', onPress: () => {}, icon: 'bookmark-outline' },
              { label: 'Share', onPress: () => {}, icon: 'share-outline' },
              { label: 'How this works', onPress: () => {}, icon: 'book-outline' },
            ]}
          />
        </Section>

        <Section title="WizardChrome">
          <View className="h-64 rounded-lg border border-neutral-100 p-4 dark:border-neutral-700">
            <WizardChrome
              step={step}
              totalSteps={3}
              title={`Step ${step}: inputs`}
              progressLabel={`Step ${step} of 3`}
              onBack={step > 1 ? () => setStep((s) => s - 1) : undefined}
              backLabel="Back"
              onNext={() => setStep((s) => (s < 3 ? s + 1 : 1))}
              nextLabel={step < 3 ? 'Next' : 'Restart'}
            >
              <Text className="text-sm text-neutral-500 dark:text-neutral-300">
                Wizard step body goes here. Fields render inside this chrome.
              </Text>
            </WizardChrome>
          </View>
        </Section>

        <Section title="OfflineNotice">
          <OfflineNotice message="Offline — showing your last saved gold price." />
        </Section>

        <Section title="LoadingState">
          <View className="h-40 rounded-lg border border-neutral-100 dark:border-neutral-700">
            <LoadingState label="Fetching price…" />
          </View>
        </Section>

        <Section title="ErrorState">
          <View className="h-56 rounded-lg border border-neutral-100 dark:border-neutral-700">
            <ErrorState
              title="Couldn't load price"
              message="Check your connection and try again."
              retryLabel="Retry"
              onRetry={() => {}}
            />
          </View>
        </Section>

        <Section title="EmptyState">
          <View className="h-40 rounded-lg border border-neutral-100 dark:border-neutral-700">
            <EmptyState title="Nothing here yet" subtitle="Content will appear as it lands." />
          </View>
        </Section>
      </ScrollView>
    </ScreenContainer>
  );
}
