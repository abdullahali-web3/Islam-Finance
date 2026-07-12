import { ScrollView, View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18next from '@/locales/i18n';
import { ScreenContainer } from '@/components/ScreenContainer';
import {
  useSettingsStore,
  type Madhab,
  type Language,
  type ColorSchemePreference,
} from '@/store/settingsStore';

function SettingRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { key: T; label: string }[];
  onChange: (next: T) => void;
}) {
  return (
    <View className="mb-6">
      <Text className="mb-2 text-sm font-semibold text-neutral-500 dark:text-neutral-300">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt.key === value;
          return (
            <Pressable
              key={opt.key}
              onPress={() => onChange(opt.key)}
              className={
                active
                  ? 'rounded-md bg-green-500 px-4 py-2 dark:bg-green-600'
                  : 'rounded-md bg-neutral-100 px-4 py-2 dark:bg-neutral-700'
              }
            >
              <Text
                className={
                  active
                    ? 'text-sm font-medium text-neutral-0'
                    : 'text-sm font-medium text-neutral-700 dark:text-neutral-100'
                }
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { madhab, language, colorScheme, setMadhab, setLanguage, setColorScheme } =
    useSettingsStore();

  const madhabOptions: { key: Madhab; label: string }[] = [
    { key: 'hanafi', label: t('settings.madhab.hanafi') },
    { key: 'shafii', label: t('settings.madhab.shafii') },
    { key: 'maliki', label: t('settings.madhab.maliki') },
    { key: 'hanbali', label: t('settings.madhab.hanbali') },
  ];

  const languageOptions: { key: Language; label: string }[] = [
    { key: 'en', label: t('settings.language.en') },
    { key: 'ur', label: t('settings.language.ur') },
  ];

  const appearanceOptions: { key: ColorSchemePreference; label: string }[] = [
    { key: 'light', label: t('settings.appearance.light') },
    { key: 'dark', label: t('settings.appearance.dark') },
    { key: 'system', label: t('settings.appearance.system') },
  ];

  const handleLanguage = (next: Language) => {
    setLanguage(next);
    i18next.changeLanguage(next);
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-4 pb-8">
        <Text className="mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          {t('tabs.settings')}
        </Text>

        <SettingRow
          label={t('settings.madhab')}
          value={madhab}
          options={madhabOptions}
          onChange={setMadhab}
        />
        <SettingRow
          label={t('settings.language')}
          value={language}
          options={languageOptions}
          onChange={handleLanguage}
        />
        <SettingRow
          label={t('settings.appearance')}
          value={colorScheme}
          options={appearanceOptions}
          onChange={setColorScheme}
        />

        {__DEV__ ? (
          <Link href="/dev/calculator-form-demo" className="mt-4 text-sm font-medium text-green-500">
            Dev: Form demo
          </Link>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}
