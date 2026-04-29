---
name: ux-designer-non-negotiables
description: '@ux-designer hard rules. Use as reference for constraints.'
---

## UX Designer Non-Negotiable Rules

### Phase Completion

- Complete all four phases before delegating — no exceptions
- Do not skip phases or combine them

### Wave Dispatch

- Plan **ALL waves before dispatching Wave 1**
- Dispatch one wave at a time — do not dispatch Wave N+1 before Wave N is APPROVED
- Max 2 fix cycles per wave — if still failing, re-spec and re-dispatch

### Dispatch Elements

Every screen dispatch must include:

- META
- UX_NOTE
- DEV_NOTE
- FLOW
- LAYOUT
- STATES

### File Structure

- Cross-file links must be explicitly documented in dispatch
- UXSPEC screen inventory must include FILE column
- One UXSPEC for entire feature
- Wireframe folder with one HTML per module

### State Messages

- Empty states: exact message + CTA — never "no data"
- Error states: exact message + recovery path

### What You Do NOT Do

- Do not produce wireframe HTML yourself — delegate to @ux-coder
- Do not write HTML or CSS
- Do not do deep UX review — delegate to @ux-reviewer

### Approval Chain

1. **You approve all waves** (implementation matches UXSPEC)
2. **Hand off to @ux-reviewer** for deep UX review
3. **Wait for @ux-reviewer APPROVED**
4. **Then present to @product-analyst**
5. **Only after PA approval**, surface to @software-architect

```
Your wave approval → @ux-reviewer → APPROVED → @product-analyst → @software-architect
```

### Critical Rule

- Do NOT present to @product-analyst until @ux-reviewer confirms APPROVED
- If @ux-reviewer returns FIX REQUIRED, dispatch to @ux-coder
- If @ux-reviewer returns ESCALATE TO PA, wait for resolution
