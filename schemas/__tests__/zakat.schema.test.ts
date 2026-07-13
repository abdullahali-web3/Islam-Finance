import { describe, it, expect } from '@jest/globals';
import { makeZakatSchema, zakatDefaultValues, type ZakatFormValues } from '../zakat.schema';

// The basis-aware price validation (makeZakatSchema.superRefine) requires a metal's price only when
// it's needed — the nisab basis, or a metal the user actually holds — so a cash-only user isn't
// over-asked. This logic previously had no dedicated tests (QA finding).
function values(overrides: Partial<ZakatFormValues> = {}): ZakatFormValues {
  return { ...zakatDefaultValues, ...overrides };
}

function firstIssuePath(schema: ReturnType<typeof makeZakatSchema>, v: ZakatFormValues) {
  const r = schema.safeParse(v);
  return r.success ? null : r.error.issues[0]?.path.join('.');
}

describe('makeZakatSchema — basis-aware price validation', () => {
  it('cash-only + silver basis: requires silver price, not gold price', () => {
    const schema = makeZakatSchema('silver');
    // silver price missing → invalid, error on silverPricePerGram
    expect(firstIssuePath(schema, values({ cash: 100, silverPricePerGram: 0 }))).toBe(
      'silverPricePerGram'
    );
    // silver price present, gold price absent (no gold held) → valid
    expect(schema.safeParse(values({ cash: 100, silverPricePerGram: 1 })).success).toBe(true);
  });

  it('cash-only + gold basis: requires gold price, not silver price', () => {
    const schema = makeZakatSchema('gold');
    expect(firstIssuePath(schema, values({ cash: 100, goldPricePerGram: 0 }))).toBe(
      'goldPricePerGram'
    );
    expect(schema.safeParse(values({ cash: 100, goldPricePerGram: 1 })).success).toBe(true);
  });

  it('holding gold on silver basis still requires the gold price (to value the gold)', () => {
    const schema = makeZakatSchema('silver');
    const r = schema.safeParse(
      values({ goldGramsInvestment: 10, goldPricePerGram: 0, silverPricePerGram: 1 })
    );
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path.join('.') === 'goldPricePerGram')).toBe(true);
    }
  });

  it('rejects negative amounts', () => {
    const schema = makeZakatSchema('silver');
    expect(firstIssuePath(schema, values({ cash: -100, silverPricePerGram: 1 }))).toBe('cash');
  });

  it('uses the provided translated messages', () => {
    const schema = makeZakatSchema('silver', {
      amount: 'A',
      nonnegative: 'NN',
      goldPrice: 'GP',
      silverPrice: 'SP',
    });
    const r = schema.safeParse(values({ cash: 100, silverPricePerGram: 0 }));
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toBe('SP');
    }
  });
});
