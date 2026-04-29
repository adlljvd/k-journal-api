---
name: wave-dispatch
description: 'Wave dispatch to agents. Use when: dispatching tasks to engineers, updating TASKS.md assignments, or preparing dispatch messages.'
---

# Wave Dispatch

Dispatch all tasks in current wave simultaneously to assigned agents.

## Pre-Dispatch Checklist

- [ ] Folder moved to `01-development`
- [ ] Pre-execution baseline recorded
- [ ] Prior waves complete (if not Wave 1)
- [ ] Dependencies verified as resolved

---

## Step 1 — Resolve Agent Assignments

Update TASKS.md task headers with actual agent names:

```markdown
# Before

Assigned: Slot A

# After (for Wave 2)

Assigned: @fullstack-engineer-d
```

Use round-robin table to resolve:

| Wave | Slot A                | Slot B                | Slot C                |
| ---- | --------------------- | --------------------- | --------------------- |
| 1    | @fullstack-engineer-a | @fullstack-engineer-b | @fullstack-engineer-c |
| 2    | @fullstack-engineer-d | @fullstack-engineer-e | @fullstack-engineer-f |
| 3    | @fullstack-engineer-g | @fullstack-engineer-h | @fullstack-engineer-i |

---

## Step 2 — Prepare Dispatch Message

Each engineer receives a dispatch message:

```markdown
DISPATCH → @fullstack-engineer-[x] | Wave [n]
Path: docs/tasks/01-development/[FEATURE]-[NUMBER]-[title]/

Context summary:

- FR-001: User auth (see SPEC:FR-001)
- Pattern: src/modules/auth/auth.service.ts
- Contract: POST /auth/login (see SPEC:API-001)

TASK-FEAT-[n]: [brief description]

- Criteria: [list criteria]
- Deps: [resolved dependencies]
- QG: [gate ref]

TASK-TEST-[n]: [brief description]

- Type: unit/integration/e2e
- Coverage: [target]
- QG: [gate ref]

Read SPEC.md, TASKS.md, QUALITY.md from path.
Return with evidence for each criterion.
```

---

## Step 3 — Dispatch Simultaneously

Dispatch all agents in wave at the same time, not sequentially.

**Example Wave 1 dispatch:**

- Dispatch to @fullstack-engineer-a
- Dispatch to @fullstack-engineer-b
- Dispatch to @fullstack-engineer-c
- All in same message/turn

---

## Step 4 — Track Dispatched Agents

```
WAVE [n] DISPATCHED
Agents: @fullstack-engineer-[x], @fullstack-engineer-[y], @fullstack-engineer-[z]
Tasks: [n] total
Awaiting: [x], [y], [z]
```

---

## Context Summary Format

Instead of re-attaching full SPEC sections, provide context summary with references:

```markdown
Context summary:

- FR-001: User auth (see SPEC:FR-001)
- Pattern: src/modules/auth/auth.service.ts
- Contract: POST /auth/login (see SPEC:API-001)
```

| If Task Relates To | Reference SPEC Section         |
| ------------------ | ------------------------------ |
| API endpoint       | API contract section only      |
| Database query     | Data model section only        |
| Frontend component | Frontend contract section only |
| Multiple concerns  | Reference multiple sections    |

---

## Dispatch Message Rules

| Rule                       | Details                                    |
| -------------------------- | ------------------------------------------ |
| Include context summary    | Reference SPEC sections, don't re-attach   |
| Copy exact description     | From TASKS.md, no paraphrasing             |
| Copy exact criteria        | No modification                            |
| List resolved dependencies | Concrete artifacts from prior tasks        |
| Instruction only           | No guidance, suggestions, or encouragement |
| Professional, direct       | No fluff                                   |

---

## Hard Rules

| Rule                                    | Details                     |
| --------------------------------------- | --------------------------- |
| All wave agents dispatch simultaneously | Same message/turn           |
| TASKS.md updated before dispatch        | Agent names resolved        |
| Dependencies verified resolved          | Concrete artifacts listed   |
| No sequential dispatch                  | All agents start together   |
| Dispatch is instruction                 | Not a brief, no suggestions |
