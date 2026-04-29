---
name: sa-rules
description: 'SA hard rules, artifact paths, and operator interaction. Use as reference for constraints.'
---

## Non-Negotiable Rules

### Reading Limits

- Read maximum 10 files in Step 0 — if more context is needed, ask the operator
- Never scan directories recursively — targeted reads only

### Language Precision

- Never use vague language — "fast", "scalable", "secure" require measurable thresholds
- Every FR must be independently verifiable and executable by an agent without clarification
- Every assumption must be stated explicitly — there are no implicit assumptions
- Every risk you see must be surfaced — never buried

### ADR Rules

- Write ADR only when ADR criteria are met — never as a default artifact
- ADR always written to `docs/adr/ADR-[number]-[title-kebab].md` — no exceptions

### SPEC Rules

- SPEC always written inside `docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/` — no exceptions
- Feature folder title must exactly match ADR title kebab when an ADR exists

### Path Rules

- Always include resolved paths in the CONTEXT DISCOVERY block and every subagent handoff

### Delegation Rules

- Never produce TASKS.md or QUALITY.md — delegate without exception
- Never delegate before receiving DELEGATE from operator
- Never alter artifact content returned by subagents — flag conflicts only
- Quality gate integration into TASKS goes through @lead-engineer — never patch TASKS directly

### Implementation Boundary

- Never prescribe implementation details beyond architectural necessity

### Conflict Handling

- If a requirement conflicts with existing architecture, surface the conflict — never pick a side silently

### Clarification

- Ask before drafting if domain context is insufficient — a precise question is better than an imprecise spec

---

## Operator Interaction

### When You Need Clarification

If the request is ambiguous, incomplete, or requires context you cannot discover:

Ask **specific questions** before drafting. A precise question is better than an imprecise spec.

### Question Format

```
=== CLARIFICATION NEEDED ===

[Question 1 — specific, not open-ended]

[Question 2 — if multiple, keep to max 3]

Context: [Why this matters for the architecture]
```

### Do Not

- Do not proceed with drafting if critical context is missing
- Do not make assumptions without stating them explicitly
- Do not guess — ask

---

## Artifact Paths

All paths follow this structure:

### ADR Path

```
docs/adr/ADR-[number]-[title-kebab].md
```

### Feature Folder Path

```
docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/
```

### SPEC Path

```
docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/SPEC.md
```

### TASKS Path (produced by @lead-engineer)

```
docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/TASKS.md
```

### QUALITY Path (produced by @qa-architect)

```
docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/QUALITY.md
```

### Path Resolution

Always resolve paths in the CONTEXT DISCOVERY block before drafting:

```
Resolved paths:
  ADR (if needed): docs/adr/ADR-[number]-[title-kebab].md
  Feature folder:  docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/
  SPEC.md:         docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/SPEC.md
```

Include resolved paths in every subagent handoff.
