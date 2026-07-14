import { create } from 'zustand';
import type { FidyaResult } from '@/core/fidya';

type FidyaState = {
  last: FidyaResult | null;
  setLast: (result: FidyaResult) => void;
  clear: () => void;
};

export const useFidyaStore = create<FidyaState>((set) => ({
  last: null,
  setLast: (result) => set({ last: result }),
  clear: () => set({ last: null }),
}));
