---
name: test-fixtures
description: 'Test fixtures and mocking. Use for test setup.'
---

# Test Fixtures & Mocking

## Mock Creation Pattern

```typescript
// Create mock at top of describe block
const mockRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findPaginated: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Or use jest.Mocked<T> for type safety
let repository: jest.Mocked<DomainRepository>;
```

## Test Data Factories

```typescript
// test/fixtures/domain.fixture.ts
import { Domain } from '@prisma/client';

export class DomainFixture {
  static create(overrides: Partial<Domain> = {}): Domain {
    return {
      id: 'domain-uuid',
      name: 'Test Domain',
      email: 'test@domain.com',
      clinicId: 'clinic-uuid',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      ...overrides,
    };
  }

  static createMany(count: number, overrides: Partial<Domain> = {}): Domain[] {
    return Array.from({ length: count }, (_, i) =>
      this.create({ id: `domain-${i}`, ...overrides })
    );
  }
}
```

## beforeEach Pattern

```typescript
describe('DomainService', () => {
  let service: DomainService;
  let repository: jest.Mocked<DomainRepository>;

  beforeEach(async () => {
    // 1. Create mocks
    const mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };

    // 2. Create module with mocks
    const module = await Test.createTestingModule({
      providers: [DomainService, { provide: DomainRepository, useValue: mockRepository }],
    }).compile();

    // 3. Get instances
    service = module.get(DomainService);
    repository = module.get(DomainRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
```

## Mock Return Values

```typescript
// Single return value
repository.findById.mockResolvedValue(mockDomain);

// Different returns per call
repository.findById.mockResolvedValueOnce(mockDomain1).mockResolvedValueOnce(mockDomain2);

// Reject with error
repository.findById.mockRejectedValue(new Error('DB error'));

// Return null (for not found)
repository.findById.mockResolvedValue(null);
```

## Isolation Rules

| Rule                          | Details                     |
| ----------------------------- | --------------------------- |
| No shared state between tests | Each test is independent    |
| Clear mocks in afterEach      | `jest.clearAllMocks()`      |
| Fresh module per test         | Create in beforeEach        |
| No global variables           | All state in describe scope |

## Type-Safe Mocks

```typescript
import { DomainRepository } from './domain.repository';

// Type-safe mock
const mockRepository: jest.Mocked<DomainRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findPaginated: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as unknown as jest.Mocked<DomainRepository>;
```
