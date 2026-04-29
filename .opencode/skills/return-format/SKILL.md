---
name: return-format
description: 'Agent return format for task completion. Use when: returning completed tasks to lead-engineer, formatting evidence, or preparing final return block.'
---

# Return Format

Return to @lead-engineer after all tasks complete. Includes self-verification.

## Pre-Return Verification

Run before returning. All checks must pass.

### Final Scoped Check

```bash
# All touched files
pnpm run lint --files [all changed files]
tsc --noEmit
jest [all test files]
```

### Acceptance Criteria

Every criterion must have evidence:

```
- "[criterion text]": ✓ [specific evidence]
```

Evidence must be specific: line refs, test outputs, coverage %. No vague claims.

---

## Success Return Format

```markdown
RETURN → @lead-engineer | Wave [n] | @fullstack-engineer-[x]

✓ Lint | ✓ Typecheck | ✓ Tests [n/n]
Coverage: statements X%, branches X%, functions X%, lines X%

TASK-FEAT-[n]: ✓ COMPLETE
Files: [list files written/modified]

- [criterion]: ✓ [evidence]
- [criterion]: ✓ [evidence]

TASK-TEST-[n]: ✓ COMPLETE
Files: [list test files]

- Tests: [n] passed
- Coverage: [X%]
- QG-[ref]: ✓ SATISFIED

BLOCKERS: none | SCOPE CHANGES: none
```

---

## Blocked Return Format

```markdown
RETURN → @lead-engineer | Wave [n] | @fullstack-engineer-[x]

TASK-[n]: ✗ BLOCKED
Reason: [specific issue]
Required from: [@agent or operator]
```

---

## Fix Cycle Return Format

```markdown
FIX RETURN → @lead-engineer | Task [n] | Cycle [1/2]

Fixed: [criterion]
Change: [file:line]
Evidence: [specific proof]
Regression: ✓ all tests pass
```

---

## Evidence Examples

### Code Creation

```
- "Create UserRepository": ✓ File created at src/modules/user/user.repository.ts
```

### Method Implementation

```
- "Implement findById": ✓ Lines 25-35, returns DomainPrismaPayload | null
```

### Test Passage

```
- "Unit tests pass": ✓ jest: 5 passed, 5 total
```

### Coverage

```
- "Coverage >= 80%": ✓ statements 95%, branches 85%, functions 100%, lines 95%
```

### Error Handling

```
- "Throws NotFoundException": ✓ Test passes at user.service.spec.ts:78-85
```

---

## Not Acceptable Evidence

| Bad Evidence  | Why                   |
| ------------- | --------------------- |
| "It works"    | Vague, not verifiable |
| "I tested it" | Where's the output?   |
| "See code"    | Which line?           |
| "All good"    | Not specific          |

---

## Hard Rules

| Rule                       | Details                          |
| -------------------------- | -------------------------------- |
| All scoped checks clean    | Lint, typecheck, tests pass      |
| All criteria have evidence | Every criterion has ✓ + proof    |
| Evidence is specific       | Line refs, outputs, coverage %   |
| Coverage targets met       | If test task, meet QUALITY.md    |
| No broken state            | No failing tests, no lint errors |
| Max 2 fix cycles           | Then escalate                    |
