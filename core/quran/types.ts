// Public types for the Quran module. Pure TS — no RN imports (CLAUDE.md).

export type Revelation = 'meccan' | 'medinan';

/** A verse reference — surah (1-114) and ayah within it. Validate with isValidVerse before trusting. */
export type VerseRef = { surah: number; ayah: number };

/** Surah metadata (Tanzil quran-data.xml). `number` is the canonical 1-114 mushaf order. */
export type SurahMeta = {
  /** 1-114, mushaf order. */
  number: number;
  /** Ayah count per the standard (Kufan) count — matches the bundled text exactly. */
  ayahCount: number;
  /** Arabic name, e.g. الفاتحة */
  name: string;
  /** Latin transliteration, e.g. "Al-Faatiha". */
  transliteration: string;
  /** English meaning, e.g. "The Opening". */
  englishName: string;
  revelation: Revelation;
  /** Order of revelation (1-114), distinct from mushaf order — used by the "sort by revelation" view. */
  revelationOrder: number;
};

/** A single ayah. `key` is the canonical "surah:ayah" reference (e.g. "2:255"). */
export type Ayah = {
  surah: number;
  ayah: number;
  key: string;
  /** Uthmani Arabic, verbatim from Tanzil. For ayah 1 of most surahs the basmala prefix has been
   *  separated out into `SurahText.bismillah` — see getSurah(). */
  text: string;
};

export type SurahText = {
  meta: SurahMeta;
  /**
   * The basmala to render as an unnumbered header above the surah, or `null` when it must not be.
   * Null in exactly two cases: Al-Fatiha (1), where the basmala *is* numbered ayah 1 and would
   * otherwise be duplicated, and At-Tawba (9), which has no basmala at all.
   */
  bismillah: string | null;
  ayat: Ayah[];
};

/** Licence/attribution metadata. Displaying this is a CC BY condition, not a courtesy (ADR 0016). */
export type QuranAttribution = {
  edition: string;
  license: string;
  /** Link to the source — required by the Tanzil terms so users can track upstream changes. */
  source: string;
  /** The upstream copyright block, verbatim. */
  notice: string;
};
