import { View, Text, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useTasbihStore } from '@/store/tasbihStore';

const TARGETS = [33, 99, 100];

/** Tasbih (dhikr) counter — tap to count, with a target and completed-cycle tracking. */
export default function TasbihScreen() {
  const { t } = useTranslation();
  const { count, target, increment, reset, setTarget } = useTasbihStore();

  const cycles = Math.floor(count / target);
  const inCycle = count % target;

  return (
    <ScreenContainer>
      <Stack.Screen options={{ headerShown: true, title: t('home.card.tasbih') }} />
      <View className="flex-1 px-4 pt-4">
        <ScreenHeader title={t('home.card.tasbih')} subtitle={t('tasbih.subtitle')} />

        {/* Target selector */}
        <View className="mb-4 flex-row justify-center gap-2">
          {TARGETS.map((n) => {
            const active = n === target;
            return (
              <Pressable
                key={n}
                onPress={() => setTarget(n)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                className={
                  active
                    ? 'rounded-md bg-green-500 px-5 py-2 dark:bg-green-600'
                    : 'rounded-md bg-neutral-100 px-5 py-2 dark:bg-neutral-700'
                }
              >
                <Text
                  className={
                    active
                      ? 'text-sm font-semibold text-neutral-0'
                      : 'text-sm font-semibold text-neutral-700 dark:text-neutral-100'
                  }
                >
                  {n}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Big tap counter */}
        <Pressable
          onPress={increment}
          accessibilityRole="button"
          accessibilityLabel={t('tasbih.tapToCount')}
          className="mx-auto mb-6 h-64 w-64 items-center justify-center rounded-full bg-green-500 active:opacity-90 dark:bg-green-700"
        >
          <Text className="text-7xl font-bold text-neutral-0">{inCycle}</Text>
          <Text className="mt-1 text-sm text-green-100">/ {target}</Text>
        </Pressable>

        <Text className="text-center text-base text-neutral-700 dark:text-neutral-100">
          {t('tasbih.total', { count })} · {t('tasbih.cycles', { cycles })}
        </Text>

        <Pressable
          onPress={reset}
          accessibilityRole="button"
          className="mx-auto mt-6 min-h-[44px] flex-row items-center gap-2 rounded-md border border-neutral-100 px-5 py-2.5 active:opacity-80 dark:border-neutral-700"
        >
          <Ionicons name="refresh-outline" size={18} color="#8A8A85" />
          <Text className="text-sm font-semibold text-neutral-700 dark:text-neutral-100">
            {t('tasbih.reset')}
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
