---
name: qa-handoff
description: 'QA Phase 2 handoff to @qa-architect. Use when: all waves complete, all LE reviews passed, or triggering deep quality review.'
---

# QA Handoff

Trigger QA Phase 2 when all tasks in all waves pass LE review.

## Prerequisites

Before triggering QA:

- [ ] All waves completed
- [ ] All LE wave reviews: PASSED
- [ ] No pending fix cycles
- [ ] No unresolved escalations

## Handoff Format

```markdown
PHASE 2 HANDOFF → @qa-architect
From: @lead-engineer

Working path: docs/tasks/01-development/[FEATURE]-[NUMBER]-[title-kebab]/

Execution summary:

- Waves completed: [n]
- All LE wave reviews: PASSED
- FRs verified by LE: [list all FR IDs]
- QGs verified by LE: [list all QG IDs]

Test files for review:

- [path to test file 1]
- [path to test file 2]
- [...]

Coverage report:

- Statements: [X]%
- Branches: [X]%
- Functions: [X]%
- Lines: [X]%

Request: Deep quality review against QUALITY.md at working path above.
Return APPROVED or REJECTED with findings.
```

## What QA Reviews

| Area               | QA Checks                               |
| ------------------ | --------------------------------------- |
| Test coverage      | Against QG targets in QUALITY.md        |
| Test quality       | Assertions, isolation, mocking strategy |
| Edge cases         | Missing test scenarios                  |
| Integration points | API contracts verified                  |
| Error handling     | All error paths tested                  |

## After Handoff

Wait for QA decision. Two possible outcomes:

| Decision | Next Step                                                  |
| -------- | ---------------------------------------------------------- |
| APPROVED | Move folder to 02-ready-to-test, produce completion report |
| REJECTED | Dispatch fixes to responsible engineers                    |

## What QA Returns

### APPROVED Format

```markdown
QA DECISION: APPROVED

Findings:

- All QGs satisfied
- Coverage targets met
- No critical gaps

Recommendations (optional):

- [non-blocking suggestions]
```

### REJECTED Format

```markdown
QA DECISION: REJECTED

Findings:

- QG-[number]: [specific issue]
- [additional findings]

Required fixes:

- TASK-[F/T]-[number]: [specific fix required]
- [additional fixes]
```

## Hard Rules

| Rule                              | Details                                   |
| --------------------------------- | ----------------------------------------- |
| All tasks complete before handoff | No pending work                           |
| All LE reviews passed             | Cannot handoff with failed tasks          |
| Attach test files                 | List paths for QA to review               |
| Attach coverage                   | Include coverage percentages              |
| Wait for QA response              | Do not proceed until APPROVED or REJECTED |
