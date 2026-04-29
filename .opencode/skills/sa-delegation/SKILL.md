---
name: sa-delegation
description: 'SA delegation workflow. Use when ready to delegate to subagents.'
---

## Delegation Gate

After SPEC.md (and ADR.md if applicable) are complete, **do not delegate automatically**.

### Handoff Summary

Present a handoff summary to the operator:

```
=== READY TO DELEGATE ===

Artifacts completed:
- SPEC.md ✓ → docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/SPEC.md
- ADR.md ✓ → docs/adr/ADR-[number]-[title-kebab].md / not required

Subagent working path: docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/

What happens next:
- @lead-engineer will produce TASKS.md at the working path above
- @qa-architect will produce QUALITY.md at the working path above
- @lead-engineer will revise TASKS.md with quality gate tasks integrated
- Final consistency check by SA
- On operator EXECUTE + CONFIRM: @lead-engineer moves folder → 01-development
- On QA APPROVED: @lead-engineer moves folder → 02-ready-to-test

Type DELEGATE to proceed.
```

### Wait for DELEGATE

Wait for the operator to type **DELEGATE** before invoking any subagent.

### Operator Changes

If the operator makes changes or asks questions instead of DELEGATE:

1. Address the changes or questions
2. Re-present the handoff summary
3. Wait for DELEGATE again

Do not proceed until DELEGATE is received.

---

## Delegation Protocol

Execute in strict sequence after receiving DELEGATE.

### Phase 1 — Parallel Handoff

Invoke **@lead-engineer** with this exact handoff:

```
HANDOFF → @lead-engineer
Input: [attach SPEC.md]
Working path: docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/
Write TASKS.md to: docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/TASKS.md
Produce: TASKS.md
Instructions:
- Break down every FR in the SPEC into implementable tasks
- Each task must have: title, description, acceptance criteria, dependencies
- No task may require interpretation — be explicit
- Do not invent scope not present in the SPEC
Expected output: TASKS.md written to the working path above, ready for engineering execution
```

Invoke **@qa-architect** with this exact handoff:

```
HANDOFF → @qa-architect
Input: [attach SPEC.md]
Working path: docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/
Write QUALITY.md to: docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/QUALITY.md
Produce: QUALITY.md
Instructions:
- Cover every FR listed in the quality gates skeleton
- Define test scenarios for all performance-sensitive and security-sensitive operations
- Specify coverage expectations and test types (unit, integration, e2e) per FR
- Do not invent scope not present in the SPEC
Expected output: QUALITY.md written to the working path above, ready for QA execution
```

### Phase 2 — Quality Gate Integration

Once QUALITY.md is returned, invoke **@lead-engineer** again:

```
HANDOFF → @lead-engineer
Input: [attach TASKS.md current] + [attach QUALITY.md]
Working path: docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/
Write revised TASKS.md to: docs/tasks/00-backlog/[FEATURE]-[NUMBER]-[title-kebab]/TASKS.md
Produce: TASKS.md (revised)
Instructions:
- Review TASKS.md against all quality gates defined in QUALITY.md
- Add or adjust tasks required to satisfy quality gates
- Annotate each added/adjusted task with: "QG: [gate name from QUALITY.md]"
- Do not remove existing tasks
- Do not change scope — only add what quality gates require
Expected output: TASKS.md revised with quality gate tasks integrated, written to the working path above
```

### Phase 3 — Consistency Check

After Phase 2, review all artifacts for cross-artifact consistency.

---

## Final Consistency Check (Phase 3)

Review all artifacts (SPEC, ADR if present, TASKS revised, QUALITY) for cross-artifact consistency only.

### What to Check

1. **SPEC ↔ TASKS consistency**: Every FR in SPEC has corresponding tasks in TASKS
2. **SPEC ↔ QUALITY consistency**: Every quality gate in SPEC skeleton is addressed in QUALITY
3. **ADR ↔ SPEC consistency**: Non-negotiables in ADR are reflected in SPEC constraints
4. **TASKS ↔ QUALITY consistency**: Tasks cover all test scenarios defined in QUALITY

### Conflict Handling

If a conflict is found:

1. **Surface it explicitly** — do not hide or work around it
2. **Request revision** from the responsible agent
3. **State clearly**:
   - Which artifact contains the conflict
   - What the conflict is
   - Which agent must resolve it

### What NOT to Do

- Do not rewrite any artifact yourself
- Do not alter task breakdown or test scenarios
- Do not pick a side silently

### Conflict Report Format

```
=== CONSISTENCY CONFLICT ===
Artifact: [path to artifact with conflict]
Conflict: [description of the conflict]
Resolution: [which agent must resolve and what they must do]
===========================
```

### Role Boundary

Your role ends at consistency check. You do not implement or execute — you ensure the artifacts are internally consistent before downstream execution begins.
