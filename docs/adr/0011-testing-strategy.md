# ADR 0011: Testing Strategy

## Status
Accepted

## Context
`core/` unit tests (Jest, from fiqh Worked Examples) are in place. But `qa-functional-tester` is
meant to *drive* the wizard→result flow, and today it can only read code — there's no tool to
actually exercise a screen. Component-level rendering/interaction is also untested.

## Decision
Three layers:
- **Unit (Jest / jest-expo)** — `core/<domain>` engines against fiqh Worked Example fixtures. The
  correctness backbone; CI-blocking. Already established.
- **Component (React Native Testing Library)** — shared components and `CalculatorForm` field
  rendering/validation/error states. Fast, runs in Jest.
- **E2E (Maestro)** — full wizard→review→result flows and navigation, as YAML flows under
  `.maestro/`. Chosen over Detox for lighter Expo setup. Runs on a dev-client build, locally/manually
  for now (CI deferred). This is the tool that gives `qa-functional-tester`'s "drive the flow" teeth.

## Consequences
- Adds `@testing-library/react-native` (+ jest-native matchers) and Maestro (external CLI, not an
  npm dep) to the toolchain.
- `qa-functional-tester` references a Maestro flow for the calculator under test rather than
  hand-waving the interaction.
- E2E isn't yet wired into CI (CI itself is deferred) — a known gap to close when CI lands.
