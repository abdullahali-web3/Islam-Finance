import { describe, it, expect } from '@jest/globals';
import {
  distributeInheritance,
  getRuleModule,
  ALL_RULE_MODULES,
  UnsupportedInheritanceCase,
  type HeirKey,
  type InheritanceInput,
  type InheritanceResult,
} from '../index';

// Fixtures derived VERBATIM from docs/fiqh/inheritance.md "Worked Examples" (1–10). The doc's numbers
// are the source of truth; these fail if the engine drifts from the researched rules.
function base(overrides: Partial<InheritanceInput> = {}): InheritanceInput {
  return {
    estate: 0,
    currency: 'USD',
    husband: false,
    wives: 0,
    father: false,
    mother: false,
    sons: 0,
    daughters: 0,
    sonsSons: 0,
    sonsDaughters: 0,
    paternalGrandfather: false,
    paternalGrandmother: false,
    maternalGrandmother: false,
    fullBrothers: 0,
    fullSisters: 0,
    paternalBrothers: 0,
    paternalSisters: 0,
    maternalSiblings: 0,
    ...overrides,
  };
}

function amt(result: InheritanceResult, heir: HeirKey): number {
  return result.shares.find((s) => s.heir === heir)?.amount.amount ?? 0;
}
function perHead(result: InheritanceResult, heir: HeirKey): number {
  return result.shares.find((s) => s.heir === heir)?.perHeadAmount.amount ?? 0;
}

describe('distributeInheritance — worked examples (inheritance.md)', () => {
  it('1. spouse + children (residue 2:1)', () => {
    const r = distributeInheritance(
      base({ estate: 100000, wives: 1, sons: 1, daughters: 2 }),
      getRuleModule('hanafi')
    );
    expect(amt(r, 'wife')).toBe(12500);
    expect(amt(r, 'son')).toBe(43750);
    expect(amt(r, 'daughter')).toBe(43750);
    expect(perHead(r, 'daughter')).toBe(21875);
    expect(r.totalDistributed.amount).toBe(100000);
  });

  it('2. Umariyyatān (spouse + both parents)', () => {
    const r = distributeInheritance(
      base({ estate: 60000, husband: true, father: true, mother: true }),
      getRuleModule('hanafi')
    );
    expect(amt(r, 'husband')).toBe(30000);
    expect(amt(r, 'mother')).toBe(10000);
    expect(amt(r, 'father')).toBe(20000);
  });

  it('3. daughters + mother → Radd (default/diaspora)', () => {
    const input = base({ estate: 90000, daughters: 2, mother: true });
    const r = distributeInheritance(input, getRuleModule('hanafi'));
    expect(amt(r, 'daughter')).toBe(72000);
    expect(perHead(r, 'daughter')).toBe(36000);
    expect(amt(r, 'mother')).toBe(18000);
    expect(r.adjustment).toBe('radd');
    // Diaspora default applies Radd for Shafiʿi too (appliesRadd = true).
    expect(amt(distributeInheritance(input, getRuleModule('shafii')), 'daughter')).toBe(72000);
  });

  it('4. sole-heir spouse → Radd to spouse (diaspora default)', () => {
    const r = distributeInheritance(base({ estate: 50000, wives: 1 }), getRuleModule('hanafi'));
    expect(amt(r, 'wife')).toBe(50000);
  });

  it('5. ʿAwl (to 7): husband + 2 full sisters', () => {
    const r = distributeInheritance(
      base({ estate: 42000, husband: true, fullSisters: 2 }),
      getRuleModule('hanafi')
    );
    expect(amt(r, 'husband')).toBe(18000);
    expect(amt(r, 'fullSister')).toBe(24000);
    expect(perHead(r, 'fullSister')).toBe(12000);
    expect(r.adjustment).toBe('awl');
  });

  it('6. grandfather + siblings divergence', () => {
    const input = base({ estate: 90000, paternalGrandfather: true, fullBrothers: 2 });
    const hanafi = distributeInheritance(input, getRuleModule('hanafi'));
    expect(amt(hanafi, 'paternalGrandfather')).toBe(90000); // blocks the brothers
    expect(amt(hanafi, 'fullBrother')).toBe(0);

    const shafii = distributeInheritance(input, getRuleModule('shafii'));
    expect(amt(shafii, 'paternalGrandfather')).toBe(30000); // muqāsama
    expect(amt(shafii, 'fullBrother')).toBe(60000);
    expect(perHead(shafii, 'fullBrother')).toBe(30000);
  });

  it('7. uterine + full siblings', () => {
    const r = distributeInheritance(
      base({ estate: 60000, mother: true, maternalSiblings: 2, fullBrothers: 1 }),
      getRuleModule('hanafi')
    );
    expect(amt(r, 'mother')).toBe(10000);
    expect(amt(r, 'maternalSibling')).toBe(20000);
    expect(amt(r, 'fullBrother')).toBe(30000);
  });

  it('8. al-Mushtaraka divergence', () => {
    const input = base({
      estate: 60000,
      husband: true,
      mother: true,
      maternalSiblings: 2,
      fullBrothers: 2,
    });
    const hanafi = distributeInheritance(input, getRuleModule('hanafi'));
    expect(amt(hanafi, 'husband')).toBe(30000);
    expect(amt(hanafi, 'mother')).toBe(10000);
    expect(amt(hanafi, 'maternalSibling')).toBe(20000);
    expect(amt(hanafi, 'fullBrother')).toBe(0);

    const shafii = distributeInheritance(input, getRuleModule('shafii'));
    expect(amt(shafii, 'maternalSibling')).toBe(10000); // ⅓ now shared among 4
    expect(amt(shafii, 'fullBrother')).toBe(10000);
    expect(perHead(shafii, 'fullBrother')).toBe(5000);
  });

  it('9. granddaughter completes the ⅔ (takmila)', () => {
    const r = distributeInheritance(
      base({ estate: 60000, daughters: 1, sonsDaughters: 1, mother: true, father: true }),
      getRuleModule('hanafi')
    );
    expect(amt(r, 'daughter')).toBe(30000);
    expect(amt(r, 'sonsDaughter')).toBe(10000);
    expect(amt(r, 'mother')).toBe(10000);
    expect(amt(r, 'father')).toBe(10000);
  });

  it('10. grandson as residuary (with a daughter)', () => {
    const r = distributeInheritance(
      base({ estate: 90000, daughters: 1, sonsSons: 1, sonsDaughters: 1, father: true }),
      getRuleModule('hanafi')
    );
    expect(amt(r, 'daughter')).toBe(45000);
    expect(amt(r, 'father')).toBe(15000);
    expect(amt(r, 'sonsSon')).toBe(20000);
    expect(amt(r, 'sonsDaughter')).toBe(10000);
  });
});

describe('distributeInheritance — invariants & guards', () => {
  it('every worked example distributes exactly the estate', () => {
    const inputs: InheritanceInput[] = [
      base({ estate: 100000, wives: 1, sons: 1, daughters: 2 }),
      base({ estate: 60000, husband: true, father: true, mother: true }),
      base({ estate: 90000, daughters: 2, mother: true }),
      base({ estate: 50000, wives: 1 }),
      base({ estate: 42000, husband: true, fullSisters: 2 }),
      base({ estate: 60000, mother: true, maternalSiblings: 2, fullBrothers: 1 }),
      base({ estate: 60000, daughters: 1, sonsDaughters: 1, mother: true, father: true }),
      base({ estate: 90000, daughters: 1, sonsSons: 1, sonsDaughters: 1, father: true }),
    ];
    for (const input of inputs) {
      const r = distributeInheritance(input, getRuleModule('hanafi'));
      expect(r.totalDistributed.amount).toBeCloseTo(input.estate, 2);
    }
  });

  it('has all four Sunni schools', () => {
    expect(new Set(ALL_RULE_MODULES.map((m) => m.school))).toEqual(
      new Set(['hanafi', 'shafii', 'maliki', 'hanbali'])
    );
  });

  it('guards grandfather + siblings mixed with other fixed heirs (V1 unsupported)', () => {
    expect(() =>
      distributeInheritance(
        base({ estate: 60000, husband: true, paternalGrandfather: true, fullBrothers: 1 }),
        getRuleModule('shafii')
      )
    ).toThrow(UnsupportedInheritanceCase);
  });

  it('guards full + consanguine siblings together (V1 unsupported)', () => {
    expect(() =>
      distributeInheritance(
        base({ estate: 60000, fullSisters: 1, paternalSisters: 1 }),
        getRuleModule('hanafi')
      )
    ).toThrow(UnsupportedInheritanceCase);
  });
});
