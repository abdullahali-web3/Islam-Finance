# ADR 0012: Design System & UI/UX Case Study

## Status
Accepted

## Context
The user wants the design system and components **documented as a reusable UI/UX case study**, and
may connect a design tool (Figma, or the Pencil `.pen` MCP already available here) later when the
design is polished. The product also spans ~15-20 calculators that must feel like one system.

## Decision
- A **`design-system-builder` agent** builds reusable, token-driven NativeWind components
  (Card, ScreenHeader, Money display, ResultView = breakdown+citation+save+share, wizard step chrome,
  and first-class error/empty/loading/offline states) against `components/theme.ts`. UI counterpart
  to `calculator-ui-builder`.
- `components/theme.ts` stays the **single token source**, mirrored into `tailwind.config.js`
  (ADR 0005). Components never hardcode colors/spacing — so a future design source can re-skin
  without structural change.
- **`docs/design-system.md`** is a living catalog: tokens, component inventory, usage rules,
  light/dark specs, accessibility notes — updated as components land. It feeds `docs/case-study.md`.
- Optional: publish a self-contained **component-catalog Artifact** as the shareable case-study
  surface.
- **Design-tool integration (Figma/Pencil) is deferred to the Phase 4 polish pass.** Token-driven
  components keep that a re-skin, not a rewrite.
- **Accessibility** (dynamic font scaling, screen-reader labels, hit targets) is baked into these
  shared components, not bolted on later.

## Consequences
- Upfront investment in a component layer before calculators, paying off across every calculator and
  as portfolio/case-study material.
- Documentation is an ongoing task tied to component work, not a one-time write.
