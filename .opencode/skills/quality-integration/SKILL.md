---
name: quality-integration
description: 'Integrate QUALITY.md into TASKS.md. Use when: QUALITY.md arrives from @qa-architect, updating tasks with quality gates, or ensuring QG coverage.'
---

# Quality Integration

Integrate QUALITY.md into existing TASKS.md without breaking existing tasks.

## Trigger

Activated when QUALITY.md arrives from @qa-architect.

## QUALITY.md Structure

```markdown
## Quality Gates

### QG-[number]-[name]

Scope: [FR refs]
Test type: unit | integration | e2e
Coverage target: [percentage]
Description: [what the gate verifies]
Acceptance criteria:

- [verifiable condition 1]
- [verifiable condition 2]

## Mocking Strategy

[How to mock dependencies for tests]
```

## Integration Rules

| Rule                          | Action                          |
| ----------------------------- | ------------------------------- |
| Gate requires NEW task        | Add task                        |
| Gate modifies EXISTING task   | Annotate with `QG: [gate name]` |
| Gate covered by existing task | Annotate existing task          |
| Never remove existing tasks   | —                               |
| Never change task scope       | Beyond what gate requires       |

## Gate-to-Task Mapping

| Gate Scope                       | Task Action                                |
| -------------------------------- | ------------------------------------------ |
| Maps to existing FR              | Annotate existing test task with QG ref    |
| Requires additional verification | Add new test task                          |
| Requires new test type           | Add new test task with different test type |
| Cross-cutting concern            | Add integration/e2e task                   |

## Annotation Process

### For Existing Test Tasks

Add QG reference to task header:

```markdown
--- TASK-T-001 ---
Title: Verify UserRepository CRUD operations
Type: test
Wave: 1
Assigned: Slot A
Size: S
FR refs: FR-001
QG ref: QG-001-repository-crud ← Add this line
Test type: unit
```

### For New Test Tasks

Create task following standard format, referencing QG:

```markdown
--- TASK-T-005 ---
Title: Verify UserRepository transaction participation
Type: test
Wave: 2
Assigned: Slot A
Size: S
FR refs: FR-001
QG ref: QG-002-transaction-participation
Test type: integration

Description:
Write integration test verifying Repository participates in UnitOfWork
transactions correctly via AsyncLocalStorage.

Acceptance criteria:

- Repository uses transaction client when in UoW context
- getClient() returns transaction client inside uow.execute()
- Test uses Testcontainers with real database

Dependencies: TASK-F-001
```

## Coverage Verification

After integration, verify every QG has task coverage:

| QG Status | Meaning                                                  |
| --------- | -------------------------------------------------------- |
| Covered   | At least one task references this QG                     |
| Uncovered | No task references this QG — flag to @software-architect |

## Integration Summary Output

```markdown
=== TASKS.md REVISION SUMMARY ===
Tasks added: [n] — [reason per task]
Tasks annotated: [n] — [reason per task]

QGs covered: [list all QG IDs]
QGs with no task coverage: none | [list — flag to @software-architect]
```

## Revision Checklist

After integrating QUALITY.md:

- [ ] Every QG has at least one task reference
- [ ] No existing tasks removed
- [ ] No existing task scope changed beyond gate requirement
- [ ] New tasks follow TASKS.md format exactly
- [ ] Wave assignments updated if new dependencies introduced
- [ ] Dependencies correctly listed for new tasks

## Hard Rules

| Rule                        | Details                                       |
| --------------------------- | --------------------------------------------- |
| Never remove existing tasks | QUALITY.md integration is additive only       |
| Never change task scope     | Beyond what the gate requires                 |
| Flag uncovered QGs          | To @software-architect, not ignored           |
| Annotate, don't duplicate   | If task already covers QG, just add reference |
