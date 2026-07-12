---
name: fiqh-spec-authoring
description: Start a brand-new docs/fiqh/<domain>.md from scratch with the correct template, frontmatter, and section structure. Use for a first draft of a new domain; use the fiqh-spec-writer agent instead for deeper iterative research or revising an existing doc.
---

# Fiqh Spec Authoring

Creates `docs/fiqh/<domain>.md` with the canonical structure from `docs/fiqh/README.md`, so every
domain doc stays consistent without re-deriving the template each time.

## Steps

1. Read `docs/fiqh/README.md` for the current template and frontmatter schema — do not hardcode a
   copy of the template here; always defer to that file so template changes propagate automatically.
2. Create `docs/fiqh/<domain>.md` with frontmatter: `domain: <domain>`, `status: draft`,
   `version: 0.1`, `last_updated: <today>`, `scholar_reviewer: <unassigned>`,
   `madhab_dependent: <true|false, best guess, to be confirmed during research>`.
3. Insert all section headers empty (Scope, Definitions & Terminology, Nisab/Threshold Constants,
   Core Formula(s), Madhab Divergence Points, Named Special Cases, Worked Examples, Public
   Explanation Notes, Sources, Flagged Uncertainties, Changelog).
4. Add one changelog row: version 0.1, "initial draft created", requested by the user.
5. Hand off to the `fiqh-spec-writer` agent to actually research and fill in content — this skill
   only produces the empty, correctly-shaped scaffold.
