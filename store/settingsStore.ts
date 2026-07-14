import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { storage } from '@/services/storage';
import type { CurrencyCode } from '@/core/shared';
import type { NisabBasis } from '@/core/zakat';
import type { PrayerMethodKey } from '@/core/prayer';

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
  /** Default display currency, chosen at onboarding (ADR 0009). */
  currency: CurrencyCode;
  /** Which metal threshold Zakat tests nisab against (ADR 0009; zakat.md D3). Default silver. */
  nisabBasis: NisabBasis;
  /** Manual Hijri day adjustment (−2..+2) to align the algorithmic calendar with local sighting. */
  hijriAdjust: number;
  /** Prayer-time calculation method. */
  prayerMethod: PrayerMethodKey;
  /** Last known location (cached so prayer times/qibla work offline after the first GPS fix). */
  location: { lat: number; lng: number } | null;
  /** Registry ids the user has favorited (ADR 0006). Order = insertion order. */
  favorites: string[];
  /** False until the first-run onboarding flow completes; gates the onboarding redirect. */
  onboarded: boolean;
  setMadhab: (madhab: Madhab) => void;
  setLanguage: (language: Language) => void;
  setColorScheme: (colorScheme: ColorSchemePreference) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setNisabBasis: (nisabBasis: NisabBasis) => void;
  setHijriAdjust: (hijriAdjust: number) => void;
  setPrayerMethod: (prayerMethod: PrayerMethodKey) => void;
  setLocation: (location: { lat: number; lng: number } | null) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  completeOnboarding: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      madhab: 'hanafi',
      language: 'en',
      colorScheme: 'system',
      currency: 'USD',
      nisabBasis: 'silver',
      hijriAdjust: 0,
      prayerMethod: 'MuslimWorldLeague',
      location: null,
      favorites: [],
      onboarded: false,
      setMadhab: (madhab) => set({ madhab }),
      setLanguage: (language) => set({ language }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
      setCurrency: (currency) => set({ currency }),
      setNisabBasis: (nisabBasis) => set({ nisabBasis }),
      setHijriAdjust: (hijriAdjust) => set({ hijriAdjust }),
      setPrayerMethod: (prayerMethod) => set({ prayerMethod }),
      setLocation: (location) => set({ location }),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),
      completeOnboarding: () => set({ onboarded: true }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist data, not the action functions.
      partialize: (s) => ({
        madhab: s.madhab,
        language: s.language,
        colorScheme: s.colorScheme,
        currency: s.currency,
        nisabBasis: s.nisabBasis,
        hijriAdjust: s.hijriAdjust,
        prayerMethod: s.prayerMethod,
        location: s.location,
        favorites: s.favorites,
        onboarded: s.onboarded,
      }),
    }
  )
);
