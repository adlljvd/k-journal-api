---
name: fix-dispatch
description: 'Fix dispatch to responsible engineer. Use when: task fails review, suite regression detected, or QA rejection requires fixes.'
---

# Fix Dispatch

Dispatch precise fix instructions to responsible engineer. Max 2 cycles per task.

## Fix Cycle Limits

| Cycle    | Action                                         |
| -------- | ---------------------------------------------- |
| Cycle 1  | Dispatch fix instruction                       |
| Cycle 2  | Dispatch second fix instruction if first fails |
| Cycle 3+ | **FORBIDDEN** — escalate instead               |

## Fix Dispatch Format

```markdown
FIX DISPATCH → @fullstack-engineer-[x]
Task: TASK-[F/T]-[number]
Fix cycle: 1 | 2 | QA-1 | QA-2

Failure:
Criterion: "[exact criterion that failed]"
Evidence: [what was returned vs what was required]

Required fix:
[Specific, unambiguous instruction — not a suggestion]

Working path: docs/tasks/01-development/[FEATURE]-[NUMBER]-[title-kebab]/
Return corrected output with evidence that the criterion is now met.
```

## Fix Instruction Rules

| Rule           | Details                                   |
| -------------- | ----------------------------------------- |
| Specific       | Exact change required, not vague guidance |
| Unambiguous    | Engineer executes literally               |
| Single focus   | One issue per fix dispatch                |
| No suggestions | Instruction, not guidance                 |

## Fix Instruction Examples

| Bad                | Good                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| "Fix the test"     | "Update assertion on line 45 to expect `{ code: 'USER_NOT_FOUND' }` instead of `{ code: 'NOT_FOUND' }`" |
| "Make it work"     | "Add null check before accessing `user.profile.email` in UserService.findById()"                        |
| "Improve coverage" | "Add test case for `findByEmail` when email is null"                                                    |

## Fix Cycle Tracking

Track fix cycles per task:

```
TASK-F-001 fix history:
  Cycle 1: dispatched to @fullstack-engineer-a — [result]
  Cycle 2: dispatched to @fullstack-engineer-a — [result]
  Cycle 3: ESCALATED — [reason]
```

## After Fix Returns

1. Re-verify ONLY the failed criterion
2. Run affected tests (not full suite)
3. Update task status in review

```markdown
TASK-F-001 (@fullstack-engineer-a): PASS (after fix cycle 1)
FR-001: NOW MET — [evidence]
```

## Third Failure Handling

If same issue persists after 2 fix cycles:

```markdown
ESCALATION → [target]
Task: TASK-[F/T]-[number]
Cycles attempted: 2
Failure: [exact failure]
Evidence: [what was tried across both cycles]
```

Do NOT dispatch a third fix cycle.

## QA Fix Cycles

Fixes from QA rejection use `QA-1`, `QA-2` numbering:

```markdown
FIX DISPATCH → @fullstack-engineer-[x]
Task: TASK-[F/T]-[number]
Fix cycle: QA-1

Failure:
[paste exact finding from QA review]

Required fix:
[fix instruction based on QA finding]
```

Max 1 QA re-review cycle (QA-1 only). If QA rejects again, escalate to operator.

## Hard Rules

| Rule                            | Details                                 |
| ------------------------------- | --------------------------------------- |
| Max 2 fix cycles per task       | Third failure = escalate                |
| Fix is instruction              | Not suggestion, not guidance            |
| Re-verify only failed criterion | Don't re-verify entire task             |
| Track all cycles                | Know where you are                      |
| Never fix yourself              | Always dispatch to engineer             |
| QA gets 1 re-review             | Second rejection = escalate to operator |
