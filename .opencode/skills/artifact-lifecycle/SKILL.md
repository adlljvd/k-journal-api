---
name: artifact-lifecycle
description: 'Artifact folder lifecycle management. Use when: moving feature folders between stages, understanding folder structure, or executing folder transitions.'
---

# Artifact Folder Lifecycle

## Folder Structure

```
docs/tasks/
  00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/
  01-development/[FEATURE]-[NUMBER]-[title-kebab]/
  02-ready-to-test/[FEATURE]-[NUMBER]-[title-kebab]/
```

## Folder Contents

Each folder ALWAYS contains:

```
SPEC.md     ← Written by @software-architect, READ-ONLY for you
TASKS.md    ← You write and revise this file
QUALITY.md  ← Written by @qa-architect, READ-ONLY for you
```

## Stage Definitions

| Stage | Folder              | Meaning                                |
| ----- | ------------------- | -------------------------------------- |
| 0     | `00-backlog/`       | SA wrote SPEC, you write TASKS.md here |
| 1     | `01-development/`   | Active execution — move on CONFIRM     |
| 2     | `02-ready-to-test/` | Done — move on QA APPROVED             |

## Transition Rules

### Stage 0 → Stage 1 (on CONFIRM)

When operator confirms execution plan:

```bash
mkdir -p docs/tasks/01-development
mv docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab] \
   docs/tasks/01-development/[FEATURE]-[NUMBER]-[title-kebab]
```

All subsequent dispatch messages reference the `01-development` path.
Engineers read SPEC.md, TASKS.md, and QUALITY.md from `01-development`.

### Stage 1 → Stage 2 (on QA APPROVED)

When @qa-architect returns `QA DECISION: APPROVED`:

```bash
mkdir -p docs/tasks/02-ready-to-test
mv docs/tasks/01-development/[FEATURE]-[NUMBER]-[title-kebab] \
   docs/tasks/02-ready-to-test/[FEATURE]-[NUMBER]-[title-kebab]
```

Confirm the move to operator in completion report.

## Lifecycle Rules

| Rule                     | Details                |
| ------------------------ | ---------------------- |
| Always move in order     | 00 → 01 → 02           |
| Never skip a stage       | Must pass through each |
| Never move backward      | Forward only           |
| Create target if missing | `mkdir -p` before move |
| Never delete             | Always move            |

## Path Usage by Phase

| Phase                        | Read Path           | Write Path             |
| ---------------------------- | ------------------- | ---------------------- |
| Mode A (Artifact production) | `00-backlog/`       | `00-backlog/`          |
| Mode B (Execution)           | `01-development/`   | `01-development/`      |
| Completion                   | `02-ready-to-test/` | N/A (read-only for QA) |

## Verifying Moves

After each move, verify success:

```bash
# After CONFIRM move
ls docs/tasks/01-development/[FEATURE]-[NUMBER]-[title-kebab]/
# Should show: SPEC.md, TASKS.md, QUALITY.md

# After QA APPROVED move
ls docs/tasks/02-ready-to-test/[FEATURE]-[NUMBER]-[title-kebab]/
# Should show: SPEC.md, TASKS.md, QUALITY.md
```
