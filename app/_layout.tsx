import '../global.css';
import '@/locales/i18n';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppTheme } from '@/components/useAppTheme';
import { configureNotificationHandler } from '@/services/notifications';

export default function RootLayout() {
  const theme = useAppTheme();

  // Configure how local reminders present in the foreground (ADR 0007 — local only).
  useEffect(() => {
    configureNotificationHandler();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
