// Test-only helpers for the Quran feature. Lives outside __tests__/ because Jest's default testMatch
// treats every file under __tests__/ as a suite; imported only by tests, so it never ships in the app.

import '@/locales/i18n'; // side-effect init so t() resolves real strings, not raw keys, in tests
import type { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

/**
 * Renders under a SafeAreaProvider with fixed metrics. The reader screen (and ScreenContainer) call
 * useSafeAreaInsets, which throws without a provider — on device the app root supplies it.
 */
export function renderWithSafeArea(ui: ReactElement) {
  return render(<SafeAreaProvider initialMetrics={metrics}>{ui}</SafeAreaProvider>);
}
