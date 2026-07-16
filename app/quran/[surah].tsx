import { useLocalSearchParams } from 'expo-router';
import { SurahReaderScreen } from '@/features/quran';

/**
 * Reader route: islamfinance://quran/<1-114>, optionally ?ayah=<n> to open at a verse (used by the
 * "continue reading" resume and by jumping from a bookmark). Lives outside (tabs) so the mushaf
 * renders full-screen without the tab bar.
 *
 * The params are untrusted strings from a deep link. `Number()` alone is too lenient — it accepts
 * "0x2", "1e2", "+2", " 2 " — so anything not plain digits becomes NaN: an invalid surah lands on
 * the error state. The ayah is only a hint here; the reader validates it against the surah's actual
 * ayah count (isValidVerse) before using it, so an out-of-range or non-digit ayah opens at the top
 * rather than reaching scrollToIndex.
 */
const toPositiveInt = (v: string | string[] | undefined): number | undefined => {
  const raw = Array.isArray(v) ? v[0] : v;
  return /^\d+$/.test(raw ?? '') ? Number(raw) : undefined;
};

export default function SurahRoute() {
  const { surah, ayah } = useLocalSearchParams<{ surah: string | string[]; ayah?: string | string[] }>();
  return <SurahReaderScreen surah={toPositiveInt(surah) ?? NaN} initialAyah={toPositiveInt(ayah)} />;
}
