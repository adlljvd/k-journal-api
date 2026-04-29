---
name: feature-implementation
description: 'Agent feature task implementation workflow. Use when: implementing feature tasks, writing code, or running scoped checks.'
---

# Feature Task Implementation

For each feature task in dispatch:

## Step 0 — Context Discovery

Read what you need. Stop when you have enough. Max 15 files total.

### Reading Order

1. Task definitions from dispatch (always first)
2. SPEC sections related to task
3. QUALITY.md (test tasks only)
4. Existing patterns (2-4 files max)
5. Dependency outputs (if task depends on another task)

### Pattern Matching Guide

| Task Type           | Find Existing Pattern                          |
| ------------------- | ---------------------------------------------- |
| New API endpoint    | Existing endpoint of similar shape             |
| New React component | Existing component with similar responsibility |
| New custom hook     | Existing hook in features/[name]/hooks/        |
| New Zustand store   | Existing store in stores/                      |
| New form            | Existing form with react-hook-form + zod       |
| New service method  | Existing method with similar concerns          |

### Context Block Format

After reading, produce this block before writing code:

```
=== TASK CONTEXT ===
Tasks: [list TASK IDs]
Working path: [from dispatch]

Patterns found:
- [pattern name]: [file path]
- [pattern name]: [file path]

Dependencies consumed:
- [TASK ID]: [what was produced]

Blockers: none | [describe]
=== READY: YES / NO ===
```

### When READY: NO

Report immediately:

```
BLOCKER: [specific description]
What I tried: [files read]
What I need: [specific resolution]
```

---

## Step 1 — Re-read Acceptance Criteria

Every criterion is a test you must pass before returning.

---

## Step 2 — Locate Correct Files

| Guideline                | Details                                      |
| ------------------------ | -------------------------------------------- |
| Follow project structure | Use module structure from architecture guide |
| Match naming convention  | Use existing patterns                        |
| Match code style         | Import order, error handling, etc.           |

---

## Step 3 — Implement Minimum Code

**Rule:** Implement minimum code that satisfies all acceptance criteria. No more.

---

## Step 4 — Verify Layer Boundaries

If task touches layer boundary (new API endpoint, new DB query, new component prop):

- Verify implementation matches SPEC API contract exactly

---

## Step 5 — Scoped Check (After Every Task)

Run scoped checks on touched files only:

```bash
# Lint — changed files only
pnpm run lint --files src/modules/user/user.service.ts src/modules/user/user.repository.ts

# Type-check — changed files only
tsc --noEmit

# Test — relevant test file only
jest src/modules/user/user.service.spec.ts
```

All three must pass clean before moving to next task.

---

## Implementation Pattern

```
For each task:
  0. Context discovery (max 15 files)
  1. Re-read acceptance criteria
  2. Locate correct file(s)
  3. Implement minimum code
  4. Verify layer boundaries
  5. Run scoped checks
  6. Fix any failures before proceeding
```

---

## Scoped Check Commands

| Stack   | Lint                        | Typecheck      | Test               |
| ------- | --------------------------- | -------------- | ------------------ |
| NestJS  | `eslint {files}`            | `tsc --noEmit` | `jest {test-file}` |
| Next.js | `next lint --file {file}`   | `tsc --noEmit` | `jest {test-file}` |
| Go      | `golangci-lint run {files}` | `go build`     | `go test {pkg}`    |

---

## Hard Rules

| Rule                             | Details                                   |
| -------------------------------- | ----------------------------------------- |
| Max 15 files in Step 0           | Stop when you have enough                 |
| All checks pass before next task | Fix failures immediately                  |
| No broken state forward          | Each task ends clean                      |
| Minimum code only                | Do not write more than criteria require   |
| Match existing patterns          | New patterns without instruction = defect |
| No scope expansion               | Only what's in dispatch                   |
| Report blockers immediately      | Don't interpret through ambiguity         |

---

## What NOT to Do

| Don't                   | Why                         |
| ----------------------- | --------------------------- |
| Run full test suite     | That's @lead-engineer's job |
| Refactor adjacent code  | Not in scope                |
| Add "improvements"      | Not in scope                |
| Create new abstractions | Not unless SPEC requires it |
