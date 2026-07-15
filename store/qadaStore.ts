import { create } from 'zustand';
import type { QadaResult } from '@/core/qada';

type QadaState = {
  last: QadaResult | null;
  setLast: (result: QadaResult) => void;
  clear: () => void;
};

export const useQadaStore = create<QadaState>((set) => ({
  last: null,
  setLast: (result) => set({ last: result }),
  clear: () => set({ last: null }),
}));
