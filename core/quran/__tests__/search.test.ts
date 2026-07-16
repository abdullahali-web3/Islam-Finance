// Surah search tests. The regression list below is not hypothetical — every query in
// "common spellings users actually type" was verified to return ZERO results before
// normalizeTransliteration existed, including plain "nuh" and "fatiha".

import { describe, it, expect } from '@jest/globals';
import { listSurahs, matchesSurah, normalizeTransliteration } from '../index';

const find = (query: string) => listSurahs().filter((s) => matchesSurah(s, query));
const numbers = (query: string) => find(query).map((s) => s.number);

describe('common spellings users actually type', () => {
  // [query, expected surah number] — each of these returned nothing under a raw substring match.
  const cases: [string, number][] = [
    ['fatiha', 1], // Tanzil: "Al-Faatiha"
    ['fatihah', 1],
    ['baqarah', 2], // Tanzil: "Al-Baqara"
    ['imran', 3], // Tanzil: "Aal-i-Imraan"
    ['maida', 5], // Tanzil: "Al-Maaida"
    ['taubah', 9], // Tanzil: "At-Tawba"
    ['muminun', 23], // Tanzil: "Al-Muminoon"
    ['yasin', 36], // Tanzil: "Yaseen"
    ['rahman', 55], // Tanzil: "Ar-Rahmaan"
    ['nuh', 71], // Tanzil: "Nooh"
    ['kausar', 108], // Tanzil: "Al-Kawthar"
    ['ikhlas', 112], // Tanzil: "Al-Ikhlaas"
  ];

  it.each(cases)('finds surah %i for query "%s"', (query, expected) => {
    expect(numbers(query)).toContain(expected);
  });

  it('still matches the canonical Tanzil spelling', () => {
    expect(numbers('Al-Faatiha')).toEqual([1]);
    expect(numbers('Yaseen')).toContain(36);
    expect(numbers('Al-Kawthar')).toContain(108);
  });
});

describe('match modes', () => {
  it('matches an exact surah number, not a substring of one', () => {
    // "1" must not drag in 10-19 and 100-114.
    expect(numbers('1')).toEqual([1]);
    expect(numbers('114')).toEqual([114]);
  });

  it('matches the Arabic name', () => {
    expect(numbers('الفاتحة')).toEqual([1]);
    expect(numbers('الكهف')).toEqual([18]);
  });

  it('matches the English meaning', () => {
    expect(numbers('opening')).toContain(1);
    expect(numbers('cave')).toContain(18);
    expect(numbers('The Cow')).toContain(2);
  });

  it('is case-insensitive and tolerates padding', () => {
    expect(numbers('  IKHLAS  ')).toContain(112);
  });

  it('returns everything for an empty query', () => {
    expect(find('')).toHaveLength(114);
    expect(find('   ')).toHaveLength(114);
  });

  it('returns nothing for a genuine non-match', () => {
    expect(find('zzzznomatch')).toHaveLength(0);
  });

  it('does not match an out-of-range number', () => {
    expect(find('115')).toHaveLength(0);
    expect(find('0')).toHaveLength(0);
  });
});

describe('normalizeTransliteration', () => {
  it('folds long vowels', () => {
    expect(normalizeTransliteration('Yaseen')).toBe('yasin');
    expect(normalizeTransliteration('Nooh')).toBe('nuh');
    expect(normalizeTransliteration('Al-Faatiha')).toBe('alfatiha');
  });

  it('strips separators (hyphens and apostrophes)', () => {
    expect(normalizeTransliteration("Aal-i-Imraan")).toBe('alimran');
    // Hyphen + apostrophe gone; the non-adjacent "shsh" is left as-is (the fold only collapses
    // adjacent duplicates), which is fine — "shuara"/"shu'ara" queries still land on it via substring.
    expect(normalizeTransliteration("Ash-Shu'araa")).toBe('ashshuara');
  });

  it('collapses doubled consonants from assimilated articles', () => {
    expect(normalizeTransliteration('Ar-Rahmaan')).toBe('arahman');
  });

  it('folds trailing -ah to -a so "baqarah" meets "Al-Baqara"', () => {
    expect(normalizeTransliteration('baqarah')).toBe('baqara');
    expect(normalizeTransliteration('Al-Baqara')).toBe('albaqara');
  });

  it('converges variant digraph conventions to one form', () => {
    expect(normalizeTransliteration('Al-Kawthar')).toBe('alkausar');
    // "kauthar" and "kausar" are the same word spelled two ways; both must fold together.
    expect(normalizeTransliteration('kauthar')).toBe(normalizeTransliteration('kausar'));
  });

  it('is empty for input with no letters', () => {
    expect(normalizeTransliteration('123')).toBe('');
    expect(normalizeTransliteration('---')).toBe('');
  });
});
