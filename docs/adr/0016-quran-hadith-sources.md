# ADR 0016: Quran & Hadith Content Sources

## Status
Accepted, **provisional on API selection** (2026-07-15). Licensing, rate limits, and Sunnah.com access
to be confirmed before Phase 5 build.

## Context
The super-app adds a Quran module (Arabic text, translations, per-ayah audio from multiple reciters,
navigation/sort, bookmarks, tafsir later) and Hadith books — an "Islam360-like" experience. This
collides with offline-first: reading should work without a connection after first load. And scripture
must be **exact** — this is fiqh-grade accuracy, not ordinary content.

## Decision
- **Quran Arabic text: bundled offline** from day one (a fixed Uthmani mushaf dataset, verse-keyed).
  The Quran is readable with zero network; only translations/audio/tafsir are fetched.
- **Translations + metadata:** **Quran.com / Quran Foundation API (v4)** as primary (word-by-word,
  many translations, tafsir, audio metadata); **Al-Quran Cloud (alquran.cloud)** as the simpler
  fallback. Fetched results cached locally per ADR 0015.
- **Quran audio:** per-ayah / per-surah recitations from the Quran.com audio CDN / EveryAyah, multiple
  reciters; **stream with caching**, plus opt-in per-surah **download for offline**.
- **Hadith:** **Sunnah.com API** is the gold standard **but is gated (requires approval)** — request
  access. Ship in the meantime with an **open fallback** (e.g. fawazahmed0 hadith API via CDN, or
  HadithAPI.com). Cache fetched hadith locally.
- **Accuracy = fiqh workflow:** treat Quran/Hadith text like `docs/fiqh/*` — from a verified source,
  scholar-reviewable, **no silent edits or paraphrase**; display the source + translation attribution
  everywhere it's required by the provider's license.
- **Attribution/licensing:** honor each source's terms (attribution, non-commercial clauses, caching
  limits). Confirm commercial-use compatibility (the app will carry ads) before shipping each source.

## Consequences
- The Quran is usable offline immediately (bundled text); translations/audio/Hadith degrade gracefully
  offline (cached-or-unavailable).
- A licensing/rate-limit review is a hard gate before Phase 5 — especially commercial-use + Sunnah.com
  approval.
- Bundling the mushaf adds app size but removes the single most important network dependency.
- This is a large new module; it does not reuse the calculator (core/features) architecture and gets
  its own module structure.
