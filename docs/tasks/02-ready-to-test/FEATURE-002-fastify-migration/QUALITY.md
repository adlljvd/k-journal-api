# QUALITY.md: Fastify HTTP Engine Migration

**Coverage Target:** 80% all metrics
**Test Pyramid:** 70% unit, 20% integration, 10% e2e

---

## Scenario Coverage Map

| # | Scenario | Type | Layer | P | Assertion |
|---|----------|------|-------|---|-----------|
| **FR-001: Install Fastify Dependencies** |
| 1 | Verify @nestjs/platform-fastify in dependencies | integration | infra | P0 | package.json contains dependency |
| 2 | Verify fastify in dependencies | integration | infra | P0 | package.json contains dependency |
| 3 | Verify @fastify/swagger-ui in dependencies | integration | infra | P0 | package.json contains dependency |
| 4 | Verify @nestjs/platform-express removed | integration | infra | P0 | package.json does not contain dependency |
| 5 | Verify swagger-ui-express removed | integration | infra | P0 | package.json does not contain dependency |
| 6 | Verify no Express imports remain | unit | infra | P1 | grep finds no express imports in src/ |
| **FR-002: Update Bootstrap to Use FastifyAdapter** |
| 7 | Application starts with FastifyAdapter | e2e | bootstrap | P0 | app.listen() succeeds, returns Fastify instance |
| 8 | Port configuration preserved | e2e | bootstrap | P0 | App listens on configured PORT |
| 9 | Logger confirms Fastify running | integration | bootstrap | P1 | Log output contains Fastify identifier |
| 10 | Graceful shutdown with Fastify | e2e | bootstrap | P1 | SIGTERM handled correctly |
| **FR-003: Migrate Swagger UI to Fastify** |
| 11 | Swagger UI accessible at /api/docs | e2e | swagger | P0 | GET /api/docs returns 200 with HTML |
| 12 | JSON spec accessible at /api/docs-json | e2e | swagger | P0 | GET /api/docs-json returns 200 with valid JSON |
| 13 | Bearer auth configuration preserved | integration | swagger | P0 | OpenAPI spec contains securitySchemes.bearer |
| 14 | All endpoints displayed with @ApiTags | integration | swagger | P0 | OpenAPI spec contains all tagged paths |
| 15 | SwaggerDocumentOptions valid for Fastify | unit | swagger | P1 | Configuration object matches Fastify schema |
| **FR-004: Preserve Existing Functionality** |
| 16 | Controller routes respond correctly | e2e | routes | P0 | All existing endpoint tests pass |
| 17 | Request validation works (class-validator) | integration | validation | P0 | Invalid requests return 400 with validation errors |
| 18 | Response transformation works (class-transformer) | integration | transform | P0 | Responses match DTO transformation rules |
| 19 | Global exception filters work | integration | filters | P0 | Exceptions return formatted error responses |
| 20 | JWT authentication works | e2e | auth | P0 | Protected routes require valid JWT, reject invalid |
| 21 | Rate limiting works | integration | middleware | P0 | Rate limit exceeded returns 429 |
| **NFR-001: Performance** |
| 22 | Startup time comparison | e2e | performance | P1 | Fastify startup <= Express baseline (ms) |
| **NFR-003: Bundle Size** |
| 23 | Production build size | integration | build | P1 | Build size within acceptable threshold |

---

## P0 Non-Negotiable Scenarios

| # | Scenario | Reason |
|---|----------|--------|
| 1-5 | Dependency verification | Core migration requirement |
| 7 | Application starts with FastifyAdapter | Blocking - app must run |
| 8 | Port configuration preserved | Blocking - runtime config |
| 11 | Swagger UI accessible | Explicit FR acceptance criteria |
| 12 | JSON spec accessible | Explicit FR acceptance criteria |
| 13 | Bearer auth preserved | Security-critical |
| 14 | Endpoints with @ApiTags | Explicit FR acceptance criteria |
| 16-21 | Existing functionality | Migration must not break features |

---

## Mocking Strategy

| Dependency | Strategy | Reason |
|------------|----------|--------|
| Database (Prisma) | Mock in unit tests, real in integration | Isolation for unit, real behavior for integration |
| JWT Service | Mock token generation/validation | Deterministic auth testing |
| External APIs | Mock responses | No external network dependency |
| Rate Limiter | Mock in unit, real in integration | Verify integration behavior |

---

## Test Types per FR

| FR | Unit | Integration | E2E |
|----|------|-------------|-----|
| FR-001 | Import verification | package.json checks | - |
| FR-002 | Configuration validation | Logger output | Startup/shutdown |
| FR-003 | Options validation | Spec content | Endpoint accessibility |
| FR-004 | - | Validation, filters, middleware | Routes, auth |
| NFR-001 | - | - | Timing measurement |
| NFR-003 | - | Build artifact check | - |

---

## Performance Test Criteria (NFR-001)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Startup time | <= Express baseline | Time from `npm start` to "listening" log |
| Baseline capture | Before migration | Measure 3 runs, take median |

---

## Manual Quality Gates

| Gate | Verification | Expected |
|------|--------------|----------|
| Swagger UI | Browser access /api/docs | UI renders with all endpoints |
| JSON Spec | Browser/curl /api/docs-json | Valid OpenAPI JSON returned |
| App startup | `npm run start` | No errors, Fastify log visible |
| Existing tests | `npm test` | All pass |

---

## Notes

- **Existing tests are the primary verification for FR-004** - no new test suites required if coverage adequate
- **Performance baseline must be captured before migration** for valid comparison
- **No business logic changes** - only infrastructure/platform layer modifications
