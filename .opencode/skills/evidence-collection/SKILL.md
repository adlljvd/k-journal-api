---
name: evidence-collection
description: 'Evidence collection for task completion. Use when: preparing return format, collecting proof of completion, or verifying acceptance criteria.'
---

# Evidence Collection

Every acceptance criterion needs explicit evidence. "It works" is not evidence.

## Evidence Types

| Type                | What Counts                            |
| ------------------- | -------------------------------------- |
| Scoped check output | Lint pass, typecheck pass, test pass   |
| Test result         | `[PASS]` count, coverage %             |
| Line reference      | File:line where criterion is satisfied |
| Generated artifact  | File path to created file              |
| Console output      | Copy-paste from command run            |

## Evidence Format

```markdown
- "[criterion text]": MET — [evidence]
```

**Example:**

```markdown
- "Service should throw NotFoundException when domain not found": MET —
  Unit test `should throw NotFoundException when not found` passes.
  See user.service.spec.ts:45-52
```

## Required Evidence by Criterion Type

| Criterion Type   | Required Evidence                                                     |
| ---------------- | --------------------------------------------------------------------- |
| File created     | File path exists, e.g., `src/modules/user/user.service.ts`            |
| Method exists    | Line reference, e.g., `user.service.ts:25-35`                         |
| Test passes      | Test output: `[PASS] 5/5`                                             |
| Coverage target  | Coverage %: `statements 95%, branches 80%, functions 100%, lines 95%` |
| Lint passes      | `Lint: PASSED`                                                        |
| Typecheck passes | `Typecheck: PASSED`                                                   |
| Error format     | Test assertion for error code/message                                 |
| API matches spec | Request/response from test or manual curl                             |

## Self-Verification Checklist

Before returning, verify every criterion:

```markdown
## Acceptance Criteria

| Criterion                | MET | Evidence                                                |
| ------------------------ | --- | ------------------------------------------------------- |
| Create UserService       | ✅  | File created at src/modules/user/user.service.ts        |
| Implements findById      | ✅  | Lines 25-35 in user.service.ts                          |
| Throws NotFoundException | ✅  | Test passes: user.service.spec.ts:45                    |
| Returns UserEntity       | ✅  | Return type on line 25                                  |
| Unit tests pass          | ✅  | jest output: 5 passed, 5 total                          |
| Coverage >= 80%          | ✅  | statements 95%, branches 85%, functions 100%, lines 95% |
```

## Not Acceptable as Evidence

| Not Evidence       | Why                   |
| ------------------ | --------------------- |
| "It works"         | Vague, not verifiable |
| "I tested it"      | Where's the proof?    |
| "See the code"     | Which line?           |
| "All tests pass"   | Show the output       |
| "Coverage is good" | Show the %            |

## Evidence Collection Process

1. **Run scoped checks** — Capture output
2. **Run tests** — Capture pass/fail count and coverage
3. **For each criterion** — Point to specific line/artifact
4. **Format as table or list** — Clear and verifiable
