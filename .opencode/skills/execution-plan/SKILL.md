---
name: execution-plan
description: 'Execution plan presentation and CONFIRM workflow. Use when: starting execution mode, presenting plan to operator, or awaiting CONFIRM before dispatch.'
---

# Execution Plan

Present plan before dispatching. Wait for CONFIRM. Do not dispatch before CONFIRM.

## Activation

Execution mode activates **only** when human types **EXECUTE**.

Do not enter execution mode before EXECUTE is received.

## Plan Format

Present this exact format:

```markdown
=== EXECUTION PLAN ===

Feature folder: docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/
Will move to: docs/tasks/01-development/[FEATURE]-[NUMBER]-[title-kebab]/

Wave 1 — [n] tasks
@fullstack-engineer-a: TASK-F-001, TASK-T-001
@fullstack-engineer-b: TASK-F-002, TASK-T-002
@fullstack-engineer-c: TASK-F-003, TASK-T-003

Wave 2 — [n] tasks (after Wave 1 complete)
@fullstack-engineer-d: TASK-F-004, TASK-T-004
@fullstack-engineer-e: TASK-F-005, TASK-T-005

Wave 3 — [n] tasks (after Wave 2 complete)
@fullstack-engineer-g: TASK-F-006, TASK-T-006

Agent rotation: round-robin from pool a–i, max 3 per wave
Dependencies respected: YES
Parallel tasks confirmed safe: YES
Estimated waves: [n]

Type CONFIRM to move folder to 01-development and begin execution.
```

## Resolve Agent Names

At plan time, resolve actual agent names from round-robin table:

| Wave | Agent Names                                                         |
| ---- | ------------------------------------------------------------------- |
| 1    | @fullstack-engineer-a, @fullstack-engineer-b, @fullstack-engineer-c |
| 2    | @fullstack-engineer-d, @fullstack-engineer-e, @fullstack-engineer-f |
| 3    | @fullstack-engineer-g, @fullstack-engineer-h, @fullstack-engineer-i |
| 4+   | (cycles back to wave 1 agents)                                      |

## Plan Validation

Before presenting, verify:

| Check                  | Verification                               |
| ---------------------- | ------------------------------------------ |
| Dependencies respected | Task with dependency appears in later wave |
| Load balanced          | Tasks distributed across slots             |
| Max 3 agents per wave  | No wave exceeds 3 agents                   |
| No L-sized tasks       | All tasks are S or M                       |
| FR coverage            | Every FR has feature + test task           |

## On CONFIRM

When operator types **CONFIRM**:

### 1. Move Folder

```bash
mkdir -p docs/tasks/01-development
mv docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab] \
   docs/tasks/01-development/[FEATURE]-[NUMBER]-[title-kebab]
```

### 2. Verify Move

```bash
ls docs/tasks/01-development/[FEATURE]-[NUMBER]-[title-kebab]/
# Must show: SPEC.md, TASKS.md, QUALITY.md
```

### 3. Run Pre-Execution Baseline

```bash
# Full test suite
npm test | pnpm test | go test ./... | pytest | cargo test

# Full type-check / build
tsc --noEmit | npm run build | go build ./... | cargo build

# Full lint
pnpm run lint | npx eslint . | golangci-lint run | ruff check . | cargo clippy
```

Record output as **PRE-EXECUTION BASELINE**.

### 4. Begin Dispatching

Start Wave 1 dispatch after baseline recorded.

## On Plan Adjustment

If operator adjusts assignments:

1. Update the plan
2. Re-present plan
3. Wait for CONFIRM again
4. Do NOT move folder or dispatch until CONFIRM received

## Hard Rules

| Rule                           | Details                                 |
| ------------------------------ | --------------------------------------- |
| Never dispatch before CONFIRM  | Always wait for confirmation            |
| Never skip folder move         | Must move 00→01 before dispatch         |
| Always run baseline            | Before any engineer touches code        |
| Always present plan            | Before CONFIRM, operator sees the plan  |
| Adjustments require re-confirm | If plan changes, wait for CONFIRM again |
