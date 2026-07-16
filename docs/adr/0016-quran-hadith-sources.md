# ADR 0016: Quran & Hadith Content Sources

## Status
Accepted (2026-07-15). **Revised 2026-07-16** — the licensing gate this ADR set as a hard precondition
was actually run, and it **failed for translations, audio, and Hadith**. Only the Arabic mushaf clears
it. The open question was framed as *API selection*; the research showed the real constraint is
**monetization**: ads make the app commercial, and Quran content is overwhelmingly NonCommercial or
permission-gated. Sources are now split into **cleared** (build now) and **blocked** (needs written
permission before any code).

## Context
The super-app adds a Quran module (Arabic text, translations, per-ayah audio from multiple reciters,
navigation/sort, bookmarks, tafsir later) and Hadith books — an "Islam360-like" experience. This
collides with offline-first: reading should work without a connection after first load. And scripture
must be **exact** — this is fiqh-grade accuracy, not ordinary content.

The revision's driver: the roadmap locks **ads-only monetization** (Phase 7). Under Creative Commons,
an ad-supported free app is a **commercial** use. That single fact disqualifies most of the ecosystem's
default content sources, which this ADR had named without checking their terms.

## Licensing findings (2026-07-16)

### Cleared for commercial (ad-supported) use
- **Arabic Uthmani text — [Tanzil](https://tanzil.net/docs/text_license), CC BY 3.0.** Commercial use
  permitted. Conditions: **verbatim only** ("changing it is not allowed"), source clearly indicated,
  **a link to tanzil.net**, and the copyright notice reproduced in derived files. Satisfiable.
- **Arabic text — [Al-Quran Cloud](https://alquran.cloud/terms-and-conditions)** (corroborating):
  commercial reproduction, incl. "paid-for apps that bundle the corpus offline", "requires no
  permission from us but a respectful acknowledgement of the source". Confirms the Arabic text carries
  no commercial barrier — it is the *digitization*, not the revelation, that could be encumbered, and
  Tanzil licenses its digitization permissively.

### Blocked for our use
- **Tanzil translations — NonCommercial.** *"The translations provided at this page are for
  non-commercial purposes only. If used otherwise, you need to obtain necessary permission from the
  translator or the publisher."* Each translation retains its translator/publisher copyright.
- **EveryAyah audio — CC BY-NC.** NonCommercial excludes an ad-supported app.
- **Quran Foundation API (quran.com v4)** — [developer terms](https://api-docs.quran.foundation/legal/developer-terms/) —
  fails on two independent counts:
  1. *"Cache or store QF Content longer than 1 week unless expressly permitted."* This **contradicts
     ADR 0015**, which caches translations/audio locally for indefinite offline reading. Not a
     tuning problem; the terms forbid the architecture.
  2. *"Any other form of commercial redistribution or use of QF Content or raw API data requires a
     separate written commercial license agreement with QF."*
- **Sunnah.com (Hadith)** — approval-gated, as already noted; unchanged, still unrequested.

### The recitation trap (non-obvious)
The Quran's text is not copyrightable, but **a recitation is a performance — a separate copyrighted
work owned by the reciter.** So "the API permits it" is never sufficient for audio. Al-Quran Cloud
permits commercial incorporation of recitations yet explicitly disclaims: *"copyrights lie with the
reciters and they may ask you to remove the content."* mp3quran.net states its material is broadly
copyable but does not (and cannot) waive the reciters' rights. **Audio requires per-reciter
permission**, from the rights-holder, in writing.

### Public-domain translations — rejected for now
Pickthall (d. 1936) and Yusuf Ali (d. 1953) are public domain in Pakistan/UK/EU, but the **US** is the
problem: GATT restored a pro-forma US copyright on Yusuf Ali **until 2033**, and Pickthall's US status
is unclear. Play Store distributes globally, so US exposure is real. Rejected as a shortcut; revisit
only with legal advice.

## Decision
- **Quran Arabic text: bundled offline from day one** — **Tanzil Uthmani**, verbatim, shipped with
  attribution + tanzil.net link + copyright notice (a visible Sources/Attribution surface is a
  **build requirement**, not a nicety — it is the licence condition).
- **Translations, audio, tafsir, Hadith: behind a provider seam, no provider wired.** The module is
  built so a cleared source drops in without touching reader code. **No NC or cache-limited source is
  integrated** while the app is ad-supported.
- **Unblocking is a permissions task, not an engineering task.** Required before those features build:
  - translations → written permission from KFGQPC / QuranEnc, or per-translator/publisher licence;
  - audio → written per-reciter permission;
  - Quran Foundation → a written commercial licence *and* an express exemption from the 1-week cache
    limit (both, or the source stays out);
  - Hadith → Sunnah.com approval (start early; gated).
- **Accuracy = fiqh workflow:** treat Quran/Hadith text like `docs/fiqh/*` — verified source,
  scholar-reviewable, **no silent edits or paraphrase**; display source + translation attribution
  wherever the licence requires.
- **If monetization changes** (donations/paid rather than ads), NC sources reopen and this ADR is
  revisited. That is a roadmap decision, not one this ADR makes.

## Consequences
- **Phase 5 ships an Arabic-only reader first.** Fully offline, zero legal risk, and still the largest
  single piece of the module. Translations/audio land later, gated on permissions.
- An **Arabic-only Quran is a weaker product** for non-Arabic speakers — a real competitive gap vs
  Islam360/Muslim Pro. The permission legwork is therefore on the critical path for Phase 5, and slow
  (Sunnah.com-style approval latency). Start it now, in parallel with the reader build.
- ADR 0015's "cache translations/audio locally" is **unaffected in principle but currently
  inapplicable** — there is no cleared source to cache. It applies once one exists.
- The attribution surface (Tanzil notice + link) is a shipping requirement, tracked as part of the
  reader, not a Phase 6 polish item.
- Bundling the mushaf adds app size but removes the single most important network dependency.
- This is a large new module; it does not reuse the calculator (core/features) architecture and gets
  its own module structure.

## References
ADR 0013 (provisional/scholar policy — scripture is held to it) · ADR 0015 (caching/sync) ·
`docs/roadmap.md` (ads-only monetization — the constraint that drove this revision).
