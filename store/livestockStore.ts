import { create } from 'zustand';
import type { LivestockResult } from '@/core/livestock';

type LivestockState = {
  last: LivestockResult | null;
  setLast: (result: LivestockResult) => void;
  clear: () => void;
};

export const useLivestockStore = create<LivestockState>((set) => ({
  last: null,
  setLast: (result) => set({ last: result }),
  clear: () => set({ last: null }),
}));
