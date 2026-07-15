import { create } from 'zustand';
import type { UshrResult } from '@/core/ushr';

type UshrState = {
  last: UshrResult | null;
  setLast: (result: UshrResult) => void;
  clear: () => void;
};

export const useUshrStore = create<UshrState>((set) => ({
  last: null,
  setLast: (result) => set({ last: result }),
  clear: () => set({ last: null }),
}));
