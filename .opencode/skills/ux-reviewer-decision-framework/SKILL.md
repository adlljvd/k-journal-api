---
name: ux-reviewer-decision-framework
description: 'Decision framework. FIX wireframe vs ESCALATE to PA.'
---

## Decision Framework: FIX vs ESCALATE

### Decision Matrix

| Issue Type              | FIX IN WIREFRAME                | ESCALATE TO PA                    |
| ----------------------- | ------------------------------- | --------------------------------- |
| Visual hierarchy        | ✅ Wrong emphasis, buried CTA   | ❌ Not applicable                 |
| Implementation mismatch | ✅ Doesn't match UXSPEC         | ❌ Not applicable                 |
| Missing state           | ✅ Empty/error state missing    | ❌ Not applicable                 |
| Inconsistency           | ✅ Pattern drift across screens | ❌ Not applicable                 |
| Edge case handling      | ✅ Missing boundary condition   | ❌ Not applicable                 |
| Screen structure        | ❌ Not applicable               | ✅ Fundamental flow change needed |
| User role mismatch      | ❌ Not applicable               | ✅ Wrong persona for feature      |
| Task scope              | ❌ Not applicable               | ✅ Missing critical task          |
| Feature gap             | ❌ Not applicable               | ✅ PRD requirement not addressed  |
| Flow contradiction      | ❌ Not applicable               | ✅ Wireframe contradicts PRD      |

### FIX IN WIREFRAME

Issues that `@ux-coder` can fix without changing specifications:

**Visual/Implementation Issues:**

- Primary action not visually dominant
- Missing empty state
- Missing error state
- Missing loading state
- Inconsistent patterns across screens
- Wrong text (typo, paraphrase instead of exact)
- Boundary conditions not handled
- Layout doesn't match UXSPEC

**How to Document:**

```
FIX REQUIRED: [Screen ID]
Issue: [specific issue]
Fix: [exact fix needed]
Assign to: @ux-coder via @ux-designer
```

### ESCALATE TO PRODUCT-ANALYST

Issues that require product decision, not implementation fix:

**Structural Issues:**

- Screen should exist that doesn't
- Screen shouldn't exist that does
- User flow fundamentally wrong
- Missing critical user role
- PRD requirement not implemented
- Wireframe contradicts PRD requirements
- Information architecture is wrong
- Feature scope is wrong

**How to Document:**

```
ESCALATE: [Issue ID]
Issue: [structural issue]
Why escalate: [why PA needs to decide]
Question for PA: [specific question]
Impact if unresolved: [user/business impact]
```

### Escalation Questions Template

```
ESCALATION QUESTION FOR @product-analyst:

Screen: [S-XX]
Current implementation: [what wireframe shows]
Issue: [what's wrong]
Options:
  A. [option 1] — [implication]
  B. [option 2] — [implication]

Please confirm which approach is correct.
```

### Decision Flowchart

```
Issue Found
    ↓
Is it a visual/implementation issue?
    ↓ YES                ↓ NO
Can @ux-coder fix it?    Does it change scope/flow?
    ↓ YES                ↓ YES
    FIX                  ESCALATE TO PA
    ↓                    ↓
Document fix             Document question
Return to @ux-designer   Wait for PA decision
```

### Examples

**FIX Example:**

```
Screen: S-03
Issue: Empty state missing CTA
Fix: Add "Create your first lead" button to empty state
Action: FIX IN WIREFRAME
```

**ESCALATE Example:**

```
Screen: S-05
Issue: Screen shows bulk delete, but PRD doesn't mention bulk operations
Question: Should bulk delete be included? It affects security requirements.
Action: ESCALATE TO PA
```
