---
name: coverage-rules
description: 'Test coverage requirements. Use when checking coverage.'
---

# Coverage Rules

Coverage requirements enforced at build time. Build FAILS if below thresholds.

## Coverage Thresholds

| Metric     | Global | Services | Guards/Strategies |
| ---------- | ------ | -------- | ----------------- |
| Branches   | 70%    | —        | —                 |
| Functions  | 80%    | 100%     | 100%              |
| Lines      | 80%    | 100%     | 100%              |
| Statements | 80%    | 100%     | 100%              |

## Excluded from Coverage

```
src/main.ts
*.module.ts
src/database/prisma/**
*.integration.spec.ts
*.perf.spec.ts
test/**
```

## Jest Config

```typescript
// jest.config.ts
export default {
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/main.ts$',
    '.module.ts$',
    '/src/database/prisma/',
    '.integration.spec.ts$',
    '.perf.spec.ts$',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## Coverage Applies To

| Test Type         | Collect Coverage              |
| ----------------- | ----------------------------- |
| Unit tests        | Yes                           |
| Integration tests | No (`collectCoverage: false`) |
| E2E tests         | No (`collectCoverage: false`) |
| Performance tests | No (excluded)                 |

## Run Coverage

```bash
# Run unit tests with coverage
jest --coverage

# Coverage for specific file
jest --coverage --collectCoverageFrom="src/modules/domain/domain.service.ts"

# Check coverage threshold
jest --coverage --coverageThreshold='{"global":{"lines":80}}'
```

## Hard Rules

| Rule                        | Details                      |
| --------------------------- | ---------------------------- |
| Build fails below threshold | CI rejects PR                |
| Services need 100%          | Functions, lines, statements |
| Guards need 100%            | Security-critical code       |
| No `/* istanbul ignore */`  | Fix missing tests instead    |
