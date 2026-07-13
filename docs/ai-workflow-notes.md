# AI Workflow Notes

A retro on the *collaboration process* with Claude Code — not code bugs. Updated at each phase
milestone. This feeds future AI-assisted projects, not just this one.

## What worked

- Splitting research into 3 parallel subagents (Zakat rules, Inheritance rules, UX/architecture)
  before any planning decisions were finalized kept the main thread's context clean and produced
  more thorough, source-cited output than researching inline would have.
- Asking clarifying questions in small batches (max 4 per round) at natural decision points —
  scope, fiqh approach, verification process, architecture, then RN framework/languages/
  monetization — rather than one giant upfront questionnaire, kept each round focused and easy to
  answer.
- User pushed back twice on the plan before approving (once to add a daily-engagement layer, once
  to add security/QA/git/documentation practices) — both rounds were folded back into the plan file
  directly rather than argued with, which is the right default when the user is making a scoping
  call.

## What to watch / improve

- The plan grew large across iterations (multiple rounds of additions). Worth checking at each
  major addition whether something could move to an ADR/doc reference instead of inflating the plan
  itself — same principle the project applies to `CLAUDE.md`.
- Domain-isolation discipline (agents reading only their own domain's fiqh doc) is designed in but
  unproven — first real test is once `fiqh-to-code` and `calculator-ui-builder` are actually run
  side by side on Zakat.

## Open questions for next review
- Does the `qa-code-reviewer`/`qa-functional-tester` independence actually hold up in practice, or
  does context leak across agent invocations in ways that need tighter isolation?
- Is 8 agents + 3 skills the right granularity, or will some merge/split once real usage patterns
  emerge?

## Phase 1 retro (2026-07-13): loopholes that cost us — and the rules that fix them

Honest retro after building the Zakat + Inheritance engines/UIs. The *fiqh research, the tested
engines, the ADRs, and the shared UI kit are genuinely good and correct* (every worked-example test
passes) — those are assets, not waste. But the **process had real gaps that burned time and tokens
and left us stuck mid-project.** These become mandatory rules.

### What went wrong
1. **The build/run environment was never validated before building features.** We wrote a full
   shell + two calculators on **Expo SDK 57 / React Native 0.86 (bleeding edge)** and only tried to
   run it on a real phone much later — at which point **Expo Go rejected it** ("requires a newer
   Expo Go", because SDK 57 is newer than the store Expo Go), and separately, our native modules
   (MMKV, WatermelonDB, notifications) mean **Expo Go was never a valid runtime anyway.** A 10-minute
   "walking skeleton" check on day one would have caught all of this before a single feature.
2. **Bleeding-edge SDK for no benefit.** Pinning the newest SDK/RN maximized ecosystem friction
   (Expo Go lag, library edge cases) with no product upside. Prefer a well-supported, mature SDK.
3. **Native-module choices implied dev builds from the start** — but we planned around Expo Go and
   patched it (an in-memory MMKV fallback) instead of standing up a development build early. The
   right call for any app with native modules + Play Store ambitions is: **development build IS the
   test vehicle; Expo Go is not.**
4. **Coding started before the full-app scope/PRD/flows/design were locked.** We had a roadmap + ADRs
   but not a complete product spec, so scope questions surfaced mid-build (Fitrana vs Zakat,
   grandchildren-via-son, …). Design was never addressed at all.
5. **Token/context burn from getting stuck** (RNTL-async discovery, vector-icons-in-jest, the Expo
   Go SDK saga) — much of it a downstream symptom of #1–#4, not independent bad luck.

### Mandatory rules going forward (define-first, then build)
- **R1 — Validate the environment first, with a walking skeleton.** Before ANY feature: a trivial
  `App` on the *actual* target runtime (a real device via the real build path we'll ship with), green
  through `build → install → launch`. No feature code until that round-trips.
- **R2 — Pick the runtime/build strategy explicitly and early**, and pin a **mature, well-supported
  SDK** (not the newest). Decide Expo Go vs development build up front based on the native modules the
  product needs — and if native modules are in scope, **default to development builds**.
- **R3 — Full product definition before code.** A **PRD** (complete feature/calculator inventory,
  priorities, monetization, non-goals), **user flows**, **scope + non-scope per feature**, and a
  **design spec/mockups** are written and user-approved *before* implementation of that surface. The
  per-domain fiqh doc (which worked well) sits under this, not instead of it.
- **R4 — Design is a first-class, up-front phase**, not something retrofitted after functional UI.
  Decide the design tool/source (Figma / Pencil `.pen` / generated mockups) and lock visual language
  (brand, color, type, spacing, component look) before building screens.
- **R5 — Front-load the "boring" account/infra dependencies** (Expo account, Play Console, price-API
  key, scholar availability) so none of them block mid-build.
- **R6 — Keep the parts that worked:** research-first per domain, cited provisional fiqh docs, ADRs
  for decisions, one generic form + shared UI kit, independent QA gate. The engines/specs already
  built are correct and carry forward unchanged.

### Cost lens
Being stuck is the expensive failure mode (repeated debugging loops, dead-end device attempts). The
cheapest insurance is R1 + R3: an hour of environment-validation + scope/design definition prevents
days of mid-project rework. Treat "can we even run/ship this, and do we know exactly what we're
building?" as gate zero.
