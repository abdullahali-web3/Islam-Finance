import { create } from 'zustand';

/** Tasbih (dhikr) counter — in-memory for the session (a lightweight utility, not persisted data). */
type TasbihState = {
  count: number;
  target: number;
  increment: () => void;
  reset: () => void;
  setTarget: (target: number) => void;
};

export const useTasbihStore = create<TasbihState>((set) => ({
  count: 0,
  target: 33,
  increment: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
  setTarget: (target) => set({ target, count: 0 }),
}));
