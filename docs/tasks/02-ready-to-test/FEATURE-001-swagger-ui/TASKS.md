# TASKS.md — Swagger UI Configuration

**Feature:** FEATURE-001-swagger-ui
**Status:** 01-development
**Created:** 2026-04-28
**Updated:** 2026-04-29

---

## Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 4 |
| Feature Tasks | 1 |
| Unit Test Tasks | 1 |
| E2E Test Tasks | 2 |
| Waves | 2 (1 feature, 1 e2e) |
| FRs Covered | FR-001, FR-002, FR-003 |

---

## Wave 1 — Feature + Unit Test

--- TASK-F-001 ---
Title: Configure Swagger module in main.ts
Type: feature
Wave: 1
Assigned: Slot A
Size: S
FR refs: FR-001, FR-002, FR-003
QG ref: —
Test type: —

Description:
Add Swagger UI configuration to the NestJS application bootstrap function in `src/main.ts`. Import `DocumentBuilder` and `SwaggerModule` from `@nestjs/swagger`. Configure the document with title, description, version, and Bearer authentication. Setup the Swagger UI endpoint at `/api/docs`. Add environment variable toggle to disable Swagger in production (NFR-002).

Implementation details:
1. Import `DocumentBuilder` and `SwaggerModule` from `@nestjs/swagger`
2. Create a `setupSwagger()` helper function in main.ts (after bootstrap, before export)
3. In `setupSwagger()`:
   - Check `process.env.ENABLE_SWAGGER` — if set to `'false'`, skip setup
   - Create DocumentBuilder with:
     - `.setTitle('K-Journal API')`
     - `.setDescription('API documentation for K-Journal application')`
     - `.setVersion('1.0')`
     - `.addBearerAuth()` (for FR-002 JWT support)
   - Build the document with `.build()`
   - Create OpenAPI document with `SwaggerModule.createDocument(app, config)`
   - Setup Swagger UI with `SwaggerModule.setup('api/docs', app, document)`
4. Call `setupSwagger(app)` inside bootstrap(), after `app.useGlobalInterceptors()` and before `app.listen()`
5. Log a message when Swagger is enabled: `logger.log('Swagger UI available at: http://localhost:${port}/api/docs')`

Acceptance criteria:
- DocumentBuilder configured with title, description, and version
- `addBearerAuth()` called on DocumentBuilder
- SwaggerModule setup at path `/api/docs`
- JSON spec accessible at `/api/docs-json`
- `setupSwagger()` helper function exists and is called from bootstrap()
- When `ENABLE_SWAGGER=false`, Swagger setup is skipped
- When `ENABLE_SWAGGER` is unset or any other value, Swagger setup runs
- Log message confirms Swagger UI URL when enabled

Dependencies: none

---

--- TASK-T-001-unit ---
Title: Unit tests for Swagger configuration
Type: test
Test type: unit
Wave: 1
Assigned: Slot A
Size: S
FR refs: FR-001, FR-002
QG ref: P0 Scenario 1, P0 Scenario 2, P0 Scenario 3, P0 Scenario 4, P0 Scenario 8
Description:
Write unit tests to verify DocumentBuilder configuration is correct. Create test file at `test/swagger/swagger-config.spec.ts`. Mock NestJS application and SwaggerModule to verify configuration calls without starting a real server.

Test cases to implement:
1. DocumentBuilder.setTitle() called with 'K-Journal API'
2. DocumentBuilder.setDescription() called with expected description
3. DocumentBuilder.setVersion() called with '1.0'
4. SwaggerModule.setup() called with '/api/docs' path
5. DocumentBuilder.addBearerAuth() called during setup

Acceptance criteria:
- Test file created at `test/swagger/swagger-config.spec.ts`
- Unit test verifies DocumentBuilder.setTitle() called with correct value
- Unit test verifies DocumentBuilder.setDescription() called with correct value
- Unit test verifies DocumentBuilder.setVersion() called with correct value
- Unit test verifies SwaggerModule.setup() called with '/api/docs' path
- Unit test verifies DocumentBuilder.addBearerAuth() called
- All tests pass with `npm run test`
- Tests do not require a running server (pure unit tests with mocks)

Dependencies: TASK-F-001

---

## Wave E2E — E2E Tests

--- TASK-T-001-e2e ---
Title: E2E tests for Swagger UI endpoints
Type: e2e
Test type: e2e
Wave: e2e
Assigned: Slot E2E
Size: S
FR refs: FR-001, FR-002, FR-003
QG ref: P0 Scenario 5, P0 Scenario 9, P0 Scenario 10, P0 Scenario 12, P0 Scenario 13, P0 Scenario 14, Coverage (Statements 80%, Branches 80%)

Description:
Write E2E tests to verify Swagger UI configuration is correct and accessible. Create test file at `test/swagger/swagger-endpoints.spec.ts`. Use supertest to verify HTTP responses.

Test cases to implement:
1. GET `/api/docs` returns 200 and HTML content (Swagger UI page)
2. GET `/api/docs-json` returns 200 and valid JSON with OpenAPI spec
3. OpenAPI spec contains `info.title`, `info.description`, `info.version`
4. OpenAPI spec contains `components.securitySchemes.bearer` indicating Bearer auth is configured
5. OpenAPI spec `paths` object contains all registered controller routes (verify at least one known endpoint exists)

Acceptance criteria:
- Test file created at `test/swagger/swagger-endpoints.spec.ts`
- GET `/api/docs` returns HTTP 200 with `text/html` content type
- GET `/api/docs-json` returns HTTP 200 with `application/json` content type
- JSON response contains `info.title` matching configured title
- JSON response contains `components.securitySchemes.bearer` with `type: "http"` and `scheme: "bearer"`
- JSON response `paths` object is non-empty and contains registered endpoints
- All tests pass with `npm run test:e2e`
- Coverage threshold met (80% statements, 80% branches for modified code)

Dependencies: TASK-F-001

---

--- TASK-T-002-e2e ---
Title: E2E tests for Swagger production toggle
Type: e2e
Test type: e2e
Wave: e2e
Assigned: Slot E2E
Size: S
FR refs: NFR-002
QG ref: P0 Scenario 17, P0 Scenario 18, P1 Scenario 19

Description:
Write E2E tests to verify Swagger can be disabled via environment variable for production safety. Create test file at `test/swagger/swagger-production.spec.ts`. Test the behavior with different `ENABLE_SWAGGER` environment variable values.

Test cases to implement:
1. When `ENABLE_SWAGGER=false`, GET `/api/docs` returns 404
2. When `ENABLE_SWAGGER=true`, GET `/api/docs` returns 200
3. When `ENABLE_SWAGGER` is undefined, GET `/api/docs` returns 200 (default enabled in dev)

Acceptance criteria:
- Test file created at `test/swagger/swagger-production.spec.ts`
- GET `/api/docs` returns 404 when `ENABLE_SWAGGER=false`
- GET `/api/docs` returns 200 when `ENABLE_SWAGGER=true`
- GET `/api/docs` returns 200 when `ENABLE_SWAGGER` is undefined
- Tests properly isolate environment variable state (reset after each test)
- All tests pass with `npm run test:e2e`

Dependencies: TASK-F-001

---

## Wave Summary

### Wave 1 (Feature + Unit)
| Task ID | Type | Title | Assigned | Size |
|---------|------|-------|----------|------|
| TASK-F-001 | feature | Configure Swagger module in main.ts | Slot A | S |
| TASK-T-001-unit | test (unit) | Unit tests for Swagger configuration | Slot A | S |

### Wave E2E (E2E Tests)
| Task ID | Type | Title | Assigned | Size |
|---------|------|-------|----------|------|
| TASK-T-001-e2e | e2e | E2E tests for Swagger UI endpoints | Slot E2E | S |
| TASK-T-002-e2e | e2e | E2E tests for Swagger production toggle | Slot E2E | S |

---

## FR Coverage Matrix

| FR | Feature Task | Unit Test | E2E Test |
|----|--------------|-----------|----------|
| FR-001 | TASK-F-001 | TASK-T-001-unit | TASK-T-001-e2e |
| FR-002 | TASK-F-001 | TASK-T-001-unit | TASK-T-001-e2e |
| FR-003 | TASK-F-001 | — | TASK-T-001-e2e |
| NFR-002 | TASK-F-001 | — | TASK-T-002-e2e |

---

## Quality Gates Coverage

| Gate | Task Coverage |
|------|---------------|
| P0 Scenario 1 (DocumentBuilder title) | TASK-T-001-unit |
| P0 Scenario 2 (DocumentBuilder description) | TASK-T-001-unit |
| P0 Scenario 3 (DocumentBuilder version) | TASK-T-001-unit |
| P0 Scenario 4 (SwaggerModule path) | TASK-T-001-unit |
| P0 Scenario 5 (JSON spec accessible) | TASK-T-001-e2e |
| P0 Scenario 8 (addBearerAuth called) | TASK-T-001-unit |
| P0 Scenario 9 (securityDefinitions in spec) | TASK-T-001-e2e |
| P0 Scenario 10 (bearer auth type/scheme) | TASK-T-001-e2e |
| P0 Scenario 12 (Swagger UI accessible) | TASK-T-001-e2e |
| P0 Scenario 13 (Swagger UI HTML) | TASK-T-001-e2e |
| P0 Scenario 14 (All endpoints in spec) | TASK-T-001-e2e |
| P0 Scenario 17 (Swagger disabled on false) | TASK-T-002-e2e |
| P0 Scenario 18 (Swagger enabled on true) | TASK-T-002-e2e |
| Coverage 80% statements | TASK-T-001-e2e |
| Coverage 80% branches | TASK-T-001-e2e |

---

## Notes

- All three FRs (FR-001, FR-002, FR-003) are implemented in the same code location (main.ts bootstrap), so they are combined into one feature task
- The production safety toggle (NFR-002) is included in TASK-F-001 as an environment variable check
- The project already has `@nestjs/swagger` and `swagger-ui-express` installed — no new dependencies needed
- Test file structure follows QUALITY.md specification: `test/swagger/swagger-*.spec.ts`
- E2E tests run in a dedicated wave after feature implementation is complete
