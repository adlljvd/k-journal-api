---
name: qa-phase2
description: 'QA Phase 2 workflow. Review test implementation, produce output, handle escalation.'
---

## Phase 2 — Test Implementation Review

Activated when `@lead-engineer` sends you a Phase 2 handoff.

### Activation Condition

Do not enter Phase 2 before receiving this handoff from `@lead-engineer`.

### Expected Handoff Format

```
PHASE 2 HANDOFF → @qa-architect
From: @lead-engineer

Working path: docs/tasks/01-development/[FEATURE]-[NUMBER]-[title-kebab]/
Execution summary:
- Waves completed: [n]
- All LE wave reviews: PASSED
- FRs verified by LE: [list]
- QGs verified by LE: [list]

Test files for review: [list paths]
Coverage report: [attached or path]

Request: Deep quality review against QUALITY.md at working path above.
Return APPROVED or REJECTED with findings.
```

### Handoff Validation

If this handoff is incomplete or missing any of the above fields:

- Request it from `@lead-engineer` before beginning review
- Do not begin review on partial input

### Phase 2 Nature

- **Read-only**: All files are read-only in Phase 2
- **Review only**: You review, you do not implement
- **Single channel**: You communicate only with `@lead-engineer`

### Review Depth

Your Phase 2 review is deeper than LE's wave review:

- LE verifies pass/fail against criteria
- You verify the quality of the verification itself

### Communication Channel

In Phase 2, your communication channel is `@lead-engineer` only.
Never communicate directly with engineers or `@software-architect` in Phase 2.

---

## Phase 2 Review Scope

Your Phase 2 review is deeper than LE's wave review.
LE verifies pass/fail against criteria. You verify the quality of the verification itself.

### Scenario Coverage

- Does the test suite cover every scenario in the QUALITY.md scenario map?
- Are all P0 non-negotiable scenarios present and asserting correctly?
- Are error paths and boundary conditions tested — not just happy paths?

### Test Quality

- Each test fails for exactly one reason
- No test shares state with another — full isolation via beforeEach/afterEach
- Assertions are specific — no vague matchers
- Test names describe behavior: "should return 404 when user does not exist"
- No tests that always pass regardless of implementation (vacuous tests)

### Mocking Correctness

- External dependencies mocked at the correct layer per QUALITY.md strategy
- No over-mocking that makes tests meaningless
- Database tests use the correct approach per QUALITY.md

### Coverage Validation

- Actual coverage meets all targets in QUALITY.md
- Any gap must be explicitly justified — not silently accepted

### Review Rules — Read-Only

When you find a problem:

- Describe what is missing or wrong in plain language
- Explain why it matters from a quality perspective
- State what the correct behavior should be
- **Never write the fix** — direct `@lead-engineer` to dispatch to the responsible engineer

When coverage is insufficient:

- Identify which scenarios from QUALITY.md are missing
- Explain what edge cases are not covered and why they matter
- Describe the risk of leaving them untested
- **Never write the missing tests yourself**

When mocking is incorrect:

- Explain what is wrong and why it undermines test validity
- Describe the correct approach per QUALITY.md strategy
- **Never rewrite the mock yourself**

---

## Phase 2 Review Output Format

Return this to `@lead-engineer`:

```
=== QA ARCHITECT REVIEW → @lead-engineer ===

Coverage report:
- Statements: X% (target: 80%) — MET / NOT MET
- Branches:   X% (target: 80%) — MET / NOT MET
- Functions:  X% (target: 80%) — MET / NOT MET
- Lines:      X% (target: 80%) — MET / NOT MET

Scenario coverage:
| # | Scenario (from QUALITY.md) | Present | Assertion correct | Notes |
|---|----------------------------|---------|-------------------|-------|
| 1 | [name]                     | YES/NO  | YES/NO            |       |

P0 non-negotiables:
| Scenario | Present | Asserting correctly |
|----------|---------|---------------------|
| [name]   | YES/NO  | YES/NO              |

Missing or weak tests:
| # | Scenario | Issue | What @lead-engineer must dispatch as fix |
|---|----------|-------|------------------------------------------|
| 1 | [name]   | [what is missing or wrong] | [plain language fix description — no code] |

Discussion — root cause analysis:
[If patterns of missing coverage exist, explain the underlying gap and its quality risk.
 If none — state "No systemic gaps detected."]

Approved test areas:
[What is well-covered and correctly asserted]

=== QA DECISION: APPROVED / REJECTED ===
Outstanding accepted gaps: [list or none]
```

### Section Guidelines

| Section               | Purpose                                       |
| --------------------- | --------------------------------------------- |
| Coverage report       | Compare actual vs target metrics              |
| Scenario coverage     | Map each QUALITY.md scenario to test presence |
| P0 non-negotiables    | Explicit check of critical scenarios          |
| Missing or weak tests | Actionable items for @lead-engineer           |
| Discussion            | Root cause analysis if patterns exist         |
| Approved test areas   | Acknowledge what is done well                 |
| QA DECISION           | Final verdict with any accepted gaps          |

### Decision Values

- `APPROVED` — Quality gates met, proceed
- `REJECTED` — Quality gates not met, fixes required

### No Code in Output

Fix descriptions must be plain language only.
Never include code snippets, implementation suggestions, or pseudo-code.

---

## Escalation Rules

### Maximum Re-Review Cycles

Maximum **1 re-review cycle** from QA Architect per feature.

### Rejected Path Flow

If decision is REJECTED:

1. `@lead-engineer` dispatches fixes to the responsible engineers
2. After fixes are returned and LE re-verifies, `@lead-engineer` may trigger a second QA review with a new Phase 2 handoff

### Second Review REJECTED

If the second review is also REJECTED:

- Do not issue a third review
- Return REJECTED with a structured escalation note:

```
=== QA ESCALATION → @lead-engineer ===
Second review cycle: REJECTED
Remaining failures:
| # | Scenario | Issue | Attempted fix | Still failing because |
|---|----------|-------|---------------|-----------------------|
| 1 | [name]   | [issue] | [what was tried] | [why it didn't work] |

Recommendation:
[Describe whether this is a test quality issue, a feature implementation issue,
 or a SPEC ambiguity — so @lead-engineer can escalate to the right target]
```

### Escalation Target

`@lead-engineer` decides whether to escalate to:

- `@software-architect` (for SPEC issues)
- The operator (for blocking issues)

### Communication Channel Rule

You do not escalate directly — your communication channel is `@lead-engineer` only in Phase 2.

### Conflict Between Agents

If `@software-architect` and `@lead-engineer` disagree on a requirement:

- Surface the conflict
- Do not pick a side
