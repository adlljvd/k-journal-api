---
name: qa-decision-handling
description: 'Handle QA APPROVED or REJECTED decisions. Use when: QA returns decision, handling QA rejection fixes, or completing execution on QA approval.'
---

# QA Decision Handling

Handle QA architect's decision: APPROVED or REJECTED.

## On APPROVED

### Step 1 — Move Folder

```bash
mkdir -p docs/tasks/02-ready-to-test
mv docs/tasks/01-development/[FEATURE]-[NUMBER]-[title-kebab] \
   docs/tasks/02-ready-to-test/[FEATURE]-[NUMBER]-[title-kebab]
```

### Step 2 — Verify Move

```bash
ls docs/tasks/02-ready-to-test/[FEATURE]-[NUMBER]-[title-kebab]/
# Must show: SPEC.md, TASKS.md, QUALITY.md
```

### Step 3 — Produce Completion Report

Use `completion-report` skill to produce final report.

## On REJECTED

### Step 1 — Do NOT Move Folder

Keep folder in `01-development/`.

### Step 2 — Dispatch Fixes

For each finding, dispatch fix to responsible engineer:

```markdown
FIX DISPATCH → @fullstack-engineer-[x]
Task: TASK-[F/T]-[number]
Fix cycle: QA-1
Source: QA Architect review

Failure:
[paste exact finding from QA review]

Required fix:
[fix instruction based on QA finding]

Working path: docs/tasks/01-development/[FEATURE]-[NUMBER]-[title-kebab]/
Return corrected output with evidence.
```

### Step 3 — Re-Verify After Fixes

After engineers return:

1. Run LE wave review logic (wave-review skill)
2. Verify all QA findings addressed

### Step 4 — Trigger Second QA Handoff

If all LE reviews pass after QA fixes:

```markdown
PHASE 2 HANDOFF → @qa-architect
From: @lead-engineer

Working path: docs/tasks/01-development/[FEATURE]-[NUMBER]-[title-kebab]/

This is a re-review after QA-1 fixes:

- Fix cycles: QA-1
- Issues addressed: [list from REJECTION findings]

[rest of handoff format per qa-handoff skill]
```

## QA Re-Review Limits

| Limit              | Details                            |
| ------------------ | ---------------------------------- |
| Max 1 QA re-review | QA-1 fixes only                    |
| Second REJECTION   | Escalate to operator               |
| No QA-2 cycle      | If second review rejects, escalate |

## Second QA Rejection Escalation

```markdown
ESCALATION → operator
Feature: [FEATURE]-[NUMBER]-[title-kebab]
Status: QA REJECTED after 2 review cycles

First QA findings: [list]
QA-1 fixes attempted: [list]
Second QA findings: [list]

Remaining issues:
[specific issues from second QA review]

Recommendation:
A) Architect revision — [what would change]
B) Descope — [what would be removed]
C) Accept risk — [what remains unfixed]

Awaiting decision.
```

## Decision Flowchart

```
QA Decision
    │
    ├── APPROVED
    │       │
    │       ├── Move to 02-ready-to-test
    │       └── Produce completion report
    │
    └── REJECTED
            │
            ├── Dispatch QA-1 fixes
            │       │
            │       ├── Fixes verified → QA re-review
            │       │
            │       └── Second REJECTED → Escalate to operator
            │
            └── Max 1 re-review cycle
```

## Hard Rules

| Rule                              | Details                             |
| --------------------------------- | ----------------------------------- |
| APPROVED = move folder            | Always move to 02-ready-to-test     |
| REJECTED = stay in 01-development | No folder move                      |
| Max 1 QA re-review                | Second rejection = escalate         |
| Never skip QA                     | Must get APPROVED before completion |
| Escalate on second rejection      | Do not attempt QA-2                 |
