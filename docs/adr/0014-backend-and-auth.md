# ADR 0014: Backend & Authentication (Supabase)

## Status
Accepted (2026-07-15). Activates the trigger deferred in **ADR 0007** — the app now needs user
**accounts** and cross-device **sync**, so a backend enters. Reverses the "no backend in V1" stance of
ADR 0002/0007 as a conscious product pivot (see `docs/roadmap.md`).

## Context
The app is expanding into a super-app with accounts, per-user cloud sync, Quran/Hadith progress, and
learning material. It needs auth (Google + email/password) and a per-user datastore. Constraint that
does **not** move: **no secrets in client code** (ADR 0004).

## Decision
- **Supabase** as the backend: **Auth** (email/password + Google OAuth), **Postgres** (per-user data),
  **Storage** (user/content assets if needed), **Edge Functions** (any privileged/server-only logic).
- **Auth flows:** email/password with email verification; **Google** via OAuth using the RN deep-link
  redirect (expo-auth-session / supabase-js). Session persisted locally (encrypted MMKV, ADR 0004).
- **Login is OPTIONAL** (product decision). The app runs anonymously on local storage for calculators
  and Quran/Hadith reading; signing in enables sync (merge-on-login — see ADR 0015). We use
  **local-until-login**, not server-side anonymous sessions, to keep the offline path zero-dependency.
- **Security model:**
  - Only the **anon (publishable) key** + project URL ship in the client — public by design.
  - **Row-Level Security (RLS) on every user table**, policy `auth.uid() = user_id`. RLS is the
    security backbone, not client checks.
  - **`service_role` key never ships** anywhere in the app. Privileged operations go through Edge
    Functions. Upholds ADR 0004.
  - Supabase URL + anon key provided via app config (`app.json` extra / EAS env), not hardcoded in
    source; they are non-secret but kept out of scattered code.

## Consequences
- Account features require connectivity; **core calculators + bundled Quran text stay fully offline**
  (ADR 0015).
- RLS + Edge Functions become the security surface we now own (auth was previously a non-concern).
- A new online dependency (Supabase availability) for sync/content-progress features only.
- Supersedes ADR 0007's "defer backend" and revisits ADR 0002's WatermelonDB-as-sync-seam assumption
  (ADR 0015 keeps the repository seam but defers WatermelonDB).
