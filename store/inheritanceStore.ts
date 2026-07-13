import { create } from 'zustand';
import type { MadhabSchool, InheritanceInput, InheritanceResult } from '@/core/inheritance';

/**
 * Transient holder for the most recent inheritance computation, handed from the input screen to the
 * result screen (avoids serializing a complex object through navigation params). In-memory only —
 * persisted history is WatermelonDB's job (ADR 0002/0007), landing with the History feature.
 */
export type InheritanceComputation = {
  input: InheritanceInput;
  result: InheritanceResult;
  madhab: MadhabSchool;
};

type InheritanceState = {
  last: InheritanceComputation | null;
  setLast: (computation: InheritanceComputation) => void;
  clear: () => void;
};

export const useInheritanceStore = create<InheritanceState>((set) => ({
  last: null,
  setLast: (computation) => set({ last: computation }),
  clear: () => set({ last: null }),
}));
