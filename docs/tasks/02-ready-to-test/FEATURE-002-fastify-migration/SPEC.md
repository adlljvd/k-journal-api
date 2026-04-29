=== SPEC: Fastify HTTP Engine Migration ===

## Context
Project architecture mandates Fastify 5.x as the HTTP engine, but current implementation uses Express via `@nestjs/platform-express`. This migration aligns implementation with architecture standards and brings performance benefits.

## Scope
- Replace Express platform with Fastify platform in NestJS
- Update main.ts to use FastifyAdapter
- Migrate Swagger UI to Fastify-compatible package
- Verify all existing functionality works with Fastify

## Out of Scope
- Changes to business logic in services/controllers
- Changes to database layer (Prisma)
- Changes to authentication/authorization logic
- New endpoints or features

## Functional Requirements

### FR-001: Install Fastify Dependencies
**Description**: Install required Fastify packages and remove Express dependencies
**Acceptance Criteria**:
- `@nestjs/platform-fastify` installed
- `fastify` installed
- `@fastify/swagger-ui` installed (replaces `swagger-ui-express`)
- `@nestjs/platform-express` removed from dependencies
- `swagger-ui-express` removed from dependencies

### FR-002: Update Bootstrap to Use FastifyAdapter
**Description**: Configure NestJS to use Fastify as HTTP adapter
**Acceptance Criteria**:
- `NestFactory.create()` uses `FastifyAdapter` as second parameter
- Application starts successfully with Fastify
- Port configuration works identically to Express version
- Logger output confirms Fastify is running

### FR-003: Migrate Swagger UI to Fastify
**Description**: Update Swagger configuration for Fastify compatibility
**Acceptance Criteria**:
- SwaggerDocumentOptions configured correctly for Fastify
- `SwaggerModule.setup()` works with Fastify adapter
- Swagger UI accessible at `/api/docs`
- JSON spec accessible at `/api/docs-json`
- Bearer authentication configuration preserved
- All endpoints displayed with correct @ApiTags grouping

### FR-004: Preserve Existing Functionality
**Description**: Ensure all existing endpoints and features work identically
**Acceptance Criteria**:
- All controller routes respond correctly
- Request validation (class-validator) works
- Response transformation (class-transformer) works
- Global exception filters work
- JWT authentication works
- Rate limiting works

## API Contract
No API changes. All existing endpoints preserved.

## Data Model
No data model changes.

## Non-Functional Requirements

### NFR-001: Performance
**Metric**: Startup time with Fastify ≤ startup time with Express
**Rationale**: Fastify should not negatively impact application startup

### NFR-002: Test Coverage
**Metric**: All existing tests pass after migration
**Rationale**: Migration must not break existing functionality

### NFR-003: Bundle Size
**Metric**: Production build size should not increase significantly
**Rationale**: Fastify is generally smaller than Express

## Quality Gates (Skeleton)

| Gate | Metric | Target |
|------|--------|--------|
| Tests | All existing tests | Pass |
| Build | npm run build | Success |
| Lint | npm run lint | 0 errors |
| Manual | Swagger UI | Accessible |

## Assumptions
- All existing tests are comprehensive enough to catch migration issues
- No custom Express middleware exists that requires special migration
- Third-party packages used are compatible with Fastify

## Risks
- Express-specific middleware incompatibility: Breaking changes — Mitigation: Audit codebase for Express middleware, replace with Fastify equivalents
- Test failures after migration: Regression — Mitigation: Run full test suite before and after, fix issues incrementally
- Request body parsing differences: Data loss — Mitigation: Verify content-type handling, test file upload if applicable
