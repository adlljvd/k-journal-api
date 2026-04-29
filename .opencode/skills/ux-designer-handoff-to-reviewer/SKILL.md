---
name: ux-designer-handoff-to-reviewer
description: 'Handoff to @ux-reviewer. Use when all waves complete.'
---

## Handoff to UX Reviewer

When all waves are complete and approved by you:

### Wireframe Set Complete Summary

```
=== WIREFRAME SET COMPLETE ===
All [n] waves approved by @ux-designer.

Files created:
  ✓ wireframes/index.html
  ✓ wireframes/_shared.css
  ✓ wireframes/01-[module].html
  ✓ wireframes/02-[module].html
  ...

Total screens: [n]
Cross-file links verified: [n]
UX decisions documented: [n]
```

### Handoff to @ux-reviewer

Present wireframes to `@ux-reviewer` for deep UX review:

```
HANDOFF → @ux-reviewer

UXSPEC: docs/requirements/[FEATURE]-[NUMBER]-[title]/UXSPEC.md
Wireframes: docs/requirements/[FEATURE]-[NUMBER]-[title]/wireframes/
PRD refs: docs/requirements/[FEATURE]-[NUMBER]-[title]/PRD-*.md

Files: [n] HTML files
Screens: [n] across [n] modules
Primary flows mapped: [n]
Cross-file navigation paths: [n]
UX decisions: [n]
Open questions: [n] | none

All waves approved by @ux-designer.
Ready for deep UX review.

Please review across:
1. Hierarchy & Visual Weight
2. Persona Context (busy? rushed?)
3. Ease of Use (click count, efficiency)
4. Consistency (same pattern, same action)
5. Edge Cases (empty, error, loading, boundary)

Return: APPROVED | FIX REQUIRED | ESCALATE TO PA
```

### After UX Reviewer Decision

| Decision           | Your Action                                                        |
| ------------------ | ------------------------------------------------------------------ |
| **APPROVED**       | Proceed to present to @product-analyst                             |
| **FIX REQUIRED**   | Dispatch fixes to @ux-coder, then re-handoff to @ux-reviewer       |
| **ESCALATE TO PA** | Wait for @product-analyst resolution, then update UXSPEC if needed |

### Present to @product-analyst (After UX Reviewer APPROVED)

Only after `@ux-reviewer` returns APPROVED:

```
=== UXSPEC READY FOR REVIEW ===

Feature: [name]
UXSPEC: docs/requirements/[FEATURE]-[NUMBER]-[title]/UXSPEC.md
Wireframes: docs/requirements/[FEATURE]-[NUMBER]-[title]/wireframes/

UX Reviewer: APPROVED
Files: [n] HTML files
Screens: [n] across [n] modules

Key UX decisions:
1. [most significant structural change + reason]
2. [second most significant]

Review in a browser. Start at wireframes/index.html.
```

### Approval Chain

```
@ux-designer → approves all waves
      ↓
@ux-reviewer → deep UX review
      ↓
   [APPROVED] → @product-analyst
   [FIX REQUIRED] → back to @ux-designer → @ux-coder
   [ESCALATE TO PA] → @product-analyst
      ↓
@product-analyst → confirms approval
      ↓
@software-architect → final handoff
```

### Critical Rules

- Do NOT present to @product-analyst until @ux-reviewer confirms APPROVED
- If @ux-reviewer returns FIX REQUIRED, dispatch fixes to @ux-coder
- If @ux-reviewer returns ESCALATE TO PA, wait for resolution
