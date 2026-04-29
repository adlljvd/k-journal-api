---
name: wave-review
description: 'Wave review against SPEC FRs and QUALITY gates. Use when: reviewing agent outputs, running post-wave suite checks, or producing review reports.'
---

# Wave Review

Review all agent outputs against SPEC and QUALITY after wave completes.

## Step 1 — Post-Wave Suite Check

Run full suite before review:

```bash
# Full test suite
npm test | pnpm test | go test ./... | pytest | cargo test

# Full type-check / build
tsc --noEmit | npm run build | go build ./... | cargo build

# Full lint
pnpm run lint | npx eslint . | golangci-lint run | ruff check . | cargo clippy
```

Record as **WAVE [n] SUITE CHECK**.

## Step 2 — Compare Against Baseline

| Result                              | Meaning                           | Action                        |
| ----------------------------------- | --------------------------------- | ----------------------------- |
| New failures                        | Engineer introduced regression    | Flag in review, assign fix    |
| Pre-existing failures still present | Expected                          | Not engineer's responsibility |
| New passes vs baseline              | Engineer fixed out-of-scope issue | Flag for awareness            |

## Step 3 — Verify Each Task

### Feature Task Verification

| Check               | Against                   |
| ------------------- | ------------------------- |
| Acceptance criteria | FR in SPEC.md             |
| Code exists         | File path in output       |
| Evidence provided   | Demonstrable, not claimed |

### Test Task Verification

| Check       | Against                           |
| ----------- | --------------------------------- |
| Test output | Pass/fail count                   |
| Coverage    | QG definition in QUALITY.md       |
| Test type   | unit/integration/e2e per TASKS.md |

### Integration Task Verification

| Check             | Against                        |
| ----------------- | ------------------------------ |
| API contract      | SPEC API contract section      |
| Frontend contract | SPEC frontend contract section |

## Step 4 — Produce Review Report

```markdown
=== WAVE [n] REVIEW REPORT ===

Agent assignment (round-robin):
@fullstack-engineer-[x]: TASK-F-001, TASK-T-001
@fullstack-engineer-[y]: TASK-F-002, TASK-T-002
@fullstack-engineer-[z]: TASK-F-003, TASK-T-003

Suite check:
Test suite: PASSED [n/n] | REGRESSIONS: [list new failures vs baseline]
Build / type-check: PASSED | FAILED [new errors]
Lint: PASSED | FAILED [new errors]

TASK-F-001 (@fullstack-engineer-[x]): PASS | FAIL
FR-001: met | not met — [evidence or specific failure]
FR-002: met | not met — [evidence or specific failure]

TASK-T-001 (@fullstack-engineer-[x]): PASS | FAIL
QG [gate name]: met | not met — [evidence or specific failure]
Test type coverage: adequate | inadequate — [reason if inadequate]
Coverage: statements X%, branches X%, functions X%, lines X%

[repeat for all tasks in wave]

--- Wave [n] summary ---
Suite regressions: none | [list — assign to responsible engineer for fix]
Passed: [n] tasks
Failed: [n] tasks
Required fixes: [list TASK IDs with assigned agent]
Escalations: none | [reason and target — @software-architect or operator]
```

## Pass/Fail Criteria

| Task Status       | Conditions                               |
| ----------------- | ---------------------------------------- |
| PASS              | ALL acceptance criteria demonstrably met |
| FAIL              | ANY acceptance criterion not met         |
| No partial credit | Cannot partially pass                    |

## Evidence Requirements

| Good Evidence                                             | Bad Evidence           |
| --------------------------------------------------------- | ---------------------- |
| "Test output: 5 passed, 5 total"                          | "Tests pass"           |
| "File created at path/X.ts, lines 25-35 implement method" | "File created"         |
| "Coverage: 95% statements, 90% branches"                  | "Coverage good"        |
| "Returns { id, name } per FR-001 spec"                    | "Returns correct data" |

## Suite Regression Handling

Suite regressions are additional task failures:

1. Identify which agent's changes caused regression
2. Add as failed task in review
3. Dispatch fix to responsible agent

## Hard Rules

| Rule                                   | Details                            |
| -------------------------------------- | ---------------------------------- |
| Run full suite after every wave        | Not just affected tests            |
| Compare against pre-execution baseline | New failures = regression          |
| Every criterion needs evidence         | Not claims, not assertions         |
| No partial credit                      | All criteria met = PASS, else FAIL |
| Suite regressions are task failures    | Dispatch fix to responsible agent  |
