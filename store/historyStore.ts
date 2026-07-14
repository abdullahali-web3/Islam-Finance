import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { storage } from '@/services/storage';

/**
 * Calculation history. V1 uses an MMKV-backed store behind this small repository-style interface
 * (add/remove/clear). This deliberately defers the WatermelonDB integration named in ADR 0002:
 * ADR 0007's point is a repository *seam* so a sync-capable backend can slot in later without
 * touching feature code — this interface is that seam. WatermelonDB can replace the persistence here
 * if/when cross-device sync is actually needed (ADR 0007 triggers). Works in Expo Go + dev builds.
 */
export type HistoryEntry = {
  id: string;
  /** Calculator domain slug (matches the home registry id). */
  domain: string;
  /** i18n key for the calculator's name (e.g. 'home.card.zakat'). */
  titleKey: string;
  /** Pre-formatted headline value at save time (e.g. "$250"). */
  headline: string;
  /** Optional label for the headline (e.g. "Zakat due"). */
  subtitle?: string;
  createdAt: number;
};

const MAX_ENTRIES = 100;

const mmkvStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => {
    storage.remove(name);
  },
};

type HistoryState = {
  entries: HistoryEntry[];
  add: (entry: Omit<HistoryEntry, 'id' | 'createdAt'>) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      add: (entry) =>
        set((s) => ({
          entries: [
            { ...entry, id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`, createdAt: Date.now() },
            ...s.entries,
          ].slice(0, MAX_ENTRIES),
        })),
      remove: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: 'history-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
