# IslamFinance Design System

Living catalog of the shared UI kit (ADR 0012). Every calculator composes these primitives so the
~15–20 calculators feel like one system. Built and maintained by the `design-system-builder` agent;
consumed by `calculator-ui-builder`. **Update this doc in the same pass you add or change a
component** — inventory, usage rule, light/dark spec, a11y note.

## Principles

- **Token-driven, never hardcoded.** Colors/spacing/radius come from `components/theme.ts`, mirrored
  into `tailwind.config.js` (ADR 0005). A component never inlines a hex or arbitrary spacing; if a
  token is missing, add it to **both** files together.
- **Light + dark always**, via the media-based `dark:` variant (follows OS appearance =
  `userInterfaceStyle: automatic`, reconciled with the user's setting by `useAppTheme`).
- **Accessibility baked in** (ADR 0012): every interactive element has an `accessibilityRole` +
  label; hit targets ≥ 44pt (`min-h-[44px]`); text respects dynamic font scaling (we never disable
  `allowFontScaling`); state components announce via `alert`/`progressbar` roles.
- **i18n-clean** (ADR 0009): components take already-translated strings / i18n keys from callers.
  No string literals, no concatenation that would block RTL later.
- **Presentational.** Components render props; they don't fetch, read domain state, or import `core/`
  beyond the shared `Money` value type.

## Tokens (source: `components/theme.ts` → `tailwind.config.js`)

| Group | Tokens | Semantic use |
|---|---|---|
| green | 50/100/500/600/700 | primary actions, headline surface, progress fill |
| gold | 100/500/600 | warnings, provisional disclaimer, offline notice, form errors |
| neutral | 0/50/100/300/500/700/900 | backgrounds, surfaces, borders, text, muted text |
| radius | sm 6 · md 12 · lg 20 | `rounded-sm` / `-md` / `-lg` |
| spacing | `n * 4` px | Tailwind spacing scale |

Common semantic pairings used across the kit:

- Screen background: `bg-neutral-50 dark:bg-neutral-900`
- Card / input surface: `bg-neutral-0 dark:bg-neutral-900` + `border-neutral-100 dark:border-neutral-700`
- Primary button: `bg-green-500 dark:bg-green-600`, label `text-neutral-0`
- Primary text: `text-neutral-900 dark:text-neutral-50`; muted: `text-neutral-500 dark:text-neutral-300`
- Warning/attention: `border-gold-500 bg-gold-100 text-gold-600`

## Component inventory

| Component | File | Purpose | Key a11y |
|---|---|---|---|
| `ScreenContainer` | `components/ScreenContainer.tsx` | Screen wrapper + top safe-area + themed bg | — |
| `ScreenHeader` | `components/ScreenHeader.tsx` | Title (+subtitle, +right slot) | title `role=header` |
| `Card` | `components/Card.tsx` | Surface; optional pressable card | pressable → `role=button` + label, 44pt |
| `Money` | `components/Money.tsx` | Locale-aware `Money` display (Intl) | inherits Text scaling |
| `ResultView` | `components/ResultView.tsx` | Result kit: headline + breakdown + citation + disclaimer + save/share actions | headline `role=header`, disclaimer `role=alert`, actions `role=button` |
| `WizardChrome` | `components/WizardChrome.tsx` | Wizard step: progress + title + Back/Next footer | progress `role=progressbar` + label, buttons 44pt |
| `LoadingState` | `components/LoadingState.tsx` | Centered spinner + optional label | single `role=progressbar` node |
| `ErrorState` | `components/ErrorState.tsx` | Recoverable error + optional retry | `role=alert`, retry 44pt |
| `OfflineNotice` | `components/OfflineNotice.tsx` | Cached/offline-fallback banner | `role=alert` |
| `EmptyState` | `components/EmptyState.tsx` | No-content block | — |
| `CalculatorForm` | `components/CalculatorForm.tsx` | Generic schema-driven form (ADR 0001) | per-field labels + errors |

## Usage rules

- **Result screens** always use `ResultView` — never a hand-built result layout. Values are
  pre-formatted by the caller (e.g. via `formatMoney`) so the component stays presentational.
- **Every wizard step** renders inside `WizardChrome`; the calculator owns step state, the chrome owns
  progress + nav consistency.
- **Money** is never shown as a bare number — use the `Money` component or `formatMoney` from
  `core/shared`. Currency comes from the `Money` value type, locale from the active language.
- The provisional **"not yet scholar-verified" disclaimer** (ADR 0013) is passed to `ResultView`'s
  `disclaimer` prop; it renders as a gold `alert` and is removed only when the fiqh doc is approved.

## Light / dark specs

All components ship both themes via `dark:` utilities. Verify visually on the dev gallery
(`/dev/design-system`, `__DEV__`-only, linked from Settings) by toggling Appearance in Settings
(light / dark / system). The gallery renders every component with representative data.

## Testing

- **Component tests** (RNTL, ADR 0011) live in `components/__tests__/`. See `ResultView.test.tsx`.
  **RNTL v14's `render`/`fireEvent` are async — always `await` them** (they await React's `act`).
  `@expo/vector-icons` is mocked for Jest in `__mocks__/@expo/vector-icons.js`.
- **`Money` / `formatMoney`** logic is unit-tested in `core/shared/__tests__/money.test.ts`.

## Deferred

- Design-tool integration (Figma / Pencil `.pen` MCP) is a Phase 4 polish task (ADR 0012).
  Token-driven components keep that a re-skin, not a rewrite.
- A shareable component-catalog Artifact (self-contained HTML) may be published later to feed
  `docs/case-study.md`.
