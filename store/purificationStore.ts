import { create } from 'zustand';
import type { PurificationResult } from '@/core/purification';

type PurificationState = {
  last: PurificationResult | null;
  setLast: (result: PurificationResult) => void;
  clear: () => void;
};

export const usePurificationStore = create<PurificationState>((set) => ({
  last: null,
  setLast: (result) => set({ last: result }),
  clear: () => set({ last: null }),
}));
