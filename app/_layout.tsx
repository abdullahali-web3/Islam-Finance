import '../global.css';
import '@/locales/i18n';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppTheme } from '@/components/useAppTheme';

export default function RootLayout() {
  const theme = useAppTheme();

  return (
    <SafeAreaProvider>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
