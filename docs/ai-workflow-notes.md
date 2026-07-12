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
