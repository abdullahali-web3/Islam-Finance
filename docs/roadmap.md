# IslamFinance — Product Roadmap

> Living document. Records **scope, sequence, and open decisions** beyond the calculator phases.
> Decisions here are traceable to ADRs in `docs/adr/`. Keep short; push detail into ADRs.

## Where we are (2026-07-15)
Phases 0–3 complete: an offline-first **Islamic calculators** app — 9 Phase-1 cards + 4 Phase-3
calculators (13 total), each with a cited fiqh doc, pure engine, tests, en/ur i18n, and independent
QA. All provisional per ADR 0013. HEAD on `main`.

## The pivot (2026-07-15)
The app is being expanded from a calculators app into a **full Islamic super-app** (Islam360 / Muslim
Pro class): Quran (text + per-ayah audio, multiple reciters), Hadith books, learning material,
accounts + cloud sync, better design, and ads. This is a ~5× scope increase and **reverses two V1
stances** — consciously, not by drift:
- **"No backend" → Supabase** (auth + per-user sync). ADR 0007's trigger (user accounts) has fired →
  see **ADR 0014**.
- **"Offline-first" → hybrid.** Calculators + the Arabic Quran text stay usable offline; translations,
  audio, Hadith, and sync need connectivity. See **ADR 0015**, **ADR 0016**.

The one rule that does NOT bend: **no secrets in client code** (ADR 0004). Supabase's anon key is
public by design; Row-Level Security is the guard; no service keys ever ship.

## Locked decisions
- **Accounts are OPTIONAL.** Core calculators + Quran/Hadith reading work with no login; signing in
  (Google or email/password) adds cloud sync, saved progress, and cross-device favorites. (ADR 0014/0015)
- **Define before build.** This roadmap + ADRs are written *before* the feature code — per the
  hard-won "validate scope + environment first" lesson.
- **Ads: decided later** (Phase 7). Analysis + constraints captured below so nothing is lost.
- **Scripture accuracy = fiqh-grade.** Quran/Hadith text is treated like the fiqh docs: verified
  source, scholar-reviewable, no silent edits (ADR 0016).

## Phases

### Phase 4 — Prove the environment + backend foundation
1. **Get the app running on a real device** (Metro/USB `adb reverse`). *Still not done, and now the #1
   blocker:* every new capability (Google auth, Supabase, audio playback, ads SDK) is native and
   cannot be built or tested without a working dev build.
2. **Supabase + auth** — project setup, email/password + Google OAuth, RLS-guarded schema. (ADR 0014)
3. **Per-user state & sync** — settings/history/favorites sync when logged in; anonymous-local → merge
   on first login. (ADR 0015)
4. **Auto gold/silver pricing** — activate the price Edge Function (holds the provider key
   server-side) and **remove manual price entry from Zakat**; fetch-on-demand + MMKV cache for
   offline. (ADR 0008)

### Phase 5 — Content (the super-app core)
4. **Quran module** — Arabic mushaf (bundled, offline), translations, per-ayah + per-surah **audio**
   from multiple reciters, navigation/sort, bookmarks, reading progress, tafsir (later). (ADR 0016)
5. **Hadith module** — major books via API, browse/search, bookmarks. (ADR 0016)
6. **Learning material** — the Learn tab (currently empty — 0 articles exist) filled with
   scholar-signed content for the calculators + general topics.

### Phase 6 — Polish
7. **Design & branding pass** — the real visual design (deferred until the first device build) and the
   app's actual name (currently a placeholder).

### Phase 7 — Ship
8. **Ads integration** — see below.
9. **Scholar review** of all provisional outputs → drop disclaimers (ADR 0013).
10. **Play Store** — listing, assets, privacy policy, signing, production build, submission.

## Monetization (Phase 7 — decision deferred)
Recorded now so the analysis isn't lost; the network choice is made near launch.
- **Model:** free app, ad-supported (ads-only per current product direction). Revenue ≈
  `users × ads-seen × CPM ÷ 1000`; paid per impression (CPM) and click.
- **Pakistan reality:** CPMs for Pakistani traffic are low (~$0.20–$1.00 vs $3–$10+ Western), so ad
  income is a **volume game** — meaningful revenue needs tens of thousands of daily users.
- **Halal filtering:** likely **AdMob + aggressive category/advertiser blocking** (block dating,
  alcohol, gambling, sensitive) + monitoring; halal-only networks exist but have low fill/revenue.
  No interstitials inside Quran/prayer flows (adab).
- **Getting paid from Pakistan (verify current; not tax advice):** AdMob supports Pakistan; $100
  payout threshold; monthly **bank wire/EFT** to a PK bank (USD→PKR). Google Play charges a one-time
  **$25** developer fee (needs an internationally-valid card). Income is IT/services export — confirm
  tax treatment (PSEB/FBR) with a local accountant.
- **Open question:** whether to add an optional one-time "supporter"/premium unlock later if ad
  revenue is too thin — currently out of scope (ads-only).

## Open decisions / risks
- Device build must connect (Phase 4.1) before anything else is buildable/testable.
- Quran/Hadith **API selection, licensing, and rate limits** to confirm (ADR 0016). Sunnah.com API is
  gated (needs approval).
- Sync **conflict model** (last-write-wins per record) — confirm acceptable (ADR 0015).
- **Gold/silver price cold-start offline** (no cache yet + offline): bundled seed price vs. a
  "connect once" blocked state — no manual entry either way (ADR 0008).
- Ad network + halal-filtering approach (Phase 7).
- App name + design language (Phase 6).

## References
ADR 0004 (secrets) · ADR 0007 (backend trigger — now fired) · ADR 0008 (auto gold/silver pricing) ·
ADR 0013 (fiqh provisional policy) · ADR 0014 (Supabase + auth) · ADR 0015 (sync model) ·
ADR 0016 (Quran/Hadith sources).
