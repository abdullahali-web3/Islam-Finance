import { useColorScheme } from 'react-native';
import { colorScheme as nativewindColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { lightTheme, darkTheme, type Theme } from '@/components/theme';
import { useSettingsStore } from '@/store/settingsStore';

/**
 * Resolves the active theme from the user's `colorScheme` preference (light/dark/system)
 * falling back to the OS appearance for "system". Also keeps NativeWind's dark-mode state
 * in sync so `dark:` utility classes match the imperative theme returned here.
 */
export function useAppTheme(): Theme {
  const preference = useSettingsStore((s) => s.colorScheme);
  const system = useColorScheme();

  const mode: 'light' | 'dark' =
    preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  useEffect(() => {
    nativewindColorScheme.set(preference);
  }, [preference]);

  return mode === 'dark' ? darkTheme : lightTheme;
}
