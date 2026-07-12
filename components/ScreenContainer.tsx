import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Standard screen wrapper: fills the screen, applies the top safe-area inset, and paints
 * the themed background via NativeWind. Tab screens don't need the bottom inset (the tab
 * bar owns it), so only the top inset is applied.
 */
export function ScreenContainer({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-neutral-50 dark:bg-neutral-900"
      style={{ paddingTop: insets.top }}
    >
      {children}
    </View>
  );
}
