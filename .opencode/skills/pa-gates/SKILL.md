---
name: pa-gates
description: 'PA quality gates. Use when: checking UX readiness, submitting to Senior PA, handing off to UX Designer, or handling escalations.'
---

## UX Readiness Check

Run per module (Scale M/L and any PRD with UI).

### Checklist

```
=== UX READINESS CHECK — [Module] ===

[ ] Every screen listed in Screen Inventory
[ ] Every screen has: data displayed, actions, all states, navigation outcomes
[ ] Every form screen: field list + validation rules + exact error messages
[ ] No abstract language in any screen definition
[ ] Every role appears in at least one screen definition
[ ] Every data model field: appears in a screen or marked backend-only
[ ] Every deferred screen: tagged DEFER, not referenced as required by MVP screens
[ ] Section 11 (open items): EMPTY

=== MODULE UX-READY: YES / NO ===
```

### Checklist Items Explained

| Check                   | What It Means                                                     |
| ----------------------- | ----------------------------------------------------------------- |
| Every screen listed     | Screen inventory is complete                                      |
| Screen has all elements | Data, actions, states (loading/empty/populated/error), navigation |
| Form fields complete    | Fields, validation, exact error strings                           |
| No abstract language    | No "fast", "easy", "user-friendly" — all measurable               |
| Role coverage           | Each role has at least one screen they access                     |
| Data field coverage     | All data model fields appear somewhere or marked backend-only     |
| Deferred screens clean  | Deferred screens don't create dead references                     |
| Open items empty        | Section 11 must be empty — no unresolved questions                |

### If NOT UX-Ready

List what's missing:

```
BLOCKERS:
- [Screen ID]: missing [element]
- [Data field]: not in any screen
- [Abstract language]: "easy to use" in [section]
- Open items: [n] unresolved
```

Fix all blockers before submitting to Senior PA review.

---

## Senior PA Review Gate

**MANDATORY gate** — not optional, not skippable.

### When to Submit

Submit after:

- [ ] All PRD modules are drafted
- [ ] Section 11 (open items) is empty in all modules
- [ ] Screen skeleton validation with stakeholders is complete
- [ ] MVP-SCOPE.md is strategic-lead-aligned (Scale M/L)

**Do NOT submit if open items remain** — Senior PA will reject immediately.

### Submission Format

```
REVIEW REQUEST → @senior-product-analyst
From: @product-analyst

Project: [FEATURE]-[NUMBER]-[title-kebab]
Scale: [S / M / L]

PRD modules submitted:
- [module name]: docs/requirements/[path]/PRD-[module].md (v[n])
- [...]

Supporting documents:
- MVP-SCOPE.md: [path] (Scale M/L only)
- Flow Document: [path] (if exists)

Context for review:
[2-3 sentences on what the system does and who uses it — help Senior PA
read with the right mental model without re-reading all discovery docs]

Stakeholder validation completed: YES
Research integrated: YES / NO (Scale S may be NO)

Waiting for: APPROVED or REJECTED with findings.
```

### After Senior PA Responds

**If APPROVED:**
Proceed directly to `@ux-designer` handoff.

**If REJECTED:**

Read every BLOCK finding carefully. For each one:

1. Update the relevant PRD section
2. Answer the question Senior PA asked — explicitly, with section reference
3. Increment the PRD version number

Do not resubmit until every BLOCK finding has an answer.

### Resubmission Format

```
REVIEW REQUEST → @senior-product-analyst
From: @product-analyst

Resubmission: cycle [n]

Project: [FEATURE]-[NUMBER]-[title-kebab]

Changes made since last review:
- PRD-[module].md v[old] → v[new]: [what changed]
- PRD-[module].md v[old] → v[new]: [what changed]

Previous BLOCK findings addressed:
| Finding | Resolution | PRD Section |

Waiting for: APPROVED or REJECTED with findings.
```

### Escalation Rule

If the same finding persists after Senior PA flags it 3 times: escalate to strategic lead (or CO in direct mode).

### Non-Negotiable

Never trigger `@ux-designer` before receiving `SENIOR PA JUDGMENT: APPROVED`.

---

## UX Designer Handoff

Trigger `@ux-designer` only after:

1. All MVP modules pass UX Readiness Check
2. `@senior-product-analyst` has issued `SENIOR PA JUDGMENT: APPROVED`

This is your trigger — not CO's, not strategic lead's. But it cannot happen before both conditions are met.

### Handoff Format

```
HANDOFF → @ux-designer
From: @product-analyst
Project: [FEATURE]-[NUMBER]-[title-kebab]

PRD collection (MVP scope):
- [Module]: docs/requirements/[path]/PRD-[module].md (v[n]) ✓ UX-ready
- [Module]: docs/requirements/[path]/PRD-[module].md (v[n]) ✓ UX-ready
[...]

[If Scale M/L:]
MVP Scope: docs/requirements/[path]/MVP-SCOPE.md
Flow Document: docs/[path]/FLOW-DOCUMENT.md

Key UI constraints from PRDs:
1. [constraint that affects design — e.g., "Admin cannot see user's private notes"]
2. [constraint from permissions — e.g., "Manager can edit team goals, not individual quotas"]
3. [constraint from data — e.g., "Score breakdown must be visible on detail screen"]

Start with highest-traffic daily workflow:
From sessions: [primary user]'s main daily task is [task]. Start with that screen.

Stakeholders who will review wireframe:
- [Name / role]: will validate [which screens]

Expected output:
- UXSPEC.md: docs/requirements/[path]/UXSPEC.md
- wireframes/: docs/requirements/[path]/wireframes/

Produce draft, then I will coordinate stakeholder review.
```

### After Handoff

Your role in the wireframe process:

1. **Wait for UXSPEC draft** from @ux-designer
2. **Coordinate stakeholder review** of wireframes
3. **Collect feedback** from stakeholders
4. **Return for revisions** if needed
5. **Approve** when stakeholders sign off
6. **Notify strategic lead** (if Mode A) that UXSPEC is approved

### Post-Approval Chain

After UXSPEC approved:

1. Notify strategic lead (if Mode A)
2. Hand off to `@software-architect` via the execution pipeline

---

## PA Escalation Handling

You can receive ESCALATE from:

- `@ux-designer` — structural UX issues
- `@ux-reviewer` — wireframe contradicts PRD

### Escalation Types

| Source       | Escalation Type           | Your Action             |
| ------------ | ------------------------- | ----------------------- |
| @ux-designer | UXSPEC contradicts PRD    | Review and clarify      |
| @ux-designer | Missing requirement       | Add to PRD or defer     |
| @ux-reviewer | Wireframe contradicts PRD | Validate and decide     |
| @ux-reviewer | Scope issue               | Check MVP impact        |
| @ux-reviewer | Feature gap               | Evaluate and prioritize |

### Response Format for Escalations

```
=== ESCALATION RECEIVED ===
From: [@ux-designer / @ux-reviewer]
Type: [structural issue / scope change / PRD contradiction]

Issue: [what they flagged]
PRD Reference: [section that applies]

Decision:
[CLARIFICATION / PRD UPDATE / MVP CHANGE / DEFER]

Resolution:
[Specific answer or updated requirement]

Action for [escalator]:
[What they should do with this resolution]
===========================
```

### When Escalation Requires MVP Change

If escalation affects MVP scope:

```
MVP IMPACT FLAG

Escalation: [what was raised]
MVP Impact: [module/feature affected]
Options:
  A. Update MVP — [implication]
  B. Defer to next cycle — [implication]
  C. Block wireframe — [implication]

Decision: [A/B/C]
Rationale: [why]
```

### When Escalation Requires New Requirement

```
NEW REQUIREMENT FROM ESCALATION

Source: [escalator]
Trigger: [what surfaced]
Requirement: [new requirement]
PRD Section: [where to add]
MVP Impact: [YES/NO]
Priority: [blocker / next cycle / backlog]
```

### After Resolution

- Update PRD if needed
- Increment version
- Return resolution to escalator
- They can then continue their work
