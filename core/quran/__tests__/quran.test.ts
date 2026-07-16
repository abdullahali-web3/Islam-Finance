// Quran data-layer tests. ADR 0016 holds scripture to fiqh-grade accuracy, so these assert the
// integrity of the bundled mushaf itself — not just that the functions run.
//
// The load-bearing test is "verbatim round-trip": getSurah() splits the basmala off ayah 1 for
// display, and the licence permits that only because it is a *layout* split, not an edit. The
// round-trip test is what proves no character of the revelation is dropped or altered in the process.

import { describe, it, expect } from '@jest/globals';
import {
  QURAN_ATTRIBUTION,
  TOTAL_AYAT,
  TOTAL_SURAHS,
  formatVerseKey,
  getAyah,
  getSurah,
  getSurahMeta,
  isValidSurah,
  listSurahs,
  listSurahsByRevelation,
  parseVerseKey,
} from '../index';

const raw = require('../data/uthmani.json') as { surahs: string[][] };

/** Strip diacritics + unify alef forms, leaving the consonantal skeleton. */
const skeleton = (s: string) =>
  s
    .replace(/[ً-ٰٕۖ-ۭ]/g, '')
    .replace(/[آأإٱ]/g, 'ا')
    .replace(/\s+/g, ' ')
    .trim();

const BASMALA_SKELETON = 'بسم الله الرحمن الرحيم';

describe('bundled mushaf integrity', () => {
  it('has exactly 114 surahs', () => {
    expect(listSurahs()).toHaveLength(TOTAL_SURAHS);
    expect(raw.surahs).toHaveLength(TOTAL_SURAHS);
  });

  it('has exactly 6236 ayat in total', () => {
    const total = raw.surahs.reduce((n, s) => n + s.length, 0);
    expect(total).toBe(TOTAL_AYAT);
  });

  it('every surah has the ayah count its metadata declares', () => {
    for (const meta of listSurahs()) {
      expect(getSurah(meta.number).ayat).toHaveLength(meta.ayahCount);
    }
  });

  it('no ayah is empty', () => {
    for (const meta of listSurahs()) {
      for (const ayah of getSurah(meta.number).ayat) {
        expect(ayah.text.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('numbers surahs 1-114 in mushaf order with no gaps', () => {
    expect(listSurahs().map((s) => s.number)).toEqual(
      Array.from({ length: TOTAL_SURAHS }, (_, i) => i + 1),
    );
  });
});

describe('basmala handling', () => {
  it('Al-Fatiha keeps the basmala as numbered ayah 1 and renders no header', () => {
    const s = getSurah(1);
    expect(s.bismillah).toBeNull();
    expect(skeleton(s.ayat[0].text)).toBe(BASMALA_SKELETON);
    expect(s.ayat).toHaveLength(7);
  });

  it('At-Tawba has no basmala at all', () => {
    const s = getSurah(9);
    expect(s.bismillah).toBeNull();
    // Begins "Baraa'atun min Allahi wa rasulihi..." — not the basmala.
    expect(skeleton(s.ayat[0].text).startsWith('براءة')).toBe(true);
  });

  it('every other surah exposes the basmala as a header, not as part of ayah 1', () => {
    for (let n = 2; n <= TOTAL_SURAHS; n++) {
      if (n === 9) continue;
      const s = getSurah(n);
      expect(skeleton(s.bismillah ?? '')).toBe(BASMALA_SKELETON);
      expect(skeleton(s.ayat[0].text).startsWith(BASMALA_SKELETON)).toBe(false);
    }
  });

  it('splits surahs 95 and 97 correctly despite their shadda-variant basmala', () => {
    // Regression guard for the real trap: 95 and 97 spell the first word بِّسْمِ — bāʾ + shadda
    // (U+0651) + kasra — against بِسْمِ (bāʾ + kasra) in the other 110. A `startsWith`-based split
    // against Al-Fatiha's basmala therefore silently fails on exactly these two.
    //
    // Assert on the FIRST WORD's codepoints specifically. Asserting merely that the basmala
    // "contains a shadda" would be vacuous — ٱللَّه, ٱلرَّحْمَٰن and ٱلرَّحِيم each carry one, so
    // that holds for all 112 and would still pass if the variant were normalized away.
    const firstWordOf = (n: number) => getSurah(n).bismillah!.split(' ')[0];
    const codepoints = (s: string) => [...s].map((c) => c.codePointAt(0));

    const SHADDA = 0x0651;
    for (const n of [95, 97]) {
      expect(getSurah(n).bismillah).not.toBeNull();
      expect(codepoints(firstWordOf(n))).toContain(SHADDA); // variant preserved, not normalized
      expect(skeleton(getSurah(n).bismillah!)).toBe(BASMALA_SKELETON);
    }
    // ...and the ordinary spelling genuinely lacks it, which is what makes 95/97 a trap at all.
    expect(codepoints(firstWordOf(2))).not.toContain(SHADDA);
    expect(firstWordOf(95)).not.toBe(firstWordOf(2));

    // "By the fig and the olive" — the basmala is gone from ayah 1, and only the basmala is gone.
    expect(skeleton(getSurah(95).ayat[0].text)).toBe('والتين والزيتون');
  });
});

describe('verbatim round-trip (licence-critical)', () => {
  it('reconstructs every upstream ayah exactly from what getSurah returns', () => {
    for (let n = 1; n <= TOTAL_SURAHS; n++) {
      const s = getSurah(n);
      const rebuilt = s.ayat.map((a, i) =>
        i === 0 && s.bismillah ? `${s.bismillah} ${a.text}` : a.text,
      );
      expect(rebuilt).toEqual(raw.surahs[n - 1]);
    }
  });
});

describe('known verses', () => {
  it('returns Ayat al-Kursi at 2:255', () => {
    const a = getAyah(2, 255);
    expect(a.key).toBe('2:255');
    expect(skeleton(a.text).startsWith('الله لا اله الا هو الحى القيوم')).toBe(true);
  });

  it('returns the whole of Al-Ikhlas (112)', () => {
    const s = getSurah(112);
    expect(s.ayat).toHaveLength(4);
    expect(skeleton(s.ayat[0].text)).toBe('قل هو الله احد');
  });

  it('ends the mushaf at 114:6', () => {
    const s = getSurah(114);
    expect(s.ayat).toHaveLength(6);
    expect(skeleton(s.ayat[5].text)).toBe('من الجنة والناس');
  });
});

describe('metadata', () => {
  it('describes Al-Fatiha', () => {
    expect(getSurahMeta(1)).toMatchObject({
      number: 1,
      ayahCount: 7,
      transliteration: 'Al-Faatiha',
      englishName: 'The Opening',
      revelation: 'meccan',
    });
  });

  it('marks Al-Baqara as Medinan — the longest surah', () => {
    expect(getSurahMeta(2)).toMatchObject({ ayahCount: 286, revelation: 'medinan' });
  });

  it('sorts by revelation order without disturbing mushaf order', () => {
    const byRev = listSurahsByRevelation();
    expect(byRev).toHaveLength(TOTAL_SURAHS);
    expect(byRev[0].revelationOrder).toBe(1);
    expect(byRev[0].number).toBe(96); // Al-'Alaq — first revealed
    expect(listSurahs()[0].number).toBe(1); // canonical list untouched
  });

  it('rejects out-of-range surahs', () => {
    expect(() => getSurahMeta(0)).toThrow(RangeError);
    expect(() => getSurahMeta(115)).toThrow(RangeError);
    expect(() => getSurahMeta(1.5)).toThrow(RangeError);
  });
});

describe('verse keys', () => {
  it('formats', () => {
    expect(formatVerseKey(2, 255)).toBe('2:255');
  });

  it('parses valid keys', () => {
    expect(parseVerseKey('2:255')).toEqual({ surah: 2, ayah: 255 });
    expect(parseVerseKey(' 1:1 ')).toEqual({ surah: 1, ayah: 1 });
  });

  it('rejects malformed keys', () => {
    for (const k of ['', '2', '2:', ':255', 'x:y', '2:255:1', '2.5:1', '-2:1']) {
      expect(parseVerseKey(k)).toBeNull();
    }
  });

  it('rejects keys outside the mushaf', () => {
    expect(parseVerseKey('115:1')).toBeNull();
    expect(parseVerseKey('0:1')).toBeNull();
    expect(parseVerseKey('2:287')).toBeNull(); // Al-Baqara has 286
    expect(parseVerseKey('2:0')).toBeNull();
  });

  it('accepts the last ayah of each surah but not one past it', () => {
    for (const meta of listSurahs()) {
      expect(parseVerseKey(`${meta.number}:${meta.ayahCount}`)).not.toBeNull();
      expect(parseVerseKey(`${meta.number}:${meta.ayahCount + 1}`)).toBeNull();
    }
  });
});

describe('getAyah bounds', () => {
  it('throws past the end of a surah', () => {
    expect(() => getAyah(2, 287)).toThrow(RangeError);
    expect(() => getAyah(1, 0)).toThrow(RangeError);
  });
});

describe('isValidSurah', () => {
  it('accepts 1-114 only', () => {
    expect(isValidSurah(1)).toBe(true);
    expect(isValidSurah(114)).toBe(true);
    expect(isValidSurah(0)).toBe(false);
    expect(isValidSurah(115)).toBe(false);
    expect(isValidSurah(NaN)).toBe(false);
  });
});

describe('attribution (CC BY condition — ADR 0016)', () => {
  it('carries the Tanzil notice, licence, and source link', () => {
    expect(QURAN_ATTRIBUTION.edition).toContain('Tanzil');
    expect(QURAN_ATTRIBUTION.license).toContain('CC BY');
    expect(QURAN_ATTRIBUTION.source).toContain('tanzil.net');
    expect(QURAN_ATTRIBUTION.notice).toContain('Tanzil Project');
    expect(QURAN_ATTRIBUTION.notice).toContain('Creative Commons Attribution');
  });
});
