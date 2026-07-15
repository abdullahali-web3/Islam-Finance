import { describe, it, expect } from '@jest/globals';
import {
  calculateQada,
  getRuleModule,
  ALL_RULE_MODULES,
  type QadaInput,
  type PrayersResult,
  type FastsResult,
} from '../index';

// Fixtures are the numbered "Worked Examples" in docs/fiqh/qada.md, verbatim.
function base(overrides: Partial<QadaInput> = {}): QadaInput {
  return {
    mode: 'prayers',
    years: 0,
    months: 0,
    days: 0,
    gender: 'male',
    menstruationDaysPerMonth: 7,
    missedFastDays: 0,
    delayedPastRamadan: false,
    ...overrides,
  };
}
const majority = getRuleModule('shafii');
const prayers = (r: ReturnType<typeof calculateQada>) => r as PrayersResult;
const fasts = (r: ReturnType<typeof calculateQada>) => r as FastsResult;

describe('calculateQada — prayers', () => {
  it('1. male, 1 year, majority → 1825 prayers', () => {
    expect(prayers(calculateQada(base({ years: 1 }), majority)).total).toBe(1825);
  });
  it('2. male, 1 year, Hanafi → 2190 (incl. 365 Witr)', () => {
    const r = prayers(calculateQada(base({ years: 1 }), getRuleModule('hanafi')));
    expect(r.total).toBe(2190);
    expect(r.witrTotal).toBe(365);
  });
  it('3. female, 1 year, 7 days/mo, majority → 1400', () => {
    const r = prayers(calculateQada(base({ years: 1, gender: 'female', menstruationDaysPerMonth: 7 }), majority));
    expect(r.menstruationDays).toBe(85);
    expect(r.prayerDays).toBe(280);
    expect(r.total).toBe(1400);
  });
  it('4. female, 1 year, 5 days/mo, Hanafi → 1824 (fard 1520 + Witr 304)', () => {
    const r = prayers(
      calculateQada(base({ years: 1, gender: 'female', menstruationDaysPerMonth: 5 }), getRuleModule('hanafi'))
    );
    expect(r.menstruationDays).toBe(61);
    expect(r.prayerDays).toBe(304);
    expect(r.fardTotal).toBe(1520);
    expect(r.witrTotal).toBe(304);
    expect(r.total).toBe(1824);
  });
  it('5. male, 2 years 6 months, majority → 4550', () => {
    expect(prayers(calculateQada(base({ years: 2, months: 6 }), majority)).total).toBe(4550);
  });
  it('6. male, 0 period → 0', () => {
    expect(prayers(calculateQada(base(), majority)).total).toBe(0);
  });
});

describe('calculateQada — fasts', () => {
  it('7. 30 fasts, not delayed, majority → make up 30, no fidya', () => {
    const r = fasts(calculateQada(base({ mode: 'fasts', missedFastDays: 30 }), majority));
    expect(r.fastsToMakeUp).toBe(30);
    expect(r.fidyaDueForDelay).toBe(false);
  });
  it('8. 30 fasts, delayed, majority → make up 30, fidya due', () => {
    const r = fasts(
      calculateQada(base({ mode: 'fasts', missedFastDays: 30, delayedPastRamadan: true }), majority)
    );
    expect(r.fidyaDueForDelay).toBe(true);
  });
  it('9. 30 fasts, delayed, Hanafi → make up 30, no fidya', () => {
    const r = fasts(
      calculateQada(base({ mode: 'fasts', missedFastDays: 30, delayedPastRamadan: true }), getRuleModule('hanafi'))
    );
    expect(r.fastsToMakeUp).toBe(30);
    expect(r.fidyaDueForDelay).toBe(false);
  });
  it('10. 60 fasts, not delayed → make up 60, no fidya', () => {
    expect(fasts(calculateQada(base({ mode: 'fasts', missedFastDays: 60 }), majority)).fastsToMakeUp).toBe(60);
  });
});

describe('calculateQada — madhab & guards', () => {
  it('Witr only in Hanafi prayer qaḍāʾ', () => {
    expect(getRuleModule('hanafi').includesWitr).toBe(true);
    expect(getRuleModule('shafii').includesWitr).toBe(false);
    expect(getRuleModule('maliki').includesWitr).toBe(false);
    expect(getRuleModule('hanbali').includesWitr).toBe(false);
  });
  it('fidya-for-delay only in the majority', () => {
    expect(getRuleModule('hanafi').fidyaForDelayedFast).toBe(false);
    expect(getRuleModule('hanbali').fidyaForDelayedFast).toBe(true);
  });
  it('menstruation is not subtracted for men', () => {
    expect(prayers(calculateQada(base({ years: 1, gender: 'male' }), majority)).menstruationDays).toBe(0);
  });
  it('has all four schools', () => {
    expect(new Set(ALL_RULE_MODULES.map((m) => m.school))).toEqual(
      new Set(['hanafi', 'shafii', 'maliki', 'hanbali'])
    );
  });
});
