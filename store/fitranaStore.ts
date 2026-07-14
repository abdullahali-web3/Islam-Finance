import { create } from 'zustand';
import type { FitranaResult } from '@/core/fitrana';

/** Transient input→result handoff for the Fitrana result screen (in-memory; history is separate). */
type FitranaState = {
  last: FitranaResult | null;
  setLast: (result: FitranaResult) => void;
  clear: () => void;
};

export const useFitranaStore = create<FitranaState>((set) => ({
  last: null,
  setLast: (result) => set({ last: result }),
  clear: () => set({ last: null }),
}));
