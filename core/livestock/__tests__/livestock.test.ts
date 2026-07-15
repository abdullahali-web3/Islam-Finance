import { describe, it, expect } from '@jest/globals';
import {
  calculateLivestock,
  getRuleModule,
  ALL_RULE_MODULES,
  type LivestockInput,
} from '../index';

// Fixtures are the numbered "Worked Examples" in docs/fiqh/livestock.md, verbatim.
// Unless stated, hawlMet=true, grazing=true, working=false; "majority" = hanafi/shafii/hanbali.
function base(overrides: Partial<LivestockInput> = {}): LivestockInput {
  return { species: 'sheepGoats', count: 0, grazing: true, working: false, hawlMet: true, ...overrides };
}

const majority = getRuleModule('shafii');

describe('calculateLivestock — sheep & goats', () => {
  it('1. 39 → none (below niṣāb)', () => {
    const r = calculateLivestock(base({ count: 39 }), majority);
    expect(r.due).toBe(false);
    expect(r.reason).toBe('below-nisab');
  });
  it('2. 40 → 1 sheep', () => {
    expect(calculateLivestock(base({ count: 40 }), majority).animals).toEqual([{ type: 'sheep', count: 1 }]);
  });
  it('3. 120 → 1 sheep', () => {
    expect(calculateLivestock(base({ count: 120 }), majority).animals).toEqual([{ type: 'sheep', count: 1 }]);
  });
  it('4. 121 → 2 sheep', () => {
    expect(calculateLivestock(base({ count: 121 }), majority).animals).toEqual([{ type: 'sheep', count: 2 }]);
  });
  it('5. 200 → 2 sheep', () => {
    expect(calculateLivestock(base({ count: 200 }), majority).animals).toEqual([{ type: 'sheep', count: 2 }]);
  });
  it('6. 201 → 3 sheep', () => {
    expect(calculateLivestock(base({ count: 201 }), majority).animals).toEqual([{ type: 'sheep', count: 3 }]);
  });
  it('7. 400 → 4 sheep', () => {
    expect(calculateLivestock(base({ count: 400 }), majority).animals).toEqual([{ type: 'sheep', count: 4 }]);
  });
  it('8. 500 → 5 sheep', () => {
    expect(calculateLivestock(base({ count: 500 }), majority).animals).toEqual([{ type: 'sheep', count: 5 }]);
  });
});

describe('calculateLivestock — camels', () => {
  const camels = (count: number) => calculateLivestock(base({ species: 'camels', count }), majority);
  it('9. 4 → none (below niṣāb)', () => {
    expect(camels(4).due).toBe(false);
    expect(camels(4).reason).toBe('below-nisab');
  });
  it('10. 5 → 1 sheep', () => expect(camels(5).animals).toEqual([{ type: 'sheep', count: 1 }]));
  it('11. 24 → 4 sheep', () => expect(camels(24).animals).toEqual([{ type: 'sheep', count: 4 }]));
  it('12. 25 → 1 bint makhāḍ', () => expect(camels(25).animals).toEqual([{ type: 'bintMakhad', count: 1 }]));
  it('13. 36 → 1 bint labūn', () => expect(camels(36).animals).toEqual([{ type: 'bintLabun', count: 1 }]));
  it('14. 46 → 1 ḥiqqah', () => expect(camels(46).animals).toEqual([{ type: 'hiqqah', count: 1 }]));
  it('15. 61 → 1 jadhaʿah', () => expect(camels(61).animals).toEqual([{ type: 'jadhaah', count: 1 }]));
  it('16. 76 → 2 bint labūn', () => expect(camels(76).animals).toEqual([{ type: 'bintLabun', count: 2 }]));
  it('17. 91 → 2 ḥiqqah', () => expect(camels(91).animals).toEqual([{ type: 'hiqqah', count: 2 }]));
  it('18. 120 → 2 ḥiqqah', () => expect(camels(120).animals).toEqual([{ type: 'hiqqah', count: 2 }]));
  it('19. 130 → 2 bint labūn + 1 ḥiqqah', () => {
    expect(camels(130).animals).toEqual([
      { type: 'bintLabun', count: 2 },
      { type: 'hiqqah', count: 1 },
    ]);
  });
  it('20. 200 → 4 ḥiqqah (alt: 5 bint labūn)', () => {
    const r = camels(200);
    expect(r.animals).toEqual([{ type: 'hiqqah', count: 4 }]);
    expect(r.alternative).toEqual([{ type: 'bintLabun', count: 5 }]);
  });
});

describe('calculateLivestock — cattle', () => {
  const cattle = (count: number) => calculateLivestock(base({ species: 'cattle', count }), majority);
  it('21. 29 → none (below niṣāb)', () => {
    expect(cattle(29).due).toBe(false);
    expect(cattle(29).reason).toBe('below-nisab');
  });
  it('22. 30 → 1 tabīʿ', () => expect(cattle(30).animals).toEqual([{ type: 'tabi', count: 1 }]));
  it('23. 40 → 1 musinnah', () => expect(cattle(40).animals).toEqual([{ type: 'musinnah', count: 1 }]));
  it('24. 60 → 2 tabīʿ', () => expect(cattle(60).animals).toEqual([{ type: 'tabi', count: 2 }]));
  it('25. 70 → 1 tabīʿ + 1 musinnah', () => {
    expect(cattle(70).animals).toEqual([
      { type: 'tabi', count: 1 },
      { type: 'musinnah', count: 1 },
    ]);
  });
  it('26. 80 → 2 musinnah', () => expect(cattle(80).animals).toEqual([{ type: 'musinnah', count: 2 }]));
  it('27. 90 → 3 tabīʿ', () => expect(cattle(90).animals).toEqual([{ type: 'tabi', count: 3 }]));
  it('28. 100 → 2 tabīʿ + 1 musinnah', () => {
    expect(cattle(100).animals).toEqual([
      { type: 'tabi', count: 2 },
      { type: 'musinnah', count: 1 },
    ]);
  });
  it('29. 120 → 3 musinnah (alt: 4 tabīʿ)', () => {
    const r = cattle(120);
    expect(r.animals).toEqual([{ type: 'musinnah', count: 3 }]);
    expect(r.alternative).toEqual([{ type: 'tabi', count: 4 }]);
  });
});

describe('calculateLivestock — conditions & madhab', () => {
  it('30. 100 sheep, fodder-fed, majority → none (grazing required)', () => {
    const r = calculateLivestock(base({ count: 100, grazing: false }), getRuleModule('shafii'));
    expect(r.due).toBe(false);
    expect(r.reason).toBe('not-grazing-exempt');
  });
  it('31. 100 sheep, fodder-fed, Maliki → 1 sheep (levied regardless)', () => {
    const r = calculateLivestock(base({ count: 100, grazing: false }), getRuleModule('maliki'));
    expect(r.animals).toEqual([{ type: 'sheep', count: 1 }]);
  });
  it('32. 40 cattle, working, majority → none (ʿawāmil exempt)', () => {
    const r = calculateLivestock(
      base({ species: 'cattle', count: 40, working: true }),
      getRuleModule('hanbali')
    );
    expect(r.due).toBe(false);
    expect(r.reason).toBe('working-exempt');
  });
  it('33. 40 cattle, working, Maliki → 1 musinnah', () => {
    const r = calculateLivestock(
      base({ species: 'cattle', count: 40, working: true }),
      getRuleModule('maliki')
    );
    expect(r.animals).toEqual([{ type: 'musinnah', count: 1 }]);
  });
  it('34. 40 sheep, ḥawl not met → none', () => {
    const r = calculateLivestock(base({ count: 40, hawlMet: false }), majority);
    expect(r.due).toBe(false);
    expect(r.reason).toBe('hawl-not-met');
  });

  it('Hanafi permits paying the cash value; others in-kind', () => {
    expect(getRuleModule('hanafi').valuePaymentAllowed).toBe(true);
    expect(getRuleModule('shafii').valuePaymentAllowed).toBe(false);
  });
  it('has all four schools', () => {
    expect(new Set(ALL_RULE_MODULES.map((m) => m.school))).toEqual(
      new Set(['hanafi', 'shafii', 'maliki', 'hanbali'])
    );
  });
});

describe('calculateLivestock — owner\'s-choice alternative scope (post-QA)', () => {
  const at = (species: 'camels' | 'cattle', count: number) =>
    calculateLivestock(base({ species, count }), majority);

  it('surfaces the alternative only at common multiples of both age units', () => {
    // Doc-verified common multiples keep their "either whole type" alternative.
    expect(at('cattle', 120).alternative).toEqual([{ type: 'tabi', count: 4 }]);
    expect(at('camels', 200).alternative).toEqual([{ type: 'bintLabun', count: 5 }]);
    // Higher common multiples too (cattle 240 = 6 musinnah or 8 tabīʿ).
    expect(at('cattle', 240).alternative).toEqual([{ type: 'tabi', count: 8 }]);
  });

  it('suppresses mixed alternatives at non-common-multiple sizes', () => {
    // cattle 150 (= 1 tabīʿ + 3 musinnah) — a "5 tabīʿ" alternative is not cited, so not shown.
    expect(at('cattle', 150).alternative).toBeNull();
    expect(at('camels', 250).alternative).toBeNull();
  });

  it('caps herd size to keep the decomposition loop bounded (schema guard)', () => {
    // Engine itself stays fast/correct even at the cap; the schema rejects anything larger.
    expect(at('cattle', 1_000_000).due).toBe(true);
  });
});
