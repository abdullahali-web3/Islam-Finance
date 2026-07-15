# ADR 0015: Per-User Data & Offline-First Sync Model

## Status
Accepted (2026-07-15). Builds on ADR 0014 (Supabase) and refines ADR 0002 (storage).

## Context
Login is optional (ADR 0014), so the app must be fully usable offline with no account, yet sync
seamlessly once a user signs in — including **merging** the data they created while anonymous. We need
to define what lives where and how conflicts resolve.

## Decision
- **Local-always (encrypted MMKV — ADR 0002/0004):** madhab/language/currency/theme settings,
  last-used calculator inputs, Quran last-read position, and content caches (translations, audio,
  Hadith fetched on demand). The app is fully functional offline with just these.
- **Synced when logged in (Supabase Postgres, RLS per ADR 0014):** user profile, a settings mirror,
  saved calculations / history, home favorites, Quran bookmarks + reading progress, Hadith bookmarks.
  Every row carries `user_id` and `updated_at`.
- **Anonymous → login merge:** on first sign-in, local records are pushed up; thereafter Supabase is
  source of truth with a local cache. **Conflict resolution: last-write-wins per record** by
  `updated_at` (adequate for one user across devices; not collaborative multi-user).
- **Repository seam preserved:** history already sits behind a repository interface (ADR 0007). The
  Supabase sync adapter implements that same interface; feature code is untouched. **WatermelonDB is
  deferred** — for V1 sync, Postgres + an MMKV cache behind the repository is enough; adopt
  WatermelonDB only if rich offline relational queries are later needed (revisits ADR 0002).
- **Writes are local-first:** UI writes to local storage immediately (optimistic), then the sync
  adapter reconciles with Supabase in the background when online + logged in.

## Consequences
- Predictable and simple; not real-time collaborative (acceptable for a single-user personal app).
- The merge-on-login logic is the main new complexity and needs its own tests.
- Losing/replacing a device with only-local (never-logged-in) data means that data isn't recoverable —
  surfaced to users as a reason to sign in.
