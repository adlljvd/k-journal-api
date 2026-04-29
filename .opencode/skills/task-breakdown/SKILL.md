---
name: task-breakdown
description: 'Task breakdown from FR to tasks. Use when: breaking down FRs into feature/test tasks, sizing tasks, or planning wave assignments.'
---

# Task Breakdown

Break down every FR into tasks. No FR left behind.

## Breakdown Rules

### Rule 1 — Every FR Maps to Tasks

| FR produces  | Task Type         |
| ------------ | ----------------- |
| Feature task | Implements the FR |
| Test task    | Verifies the FR   |

**Every FR must have at least one feature task AND at least one test task.**

### Rule 2 — Sizing

| Size | Definition                                                         | Assignment                     |
| ---- | ------------------------------------------------------------------ | ------------------------------ |
| S    | One engineer can complete and verify in a focused session          | Assign as-is                   |
| M    | Requires sustained effort across multiple concerns, stays cohesive | Assign as-is                   |
| L    | Multiple independently verifiable sub-outcomes                     | **FORBIDDEN — split into S/M** |

**Never assign L. An L task = you haven't finished breakdown.**

### Rule 3 — Feature vs Test Tasks

| Attribute | Feature Task          | Test Task                     |
| --------- | --------------------- | ----------------------------- |
| Type      | `feature`             | `test`                        |
| Purpose   | Build the FR          | Verify the FR                 |
| FR refs   | Lists FRs implemented | Lists FRs verified            |
| QG ref    | — (not applicable)    | References QG from QUALITY.md |
| Test type | —                     | unit / integration / e2e      |

### Rule 4 — Wave Assignment

| Wave      | Tasks                                            |
| --------- | ------------------------------------------------ |
| Wave 1    | Tasks with no dependencies                       |
| Wave 2+   | Tasks that depend on Wave N completing first     |
| Same wave | Feature task + its test task dispatched together |

**Never put a task in a later wave than necessary.**

## Dependency Analysis

### Dependency Types

| Type            | Handling                                          |
| --------------- | ------------------------------------------------- |
| Hard dependency | Task B requires Task A output → Wave(A) < Wave(B) |
| No dependency   | Tasks can be in same wave                         |
| Shared resource | Careful assignment to avoid conflicts             |

### Dependency Flow

```
Wave 1: [no-dep-task-1] [no-dep-task-2] [no-dep-task-3]
          ↓
Wave 2: [depends-on-1] [depends-on-2]
          ↓
Wave 3: [depends-on-wave-2]
```

## Task Splitting Rules

When a task is too large:

| If                                     | Then                      |
| -------------------------------------- | ------------------------- |
| Multiple verifiable sub-outcomes       | Split into separate tasks |
| Crosses layer boundary                 | Split by layer            |
| Has "and" in acceptance criteria       | Split on "and"            |
| Multiple FR refs with different scopes | Split by FR               |

## Slot Assignment

Tasks assigned to slots A/B/C for planning:

| Principle            | Rule                                                           |
| -------------------- | -------------------------------------------------------------- |
| Load balance         | Roughly equal tasks per slot                                   |
| No blocking          | Engineer in same wave should not wait for another              |
| Dependency respected | If task B depends on A, A must complete first (different wave) |

## Breakdown Process

1. List all FRs from SPEC.md
2. For each FR, create feature task(s)
3. For each FR, create test task(s)
4. Size each task (S/M only)
5. Identify dependencies between tasks
6. Assign to waves by dependency
7. Assign to slots within waves for load balance
8. Verify: every FR covered, no L tasks, dependencies respected

## Breakdown Summary Output

```
=== TASKS BREAKDOWN SUMMARY ===
Total tasks: [n] ([x] feature, [y] test)
Waves: [n]
FRs covered: [list all FR IDs]
FRs with no task: none | [list — requires clarification]
Assigned: Slot A ([n] tasks), Slot B ([n] tasks), Slot C ([n] tasks)

Wave assignments:
  Wave 1: [n] tasks — [no dependencies]
  Wave 2: [n] tasks — [depends on Wave 1]
  ...
```
