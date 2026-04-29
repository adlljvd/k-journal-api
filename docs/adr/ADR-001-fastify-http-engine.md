=== ADR-001: Fastify as HTTP Engine ===

## Status
Accepted

## Context
Project architecture guide (docs/architecture/architecture-guide.md) specifies Fastify 5.x as the required HTTP engine with Express explicitly forbidden. However, the current implementation uses `@nestjs/platform-express` and does not use FastifyAdapter. This discrepancy must be resolved to align implementation with architecture standards.

Fastify offers:
- 2x faster request handling compared to Express
- Lower memory footprint
- Built-in JSON schema validation
- Better async/await support
- Active development and modern API design

## Decision
Migrate from Express to Fastify as the HTTP engine for NestJS application. This involves:
1. Replacing `@nestjs/platform-express` with `@nestjs/platform-fastify`
2. Updating `main.ts` to use `FastifyAdapter`
3. Updating Swagger configuration for Fastify compatibility
4. Ensuring all existing functionality remains intact after migration

## Consequences

### Positive
- Aligns implementation with architecture guide
- Improved HTTP performance (~2x faster than Express)
- Lower memory consumption
- Built-in request validation via JSON schema
- Better ETag support and HTTP/2 readiness
- Modern async-first API design

### Negative
- Breaking change requiring thorough regression testing
- Some Express-specific middleware incompatible (must use Fastify equivalents)
- `swagger-ui-express` must be replaced with `@fastify/swagger-ui`
- Learning curve for developers familiar with Express patterns

### Neutral
- Request/response handling patterns differ slightly (Fastify uses `request.raw` for Node.js IncomingMessage)
- Some third-party NestJS packages may require Fastify-specific configuration

## Alternatives Considered
| Option | Why not chosen |
|--------|----------------|
| Keep Express | Violates architecture guide; forbidden per documentation |
| Support both | Increases complexity; architecture guide mandates Fastify exclusively |
| Delay migration | Technical debt accumulation; discrepancy grows over time |

## Non-Negotiables
- Fastify MUST be the only HTTP engine — no Express fallback
- All existing endpoints MUST continue to function identically
- Swagger UI MUST be accessible at `/api/docs`
- All existing tests MUST pass after migration
- No `express` imports anywhere in codebase
