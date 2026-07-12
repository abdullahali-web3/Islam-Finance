import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { storage } from '@/services/storage';

export type Madhab = 'hanafi' | 'shafii' | 'maliki' | 'hanbali';
export type Language = 'en' | 'ur';
export type ColorSchemePreference = 'light' | 'dark' | 'system';

const mmkvStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => {
    storage.remove(name);
  },
};

type SettingsState = {
  madhab: Madhab;
  language: Language;
  colorScheme: ColorSchemePreference;
  setMadhab: (madhab: Madhab) => void;
  setLanguage: (language: Language) => void;
  setColorScheme: (colorScheme: ColorSchemePreference) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      madhab: 'hanafi',
      language: 'en',
      colorScheme: 'system',
      setMadhab: (madhab) => set({ madhab }),
      setLanguage: (language) => set({ language }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
