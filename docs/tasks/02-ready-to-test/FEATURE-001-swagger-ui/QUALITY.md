# QUALITY.md: Swagger UI Configuration

## Coverage Targets

| Metric    | Target |
| --------- | ------ |
| Statements| 80%    |
| Branches  | 80%    |
| Functions | 80%    |
| Lines     | 80%    |

## Test Pyramid Distribution

| Type       | Ratio |
| ---------- | ----- |
| Unit       | 50%   |
| Integration| 35%   |
| E2E        | 15%   |

> Rationale: Configuration-heavy feature with minimal business logic. Focus on integration tests for actual HTTP endpoint verification, unit tests for configuration logic, and E2E for UI accessibility.

---

## Scenario Coverage Map

### FR-001: Swagger Module Initialization

| #  | Scenario                                    | Type       | Layer        | P   | Assertion                                                          |
| -- | ------------------------------------------- | ---------- | ------------ | --- | ------------------------------------------------------------------ |
| 1  | DocumentBuilder configured with title       | unit       | config       | P0  | DocumentBuilder.setTitle() called with expected value              |
| 2  | DocumentBuilder configured with description | unit       | config       | P0  | DocumentBuilder.setDescription() called with expected value        |
| 3  | DocumentBuilder configured with version     | unit       | config       | P0  | DocumentBuilder.setVersion() called with expected value            |
| 4  | SwaggerModule setup with correct path       | unit       | config       | P0  | SwaggerModule.setup() called with '/api/docs' path                 |
| 5  | JSON spec endpoint accessible               | integration| e2e         | P0  | GET /api/docs-json returns 200 with valid OpenAPI JSON             |
| 6  | JSON spec contains correct openapi version  | integration| e2e         | P1  | Response body contains "openapi": "3.x.x"                          |
| 7  | JSON spec contains info object              | integration| e2e         | P1  | Response body contains info.title, info.description, info.version  |

### FR-002: JWT Authentication Support

| #  | Scenario                                    | Type       | Layer        | P   | Assertion                                                          |
| -- | ------------------------------------------- | ---------- | ------------ | --- | ------------------------------------------------------------------ |
| 8  | addBearerAuth called on DocumentBuilder      | unit       | config       | P0  | DocumentBuilder.addBearerAuth() called during setup                |
| 9  | OpenAPI spec contains securityDefinitions   | integration| e2e         | P0  | JSON spec contains components.securitySchemes.bearer               |
| 10 | Security scheme type is http with bearer    | integration| e2e         | P0  | securitySchemes.bearer.type === "http" && scheme === "bearer"      |
| 11 | Swagger UI renders Authorize button         | e2e        | ui          | P1  | HTML response contains authorize button element                    |

### FR-003: Swagger UI Accessibility

| #  | Scenario                                    | Type       | Layer        | P   | Assertion                                                          |
| -- | ------------------------------------------- | ---------- | ------------ | --- | ------------------------------------------------------------------ |
| 12 | Swagger UI endpoint accessible              | e2e        | ui          | P0  | GET /api/docs returns 200 with HTML content                        |
| 13 | Swagger UI returns HTML page                | e2e        | ui          | P0  | Content-Type header is text/html                                   |
| 14 | All registered endpoints appear in spec     | integration| e2e         | P0  | JSON spec paths object contains all registered controller routes   |
| 15 | Endpoints grouped by ApiTags               | integration| e2e         | P1  | JSON spec paths contain tags matching controller @ApiTags          |

### NFR-001: Startup Performance

| #  | Scenario                                    | Type       | Layer        | P   | Assertion                                                          |
| -- | ------------------------------------------- | ---------- | ------------ | --- | ------------------------------------------------------------------ |
| 16 | Swagger setup does not exceed 100ms         | performance| bootstrap    | P1  | Startup time with Swagger - startup time without < 100ms           |

### NFR-002: Production Safety

| #  | Scenario                                    | Type       | Layer        | P   | Assertion                                                          |
| -- | ------------------------------------------- | ---------- | ------------ | --- | ------------------------------------------------------------------ |
| 17 | Swagger disabled when env var is false      | integration| config       | P0  | GET /api/docs returns 404 when ENABLE_SWAGGER=false                |
| 18 | Swagger enabled when env var is true        | integration| config       | P0  | GET /api/docs returns 200 when ENABLE_SWAGGER=true                 |
| 19 | Swagger enabled by default in dev           | integration| config       | P1  | GET /api/docs returns 200 when ENABLE_SWAGGER is undefined         |

---

## Non-Negotiable Scenarios (P0)

| #  | Scenario                                    | FR/NFR     | Reason                                                  |
| -- | ------------------------------------------- | ---------- | ------------------------------------------------------- |
| 1  | DocumentBuilder configured with title       | FR-001     | Core initialization requirement                         |
| 2  | DocumentBuilder configured with description | FR-001     | Core initialization requirement                         |
| 3  | DocumentBuilder configured with version     | FR-001     | Core initialization requirement                         |
| 4  | SwaggerModule setup with correct path       | FR-001     | Defines accessibility endpoint                          |
| 5  | JSON spec endpoint accessible               | FR-001     | Primary API contract exposure                           |
| 8  | addBearerAuth called on DocumentBuilder      | FR-002     | Security configuration requirement                      |
| 9  | OpenAPI spec contains securityDefinitions   | FR-002     | Authentication support verification                     |
| 10 | Security scheme type is http with bearer    | FR-002     | Correct auth mechanism specification                    |
| 12 | Swagger UI endpoint accessible              | FR-003     | Primary user-accessible endpoint                        |
| 13 | Swagger UI returns HTML page                | FR-003     | Correct response format                                 |
| 14 | All registered endpoints appear in spec     | FR-003     | Complete documentation coverage                         |
| 17 | Swagger disabled when env var is false      | NFR-002    | Production security requirement                         |
| 18 | Swagger enabled when env var is true        | NFR-002    | Explicit enable functionality                           |

---

## Mocking Strategy

| Dependency            | Mock Strategy                                                    |
| --------------------- | ---------------------------------------------------------------- |
| NestJS Application    | UseTestingModule with mock module for unit tests                |
| HTTP Server           | Use supertest with real HTTP server for integration/e2e tests   |
| Environment Variables | Mock process.env for config-based scenarios                     |
| Controllers           | Use existing controllers; do not mock for integration tests     |

---

## Performance Test Criteria

| Scenario                                   | Metric                              | Threshold  | Measurement Method                    |
| ------------------------------------------ | ----------------------------------- | ---------- | ------------------------------------- |
| Swagger setup impact on startup            | Time delta (with - without Swagger) | < 100ms    | Measure bootstrap duration with/without config |

### Performance Test Implementation Notes
- Measure application bootstrap time before and after Swagger configuration
- Run multiple iterations (min 5) to account for variance
- Test in isolated environment to minimize external factors

---

## Test File Organization

```
test/
├── swagger/
│   ├── swagger-config.spec.ts        # Unit tests for FR-001, FR-002
│   ├── swagger-endpoints.spec.ts     # Integration tests for FR-001, FR-003
│   ├── swagger-security.spec.ts      # Integration tests for FR-002
│   └── swagger-production.spec.ts    # Integration tests for NFR-002
└── performance/
    └── startup-performance.spec.ts   # Performance tests for NFR-001
```

---

## Edge Cases to Cover

| Scenario                                    | Test Type  | Description                                                    |
| ------------------------------------------- | ---------- | -------------------------------------------------------------- |
| Empty controllers                           | integration| Swagger UI still renders when no controllers exist             |
| Missing ApiTags on controller               | integration| Endpoints appear in default group when @ApiTags missing        |
| Invalid JWT token in Authorize             | e2e        | Requests with invalid token are rejected (requires live test)  |
| Environment variable is string "false"      | integration| String "false" should disable Swagger, not truthy check        |

---

## Security Test Considerations

| Scenario                                    | Priority | Description                                                    |
| ------------------------------------------- | -------- | -------------------------------------------------------------- |
| Swagger disabled in production              | P0       | Default behavior should protect production environments        |
| No sensitive data in OpenAPI spec           | P1       | Verify no hardcoded secrets in spec output                    |

---

## Manual Test Gates

| Gate                                       | Instructions                                                   |
| ------------------------------------------ | -------------------------------------------------------------- |
| Swagger UI accessible in browser           | Navigate to http://localhost:{PORT}/api/docs, verify UI loads  |
| Authorize button visible and functional    | Click Authorize, verify JWT input modal appears                |
| All endpoints visible                      | Verify all API endpoints are listed in Swagger UI              |
| Try It Out functionality                   | Execute a sample API call through Swagger UI                   |

---

## Notes

- This feature is configuration-focused with minimal business logic
- Integration tests are prioritized over unit tests to verify actual HTTP behavior
- E2E tests focus on UI accessibility and user-facing functionality
- Performance test (NFR-001) is P1 due to low likelihood of regression in config-only changes
