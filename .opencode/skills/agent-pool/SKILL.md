---
name: agent-pool
description: 'Agent pool management and round-robin rotation. Use when: assigning agents to waves, resolving slot placeholders, or dispatching tasks.'
---

# Agent Pool & Round-Robin Rotation

## Pool Definition

3 engineers in shared pool:

```
@fullstack-engineer-a  (handles slots: A, G, H, I)
@fullstack-engineer-b  (handles slots: B, E, F)
@fullstack-engineer-c  (handles slots: C, D)
```

## Round-Robin Table

Max 3 agents per wave. Same 3 agents for all waves.

| Wave   | Agents                                                              |
| ------ | ------------------------------------------------------------------- |
| Wave 1 | @fullstack-engineer-a, @fullstack-engineer-b, @fullstack-engineer-c |
| Wave 2 | @fullstack-engineer-a, @fullstack-engineer-b, @fullstack-engineer-c |
| Wave 3 | @fullstack-engineer-a, @fullstack-engineer-b, @fullstack-engineer-c |
| ...    | (same for all waves)                                                |

## Slot Resolution

TASKS.md uses placeholder slots (A/B/C) for planning.
Actual assignment resolved at dispatch time.

**Resolution pattern:**

```
Slot A → @fullstack-engineer-a
Slot B → @fullstack-engineer-b
Slot C → @fullstack-engineer-c
```

## Fewer Than 3 Agents

If wave requires fewer than 3 agents, take only first [n].

**Example:** Wave needs 2 agents → assign `-a` and `-b` only.

| Needed   | Agents           |
| -------- | ---------------- |
| 1 agent  | `-a`             |
| 2 agents | `-a`, `-b`       |
| 3 agents | `-a`, `-b`, `-c` |

## Dispatch Rules

| Rule                  | Details                           |
| --------------------- | --------------------------------- |
| No ping               | Don't check if agent is available |
| No availability check | Assume all are available          |
| No timeout mechanism  | No waiting for responses          |
| Max 3 per wave        | Never assign more than 3          |

## Assignment Process

1. **In TASKS.md:** Use slot placeholders `Slot A`, `Slot B`, `Slot C`
2. **At execution plan:** Resolve agent names from table above
3. **Before dispatch:** Update TASKS.md task headers with actual agent names

**Example transformation:**

```
# Before (in TASKS.md)
Assigned: Slot A

# After (at dispatch)
Assigned: @fullstack-engineer-a
```

## Agent Assignment Summary

| Wave | Slot A | Slot B | Slot C |
| ---- | ------ | ------ | ------ |
| All  | `-a`   | `-b`   | `-c`   |
