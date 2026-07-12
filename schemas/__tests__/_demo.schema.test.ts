import { describe, it, expect } from '@jest/globals';
import { demoSchema } from '../_demo.schema';

// THROWAWAY smoke test — proves the Jest + Zod toolchain runs in Phase 0. Delete alongside
// the demo schema once real calculators (with fiqh-worked-example fixtures) exist.
describe('demoSchema (toolchain smoke test)', () => {
  it('accepts valid input', () => {
    const result = demoSchema.safeParse({
      fullName: 'Aisha',
      cashOnHand: 100,
      currency: 'USD',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty name', () => {
    const result = demoSchema.safeParse({ fullName: '', cashOnHand: 100, currency: 'USD' });
    expect(result.success).toBe(false);
  });

  it('rejects negative cash', () => {
    const result = demoSchema.safeParse({ fullName: 'Aisha', cashOnHand: -5, currency: 'USD' });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown currency', () => {
    const result = demoSchema.safeParse({ fullName: 'Aisha', cashOnHand: 100, currency: 'EUR' });
    expect(result.success).toBe(false);
  });
});
