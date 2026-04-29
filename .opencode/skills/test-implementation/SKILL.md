---
name: test-implementation
description: 'Agent test task implementation workflow. Use when: implementing test tasks, writing test code, or verifying test coverage.'
---

# Test Task Implementation

For each test task in dispatch:

## Step 1 — Read QUALITY.md

| Read                  | What                               |
| --------------------- | ---------------------------------- |
| Scenario coverage map | Filter to your QG ref only         |
| Mocking strategy      | Exact approach for each dependency |

---

## Step 2 — Match Test Type

### Unit Tests

Test unit in isolation. All dependencies mocked. No database, no HTTP, no container.

**Test file location:**

```
src/modules/[domain]/[domain].service.spec.ts
```

**Rules:**

- No database (all Prisma/DB calls mocked)
- No HTTP (no supertest, no real controllers)
- No container (use `Test.createTestingModule()`)
- Mock all dependencies
- `beforeEach` for setup (fresh mocks each test)
- `afterEach` for cleanup (`jest.clearAllMocks()`)
- One assertion per test
- Descriptive names: `should [behavior] when [condition]`

**What to test:**

- Create success → Returns entity
- Create validation → Throws on invalid data
- Find by ID success → Returns entity
- Find by ID not found → Throws NotFoundException
- Update success → Returns updated entity
- Delete success → Calls repository
- Business rules → Validates correctly

---

### Controller Unit Tests

Test HTTP routing, decorator application, and service delegation.

**Rules:**

- Mock the service
- Test delegation only (controller passes params to service)
- No Prisma imports
- One test per endpoint
- Verify service called: `expect(service.method).toHaveBeenCalledWith(...)`

**What controller tests verify:**

- Delegation: Controller calls service with correct params
- Return value: Controller returns service result unchanged
- No business logic: Controller does not transform or validate

**What controller tests do NOT verify:**

- Guards → E2E tests
- Decorators → E2E tests
- Swagger → E2E tests or manual doc review
- Route registration → E2E tests

---

### Repository Tests

**WARNING:** Repository tests are typically integration tests (against real DB). Only unit test if mocking is required.

**Test type decision:**

- Integration: Testing actual Prisma queries, transactions, pagination
- Unit: Testing query building logic, conditional where clauses

**Rules:**

- Prefer integration tests
- Use testcontainers or persistent test DB for integration
- Unit test only query logic
- Clean data in `beforeEach`
- Disconnect in `afterAll`: `await prisma.$disconnect()`

---

### Guard Unit Tests

Test authorization logic and ability checks.

**Rules:**

- Mock Reflector (for decorator metadata)
- Mock ExecutionContext (create helper function)
- Test all branches (allow/deny cases)
- Test no decorator case (guard allows when no requirements)
- 100% coverage required (guards are critical security code)

**What to test:**

- Ability satisfied → Returns true
- Ability not satisfied → Returns false
- No decorator present → Returns true (allow by default)
- Multiple abilities → All must be satisfied

---

### Integration Tests

Integration tests with real database via Testcontainers.

**When to use:**

- Repository data access
- Multi-repository transactions
- Database constraint validation
- Pagination and filtering behavior

**Rules:**

- Real database (Testcontainers)
- Isolated test data (clean up in `afterEach`)
- Transaction rollback or truncate tables between tests
- Parallel-safe (use unique test data per test)
- Disconnect after all: `await prisma.$disconnect()` in `afterAll`

**Test file location:**

```
test/integration/[domain].integration.spec.ts
```

---

### E2E Tests

E2E tests for full HTTP lifecycle with authentication.

**When to use:**

- Full request/response lifecycle
- Authentication flow
- Authorization (guards)
- Route registration
- Middleware chain

**Rules:**

- Real HTTP (supertest)
- Real auth tokens or mock auth module
- Real database (use Testcontainers)
- Clean state before/after
- Test from user perspective (assertions on response shape/status)

**Test file location:**

```
test/e2e/[domain].e2e-spec.ts
```

---

### Performance Tests

Performance tests for latency and throughput validation.

**When to use:**

- API latency benchmarks
- Database query performance
- Concurrent request handling
- Load testing (if NFR defined)

**Rules:**

- Only if NFR in SPEC
- Measurable thresholds: "P95 under 200ms" not "should be fast"
- Realistic load (match expected production load pattern)
- Multiple runs (take median of multiple measurements)

**Metrics to capture:**

- Response time: Latency from request to response
- P50 / P95 / P99: Percentile latencies
- Throughput: Requests per second
- Error rate: Percentage of failed requests

---

## Test Type Decision Matrix

| Test Type   | Speed    | Confidence | When to Use                    |
| ----------- | -------- | ---------- | ------------------------------ |
| Unit        | Fast     | Low        | Business logic, delegation     |
| Integration | Medium   | High       | Database queries, transactions |
| E2E         | Slow     | Highest    | Full flows, auth, guards       |
| Performance | Variable | High       | Latency/throughput validation  |

---

## Test Pyramid

| Type        | Proportion | Purpose                 |
| ----------- | ---------- | ----------------------- |
| Unit        | 70%        | Fast feedback, coverage |
| Integration | 20%        | DB correctness          |
| E2E         | 10%        | Critical paths only     |

---

## Step 3 — Implement Scenarios

| Rule                            | Details                      |
| ------------------------------- | ---------------------------- |
| Implement only listed scenarios | From QUALITY.md scenario map |
| Do not add scenarios            | Not listed = not implemented |
| Do not skip scenarios           | Listed = must implement      |

---

## Step 4 — Each Test Must

| Requirement         | Details                                        |
| ------------------- | ---------------------------------------------- |
| One assertion       | Test one thing per test case                   |
| Fully isolated      | No shared state. Use `beforeEach`/`afterEach`  |
| Descriptive name    | `should [expected behavior] when [condition]`  |
| Specific assertions | No `toBeTruthy()` where `toBe(404)` is correct |
| Not vacuous         | Must fail if implementation is broken          |

---

## Step 5 — Scoped Check

```bash
# Run test file you just wrote
jest src/modules/user/user.service.spec.ts

# Coverage for module under test
jest src/modules/user/user.service.spec.ts --coverage --collectCoverageFrom=src/modules/user/user.service.ts
```

Coverage must meet target in QUALITY.md for your scenarios.

---

## Test Naming Convention

```typescript
// Pattern: should [expected behavior] when [condition]
it('should return user when found', async () => { ... });
it('should throw NotFoundException when user not found', async () => { ... });
it('should hash password before saving', async () => { ... });
it('should return paginated results with correct meta', async () => { ... });
```

---

## Mocking Strategy (Unit Tests)

```typescript
// ✅ CORRECT — Mock at provider level
const mockRepository = {
  create: jest.fn(),
  findById: jest.fn(),
};

const module = await Test.createTestingModule({
  providers: [UserService, { provide: UserRepository, useValue: mockRepository }],
}).compile();
```

---

## Hard Rules

| Rule                      | Details                        |
| ------------------------- | ------------------------------ |
| Only QUALITY.md scenarios | Not listed = not implemented   |
| Exact mocking strategy    | Use approach from QUALITY.md   |
| Coverage meets target     | Check QUALITY.md requirements  |
| All tests pass            | Fix failures before proceeding |
| No test skips             | `it.skip` forbidden in commits |

---

## Run Commands

```bash
# Single test file
jest src/modules/user/user.service.spec.ts

# With coverage
jest src/modules/user/user.service.spec.ts --coverage

# Watch mode (development)
jest src/modules/user/user.service.spec.ts --watch
```
