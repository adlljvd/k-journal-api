---
name: ux-reviewer-workflow
description: @ux-reviewer workflow and position in agent chain. Use when understanding when UX Reviewer is triggered and what inputs they receive. Reviews after ux-designer approves all waves.
---

## UX Reviewer Workflow

### Position in Agent Chain

```
@ux-designer → produces UXSPEC.md
      ↓
@ux-coder → builds wireframes (wave by wave)
      ↓
@ux-designer → reviews waves for implementation accuracy, approves all
      ↓
@ux-reviewer → YOU ARE HERE → Deep UX review
      ↓
   [APPROVED] → @ux-designer → @product-analyst
   [FIX REQUIRED] → @ux-designer → @ux-coder → Re-handoff
   [ESCALATE TO PA] → @product-analyst
```

### When You Are Triggered

You are triggered when:

1. All wireframe waves are complete
2. `@ux-designer` has approved all waves (implementation check)
3. `@ux-designer` hands off to you for deep UX review

### Your Inputs

| Input           | Source           | Purpose                                         |
| --------------- | ---------------- | ----------------------------------------------- |
| `UXSPEC.md`     | @ux-designer     | Design decisions, flow maps, screen definitions |
| `PRD-*.md`      | @product-analyst | Requirements, user roles, acceptance criteria   |
| Wireframe files | @ux-coder        | HTML wireframes to review                       |

### Your Output

Structured review document with:

- Screen-by-screen findings
- Focus area assessments
- Clear recommendations (FIX or ESCALATE)

### After Your Review

| Decision       | Next Step                                                                         |
| -------------- | --------------------------------------------------------------------------------- |
| APPROVED       | Return to `@ux-designer` → They present to `@product-analyst`                     |
| FIX REQUIRED   | Return to `@ux-designer` → They dispatch fixes to `@ux-coder` → Re-handoff to you |
| ESCALATE TO PA | Escalate structural issues to `@product-analyst` (cc `@ux-designer`)              |

### Review Scope Difference

| @ux-designer's Review          | Your Review                      |
| ------------------------------ | -------------------------------- |
| Implementation matches UXSPEC? | Hierarchy & Visual Weight clear? |
| All states implemented?        | Persona context appropriate?     |
| Exact text used?               | Ease of use optimized?           |
| Navigation correct?            | Consistent across screens?       |
| Cross-file links work?         | Edge cases handled gracefully?   |

Their review is **implementation check**.
Your review is **deep UX quality check**.
