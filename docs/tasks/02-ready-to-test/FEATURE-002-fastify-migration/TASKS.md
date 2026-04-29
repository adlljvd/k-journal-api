# TASKS.md: Fastify HTTP Engine Migration

**Feature:** FEATURE-002-fastify-migration
**Stage:** 02-ready-to-test
**Created:** 2026-04-28
**Updated:** 2026-04-29

---

## Task Summary

| Wave | Tasks | Engineers |
|------|-------|-----------|
| 1 | 3 | Slot A, Slot B, Slot C |
| 2 | 2 | Slot A, Slot B |
| E2E | 1 | Slot E2E |

**Total Tasks:** 6 (3 feature, 2 unit, 1 e2e)
**FRs Covered:** FR-001, FR-002, FR-003, FR-004
**NFRs Covered:** NFR-001, NFR-003

---

## Wave 1 — Feature + Unit Tests

--- TASK-F-001 ---
Title: Install Fastify dependencies and remove Express dependencies
Type: feature
Wave: 1
Assigned: Slot A
Size: S
FR refs: FR-001
QG ref: —
Test type: —

Description:
Update package.json to install Fastify-related packages and remove Express dependencies. Run npm install to update node_modules.

Execute the following package changes:
1. Install packages: `@nestjs/platform-fastify`, `fastify`, `@fastify/swagger-ui`
2. Remove packages: `@nestjs/platform-express`, `swagger-ui-express`
3. Remove dev dependency: `@types/express` (no longer needed)

Commands to execute:
```bash
npm install @nestjs/platform-fastify fastify @fastify/swagger-ui
npm uninstall @nestjs/platform-express swagger-ui-express @types/express
```

Acceptance criteria:
- `@nestjs/platform-fastify` present in package.json dependencies
- `fastify` present in package.json dependencies
- `@fastify/swagger-ui` present in package.json dependencies
- `@nestjs/platform-express` NOT present in package.json
- `swagger-ui-express` NOT present in package.json
- `npm install` completes without errors
- `npm run build` succeeds after changes

Dependencies: none

---

--- TASK-F-002 ---
Title: Audit codebase for Express-specific code
Type: feature
Wave: 1
Assigned: Slot B
Size: S
FR refs: FR-004
QG ref: —
Test type: —

Description:
Search the codebase for Express-specific imports, middleware, and patterns that may require modification for Fastify compatibility. Document findings and identify any necessary changes.

Search for:
1. Imports from 'express' package
2. Usage of Express-specific types (Request, Response, NextFunction from express)
3. Express middleware patterns (app.use() with Express-specific middleware)
4. Any custom Express middleware implementations

Execute searches:
```bash
grep -r "from 'express'" src/
grep -r "from \"express\"" src/
grep -r "@types/express" src/
grep -r "express.Request" src/
grep -r "express.Response" src/
grep -r "express.NextFunction" src/
```

Expected finding: NestJS abstracts HTTP layer, so minimal Express-specific code should exist. Main.ts uses NestFactory without direct Express references.

Acceptance criteria:
- Audit complete for all Express-related patterns
- No Express-specific middleware found (only NestJS abstractions used)
- No direct Express imports in application code
- Document any Express-specific code that requires migration (if found)
- If issues found: create follow-up tasks or note in migration comments

Dependencies: none

---

--- TASK-T-001-unit ---
Title: Verify package.json dependencies are correct
Type: test
Test type: unit
Wave: 1
Assigned: Slot C
Size: S
FR refs: FR-001
QG ref: Scenarios 1-6 (QUALITY.md) — P0: 1-5, P1: 6

Description:
Write automated verification that package.json contains the correct Fastify dependencies and no Express dependencies remain. Also verify no Express imports exist in source code.

Create test file: `test/migration/fastify-dependencies.spec.ts`

Test cases to implement:
1. Verify `@nestjs/platform-fastify` in dependencies
2. Verify `fastify` in dependencies
3. Verify `@fastify/swagger-ui` in dependencies
4. Verify `@nestjs/platform-express` NOT in dependencies
5. Verify `swagger-ui-express` NOT in dependencies
6. Grep src/ for any remaining Express imports

Test implementation approach:
```typescript
import packageJson from '../../package.json';

describe('Fastify Dependencies', () => {
  it('should have @nestjs/platform-fastify', () => {
    expect(packageJson.dependencies).toHaveProperty('@nestjs/platform-fastify');
  });
  // ... additional tests
});
```

Acceptance criteria:
- Test file created at `test/migration/fastify-dependencies.spec.ts`
- All 6 scenarios from QUALITY.md covered
- `npm test -- fastify-dependencies` passes
- `npm run build` succeeds

Dependencies: TASK-F-001

---

## Wave 2 — Feature + Integration Tests

--- TASK-F-003 ---
Title: Update main.ts for Fastify migration
Type: feature
Wave: 2
Assigned: Slot A
Size: M
FR refs: FR-002, FR-003
QG ref: —
Test type: —

Description:
Modify main.ts to use FastifyAdapter instead of the default Express adapter. Update both the NestFactory.create() call and ensure Swagger setup works with Fastify.

Changes to main.ts:

1. Import FastifyAdapter:
```typescript
import { FastifyAdapter } from '@nestjs/platform-fastify';
```

2. Update NestFactory.create() to use FastifyAdapter:
```typescript
const app = await NestFactory.create(
  AppModule,
  new FastifyAdapter(),
);
```

3. For Swagger, the existing setupSwagger function should work. The `@nestjs/swagger` package handles Fastify compatibility internally when using `SwaggerModule.setup()`. No changes needed to setupSwagger function itself.

4. Update logger message to confirm Fastify:
```typescript
logger.log(`Application is running on: http://localhost:${port} (Fastify)`);
```

Note: The existing global pipes, filters, and interceptors work identically with Fastify through NestJS abstraction layer.

Acceptance criteria:
- `FastifyAdapter` imported from `@nestjs/platform-fastify`
- `NestFactory.create()` uses `FastifyAdapter` as second parameter
- Application starts successfully with Fastify
- Port configuration works (PORT environment variable respected)
- Logger output contains "Fastify" to confirm adapter in use
- Swagger setup unchanged (SwaggerModule handles Fastify internally)
- `npm run build` succeeds
- `npm run start:dev` starts application without errors

Dependencies: TASK-F-001

---

--- TASK-T-002-unit ---
Title: Verify Fastify startup and Swagger UI functionality
Type: test
Test type: integration
Wave: 2
Assigned: Slot B
Size: M
FR refs: FR-002, FR-003
QG ref: Scenarios 7-15 (QUALITY.md) — P0: 7-8, 11-14; P1: 9-10, 15

Description:
Write tests to verify the application starts correctly with Fastify and Swagger UI is fully functional. Leverage existing test patterns from test/swagger/swagger-endpoints.spec.ts.

Create/update tests to verify:

1. Application startup with Fastify:
   - Create `test/migration/fastify-startup.spec.ts`
   - Test that app initializes with FastifyAdapter
   - Test port configuration works
   - Test graceful shutdown

2. Swagger UI verification:
   - Existing `test/swagger/swagger-endpoints.spec.ts` should pass
   - Verify GET /api/docs returns 200 with HTML
   - Verify GET /api/docs-json returns valid OpenAPI JSON
   - Verify bearer authentication in securitySchemes
   - Verify all tagged endpoints present

Test implementation:
```typescript
// test/migration/fastify-startup.spec.ts
describe('Fastify Startup', () => {
  it('should start application with FastifyAdapter', async () => {
    // Create app with AppModule and FastifyAdapter
    // Verify app.listen() succeeds
  });
});
```

Run verification:
```bash
npm test -- migration/
npm test -- swagger/
```

Acceptance criteria:
- Test file created at `test/migration/fastify-startup.spec.ts`
- All existing swagger tests pass (test/swagger/*.spec.ts)
- GET /api/docs returns HTTP 200 with text/html content type
- GET /api/docs-json returns HTTP 200 with valid OpenAPI JSON
- OpenAPI spec contains `components.securitySchemes.bearer`
- All tagged endpoints present in OpenAPI spec (auth/register, auth/login, users/me)
- Application starts and shuts down gracefully

Dependencies: TASK-F-003

---

## Wave E2E — E2E Tests

--- TASK-T-001-e2e ---
Title: Run existing e2e tests to verify functionality preserved
Type: e2e
Test type: e2e
Wave: e2e
Assigned: Slot E2E
Size: M
FR refs: FR-004
QG ref: Scenarios 16-23 (QUALITY.md) — P0: 16-21; P1: 22-23

Description:
Execute the full existing test suite to verify all functionality works correctly with Fastify. This task verifies that the migration did not break any existing features.

The existing test suite covers:
- Controller routes (test/*.e2e-spec.ts)
- Swagger endpoints (test/swagger/*.spec.ts)
- Security tests (test/security/*.spec.ts)

Execute test commands:
```bash
# Run all unit tests
npm test

# Run all e2e tests
npm run test:e2e

# Run with coverage
npm run test:cov
```

Verify each functional area:
1. Controller routes respond correctly (all e2e tests pass)
2. Request validation works (class-validator) - invalid requests return 400
3. Response transformation works (class-transformer) - responses match DTO rules
4. Global exception filters work - exceptions return formatted responses
5. JWT authentication works - protected routes require valid token
6. Rate limiting works - rate limit exceeded returns 429

For NFR verification:
- Capture startup time: `time npm run start` (compare to Express baseline if available)
- Verify build size: `npm run build` succeeds, check dist/ folder

Acceptance criteria:
- All unit tests pass: `npm test` exits with code 0
- All e2e tests pass: `npm run test:e2e` exits with code 0
- No test regressions compared to pre-migration baseline
- Startup time comparable to Express (no significant degradation)
- Build completes successfully: `npm run build` exits with code 0
- Test coverage maintained at or above baseline

Dependencies: TASK-F-003, TASK-T-002-unit

---

## Task Dependency Graph

```
Wave 1:
  TASK-F-001 (install deps) ─────┬──→ TASK-F-003 (update main.ts)
  TASK-F-002 (audit code)        │
  TASK-T-001-unit (verify deps) ─┘

Wave 2:
  TASK-F-003 (update main.ts) ───┬──→ TASK-T-002-unit (verify startup/swagger)
                                 │
                                 └──→ TASK-T-001-e2e (e2e tests)

Wave E2E:
  TASK-T-002-unit ───────────────┬──→ TASK-T-001-e2e (e2e tests)
```

---

## Wave Summary

### Wave 1 (Feature + Unit)
| Task ID | Type | Title | Assigned | Size |
|---------|------|-------|----------|------|
| TASK-F-001 | feature | Install Fastify dependencies | Slot A | S |
| TASK-F-002 | feature | Audit codebase for Express-specific code | Slot B | S |
| TASK-T-001-unit | test (unit) | Verify package.json dependencies | Slot C | S |

### Wave 2 (Feature + Integration)
| Task ID | Type | Title | Assigned | Size |
|---------|------|-------|----------|------|
| TASK-F-003 | feature | Update main.ts for Fastify | Slot A | M |
| TASK-T-002-unit | test (integration) | Verify Fastify startup and Swagger | Slot B | M |

### Wave E2E (E2E Tests)
| Task ID | Type | Title | Assigned | Size |
|---------|------|-------|----------|------|
| TASK-T-001-e2e | e2e | Run existing e2e tests | Slot E2E | M |

---

## Quality Gate Coverage

| Scenario | Priority | FR | Task | Type |
|----------|----------|-----|------|------|
| 1-5 | P0 | FR-001 | TASK-T-001-unit | unit |
| 6 | P1 | FR-001 | TASK-T-001-unit | unit |
| 7-8 | P0 | FR-002 | TASK-T-002-unit | integration |
| 9-10 | P1 | FR-002 | TASK-T-002-unit | integration |
| 11-14 | P0 | FR-003 | TASK-T-002-unit | integration |
| 15 | P1 | FR-003 | TASK-T-002-unit | integration |
| 16-21 | P0 | FR-004 | TASK-T-001-e2e | e2e |
| 22 | P1 | NFR-001 | TASK-T-001-e2e | e2e |
| 23 | P1 | NFR-003 | TASK-T-001-e2e | integration |

**P0 Coverage Status:** ✓ All 18 P0 scenarios covered

---

## Notes

- **No business logic changes**: All modifications are infrastructure/platform layer only
- **Existing tests are primary verification**: FR-004 relies on existing comprehensive test suite
- **Fastify compatibility**: NestJS abstracts HTTP adapter, so most code changes are minimal
- **Swagger migration**: @nestjs/swagger handles Fastify internally, no major Swagger code changes needed
- **E2E tests run in dedicated wave**: All E2E tests batched into single wave for efficiency
