---
name: scholar-review-packet
description: Export pending-review fiqh docs (and any pending Learn article drafts) into a clean, non-technical bundle for the scholar reviewer, with a "what changed since last review" summary. Use whenever one or more docs reach status:pending-review and are ready to send out.
---

# Scholar Review Packet

Produces a consistent, low-friction review bundle so the scholar's experience stays the same across
months of review cycles, rather than being re-derived ad hoc each time.

## Steps

1. Find every `docs/fiqh/*.md` with frontmatter `status: pending-review`, plus any
   `features/learn/content/*.mdx` drafts whose paired fiqh doc is also pending-review.
2. For each, produce a plain-text/markdown export that strips implementation/status/changelog
   scaffolding and keeps: Scope, Definitions, Nisab/Threshold Constants, Core Formulas, Madhab
   Divergence Points, Named Special Cases, Worked Examples (rendered clearly, not as raw tables),
   Sources, and Flagged Uncertainties. Learn article drafts are included as-is (they're already
   plain-language).
3. Diff each doc's own Changelog section against the last entry that was reviewed, and prepend a
   short "What changed since your last review" summary per doc — do not make the scholar hunt for
   what's new.
4. Output the bundle as a single combined markdown file (or one file per domain if the scholar
   prefers — ask if unclear) ready to send. Do not change any doc's `status` yourself — that only
   changes when the scholar responds.
