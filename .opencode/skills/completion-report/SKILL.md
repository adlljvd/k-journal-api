---
name: completion-report
description: 'Final completion report format. Use when: all tasks complete, QA APPROVED, and producing final report to operator.'
---

# Completion Report

Produce final report after QA APPROVED and folder moved.

## Prerequisites

- [ ] QA DECISION: APPROVED
- [ ] Folder moved to `02-ready-to-test`
- [ ] All FRs verified
- [ ] All QGs verified

---

## Report Format

```markdown
EXECUTION COMPLETE
Feature: [FEATURE]-[NUMBER]-[title]
Path: docs/tasks/02-ready-to-test/[FEATURE]-[NUMBER]-[title]/

Summary:
Waves: [n] | Tasks: [n] ([x] feature, [y] test)
Agents: @fullstack-engineer-[list]

FR coverage:

- FR-001: ✓ TASK-F-001
- FR-002: ✓ TASK-F-002
- [list all FRs]

QG coverage:

- QG-001: ✓ TASK-T-001
- QG-002: ✓ TASK-T-002
- [list all QGs]

Integration points:

- [API contract]: ✓
- [Frontend contract]: ✓

QA: APPROVED
Escalations: none | [list with resolutions]
Fix cycles: [n] total | [details]

Artifacts:

- Source: [list files]
- Tests: [list files]
- Coverage: [path]

Folder: docs/tasks/02-ready-to-test/[FEATURE]-[NUMBER]-[title]/
Ready for integration testing.
```

---

## FR Coverage Format

| Status | Meaning                                    |
| ------ | ------------------------------------------ |
| ✓      | FR satisfied with evidence                 |
| ✗      | Should not happen — escalate before report |

**Format:** `- FR-[number]: ✓ TASK-[F/T]-[number]`

---

## QG Coverage Format

| Status | Meaning                                    |
| ------ | ------------------------------------------ |
| ✓      | QG satisfied with test evidence            |
| ✗      | Should not happen — escalate before report |

**Format:** `- QG-[name]: ✓ TASK-T-[number]`

---

## Escalations Section

If escalations occurred:

```markdown
Escalations:

1. TASK-F-003 → @software-architect: [reason] → [resolution]
2. TASK-T-002 → operator: [reason] → [resolution]
```

If none: `Escalations: none`

---

## Fix Cycles Section

Summary:

```markdown
Fix cycles: [n] total
Wave 1: TASK-F-001 (1 cycle), TASK-T-002 (2 cycles)
Wave 2: none
QA: TASK-F-003 (1 cycle)
```

If none: `Fix cycles: none`

---

## What NOT to Include

| Don't Include     | Why               |
| ----------------- | ----------------- |
| Speculation       | Report facts only |
| Opinions          | Objective report  |
| Future work       | Not in scope      |
| Unverified claims | Evidence required |

---

## After Report

Feature complete:

- Folder in `02-ready-to-test`
- All FRs and QGs verified
- QA APPROVED
- Report delivered to operator

---

## Hard Rules

| Rule                    | Details                           |
| ----------------------- | --------------------------------- |
| Only after QA APPROVED  | Never before                      |
| Only after folder moved | Must be in 02-ready-to-test       |
| All FRs listed          | No FR skipped                     |
| All QGs listed          | No QG skipped                     |
| Evidence-based          | No claims without proof           |
| No unverified items     | Everything verified before report |
