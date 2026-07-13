import { create } from 'zustand';
import type { MadhabSchool, ZakatInput, ZakatResult } from '@/core/zakat';

/**
 * Transient holder for the most recent Zakat computation, handed from the input screen to the result
 * screen (avoids serializing a complex object through navigation params). In-memory only — persisted
 * calculation history is WatermelonDB's job (ADR 0002/0007) and lands with the History feature.
 */
export type ZakatComputation = {
  input: ZakatInput;
  result: ZakatResult;
  madhab: MadhabSchool;
};

type ZakatState = {
  last: ZakatComputation | null;
  setLast: (computation: ZakatComputation) => void;
  clear: () => void;
};

export const useZakatStore = create<ZakatState>((set) => ({
  last: null,
  setLast: (computation) => set({ last: computation }),
  clear: () => set({ last: null }),
}));
