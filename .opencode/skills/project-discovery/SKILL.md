---
name: project-discovery
description: 'Agent Phase 1 project discovery. Use when: starting a new dispatch, discovering available commands, or recording tool discovery.'
---

# Phase 1 — Project Discovery

This phase runs **once per dispatch**, before any code is written. Not optional.

## Step 1 — Read Architecture Guide

```bash
# Check for architecture guide
cat docs/archived/architecture/architecture-guide.md
```

If exists: Read it. This defines patterns you must follow.
If not exists: Note as missing and continue.

## Step 2 — Identify Check Scripts

| Stack   | Files to Check                       |
| ------- | ------------------------------------ |
| Node.js | `package.json` → scripts             |
| Go      | `go.mod`, `Makefile`                 |
| Python  | `pyproject.toml`, `requirements.txt` |
| Rust    | `Cargo.toml`                         |

Find exact commands for:

1. **Scoped lint** — e.g., `pnpm run lint --files {files}` or `eslint {files}`
2. **Scoped typecheck** — e.g., `tsc --noEmit` or per-file if supported
3. **Scoped test** — e.g., `jest {file}` or `pytest {file}`

## Step 3 — Record Tool Discovery

```
=== TOOL DISCOVERY ===
Architecture guide: READ | NOT FOUND
Stack: [language/framework/version]
Scoped lint: [exact command with file placeholder]
Scoped typecheck: [exact command or N/A]
Scoped test: [exact command with file placeholder]
Notes: [monorepo, missing scripts, etc.]
=== END TOOL DISCOVERY ===
```

## Example Output

```
=== TOOL DISCOVERY ===
Architecture guide: READ
Stack: NestJS 11 / TypeScript 5.3 / Prisma 7
Scoped lint: pnpm run lint --files {files}
Scoped typecheck: tsc --noEmit
Scoped test: jest {file}
Notes: Monorepo with /apps/api and /libs/shared
=== END TOOL DISCOVERY ===
```

## Hard Rules

| Rule                          | Details                                 |
| ----------------------------- | --------------------------------------- |
| Run once per dispatch         | Before any code                         |
| Read architecture guide first | Even if you've worked on project before |
| Record exact commands         | You'll use these during implementation  |
| Report to @lead-engineer      | If scoped commands unavailable          |

## What to Look For

| Item               | Why                              |
| ------------------ | -------------------------------- |
| `lint` script      | For scoped lint on changed files |
| `test` script      | For scoped tests                 |
| `typecheck` script | For type verification            |
| `build` script     | To understand build process      |
| Monorepo structure | Different commands per package   |

## Common Commands

| Stack   | Lint                        | Typecheck      | Test            |
| ------- | --------------------------- | -------------- | --------------- |
| NestJS  | `eslint {files}`            | `tsc --noEmit` | `jest {file}`   |
| Next.js | `next lint --file {file}`   | `tsc --noEmit` | `jest {file}`   |
| Go      | `golangci-lint run {files}` | `go build`     | `go test {pkg}` |
| Python  | `ruff check {files}`        | `mypy {files}` | `pytest {file}` |
