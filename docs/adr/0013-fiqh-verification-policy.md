# ADR 0013: Fiqh Verification Policy — Provisional Build, Scholar-Reviews-Outputs

## Status
Accepted (supersedes the strict pre-code gate in CLAUDE.md's original "Fiqh workflow")

## Context
The original workflow (ADR-adjacent, stated in CLAUDE.md) required a scholar to approve each domain's
`docs/fiqh/<domain>.md` **before** any `core/<domain>` code was written, and `fiqh-to-code` refuses
to run on a non-`approved` doc. In practice this hard-blocks all Phase 1 code on scholar availability,
and the user has decided a *working app* is the more useful thing to put in front of a scholar than a
prose doc — reviewing concrete calculator **outputs** (with worked examples) is easier and more
reliable feedback than reviewing a spec in the abstract.

The user is the project owner and has explicitly chosen this trade-off, accepting that
research-based rules may need revision once a scholar reviews real outputs.

## Decision
- Calculators may be implemented from **well-researched, cited draft** fiqh docs (`status: draft` or
  a new `status: research-provisional`) **without** prior scholar approval.
- The paper trail is still mandatory: every rule/constant/formula in `core/` traces to a cited
  source in its fiqh doc, and Worked Examples still become test fixtures. Nothing is invented
  silently; uncertainties stay flagged in the doc.
- **Scholar review moves to post-build and reviews outputs**, not just the spec: once a calculator
  runs, its results + worked examples + the fiqh doc go to the scholar (via `scholar-review-packet`).
  Corrections flow back as fiqh-doc changes → code changes → new fixtures. A domain reaching genuine
  scholar sign-off advances to `status: approved` and is marked as scholar-verified in-app.
- **In-app honesty:** until a domain is scholar-approved, its results carry a visible
  "for guidance / not yet scholar-verified" disclaimer. Approved domains drop it. This keeps users
  correctly informed and is itself a religiously responsible safeguard.
- `fiqh-to-code`'s hard refusal is relaxed accordingly: it proceeds on a research-provisional doc
  but records the doc's status in the generated module + requires the disclaimer wiring.

## Consequences
- Unblocks Phase 1 without a scholar in the loop; scholar time is spent on higher-signal review
  (real outputs) later.
- Adds a per-domain `scholar_verified` flag + a results disclaimer as a permanent UI concern.
- Risk: shipping provisionally-wrong rules. Mitigated by (a) citations + flagged uncertainties,
  (b) the visible disclaimer, (c) the revisit loop, (d) never marking a domain "approved" until it
  genuinely is. The user has accepted this risk deliberately.
