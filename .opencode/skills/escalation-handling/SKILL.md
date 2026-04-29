---
name: escalation-handling
description: 'Escalation procedures for failures beyond fix cycles. Use when: task fails after 2 fix cycles, architectural issue detected, or scope/resource failures.'
---

# Escalation Handling

When problems exceed fix cycle limits or are outside your authority, escalate immediately.

## When to Escalate

| Trigger                                         | Escalate To                     |
| ----------------------------------------------- | ------------------------------- |
| Task fails after 2 fix cycles                   | @software-architect or operator |
| Architectural issue (FR cannot be satisfied)    | @software-architect             |
| Scope issue (task requires work outside SPEC)   | Human operator                  |
| Resource issue (blocked by external dependency) | Human operator                  |
| Second QA rejection                             | Human operator                  |

## Escalation Format

### To @software-architect

```markdown
ESCALATION → @software-architect
Task: TASK-[F/T]-[number]
FR affected: [FR number]

Failure:
[exact failure description]

Evidence:
[what was tried across fix cycles]
[outputs from each cycle]

Hypothesis:
[why this may require an architectural decision]

Awaiting: Architectural guidance or SPEC revision
```

### To Human Operator

```markdown
ESCALATION → operator
Task: TASK-[F/T]-[number]
Issue: [exact issue — scope, resource, or repeated failure]

Context:

- Waves completed: [n]
- Fix cycles attempted: [n]
- Prior escalations on this feature: [list]

Options:
A) [option with trade-off]
B) [option with trade-off]
C) [option with trade-off]

Recommendation: [A/B/C and why]

Awaiting decision before proceeding.
```

## Escalation Types

### Architectural Failure

FR cannot be satisfied within current architecture:

| Example                              | Reason                     |
| ------------------------------------ | -------------------------- |
| API contract contradicts itself      | Architect must resolve     |
| Missing integration point definition | Architect must define      |
| Circular dependency between modules  | Architect must restructure |
| FR implies conflicting requirements  | Architect must prioritize  |

### Scope Failure

Task requires work outside current SPEC:

| Example                             | Reason                                         |
| ----------------------------------- | ---------------------------------------------- |
| New endpoint needed but not in SPEC | Operator must approve scope expansion          |
| Additional data model required      | Operator must approve or architect must define |
| External service integration needed | Operator must approve dependency               |

### Resource Failure

Blocked by external dependency:

| Example                         | Reason                        |
| ------------------------------- | ----------------------------- |
| Third-party service unavailable | Operator must resolve or mock |
| Credentials missing             | Operator must provide         |
| Infrastructure not provisioned  | Operator must provision       |

### Repeated Failure

Same issue persists after 2 fix cycles:

| Pattern                          | Meaning                                 |
| -------------------------------- | --------------------------------------- |
| Same error twice                 | Engineer doesn't understand requirement |
| Different errors, same criterion | Criterion may be ambiguous              |
| New errors introduced each cycle | Engineer making wrong fixes             |

## After Escalation

| Scenario                          | Action                            |
| --------------------------------- | --------------------------------- |
| Architect provides guidance       | Continue with adjusted approach   |
| Architect revises SPEC            | Re-read SPEC, continue execution  |
| Operator approves scope expansion | Add tasks as needed               |
| Operator provides resources       | Unblock and continue              |
| Escalation unresolved             | Do not proceed — await resolution |

## Escalation Tracking

Track all escalations in worklog:

```markdown
ESCALATIONS:

1. TASK-F-003 → @software-architect (2024-01-15)
   Reason: FR-003 contradicts FR-005 on response shape
   Resolution: SPEC updated, FR-003 takes precedence

2. TASK-T-002 → operator (2024-01-16)
   Reason: Integration test requires staging DB access
   Resolution: Use Testcontainers instead
```

## Hard Rules

| Rule                      | Details                                             |
| ------------------------- | --------------------------------------------------- |
| Never absorb silently     | Always escalate when beyond authority               |
| Be specific               | Exact failure, exact evidence, exact question       |
| Provide options           | For operator escalations, always give A/B/C options |
| Track all escalations     | In worklog or task comments                         |
| Wait for resolution       | Do not proceed until resolved                       |
| Never attempt fix cycle 3 | Escalate instead                                    |
