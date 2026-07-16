// Surah search matching. Pure TS, no RN imports (CLAUDE.md).
//
// Why this exists: Tanzil's transliterations use a scholarly long-vowel convention — "Al-Faatiha",
// "Al-Ikhlaas", "Ar-Rahmaan", "Nooh", "Yaseen" — but users type what they say: "fatiha", "ikhlas",
// "rahman", "nuh", "yasin". A raw substring test returns NOTHING for every one of those, i.e. it
// fails on the most-read surahs in the book, which is most of the value of a search box over 114
// items. So both sides are folded to a common form before matching.
//
// This is a deliberately shallow phonetic fold, not a transliteration engine. It targets the
// systematic divergences between the Tanzil spellings and common usage, and is verified against real
// queries in __tests__/search.test.ts rather than asserted in the abstract.

import type { SurahMeta } from './types';

/**
 * Folds a Latin transliteration to a comparable skeleton.
 *
 * Order matters: long vowels collapse first (so "Yaseen" -> "yasin" before doubled-letter collapsing
 * could turn "ee" into "e"), then digraphs that vary by convention, then doubled consonants from
 * assimilated articles ("Ar-Rahmaan" -> "arahman"), then a trailing "ah" ("baqarah" -> "baqara").
 */
export function normalizeTransliteration(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z]/g, '') // hyphens, apostrophes, spaces: "Aal-i-Imraan" -> "aaliimraan"
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'i') // Yaseen -> yasin
    .replace(/ii/g, 'i')
    .replace(/oo/g, 'u') // Nooh -> nuh
    .replace(/uu/g, 'u')
    .replace(/aw/g, 'au') // Tawba/Tauba, Kawthar/Kauthar
    .replace(/th/g, 's') // Kawthar/Kausar — ث is commonly written 's' in South Asian usage
    .replace(/dh/g, 'z') // likewise ذ
    .replace(/(.)\1+/g, '$1') // At-Tawba -> atauba, Ar-Rahmaan -> arahman
    .replace(/ah$/, 'a'); // baqarah -> baqara, fatihah -> fatiha
}

/**
 * True when `query` matches the surah by number, Arabic name, transliteration, or English meaning.
 * An empty/whitespace query matches everything (an unfiltered list).
 *
 * Number matching is exact, not substring: typing "1" should not surface all of 1, 10-19, 100-114.
 */
export function matchesSurah(surah: SurahMeta, query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) return true;

  if (/^\d+$/.test(trimmed) && Number(trimmed) === surah.number) return true;

  // Arabic name: compared raw — the user is typing Arabic, so no Latin folding applies.
  if (surah.name.includes(trimmed)) return true;

  const q = normalizeTransliteration(trimmed);
  if (!q) return false; // query was punctuation/digits only and didn't match a number above

  return (
    normalizeTransliteration(surah.transliteration).includes(q) ||
    normalizeTransliteration(surah.englishName).includes(q)
  );
}
