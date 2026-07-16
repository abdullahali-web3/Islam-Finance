// Regenerates the bundled Quran data in core/quran/data/ from the upstream Tanzil sources.
//
// Run with:  node scripts/build-quran-data.mjs
//
// This is NOT part of the app build — the generated JSON is committed, and this script is only rerun
// when Tanzil publishes an update (https://tanzil.net/updates/). Keeping it means the bundled text is
// reproducible from a cited upstream rather than an opaque blob nobody can re-derive.
//
// Licence (ADR 0016): Tanzil Quran text is CC BY 3.0 — commercial use permitted, but the text must be
// VERBATIM and the copyright notice must be reproduced. Two consequences enforced below:
//   1. The script never transforms the Arabic — it only re-containers it (txt -> JSON).
//   2. The upstream copyright block is extracted and carried into the JSON, so the notice travels with
//      the data instead of living only in a doc someone can forget.
// Integrity is asserted (114 surahs / 6236 ayat / per-surah counts vs metadata). A silent truncation
// of scripture is the worst failure this module can have, so the script dies rather than emit a
// partial mushaf.

import { writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEXT_URL = 'https://tanzil.net/pub/download/index.php?quranType=uthmani&outType=txt-2&agree=true';
const META_URL = 'https://tanzil.net/res/text/metadata/quran-data.xml';

const EXPECTED_SURAHS = 114;
const EXPECTED_AYAT = 6236;

/** The licence we rely on to ship this text commercially (ADR 0016). Asserted against the upstream
 *  notice below: if Tanzil ever relicenses, this script must fail rather than let the app keep
 *  printing a licence claim that is no longer true. */
const EXPECTED_LICENSE = 'Creative Commons Attribution 3.0';

/** Surahs where ayah 1 carries no separable basmala prefix: Al-Fatiha (it *is* ayah 1) and At-Tawba
 *  (none at all). Mirrors core/quran/index.ts — asserted below so the two cannot drift apart. */
const NO_BASMALA_PREFIX = new Set([1, 9]);
const BASMALA_WORD_COUNT = 4;
/** Diacritics + alef variants stripped, leaving the consonantal skeleton. */
const BASMALA_SKELETON = 'بسم الله الرحمن الرحيم';

const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex');

const skeleton = (s) =>
  s
    .replace(/[ً-ٰٓ-ٕۖ-ۭ]/g, '')
    .replace(/[آأإٱ]/g, 'ا')
    .replace(/\s+/g, ' ')
    .trim();

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'core', 'quran', 'data');

/** @param {string} url */
async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
  return res.text();
}

/**
 * Tanzil's txt-2 format is one `surah|ayah|text` record per line, wrapped in `#`-prefixed comment
 * blocks (header carries the copyright, footer the terms of use).
 * @param {string} raw
 */
function parseText(raw) {
  /** @type {string[][]} */
  const surahs = [];
  /** @type {string[]} */
  const noticeLines = [];
  let ayatSeen = 0;

  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith('#')) {
      noticeLines.push(line.replace(/^#\s?/, '').trimEnd());
      continue;
    }
    const m = /^(\d+)\|(\d+)\|(.*)$/.exec(line);
    if (!m) continue;

    const surahNo = Number(m[1]);
    const ayahNo = Number(m[2]);
    const text = m[3];

    const idx = surahNo - 1;
    surahs[idx] ??= [];
    if (surahs[idx].length !== ayahNo - 1) {
      throw new Error(`Ayah out of order at ${surahNo}:${ayahNo} — upstream format changed?`);
    }
    surahs[idx].push(text);
    ayatSeen++;
  }

  const notice = noticeLines
    .join('\n')
    .replace(/^[\s=]+|[\s=]+$/g, '')
    .replace(/\n{3,}/g, '\n\n');

  return { surahs, ayatSeen, notice };
}

/** @param {string} xml */
function parseMetadata(xml) {
  const out = [];
  const re = /<sura\s+([^/>]+?)\s*\/>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    /** @type {Record<string,string>} */
    const attrs = {};
    for (const a of m[1].matchAll(/(\w+)="([^"]*)"/g)) attrs[a[1]] = a[2];
    out.push({
      number: Number(attrs.index),
      ayahCount: Number(attrs.ayas),
      name: attrs.name, // Arabic
      transliteration: attrs.tname,
      englishName: attrs.ename,
      revelation: attrs.type === 'Meccan' ? 'meccan' : 'medinan',
      revelationOrder: Number(attrs.order),
    });
  }
  return out;
}

function assertIntegrity(surahs, ayatSeen, meta, notice) {
  const problems = [];
  if (surahs.length !== EXPECTED_SURAHS) problems.push(`surah count ${surahs.length} != ${EXPECTED_SURAHS}`);
  if (ayatSeen !== EXPECTED_AYAT) problems.push(`ayah count ${ayatSeen} != ${EXPECTED_AYAT}`);
  if (meta.length !== EXPECTED_SURAHS) problems.push(`metadata surah count ${meta.length} != ${EXPECTED_SURAHS}`);

  for (const s of meta) {
    const actual = surahs[s.number - 1]?.length ?? 0;
    if (actual !== s.ayahCount) {
      problems.push(`surah ${s.number} (${s.transliteration}): ${actual} ayat, metadata says ${s.ayahCount}`);
    }
  }
  for (let i = 0; i < surahs.length; i++) {
    if (surahs[i]?.some((t) => !t || !t.trim())) problems.push(`surah ${i + 1} has an empty ayah`);
  }

  // The licence claim the app displays must match what upstream actually grants.
  if (!notice.includes(EXPECTED_LICENSE)) {
    problems.push(`upstream notice no longer states "${EXPECTED_LICENSE}" — licence may have changed`);
  }

  // --- Preconditions for the runtime basmala split (core/quran/index.ts getSurah) ---
  // These are the invariants the *app* depends on but could not previously detect breaking here.
  // They are asserted at the point the data is produced, because this script exists to be re-run
  // when Tanzil publishes an update — and a spacing/orthography change upstream would otherwise
  // emit a mushaf whose basmala is silently misapportioned.
  for (let i = 0; i < surahs.length; i++) {
    const n = i + 1;
    for (const [j, text] of surahs[i].entries()) {
      if (text !== text.trim() || /\s{2,}/.test(text)) {
        problems.push(`${n}:${j + 1} has leading/trailing/double whitespace — word-count split is unsafe`);
      }
    }
    if (NO_BASMALA_PREFIX.has(n)) continue;

    const words = surahs[i][0].split(' ');
    if (skeleton(words.slice(0, BASMALA_WORD_COUNT).join(' ')) !== BASMALA_SKELETON) {
      problems.push(`surah ${n}: ayah 1 does not begin with a ${BASMALA_WORD_COUNT}-word basmala`);
    }
    if (words.length <= BASMALA_WORD_COUNT) {
      problems.push(`surah ${n}: ayah 1 is only the basmala — the split would leave it empty`);
    }
  }
  // Al-Fatiha's ayah 1 must BE the basmala (else the split rule for surah 1 is wrong).
  if (skeleton(surahs[0][0]) !== BASMALA_SKELETON) {
    problems.push('surah 1: ayah 1 is no longer the basmala');
  }
  // At-Tawba must NOT start with one.
  if (skeleton(surahs[8][0].split(' ').slice(0, BASMALA_WORD_COUNT).join(' ')) === BASMALA_SKELETON) {
    problems.push('surah 9: unexpectedly begins with a basmala');
  }

  if (problems.length) {
    throw new Error(`Quran data integrity check FAILED:\n  - ${problems.join('\n  - ')}`);
  }
}

const [rawText, rawMeta] = await Promise.all([fetchText(TEXT_URL), fetchText(META_URL)]);
const { surahs, ayatSeen, notice } = parseText(rawText);
const meta = parseMetadata(rawMeta);

assertIntegrity(surahs, ayatSeen, meta, notice);

mkdirSync(OUT_DIR, { recursive: true });

// Attribution is written SEPARATELY from the mushaf, and deliberately so: the app must be able to
// display "source: tanzil.net" (a licence condition) without paying to parse 1.3 MB of scripture on
// screens that show no scripture. Keep this file small and eagerly-importable.
//
// upstream.*Sha256 pins exactly what was fetched. Without it, a regeneration that silently altered
// the text would still satisfy every count-based assertion above and pass unnoticed in review — the
// diff of a 1.3 MB minified JSON is unreadable by a human.
writeFileSync(
  join(OUT_DIR, 'attribution.json'),
  JSON.stringify(
    {
      edition: 'Tanzil Uthmani',
      license: 'CC BY 3.0',
      source: 'https://tanzil.net',
      notice,
      upstream: {
        textUrl: TEXT_URL,
        metaUrl: META_URL,
        textSha256: sha256(rawText),
        metaSha256: sha256(rawMeta),
        retrieved: new Date().toISOString().slice(0, 10),
      },
    },
    null,
    2,
  ) + '\n',
  'utf8',
);

writeFileSync(join(OUT_DIR, 'uthmani.json'), JSON.stringify({ surahs }), 'utf8');
writeFileSync(join(OUT_DIR, 'surahs.json'), JSON.stringify(meta, null, 2) + '\n', 'utf8');

console.log(`OK  ${surahs.length} surahs / ${ayatSeen} ayat -> ${OUT_DIR}`);
console.log(`    text sha256 ${sha256(rawText).slice(0, 16)}…  meta sha256 ${sha256(rawMeta).slice(0, 16)}…`);
