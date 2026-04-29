---
name: tasks-md-format
description: 'TASKS.md file format specification. Use when: writing or updating TASKS.md, formatting task entries, or structuring the task file.'
---

# TASKS.md Format Specification

## File Location

```
docs/tasks/[stage]/[FEATURE]-[NUMBER]-[title-kebab]/TASKS.md
```

Where `[stage]` is `00-backlog`, `01-development`, or `02-ready-to-test`.

## Task Entry Format

Each task follows this exact structure:

```markdown
--- TASK-[F/T]-[number] ---
Title: [verb + noun — what is built or verified]
Type: feature | test
Wave: [number]
Assigned: Slot A | Slot B | Slot C
Size: S | M
FR refs: [FR-001, FR-002, ...]
QG ref: [gate name from QUALITY.md — test tasks only]
Test type: unit | integration | e2e | — (feature tasks use —)

Description:
[What must be built or verified. No ambiguity. The engineer executes this literally.]

Acceptance criteria:

- [Verifiable condition 1]
- [Verifiable condition 2]
- [...]

Dependencies: [TASK-F-001, TASK-T-003, ...] | none
```

## Field Rules

### Task ID

| Rule        | Details                                |
| ----------- | -------------------------------------- |
| Format      | `TASK-[F/T]-[number]`                  |
| F = Feature | Implementation task                    |
| T = Test    | Verification task                      |
| Number      | Sequential, zero-padded: 001, 002, ... |

### Title

| Good                                          | Bad                |
| --------------------------------------------- | ------------------ |
| "Create UserRepository with CRUD methods"     | "User stuff"       |
| "Verify UserService throws NotFoundException" | "Test the service" |
| "Build login form component"                  | "Handle auth"      |

### Type

| Value     | Use When                     |
| --------- | ---------------------------- |
| `feature` | Building implementation code |
| `test`    | Writing test code            |

### Wave

| Value | Meaning                               |
| ----- | ------------------------------------- |
| 1     | No dependencies on other tasks        |
| 2+    | Depends on task(s) from prior wave(s) |

### Assigned

| Value    | Meaning                         |
| -------- | ------------------------------- |
| `Slot A` | First agent in wave's rotation  |
| `Slot B` | Second agent in wave's rotation |
| `Slot C` | Third agent in wave's rotation  |

**Note:** Slot labels are placeholders. Resolved to actual agents at dispatch time.

### Size

| Value | Meaning                   | When to Use                 |
| ----- | ------------------------- | --------------------------- |
| S     | Small — one session       | Focused, single concern     |
| M     | Medium — sustained effort | Multiple concerns, cohesive |
| L     | Large — forbidden         | NEVER — split into S/M      |

### FR refs

Comma-separated FR IDs from SPEC.md:

```
FR refs: FR-001, FR-002
```

### QG ref (test tasks only)

Quality gate name from QUALITY.md:

```
QG ref: QG-001-user-auth
```

### Test type (test tasks only)

| Value         | Use When                                   |
| ------------- | ------------------------------------------ |
| `unit`        | Testing single class/function in isolation |
| `integration` | Testing layer interaction with real DB     |
| `e2e`         | Testing full HTTP lifecycle                |

Feature tasks use: `Test type: —`

### Acceptance Criteria

| Rule        | Details                                 |
| ----------- | --------------------------------------- |
| Verifiable  | Pass or fail — no partial credit        |
| No "should" | Use "must", "will", "returns"           |
| Specific    | Exact behavior, not vague               |
| Multiple    | Each criterion independently verifiable |

**Examples:**

```markdown
Acceptance criteria:

- Returns UserEntity with id, name, email fields
- Throws NotFoundException with code USER_NOT_FOUND when user not found
- Uses this.getClient() for all Prisma operations
- All methods wrapped in this.withRetry()
```

### Dependencies

| Format           | Example                                |
| ---------------- | -------------------------------------- |
| Has dependencies | `Dependencies: TASK-F-001, TASK-F-002` |
| No dependencies  | `Dependencies: none`                   |

## Complete Example

```markdown
--- TASK-F-001 ---
Title: Create UserRepository with CRUD methods
Type: feature
Wave: 1
Assigned: Slot A
Size: S
FR refs: FR-001
QG ref: —
Test type: —

Description:
Implement UserRepository extending BaseRepository with create, findById,
findPaginated, update, and delete methods. Follow the repository pattern
template exactly.

Acceptance criteria:
- Repository extends BaseRepository
- Constructor follows pattern: prisma: PrismaService + @Optional() @Inject('PRISMA_TRANSACTION')
- All methods use this.getClient() — never this.prisma directly
- All methods use this.withRetry() wrapper
- Data interfaces defined at top of file: CreateDomainData, UpdateDomainData, FindDomainsParams, FindDomainsResult
- Include constant DOMAIN_INCLUDE defined at module scope

Dependencies: none

---

TASK-T-001 ---
Title: Verify UserRepository CRUD operations
Type: test
Wave: 1
Assigned: Slot A
Size: S
FR refs: FR-001
QG ref: QG-001-repository-crud
Test type: unit

Description:
Write unit tests for UserRepository verifying all CRUD methods work correctly
with mocked PrismaService. Test constructor pattern and method signatures.

Acceptance criteria:

- All 5 methods tested: create, findById, findPaginated, update, delete
- Mock returns verified for correct Prisma calls
- Constructor pattern verified
- this.getClient() usage verified
- Coverage >= 80%

Dependencies: none
```
