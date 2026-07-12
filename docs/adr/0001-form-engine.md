# ADR 0001: Form Engine — react-hook-form + Zod, schema-driven

## Status
Accepted

## Context
~15-20 calculators each need a multi-step input form. Hand-building a screen per calculator would
mean re-deriving form/validation architecture every time, and would let each calculator drift in
UX (wizard flow, validation messaging, error states).

## Decision
Every calculator defines one declarative field schema. A single generic `<CalculatorForm/>`
component renders any calculator's form from react-hook-form, with Zod (`@hookform/resolvers/zod`)
providing both runtime validation and compile-time types (`z.infer<>`) shared with the `core/`
domain function's input type. Adding a calculator means adding a schema file, not building a new
screen.

## Consequences
- One component to maintain/improve instead of N screens.
- Form input types and domain function input types are guaranteed to match (both derive from the
  same Zod schema), eliminating a class of UI/domain mismatch bugs.
- A calculator with a genuinely unusual input flow (unlikely, but possible for something like
  Inheritance's heir-list entry) may need a thin wrapper around `<CalculatorForm/>` rather than
  fighting the generic renderer — evaluate case by case, don't fork the whole pattern.
