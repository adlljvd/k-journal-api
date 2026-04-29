---
name: scoped-checks
description: 'Scoped lint, test, and type-check on changed files. Use after implementation.'
---

## Scoped Lint

Run lint only on files you touched. Never run full-suite lint.

### Commands by Stack

| Stack           | Command                         |
| --------------- | ------------------------------- |
| NestJS/Next.js  | `pnpm run lint --files {files}` |
| NestJS (ESLint) | `eslint {files}`                |
| Go              | `golangci-lint run {files}`     |
| Python          | `ruff check {files}`            |

### Usage Pattern

```bash
# Single file
pnpm run lint --files src/modules/user/user.service.ts

# Multiple files
pnpm run lint --files src/modules/user/user.service.ts src/modules/user/user.controller.ts
```

### Hard Rules

| Rule                   | Details                            |
| ---------------------- | ---------------------------------- |
| Only touched files     | Do not lint entire project         |
| Fix errors immediately | Do not carry broken state forward  |
| No `eslint-disable`    | Fix the lint error, don't suppress |
| Run after every task   | Before moving to next task         |

---

## Scoped Test

Run tests only for modules you touched.

### Commands by Stack

| Stack          | Command               |
| -------------- | --------------------- |
| NestJS/Next.js | `jest {test-file}`    |
| Go             | `go test {package}`   |
| Python         | `pytest {file}`       |
| Rust           | `cargo test {module}` |

### Usage Pattern

```bash
# Single test file
jest src/modules/user/user.service.spec.ts

# Run only matching tests
jest src/modules/user/user.service.spec.ts -t "should create"

# With coverage
jest src/modules/user/user.service.spec.ts --coverage --collectCoverageFrom=src/modules/user/user.service.ts
```

### Hard Rules

| Rule                          | Details                                  |
| ----------------------------- | ---------------------------------------- |
| Only touched test files       | Do not run full test suite               |
| Must pass before next task    | Fix failures immediately                 |
| Coverage target in QUALITY.md | Check coverage requirements              |
| No skip/only in commits       | `it.skip` and `it.only` forbidden in PRs |

### Test File Mapping

| Source               | Test File                 |
| -------------------- | ------------------------- |
| `user.service.ts`    | `user.service.spec.ts`    |
| `user.controller.ts` | `user.controller.spec.ts` |
| `user.repository.ts` | `user.repository.spec.ts` |
| `user.guard.ts`      | `user.guard.spec.ts`      |

---

## Scoped Type-Check

Run type-check only on files you touched.

### Commands by Stack

| Stack          | Command                   |
| -------------- | ------------------------- |
| NestJS/Next.js | `tsc --noEmit {files}`    |
| Go             | `go build {package}`      |
| Python (mypy)  | `mypy {files}`            |
| Rust           | `cargo check` (per crate) |

### Usage Pattern

```bash
# Single file
tsc --noEmit src/modules/user/user.service.ts

# Multiple files
tsc --noEmit src/modules/user/user.service.ts src/modules/user/user.controller.ts
```

### Hard Rules

| Rule                   | Details                            |
| ---------------------- | ---------------------------------- |
| Only touched files     | Do not type-check entire project   |
| Fix errors immediately | Do not carry broken state forward  |
| No `@ts-ignore`        | Fix the type error, don't suppress |
| No `as any`            | Fix the type, don't cast           |

### Common Errors

| Error               | Fix                                  |
| ------------------- | ------------------------------------ |
| `any` type          | Use specific type                    |
| Missing property    | Add to interface/type                |
| Type not assignable | Fix return type or add conversion    |
| Null/undefined      | Add null check or use `!` if certain |

---

## Type-Check vs Lint

| Tool       | What It Checks                      |
| ---------- | ----------------------------------- |
| Lint       | Code style, unused vars, formatting |
| Type-Check | Type safety, null safety, generics  |

---

## Post-Implementation Checklist

Run in order:

1. **Type-Check** — `tsc --noEmit {files}`
2. **Lint** — `pnpm run lint --files {files}`
3. **Test** — `jest {test-file}`

All must pass before returning to @lead-engineer.
