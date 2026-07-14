import { create } from 'zustand';
import type { QurbaniResult } from '@/core/qurbani';

type QurbaniState = {
  last: QurbaniResult | null;
  setLast: (result: QurbaniResult) => void;
  clear: () => void;
};

export const useQurbaniStore = create<QurbaniState>((set) => ({
  last: null,
  setLast: (result) => set({ last: result }),
  clear: () => set({ last: null }),
}));
