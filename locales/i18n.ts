import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en/common.json';
import ur from './ur/common.json';

const supportedLanguages = ['en', 'ur'] as const;
const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';
const defaultLanguage = supportedLanguages.includes(deviceLanguage as (typeof supportedLanguages)[number])
  ? deviceLanguage
  : 'en';

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { common: en },
    ur: { common: ur },
  },
  lng: defaultLanguage,
  fallbackLng: 'en',
  defaultNS: 'common',
  // Locale JSON uses flat, dotted keys (e.g. "tabs.home"); disable key nesting so they
  // resolve as literal keys instead of being split into nested objects.
  keySeparator: false,
  interpolation: { escapeValue: false },
});

export default i18next;
