---
name: fix-cycle
description: 'Agent fix cycle behavior for addressing failures. Use when: receiving fix dispatch from lead-engineer, fixing failed criteria, or minimum change implementation.'
---

# Fix Cycle Behavior

When receiving a fix dispatch from @lead-engineer:

## Step 1 — Read Failure Description

Understand exactly:

- Which criterion failed
- What evidence was expected
- What was wrong

## Step 2 — Make Minimum Change

| Rule                | Details                         |
| ------------------- | ------------------------------- |
| Minimum change only | Fix only the specific failure   |
| No refactoring      | Don't touch surrounding code    |
| No adjacent fixes   | Even if you notice other issues |
| No scope expansion  | Only fix what failed            |

## Step 3 — Re-Verify Only Failed Criterion

Do not re-run all tests. Verify only the failed criterion now passes.

## Step 4 — Return with Targeted Evidence

```markdown
=== FIX RETURN → @lead-engineer ===
Task: TASK-[type]-[number]
Fix cycle: [1 / 2] (max is 2)

Failure addressed:
Criterion: "[exact criterion that failed]"
Root cause: [what was wrong]
Change made: [file and line if relevant]

Evidence:
"[criterion text]": NOW MET — [evidence]

Regression check:

- Ran scoped test for modified file: PASSED
- No other tests affected
```

## Fix Cycle Limits

| Limit                     | Details                                      |
| ------------------------- | -------------------------------------------- |
| Max 2 fix cycles per task | After 2 failures, escalate to @lead-engineer |
| Minimum change each cycle | No refactors, no improvements                |
| Verify regression         | Run tests to confirm nothing else broke      |

## Example Fix Cycle

### Input (from @lead-engineer)

```markdown
Fix dispatch for TASK-FEAT-001:

Failure:
Criterion: "Service should throw NotFoundException when not found"
Expected: NotFoundException with code DOMAIN_NOT_FOUND
Got: NotFoundException with code NOT_FOUND

Evidence expected: Error response with correct code
```

### Output (your return)

```markdown
=== FIX RETURN → @lead-engineer ===
Task: TASK-FEAT-001
Fix cycle: 1/2

Failure addressed:
Criterion: "Service should throw NotFoundException when not found"
Root cause: Used generic error code instead of domain-specific code
Change made: Updated error code from NOT_FOUND to DOMAIN_NOT_FOUND in domain.service.ts:45

Evidence:
"Service should throw NotFoundException when not found": NOW MET —
Test passes: should throw NotFoundException with correct code.
See domain.service.spec.ts:78-85. Error code verified: DOMAIN_NOT_FOUND.

Regression check:

- jest src/modules/domain/domain.service.spec.ts: PASSED (8/8)
- No other tests affected
```

## Hard Rules

| Rule                | Details                              |
| ------------------- | ------------------------------------ |
| Minimum change only | Fix the specific failure only        |
| No refactoring      | Don't improve surrounding code       |
| No adjacent fixes   | Ignore other issues you notice       |
| Verify regression   | Run tests to confirm no side effects |
| Max 2 cycles        | After 2 failures, escalate           |
